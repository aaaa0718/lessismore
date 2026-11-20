import { useEffect, useState } from 'react';
import { canvasFor, cropForeground, loadImage } from '../services/images.js';

// A straw occupies only a few pixels per row. Use the sustained, wider
// silhouette as the start of the cup body when sizing calendar stickers.
function cupBodyScale(data, width, height) {
  const coverage = new Uint16Array(height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 30) coverage[y]++;
    }
  }
  const occupied = [...coverage].filter(Boolean).sort((a, b) => a - b);
  if (!occupied.length) return 1;
  const threshold = occupied[Math.floor(occupied.length * .65)] * .48;
  const run = Math.max(2, Math.round(occupied.length * .035));
  const top = coverage.findIndex(Boolean);
  let bottom = height - 1;
  while (!coverage[bottom]) bottom--;
  let consecutive = 0;
  for (let y = top; y <= bottom; y++) {
    consecutive = coverage[y] >= threshold ? consecutive + 1 : 0;
    if (consecutive === run) {
      const bodyHeight = bottom - (y - run + 1) + 1;
      return Math.min(1.8, (bottom - top + 1) / bodyHeight);
    }
  }
  return 1;
}

// Display-only trimming. Original photos and their backup representation stay intact.
const previews = new Map();
export default function CupPhoto({ src, tight = false, balanceBody = false, style, ...props }) {
  const [preview, setPreview] = useState(null);
  const key = balanceBody ? `body:${src}` : tight ? `tight:${src}` : src;
  useEffect(() => {
    if (!src.startsWith('data:image/')) return;
    let active = true;
    if (!previews.has(key)) {
      const task = loadImage(src).then(image => {
        const canvas = canvasFor(image);
        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = false;
        for (let i = 3; i < data.length; i += 4) if (data[i] <= 30) { transparent = true; break; }
        return {
          source: transparent ? cropForeground(canvas, tight || balanceBody ? 0 : undefined) : src,
          scale: balanceBody && transparent ? cupBodyScale(data, canvas.width, canvas.height) : undefined,
        };
      }).catch(() => ({ source: src }));
      if (previews.size >= 80) previews.delete(previews.keys().next().value);
      previews.set(key, task);
    }
    previews.get(key).then(result => { if (active) setPreview({ key, result }); });
    return () => { active = false; };
  }, [balanceBody, key, src, tight]);
  const result = preview?.key === key ? preview.result : null;
  return <img {...props} src={result?.source ?? src}
    style={result?.scale ? { ...style, '--cup-body-scale': result.scale } : style} />;
}
