'use strict';
/* Order review page. Reads the basket saved by the menu page (see order-core.js). */
let order = readOrder();
const details = Object.assign({date: '', guests: '', comment: ''}, readJSON(DETAILS_KEY));

const $ = id => document.getElementById(id);
const emptyBox = $('order-empty');
const content = $('order-content');
const list = $('order-lines');
const countEl = $('order-count');
const totalEl = $('order-total');
const preview = $('message-preview');
const sendLink = $('order-send');
const dateInput = $('detail-date');
const guestsInput = $('detail-guests');
const commentInput = $('detail-comment');

function plural(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'позиція';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'позиції';
  return 'позицій';
}

function messageDetails() {
  const [y, m, d] = details.date.split('-');
  return {
    date: y && m && d ? d + '.' + m + '.' + y : '',
    guests: details.guests,
    comment: details.comment.trim()
  };
}

const rows = {};

function refresh() {
  const labels = Object.keys(order);
  const message = buildMessage(order, messageDetails());
  emptyBox.hidden = labels.length > 0;
  content.hidden = labels.length === 0;
  countEl.textContent = 'Разом: ' + labels.length + ' ' + plural(labels.length);
  totalEl.textContent = formatUAH(orderTotal(order)) + '\u00a0грн';
  preview.value = message;
  sendLink.href = whatsappUrl(message);
  for (const label of labels) {
    const item = order[label], row = rows[label];
    row.input.value = item.qty;
    row.plus.disabled = item.qty >= MAX_QTY;
    row.sum.textContent = item.qty + ' × ' + formatUAH(item.price) + '\u00a0грн = ' +
      formatUAH(item.qty * item.price) + '\u00a0грн';
  }
}

function removeLabel(label) {
  const row = rows[label];
  const next = row.li.nextElementSibling || row.li.previousElementSibling;
  row.li.remove();
  delete rows[label];
  delete order[label];
  writeOrder(order);
  refresh();
  const target = next && next.querySelector('input');
  (target || $('order-title')).focus();
}

function setQty(label, value) {
  const qty = clampQty(value);
  if (qty === 0) return removeLabel(label);
  order[label].qty = qty;
  writeOrder(order);
  refresh();
}

function buildRow(label) {
  const item = order[label];
  const li = document.createElement('li');
  li.className = 'order-line';
  const info = document.createElement('div');
  info.className = 'order-line-info';
  const name = document.createElement('span');
  name.className = 'order-line-name';
  name.textContent = item.desc;
  const sum = document.createElement('span');
  sum.className = 'order-line-sum';
  info.append(name, sum);

  const controls = document.createElement('div');
  controls.className = 'order-line-controls';
  const group = document.createElement('div');
  group.className = 'qty';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Кількість: ' + label);
  group.innerHTML =
    '<button type="button">\u2212</button>' +
    '<input type="number" min="0" max="' + MAX_QTY + '" step="1" inputmode="numeric">' +
    '<button type="button">+</button>';
  const [minus, input, plus] = [group.children[0], group.children[1], group.children[2]];
  minus.setAttribute('aria-label', 'Зменшити: ' + label + ' (при 1 — прибрати)');
  plus.setAttribute('aria-label', 'Збільшити: ' + label);
  input.setAttribute('aria-label', 'Кількість: ' + label);
  minus.addEventListener('click', () => setQty(label, order[label].qty - 1));
  plus.addEventListener('click', () => setQty(label, order[label].qty + 1));
  input.addEventListener('change', () => setQty(label, parseInt(input.value, 10)));

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn-link';
  remove.textContent = 'Прибрати';
  remove.setAttribute('aria-label', 'Прибрати зі замовлення: ' + label);
  remove.addEventListener('click', () => removeLabel(label));
  controls.append(group, remove);

  li.append(info, controls);
  rows[label] = {li, sum, input, minus, plus};
  return li;
}

Object.keys(order).forEach(label => list.appendChild(buildRow(label)));

dateInput.value = details.date;
guestsInput.value = details.guests;
commentInput.value = details.comment;
function saveDetails() {
  details.date = dateInput.value;
  details.guests = guestsInput.value;
  details.comment = commentInput.value;
  writeJSON(DETAILS_KEY, details);
  refresh();
}
[dateInput, guestsInput, commentInput].forEach(el => el.addEventListener('input', saveDetails));

$('order-clear').addEventListener('click', () => {
  Object.keys(order).forEach(label => { rows[label].li.remove(); delete rows[label]; delete order[label]; });
  writeOrder(order);
  refresh();
  $('order-title').focus();
});

refresh();
