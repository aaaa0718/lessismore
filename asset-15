import { useId } from 'react';
import { rankRecords } from '../lib/records.js';

function favorite(records, field) {
  const counts = new Map();
  for (const row of records) if (row[field] && row[field] !== '未选择') counts.set(row[field], (counts.get(row[field]) || 0) + 1);
  const max = Math.max(0, ...counts.values());
  return [...counts].filter(([, n]) => n === max).map(([name]) => name).join(' / ');
}
function TasteCup({ category, ratio, empty }) {
  const id = useId().replaceAll(':', '');
  const coffee = category.includes('咖啡'), fruit = category.includes('果'), tea = category.includes('纯茶');
  const color = coffee ? '#b68a67' : fruit ? '#e9b48e' : tea ? '#b7bf86' : '#d9b58d';
  const top = 136 - ratio * 94;
  const wave = `M-105 ${top} q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`;
  return <svg viewBox="0 0 110 160" role="img" aria-label={empty ? '等待记录的空杯' : `${category}占本周饮品的${Math.round(ratio * 100)}%`}>
    <defs><clipPath id={id}><path d="M22 40 31 137Q55 146 79 137L88 40Z" /></clipPath></defs>
    <ellipse cx="55" cy="150" rx="30" ry="4" fill="#9b8064" opacity=".08" />
    <path d="m62 33 9-25 5 2-9 26" fill="#d9c9e4" stroke="#9b8064" strokeWidth="2" strokeLinejoin="round" />
    <path d="M22 40 31 137Q55 146 79 137L88 40Z" fill="#fffdf4" stroke="#b59c82" strokeWidth="2" />
    {!empty && <g clipPath={`url(#${id})`}>
      <g className="taste-liquid" style={{ transformOrigin: `55px ${top}px` }}>
        <path className="taste-wave taste-wave-back" d={`${wave} V180H-105Z`} fill={color} opacity=".4" />
        <g className="taste-wave taste-wave-front">
          <path d={`${wave} V180H-105Z`} fill={color} />
          <path d={wave} stroke="#fff9e7" strokeWidth="2" opacity=".6" fill="none" />
        </g>
      </g>
      {fruit ? <g fill="#e59a77" stroke="#fff1c8" strokeWidth="2"><circle cx="44" cy="123" r="9"/><circle cx="67" cy="115" r="8"/></g> : coffee ? <path d="M35 132q19-10 40-2v16H35Z" fill="#8a624b" opacity=".3"/> : tea ? <path d="M41 132q-4-17 15-20-1 17-15 20m17 0q0-13 15-13-4 14-15 13" fill="#8e9b66"/> : <g fill="#92765e">{[[40,130],[54,133],[68,128],[46,117],[62,117]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="3.7"/>)}</g>}
    </g>}
    <path d="m29 49 6 60" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".65" />
    <path d="M18 34Q55 28 92 34L91 42Q55 47 19 42Z" fill="#faf3df" stroke="#a68c72" strokeWidth="2" strokeLinejoin="round" />
    {empty && <path d="M47 83q8-12 16 0 0 8-8 14-8-6-8-14" fill="none" stroke="#d6c5b0" strokeWidth="1.7" />}
  </svg>;
}
export default function TasteCups({ records }) {
  const ranked = rankRecords(records), empty = !ranked.length;
  const shown = empty ? [['奶茶',0],['果茶',0],['咖啡',0]] : ranked.slice(0,3);
  const sugar = favorite(records, 'sugar'), ice = favorite(records, 'ice');
  return <section className="paper-panel taste-panel">
    <div className="taste-heading"><h2 className="text-sm font-medium">我的口味偏好</h2><span>本周 · {records.length} 杯</span></div>
    <p className="taste-intro">{empty ? '你的口味，慢慢装满' : '偏爱哪一口，杯子知道'}</p>
    <div className={`taste-cups ${empty ? 'is-empty' : ''}`}>{shown.map(([category,count]) => {
      const best = !empty && count === ranked[0][1];
      return <div className={`taste-item ${best ? 'is-favorite' : ''}`} key={category}>
        <span className="taste-badge">{best ? (ranked.filter(([,n])=>n===count).length>1 ? '并列偏爱' : '偏爱') : '\u00a0'}</span>
        <TasteCup category={category} ratio={empty ? 0 : count / records.length} empty={empty}/>
        <span className="taste-name">{category}</span>
        {!empty && <span className="taste-amount">{count} 杯 · {Math.round(count / records.length * 100)}%</span>}
      </div>;
    })}</div>
    {!empty && <p className="taste-caption">液面表示本周占比{ranked.length>3 ? ' · 展示前三类' : ''}</p>}
    {(sugar || ice) && <div className="taste-tags">{sugar && <span>甜度偏爱 · {sugar}</span>}{ice && <span>温度偏爱 · {ice}</span>}</div>}
    {empty && <p className="taste-caption">记下第一杯，这里就有了你的颜色</p>}
  </section>;
}
