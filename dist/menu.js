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
