import test from 'node:test';
import assert from 'node:assert/strict';
import { inferStampFlavor, resolveStampDesign } from '../src/lib/stampDesigns.js';
import { drinkStamps } from '../src/lib/collection.js';
import { validRecord, parseBackup, decodeRecords } from '../src/lib/records.js';
const record={id:'stamp-test',date:'2026-11-18',category:'鲜奶茶',brand:'小店',name:'杨枝甘露',sugar:'少糖',ice:'少冰',note:''};
test('新饮品按口味组合，未知名字不会伪装成葡萄或珍珠',()=>{
  for(const [name,flavor] of [['杨枝甘露','mango'],['草莓拿铁','strawberry'],['白桃乌龙','peach'],['乌龙奶茶','tea'],['芋泥波波','taro'],['抹茶拿铁','matcha'],['生椰拿铁','coffee'],['神秘新品','generic']]) assert.equal(inferStampFlavor(name),flavor);
  assert.equal(inferStampFlavor('新品','果茶'),'generic');
  assert.equal(resolveStampDesign(record).art,undefined);
});
test('手动口味和边框优先，恢复自动后重新识别',()=>{
  assert.equal(resolveStampDesign({...record,stampDesign:{flavor:'lemon',frame:'ticket'}}).flavor,'lemon');
  assert.equal(resolveStampDesign({...record,stampDesign:{flavor:'lemon',frame:'ticket'}}).frame,'ticket');
  assert.equal(resolveStampDesign({...record,stampDesign:{flavor:'auto',frame:'auto'}}).flavor,'mango');
});
test('章面选择随记录备份往返，旧备份兼容，非法选择拒绝',()=>{
  const row={...record,stampDesign:{flavor:'mango',frame:'scallop'}};
  assert.deepEqual(parseBackup(JSON.stringify({version:1,records:[row]})),[row]);
  assert.deepEqual(decodeRecords(JSON.stringify([row])),[row]);
  assert.equal(validRecord(record),true);
  for(const stampDesign of [null,[],{flavor:'unknown',frame:'round'},{flavor:'mango',frame:'bad'}]) assert.equal(validRecord({...record,stampDesign}),false);
});
test('重复喝继承已有章面，不影响次数和初次日期',()=>{
  const stamp=drinkStamps([{...record,stampDesign:{flavor:'peach',frame:'ticket'}},{...record,id:'another',date:'2026-11-19'}])[0];
  assert.equal(stamp.count,2);assert.equal(stamp.date,'2026-11-18');assert.equal(stamp.design.flavor,'peach');
});
