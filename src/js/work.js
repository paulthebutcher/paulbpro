
const layout = document.querySelector('.work-layout');
if (layout) {
  const heading = layout.querySelector('.work-heading');
  const list = layout.querySelector('.case-list');
  const cards = [...list.querySelectorAll('.case-card')];
  const lastImage = cards.at(-1)?.querySelector('.work-image');
  const counter = layout.querySelector('.work-progress__count');
  const desktop = matchMedia('(min-width: 1200px)');
  const pad = n => String(n).padStart(2, '0');
  let observer;
  let observedTop;
  let observedHeight;

  function updateCounter(top) {
    const index = cards.findLastIndex(card => card.getBoundingClientRect().top <= top);
    counter.textContent = `${pad(Math.max(0, index) + 1)} / ${pad(cards.length)}`;
  }

  function sync() {
    if (!lastImage || !desktop.matches) {
      observer?.disconnect();
      observedTop = undefined;
      layout.style.removeProperty('--work-tail');
      layout.style.removeProperty('--work-last-tail');
      return;
    }
    const tail = list.getBoundingClientRect().bottom - lastImage.getBoundingClientRect().top;
    layout.style.setProperty('--work-tail', `${heading.getBoundingClientRect().height - tail}px`);
    layout.style.setProperty('--work-last-tail', `${tail}px`);

    layout.setAttribute('data-work-ready', '');
    const top = Math.ceil(parseFloat(getComputedStyle(heading).top));
    if (top !== observedTop || innerHeight !== observedHeight) {
      observer?.disconnect();
      observedTop = top;
      observedHeight = innerHeight;
      // The cards include their trailing gaps, so the 1px observation band
      // passes from one card to the next at the next image's leading edge.
      observer = new IntersectionObserver(() => updateCounter(top), {
        rootMargin: `-${top - 1}px 0px -${Math.max(0, innerHeight - top)}px 0px`,
      });
      cards.forEach(card => observer.observe(card));
    }
    updateCounter(top);
  }

  const resize = new ResizeObserver(sync);
  resize.observe(heading);
  resize.observe(list);
  if (lastImage) resize.observe(lastImage);
  desktop.addEventListener('change', sync);
  addEventListener('resize', sync, { passive: true });
  sync();
}
