import { h } from '../lib/dom.js';

export function readForm(form) {
  return Object.fromEntries(new FormData(form));
}

/**
 * Renders validation errors inline and wires them up for assistive tech
 * (aria-invalid + aria-describedby). Focuses the first invalid field.
 * @returns {boolean} true when there are no errors
 */
export function showErrors(form, errors) {
  for (const el of form.querySelectorAll('.field-error')) el.remove();
  for (const field of form.querySelectorAll('[aria-invalid]')) {
    field.removeAttribute('aria-invalid');
    const describedBy = (field.getAttribute('aria-describedby') ?? '').split(' ').filter((id) => !id.endsWith('-error'));
    if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' '));
    else field.removeAttribute('aria-describedby');
  }

  let first = null;
  for (const [name, message] of Object.entries(errors)) {
    const field = form.elements.namedItem(name);
    if (!field || field instanceof RadioNodeList) continue;
    const errorId = `${field.id || name}-error`;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), errorId].filter(Boolean).join(' '));
    field.closest('.field')?.append(h('p', { class: 'field-error', id: errorId }, message));
    first ??= field;
  }

  first?.focus();

  // Once the user starts fixing a field, its stale error goes away.
  if (!form.dataset.clearsErrors) {
    form.dataset.clearsErrors = 'true';
    form.addEventListener('input', ({ target }) => {
      if (target.getAttribute('aria-invalid') !== 'true') return;
      const errorId = `${target.id || target.name}-error`;
      target.removeAttribute('aria-invalid');
      document.getElementById(errorId)?.remove();
      const describedBy = (target.getAttribute('aria-describedby') ?? '').split(' ').filter((id) => id && id !== errorId);
      if (describedBy.length) target.setAttribute('aria-describedby', describedBy.join(' '));
      else target.removeAttribute('aria-describedby');
    });
  }

  return first === null;
}

/** Disables a submit button while an async action runs, so it can't be double-submitted. */
export async function withBusy(button, task) {
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  try {
    return await task();
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}
