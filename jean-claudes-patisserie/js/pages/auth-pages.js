import { mountLayout } from '../components/layout.js';
import { readForm, showErrors, withBusy } from '../components/forms.js';
import { toast } from '../components/toast.js';
import { $ } from '../lib/dom.js';
import { auth, AuthError, DEMO_MANAGER, safeNextUrl } from '../services/auth.js';
import { validateLogIn, validateSignUp } from '../services/validation.js';

// Shared by login.html and signup.html; the page's data-page picks the behavior.

mountLayout();

const mode = document.body.dataset.page; // 'login' | 'signup'
const form = $('#auth-form');
const next = safeNextUrl(new URLSearchParams(location.search).get('next'), mode === 'login' ? 'index.html' : 'menu.html');

// Carry ?next= across the "log in" / "create an account" switch links.
for (const link of document.querySelectorAll('[data-keep-next]')) {
  link.href = `${link.getAttribute('href')}?next=${encodeURIComponent(next)}`;
}

$('#demo-fill')?.addEventListener('click', () => {
  form.elements.email.value = DEMO_MANAGER.email;
  form.elements.password.value = DEMO_MANAGER.password;
  form.requestSubmit();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = readForm(form);
  const errors = mode === 'login' ? validateLogIn(values) : validateSignUp(values);
  if (!showErrors(form, errors)) return;

  await withBusy(form.querySelector('[type=submit]'), async () => {
    try {
      const user = mode === 'login' ? await auth.logIn(values) : await auth.signUp(values);
      toast(mode === 'login' ? `Welcome back, ${user.name.split(' ')[0]}.` : `Welcome, ${user.name.split(' ')[0]}! Your account is ready.`);
      // A manager logging in without a specific destination lands on the dashboard.
      const destination = user.role === 'manager' && !new URLSearchParams(location.search).has('next') ? 'admin.html' : next;
      setTimeout(() => location.assign(destination), 600);
    } catch (error) {
      if (!(error instanceof AuthError)) throw error;
      showErrors(form, { [error.field]: error.message });
    }
  });
});
