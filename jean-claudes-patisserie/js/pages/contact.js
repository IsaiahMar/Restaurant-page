import { mountLayout } from '../components/layout.js';
import { readForm, showErrors } from '../components/forms.js';
import { toast } from '../components/toast.js';
import { $ } from '../lib/dom.js';
import { storage } from '../lib/storage.js';
import { auth } from '../services/auth.js';
import { validateContact } from '../services/validation.js';

mountLayout();

const form = $('#contact-form');
const user = auth.currentUser();
if (user) {
  form.elements.name.value = user.name;
  form.elements.email.value = user.email;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = readForm(form);
  if (!showErrors(form, validateContact(values))) return;

  // No backend: keep messages locally so the flow is complete end to end.
  storage.set('messages', [{ ...values, sentAt: new Date().toISOString() }, ...storage.get('messages', [])].slice(0, 50));
  form.reset();
  toast('Thanks! We’ll get back to you within a day.');
});
