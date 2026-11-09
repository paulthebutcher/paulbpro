import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import Image from '@11ty/eleventy-img';
import {prepareAssets} from './scripts/assets.mjs';
const md = new MarkdownIt({html:false,typographer:false});
const escape = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default function(config) {
  const readSite = () => Object.fromEntries(fs.readdirSync('content/site').filter(f=>f.endsWith('.json')).map(f=>[f.slice(0,-5),JSON.parse(fs.readFileSync(`content/site/${f}`))]));
  const records = kind => fs.readdirSync(`content/${kind}`).filter(f=>f.endsWith('.md')).map(file=>{
    const {data,content} = matter(fs.readFileSync(`content/${kind}/${file}`,'utf8'));
    return {data:{...data,kindOfPage:kind},body:md.render(content),url:`/${kind==='cases'?'work':'build'}/${data.slug}/`};
  }).sort((a,b)=>a.data.order-b.data.order);
  for (const kind of ['cases','builds']) {
    config.addCollection(kind,()=>{
      const items = records(kind);
      items.forEach((item,i)=> { item.previous = items[i-1] ? {title:items[i-1].data.title,url:items[i-1].url} : null; item.next = items[i+1] ? {title:items[i+1].data.title,url:items[i+1].url} : null; });
      return items;
    });
  }
  config.addGlobalData('site',readSite);
  config.addGlobalData('year',new Date().getFullYear());
  config.addGlobalData('production',process.env.ELEVENTY_ENV==='production');
  config.addFilter('br',value=>escape(value).replace(/\n/g,'<br class="br-desktop"> '));
  config.addFilter('copyright',value=>value.replace('{year}',new Date().getFullYear()));
  config.addFilter('available',value=>Boolean(value && !value.includes('[gap') && (value!==readSite().site.resume || fs.existsSync('src/Paul-Butcher-Resume.pdf'))));
  config.addFilter('resolveHref',item=>item.type==='mailto'?`mailto:${readSite().site[item.hrefKey]}`:readSite().site[item.hrefKey]);
  config.addFilter('featured',items=>items.filter(item=>item.data.featured));
  config.addFilter('json',v=>JSON.stringify(v));
  config.addShortcode('styles',()=>{const css=fs.readFileSync('dist/css/main.css','utf8');return Buffer.byteLength(css)<20000?`<style>${css}</style>`:'<link rel="preload" href="/css/main.css" as="style"><link rel="stylesheet" href="/css/main.css">';});
  config.addFilter('gapMarkup',value=>value.replace(/\[gap[^\]]*\]/g,'<mark class="content-gap">$&</mark>'));
  config.addAsyncShortcode('media',async function(src,alt,width=590,height=308,priority=false){
    const attributes = `width="${width}" height="${height}" alt="${escape(alt)}" decoding="async" ${priority?'fetchpriority="high"':'loading="lazy"'}`;
    const master = src==='/img/paul-headshot'?'assets/images/headshot.png':`src/img/_masters/${src.replace('/img/','')}.png`;
    if (src.endsWith('.svg') && fs.existsSync(`src${src}`)) return `<figure class="diagram" role="img" aria-label="${escape(alt)}">${fs.readFileSync(`src${src}`,'utf8')}</figure>`;
    if (!fs.existsSync(master)) return `<div class="media placeholder" role="img" aria-label="${escape(readSite().ui.imageComing)}" style="--media-ratio:${width}/${height}"><span class="visually-hidden">${escape(readSite().ui.imageComing)}</span></div>`;
    const stats = await Image(master,{widths:[width,width*2],formats:['avif','webp'],outputDir:`dist${path.posix.dirname(src)}`,urlPath:path.posix.dirname(src),filenameFormat:(id,source,sourceWidth,format)=>`${path.posix.basename(src)}-${sourceWidth}.${format}`,sharpOptions:{},sharpAvifOptions:{quality:55},sharpWebpOptions:{quality:75}});
    return `<picture><source type="image/avif" srcset="${stats.avif.map(x=>`${x.url} ${x.width}w`).join(', ')}" sizes="(min-width:1200px) ${width}px, (min-width:768px) 279px, calc(100vw - 48px)"><img src="${stats.webp[0].url}" srcset="${stats.webp.map(x=>`${x.url} ${x.width}w`).join(', ')}" sizes="(min-width:1200px) ${width}px, (min-width:768px) 279px, calc(100vw - 48px)" ${attributes}></picture>`;
  });
  config.addWatchTarget('content'); config.addWatchTarget('src/css'); config.addWatchTarget('assets'); config.addWatchTarget('src/img');
  config.addPassthroughCopy({'src/js':'js'});
  if(fs.existsSync('src/Paul-Butcher-Resume.pdf')) config.addPassthroughCopy({'src/Paul-Butcher-Resume.pdf':'Paul-Butcher-Resume.pdf'});
  config.on('eleventy.before',async()=>{
    await prepareAssets(readSite());
    fs.mkdirSync('dist/css',{recursive:true});
    fs.writeFileSync('dist/css/main.css',['tokens','base','grid','components','sections'].map(f=>fs.readFileSync(`src/css/${f}.css`,'utf8')).join('\n').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' '));
  });
  config.on('eleventy.after',()=>{
    if(process.env.ELEVENTY_ENV!=='production') return;
    const files=fs.readdirSync('dist',{recursive:true}).filter(f=>/\.(html|xml|css|js|txt)$/.test(f));
    const failures=files.filter(f=>/\[gap|\u2014/.test(fs.readFileSync(`dist/${f}`,'utf8')));
    for(const [key,value] of Object.entries(readSite().site)) if(typeof value==='string' && value.includes('[gap')) failures.push(`content/site/site.json: ${key}`);
    if(failures.length) throw new Error(`Production blocked: unfinished copy or forbidden punctuation in:\n${failures.join('\n')}`);
    if(!fs.existsSync('src/Paul-Butcher-Resume.pdf')) throw new Error('Production blocked: résumé PDF missing from src/.');
  });
  return {dir:{input:'src',output:'dist',includes:'_includes',data:'_data'},htmlTemplateEngine:'njk',markdownTemplateEngine:'njk'};
}
