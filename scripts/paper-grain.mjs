import {mkdir} from 'node:fs/promises';
import sharp from 'sharp';

const size = 120;
let seed = 0x174f3f;
function random() {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 2 ** 32;
}
const samples = Float64Array.from({length: size ** 2}, () => (
  Math.sqrt(-2 * Math.log(Math.max(random(), 1e-9))) * Math.cos(2 * Math.PI * random())
));
const at = (x, y) => samples[((y + size) % size) * size + (x + size) % size];
const rgba = Buffer.alloc(size ** 2 * 4);
for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
  const i = (y * size + x) * 4;
  // Fine speckle with a slight shared component between neighboring pixels.
  const noise = at(x, y) + .09 * (at(x - 1, y) + at(x, y - 1));
  const delta = Math.min(10, Math.max(-16, 3.6 * noise - .35 * noise ** 2));
  const gray = delta < 0 ? 0 : 255;
  rgba[i] = rgba[i + 1] = rgba[i + 2] = gray;
  rgba[i + 3] = Math.round(255 * Math.abs(delta) / (gray ? 176 : 79));
}

const target = new URL('../src/img/surfaces/paper-grain.png', import.meta.url);
await mkdir(new URL('.', target), {recursive: true});
await sharp(rgba, {raw: {width: size, height: size, channels: 4}})
  .png({compressionLevel: 9}).toFile(decodeURIComponent(target.pathname));
