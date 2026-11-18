import { useState } from 'react';
import { Link } from 'react-router';
import TeaGirl from '../components/TeaGirl.jsx';
import CupPhoto from '../components/CupPhoto.jsx';
import TasteCups from '../components/TasteCups.jsx';
import RecordList from '../components/RecordList.jsx';
import { useDiary } from '../state/DiaryContext.jsx';
import { dateKey, weekStart, offsetDay, shortDate } from '../lib/dates.js';
import { inWeek } from '../lib/records.js';
import { asset, photoSrc } from '../lib/assets.js';
export default function HomePage() {
 const {records,openEditor,editor}=useDiary();
 const [week,setWeek]=useState(()=>weekStart(new Date()));
 const [selected,setSelected]=useState(null);
 const items=inWeek(records,week), end=offsetDay(week,6);
 const latest=[...records].sort((a,b)=>b.date.localeCompare(a.date)).at(0);
 const changeWeek=(n)=>{setWeek(offsetDay(week,n));setSelected(null);};
 return <>
 <section className="new-hero">
  <div className="banner-snow" aria-hidden="true">
    {Array.from({ length: 16 }, (_, index) => (
      <span key={index} style={{
        '--snow-x': `${(index * 37 + 8) % 97}%`,
        '--snow-size': `${2 + (index * 3) % 5}px`,
        '--snow-duration': `${8 + index % 6}s`,
        '--snow-delay': `${-index * .81}s`,
        '--snow-drift': `${index % 2 ? 21 : -18}px`,
      }} />
    ))}
  </div>
  <p className="new-masthead">AA的杯杯小账本 <span>♧</span></p>
  <div className="new-hero-copy"><h1>今天这杯，<br/>有点来头。</h1><button className="btn-primary" onClick={()=>openEditor(null,dateKey(new Date()))}>记一杯</button></div>
  <span className="new-star" aria-hidden="true">✦</span><div className="new-girl"><TeaGirl/></div>
  <svg className="hero-wave" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 22 Q170 -10 440 35 T1000 12V60H0Z" fill="#fcf1f6"/></svg>
 </section>
 <div className="new-home-body">
 <div className="week-controls"><button aria-label="上一周" onClick={()=>changeWeek(-7)}>‹</button><span>{shortDate(week)} — {shortDate(end)}</span><button aria-label="下一周" onClick={()=>changeWeek(7)}>›</button><button onClick={()=>{setWeek(weekStart(new Date()));setSelected(null);}}>本周</button></div>
 <section className="new-budget" aria-label="本周饮品配额"><span>这周喝了 <strong>{items.length}</strong> 杯</span><small>{items.length>3?'AA超额了！不能再喝了！':`还可以喝 ${3-items.length} 杯`}</small></section>
 <section className="new-week"><div className="section-heading"><h2>这周喝了什么</h2><Link to={`/calendar?month=${dateKey(week).slice(0,7)}`}>杯杯月历 ↗</Link></div>
 <div className="week-strip">{Array.from({length:7},(_,i)=>{const date=offsetDay(week,i),key=dateKey(date),cups=items.filter(r=>r.date===key);return <button key={key} className={`week-day ${key===dateKey(new Date())?'is-today':''} ${selected===key?'is-selected':''}`} onClick={()=>{setSelected(key);if(!cups.length)openEditor(null,key);}} aria-label={`${shortDate(date)}，${cups.length}杯`}><span className="week-weekday">{'一二三四五六日'[i]}</span><span className="week-date">{date.getDate()}</span><span className="week-cup-space"><CupPhoto className={`week-cup ${cups.length?'sticker':'week-cup-empty'}`} src={cups.length?photoSrc(cups.at(-1)):asset('drinks/empty.svg')} alt=""/>{cups.length>1&&<span className="week-count">{cups.length}</span>}</span></button>})}</div>
 {selected&&items.some(r=>r.date===selected)&&<div className="selected-records"><button onClick={()=>setSelected(null)} aria-label="收起当天记录">收起 ×</button><RecordList records={items.filter(r=>r.date===selected)} date={selected}/></div>}
 </section>
 <section className="new-recent"><div className="section-heading"><h2>最近一杯</h2></div>{latest?<button className="recent-drink" onClick={()=>openEditor(latest)}><div className="recent-art"><CupPhoto src={photoSrc(latest)} alt=""/></div><div><h3>{latest.name||latest.category}<i>•</i></h3><p>{[latest.brand,latest.sugar,latest.ice].filter(Boolean).join(' · ')}</p><small>{latest.date}</small></div></button>:<button className="recent-drink empty-recent" onClick={()=>openEditor(null,dateKey(new Date()))}><div className="recent-art"><img src={asset('drinks/milk.webp')} alt=""/></div><div><h3>第一杯，留给喜欢的。</h3><p>记下今天的小小快乐 ↗</p></div></button>}</section>
 <div className="new-taste"><TasteCups records={items}/></div>
 </div>
 {!editor && <button className="home-quick-add" onClick={()=>openEditor(null,selected || dateKey(new Date()))}>＋ 记一杯</button>}
 </>;
}
