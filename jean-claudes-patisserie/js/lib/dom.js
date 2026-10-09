// Minimal element builder.
//
// Strings passed as children become text nodes, never HTML, so content that came
// from a user (an admin-entered menu item, a customer's name) cannot inject markup.
// That is the reason the app has no `innerHTML` with dynamic data anywhere.

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;

    if (key === 'class') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key in el && typeof value !== 'string') el[key] = value;
    else el.setAttribute(key, value === true ? '' : value);
  }

  el.append(...children.flat().filter((child) => child !== null && child !== undefined && child !== false));
  return el;
}

export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $$(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}
