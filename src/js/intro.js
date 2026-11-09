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
    root.classList.remove('intro', 'intro-ready');
  }

  motion.addEventListener('change', stop, options);
  document.addEventListener('DOMContentLoaded', async () => {
    const hero = document.querySelector('#hero');
    if (!hero) return stop();

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
      if (event.target === lastStat && event.animationName === 'hero-stat-rule') stop();
    }

    hero.addEventListener('animationend', finish, options);
    hero.addEventListener('animationcancel', finish, options);
    clearTimeout(deadline);
    root.classList.add('intro-ready');
  }, { ...options, once: true });
})();
