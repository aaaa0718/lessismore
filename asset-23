import { isDate } from './dates.js';
import { validRecord } from './records.js';

// Editor requirements are stricter than the storage schema, so old unnamed
// records and backups stay readable without being silently rewritten.
export function editorErrors(record) {
  const errors = {};
  if (!isDate(record.date)) errors.date = '请填写有效日期';
  if (!record.category.trim() || record.category.trim().length > 20) errors.category = '请填写品类（最多 20 字）';
  if (!record.brand.trim()) errors.brand = '请选择或填写品牌';
  else if (record.brand.trim().length > 40) errors.brand = '品牌最多 40 字';
  if (!record.name.trim()) errors.name = '请填写饮品名';
  else if (record.name.trim().length > 60) errors.name = '饮品名最多 60 字';
  if (record.price != null && (!Number.isFinite(record.price) || record.price < 0 || record.price > 99999 || Math.abs(record.price * 100 - Math.round(record.price * 100)) > 1e-7)) errors.price = '价格需为 0～99999 元，最多两位小数';
  if (!Object.keys(errors).length && !validRecord(record)) errors.other = '请检查照片、评分或其他选填内容是否有效';
  return errors;
}
