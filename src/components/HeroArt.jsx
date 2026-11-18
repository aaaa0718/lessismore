import Sparkles from './Sparkles.jsx';
import TeaGirl from './TeaGirl.jsx';

export default function HeroArt() {
  return <div className="hero-art">
    <svg className="hero-flower" viewBox="0 0 80 80" fill="none" aria-hidden="true" focusable="false">
      <path d="M40 27C20 3 9 30 27 39 1 50 25 73 39 54c9 26 37 10 20-8 27-5 16-34-5-23C53 3 31 5 40 27Z" fill="#f3e8b7" stroke="#b9a37b" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m25 27 5 6m-8 19 8-4m15 14-2-8m20-19-8 3" stroke="#d5c38f" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M48 35c6 12-8 19-14 10-8-10 6-20 14-10Z" fill="#d9c8e3" stroke="#b39bc0" strokeWidth="1.4" />
    </svg>
    <span className="art-label">AA’s Tea Break</span>
    <TeaGirl />
    <Sparkles variant="portrait" />
  </div>;
}
