import { useSearchParams } from 'react-router';
import { useDiary } from '../state/DiaryContext.jsx';
import { dateKey, parseDate, isDate, monthStart, offsetMonth, monthPrefix, monthCells, shortDate } from '../lib/dates.js';
import { inMonth, rankRecords } from '../lib/records.js';
import { photoSrc, asset } from '../lib/assets.js';
import AaPeek from '../components/AaPeek.jsx';
import CupPhoto from '../components/CupPhoto.jsx';

export default function CalendarPage() {
  const { records, openEditor } = useDiary();
  const [params, setParams] = useSearchParams();
  const monthValue = params.get('month');
  const month = monthValue && isDate(`${monthValue}-01`) ? parseDate(`${monthValue}-01`) : monthStart(new Date());
  const prefix = monthPrefix(month), selected = params.get('day');
  const selectedDate = isDate(selected) && selected.startsWith(prefix) ? selected : null;
  const items = inMonth(records, month), days = monthCells(month);
  const brands = new Set(items.map(row => row.brand.trim()).filter(Boolean));
  const favourite = rankRecords(items, row => row.name || row.category)[0];
  const dayItems = records.filter(row => row.date === selectedDate);
  const changeMonth = date => setParams({ month: monthPrefix(date) });
  return <section className="py-7 sm:py-10">
    <div className="mb-6 flex items-end justify-between gap-3"><div><h1 className="text-xl font-medium">AA的杯杯月历</h1><p className="mt-2 text-xs text-muted">一杯一张，慢慢贴满。</p></div><button className="btn-primary text-xs" onClick={() => openEditor(null, selectedDate || dateKey(new Date()))}>＋ 记一杯</button></div>
    <div className="calendar-paper rounded-[22px] border border-sky-dark/30 bg-sky/65 p-3.5 sm:p-7">
      <div className="calendar-companion"><AaPeek /></div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl">{month.toLocaleString('en-US', { month: 'long' })}</h2><p className="mt-1 text-[11px] tracking-widest text-muted">{month.getFullYear()} · AA的杯杯月历</p></div><div className="flex gap-1"><button className="btn-icon" aria-label="上一月" onClick={() => changeMonth(offsetMonth(month, -1))}>←</button><button className="btn-small" onClick={() => changeMonth(monthStart(new Date()))}>本月</button><button className="btn-icon" aria-label="下一月" onClick={() => changeMonth(offsetMonth(month, 1))}>→</button></div></div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">{'一二三四五六日'.split('').map(day => <span key={day} className="pb-1 text-center text-[10px] text-muted sm:text-xs">{day}</span>)}{days.map((day, i) => {
        if (!day) return <span key={`blank-${i}`} />;
        const cups = items.filter(row => row.date === day);
        return <button key={day} onClick={() => setParams({ month: prefix, day })} aria-label={`${shortDate(parseDate(day))}，${cups.length}杯`} aria-pressed={day === selectedDate} aria-current={day === dateKey(new Date()) ? "date" : undefined} className={`month-day ${day === dateKey(new Date()) ? "is-calendar-today" : ""} ${day === selectedDate ? 'border-lilac-dark bg-lilac/65' : day === dateKey(new Date()) ? 'border-2 border-lilac-dark/70 bg-paper/75' : 'border-sky-dark/30 bg-paper/65'}`}>
          <span className="calendar-date-number">{parseDate(day).getDate()}</span>
          {cups.length > 0 && <CupPhoto className={`sticker calendar-cup ${i % 3 ? '-rotate-3' : 'rotate-3'}`} src={photoSrc(cups.at(-1))} alt="" />}
          {cups.length > 1 && <span className="absolute -right-1 -top-1 z-20 grid h-5 min-w-5 place-items-center rounded-full border-2 border-sky bg-lilac-dark px-1 text-[9px] text-white">{cups.length}</span>}
        </button>;
      })}</div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-5">
        <article className="min-w-0 rounded-xl bg-paper/80 p-4 sm:p-5"><h3 className="font-serif text-[10px] tracking-wide text-muted sm:text-xs">THIS MONTH · 本月喝了</h3><strong className="mt-3 block text-2xl font-medium">{items.length} 杯</strong><p className="mt-2 text-[10px] leading-relaxed text-muted">{brands.size} 家店 · 喝过就留下贴纸</p><div className="mt-4 flex min-h-14 pl-2">{items.length ? items.slice(-5).map((row, i) => <img key={row.id} src={photoSrc(row)} className={`sticker -ml-2 h-14 w-8 object-contain sm:h-20 sm:w-12 ${i % 2 ? 'rotate-6' : '-rotate-6'}`} alt={row.name || row.category} />) : <img src={asset('drinks/empty.svg')} className="h-14 w-10 opacity-30" alt="" />}</div></article>
        <article className="min-w-0 rounded-xl bg-paper/80 p-4 sm:p-5"><h3 className="font-serif text-[10px] tracking-wide text-muted sm:text-xs">MONTHLY FAV · 本月偏爱</h3><strong className="mt-3 block break-words text-lg font-medium sm:text-2xl">{favourite?.[0] || '暂时还没偏心谁'}</strong><p className="mt-2 text-[10px] leading-relaxed text-muted">{favourite ? `这个月选了它 ${favourite[1]} 次` : '第一杯，还没登场。'}</p></article>
      </div>
      {selectedDate && <section className="mt-6 border-t border-dashed border-sky-dark/50 pt-5" aria-label="当天饮品详情"><h3 className="mb-4 text-sm">{shortDate(parseDate(selectedDate))} · {dayItems.length} 杯</h3><div className="flex flex-wrap gap-3">{dayItems.length ? dayItems.map(row => <button key={row.id} className="flex w-24 flex-col items-center gap-2 rounded-lg bg-paper p-3" onClick={() => openEditor(row)} aria-label={`编辑 ${row.name || row.category}`}><img src={photoSrc(row)} className="sticker h-20 w-14 object-contain" alt="" /><span className="break-words text-xs">{row.name || row.category}</span><span className="text-[10px] text-muted">{row.brand || '未填写品牌'}</span></button>) : <p className="text-xs text-muted">这一天还没有记录，来贴第一杯？</p>}</div><button className="btn-primary mt-5 text-xs" onClick={() => openEditor(null, selectedDate)}>＋ 给这一天记一杯</button></section>}
    </div>
  </section>;
}
