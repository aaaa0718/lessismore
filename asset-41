import test from 'node:test';
import assert from 'node:assert/strict';
import { validRecord, decodeRecords, parseBackup, writeStore, recordDetails } from '../src/lib/records.js';
import { recentBrands } from '../src/lib/brands.js';

const old = { id: 'legacy', date: '2026-11-16', category: '鲜奶茶', brand: '喜茶', name: '奶茶', sugar: '未选择', ice: '未选择', note: '' };
test('新字段通过保存、重新读取和 v1 备份完整往返，旧记录保持不变', () => {
  const next = { ...old, id: 'new', size: '大杯', toppings: ['珍珠', '手作芋泥'], price: 0, rating: 5 };
  let saved;
  writeStore({ setItem: (_, value) => { saved = value; } }, [old, next]);
  assert.deepEqual(decodeRecords(saved), [old, next]);
  assert.deepEqual(parseBackup(JSON.stringify({ version: 1, records: [old, next] })), [old, next]);
  assert.match(recordDetails(next), /¥0.00/);
  assert.equal(recordDetails(old), '');
});
test('拒绝无效价格、评分和加料，允许未填写或清除', () => {
  for (const price of [-1, Infinity, NaN, '20', 100000]) assert.equal(validRecord({ ...old, price }), false);
  for (const rating of [0, 6, 1.5, '5']) assert.equal(validRecord({ ...old, rating }), false);
  for (const toppings of ['珍珠', [42], [''], Array(13).fill('珍珠')]) assert.equal(validRecord({ ...old, toppings }), false);
  assert.ok(validRecord({ ...old, price: null, rating: null, toppings: [], size: '' }));
});
test('品牌历史去重、按日期排序，包含自定义品牌且不改动源记录', () => {
  const rows = [old, { ...old, brand: '小巷茶铺', date: '2026-11-18' }, { ...old, date: '2026-11-17' }];
  assert.deepEqual(recentBrands(rows), ['小巷茶铺', '喜茶']);
  assert.equal(rows[0], old);
});
