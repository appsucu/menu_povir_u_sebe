'use strict';
const navigationLinks = [...document.querySelectorAll('nav a')];
const categories = [...document.querySelectorAll('main section[id^="category-"]')];
const toolbar = document.querySelector('.toolbar');
function activateCategory(id) {
  for (const link of navigationLinks) {
    if (link.hash === '#' + id) {
      link.setAttribute('aria-current', 'true');
      const nav = link.parentElement;
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      if (linkRect.left < navRect.left || linkRect.right > navRect.right)
        nav.scrollBy({left: linkRect.left < navRect.left ? linkRect.left - navRect.left : linkRect.right - navRect.right, behavior: 'smooth'});
    } else link.removeAttribute('aria-current');
  }
}
activateCategory(categories[0].id);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length) activateCategory(visible[0].target.id);
  }, {rootMargin: '-' + (toolbar.offsetHeight + 10) + 'px 0px -50% 0px', threshold: 0});
  categories.forEach(category => observer.observe(category));
}
navigationLinks.forEach(link => link.addEventListener('click', () => {
  if (searchInput.value !== '') clearSearch(false);
  activateCategory(link.hash.slice(1));
}));

const navScroller = document.querySelector('.nav-scroller');
const navEl = document.querySelector('.toolbar nav');
const navPrev = document.querySelector('.nav-prev');
const navNext = document.querySelector('.nav-next');
function updateNavChevs() {
  navScroller.classList.toggle('is-overflowing', navEl.scrollWidth > navEl.clientWidth + 4);
  navPrev.disabled = navEl.scrollLeft <= 2;
  navNext.disabled = navEl.scrollLeft + navEl.clientWidth >= navEl.scrollWidth - 2;
}
navPrev.addEventListener('click', () => navEl.scrollBy({left: -navEl.clientWidth * 0.6, behavior: 'smooth'}));
navNext.addEventListener('click', () => navEl.scrollBy({left: navEl.clientWidth * 0.6, behavior: 'smooth'}));
navEl.addEventListener('scroll', updateNavChevs, {passive: true});
updateNavChevs();

const searchForm = document.querySelector('.search');
const searchInput = document.querySelector('#menu-search');
const searchClear = document.querySelector('.search-clear');
const searchStatus = document.querySelector('.search-status');
const searchEmpty = document.querySelector('.search-empty');
const searchEmptyQuery = document.querySelector('.search-empty-query');
const searchReset = document.querySelector('.search-reset');
const searchResults = document.querySelector('.search-results');
const searchResultsGrid = document.querySelector('.search-results-grid');
const searchResultsCount = document.querySelector('.search-results-count');

function normalize(s) {
  return s.toLowerCase().replace(/[’ʼ`]/g, "'").replace(/i/g, 'і').replace(/\s+/g, ' ').trim();
}
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function pluralDishes(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'страва';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'страви';
  return 'страв';
}

const dishes = [...document.querySelectorAll('article.dish')].map((el, index) => {
  const h3 = el.querySelector('h3');
  const img = el.querySelector('img');
  const section = el.closest('section');
  const portion = el.querySelector('.portion');
  const note = el.querySelector('.note');
  const detailsText = el.querySelector('details p')?.textContent.trim() || '';
  if (note && note.classList.contains('note-empty') && detailsText) {
    note.textContent = detailsText;
    note.classList.remove('note-empty');
    note.removeAttribute('aria-hidden');
  }
  if (portion) portion.dataset.category = section.querySelector('h2').firstChild.textContent.trim();
  const parts = [
    h3.textContent,
    portion?.textContent || '',
    el.querySelector('.note')?.textContent || '',
    el.querySelector('details p')?.textContent || '',
    img ? img.alt : '',
  ];
  return {
    el,
    section,
    home: el.parentElement,
    index,
    h3,
    title: h3.textContent,
    titleText: normalize(h3.textContent),
    text: normalize(parts.join(' ')),
  };
});

function applySearch(rawQuery) {
  const query = rawQuery.trim();
  const tokens = normalize(query).split(' ').filter(Boolean);
  let count = 0;
  if (tokens.length === 0) {
    for (const dish of dishes) {
      dish.el.hidden = false;
      dish.home.appendChild(dish.el);
    }
    for (const section of categories) section.hidden = false;
    searchResults.hidden = true;
    for (const link of navigationLinks) link.removeAttribute('data-empty');
  } else {
    const phrase = normalize(query);
    const matched = [];
    for (const dish of dishes) {
      const score = dish.titleText.includes(phrase) ? 3
        : tokens.every(token => dish.titleText.includes(token)) ? 2
        : tokens.some(token => dish.titleText.includes(token)) ? 1
        : tokens.every(token => dish.text.includes(token)) ? 0
        : -1;
      dish.el.hidden = score < 0;
      if (score >= 0) matched.push({dish, score});
    }
    matched.sort((a, b) => b.score - a.score || a.dish.index - b.dish.index);
    for (const {dish} of matched) searchResultsGrid.appendChild(dish.el);
    count = matched.length;
    for (const section of categories) section.hidden = true;
    searchResults.hidden = count === 0;
    searchResultsCount.textContent = count;
    const matchedSections = new Set(matched.map(({dish}) => dish.section));
    for (const link of navigationLinks) {
      const section = document.getElementById(link.hash.slice(1));
      link.toggleAttribute('data-empty', !matchedSections.has(section));
    }
  }
  if (tokens.length) {
    const re = new RegExp(tokens.map(escapeRegExp).join('|'), 'gi');
    for (const dish of dishes) {
      let html = '';
      let last = 0;
      for (const m of dish.title.matchAll(re)) {
        html += escapeHtml(dish.title.slice(last, m.index));
        html += '<mark>' + escapeHtml(m[0]) + '</mark>';
        last = m.index + m[0].length;
      }
      html += escapeHtml(dish.title.slice(last));
      dish.h3.innerHTML = html;
    }
  } else {
    for (const dish of dishes) if (dish.h3.childElementCount) dish.h3.textContent = dish.title;
  }
  searchStatus.textContent = query === '' ? '' : (count ? 'Знайдено ' + count + ' ' + pluralDishes(count) : 'Нічого не знайдено');
  searchEmpty.hidden = !(query !== '' && count === 0);
  if (!searchEmpty.hidden) searchEmptyQuery.textContent = query;
  searchClear.hidden = searchInput.value === '';
  document.body.classList.toggle('is-searching', query !== '');
  history.replaceState(null, '', query ? '?q=' + encodeURIComponent(query) : location.pathname);
}

let searchFrame = 0;
searchInput.addEventListener('input', () => {
  cancelAnimationFrame(searchFrame);
  searchFrame = requestAnimationFrame(() => applySearch(searchInput.value));
});
searchForm.addEventListener('submit', e => e.preventDefault());
function clearSearch(focus = true) {
  cancelAnimationFrame(searchFrame);
  searchInput.value = '';
  applySearch('');
  if (focus) searchInput.focus();
}
searchClear.addEventListener('click', clearSearch);
searchReset.addEventListener('click', clearSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (searchInput.value !== '') clearSearch();
    else searchInput.blur();
  }
});
document.addEventListener('keydown', e => {
  const active = document.activeElement;
  const typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  if (typing) return;
  if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

const initialQuery = new URLSearchParams(location.search).get('q');
if (initialQuery) {
  searchInput.value = initialQuery;
  applySearch(initialQuery);
}

function updateStickyOffset() {
  document.documentElement.style.setProperty('--sticky-offset', toolbar.offsetHeight + 'px');
  updateNavChevs();
}
updateStickyOffset();
if ('ResizeObserver' in window) new ResizeObserver(updateStickyOffset).observe(toolbar);

document.querySelector('.pdf-link').addEventListener('click', () => window.print());
