import { winterStampSrc } from '../lib/assets.js';

const scallop = Array.from({ length: 160 }, (_, index) => {
  const angle = index * Math.PI / 80;
  const radius = 133 + 4 * Math.cos(angle * 20);
  return `${150 + Math.cos(angle) * radius},${150 + Math.sin(angle) * radius}`;
}).join(' ');

export default function StampArtwork({ design }) {
  const frame = design.frame === 'ticket'
    ? <rect x="15" y="15" width="270" height="270" rx="22" />
    : design.frame === 'scallop' ? <polygon points={scallop} /> : <circle cx="150" cy="150" r="135" />;

  return <svg viewBox="0 0 300 300" aria-hidden="true" className="composed-stamp-art">
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeOpacity=".68">{frame}</g>
    <g transform="translate(150 150) scale(.95) translate(-150 -150)"
      fill="none" stroke="currentColor" strokeWidth="1.1" strokeDasharray="1 4" strokeLinecap="round" opacity=".46">{frame}</g>
    <image href={winterStampSrc(design.flavor)}
      x="67" y="28" width="166" height="165" />
  </svg>;
}
