import test from 'node:test';
import assert from 'node:assert/strict';
import { drinkStamps, drinkStampKey, stampStyle } from '../src/lib/collection.js';

const record = (overrides = {}) => ({id:'1',brand:'喜茶',name:'多肉葡萄',category:'果茶',date:'2026-11-18',...overrides});
test('同品牌同饮品合章，甜度冰量不拆分，保留初次日期', () => {
  const rows=[record(),record({id:'2',brand:' 喜茶 ',date:'2026-11-16',sugar:'无糖',ice:'热'})];
  const stamps=drinkStamps(rows);
  assert.equal(stamps.length,1); assert.equal(stamps[0].count,2); assert.equal(stamps[0].date,'2026-11-16');
  assert.equal(rows[1].brand,' 喜茶 ');
});
test('不同品牌或饮品分章，未命名记录独立', () => {
  assert.equal(drinkStamps([record(),record({name:'抹茶鲜奶'}),record({brand:'小店'}),record({id:'3',name:''}),record({id:'4',name:''})]).length,5);
  assert.equal(drinkStampKey(record({name:' LATTE  A '})),drinkStampKey(record({name:'latte a'})));
  assert.deepEqual(drinkStamps([]),[]);
});
test('饮品插画类别和色调稳定', () => {
  assert.equal(stampStyle('抹茶拿铁'),'matcha'); assert.equal(stampStyle('冰拿铁'),'coffee');
  assert.equal(stampStyle('多肉葡萄'),'fruit'); assert.equal(stampStyle('珍珠奶茶'),'pearls');
  assert.equal(drinkStamps([record()])[0].hue,drinkStamps([record(),record({id:'2'})])[0].hue);
});
