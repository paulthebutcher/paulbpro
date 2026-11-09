// The external script runs in <head> so the waiting state lands before first paint.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  if (!motion.matches || !document.fonts) return;

  const root = document.documentElement;
  root.classList.add('intro');
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const deadline = setTimeout(stop, 1000);

  function stop() {
    clearTimeout(deadline);
    listeners.abort();
    root.classList.remove('intro', 'intro-ready', 'intro-nav');
  }

  motion.addEventListener('change', stop, options);
  document.addEventListener('DOMContentLoaded', async () => {
    const hero = document.querySelector('#hero');
    const header = document.querySelector('.home-nav .nav');
    if (!hero || !header || header.matches(':focus-within')) return stop();
    header.addEventListener('focusin', stop, options);

    try {
      const faces = await Promise.all([
        document.fonts.load('400 1em "ABC Diatype"'),
        document.fonts.load('300 1em "ABC Diatype"')
      ]);
      if (listeners.signal.aborted) return;
      if (!faces.every(group => group.some(face => face.status === 'loaded'))) return stop();
    } catch {
      return stop();
    }

    const lastStat = hero.querySelector('.stat:last-child');
    if (!lastStat || lastStat.matches(':focus-within')) return stop();

    function finish(event) {
      if (event.target === lastStat && event.animationName === 'hero-stat-rule') {
        if (event.type === 'animationcancel') stop();
        else root.classList.add('intro-nav');
      }
      if (event.target === header && event.animationName === 'hero-nav') stop();
    }

    document.addEventListener('animationend', finish, options);
    document.addEventListener('animationcancel', finish, options);
    clearTimeout(deadline);
    root.classList.add('intro-ready');
  }, { ...options, once: true });
})();
