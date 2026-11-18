export const STAMP_FLAVORS = Object.fromEntries([
  ['mango','芒果','#e7b340','#a07831','mango'],
  ['strawberry','草莓','#dc8792','#aa5967','berry'],
  ['peach','蜜桃','#e9aa95','#ae7667','peach'],
  ['lemon','柠檬','#d8cd68','#8d9347','citrus'],
  ['orange','橙子','#e6a253','#b17b3e','citrus'],
  ['coconut','椰乳','#eee4cf','#8b8567','coconut'],
  ['taro','芋泥','#b9a0cf','#84709a','taro'],
  ['tea','乌龙 / 茶叶','#c9b38a','#7e8861','leaf'],
  ['grape','葡萄','#b88cab','#844b76','grape','fruit'],
  ['matcha','抹茶','#a9b16b','#64713d','leaf','matcha'],
  ['coffee','咖啡','#b08a6a','#825d43','bean','coffee'],
  ['pearls','珍珠奶茶','#d7b88e','#96704d','pearls','pearls'],
  ['generic','通用奶茶','#d6c3a3','#9a8064','sparkle'],
].map(([key,label,color,ink,motif,art])=>[key,{label,color,ink,motif,art}]));
export const STAMP_FRAMES = { auto: '自动搭配', round: '圆章', scallop: '花边章', ticket: '邮票章' };
export function inferStampFlavor(name = '', category = '') {
  const rules = [['mango',/杨枝甘露|芒果|mango/i],['strawberry',/草莓|strawberry/i],['peach',/桃|peach/i],['lemon',/柠|lemon/i],['orange',/橙|柑|orange/i],['taro',/芋|taro/i],['matcha',/抹茶|matcha/i],['grape',/葡萄|grape/i],['coffee',/咖啡|拿铁|美式|摩卡|卡布|coffee|latte/i],['coconut',/椰|coconut/i],['tea',/乌龙|茉莉|观音|红茶|绿茶|龙井|纯茶|四季春/i],['pearls',/珍珠|波霸|黑糖/i]];
  return rules.find(([,pattern]) => pattern.test(name))?.[0] || (category === '咖啡' ? 'coffee' : category === '纯茶' ? 'tea' : 'generic');
}
export function validStampDesign(design) {
  return design === undefined || (!!design && typeof design === 'object' && !Array.isArray(design)
    && (design.flavor === 'auto' || Object.hasOwn(STAMP_FLAVORS, design.flavor)) && Object.hasOwn(STAMP_FRAMES, design.frame));
}
export function resolveStampDesign(record, seed = 0) {
  const flavor = record.stampDesign?.flavor && record.stampDesign.flavor !== 'auto' ? record.stampDesign.flavor : inferStampFlavor(record.name, record.category);
  const frame = record.stampDesign?.frame || 'auto';
  return { ...STAMP_FLAVORS[flavor], flavor, frame: frame === 'auto' ? ['round','scallop','ticket'][seed % 3] : frame,
    art: frame === 'auto' ? STAMP_FLAVORS[flavor].art : undefined };
}
