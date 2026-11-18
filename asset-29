import { useEffect, useState } from 'react';
import { asset } from './assets.js';

// Load only the requested artwork after the application is already visible.
const loaders = import.meta.glob('../assets/artwork/**/*.json', { import: 'default' });
const cache = new Map();
export function useArtwork(path) {
  const [loaded, setLoaded] = useState(null);
  useEffect(() => {
    let active = true;
    const loader = loaders[`../assets/artwork/${path}.json`];
    if (loader) {
      if (!cache.has(path)) cache.set(path, loader().catch(() => { cache.delete(path); return null; }));
      cache.get(path).then(src => { if (active && src) setLoaded({ path, src }); });
    }
    return () => { active = false; };
  }, [path]);
  return loaded?.path === path ? loaded.src : path ? asset(path) : undefined;
}
