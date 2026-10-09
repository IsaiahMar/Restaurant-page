import { storage as defaultStorage } from '../lib/storage.js';

// Accounts for a static site with no backend.
//
// Honest scope: everything here runs in the visitor's browser, so a determined
// user can read or edit it. This module exists to model the flow correctly
// (hashed + salted passwords, roles, sessions), not to protect real data. In
// production, accounts and the manager role belong on a server, with hashing
// done server-side (argon2/bcrypt) and sessions in HttpOnly cookies.

const USERS_KEY = 'users';
const SESSION_KEY = 'session';
const ITERATIONS = 100_000;

/** Demo manager account, documented in the README and shown on the login page. */
export const DEMO_MANAGER = Object.freeze({
  name: 'Jean-Claude',
  email: 'manager@jeanclaude.demo',
  password: 'croissant123',
});

export class AuthError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

const toHex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
const normalizeEmail = (email) => String(email).trim().toLowerCase();

export function createAuth(storage = defaultStorage, crypto = globalThis.crypto) {
  async function hashPassword(password, saltHex) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const salt = Uint8Array.from(saltHex.match(/../g), (byte) => parseInt(byte, 16));
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, key, 256);
    return toHex(bits);
  }

  const users = () => storage.get(USERS_KEY, {});

  async function createUser({ name, email, password, role }) {
    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    const record = { name: name.trim(), email: normalizeEmail(email), role, salt, hash: await hashPassword(password, salt) };
    storage.set(USERS_KEY, { ...users(), [record.email]: record });
    return record;
  }

  const publicProfile = ({ name, email, role }) => ({ name, email, role });

  // Constant-time-ish comparison so mismatches don't return early on the first wrong character.
  function sameHash(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  return {
    async ensureDemoManager() {
      if (!users()[DEMO_MANAGER.email]) await createUser({ ...DEMO_MANAGER, role: 'manager' });
    },

    async signUp({ name, email, password }) {
      if (users()[normalizeEmail(email)]) {
        throw new AuthError('An account with that email already exists. Try logging in.', 'email');
      }
      const record = await createUser({ name, email, password, role: 'customer' });
      storage.set(SESSION_KEY, { email: record.email });
      return publicProfile(record);
    },

    async logIn({ email, password }) {
      await this.ensureDemoManager();
      const record = users()[normalizeEmail(email)];
      // Same message whether the email or the password is wrong, so the form
      // doesn't reveal which emails have accounts.
      const failure = new AuthError('That email and password don’t match an account.', 'password');
      if (!record) throw failure;
      if (!sameHash(await hashPassword(password, record.salt), record.hash)) throw failure;
      storage.set(SESSION_KEY, { email: record.email });
      return publicProfile(record);
    },

    logOut() {
      storage.remove(SESSION_KEY);
    },

    currentUser() {
      const session = storage.get(SESSION_KEY, null);
      const record = session && users()[session.email];
      return record ? publicProfile(record) : null;
    },

    isManager() {
      return this.currentUser()?.role === 'manager';
    },
  };
}

export const auth = createAuth();

/**
 * Where to send the user after login. Only same-site relative paths are honored,
 * so `login.html?next=https://evil.example` can't be used as an open redirect.
 */
export function safeNextUrl(next, fallback = 'index.html') {
  return typeof next === 'string' && /^[\w-]+\.html([?#][\w=&%.-]*)?$/.test(next) ? next : fallback;
}
