import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {chromium} from 'playwright-core';
import {serve} from './server.mjs';

const cases=['deadlock','analytics','six-million','ux-practice','shriners'];
const builds=['wcag-engine','foundry','identity-service','idea-factory','growth-audit','stressfreeclaims'];
const levels=JSON.parse(fs.readFileSync('content/site/lead.json','utf8')).levels;
const entries=[
  ...cases.map(name=>({name,group:'cases',box:[590,393]})),
  ...builds.map(name=>({name,group:'builds',box:name==='wcag-engine'?[676,450]:['foundry','identity-service'].includes(name)?[322,322]:[590,393]})),
  ...levels.map(({id})=>({name:id,group:'lead',box:[322,215]})),
].map(entry=>{
  const src=`/img/${entry.group}/${entry.name}.svg`;
  const data=entry.group==='lead'?levels.find(x=>x.id===entry.name):matter(fs.readFileSync(`content/${entry.group}/${entry.name}.md`,'utf8')).data;
  assert.equal(data.image,src);
  assert.ok(data.imageAlt && !/\[gap|\u2014/.test(data.imageAlt),`${entry.name}: complete alt text without em dashes`);
  assert.ok(fs.existsSync(`src/img/_specs/${entry.name}.md`),`${entry.name}: spec`);
  return {...entry,src,source:fs.readFileSync(`src${src}`,'utf8')};
});
assert.equal(entries.length,14);
fs.mkdirSync('.cache/tmp',{recursive:true});process.env.TMPDIR=path.resolve('.cache/tmp');
const server=await serve(4175);
let browser;
const report={drawings:14,surfaces:[],routes:[],staticInteractions:[]};
try{
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1512,height:1000},deviceScaleFactor:2});
  await page.goto('http://127.0.0.1:4175/');
  const errors=await page.evaluate(entries=>{
    const failures=[];
    for(const {name,source,box,group} of entries){
      const xml=new DOMParser().parseFromString(source,'image/svg+xml');
      const root=xml.documentElement;
      const check=(ok,rule)=>{if(!ok)failures.push(`${name}: ${rule}`);};
      check(!xml.querySelector('parsererror'),'valid SVG XML');
      check(root.getAttribute('viewBox')===`0 0 ${box.join(' ')}`,'viewBox');
      check(!root.hasAttribute('width')&&!root.hasAttribute('height'),'fluid root dimensions');
      check(root.getAttribute('aria-hidden')==='true'&&root.getAttribute('focusable')==='false','decorative inner SVG');
      check(root.getAttribute('stroke')==='currentColor'&&root.getAttribute('stroke-width')==='1.5','structural strokes');
      check(root.getAttribute('stroke-linecap')==='round'&&root.getAttribute('stroke-linejoin')==='round','round joins and caps');
      check(!source.includes('#'),'no hex values or reference ids');
      for(const el of [root,...root.querySelectorAll('*')]){
        check(['svg','g','path','rect','circle','line','polyline','ellipse'].includes(el.localName),'only abstract SVG geometry');
        check(!el.hasAttribute('id')&&!el.hasAttribute('style'),'no ids or embedded styles');
        if(el.hasAttribute('fill'))check(['none','var(--placeholder)'].includes(el.getAttribute('fill')),'fill token');
        if(el.hasAttribute('stroke'))check(['currentColor','var(--accent)'].includes(el.getAttribute('stroke')),'stroke token');
        if(el.hasAttribute('stroke-width'))check(el.getAttribute('stroke-width')===(el.matches('path.decision')?'2':'1.5'),'stroke width');
      }
      const accents=root.querySelectorAll('.decision');
      check(accents.length===(group==='lead'?0:1),'decision count');
      for(const accent of accents)check(accent.localName==='path'&&accent.getAttribute('stroke')==='var(--accent)'&&accent.getAttribute('stroke-width')==='2','decision contract');
    }
    return failures;
  },entries);
  assert.deepEqual(errors,[]);

  // The same source must resolve its palette correctly on either surface.
  const css=fs.readFileSync('dist/css/main.css','utf8');
  for(const surface of ['on-pine','on-alabaster']){
    await page.setContent(`<style>${css}</style><section class="${surface}"><i style="color:var(--accent)"></i>${entries.map(x=>`<figure class="diagram">${x.source}</figure>`).join('')}</section>`);
    const palette=await page.evaluate(()=>{
      const section=document.querySelector('section');
      const fg=getComputedStyle(section).color,accent=getComputedStyle(section.querySelector('i')).color;
      return [...document.querySelectorAll('.diagram>svg')].map(svg=>({
        root:getComputedStyle(svg).stroke===fg,
        decision:[...svg.querySelectorAll('.decision')].every(p=>getComputedStyle(p).stroke===accent&&getComputedStyle(p).strokeWidth==='2px'),
      }));
    });
    assert.ok(palette.every(x=>x.root&&x.decision),`${surface}: token inheritance`);
    report.surfaces.push({surface,passed:14});
  }

  const routes=['/',...cases.map(x=>`/work/${x}/`),...builds.map(x=>`/build/${x}/`)];
  const axe=fs.readFileSync('node_modules/axe-core/axe.min.js','utf8');
  for(const mode of [{name:'desktop',width:1512,hasTouch:false},{name:'touch',width:390,hasTouch:true}]){
    const context=await browser.newContext({viewport:{width:mode.width,height:1000},hasTouch:mode.hasTouch,isMobile:mode.hasTouch,reducedMotion:'no-preference'});
    const current=await context.newPage();
    for(const route of routes){
      assert.equal((await current.goto('http://127.0.0.1:4175'+route)).status(),200);
      await current.evaluate(()=>document.fonts.ready);
      assert.equal(await current.locator('.placeholder').count(),0,`${route}: placeholders`);
      assert.equal(await current.locator('img[src$=".svg"]').count(),0,`${route}: inline drawings`);
      const drawings=await current.locator('.diagram').evaluateAll(figures=>figures.map(figure=>{
        const svg=figure.querySelector('svg'),box=svg.viewBox.baseVal,bounds=svg.getBoundingClientRect();
        const staticElements=[figure,svg,...svg.querySelectorAll('*')];
        if(figure.parentElement.matches('.lead-art,.work-image'))staticElements.push(figure.parentElement);
        const swatch = document.createElement('span');
        swatch.hidden = true;
        swatch.style.color = 'var(--accent)';
        figure.append(swatch);
        const accent = getComputedStyle(swatch).color;
        swatch.remove();
        const decision = [...svg.querySelectorAll('path.decision')].every(path => {
          const style = getComputedStyle(path);
          return style.stroke === accent && style.strokeWidth === '2px' && style.fill === 'none';
        });
        return {alt:!!figure.getAttribute('aria-label'),decision,ratio:Math.abs(bounds.width/bounds.height-box.width/box.height)<0.001,
          static:staticElements.every(el=>getComputedStyle(el).animationName==='none'&&el.getAnimations().length===0)};
      }));
      assert.ok(drawings.length&&drawings.every(x=>x.alt&&x.ratio&&x.static&&x.decision),`${mode.name} ${route}: alt, aspect ratio, accent and static artwork`);
      if(route!=='/'){
        await current.addScriptTag({content:axe});
        const violations=await current.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>r.violations.map(x=>x.id)));
        assert.deepEqual(violations,[],`${mode.name} ${route}: axe`);
      }
      report.routes.push({mode:mode.name,route,drawings:drawings.length,passed:true});
    }
    await current.goto('http://127.0.0.1:4175/');
    for(const card of await current.locator('.case-card a,.build-tile a').all()){
      const decision = card.locator('path.decision');
      const stroke = () => decision.evaluate(path => {
        const style = getComputedStyle(path);
        return {color:style.stroke,width:style.strokeWidth,fill:style.fill,dash:style.strokeDasharray,
          animation:style.animationName,offset:style.strokeDashoffset,animations:path.getAnimations().length};
      });
      const rest = await stroke();
      assert.equal(rest.animation,'none');
      assert.equal(rest.offset,'0px');
      assert.equal(rest.animations,0);
      if(!mode.hasTouch){
        await card.hover();
        assert.deepEqual(await stroke(),rest,'Hover preserves the decision stroke');
      }
      await card.focus();
      assert.deepEqual(await stroke(),rest,'Focus preserves the decision stroke');
    }
    await current.emulateMedia({reducedMotion:'reduce'});
    assert.ok(await current.locator('.diagram svg').evaluateAll(svgs=>svgs.every(svg=>svg.getAnimations({subtree:true}).length===0)));
    report.staticInteractions.push({mode:mode.name,hover:!mode.hasTouch,focus:true,reducedMotion:true});
    await context.close();
  }
  fs.writeFileSync('reference/drawing-checks.json',JSON.stringify(report,null,2)+'\n');
  console.log('14 SVG contracts; both palettes; all 11 detail pages; desktop/touch, focus, hover and reduced motion passed.');
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
