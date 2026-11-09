import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

function build(script){
  return spawnSync('npm',['run',script],{
    env:{...process.env,ELEVENTY_ENV:'production'},encoding:'utf8'
  });
}
function verifyPreview(){
  const result=build('build:preview');
  assert.equal(result.status,0,result.stdout+result.stderr);
  const pages=fs.readdirSync('dist',{recursive:true}).filter(file=>file.endsWith('.html'));
  assert.equal(pages.length,10);
  for(const page of pages){
    assert.match(fs.readFileSync(`dist/${page}`,'utf8'),/<meta name="robots" content="noindex, nofollow">/,page);
  }
  assert.match(fs.readFileSync('dist/_headers','utf8'),/\/\*\s+X-Robots-Tag: noindex, nofollow/);
  assert.doesNotMatch(fs.readFileSync('dist/robots.txt','utf8'),/Sitemap:/);
  assert.match(fs.readFileSync('dist/build/foundry/index.html','utf8'),/\[gap/);
  console.log('Draft build passes with inherited production environment; all pages and responses request no indexing.');
}

verifyPreview();
const production=build('build');
assert.notEqual(production.status,0,'Unfinished content must fail the launch build.');
assert.match(production.stdout+production.stderr,/Production blocked: unfinished copy/);
assert.doesNotMatch(fs.readFileSync('dist/index.html','utf8'),/<meta name="robots" content="noindex/);
assert.doesNotMatch(fs.readFileSync('dist/_headers','utf8'),/X-Robots-Tag/);
assert.match(fs.readFileSync('dist/robots.txt','utf8'),/Sitemap:/);
console.log('Production still rejects unfinished copy and does not retain draft indexing headers.');
verifyPreview();
