import { useState } from 'react';
import { useDiary } from '../state/DiaryContext.jsx';
import { newestFirst } from '../lib/records.js';
import { drinkStamps, drinkStampKey } from '../lib/collection.js';
import { photoSrc } from '../lib/assets.js';
import { STAMP_FLAVORS, STAMP_FRAMES } from '../lib/stampDesigns.js';
import StampDetails from '../components/StampDetails.jsx';
import StampArtwork from '../components/StampArtwork.jsx';
import CupPhoto from '../components/CupPhoto.jsx';
import winterGirl from '../assets/aa-winter.webp';
import stampingGirl from '../assets/aa-stamp-base.webp';
import stampingDown from '../assets/aa-stamp-down.webp';
import BackupPage from './BackupPage.jsx';

function DrinkStamp({ stamp, onClick }) {
  const { setStampDesign } = useDiary();
  const [error, setError] = useState('');
  function change(key, value) {
    try { setStampDesign(stamp.key, { flavor: 'auto', frame: 'auto', ...stamp.stampDesign, [key]: value }); setError(''); }
    catch (e) { setError(e.message); }
  }
  return <div className="drink-stamp-item"><button type="button" style={{color:stamp.design.ink}} className={`drink-stamp drink-stamp--${stamp.design.art || 'composed'}`} onClick={onClick} aria-label={`查看 ${stamp.brand} ${stamp.name}，喝过 ${stamp.count} 次`}>
    <span className="drink-stamp-face">
      <StampArtwork design={stamp.design} />
      <span className="drink-stamp-type"><strong>{stamp.name.length > 12 ? `${stamp.name.slice(0, 11)}…` : stamp.name}</strong><span>{stamp.brand || '我的一杯'}</span></span>
      <span className="drink-stamp-date">{stamp.date.replaceAll('-', '.')}</span>
    </span>
    <span className="drink-stamp-label">{stamp.name}</span><span className="drink-stamp-count">喝过 × {stamp.count}</span>
  </button><details className="stamp-customize"><summary>换个章面</summary>
    <label>口味<select aria-label={`${stamp.name}的印章口味`} value={stamp.stampDesign?.flavor || 'auto'} onChange={e=>change('flavor',e.target.value)}><option value="auto">自动识别</option>{Object.entries(STAMP_FLAVORS).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}</select></label>
    <label>边框<select aria-label={`${stamp.name}的印章边框`} value={stamp.stampDesign?.frame || 'auto'} onChange={e=>change('frame',e.target.value)}>{Object.entries(STAMP_FRAMES).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
    <p>同款饮品共用，自动保存。</p>
  </details>{error && <p role="alert" className="text-xs text-rose-800">{error}</p>}</div>;
}

export default function CollectionPage() {
  const { records, openEditor, error } = useDiary();
  const [view, setView] = useState('stamps'), [selected, setSelected] = useState(null);
  const stamps = drinkStamps(records);
  const shown = newestFirst(records);
  const selectedStamp = stamps.find(stamp => stamp.key === selected);
  return <section className="collection-page py-7 sm:py-10">
    <div className="collection-heading"><div><p className="collection-eyebrow">AA’S LITTLE COLLECTION</p><h1>AA 的杯杯集章册</h1><p className="mt-2 text-xs text-muted">喝过的每一杯，都有自己的位置。</p></div><button className="btn-primary text-xs" onClick={() => openEditor()}>＋ 记一杯</button></div>
    <div className="collection-switch" role="group" aria-label="收藏类型"><button type="button" aria-pressed={view === 'stickers'} onClick={() => { setView('stickers'); setSelected(null); }}>奶茶贴纸 <span>{records.length}</span></button><button type="button" aria-pressed={view === 'stamps'} onClick={() => { setView('stamps'); setSelected(null); }}>饮品印章 <span>{stamps.length}</span></button></div>
    <div className="collection-book">
      <div className="collection-book-heading"><span>{view === 'stickers' ? '一杯一贴，慢慢收藏' : '每款喜欢，都有专属印记'}</span><span className="text-[10px] text-muted">{view === 'stickers' ? '点击贴纸，翻看这杯' : '点击印章，翻看这款饮品'}</span></div>
      {view === 'stickers' && <>

        {shown.length ? <div className="sticker-shelf">{shown.map((record, i) => <button type="button" className="collected-sticker" key={record.id} onClick={() => openEditor(record)} aria-label={`查看 ${record.name || record.category}，${record.date}`}>
          <div className="collected-cup" style={{ '--sticker-angle': `${[-7, 5, -3, 7][i % 4]}deg` }}><CupPhoto src={photoSrc(record)} className="sticker" alt="" /></div>
          <span className="collected-name">{record.name || record.category}</span><span className="collected-brand">{record.brand || '我的一杯'}</span><span className="collected-date">{record.date.replaceAll('-', '.')}</span>
        </button>)}</div> : <div className="collection-empty"><img className="collection-winter-girl" src={winterGirl} alt="冬日 AA 捧着热奶茶，等你记录第一杯" /><p>第一张贴纸的位置，给你留好了。</p><button type="button" className="btn-small mt-4" onClick={() => openEditor()}>记下第一杯</button></div>}
      </>}
      {view === 'stamps' && <>
        <p className="mb-6 text-xs leading-loose text-muted">同品牌、同饮品收藏一枚章，重复喝会累积次数。日期是第一次记录；甜度、冰量不另分章。</p>
        {stamps.length ? <div className="drink-stamp-shelf">{stamps.map(stamp => <DrinkStamp key={stamp.key} stamp={stamp} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setSelected(stamp.key); }} />)}</div> : <div className="collection-empty"><div className="winter-stamp-welcome"><div className="collection-stamping-girl stamp-motion" role="img" aria-label="冬日 AA 轻轻落章，再抬起印章，等你来集章"><img className="stamp-still" src={stampingGirl} alt="" /><img className="stamp-moving-arm" src={stampingDown} alt="" /></div></div><p>第一枚章的位置，给你留好了。</p><button type="button" className="btn-small mt-4" onClick={() => openEditor()}>去记一杯</button></div>}
      </>}
      <p className="collection-book-footer">{view === 'stickers' ? '属于 AA 的杯杯回忆' : '每一枚，都是喝过的印记'} · ♡</p>
    </div>
    {selectedStamp && <StampDetails stamp={selectedStamp} records={records.filter(row => drinkStampKey(row) === selected)} onClose={() => setSelected(null)} />}
    <details className="collection-backup" open={error ? true : undefined}><summary>收好这本小账本 <span>备份 / 恢复记录</span></summary><BackupPage /></details>
  </section>;
}
