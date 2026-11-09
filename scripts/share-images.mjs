import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {decompress} from 'wawoff2';

const width = 1200;
const height = 630;
const xml = value => value.replace(/[&<>]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[c]));

export async function prepareShareImages(site, entries, color) {
  let fontfile = 'assets/fonts/ABCDiatypeTrial-Regular.otf';
  let fontFamily = 'ABC Diatype Trial';
  const licensed = await fs.readFile('src/fonts/ABCDiatype-Regular.woff2').catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  if (licensed) {
    fontfile = '.cache/share-card-diatype.otf';
    fontFamily = 'ABC Diatype';
    await fs.writeFile(fontfile, await decompress(licensed));
  }

  async function text(value, color, size, maxWidth, maxHeight) {
    const rendered = await sharp({text: {
      text: `<span foreground="${color}">${xml(value)}</span>`,
      font: `${fontFamily} ${size}`,
      fontfile,
      width: maxWidth,
      rgba: true,
    }}).png().toBuffer();
    return maxHeight
      ? sharp(rendered).resize({height:maxHeight,withoutEnlargement:true}).png().toBuffer()
      : rendered;
  }

  async function render(target, entry) {
    const home = !entry;
    const pine = home || entry.data.kindOfPage === 'cases';
    const bg = color(pine ? 'pine' : 'alabaster');
    const fg = color(pine ? 'alabaster' : 'pine');
    const accent = color(pine ? 'periwinkle' : 'royal');
    const line = color(pine ? 'line-on-pine' : 'line-on-alabaster');
    const grid = Array.from({length:13}, (_, i) => `M${48 + i * 92}.5 0V630`).join('');
    const frame = home ? '' : '<rect x="696.5" y="137.5" width="439" height="345"/>';
    const guides = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><g fill="none" stroke="${line}"><path d="${grid}"/><path d="M48 105.5H1152M48 523.5H1152"/>${frame}</g></svg>`);
    const overlays = [
      ...(pine ? [{input:'src/img/surfaces/paper-grain.png',tile:true}] : []),
      {input:guides, left:0, top:0},
      {input:await text(home ? site.site.domain : site.site.name, fg, 27, 585), left:64, top:57},
    ];

    if (home) {
      const portrait = await sharp('assets/images/headshot.png').resize(368,368,{fit:'cover'}).png().toBuffer();
      overlays.push(
        {input:portrait,left:768,top:129},
        {input:await text(site.hero.headline,fg,63,668,190),left:64,top:170},
        {input:await text(site.site.name,fg,34,650),left:64,top:411},
        {input:await text(site.site.title,fg,26,650),left:64,top:458},
      );
    } else {
      const title = await text(entry.data.title,fg,62,590,215);
      const {height: titleHeight} = await sharp(title).metadata();
      overlays.push(
        {input:await text(pine ? 'Work · Case study' : 'Build · Project',accent,26,585),left:64,top:151},
        {input:title,left:64,top:Math.round(309-titleHeight/2)},
        {input:await text(site.site.domain,fg,26,585),left:64,top:551},
      );
      if (entry.data.hasSocialArtwork) {
        const drawing = (await fs.readFile(`src${entry.data.image}`,'utf8'))
          .replaceAll('currentColor',pine ? fg : accent)
          .replaceAll('var(--accent)',accent)
          .replaceAll('var(--placeholder)',line);
        const artwork = await sharp(Buffer.from(drawing),{density:144})
          .resize(404,306,{fit:'contain',background:'#00000000'}).png().toBuffer();
        overlays.push({input:artwork,left:714,top:157});
      }
    }

    const output = `dist${target}`;
    await fs.mkdir(path.dirname(output),{recursive:true});
    await sharp({create:{width,height,channels:3,background:bg}})
      .composite(overlays).png().toFile(output);
  }

  await Promise.all([
    render(site.site.ogImage),
    ...entries.map(entry => render(entry.data.socialImage, entry)),
  ]);
}
