const motion = matchMedia('(prefers-reduced-motion: no-preference)');

if (motion.matches && 'IntersectionObserver' in window && Element.prototype.getAnimations) {
  document.documentElement.classList.add('reveal-ready');

  const tracked = new Set();
  const card = '.case-card, .build-tile';
  const observer = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting || target.dataset.revealState !== 'waiting') continue;
      observer.unobserve(target);

      if (target.dataset.revealKind === 'heading' && matchesAuthoredLines(target)) {
        target.dataset.revealKind = 'lines';
      }
      target.dataset.revealState = 'playing';

      requestAnimationFrame(() => {
        const animations = target.getAnimations({subtree: true}).filter(({animationName}) =>
          animationName === 'settle' || animationName?.startsWith('text-')
        );
        Promise.allSettled(animations.map(animation => animation.finished)).then(() => finish(target));
      });
    }
  }, {rootMargin: '0px 0px -16px'});

  function matchesAuthoredLines(heading) {
    const lineBreak = heading.querySelector('.br-desktop');
    if (lineBreak && getComputedStyle(lineBreak).display === 'none') return false;

    const range = document.createRange();
    let previousTop = -Infinity;
    for (const line of heading.querySelectorAll('.heading-line')) {
      range.selectNodeContents(line);
      const rects = range.getClientRects();
      if (rects.length !== 1 || rects[0].top <= previousTop) return false;
      previousTop = rects[0].top;
    }
    return true;
  }

  function finish(target) {
    observer.unobserve(target);
    tracked.delete(target);
    delete target.dataset.revealKind;
    delete target.dataset.revealState;
  }

  function track(selector, kind) {
    for (const target of document.querySelectorAll(selector)) {
      if (target.matches(':focus-within') || target.closest(card)?.matches(':focus-within')) continue;
      if (target.getBoundingClientRect().bottom <= 0) continue;
      tracked.add(target);
      target.dataset.revealKind = kind;
      target.dataset.revealState = 'waiting';
      observer.observe(target);
    }
  }

  track(':is(.display, .display2):not(#hero *, .lead-closing *)', 'heading');
  track('p.intro:not(#hero *, .lead-closing *), .principles > div, .case-card h3, .build-tile h3, .case-card > p, .build-tile > p', 'settle');
  track(':is(.mono, .monoSmall):not(.nav *, #hero *, .case-card > p, .build-tile > p)', 'label');
  track('.lead-closing', 'closing');

  document.addEventListener('focusin', ({target}) => {
    const group = target.closest(card);
    if (group) group.querySelectorAll('[data-reveal-state]').forEach(finish);

    const reveal = target.closest('[data-reveal-state]');
    if (reveal) finish(reveal);
  });

  motion.addEventListener('change', () => {
    document.documentElement.classList.remove('reveal-ready');
    tracked.forEach(finish);
    observer.disconnect();
  }, {once: true});
}
