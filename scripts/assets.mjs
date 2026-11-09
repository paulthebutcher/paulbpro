import fs from 'node:fs';
import subsetFont from 'subset-font';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {prepareShareImages} from './share-images.mjs';
export async function prepareAssets(site, entries){
  fs.mkdirSync('.cache',{recursive:true});
  fs.mkdirSync('dist/fonts',{recursive:true});
  const fonts = [
    ['ABCDiatype', 'Regular'],
    ['ABCDiatype', 'Light'],
    ['ABCDiatypeMono', 'Regular'],
  ];
  for (const [family, weight] of fonts) {
    const licensed = `src/fonts/${family}-${weight}.woff2`;
    const trial = `assets/fonts/${family}Trial-${weight}.otf`;
    const dest = `dist/fonts/${family}-${weight}.woff2`;
    if(fs.existsSync(licensed)) fs.copyFileSync(licensed,dest);
    else {
      console.warn(`TRIAL FONTS. Replace before launch: ${trial}`);
      const text = Array.from({length:95},(_,i)=>String.fromCodePoint(i+32)).join('') + '←→↗©’“”·' + fs.readdirSync('content',{recursive:true}).filter(f=>/\.(json|md)$/.test(f)).map(f=>fs.readFileSync(`content/${f}`,'utf8')).join('');
      const hash=createHash('sha256').update(text).update(fs.readFileSync(trial)).digest('hex').slice(0,12);
      const cache=`.cache/${family}Trial-${hash}.woff2`;
      if(!fs.existsSync(cache)) fs.writeFileSync(cache,await subsetFont(fs.readFileSync(trial),text,{targetFormat:'woff2'}));
      fs.copyFileSync(cache,dest);
    }
  }
  const tokens=fs.readFileSync('src/css/tokens.css','utf8');
  const color=name=>tokens.match(new RegExp(`--${name}: (#[a-f0-9]+)`,'i'))[1];
  const pine=color('pine'), paper=color('alabaster');
  const favicon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${pine}"/><path d="M16 47V24h8a8 8 0 0 1 0 16h-8M38 17v23h8a8 8 0 0 0 0-16h-8" fill="none" stroke="${paper}" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  fs.writeFileSync('dist/favicon.svg',favicon);
  await sharp(Buffer.from(favicon)).resize(180,180).png().toFile('dist/apple-touch-icon.png');
  await prepareShareImages(site, entries, color);
}
