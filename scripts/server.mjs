import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
export function serve(port=4173){
 const root=path.resolve('dist');
 const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.avif':'image/avif','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain','.pdf':'application/pdf'};
 return new Promise(resolve=>{
  const server=http.createServer((req,res)=>{
   let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
   let file=path.resolve(root,`.${pathname}`);
   if(!file.startsWith(root+path.sep) && file!==root){res.writeHead(403).end();return;}
   if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   const found=fs.existsSync(file);if(!found)file=path.join(root,'404.html');
   const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'};
   if(/\.(html|css|js|svg|xml|txt)$/.test(file) && req.headers['accept-encoding']?.includes('gzip')){headers['Content-Encoding']='gzip';headers.Vary='Accept-Encoding';res.writeHead(found?200:404,headers);res.end(gzipSync(fs.readFileSync(file)));}
   else{res.writeHead(found?200:404,headers);fs.createReadStream(file).pipe(res);}
  });server.listen(port,'127.0.0.1',()=>resolve(server));
 });
}
