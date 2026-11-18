import test from 'node:test';
import assert from 'node:assert/strict';
import { editorErrors } from '../src/lib/editorValidation.js';
import { validRecord, parseBackup } from '../src/lib/records.js';
const row = { id:'validation',date:'2026-11-18',category:'鲜奶茶',name:'乌龙奶茶',brand:'喜茶',sugar:'未选择',ice:'未选择',note:'' };
test('日期品类品牌名称必填，照片可省略',()=>{
  assert.deepEqual(editorErrors(row),{});
  assert.ok(editorErrors({...row,name:'   '}).name);
  assert.ok(editorErrors({...row,brand:''}).brand);
  assert.ok(editorErrors({...row,brand:'   '}).brand);
  assert.ok(editorErrors({...row,brand:'茶'.repeat(41)}).brand);
  assert.deepEqual(editorErrors({...row,brand:'自定义小店'}),{});
  assert.ok(editorErrors({...row,category:'   '}).category);
  assert.ok(editorErrors({...row,date:'2026-02-30'}).date);
  assert.ok(editorErrors({...row,date:''}).date);
  assert.ok(editorErrors({...row,name:'茶'.repeat(61)}).name);
});
test('选填价格校验范围、小数位和非数字',()=>{
  for (const price of [null,undefined,0,12.3,12.34,99999]) assert.deepEqual(editorErrors({...row,price}),{});
  for (const price of [-1,100000,12.345,NaN,Infinity]) assert.ok(editorErrors({...row,price}).price);
  assert.ok(editorErrors({...row,rating:6}).other);
});
test('旧记录和备份仍可读取，编辑保存需补名称和品牌',()=>{
  const old = {...row,name:'',brand:''};
  assert.equal(validRecord(old),true);
  assert.deepEqual(parseBackup(JSON.stringify({version:1,records:[old]})),[old]);
  assert.ok(editorErrors(old).name);
  assert.ok(editorErrors(old).brand);
});
