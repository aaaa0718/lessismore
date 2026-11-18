import { useEffect, useRef } from 'react';
import portrait from '../assets/aa-winter-tea.webp?inline';

const WIDTH = 512;
const HEIGHT = 768;
const FACE_X = 259;

function ease(time, start, end) {
  const progress = Math.max(0, Math.min(1, (time - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

function drawPortrait(ctx, image, time, reducedMotion) {
  const nod = reducedMotion ? 0 : ease(time, .15, .85) * (1 - ease(time, 2.45, 3.3));
  const puff = reducedMotion ? 0 : ease(time, .65, 1.55) * (1 - ease(time, 1.95, 3.05));
  const blow = reducedMotion ? 0 : ease(time, 1.68, 1.96) * (1 - ease(time, 2.32, 2.93));
  const settle = reducedMotion ? 1 : ease(time, 2.65, 3.4);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(image, 0, 289, WIDTH, HEIGHT - 289, 0, 289, WIDTH, HEIGHT - 289);
  // Keep the feet and the cup fixed while AA nods and her bangs sway.
  for (let y = 0; y < 289; y++) {
    const headOffset = 5 * nod * ease(y, 0, 65) * (1 - ease(y, 258, 289));
    const fringeWeight = ease(y, 105, 167) * (1 - ease(y, 195, 220));
    const fringeShift = 3 * blow * fringeWeight * Math.sin((time - 1.7) * 18);
    ctx.drawImage(image, 0, y - headOffset, WIDTH, 1, fringeShift, y, WIDTH, 1);
  }

  // Soft shading adds volume inside the painted cheeks without moving the jaw.
  if (puff > .01) {
    for (const x of [203, 314]) {
      ctx.save();
      ctx.translate(x, 265 + 2 * nod);
      ctx.scale(1, .58);
      const radius = 18 + 7 * puff;
      const blush = ctx.createRadialGradient(-2, -4, 0, 0, 0, radius);
      blush.addColorStop(0, 'rgba(255, 222, 195, .38)');
      blush.addColorStop(.55, 'rgba(232, 126, 115, .42)');
      blush.addColorStop(1, 'rgba(232, 126, 115, 0)');
      ctx.globalAlpha = puff;
      ctx.fillStyle = blush;
      ctx.fillRect(-radius, -radius, 2 * radius, 2 * radius);
      ctx.restore();
    }
  }

  const mouthY = 272 + 3 * nod;
  const halfWidth = (7 - 3 * puff + 2 * settle) * (1 - .26 * blow);
  const smile = (5 * (1 - puff) + 4 * settle) * (1 - blow);
  ctx.strokeStyle = '#88543f';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(FACE_X - halfWidth, mouthY);
  ctx.quadraticCurveTo(FACE_X, mouthY + smile + 6 * blow, FACE_X + halfWidth, mouthY);
  ctx.quadraticCurveTo(FACE_X, mouthY + smile - 6 * blow, FACE_X - halfWidth, mouthY);
  ctx.fillStyle = `rgba(135, 73, 53, ${.42 * blow})`;
  ctx.fill();
  ctx.stroke();

  if (reducedMotion) return;
  const breath = ease(time, 1.88, 2.13);
  if (blow > 0) {
    const x = FACE_X + 4 + 12 * breath;
    ctx.strokeStyle = `rgba(255, 250, 241, ${.64 * blow})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, mouthY + 4);
    ctx.quadraticCurveTo(x + 10, mouthY + 10, x + 21 * breath, mouthY + 9);
    ctx.stroke();
  }
  // The vapor rises from the rim, then bends away from the mouth mid-blow.
  for (let i = 0; i < 3; i++) {
    const age = (time * .71 + i / 3) % 1;
    const drift = blow * (12 + age * 60);
    const x = FACE_X - 14 + i * 12;
    const y = 292 - age * 14;
    const lift = 16 + age * 49;
    const sway = Math.sin(time * 3 + i) * 10;
    ctx.strokeStyle = `rgba(255, 251, 241, ${Math.sin(age * Math.PI) * .83})`;
    ctx.lineWidth = 3 - age * 1.6;
    ctx.beginPath();
    ctx.moveTo(x + drift * .15, y);
    ctx.bezierCurveTo(x - 13 + drift * .42, y - lift * .28,
      x + sway + drift * .72, y - lift * .65, x + drift, y - lift);
    ctx.stroke();
  }
}

export default function WinterTeaAnimation({ onReady, onError }) {
  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    if (!ctx) {
      onError();
      return;
    }
    const picture = new Image();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame;
    picture.onload = () => {
      drawPortrait(ctx, picture, 0, reducedMotion);
      onReady();
      if (reducedMotion) return;
      const start = performance.now();
      function tick(now) {
        const time = Math.min(4.65, (now - start) / 1000);
        drawPortrait(ctx, picture, time, false);
        if (time < 4.65) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    };
    picture.onerror = onError;
    picture.src = portrait;
    return () => {
      cancelAnimationFrame(frame);
      picture.onload = null;
      picture.onerror = null;
    };
  }, [onReady, onError]);

  return <canvas ref={canvas} width={WIDTH} height={HEIGHT} aria-hidden="true" />;
}
