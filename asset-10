import { createId } from '../lib/id.js';
import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, ICES, SUGARS } from '../lib/records.js';
import { editorErrors } from '../lib/editorValidation.js';
import { useDiary } from '../state/DiaryContext.jsx';
import PhotoEditor from './PhotoEditor.jsx';
import BrandPicker from './BrandPicker.jsx';

export default function RecordEditor({ record, date }) {
  const { records, save, remove, closeEditor } = useDiary();
  const [form, setForm] = useState(() => record ? { ...record } : { id: createId(), date, category: '鲜奶茶', brand: '', name: '', sugar: '未选择', ice: '未选择', note: '', photo: '' });
  const [custom, setCustom] = useState(false), [customCategory, setCustomCategory] = useState('');
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [extraTopping, setExtraTopping] = useState('');
  const [invalidPrice, setInvalidPrice] = useState(false);
  const next = { ...form, category: (custom ? customCategory : form.category).trim(), name: form.name.trim(), brand: form.brand.trim(), note: form.note.trim() };
  const errors = editorErrors(next);
  if (invalidPrice) errors.price = '请填写有效价格';
  const canSave = !busy && !Object.keys(errors).length;
  const historyNames = [...new Set([...records].reverse().filter(row => row.brand === form.brand && row.name).map(row => row.name))].slice(0, 6);
  const toppings = [...new Set(['珍珠', '椰果', '布丁', '奶盖', '芋圆', '红豆', ...(form.toppings || [])])];
  function toggleTopping(value) {
    const current = form.toppings || [];
    if (!current.includes(value) && current.length >= 12) { setError('最多选择 12 种加料。'); return; }
    change('toppings', current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  }
  const dialog = useRef(null);
  const drinkName = useRef(null);
  function brandSelected() {
    requestAnimationFrame(() => {
      drinkName.current?.focus({ preventScroll: true });
      drinkName.current?.scrollIntoView({ block: 'nearest' });
    });
  }
  const categories = [...new Set([...CATEGORIES, ...records.map(row => row.category)])];
  const change = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  useEffect(() => {
    const element = dialog.current, previousFocus = document.activeElement;
    element.showModal();
    return () => { element.close(); previousFocus?.focus?.(); };
  }, []);
  function submit(event) {
    event.preventDefault(); if (!canSave) return;
    try { save(next); closeEditor(); } catch (error) { setError(error.message); }
  }
  function deleteRecord() {
    if (!window.confirm('确定删除这杯记录吗？')) return;
    try { remove(record.id); closeEditor(); } catch (error) { setError(error.message); }
  }
  return <dialog ref={dialog} onCancel={event => { event.preventDefault(); closeEditor(); }} className="record-dialog">
    <form onSubmit={submit} noValidate className="record-form">
      <header className="record-form-header">
      <div className="flex items-center justify-between gap-4"><h2 className="text-lg font-medium">{record ? '编辑这杯记录' : '来，报一下这杯'}</h2><button className="btn-icon" type="button" aria-label="关闭" onClick={closeEditor}>×</button></div>
      <p className="mt-1 text-xs text-muted">日期、品类、品牌、饮品名必填，其他选填。</p>
      </header>
      <div className="record-form-body">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><PhotoEditor photo={form.photo} onChange={value => change('photo', value)} onBusy={setBusy} /></div>
        <label className="field col-span-2 sm:col-span-1">日期 *<input name="date" type="date" required value={form.date} onChange={event => change('date', event.target.value)} /></label>
        <label className="field col-span-2 sm:col-span-1">品类 *<select name="category" value={custom ? '__custom' : form.category} onChange={event => { setCustom(event.target.value === '__custom'); if (event.target.value !== '__custom') change('category', event.target.value); }}>{categories.map(c => <option key={c}>{c}</option>)}<option value="__custom">＋ 自定义品类</option></select></label>
        {custom && <label className="field col-span-2">自定义品类 *<input autoFocus required maxLength={20} value={customCategory} onChange={event => setCustomCategory(event.target.value)} placeholder="例如：酸奶饮品" /></label>}
        <div className="col-span-2"><BrandPicker onSelect={brandSelected} value={form.brand} onChange={value => change('brand', value)} records={records} /></div>
        <label className="field col-span-2">饮品名 *<input ref={drinkName} name="name" required maxLength={60} value={form.name} onChange={event => change('name', event.target.value)} placeholder="这杯叫什么名字？" /></label>
        {historyNames.length > 0 && <div className="col-span-2"><p className="mb-2 text-xs text-muted">这家以前喝过</p><div className="choice-row">{historyNames.map(name => <button type="button" className="choice-chip" key={name} onClick={() => change('name', name)}>{name}</button>)}</div></div>}
        <Choices title="甜度" values={[...new Set([...SUGARS, form.sugar].filter(Boolean))]} value={form.sugar || '未选择'} onChange={v => change('sugar', v)} />
        <Choices title="冰量" values={[...new Set([...ICES, form.ice].filter(Boolean))]} value={form.ice || '未选择'} onChange={v => change('ice', v)} />
        <details className="record-extras col-span-2" open={record && !!(record.note || record.size || record.toppings?.length || record.price != null || record.rating) ? true : undefined}>
          <summary>再记一点 <span>杯型 · 加料 · 价格 · 评分 · 备注</span></summary>
          <div className="mt-5 grid gap-5">
            <Choices title="杯型（选填）" values={['未选择', '小杯', '中杯', '大杯', '超大杯']} value={form.size || '未选择'} onChange={v => change('size', v === '未选择' ? '' : v)} />
            <fieldset><legend className="mb-2 text-xs">加料（选填，可多选）</legend><div className="choice-row">{toppings.map(t => <button key={t} type="button" className="choice-chip" aria-pressed={(form.toppings || []).includes(t)} onClick={() => toggleTopping(t)}>{t}</button>)}</div>
              <div className="mt-3 flex gap-2"><label className="field flex-1"><span className="sr-only">自定义加料</span><input maxLength={30} value={extraTopping} onChange={e => setExtraTopping(e.target.value)} placeholder="其他加料" /></label><button type="button" className="btn-small" disabled={!extraTopping.trim()} onClick={() => { const v = extraTopping.trim(); if (!(form.toppings || []).includes(v)) toggleTopping(v); setExtraTopping(''); }}>添加</button></div>
            </fieldset>
            <label className="field">价格（元，选填）<input name="price" type="number" inputMode="decimal" min="0" max="99999" step="0.01" value={form.price ?? ''} aria-invalid={!!errors.price} onChange={e => { setInvalidPrice(e.target.validity.badInput); change('price', e.target.value === '' ? null : Number(e.target.value)); }} placeholder="输入金额" />{errors.price && <span className="text-xs text-rose-800">{errors.price}</span>}</label>
            <fieldset><legend className="mb-2 text-xs">评分（选填）</legend><div className="choice-row">{[1, 2, 3, 4, 5].map(n => <button type="button" className="choice-chip rating-chip" key={n} aria-label={`${n} 分`} aria-pressed={form.rating === n} onClick={() => change('rating', form.rating === n ? null : n)}>{'♥'.repeat(n)}</button>)}<button type="button" className="btn-small" onClick={() => change('rating', null)}>清除</button></div></fieldset>
            <label className="field">备注<textarea name="note" rows={3} maxLength={200} value={form.note} onChange={event => change('note', event.target.value)} placeholder="好喝吗？值得 AA 再点一次吗？" /></label>
          </div>
        </details>
      </div>
      </div>
      <footer className="record-form-footer">
        <p className="text-xs text-muted" aria-live="polite">{busy ? '照片处理完成后即可保存' : Object.values(errors).join('；') || '信息已填好，可以记下这杯了'}</p>
        {error && <p className="text-xs text-rose-900" role="alert">{error}</p>}
        <div className="flex items-center gap-4">{record && <button type="button" className="text-xs text-rose-800 shrink-0" onClick={deleteRecord} disabled={busy}>删除这杯</button>}<button type="submit" className="btn-primary record-save" disabled={!canSave}>{busy ? '贴纸处理中…' : record ? '保存修改' : '记一杯'}</button></div>
      </footer>
    </form>
  </dialog>;
}
function Choices({ title, values, value, onChange }) {
  return <fieldset className="col-span-2"><legend className="mb-2 text-xs">{title}</legend><div className="choice-row">{values.map(v => <button type="button" key={v} className="choice-chip" aria-pressed={value === v} onClick={() => onChange(v)}>{v}</button>)}</div></fieldset>;
}
