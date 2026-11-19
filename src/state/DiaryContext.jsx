import { createId } from '../lib/id.js';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { readStore, writeStore, STORAGE_KEY, decodeRecords, parseBackup, mergeRecords } from '../lib/records.js';
import { dateKey } from '../lib/dates.js';
import { playSound } from '../lib/sounds.js';
import { drinkStampKey } from '../lib/collection.js';
import { resolveStampDesign } from '../lib/stampDesigns.js';

const DiaryContext = createContext(null);
export function DiaryProvider({ children }) {
  const [store, setStore] = useState(() => {
    try { return readStore(window.localStorage); } catch { return { records: [], error: '无法访问浏览器存储。' }; }
  });
  const current = useRef(store);
  const [editor, setEditor] = useState(null);
  const [notice, setNotice] = useState(null);
  const timer = useRef();
  const notify = useCallback((text, flavor) => {
    setNotice({ text, flavor, key: createId() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 4500);
  }, []);
  useEffect(() => {
    const changed = event => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      let next;
      try { next = { records: decodeRecords(event.newValue), error: '' }; }
      catch (error) { next = { ...current.current, error: error.message }; }
      current.current = next; setStore(next);
    };
    window.addEventListener('storage', changed);
    return () => { window.removeEventListener('storage', changed); clearTimeout(timer.current); };
  }, []);
  function commit(update) {
    if (current.current.error) throw new Error(current.current.error);
    const next = update(current.current.records);
    writeStore(window.localStorage, next);
    current.current = { records: next, error: '' };
    setStore(current.current);
  }
  function save(record) {
    const newStamp = !current.current.records.some(row => drinkStampKey(row) === drinkStampKey(record));
    const stampDesign = record.stampDesign || current.current.records.find(row =>
      drinkStampKey(row) === drinkStampKey(record) && row.stampDesign
    )?.stampDesign;
    const savedRecord = { ...record, ...(stampDesign ? { stampDesign } : {}) };
    commit(rows => [...rows.filter(row => row.id !== record.id), savedRecord]);
    notify('这杯已归入 AA 名下。', resolveStampDesign(savedRecord).flavor);
    void playSound('saved', { newStamp });
  }
  function remove(id) { commit(rows => rows.filter(row => row.id !== id)); notify('这杯记录已删除'); }
  function setStampDesign(key, stampDesign) {
    commit(rows => rows.map(row => drinkStampKey(row) === key ? { ...row, stampDesign } : row));
    notify('这款饮品的章面已换好');
  }
  function importBackup(text) {
    const imported = parseBackup(text); let added = 0;
    commit(rows => { const result = mergeRecords(rows, imported); added = result.added; return result.records; });
    notify(`导入成功，新增 ${added} 杯记录（重复记录已跳过）`);
    return added;
  }
  const openEditor = (record = null, date = dateKey(new Date())) => setEditor({ record, date, key: createId() });
  return <DiaryContext.Provider value={{ ...store, editor, openEditor, closeEditor: () => setEditor(null), save, remove, setStampDesign, notify, notice, importBackup }}>{children}</DiaryContext.Provider>;
}
export function useDiary() { return useContext(DiaryContext); }
