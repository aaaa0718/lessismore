export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
export function photoSrc(record) {
  if (record?.photo) return record.photo;
  const name = `${record?.name || ''} ${record?.category || ''}`;
  const kind = /抹茶|matcha/i.test(name) ? 'matcha' : /咖啡|拿铁|美式|摩卡|coffee|latte/i.test(name) ? 'coffee' : 'milk';
  return asset(`drinks/${kind}.webp`);
}

export const winterStampSrc = (flavor) => asset(`stamps/winter/${flavor}.webp`);
