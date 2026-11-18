import { useEffect, useRef } from 'react';
import winterSource from '../assets/aa-winter.webp?inline';
import girlSource from '../assets/opening-girl.json';

export default function AaPeek({ intro = false, onDone, onReady }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d'), image = new Image(), winter = new Image();
    let frame, stopped = false, start;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let fallback = intro ? setTimeout(() => onDone?.(), 3200) : null;
    function paint(elapsed) {
      const w = image.naturalWidth, h = image.naturalHeight;
      ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, 400, 560);
      const progress = reduced || !intro ? 1 : Math.min(1, Math.max(0, (elapsed - 150) / 700));
      const rise = 1 - (1 - progress) ** 3;
      const blink = intro && elapsed > 1050 && elapsed < 1250;
      // Keep the rising portrait within the cup opening. The cut line sits
      // behind the opaque cup, which must be painted AFTER the portrait.
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 400, intro ? 310 : 480); ctx.clip();
      ctx.drawImage(winter, 0, 0, winter.naturalWidth, winter.naturalHeight * .60,
        intro ? 80 : 45, intro ? 65 + (1 - rise) * 260 : 0,
        intro ? 240 : 310, intro ? 240 : 310);
      ctx.restore();
      if (intro) ctx.drawImage(image, w * .08, h * .55, w * .34, h * .42, 80, 270, 240, 280);
    }
    function begin() {
      if (!image.complete || !image.naturalWidth || !winter.complete || !winter.naturalWidth) return;
      if (stopped) return;
      clearTimeout(fallback);
      paint(0);
      onReady?.();
      if (!intro) return;
      fallback = setTimeout(() => onDone?.(), 3200);
      function tick(now) {
        if (stopped) return;
        start ??= now; const elapsed = now - start; paint(elapsed);
        if (elapsed < (reduced ? 300 : 2050)) frame = requestAnimationFrame(tick);
        else onDone?.();
      }
      frame = requestAnimationFrame(tick);
    };
    image.onload = begin;
    winter.onload = begin;
    winter.onerror = () => { if (!stopped && intro) onDone?.(); };
    winter.src = winterSource;
    image.onerror = () => { if (!stopped && intro) onDone?.(); };
    image.src = girlSource;
    return () => { stopped = true; cancelAnimationFrame(frame); clearTimeout(fallback); };
  }, [intro, onDone, onReady]);
  return <canvas ref={ref} width="800" height={intro ? 1120 : 960} className={intro ? 'aa-intro-canvas' : 'aa-calendar-peek'} aria-hidden="true" />;
}
