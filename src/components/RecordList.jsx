import ActionButton from './ui/ActionButton.jsx';
import ActionChevron from './ui/ActionChevron.jsx';
import { photoSrc } from '../lib/assets.js';
import AaReaction from './AaReaction.jsx';
import { newestFirst, recordDetails } from '../lib/records.js';
import { useDiary } from '../state/DiaryContext.jsx';

export default function RecordList({ records, emptyText = 'AA，还没开喝？', date }) {
  const { openEditor } = useDiary();
  return <div className="record-list">
    {records.length ? <div className="divide-y divide-dashed divide-line">{newestFirst(records).map(record => <button key={record.id} type="button" className="flex w-full items-center gap-3 rounded-lg py-4 text-left hover:bg-lilac/25 active:bg-lilac/45" aria-label={`编辑 ${record.name || record.category}`} onClick={() => openEditor(record)}>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-butter/50"><img className={`h-10 w-9 object-contain ${record.photo ? 'sticker' : ''}`} src={photoSrc(record)} alt="" /></span>
      <span className="min-w-0 flex-1"><span className="block break-words text-sm">{record.name || record.category}{record.brand ? ` · ${record.brand}` : ''}</span><span className="mt-1 block break-words text-[11px] leading-relaxed text-muted">{record.date.slice(5).replace('-', ' / ')}{[record.sugar, record.ice].filter(v => v && v !== '未选择').map(v => ` · ${v}`).join('')}{record.note && ` · ${record.note}`}</span>{recordDetails(record) && <span className="mt-1 block text-[11px] text-lilac-dark">{recordDetails(record)}</span>}</span><span className="max-w-20 break-words rounded bg-lilac/60 px-2 py-1 text-[10px] text-lilac-dark">{record.category}</span><ActionChevron />
    </button>)}</div> : <div className="aa-empty text-center text-sm text-muted"><AaReaction /><p>{emptyText}</p><p className="mt-2 text-xs">第一杯的位置，给你留着。</p></div>}
    <ActionButton variant="secondary" className="mt-4 w-full" onClick={() => openEditor(null, date)}>＋ 再记一杯</ActionButton>
  </div>;
}
