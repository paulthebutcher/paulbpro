const stage=document.querySelector('.lead-stage');
if(stage){
  const pin=stage.querySelector('.lead-stage__pin');
  const nav=stage.querySelector('.lead-stage__labels');
  const buttons=[...nav.querySelectorAll('button')];
  const panels=[...stage.querySelectorAll('.lead-level')];
  const query=matchMedia('(min-width:1200px) and (min-height:720px) and (prefers-reduced-motion:no-preference)');
  let enabled=false,active=-1,frame=0,timer;
  function select(index){
    if(index===active) return;
    if(panels[active]?.contains(document.activeElement)) buttons[index].focus({preventScroll:true});
    active=index;
    panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.toggleAttribute('data-active',i===index);});
    buttons.forEach((button,i)=>{button.setAttribute('aria-expanded',String(i===index));button.tabIndex=i===index?0:-1;});
  }
  function scrollIndex(){
    const rect=stage.getBoundingClientRect();
    const runway=rect.height-pin.getBoundingClientRect().height;
    const progress=runway>0?Math.max(0,Math.min(1,-rect.top/runway)):0;
    return Math.min(buttons.length-1,Math.floor(progress*buttons.length));
  }
  function update(){
    frame=0;
    if(enabled) select(scrollIndex());
  }
  function setup(){
    const shouldPin=query.matches && parseFloat(getComputedStyle(document.documentElement).fontSize)<=20;
    if(shouldPin===enabled){
      if(enabled) select(scrollIndex());
      return;
    }
    enabled=shouldPin;
    stage.classList.toggle('lead-stage--pinned',enabled);
    nav.hidden=!enabled;
    if(enabled){
      select(scrollIndex());
      return;
    }
    active=-1;
    panels.forEach(panel=>{panel.hidden=false;panel.removeAttribute('data-active');});
    buttons.forEach((button,i)=>{button.setAttribute('aria-expanded','false');button.tabIndex=i===0?0:-1;});
  }
  function scheduleSetup(){
    clearTimeout(timer);
    timer=setTimeout(setup,80);
  }
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>{
      if(!enabled) return;
      const rect=stage.getBoundingClientRect();
      const runway=rect.height-pin.getBoundingClientRect().height;
      scrollTo({top:scrollY+rect.top+(index/buttons.length)*runway+1,behavior:'smooth'});
    });
    button.addEventListener('keydown',event=>{
      let next=index;
      if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%buttons.length;
      else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+buttons.length)%buttons.length;
      else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;
      event.preventDefault();buttons.forEach((b,i)=>b.tabIndex=i===next?0:-1);buttons[next].focus({preventScroll:true});
    });
  });
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
  query.addEventListener('change',scheduleSetup);
  const resizeObserver=new ResizeObserver(scheduleSetup);
  resizeObserver.observe(stage);
  // The pin's content box changes when its rem-based padding follows text zoom.
  resizeObserver.observe(pin);
  setup();
}
