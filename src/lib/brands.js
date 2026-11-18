export const BRANDS = [
  ['喜茶', '喜', '#222222', 'heytea'], ['霸王茶姬', '姬', '#a72b32', 'chagee'],
  ['古茗', '茗', '#276349', 'guming'], ['茶百道', '茶', '#3264a3', 'chabaidao'],
  ['沪上阿姨', '沪', '#bd324e', 'hushang'], ['蜜雪冰城', '雪', '#c92e39', 'mixue'],
  ['奈雪的茶', '奈', '#778437', 'nayuki'], ['茶颜悦色', '颜', '#93453e', 'chayan'],
  ['一点点', '點', '#286147', 'yidiandian'], ['CoCo都可', 'CoCo', '#d86e28', 'coco'],
  ['瑞幸咖啡', 'luckin', '#213b73', 'luckin'], ['星巴克', '★', '#14654d', 'starbucks'],
  ['KOI Thé', 'KOI', '#292623', 'koi'], ['COSTA', 'COSTA', '#761631', 'costa'],
  ['Grid Coffee', 'Grid', '#70783c', 'grid'], ['M Stand', 'M', '#222222', 'mstand'],
  ['MANNER', 'MANNER', '#222222', 'manner'], ['乐乐茶', '乐', '#222222', 'lelecha'],
  ['茉莉奶白', '茉莉', '#578359', 'molly'], ['爷爷不泡茶', '爷爷', '#b68d58', 'yeye'],
  ['阿嬷手作', '阿嬷', '#7f6d46', 'ahma'], ['去茶山', '茶山', '#a78d62', 'quchashan'],
  ['煲珠公', '煲珠', '#2964aa', 'baozhugong'], ['李若桃', '若桃', '#857354', 'liruotao'],
  ['幸运咖', '幸运', '#cf2636', 'luckycup'], ['BeanStar 比星咖啡', '比星', '#2ca8dc', 'beanstar'],
  ['代数学家', '代数', '#d9362c', 'algebraist'],
].map(([name, mark, color, id]) => ({ name, mark, color, id, logo: ({heytea: 'webp', chagee: 'png', guming: 'webp', chabaidao: 'webp', hushang: 'webp', mixue: 'ico', nayuki: 'webp', chayan: 'webp', coco: 'webp', yidiandian: 'png', luckin: 'png', starbucks: 'png', koi: 'webp', costa: 'webp', grid: 'webp', mstand: 'webp', manner: 'webp', lelecha: 'webp', molly: 'webp', yeye: 'webp', ahma: 'webp', quchashan: 'webp', luckycup: 'webp', beanstar: 'webp', algebraist: 'webp'})[id] }));
export function recentBrands(records) {
  return [...new Set([...records].sort((a, b) => b.date.localeCompare(a.date)).map(row => row.brand.trim()).filter(Boolean))].slice(0, 4);
}
