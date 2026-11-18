import { WEEKLY_LIMIT, budgetText } from '../lib/records.js';
import { asset } from '../lib/assets.js';

export default function WeeklyBudget({ count }) {
  return <section className="paper-panel mb-7" aria-label="每周饮品额度">
    <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-sm font-medium">本周饮品配额</h2><strong className={`font-serif text-lg font-normal ${count > 3 ? 'text-rose-800' : 'text-lilac-dark'}`}>{count} / 3 杯</strong></div>
    <div className="grid grid-cols-3 gap-2 sm:gap-3" role="progressbar" aria-label="本周饮品额度使用进度" aria-valuemin={0} aria-valuemax={3} aria-valuenow={Math.min(count, 3)} aria-valuetext={`已喝 ${count} 杯，每周限额 3 杯`}>
      {Array.from({ length: WEEKLY_LIMIT }, (_, i) => <div key={i} aria-hidden="true" className={`flex flex-col items-center justify-center gap-2 rounded-md border px-2 py-3 sm:flex-row sm:gap-3 ${i < count ? 'border-lilac-dark/30 bg-lilac/55' : 'border-dashed border-line bg-cream'}`}><img src={asset('cup.svg')} className={`h-9 w-7 ${i < count ? '' : 'opacity-30 grayscale'}`} alt="" /><span className="text-[10px] text-muted">第 {i + 1} 杯</span></div>)}
    </div>
    <p className={`mt-3 text-[11px] ${count > 3 ? 'text-rose-800' : 'text-muted'}`} aria-live="polite">{budgetText(count)}</p>
  </section>;
}
