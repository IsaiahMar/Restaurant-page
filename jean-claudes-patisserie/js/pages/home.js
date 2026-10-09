import { mountLayout } from '../components/layout.js';
import { menuCard } from '../components/menu-card.js';
import { menu } from '../services/menu-repo.js';
import { $ } from '../lib/dom.js';

mountLayout();

const featured = menu.featured().slice(0, 3);
$('#featured-grid').replaceChildren(...featured.map((item) => menuCard(item)));
$('#featured').hidden = featured.length === 0;
