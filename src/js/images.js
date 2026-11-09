for(const card of document.querySelectorAll('.case-card')){
  const path=card.querySelector('.decision');
  if(path && typeof path.getTotalLength==='function'){
    path.style.setProperty('--len',path.getTotalLength());
    card.classList.add('draw-ready');
  }
}
