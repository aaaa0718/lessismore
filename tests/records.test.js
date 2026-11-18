import test from 'node:test';
import assert from 'node:assert/strict';
import { dateKey, parseDate, weekStart, monthCells, offsetMonth } from '../src/lib/dates.js';
import { decodeRecords, readStore, writeStore, parseBackup, mergeRecords, inWeek, rankRecords, budgetText } from '../src/lib/records.js';

const legacy = { id: 'old', date: '2026-11-17', category: '鲜奶茶', name: '桂花奶茶', brand: '', sugar: '', ice: '', note: '' };
test('旧记录及带照片的 v1 备份可无损读取', () => {
  assert.deepEqual(decodeRecords(JSON.stringify([legacy])), [legacy]);
  const photo = { ...legacy, photo: 'data:image/png;base64,YQ==' };
  assert.deepEqual(parseBackup(JSON.stringify({ version: 1, records: [photo] })), [photo]);
});
test('损坏记录被报告且读取不会覆盖原数据', () => {
  const storage = { getItem: () => '{broken', setItem: () => assert.fail('must not write') };
  assert.ok(readStore(storage).error);
  assert.throws(() => parseBackup(JSON.stringify({ version: 1, records: [{ ...legacy, date: '2026-02-30' }] })));
  assert.throws(() => decodeRecords('{}'));
});
test('存储容量不足明确失败', () => {
  assert.throws(() => writeStore({ setItem: () => { throw new Error('QuotaExceeded'); } }, [legacy]), /保存失败/);
});
test('备份重复 ID 保留已有记录并只计数新记录', () => {
  const incoming = { ...legacy, id: 'new' };
  assert.deepEqual(mergeRecords([legacy], [{ ...legacy, name: 'changed' }, incoming, incoming]), { records: [legacy, incoming], added: 1 });
});
test('周一开始的跨年周和周日边界', () => {
  const start = weekStart(parseDate('2027-01-03'));
  assert.equal(dateKey(start), '2026-12-28');
  const rows = ['2026-12-27', '2026-12-28', '2027-01-03', '2027-01-04'].map(date => ({ ...legacy, date }));
  assert.deepEqual(inWeek(rows, start).map(r => r.date), ['2026-12-28', '2027-01-03']);
});
test('闰年月份、月末切换和统计特殊字符串', () => {
  assert.equal(monthCells(parseDate('2024-02-01')).filter(Boolean).length, 29);
  assert.equal(dateKey(offsetMonth(parseDate('2026-01-31'), 1)), '2026-02-01');
  assert.deepEqual(rankRecords([{ category: '__proto__' }, { category: '__proto__' }]), [['__proto__', 2]]);
  assert.equal(budgetText(4), 'AA超额了！不能再喝了！');
});
