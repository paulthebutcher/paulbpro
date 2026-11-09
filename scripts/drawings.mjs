import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const kit = fs.readFileSync('src/img/_parts.md', 'utf8');
const parts = Object.fromEntries([...kit.matchAll(/## (\w+)\n[\s\S]*?```svg\n([\s\S]*?)\n```/g)]
  .map(([, name, svg]) => [name, svg]));
export const part = (name, x, y, scale = 1, attributes = '') => {
  if (!parts[name]) throw new Error(`Unknown drawing part: ${name}`);
  return `<g transform="translate(${x} ${y}) scale(${scale})"${attributes ? ` ${attributes}` : ''}>\n${parts[name]}\n</g>`;
};
const route = (d, attributes = '') => `<path d="${d}"${attributes ? ` ${attributes}` : ''}/>`;
const small = (name, x, y, attributes) => part(name, x, y, 0.625, attributes);
const svg = (width, height, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n${content.join('\n')}\n</svg>\n`;

export function generateLead() {
  const person = [
    route('M86.5 71.5H104V96H128V104M86.5 151.5H104V128H128V120'),
    route('M136 112H200V48H328M308 44L312 48L308 52'),
    small('note', 64, 64), small('note', 64, 144), small('node', 128, 112),
  ];
  const team = [
    route('M72 72H152M148 68L152 72L148 76M168 72H248M244 68L248 72L244 76'),
    route('M256 80V136M252 132L256 136L260 132'),
    route('M248 144H168M172 140L168 144L172 148M152 144H72M76 140L72 144L76 148'),
    route('M64 136V80M60 84L64 80L68 84M160 80V136M156 132L160 136L164 132'),
    ...[64, 160, 256].flatMap(x => [
      route(`M${x} 47V64M${x} 152V176`),
      small('note', x - 11.5, 32), small('note', x - 11.5, 176),
      small('node', x, 72), small('node', x, 144),
    ]),
  ];
  const company = [
    '<rect x="64" y="24" width="224" height="168" rx="2"/>',
    route('M64 48H288M16 112H80M76 108L80 112L76 116'),
    ...[64, 128].flatMap(y => [
      route(`M107.5 ${y + 15}V${y + 24}M163.5 ${y + 15}V${y + 24}M115.5 ${y + 32}H155.5`),
      route(`M219.5 ${y + 15}V${y + 24}`, 'stroke-dasharray="2 4"'),
      route(`M248 ${y + 16}V${y + 32}`),
      ...[96, 152, 208].map(x => small('note', x, y)),
      ...[107.5, 163.5].map(x => small('node', x, y + 32)),
      small('node', 219.5, y + 32, 'stroke-dasharray="2 4"'),
    ]),
  ];
  fs.mkdirSync('src/img/lead', {recursive: true});
  for (const [name, content] of Object.entries({person, team, company})) {
    fs.writeFileSync(`src/img/lead/${name}.svg`, svg(322, 215, content));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const group = process.argv[2] || 'lead';
  if (group !== 'lead') throw new Error('Only the Lead group is ready; awaiting style approval.');
  generateLead();
  console.log('Generated three Lead drawings from the shared parts and Lead specs.');
}
