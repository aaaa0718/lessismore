import { useSearchParams } from 'react-router';
import RecordList from '../components/RecordList.jsx';
import { useDiary } from '../state/DiaryContext.jsx';

export default function RecordsPage() {
  const { records, openEditor } = useDiary();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const shown = records.filter(row => [row.name, row.brand, row.category, row.date, row.note].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <section className="py-7 sm:py-10"><div className="mb-6 flex items-center justify-between gap-3"><div><h1 className="text-xl font-medium">喝过的，都在这儿</h1><p className="mt-2 text-xs text-muted">一共 {records.length} 杯，下次点单可以翻翻。</p></div><button className="btn-primary text-xs" onClick={() => openEditor()}>＋ 记一杯</button></div>
    <label className="field mb-5">找一杯饮品<input type="search" placeholder="搜索饮品、品牌、品类或日期" value={query} onChange={event => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })} /></label>
    <section className="paper-panel"><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-medium">全部记录</h2><span className="text-xs text-muted">{shown.length} 条</span></div><RecordList records={shown} emptyText={query ? '这杯暂时没找到，换个词试试？' : 'AA，还没开喝？'} /></section>
  </section>;
}
