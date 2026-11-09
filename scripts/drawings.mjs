import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {workScenes, buildScenes} from './drawing-scenes.mjs';

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

const layer = (opacity, content) => `<g opacity="${opacity}">\n${content.join('\n')}\n</g>`;
const ring = (x, y, radius) => `<circle cx="${x}" cy="${y}" r="${radius}"/>`;
const register = (x, y) => `<rect x="${x - 2}" y="${y - 2}" width="4" height="4"/>`;

const decision = d => `<path class="decision" d="${d}" stroke="var(--accent)" stroke-width="2" fill="none"/>`;
const lane = (x, y, length) => part('lane', x, y).replace('H64', `H${length}`);
const page = (x, y, width = 80, height = 64, header = 16) => part('page', x, y)
  .replace('width="80"', `width="${width}"`).replace('height="64"', `height="${height}"`)
  .replace('M0 16H80', `M0 ${header}H${width}`);
const guides = (width, height, columns) => layer(0.14, [
  route(`M40 48H${width-40}M40 ${height-49}H${width-40}`,'stroke-dasharray="1 4"'),
  ...columns.map(x => route(`M${x} 40V${height-41}`, 'stroke-dasharray="1 4"')),
  ...[[40,48],[width-40,48],[40,height-49],[width-40,height-49]].map(([x,y])=>register(x,y)),
]);
const drawingKit = {part, route, layer, ring, register, decision, guides, page, lane};

export function generateWork() {
  fs.mkdirSync('src/img/cases', {recursive:true});
  // Object order keeps deadlock first, as required by the production brief.
  for (const [name, content] of Object.entries(workScenes(drawingKit))) {
    fs.writeFileSync(`src/img/cases/${name}.svg`, svg(590,393,content));
  }
}

export function generateBuilds() {
  fs.mkdirSync('src/img/builds', {recursive:true});
  // Homepage row first: WCAG Engine, Foundry, Identity Service.
  for (const [name, {width,height,content}] of Object.entries(buildScenes(drawingKit))) {
    fs.writeFileSync(`src/img/builds/${name}.svg`, svg(width,height,content));
  }
}

export function generateLead() {
  const person = [
    layer(0.14, [
      route('M32 24H288M32 192H288M80 24V192M136 24V192M192 24V192M248 24V192', 'stroke-dasharray="1 4"'),
      ring(136, 112, 56),
      ...[[32, 24], [288, 24], [32, 192], [288, 192]].map(([x, y]) => register(x, y)),
    ]),
    layer(0.28, [ring(136, 112, 32), route('M136 48V56M136 168V176M72 112H80M192 112H200M224 56H328')]),
    layer(0.55, [ring(136, 112, 16)]),
    layer(0.72, [
      route('M78.5 55.5H104V88H136V104M78.5 159.5H104V136H136V120'),
      route('M144 112H216V48H328M308 44L312 48L308 52'),
    ]),
    layer(0.9, [small('note', 56, 48), small('note', 56, 152), small('node', 136, 112)]),
  ];
  const peers = [[64, 72], [152, 96], [240, 64], [80, 152], [168, 160], [256, 144]];
  const team = [
    layer(0.14, [
      route('M64 16V200M152 16V200M240 16V200M24 112H296M24 200H296', 'stroke-dasharray="1 4"'),
      route('M64 72L152 96L240 64L256 144L168 160L80 152Z'),
      ...[64, 152, 240].map(x => register(x, 200)),
    ]),
    layer(0.18, peers.map(([x, y]) => ring(x, y, 32))),
    layer(0.55, peers.map(([x, y]) => ring(x, y, 16))),
    layer(0.72, [
      route('M72 72H104V96H144M140 92L144 96L140 100'),
      route('M160 96H200V64H232M228 60L232 64L228 68'),
      route('M248 64H280V144H264M268 140L264 144L268 148'),
      route('M248 144H208V160H176M180 156L176 160L180 164'),
      route('M160 160H120V152H88M92 148L88 152L92 156'),
      route('M72 152H40V72H56M52 68L56 72L52 76'),
      route('M51.5 39V48H64V64M147.5 47V64H152V88M235.5 31V40H240V56M51.5 184V176H80V160'),
    ]),
    layer(0.9, [
      ...[[40, 24], [136, 32], [224, 16], [40, 184]].map(([x, y]) => small('note', x, y)),
      ...peers.map(([x, y]) => small('node', x, y)),
    ]),
  ];
  const company = [
    layer(0.14, [
      route('M40 16H296M40 200H296M91.5 16V200M155.5 16V200M219.5 16V200', 'stroke-dasharray="1 4"'),
      ...[[40, 16], [296, 16], [40, 200], [296, 200]].map(([x, y]) => register(x, y)),
    ]),
    layer(0.42, [
      '<rect x="48" y="24" width="240" height="168" rx="2"/>', route('M48 48H288'),
    ]),
    ...[96, 160].flatMap(y => [
      layer(0.18, [91.5, 155.5, 219.5].map(x => ring(x, y, 24))),
      layer(0.36, [91.5, 155.5, 219.5].map(x => ring(x, y, 12))),
    ]),
    layer(0.72, [
      route('M8 104H32V112H64M60 108L64 112L60 116'),
      ...[64, 128].flatMap(y => [
        route(`M91.5 ${y + 15}V${y + 24}M155.5 ${y + 15}V${y + 24}M99.5 ${y + 32}H147.5`),
        route(`M219.5 ${y + 15}V${y + 24}`, 'stroke-dasharray="2 4"'),
      ]),
    ]),
    layer(0.9, [
      ...[64, 128].flatMap(y => [
        route(`M264 ${y + 24}V${y + 40}`),
        ...[80, 144, 208].map(x => small('note', x, y)),
        ...[91.5, 155.5].map(x => small('node', x, y + 32)),
        small('node', 219.5, y + 32, 'stroke-dasharray="2 4"'),
      ]),
    ]),
  ];
  fs.mkdirSync('src/img/lead', {recursive: true});
  for (const [name, content] of Object.entries({person, team, company})) {
    fs.writeFileSync(`src/img/lead/${name}.svg`, svg(322, 215, content));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const group = process.argv[2] || 'lead';
  const generators = {lead: generateLead, work: generateWork, builds: generateBuilds};
  if (!generators[group]) throw new Error(`Unknown drawing group: ${group}`);
  generators[group]();
  console.log(`Generated ${group} drawings from the approved shared parts and specs.`);
}
