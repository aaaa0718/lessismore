import { resolveStampDesign } from './stampDesigns.js';
const normalize = value => (value || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
export function drinkStampKey(record) {
  return normalize(record.name) ? JSON.stringify([normalize(record.brand), normalize(record.name)]) : JSON.stringify(['unnamed', record.id]);
}
export function stampStyle(name, category = '') {
  const text = `${name} ${category}`;
  if (/抹茶|茉绿|绿茶|开心果/i.test(text)) return 'matcha';
  if (/咖啡|拿铁|美式|摩卡|卡布|coffee|latte/i.test(text)) return 'coffee';
  if (/葡萄|莓|桃|芒|柠|橙|果|荔枝|杨梅|西瓜/i.test(text)) return 'fruit';
  return 'pearls';
}
export function drinkStamps(records) {
  const groups = new Map();
  for (const record of records) {
    const key = drinkStampKey(record), stamp = groups.get(key);
    if (stamp) { stamp.count++; if (record.date < stamp.date) stamp.date = record.date; if (record.stampDesign) stamp.stampDesign = record.stampDesign; }
    else {
      const name = record.name.trim() || record.category;
      let hash = 0; for (const char of key) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
      groups.set(key, { key, name, category: record.category, brand: record.brand.trim(), count: 1, date: record.date, style: stampStyle(name, record.category), hue: (hash % 17) - 8, seed: hash, stampDesign: record.stampDesign });
    }
  }
  return [...groups.values()].map(stamp => ({ ...stamp, design: resolveStampDesign(stamp, stamp.seed) })).sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name, 'zh-CN'));
}
