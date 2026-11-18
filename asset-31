import { useRef, useState } from 'react';
import { useDiary } from '../state/DiaryContext.jsx';
import { STORAGE_KEY } from '../lib/records.js';
import { dateKey } from '../lib/dates.js';

function download(text, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function BackupPage() {
  const { records, error, importBackup, notify } = useDiary();
  const file = useRef();
  const [result, setResult] = useState(''), [working, setWorking] = useState(false);
  function exportBackup() {
    try {
      const text = error ? window.localStorage.getItem(STORAGE_KEY) || '[]' : JSON.stringify({ version: 1, records }, null, 2);
      download(text, `杯杯小账本-${error ? '原始数据-' : ''}${dateKey(new Date())}.json`);
      notify('备份已导出，记得妥善保存');
    } catch { setResult('浏览器存储暂时不可访问，请在正常模式下重试。'); }
  }
  async function importFile(event) {
    const selected = event.target.files[0]; event.target.value = ''; if (!selected) return;
    setWorking(true);
    try {
      if (selected.size > 25e6) throw new Error('请选择 25MB 以内的备份文件。');
      const count = importBackup(await selected.text());
      setResult(`导入成功，新增 ${count} 杯记录，重复记录已跳过。`);
    } catch (error) { setResult(error.message || '无法导入，请选择有效的杯杯小账本 JSON 备份。'); }
    finally { setWorking(false); }
  }
  return <section className="mx-auto max-w-2xl py-7 sm:py-10"><h1 className="text-xl font-medium">给记录留个备份</h1><p className="mb-7 mt-2 text-xs text-muted">换手机之前，记得把这些杯带走。</p>
    <div className="paper-panel"><p className="font-serif text-4xl">{records.length} <span className="font-sans text-sm">杯记录</span></p><p className="mt-3 text-sm leading-loose text-muted">记录只保存在当前浏览器，清除浏览器数据或换设备后不会自动同步。导出的 JSON 备份包含饮品照片，可以在新设备导入。</p><div className="mt-6 flex flex-wrap gap-3"><button className="btn-primary" onClick={exportBackup}>{error ? '导出原始数据' : '↗ 导出备份'}</button><button className="btn-small px-5" disabled={working || !!error} onClick={() => file.current.click()}>{working ? '正在导入…' : '↙ 导入备份'}</button><input ref={file} className="hidden" type="file" accept="application/json,.json" aria-label="导入备份" onChange={importFile} /></div><p className="mt-4 text-[11px] leading-relaxed text-muted">支持旧版备份。导入会合并记录，相同 ID 不会重复添加，也不会覆盖现有内容。</p>{result && <p className="mt-4 rounded-md bg-lilac/30 p-3 text-sm" role="status">{result}</p>}</div>
    <div className="paper-panel mt-5 bg-sky/35"><h2 className="text-sm font-medium">关于照片与 AI 抠图</h2><p className="mt-3 text-xs leading-loose text-muted">照片在本机处理，不上传服务器。首次加载约 16MB AI 组件，支持分段重试和缓存；换浏览器或清除缓存后需要重新加载。照片会占用本地存储空间，建议定期导出备份。</p></div>
  </section>;
}
