const links = [...document.querySelectorAll('[data-nav]')];
const sections = links.map(link => document.querySelector(link.dataset.nav)).filter(Boolean);
if (sections.length && 'IntersectionObserver' in window) {
  let observer;
  function observeTop() {
    observer?.disconnect();
    observer = new IntersectionObserver(() => {
      const current = sections.find(section => {
        const {top, bottom} = section.getBoundingClientRect();
        return top <= 1 && bottom > 1;
      });
      for (const link of links) {
        if (current && link.dataset.nav === `#${current.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    }, { rootMargin: `0px 0px -${innerHeight - 1}px 0px` });
    sections.forEach(section => observer.observe(section));
  }
  observeTop();
  addEventListener('resize', observeTop, { passive: true });
}
