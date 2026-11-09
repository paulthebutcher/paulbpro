// Homepage load sequence. Loaded as a blocking classic script from <head> so the
// .intro class lands before first paint. External (not inline) so the CSP can
// stay script-src 'self' with no hash to keep in sync.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  if (!motion.matches) return;
  const root = document.documentElement;
  root.classList.add('intro');
  const stop = () => root.classList.remove('intro', 'intro-ready');
  const parsed = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, {once: true}));
  Promise.race([
    parsed.then(() => document.fonts?.ready),
    new Promise(resolve => setTimeout(resolve, 300))
  ]).then(() => {
    if (!root.classList.contains('intro')) return;
    root.classList.add('intro-ready');
    // Clear the opt-in after the CSS finishes so focus cannot restart a step.
    setTimeout(stop, 1530);
  });
  motion.addEventListener('change', stop, {once: true});
})();
