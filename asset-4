import { useEffect, useState } from 'react';
import { canvasFor, cropForeground, loadImage } from '../services/images.js';

// Display-only trimming. Original photos and their backup representation stay intact.
const previews = new Map();
export default function CupPhoto({ src, ...props }) {
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!src.startsWith('data:image/')) return;
    let active = true;
    if (!previews.has(src)) {
      const task = loadImage(src).then(image => {
        const canvas = canvasFor(image);
        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = false;
        for (let i = 3; i < data.length; i += 4) if (data[i] < 30) { transparent = true; break; }
        return transparent ? cropForeground(canvas) : src;
      }).catch(() => src);
      if (previews.size >= 80) previews.delete(previews.keys().next().value);
      previews.set(src, task);
    }
    previews.get(src).then(result => { if (active) setPreview({ original: src, result }); });
    return () => { active = false; };
  }, [src]);
  return <img {...props} src={preview?.original === src ? preview.result : src} />;
}
