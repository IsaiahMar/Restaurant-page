import { SEED_MENU } from '../data/menu.js';
import { storage as defaultStorage } from '../lib/storage.js';

// The manager's edits are stored as a full copy of the menu under a versioned key.
// Bumping the version (e.g. after changing the seed's shape) discards stale copies
// instead of rendering a half-migrated menu.
const KEY = 'menu:v1';

export function slugify(text) {
  return String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

export function createMenuRepository(storage = defaultStorage, seed = SEED_MENU) {
  const load = () => storage.get(KEY, null) ?? structuredClone(seed);
  const save = (items) => storage.set(KEY, items);

  return {
    all: () => load(),

    byId: (id) => load().find((item) => item.id === id) ?? null,

    byCategory(categoryId) {
      return load().filter((item) => item.category === categoryId);
    },

    featured: () => load().filter((item) => item.featured),

    /** Adds an item and returns its generated id (unique even if names collide). */
    add(fields) {
      const items = load();
      const base = slugify(fields.name);
      let id = base;
      for (let n = 2; items.some((item) => item.id === id); n++) id = `${base}-${n}`;
      save([...items, { ...fields, id }]);
      return id;
    },

    update(id, patch) {
      const items = load();
      if (!items.some((item) => item.id === id)) return false;
      save(items.map((item) => (item.id === id ? { ...item, ...patch, id } : item)));
      return true;
    },

    remove(id) {
      const items = load();
      const next = items.filter((item) => item.id !== id);
      if (next.length === items.length) return false;
      save(next);
      return true;
    },

    isCustomized: () => storage.get(KEY, null) !== null,

    reset: () => storage.remove(KEY),
  };
}

export const menu = createMenuRepository();
