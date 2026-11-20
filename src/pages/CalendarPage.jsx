import PageHeader from '../components/ui/PageHeader.jsx';
import ActionButton from '../components/ui/ActionButton.jsx';
import ActionChevron from '../components/ui/ActionChevron.jsx';
import { useEffect, useRef } from 'react';
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
  const detailHeading = useRef(null);
  const clickedDate = useRef(null);

  function chooseDay(day) {
    if (day === selectedDate) {
      detailHeading.current?.focus();
      return;
    }
    clickedDate.current = day;
    setParams({ month: prefix, day });
  }

  useEffect(() => {
    if (selectedDate && clickedDate.current === selectedDate) {
      clickedDate.current = null;
      detailHeading.current?.focus();
    }
  }, [selectedDate]);

  const changeMonth = date => setParams({ month: monthPrefix(date) });
  return <section className="py-7 sm:py-10">
    <PageHeader title="AA的杯杯月历" description="点日期看当天记录，也可以补记。"
      action={<ActionButton variant="page" onClick={() => openEditor(null, selectedDate || dateKey(new Date()))}>＋ 记一杯</ActionButton>} />
    <div className="calendar-paper rounded-[22px] border border-sky-dark/30 bg-sky/65 p-3.5 sm:p-7">
      <div className="calendar-companion"><AaPeek /></div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl">{month.toLocaleString('en-US', { month: 'long' })}</h2><p className="mt-1 text-[11px] tracking-widest text-muted">{month.getFullYear()} · AA的杯杯月历</p></div><div className="flex gap-1"><ActionButton variant="icon" aria-label="上一月" onClick={() => changeMonth(offsetMonth(month, -1))}>←</ActionButton><ActionButton variant="secondary" onClick={() => changeMonth(monthStart(new Date()))}>本月</ActionButton><ActionButton variant="icon" aria-label="下一月" onClick={() => changeMonth(offsetMonth(month, 1))}>→</ActionButton></div></div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">{'一二三四五六日'.split('').map(day => <span key={day} className="pb-1 text-center text-[10px] text-muted sm:text-xs">{day}</span>)}{days.map((day, i) => {
        if (!day) return <span key={`blank-${i}`} />;
        const cups = items.filter(row => row.date === day);
        return <button key={day} type="button" onClick={() => chooseDay(day)} aria-label={`${shortDate(parseDate(day))}，${cups.length}杯`} aria-pressed={day === selectedDate} aria-current={day === dateKey(new Date()) ? "date" : undefined} className={`month-day ${cups.length ? 'has-drink' : ''} ${day === dateKey(new Date()) ? "is-calendar-today" : ""} ${day === selectedDate ? 'border-lilac-dark bg-lilac/65' : day === dateKey(new Date()) ? 'border-2 border-lilac-dark/70 bg-paper/75' : 'border-sky-dark/30 bg-paper/65'}`}>
          <span className="calendar-date-number">{parseDate(day).getDate()}</span>
          {cups.length > 0 && <CupPhoto balanceBody className="sticker calendar-cup" src={photoSrc(cups.at(-1))} alt="" />}
          {cups.length > 1 && <span className="absolute -right-1 -top-1 z-20 grid h-5 min-w-5 place-items-center rounded-full border-2 border-sky bg-lilac-dark px-1 text-[9px] text-white">{cups.length}</span>}
        </button>;
      })}</div>
      {selectedDate && <section className="calendar-day-details" aria-labelledby="calendar-day-heading">
        <div className="calendar-day-heading">
          <h3 ref={detailHeading} id="calendar-day-heading" tabIndex={-1}>
            {shortDate(parseDate(selectedDate))} · {dayItems.length} 杯
          </h3>
          <ActionButton onClick={() => openEditor(null, selectedDate)}>＋ 给这一天记一杯</ActionButton>
        </div>
        {dayItems.length ? <div className="calendar-day-drinks">
          {dayItems.map(row => <button key={row.id} type="button" className="calendar-drink-button"
            onClick={() => openEditor(row)} aria-label={`编辑 ${row.name || row.category}`}>
            <CupPhoto src={photoSrc(row)} className="sticker h-20 w-14 object-contain" alt="" />
            <span className="break-words text-xs">{row.name || row.category} <ActionChevron /></span>
            <span className="text-[10px] text-muted">{row.brand || '未填写品牌'}</span>
          </button>)}
        </div> : <p className="text-xs text-muted">这一天还没有记录。</p>}
      </section>}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-5">
        <article className="min-w-0 rounded-xl bg-paper/80 p-4 sm:p-5"><h3 className="font-serif text-[10px] tracking-wide text-muted sm:text-xs">THIS MONTH · 本月喝了</h3><strong className="mt-3 block text-2xl font-medium">{items.length} 杯</strong><p className="mt-2 text-[10px] leading-relaxed text-muted">{brands.size} 家店 · 喝过就留下贴纸</p><div className="mt-4 flex min-h-14 pl-2">{items.length ? items.slice(-5).map((row, i) => <img key={row.id} src={photoSrc(row)} className={`sticker -ml-2 h-14 w-8 object-contain sm:h-20 sm:w-12 ${i % 2 ? 'rotate-6' : '-rotate-6'}`} alt={row.name || row.category} />) : <img src={asset('drinks/empty.svg')} className="h-14 w-10 opacity-30" alt="" />}</div></article>
        <article className="min-w-0 rounded-xl bg-paper/80 p-4 sm:p-5"><h3 className="font-serif text-[10px] tracking-wide text-muted sm:text-xs">MONTHLY FAV · 本月偏爱</h3><strong className="mt-3 block break-words text-lg font-medium sm:text-2xl">{favourite?.[0] || '暂时还没偏心谁'}</strong><p className="mt-2 text-[10px] leading-relaxed text-muted">{favourite ? `这个月选了它 ${favourite[1]} 次` : '第一杯，还没登场。'}</p></article>
      </div>

    </div>
  </section>;
}
