// Thin JSON wrapper over Web Storage.
//
// - Keys are namespaced so this app never collides with others on the same origin.
// - Every access is guarded: private browsing, disabled storage and quota errors
//   degrade to "no persistence" instead of crashing the page.
// - The backend is injectable, which is what lets the services be unit-tested in Node.

const PREFIX = 'jcp:';

export function memoryBackend() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

function defaultBackend() {
  try {
    return globalThis.localStorage ?? memoryBackend();
  } catch {
    return memoryBackend();
  }
}

export function createStorage(backend = defaultBackend()) {
  return {
    get(key, fallback = null) {
      try {
        const raw = backend.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        backend.setItem(PREFIX + key, JSON.stringify(value));
      } catch {
        // Storage full or unavailable: the in-memory state still works for this page view.
      }
    },
    remove(key) {
      try {
        backend.removeItem(PREFIX + key);
      } catch {
        // Nothing to clean up if storage is unavailable.
      }
    },
    /** Full key as written to the backend, for matching `storage` events. */
    keyFor: (key) => PREFIX + key,
  };
}

export const storage = createStorage();
