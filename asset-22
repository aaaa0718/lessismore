export const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const parseDate = (value) => new Date(`${value}T12:00:00`);
export function isDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(+parseDate(value)) && dateKey(parseDate(value)) === value;
}
export function offsetDay(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}
export function weekStart(date) {
  const result = new Date(date);
  result.setHours(12, 0, 0, 0);
  return offsetDay(result, -(result.getDay() + 6) % 7);
}
export const monthStart = (date) => new Date(date.getFullYear(), date.getMonth(), 1, 12);
export const offsetMonth = (date, amount) => new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
export const shortDate = (date) => `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
export const monthPrefix = (date) => dateKey(date).slice(0, 7);
export function monthCells(date) {
  const first = monthStart(date);
  const blanks = (first.getDay() + 6) % 7;
  const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return [...Array(blanks).fill(null), ...Array.from({ length }, (_, index) => dateKey(offsetDay(first, index)))];
}
