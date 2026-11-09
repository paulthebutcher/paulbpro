import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import Image from '@11ty/eleventy-img';
import {prepareAssets} from './scripts/assets.mjs';
const md = new MarkdownIt({html:false,typographer:false});
const escape = value => String(value ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const careerImages = {
  objects: {
    widths: [160, 264, 352, 528, 704],
    sizes: '(min-width:1512px) 263px, (min-width:1200px) calc(20.833vw - 52px), (min-width:768px) calc(25vw - 28px), calc(50vw - 32px)',
  },
  paper: {
    widths: [96, 160, 240, 352],
    sizes: '(min-width:1512px) 116px, (min-width:1200px) calc(10.417vw - 42px), (min-width:768px) calc(12.5vw - 22px), calc(25vw - 24px)',
  },
};
const heroSizes = '(min-width:1200px) 322px, (min-width:768px) calc(25vw - 32px), calc(100vw - 48px)';
export default function(config) {
  config.ignores.add('src/img/**/*.md');
  const readSite = () => Object.fromEntries(fs.readdirSync('content/site').filter(f=>f.endsWith('.json')).map(f=>[f.slice(0,-5),JSON.parse(fs.readFileSync(`content/site/${f}`))]));
  const records = kind => fs.readdirSync(`content/${kind}`).filter(f=>f.endsWith('.md')).map(file=>{
    const {data,content} = matter(fs.readFileSync(`content/${kind}/${file}`,'utf8'));
    const section = kind === 'cases' ? 'work' : 'build';
    const url = `/${section}/${data.slug}/`;
    const hasSocialArtwork = Boolean(data.image?.endsWith('.svg') && fs.existsSync(`src${data.image}`));
    return {
      data: {...data, kindOfPage:kind, hasSocialArtwork, socialImage:`/og/${section}/${data.slug}.png`},
      body: md.render(content),
      url,
    };
  }).sort((a,b)=>a.data.order-b.data.order);
  for (const kind of ['cases','builds']) {
    config.addCollection(kind,()=>{
      const items = records(kind);
      items.forEach((item,i)=> { item.previous = items[i-1] ? {title:items[i-1].data.title,url:items[i-1].url} : null; item.next = items[i+1] ? {title:items[i+1].data.title,url:items[i+1].url} : null; });
      return items;
    });
  }
  config.addGlobalData('site',readSite);
  config.addGlobalData('profileSchema', () => {
    const {site} = readSite();
    const url = `${site.url}/`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {'@type': 'WebSite', '@id': `${url}#website`, url, name: site.name},
        {
          '@type': 'ProfilePage',
          '@id': `${url}#profile`,
          name: site.pageTitle,
          description: site.description,
          url,
          isPartOf: {'@id': `${url}#website`},
          mainEntity: {
            '@type': 'Person',
            '@id': `${url}#paul-butcher`,
            name: site.name,
            jobTitle: site.title,
            description: site.description,
            sameAs: [site.linkedin],
            url,
            image: `${site.url}/img/paul-headshot-644.webp`,
          },
        },
      ],
    };
  });
  config.addGlobalData('socialOrigin', () => {
    const {site} = readSite();
    const preview = process.env.ELEVENTY_ENV !== 'production' && process.env.DEPLOY_PRIME_URL;
    return new URL(preview || site.url).origin;
  });
  config.addFilter('articleSchema', (entry, site, canonical, description) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonical}#article`,
    url: canonical,
    mainEntityOfPage: canonical,
    headline: entry.data.title,
    description,
    image: `${site.url}${entry.data.socialImage}`,
    author: {
      '@type': 'Person',
      '@id': `${site.url}/#paul-butcher`,
      name: site.name,
      url: `${site.url}/`,
    },
    isPartOf: {'@id': `${site.url}/#website`},
  }));
  config.addGlobalData('year',new Date().getFullYear());
  config.addGlobalData('production',process.env.ELEVENTY_ENV==='production');
  config.addGlobalData('heroSizes', heroSizes);
  config.addFilter('br',value=>escape(value).replace(/\n/g,'<br class="br-desktop"> '));
  config.addFilter('copyright',value=>value.replace('{year}',new Date().getFullYear()));
  config.addFilter('available',value=>Boolean(value && !value.includes('[gap') && (value!==readSite().site.resume || fs.existsSync('src/Paul-Butcher-Resume.pdf'))));
  config.addFilter('resolveHref',item=>item.type==='mailto'?`mailto:${readSite().site[item.hrefKey]}`:readSite().site[item.hrefKey]);
  config.addFilter('featured',items=>items.filter(item=>item.data.featured));
  config.addFilter('json', value => JSON.stringify(value).replace(/</g, '\\u003c'));
  config.addShortcode('styles',()=>{const css=fs.readFileSync('dist/css/main.css','utf8');return Buffer.byteLength(css)<20000?`<style>${css}</style>`:'<link rel="preload" href="/css/main.css" as="style"><link rel="stylesheet" href="/css/main.css">';});
  config.addFilter('gapMarkup',value=>value.replace(/\[gap[^\]]*\]/g,'<mark class="content-gap">$&</mark>'));
  config.addAsyncShortcode('media',async function(src,alt,width=590,height=308,priority=false,gallery){
    const master = src==='/img/paul-headshot'?'assets/images/headshot.png':`src/img/_masters/${src.replace('/img/','')}.png`;
    if (src.endsWith('.svg') && fs.existsSync(`src${src}`)) {
      const drawing = fs.readFileSync(`src${src}`,'utf8');
      const box = drawing.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      if (!box) throw new Error(`Drawing requires a zero-origin viewBox: ${src}`);
      return `<figure class="diagram" role="img" aria-label="${escape(alt)}" style="--media-ratio:${box[1]}/${box[2]}">${drawing}</figure>`;
    }
    if (!fs.existsSync(master)) return `<div class="media placeholder" role="img" aria-label="${escape(readSite().ui.imageComing)}" style="--media-ratio:${width}/${height}"><span class="visually-hidden">${escape(readSite().ui.imageComing)}</span></div>`;
    const career = careerImages[gallery];
    const sizes = career?.sizes ?? (priority ? heroSizes : `(min-width:1200px) ${width}px, (min-width:768px) 279px, calc(100vw - 48px)`);
    const stats = await Image(master, {
      widths: career?.widths ?? (priority ? [192, width, width * 2] : [width, width * 2]),
      formats: ['avif', 'webp'],
      outputDir: `dist${path.posix.dirname(src)}`,
      urlPath: path.posix.dirname(src),
      filenameFormat: (id, source, sourceWidth, format) => {
        const revision = career ? `-${id}` : '';
        return `${path.posix.basename(src)}-${sourceWidth}${revision}.${format}`;
      },
      sharpAvifOptions: {quality: 55},
      sharpWebpOptions: {quality: 75},
    });
    const fallback = stats.webp[0];
    const srcset = images => images.map(image => image.srcset).join(', ');
    return `<picture><source type="image/avif" srcset="${srcset(stats.avif)}" sizes="${sizes}"><img src="${fallback.url}" srcset="${srcset(stats.webp)}" sizes="${sizes}" width="${fallback.width}" height="${fallback.height}" alt="${escape(alt)}" decoding="async" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}></picture>`;
  });
  config.addWatchTarget('content'); config.addWatchTarget('src/css'); config.addWatchTarget('assets'); config.addWatchTarget('src/img');
  config.addPassthroughCopy({'src/js':'js', 'src/img/surfaces':'img/surfaces'});
  if(fs.existsSync('src/Paul-Butcher-Resume.pdf')) config.addPassthroughCopy({'src/Paul-Butcher-Resume.pdf':'Paul-Butcher-Resume.pdf'});
  config.on('eleventy.before',async()=>{
    await prepareAssets(readSite(), [...records('cases'), ...records('builds')]);
    fs.mkdirSync('dist/css',{recursive:true});
    fs.writeFileSync('dist/css/main.css',['tokens','base','grid','components','sections','motion'].map(f=>fs.readFileSync(`src/css/${f}.css`,'utf8')).join('\n').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' '));
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
