import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { DiaryProvider } from './state/DiaryContext.jsx';
import App from './App.jsx';
import './styles.css';
import './components/ui/ui.css';

class StartupBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="paper-panel" style={{ margin: '20vh auto', maxWidth: 400, textAlign: 'center' }}><h1>小账本暂时没能打开</h1><p className="my-4">请重新加载试试，你的记录仍保存在当前浏览器。</p><button className="btn-primary" onClick={() => window.location.reload()}>重新加载</button></div>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(
  <React.StrictMode><StartupBoundary><HashRouter><DiaryProvider><App /></DiaryProvider></HashRouter></StartupBoundary></React.StrictMode>,
);
