import { useId } from 'react';
import { useArtwork } from '../lib/useArtwork.js';

// Illustration overlays include the drink, ingredients and AA together, with
// genuine alpha around each subject. Changing a frame never simplifies the art.
export default function StampArtwork({ design }) {
  const id = useId().replaceAll(':', '');
  const src = useArtwork(design.art ? `stamps/${design.art}.webp` : `stamps/watercolor/${design.flavor}.webp`);
  if (design.art) return <img src={src} width="300" height="300" alt="" />;
  const scallop = Array.from({ length: 160 }, (_, i) => {
    const angle = i * Math.PI / 80, radius = 133 + 4 * Math.cos(angle * 20);
    return `${150 + Math.cos(angle) * radius},${150 + Math.sin(angle) * radius}`;
  }).join(' ');
  const frame = design.frame === 'ticket'
    ? <rect x="15" y="15" width="270" height="270" rx="8" />
    : design.frame === 'scallop' ? <polygon points={scallop} /> : <circle cx="150" cy="150" r="135" />;
  return <svg viewBox="0 0 300 300" aria-hidden="true" className="composed-stamp-art">
    <defs>
      <filter id={`${id}-paper`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" seed="8" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="linear" slope=".12" /></feComponentTransfer>
        <feBlend in="SourceGraphic" mode="multiply" />
      </filter>
      <clipPath id={`${id}-clip`}>{frame}</clipPath>
    </defs>
    <g fill="#fff6e3" stroke={design.ink} strokeWidth="3" opacity=".92">{frame}</g>
    <g clipPath={`url(#${id}-clip)`}>
      <rect width="300" height="300" fill={design.color} opacity=".13" filter={`url(#${id}-paper)`} />
      <g transform="translate(150 150) scale(.94) translate(-150 -150)" fill="none" stroke={design.ink} strokeWidth="1" opacity=".4">{frame}</g>
      <g transform="translate(150 150) scale(.9) translate(-150 -150)" fill="none" stroke={design.ink} strokeWidth="1.3" strokeDasharray="4 5" opacity=".65">{frame}</g>
      <image href={src} x={design.frame === 'ticket' ? 0 : 18} y={design.frame === 'ticket' ? 0 : 12} width={design.frame === 'ticket' ? 300 : 264} height={design.frame === 'ticket' ? 300 : 264} preserveAspectRatio="xMidYMid meet" />
    </g>
  </svg>;
}
