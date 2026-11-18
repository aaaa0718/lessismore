import { isDate, dateKey, offsetDay, monthPrefix } from './dates.js';
import { validStampDesign } from './stampDesigns.js';

export const STORAGE_KEY = 'lessismore-diary-v1';
export const WEEKLY_LIMIT = 3;
export const CATEGORIES = ['鲜奶茶', '传统奶茶', '果茶', '纯茶', '咖啡', '其他'];
export const SUGARS = ['未选择', '无糖', '三分糖', '五分糖', '七分糖', '全糖'];
export const ICES = ['未选择', '正常冰', '少冰', '去冰', '常温', '热饮'];
export function validRecord(record) {
  return !!record && typeof record.id === 'string' && record.id.length > 0 && isDate(record.date)
    && typeof record.category === 'string' && record.category.trim().length > 0 && record.category.length <= 20
    && ['name', 'brand', 'sugar', 'ice', 'note'].every(key => typeof record[key] === 'string' && record[key].length <= 200)
    && validStampDesign(record.stampDesign)
    && (record.size === undefined || (typeof record.size === 'string' && record.size.length <= 20))
    && (record.toppings === undefined || (Array.isArray(record.toppings) && record.toppings.length <= 12 && record.toppings.every(v => typeof v === 'string' && v.length > 0 && v.length <= 30)))
    && (record.price === undefined || record.price === null || (typeof record.price === 'number' && Number.isFinite(record.price) && record.price >= 0 && record.price <= 99999))
    && (record.rating === undefined || record.rating === null || (Number.isInteger(record.rating) && record.rating >= 1 && record.rating <= 5))
    && (record.photo === undefined || record.photo === '' || (typeof record.photo === 'string' && record.photo.length <= 400000 && /^data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(record.photo)));
}
export function decodeRecords(raw) {
  const data = JSON.parse(raw ?? '[]');
  if (!Array.isArray(data) || !data.every(validRecord)) throw new Error('原有记录无法读取。为保护数据，暂时停止写入，请先导出原始数据。');
  return data;
}
export function readStore(storage) {
  try { return { records: decodeRecords(storage.getItem(STORAGE_KEY)), error: '' }; }
  catch (error) { return { records: [], error: error.message || '无法访问本地存储。' }; }
}
export function writeStore(storage, records) {
  if (!records.every(validRecord)) throw new Error('请检查日期、品类和照片是否有效。');
  try { storage.setItem(STORAGE_KEY, JSON.stringify(records)); }
  catch { throw new Error('保存失败，浏览器存储可能已满。原记录未改变，请先导出备份。'); }
}
export function parseBackup(text) {
  if (text.length > 25e6) throw new Error('备份文件过大，请选择 25MB 以内的备份。');
  const data = JSON.parse(text);
  if (data?.version !== 1 || !Array.isArray(data.records) || !data.records.every(validRecord)) throw new Error('不是有效的杯杯小账本备份文件。');
  return data.records;
}
export function mergeRecords(current, imported) {
  const map = new Map(current.map(record => [record.id, record]));
  let added = 0;
  for (const record of imported) if (!map.has(record.id)) { map.set(record.id, record); added++; }
  return { records: [...map.values()], added };
}
export const inWeek = (records, start) => records.filter(record => record.date >= dateKey(start) && record.date <= dateKey(offsetDay(start, 6)));
export const inMonth = (records, month) => records.filter(record => record.date.startsWith(monthPrefix(month)));
export function rankRecords(records, key = record => record.category) {
  const counts = new Map();
  records.forEach(record => counts.set(key(record), (counts.get(key(record)) || 0) + 1));
  return [...counts].sort((a, b) => b[1] - a[1]);
}
export const newestFirst = (records) => [...records].sort((a, b) => b.date.localeCompare(a.date));
export function recordDetails(record) {
  return [record.size, ...(record.toppings || []), record.price != null ? `¥${record.price.toFixed(2)}` : '', record.rating ? `${'♥'.repeat(record.rating)} ${record.rating}/5` : ''].filter(Boolean).join(' · ');
}
export function budgetText(count) {
  if (count === 0) return '3 个名额，谁先上？';
  if (count === 1) return '还剩 2 杯，选妃继续。';
  if (count === 2) return '最后 1 杯，慎重翻牌。';
  if (count === WEEKLY_LIMIT) return '本周满员，下周请早。';
  return 'AA超额了！不能再喝了！';
}
