import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {serve} from './server.mjs';
const mode=process.argv[2]||'a11y';
const root=path.resolve('.');
fs.mkdirSync('.cache/tmp',{recursive:true});process.env.TMPDIR=path.resolve('.cache/tmp');
fs.mkdirSync('reference/screenshots',{recursive:true});
const executablePath=process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const server=await serve();
const base='http://127.0.0.1:4173';
let browser;
try{
 if(mode==='lighthouse'){
  const {default:lighthouse}=await import('lighthouse');
  const chromeLauncher=await import('chrome-launcher');
  fs.mkdirSync('.cache/lighthouse-chrome',{recursive:true});
  const chrome=await chromeLauncher.launch({chromePath:executablePath,chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage'],userDataDir:path.join(root,'.cache/lighthouse-chrome')});
  try{
   const results=[];
   for(const route of ['/','/work/deadlock/']){
    const result=await lighthouse(base+route,{port:chrome.port,output:['json','html'],onlyCategories:['performance','accessibility','best-practices'],logLevel:'error'});
    const key=route==='/'?'home':'deadlock';
    fs.writeFileSync(`reference/lighthouse-${key}.json`,result.report[0]);fs.writeFileSync(`reference/lighthouse-${key}.html`,result.report[1]);
    const scores=Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,v.score]));results.push({route,...scores});
    console.log(route,scores);
    assert.equal(scores.accessibility,1,'Accessibility must be 100');assert.ok(scores['best-practices']>=.95,'Best practices must be >=95');assert.ok(scores.performance>=.95,'Performance must be >=95');
   }
   fs.writeFileSync('reference/lighthouse-summary.json',JSON.stringify(results,null,2));
  }finally{await chrome.kill();}
 }else{
  browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],downloadsPath:path.join(root,'.cache/downloads')});
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const errors=[];page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});page.on('pageerror',error=>errors.push(String(error)));
  if(mode==='a11y'){
   const axe=fs.readFileSync('node_modules/axe-core/axe.min.js','utf8');
   const results=[];
   for(const width of [1440,390])for(const route of ['/','/work/deadlock/']){
    await page.setViewportSize({width,height:900});await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode();})));assert.ok(await page.locator('img').evaluateAll(images=>images.every(img=>img.naturalWidth>0)),'Images must load');await page.addScriptTag({content:axe});
    const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}}));
    results.push({width,route,violations:result.violations});console.log(`${width} ${route}: ${result.violations.length} axe violations`);
    if(result.violations.length)console.log(JSON.stringify(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),null,2));
   }
   fs.writeFileSync('reference/axe-results.json',JSON.stringify(results,null,2));
   assert.ok(results.every(r=>!r.violations.length),'axe violations remain');
   for(const width of [320,402,834,1440]){
    await page.setViewportSize({width,height:900});await page.goto(base);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}`);
   }
   await page.setViewportSize({width:1440,height:900});await page.goto(base);
   const stage=page.locator('.lead-stage');await assert.doesNotReject(()=>stage.waitFor());
   assert.ok(await stage.evaluate(el=>el.classList.contains('lead-stage--pinned')));
   for(const [index,label] of ['person','team','company'].entries()){
    await stage.evaluate((el,index)=>scrollTo({top:scrollY+el.getBoundingClientRect().top+index/3*(el.offsetHeight-innerHeight)+10,behavior:'instant'}),index);
    await page.waitForTimeout(100);assert.equal(await page.locator('.lead-level:visible').getAttribute('id'),`level-${label}`);
   }
   await page.locator('.lead-stage__labels button').last().focus();await page.keyboard.press('ArrowUp');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Team');await page.keyboard.press('Enter');await page.waitForTimeout(1000);assert.equal(await page.locator('.lead-level:visible').getAttribute('id'),'level-team');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);assert.equal(await page.locator('.lead-level:visible').count(),3);
   await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:700});await page.waitForTimeout(250);assert.equal(await page.locator('.lead-level:visible').count(),3);
   await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');await page.waitForTimeout(300);assert.equal(await page.locator('.lead-level:visible').count(),3,'Text zoom must show stacked levels');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No overflow with 200% text');await page.evaluate(()=>document.documentElement.style.fontSize='');
   const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});const fallback=await noJs.newPage();await fallback.goto(base);assert.equal(await fallback.locator('.lead-level:visible').count(),3);await fallback.screenshot({path:'reference/screenshots/lead-no-js.png',fullPage:true});await noJs.close();
   for(const route of ['/work/deadlock/','/work/analytics/','/work/six-million/','/work/ux-practice/','/work/shriners/','/build/foundry/','/build/wcag-engine/','/build/identity-service/','/404.html','/sitemap.xml','/robots.txt'])assert.equal((await page.goto(base+route)).status(),200,route);
   assert.deepEqual(errors,[]);console.log('Reflow, Lead scrolling and keyboard, reduced motion, short viewport, 200% text zoom, no-JS, routes and runtime checks passed.');
  }else{
   for(const width of [1440,834,402]){
    await page.setViewportSize({width,height:900});await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(images=>Promise.all(images.map(img=>{img.loading='eager';return img.decode();})));await page.screenshot({path:`reference/screenshots/home-${width}.png`,fullPage:true});
   }
   await page.setViewportSize({width:1440,height:900});await page.goto(base);await page.evaluate(()=>document.fonts.ready);
   for(const [index,label] of ['person','team','company'].entries()){
    await page.locator('.lead-stage').evaluate((el,index)=>scrollTo({top:scrollY+el.getBoundingClientRect().top+index/3*(el.offsetHeight-innerHeight)+10,behavior:'instant'}),index);await page.waitForTimeout(300);await page.screenshot({path:`reference/screenshots/lead-${label}-1440.png`});
   }
   console.log('Saved homepage and Lead screenshots.');
  }
  await context.close();
 }
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
