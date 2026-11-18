import { useState } from 'react';
import { BRANDS, recentBrands } from '../lib/brands.js';
import { useArtwork } from '../lib/useArtwork.js';

function BrandMark({ name }) {
  const brand = BRANDS.find(item => item.name === name);
  const src = useArtwork(brand?.logo ? `brands/${brand.id}.${brand.logo}` : null);
  const [failed, setFailed] = useState(null);
  return <span className="brand-mark" style={{ '--brand-color': brand?.color || '#8b7197' }}>
    {brand?.logo && failed !== src ? <img src={src} width="52" height="52" alt="" onError={() => setFailed(src)} /> : <span>{brand?.mark || name.slice(0, 2)}</span>}
  </span>;
}
export default function BrandPicker({ value, onChange, onSelect, records }) {
  const [expanded, setExpanded] = useState(false), [query, setQuery] = useState('');
  const recent = recentBrands(records);
  const all = [...new Set([...BRANDS.map(b => b.name), ...records.map(r => r.brand).filter(Boolean)])];
  const choices = expanded ? all.filter(name => name.toLocaleLowerCase().replace(/\s+/g, '').includes(query.toLocaleLowerCase().replace(/\s+/g, ''))) : value ? [value] : recent.length ? recent : BRANDS.slice(0, 4).map(b => b.name);
  return <section className="brand-picker" aria-label="选择饮品品牌">
    <div className="flex items-center justify-between gap-2"><span className="text-xs">{expanded ? '全部品牌' : value ? '已选品牌' : recent.length ? '最近常喝' : '选个品牌'}</span><button type="button" className="text-xs text-lilac-dark" onClick={() => { setExpanded(v => !v); setQuery(''); }}>{expanded ? '收起' : '全部品牌 / 自定义 →'}</button></div>
    {expanded && <label className="field mt-3">搜索品牌<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="输入品牌名称" /></label>}
    <div className="brand-grid">{choices.map(name => <button type="button" key={name} className={`brand-choice ${value === name ? 'is-selected' : ''}`} aria-pressed={value === name} onClick={() => { onChange(name); setExpanded(false); setQuery(''); onSelect?.(); }}><BrandMark name={name} /><span>{name}</span></button>)}</div>
    {expanded && !choices.length && <p className="my-3 text-xs text-muted">还没有这个品牌，在下面添加就好。</p>}
    <label className="field mt-3">品牌 *（可自定义）<input required name="brand" maxLength={40} value={value} onChange={e => onChange(e.target.value)} placeholder="选一个品牌，或填写自己的小店" /></label>
  </section>;
}
