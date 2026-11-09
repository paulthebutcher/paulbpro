import fs from 'node:fs';
import matter from 'gray-matter';
const refs=[];
for(const type of ['cases','builds'])for(const file of fs.readdirSync(`content/${type}`)){
 const {data}=matter(fs.readFileSync(`content/${type}/${file}`,'utf8'));if(data.image)refs.push(data.image);
}
const about=JSON.parse(fs.readFileSync('content/site/about.json'));
refs.push(...about.objects.map(x=>x.src),...about.paper.map(x=>x.src));
refs.push(...JSON.parse(fs.readFileSync('content/site/lead.json')).levels.map(x=>x.image));
const missing=refs.filter(src=>!fs.existsSync(src.endsWith('.svg')?`src${src}`:`src/img/_masters/${src.replace('/img/','')}.png`));
console.log(`${missing.length} image placeholders:\n${missing.join('\n')}`);
if(missing.length)process.exitCode=1;
