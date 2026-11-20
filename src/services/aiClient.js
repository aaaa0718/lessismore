import { asset } from '../lib/assets.js';

/** One cancellable worker per photo editor, no application globals. */
export function createAIClient() {
  let worker = null, pending = null, sequence = 0;
  function cancel(message = '已取消抠图，原照片已保留。') {
    worker?.terminate(); worker = null;
    if (pending) { clearTimeout(pending.timer); pending.reject(new Error(message)); pending = null; }
  }
  function keepAlive() {
    if (!pending) return;
    clearTimeout(pending.timer);
    pending.timer = setTimeout(() => cancel('处理长时间没有响应，请重试。'), 180000);
  }
  function infer(pixels, onProgress) {
    if (pending) return Promise.reject(new Error('上一张照片还在处理中。'));
    if (!worker) {
      worker = new Worker(asset('ai/cutout-worker.js?v=react2'));
      worker.onmessage = ({ data }) => {
        if (!pending || pending.id !== data.id) return;
        if (data.type === 'progress') { keepAlive(); pending.onProgress(data.message); return; }
        const job = pending; clearTimeout(job.timer); pending = null;
        if (data.type === 'result') job.resolve(data.mask);
        else job.reject(new Error(data.message));
      };
      worker.onerror = () => cancel('AI 组件无法启动，请重试。');
    }
    return new Promise((resolve, reject) => {
      const id = ++sequence; pending = { id, resolve, reject, onProgress, timer: null }; keepAlive();
      worker.postMessage({ id, pixels }, [pixels.buffer]);
    });
  }
  return { infer, cancel };
}
