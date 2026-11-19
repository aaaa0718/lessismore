import { useEffect, useRef } from 'react';
import puppetUrl from '../assets/tea-girl-puppet.webp?inline';
import { drawTeaGirl } from '../lib/teaGirlAnimation.js';

// Reuse the approved watercolor artwork and its existing expression layers.
export default function AaReaction() {
  const canvas = useRef(null);
  useEffect(() => {
    let disposed = false;
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      const context = canvas.current?.getContext('2d');
      if (context) drawTeaGirl(context, image, 0);
    };
    image.src = puppetUrl;
    return () => { disposed = true; image.onload = null; };
  }, []);
  return <span className="aa-reaction aa-reaction--peek" aria-hidden="true">
    <canvas ref={canvas} width="640" height="900" />
    <span className="aa-peek-paper" />
  </span>;
}
