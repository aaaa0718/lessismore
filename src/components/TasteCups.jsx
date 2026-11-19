import { useId } from 'react';
import { rankRecords } from '../lib/records.js';
import { asset } from '../lib/assets.js';

function favorite(records, field) {
  const counts = new Map();
  for (const row of records) if (row[field] && row[field] !== '未选择') counts.set(row[field], (counts.get(row[field]) || 0) + 1);
  const max = Math.max(0, ...counts.values());
  return [...counts].filter(([, n]) => n === max).map(([name]) => name).join(' / ');
}
function TasteCup({ category, ratio, empty }) {
  const maskId = useId();
  const isFruitTea = category.includes('果');
  const artwork = /咖啡|拿铁|美式|摩卡/.test(category) || isFruitTea
    ? 'coffee'
    : /纯茶|抹茶/.test(category) ? 'matcha' : 'milk';
  const cup = {
    href: asset(`drinks/${artwork}.webp`),
    x: 0, y: 2, width: 120, height: 148,
  };
  const surface = 147 - ratio * 95;
  const wave = `M-100 ${surface} q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`;

  return <svg viewBox="0 0 120 160" role="img" aria-label={empty ? `${category}空杯` : `${category}占本周饮品的${Math.round(ratio * 100)}%`}>
    <ellipse cx="60" cy="154" rx="34" ry="3.5" fill="#9277a5" opacity=".10" />
    <image {...cup} className={`taste-cup-shell${isFruitTea ? ' is-fruit' : ''}`} />
    {!empty && <>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="160">
          <g className="taste-liquid" style={{ transformOrigin: `60px ${surface}px` }}>
            <path className="taste-wave taste-wave-front" d={`${wave} V180H-100Z`} fill="white" />
          </g>
        </mask>
      </defs>
      <image {...cup} className={isFruitTea ? 'taste-cup-fruit' : undefined} mask={`url(#${maskId})`} />
    </>}
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
