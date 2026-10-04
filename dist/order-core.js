'use strict';
/* Shared by index.html (menu.js) and order.html (order.js).
   State lives in localStorage only: no backend, no cookies, no analytics. */
const KEY = 'povirusebe:order';
const DETAILS_KEY = 'povirusebe:order-details';
const WA_PHONE = '380977339855'; // TEST number; production: 380964443936
const MAX_QTY = 999;

function readJSON(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (e) {
    return {};
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable (e.g. Safari private mode): the order still works in memory */
  }
}

function clampQty(value) {
  return Number.isFinite(value) ? Math.max(0, Math.min(MAX_QTY, Math.floor(value))) : 0;
}

/* { "Dish label": {qty, price, desc} } — price is the number read from the menu DOM when
   the dish was added, desc is the text used in the message and on the review page. */
function readOrder() {
  const raw = readJSON(KEY);
  const order = {};
  for (const label of Object.keys(raw)) {
    const item = raw[label];
    const qty = item && Number(item.qty);
    const price = item && Number(item.price);
    if (Number.isInteger(qty) && qty > 0 && Number.isFinite(price) && price >= 0) {
      order[label] = {qty: Math.min(qty, MAX_QTY), price, desc: String(item.desc || label)};
    }
  }
  return order;
}

function writeOrder(order) {
  const data = {};
  for (const label of Object.keys(order)) {
    if (order[label].qty > 0) data[label] = order[label];
  }
  writeJSON(KEY, data);
}

function formatUAH(value, separator) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, separator || '\u00a0');
}

function orderTotal(order) {
  return Object.keys(order).reduce((sum, label) => sum + order[label].qty * order[label].price, 0);
}

function buildMessage(order, details) {
  const intro = 'Вітаю! Хочу замовити кейтеринг.';
  const labels = Object.keys(order);
  const d = details || {};
  const extra = ['Дата події: ' + (d.date || ''), 'Кількість гостей: ' + (d.guests || '')];
  if (d.comment) extra.push('Коментар: ' + d.comment);
  if (!labels.length) return [intro, ''].concat(extra).join('\n');
  const rows = labels.map((label, i) => {
    const item = order[label];
    return (i + 1) + '. ' + item.desc + ' — ' + item.qty + ' × ' + formatUAH(item.price, ' ') +
      ' грн = ' + formatUAH(item.qty * item.price, ' ') + ' грн';
  });
  return [intro, '', 'Замовлення:'].concat(rows,
    ['', 'Разом: ' + formatUAH(orderTotal(order), ' ') + ' грн', ''], extra).join('\n');
}

function whatsappUrl(message) {
  return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(message);
}
