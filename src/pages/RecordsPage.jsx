import PageHeader from '../components/ui/PageHeader.jsx';
import ActionButton from '../components/ui/ActionButton.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { useSearchParams } from 'react-router';
import RecordList from '../components/RecordList.jsx';
import { useDiary } from '../state/DiaryContext.jsx';

export default function RecordsPage() {
  const { records, openEditor } = useDiary();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const shown = records.filter(row => [row.name, row.brand, row.category, row.date, row.note].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <section className="py-7 sm:py-10"><PageHeader title="喝过的，都在这儿" description={`一共 ${records.length} 杯，下次点单可以翻翻。`}
      action={<ActionButton variant="page" onClick={() => openEditor()}>＋ 记一杯</ActionButton>} />
    <label className="field mb-5">找一杯饮品<input type="search" placeholder="搜索饮品、品牌、品类或日期" value={query} onChange={event => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })} /></label>
    <section className="paper-panel"><SectionHeading title="全部记录"><span className="text-xs text-muted">{shown.length} 条</span></SectionHeading><RecordList records={shown} emptyText={query ? '这杯暂时没找到，换个词试试？' : 'AA，还没开喝？'} /></section>
  </section>;
}
