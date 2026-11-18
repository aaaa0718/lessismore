/* U²-Netp inference runs in a worker so the form stays responsive. */
importScripts('../vendor/ort.wasm.min.js');
importScripts('./ai-download.js?v=react1');
ort.env.wasm.numThreads=1;
ort.env.wasm.proxy=false;
ort.env.wasm.wasmPaths=new URL('../vendor/',self.location.href).href;
let sessionPromise;
async function session(id){
 if(!sessionPromise)sessionPromise=(async()=>{
  const assets=await loadAIAssets(id);
  ort.env.wasm.wasmBinary=assets.wasm;
  postMessage({id,type:'progress',message:'正在启动 AI，首次使用请稍等…'});
  return ort.InferenceSession.create(assets.model,{executionProviders:['wasm'],graphOptimizationLevel:'all'});
 })().catch(e=>{sessionPromise=null;throw e});
 return sessionPromise;
}
self.onmessage=async({data})=>{const {id,pixels}=data;let outputs,tensor;try{
 const engine=await session(id);postMessage({id,type:'progress',message:'正在识别杯子并去除背景…'});
 tensor=new ort.Tensor('float32',pixels,[1,3,320,320]);outputs=await engine.run({[engine.inputNames[0]]:tensor});
 const raw=outputs[engine.outputNames[0]].data,mask=new Float32Array(320*320);let min=Infinity,max=-Infinity;
 for(let i=0;i<mask.length;i++){min=Math.min(min,raw[i]);max=Math.max(max,raw[i])}
 if(!Number.isFinite(max)||max-min<1e-6)throw Error('没有识别出清晰主体，请换一张照片。');
 for(let i=0;i<mask.length;i++)mask[i]=(raw[i]-min)/(max-min);
 postMessage({id,type:'result',mask},[mask.buffer]);
 }catch(e){postMessage({id,type:'error',message:e.message||'抠图失败，请重试。'})}finally{tensor?.dispose();if(outputs)Object.values(outputs).forEach(t=>t.dispose())}};
