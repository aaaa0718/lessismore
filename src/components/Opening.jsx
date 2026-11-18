import { useCallback, useEffect, useState } from 'react';
import { playSound } from '../lib/sounds.js';
import WinterTeaAnimation from './WinterTeaAnimation.jsx';

export default function Opening() {
 const [phase,setPhase]=useState('loading');
 const ready = useCallback(() => setPhase(p => p === 'loading' ? 'playing' : p), []);
 const fail = useCallback(() => setPhase('leaving'), []);
 useEffect(()=>{if(phase!=='loading')return;const timer=setTimeout(()=>setPhase('leaving'),5000);return()=>clearTimeout(timer);},[phase]);
 useEffect(()=>{
  if(phase!=='playing')return;
  let active=true;
  void playSound('opening',{isActive:()=>active});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timer=setTimeout(()=>setPhase('leaving'),reduced?900:4650);
  return()=>{active=false;clearTimeout(timer);};
 },[phase]);
 useEffect(()=>{if(phase!=='leaving')return;const timer=setTimeout(()=>setPhase('done'),450);return()=>clearTimeout(timer);},[phase]);
 useEffect(()=>{
  if(phase==='done')return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const shell=document.querySelector('.diary-shell');if(shell)shell.inert=true;
  return()=>{document.body.style.overflow=previous;if(shell)shell.inert=false;};
 },[phase]);
 if(phase==='done')return null;
 return <div className={`aa-opening winter-opening ${phase==='playing'?'is-playing':''} ${phase==='leaving'?'is-leaving':''}`} role="status" aria-label="冬日 AA 正在吹热奶茶，正在打开小账本">
  <div className="opening-snow" aria-hidden="true">{Array.from({length:22},(_,i)=><span key={i} style={{'--x':`${(i*43+7)%100}%`,'--duration':`${7+i%5}s`,'--delay':`${-i*.63}s`,'--flake':`${3+i%4}px`,'--drift':`${i%2?24:-22}px`}} />)}</div>
  <div className="winter-opening-scene" style={{visibility:phase==='loading'?'hidden':'visible'}}>
   <div className="opening-blow-portrait"><WinterTeaAnimation onReady={ready} onError={fail} /></div>
   <div className="winter-opening-title"><p>AA的杯杯小账本</p></div>
  </div>
 </div>;
}
