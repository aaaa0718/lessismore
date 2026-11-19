import { useEffect } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import RecordsPage from './pages/RecordsPage.jsx';
import BackupPage from './pages/BackupPage.jsx';
import CollectionPage from './pages/CollectionPage.jsx';
import RecordEditor from './components/RecordEditor.jsx';
import Opening from './components/Opening.jsx';
import { useDiary } from './state/DiaryContext.jsx';
import { asset, winterStampSrc } from './lib/assets.js';

export default function App() {
  const { editor, error, notice } = useDiary();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return <><Opening /><div className={`diary-shell ${pathname === "/" ? "is-home" : ""} mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-12`}>
    <a href="#main-content" onClick={event => { event.preventDefault(); const main = document.getElementById('main-content'); main.tabIndex = -1; main.focus(); }} className="sr-only focus:not-sr-only">跳到主要内容</a>
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-line py-4 sm:min-h-24">
      <Link to="/" className="flex items-center gap-2 text-lg font-medium tracking-wide sm:text-xl"><img className="h-10 w-7" src={asset('cup.svg')} alt="" />AA的杯杯小账本<span className="ml-2 hidden font-serif text-[10px] italic tracking-[.2em] text-muted lg:inline">DRINK DIARY</span></Link>
      <nav aria-label="主导航" className="main-navigation flex gap-1 text-[11px] sm:text-xs">{[['/', '本周'], ['/calendar', '杯杯月历'], ['/collection', '杯杯集章册'], ['/records', '全部记录']].map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `rounded-md px-2.5 py-2.5 transition-colors sm:px-3 ${isActive ? 'is-current bg-lilac/65 text-lilac-dark' : 'text-muted hover:bg-paper'}`}><span className="nav-icon"><NavIcon to={to} /></span><span>{label}</span></NavLink>)}</nav>
    </header>
    {error && <div className="my-5 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">{error} <Link className="underline" to="/backup">前往备份</Link></div>}
    <main id="main-content"><Routes><Route path="/" element={<HomePage />} /><Route path="/calendar" element={<CalendarPage />} /><Route path="/records" element={<RecordsPage />} /><Route path="/collection" element={<CollectionPage />} /><Route path="/backup" element={<BackupPage />} /><Route path="*" element={<section className="py-20 text-center"><h1 className="text-xl">这一页还没有记录</h1><Link className="btn-primary mt-5 inline-block" to="/">回到本周</Link></section>} /></Routes></main>
    <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-line py-7 text-[10px] text-muted sm:flex-row"><span>♧ AA的杯杯小账本</span><span>仅保存在当前浏览器 · 记得偶尔备份 ♡</span></footer>
    {editor && <RecordEditor key={editor.key} record={editor.record} date={editor.date} />}
    {notice && (notice.flavor
      ? <div key={notice.key} className="aa-saved-notice" role="status">
          <span className="aa-saved-art" aria-hidden="true">
            <img src={winterStampSrc(notice.flavor)} width="88" height="84" alt="" />
            <span className="aa-saved-sparkle">✦</span>
          </span>
          <span>{notice.text}</span>
        </div>
      : <div className="fixed bottom-6 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-md bg-ink px-5 py-3 text-center text-xs text-white shadow-lg" role="status">{notice.text}</div>)}
  </div></>;
}

function NavIcon({ to }) {
  const paths = {
    '/': <><path d="m8 7 1 14h10l1-14M7 7h14M15 7l2-5"/><path d="M12 16h.01M16 18h.01M17 14h.01"/></>,
    '/calendar': <><rect x="4" y="5" width="18" height="17" rx="3"/><path d="M4 10h18M9 3v4M17 3v4M9 14h1M15 14h1M9 18h1M15 18h1"/></>,
    '/collection': <><path d="M10 15V9a4 4 0 0 1 8 0v6M8 15h12l2 5H6ZM7 23h14"/><path d="M11 10h6"/></>,
    '/records': <><rect x="6" y="3" width="15" height="21" rx="2"/><path d="M10 3v21M13 9h5M13 13h5M13 17h3M4 8h4M4 14h4M4 20h4"/></>,
  };
  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[to]}</svg>;
}
