'use strict';
const navigationLinks = [...document.querySelectorAll('nav a')];
const categories = [...document.querySelectorAll('main section')];
function activateCategory(id) {
  for (const link of navigationLinks) {
    if (link.hash === '#' + id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}
activateCategory(categories[0].id);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) activateCategory(visible[0].target.id);
  }, {rootMargin: '-90px 0px -50% 0px', threshold: 0});
  categories.forEach(category => observer.observe(category));
}
navigationLinks.forEach(link => link.addEventListener('click', () => activateCategory(link.hash.slice(1))));

/* Order builder: quantity per dish, sent to WhatsApp.
   Prices and names are read from the rendered DOM; state lives in localStorage only. */
const KEY = 'povirusebe:order';
const WA_PHONE = '38096443936';
const MAX_QTY = 999;

const storage = {
  read() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (e) {
      return {};
    }
  },
  write(value) {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable (e.g. Safari private mode): the order still works in memory */
    }
  }
};

function parsePrice(text) {
  const match = text.replace(/\u00a0/g, '').match(/\d[\d\s]*/);
  return match ? parseInt(match[0].replace(/\s/g, ''), 10) : NaN;
}

function formatUAH(value, separator) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, separator || '\u00a0');
}

const dishes = [...document.querySelectorAll('.dish')].map(card => {
  const name = card.querySelector('h3').textContent.trim().replace(/\s+/g, ' ');
  const portion = card.querySelector('.portion').textContent.trim().replace(/\s+/g, ' ');
  const priceEl = card.querySelector('.price');
  return {card, name, portion, priceEl, price: parsePrice(priceEl.textContent)};
}).filter(dish => Number.isFinite(dish.price));

/* Same product at several volumes (e.g. Вода солар) needs a unique key and label. */
const nameCount = {};
dishes.forEach(dish => { nameCount[dish.name] = (nameCount[dish.name] || 0) + 1; });
dishes.forEach(dish => {
  dish.label = nameCount[dish.name] > 1 ? dish.name + ' (' + dish.portion + ')' : dish.name;
  dish.qty = 0;
});

const saved = storage.read();
dishes.forEach(dish => {
  const qty = Number(saved[dish.label]);
  if (Number.isInteger(qty) && qty > 0) dish.qty = Math.min(qty, MAX_QTY);
});

const orderLinks = [...document.querySelectorAll('.order-cta')];

const bar = document.createElement('section');
bar.className = 'order-bar';
bar.setAttribute('aria-label', 'Ваше замовлення');
bar.hidden = true;
bar.innerHTML =
  '<div class="order-bar-inner">' +
  '<p class="order-summary" aria-live="polite" aria-atomic="true">' +
  '<span class="order-count"></span><strong class="order-total"></strong></p>' +
  '<div class="order-bar-actions">' +
  '<button type="button" class="order-clear">Очистити</button>' +
  '<a class="order-cta" href="#" target="_blank" rel="noopener">Надіслати замовлення у WhatsApp</a>' +
  '</div></div>';
document.body.appendChild(bar);
const countEl = bar.querySelector('.order-count');
const totalEl = bar.querySelector('.order-total');
orderLinks.push(bar.querySelector('.order-cta'));

function pluralPositions(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'позиція';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'позиції';
  return 'позицій';
}

function orderState() {
  const lines = dishes.filter(dish => dish.qty > 0);
  const total = lines.reduce((sum, dish) => sum + dish.qty * dish.price, 0);
  return {lines, total};
}

function buildMessage(state) {
  const intro = 'Вітаю! Хочу замовити кейтеринг.';
  if (!state.lines.length) return intro;
  const rows = state.lines.map((dish, i) =>
    (i + 1) + '. ' + dish.label + (nameCount[dish.name] > 1 ? '' : ' (' + dish.portion + ')') +
    ' — ' + dish.qty + ' × ' + formatUAH(dish.price, ' ') + ' грн = ' +
    formatUAH(dish.qty * dish.price, ' ') + ' грн');
  return [intro, '', 'Замовлення:'].concat(rows, ['', 'Разом: ' + formatUAH(state.total, ' ') + ' грн', '',
    'Дата події: ', 'Кількість гостей: ']).join('\n');
}

function render() {
  const state = orderState();
  const href = 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(buildMessage(state));
  orderLinks.forEach(link => { link.href = href; });
  bar.hidden = state.lines.length === 0;
  document.body.classList.toggle('has-order', state.lines.length > 0);
  countEl.textContent = 'У замовленні: ' + state.lines.length + ' ' + pluralPositions(state.lines.length);
  totalEl.textContent = 'Разом ' + formatUAH(state.total) + '\u00a0грн';
  for (const dish of dishes) {
    dish.input.value = dish.qty;
    dish.minus.disabled = dish.qty === 0;
    dish.plus.disabled = dish.qty >= MAX_QTY;
    dish.card.classList.toggle('in-order', dish.qty > 0);
    dish.flag.hidden = dish.qty === 0;
  }
}

function persist() {
  const data = {};
  dishes.forEach(dish => { if (dish.qty > 0) data[dish.label] = dish.qty; });
  storage.write(data);
}

function setQty(dish, value) {
  const qty = Number.isFinite(value) ? Math.max(0, Math.min(MAX_QTY, Math.floor(value))) : 0;
  dish.qty = qty;
  persist();
  render();
}

dishes.forEach(dish => {
  const row = document.createElement('div');
  row.className = 'price-row';
  dish.priceEl.replaceWith(row);
  row.appendChild(dish.priceEl);

  const group = document.createElement('div');
  group.className = 'qty';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Кількість: ' + dish.label);
  group.innerHTML =
    '<button type="button">\u2212</button>' +
    '<input type="number" min="0" max="' + MAX_QTY + '" step="1" inputmode="numeric">' +
    '<button type="button">+</button>';
  [dish.minus, dish.input, dish.plus] = [group.children[0], group.children[1], group.children[2]];
  dish.minus.setAttribute('aria-label', 'Зменшити: ' + dish.label);
  dish.plus.setAttribute('aria-label', 'Збільшити: ' + dish.label);
  dish.input.setAttribute('aria-label', 'Кількість: ' + dish.label);
  dish.minus.addEventListener('click', () => setQty(dish, dish.qty - 1));
  dish.plus.addEventListener('click', () => setQty(dish, dish.qty + 1));
  dish.input.addEventListener('change', () => setQty(dish, parseInt(dish.input.value, 10)));
  row.appendChild(group);

  dish.flag = document.createElement('span');
  dish.flag.className = 'in-order-flag';
  dish.flag.textContent = 'У замовленні';
  dish.flag.hidden = true;
  dish.card.appendChild(dish.flag);
});

bar.querySelector('.order-clear').addEventListener('click', () => {
  dishes.forEach(dish => { dish.qty = 0; });
  persist();
  render();
});

render();
