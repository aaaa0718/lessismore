// Worker-only downloader. Cache only complete, verified chunks; never photos.
async function digestBytes(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('')}
async function loadAIAssets(id){
 const report=message=>postMessage({id,type:'progress',message});
 let cache;try{cache=await caches.open('tea-ai-chunks-v1')}catch{}
 const manifestResponse=await fetch('../vendor/chunks/manifest.json?v=1',{signal:AbortSignal.timeout(60000)});
 if(!manifestResponse.ok)throw Error('无法获取组件清单，请检查网络后重试。');
 const manifest=await manifestResponse.json(),total=manifest.wasm.size+manifest.model.size;let completed=0;
 const progress=(bytes=0)=>report(`正在准备 AI 组件 ${Math.min(100,Math.floor((completed+bytes)/total*100))}% · 已完成部分会保留`);
 async function part(chunk){
  const url=new URL('../vendor/chunks/'+chunk.file,self.location.href).href;
  if(cache){const saved=await cache.match(url);if(saved){const bytes=await saved.arrayBuffer();if(bytes.byteLength===chunk.size&&await digestBytes(bytes)===chunk.sha256){completed+=bytes.byteLength;progress();return new Uint8Array(bytes)}await cache.delete(url)}}
  for(let attempt=0;attempt<3;attempt++){
   try{
    const response=await fetch(url,{signal:AbortSignal.timeout(120000),cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);
    const reader=response.body.getReader(),buffers=[];let length=0;
    while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>chunk.size){await reader.cancel();throw Error('Invalid chunk size')}buffers.push(value);progress(length)}
    const bytes=new Uint8Array(length);let offset=0;for(const b of buffers){bytes.set(b,offset);offset+=b.length}
    if(length!==chunk.size||await digestBytes(bytes)!==chunk.sha256)throw Error('Incomplete chunk');
    if(cache)try{await cache.put(url,new Response(bytes))}catch{}
    completed+=length;progress();return bytes;
   }catch(e){if(attempt===2)throw Error('网络下载中断。已完成部分已保留，点击「AI 自动抠图」可继续下载。');report(`连接有些慢，正在重试当前小段（${attempt+1}/2）…`);await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)))}
  }
 }
 const result={};progress();
 for(const key of ['wasm','model']){const asset=manifest[key],bytes=new Uint8Array(asset.size);let offset=0;for(const chunk of asset.chunks){const data=await part(chunk);bytes.set(data,offset);offset+=data.length}if(await digestBytes(bytes)!==asset.sha256)throw Error('组件校验失败，请重试。');result[key]=bytes}
 return result;
}
