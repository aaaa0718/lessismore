import { useEffect, useRef, useId } from 'react';
import StampArtwork from './StampArtwork.jsx';
import { newestFirst, recordDetails } from '../lib/records.js';

export default function StampDetails({ stamp, records, onClose }) {
  const dialog = useRef(null), title = useId();
  useEffect(() => {
    const element = dialog.current, previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close(); document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} className="stamp-detail-dialog" aria-labelledby={title} onCancel={e => { e.preventDefault(); onClose(); }}>
    <header className="stamp-detail-header"><div><h2 id={title}>这款饮品的印记</h2><p>{stamp.brand || '我的一杯'} · {stamp.name}</p></div><button type="button" autoFocus className="btn-icon" aria-label="关闭印章详情" onClick={onClose}>×</button></header>
    <div className="stamp-detail-body">
      <div className="drink-stamp-face stamp-detail-art" style={{ color: stamp.design.ink }}>
        <StampArtwork design={stamp.design} />
        <span className="drink-stamp-type"><strong>{stamp.name.length > 12 ? `${stamp.name.slice(0, 11)}…` : stamp.name}</strong><span>{stamp.brand || '我的一杯'}</span></span>
        <span className="drink-stamp-date">{stamp.date.replaceAll('-', '.')}</span>
      </div>
      <p className="stamp-detail-summary">喝过 {records.length} 次 · 初次记录 {stamp.date}</p>
      <h3 className="mt-6 text-sm font-medium">每次喝它的记录</h3>
      <ol className="stamp-detail-history">{newestFirst(records).map(record => <li key={record.id}>
        <time dateTime={record.date}>{record.date}</time>
        <p>{[record.category, record.sugar, record.ice].filter(v => v && v !== '未选择').join(' · ')}</p>
        {recordDetails(record) && <p>{recordDetails(record)}</p>}
        {record.note && <p className="stamp-detail-note">{record.note}</p>}
      </li>)}</ol>
    </div>
  </dialog>;
}
