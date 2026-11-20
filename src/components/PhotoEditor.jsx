import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/assets.js';
import { compressFile, prepareTensor, applyMask, removeSolidBackground } from '../services/images.js';
import { createAIClient } from '../services/aiClient.js';

export default function PhotoEditor({ photo, onChange, onBusy }) {
  const [original, setOriginal] = useState(photo || '');
  const [auto, setAuto] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('拍一杯、选一张，把它贴进日历。');
  const client = useRef(null), generation = useRef(0), busyRef = useRef(false);
  if (!client.current) client.current = createAIClient();
  useEffect(() => () => { generation.current++; client.current.cancel(); }, []);
  useEffect(() => { onBusy(busy); }, [busy, onBusy]);
  function cancel() {
    generation.current++; client.current.cancel(); busyRef.current = false; setBusy(false); setStatus('已取消抠图，原照片已保留。');
  }
  async function process(task) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); const token = ++generation.current;
    const current = () => token === generation.current;
    const progress = text => { if (current()) setStatus(text); };
    try { await task({ current, progress }); }
    catch (error) { progress(error.message.includes('已保留') ? error.message : `处理失败，原照片已保留。${error.message}`); }
    finally { if (current()) { busyRef.current = false; setBusy(false); } }
  }
  async function ai(source, { current, progress }) {
    progress('正在准备照片…');
    const { image, pixels } = await prepareTensor(source); if (!current()) return;
    const mask = await client.current.infer(pixels, progress); if (!current()) return;
    onChange(applyMask(image, mask)); progress('AI 抠图完成！检查一下边缘，不满意可以恢复原图。');
  }
  async function upload(event) {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return;
    await process(async controls => {
      controls.progress('正在读取照片…'); const source = await compressFile(file); if (!controls.current()) return;
      setOriginal(source); onChange(source);
      if (auto) await ai(source, controls); else controls.progress('贴纸准备好了，保存后贴进日历。');
    });
  }
  return <section className="rounded-xl border border-dashed border-lilac-dark/40 bg-lilac/30 p-4" aria-label="饮品照片">
    <div className="flex items-start gap-3">
      <div className="checkerboard grid h-28 w-20 shrink-0 place-items-center rounded-lg p-2"><img className="h-full w-full object-contain" src={photo || asset('cup.svg')} alt="饮品贴纸预览" /></div>
      <div className="min-w-0 flex-1">
        <label className="btn-primary inline-block cursor-pointer text-xs">＋ 上传饮品照片<input aria-label="上传饮品照片" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} /></label>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button className="btn-mini" type="button" disabled={!original || busy} onClick={() => process(controls => ai(original, controls))}>AI 自动抠图</button>
          <button className="btn-mini" type="button" disabled={!original || busy} onClick={() => process(async ({ current, progress }) => { const result = await removeSolidBackground(original); if (current()) onChange(result); progress('背景已处理，不满意可以恢复原图。'); })}>去除纯色背景</button>
          <button className="btn-mini" type="button" disabled={!original || busy} onClick={() => { onChange(original); setStatus('已恢复原图。'); }}>恢复原图</button>
          <button className="btn-mini" type="button" disabled={!photo || busy} onClick={() => { onChange(''); setOriginal(''); setStatus('照片已移除。'); }}>移除照片</button>
          {busy && <button className="btn-mini text-rose-800" type="button" onClick={cancel}>取消抠图</button>}
        </div>
        <label className="mt-3 flex items-center gap-2 text-[11px]"><input className="accent-[#a087b2]" type="checkbox" checked={auto} onChange={event => setAuto(event.target.checked)} disabled={busy} />上传后自动抠图</label>
        <p className="mt-2 text-[11px] leading-relaxed text-muted" role="status">{status}</p>
      </div>
    </div>
    <p className="mt-3 text-[10px] leading-relaxed text-muted">AI 在本机处理，照片不上传。首次加载约 16MB{window.isSecureContext ? '，支持断点续传' : ''}。尽量拍单个杯子；复杂背景和透明杯边缘请检查预览。</p>
  </section>;
}
