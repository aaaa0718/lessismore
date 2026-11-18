const drinks = [
  { kind: 'matcha', name: '抹茶奶茶', milk: '#f5edcb', tea: '#86a16b', top: '#afbe87' },
  { kind: 'coffee', name: '冰拿铁', milk: '#f4dfba', tea: '#855a41', top: '#b58a61' },
  { kind: 'pearls', name: '珍珠奶茶', milk: '#efd7ae', tea: '#c49b70', top: '#e1c09a' },
  { kind: 'berry', name: '草莓鲜奶', milk: '#fff1df', tea: '#d98c8c', top: '#eab0ac' },
];

// Extend the site's existing hand-drawn SVG drink illustrations.
export default function OpeningDrinks() {
  return <div className="opening-drinks" aria-hidden="true">{drinks.map((drink, i) =>
    <div className={`opening-drink opening-drink-${i}`} key={drink.kind}>
      <svg viewBox="0 0 100 150" role="img" aria-label={drink.name}>
        <defs><clipPath id={`cup-${drink.kind}`}><path d="M19 40h62l-9 94q-22 9-44 0Z" /></clipPath><linearGradient id={`tea-${drink.kind}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={drink.tea} /><stop offset="1" stopColor={drink.milk} /></linearGradient></defs>
        <g stroke="#987963" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m59 8-5 37" stroke={drink.kind === 'matcha' ? '#79885b' : '#b49cc5'} strokeWidth="6" />
          <path d="M19 40h62l-9 94q-22 9-44 0Z" fill={drink.milk} />
          <g clipPath={`url(#cup-${drink.kind})`} stroke="none">
            <path d="M15 47h70v46q-16-12-31-3T15 83Z" fill={`url(#tea-${drink.kind})`} />
            <path d="M24 65q8 13 5 36m30-41q-8 15-4 35" fill="none" stroke={drink.milk} strokeWidth="4" opacity=".65" />
            {drink.kind === 'pearls' ? [ [34,120],[48,129],[62,119],[43,112],[65,132],[32,133] ].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#75533e" />) : <g fill={drink.top} opacity=".65"><path d="m30 52 13-3 4 13-14 3Zm24 5 15-4 3 13-15 3Z" /></g>}
            {drink.kind === 'berry' && <g fill="#c46c77"><path d="M32 112q-9-12 2-13 14 0 7 12l-5 7Z"/><path d="M58 128q-9-12 2-13 14 0 7 12l-5 7Z"/></g>}
          </g>
          <ellipse cx="50" cy="40" rx="33" ry="7" fill={drink.top} />
          <path d="M16 38q34-10 68 0v7q-34 10-68 0Z" fill="#fffae9" fillOpacity=".65" />
          <path d="m25 51 6 66" stroke="#fffdf4" strokeWidth="3" opacity=".8" />
          <path d="M34 91q16-6 32 0v16q-16 6-32 0Z" fill="#fff9e9" strokeWidth="1" />
        </g>
        <text x="50" y="102" textAnchor="middle" fill="#795f4d" fontSize="8" fontFamily="sans-serif">{drink.name}</text>
      </svg>
    </div>
  )}</div>;
}
