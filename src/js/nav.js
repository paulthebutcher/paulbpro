const links=[...document.querySelectorAll('[data-nav]')];
const sections=links.map(link=>document.querySelector(link.dataset.nav)).filter(Boolean);
if(sections.length && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting){
      links.forEach(link=>{if(link.dataset.nav===`#${entry.target.id}`) link.setAttribute('aria-current','true'); else link.removeAttribute('aria-current');});
    }
  },{rootMargin:'-15% 0px -55% 0px',threshold:0});
  sections.forEach(section=>observer.observe(section));
}
