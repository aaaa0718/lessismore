export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('照片无法读取，请使用 JPG、PNG 或 WebP。'));
    image.src = source;
  });
}
export function canvasFor(image, max = 360) {
  const canvas = document.createElement('canvas');
  const ratio = Math.min(1, max / Math.max(image.width, image.height));
  canvas.width = Math.max(1, Math.round(image.width * ratio));
  canvas.height = Math.max(1, Math.round(image.height * ratio));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}
export const encodeImage = canvas => canvas.toDataURL('image/webp', .78);
export async function compressFile(file) {
  if (file.size > 20 * 1024 * 1024) throw new Error('请选择 20MB 以内的图片。');
  const url = URL.createObjectURL(file);
  try { return encodeImage(canvasFor(await loadImage(url))); }
  finally { URL.revokeObjectURL(url); }
}
export function cropForeground(canvas) {
  const { width, height } = canvas;
  const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let left = width, top = height, right = 0, bottom = 0, visible = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] > 30) {
      visible++; left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
  if (visible < 50 || right <= left || bottom <= top) throw new Error('没有识别出清晰主体，请换一张照片。');
  const result = document.createElement('canvas');
  result.width = right - left + 17; result.height = bottom - top + 17;
  result.getContext('2d').drawImage(canvas, left, top, right - left + 1, bottom - top + 1, 8, 8, right - left + 1, bottom - top + 1);
  return encodeImage(result);
}
export async function removeSolidBackground(source) {
  const canvas = canvasFor(await loadImage(source)), ctx = canvas.getContext('2d');
  const { width: w, height: h } = canvas;
  const pixels = ctx.getImageData(0, 0, w, h), data = pixels.data;
  const seen = new Uint8Array(w * h), queue = new Int32Array(w * h);
  let head = 0, tail = 0;
  const corners = [0, w - 1, (h - 1) * w, w * h - 1].map(i => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  function add(i) {
    if (i < 0 || i >= w * h || seen[i]) return;
    seen[i] = 1;
    if (data[i * 4 + 3] < 25 || corners.some(rgb => Math.hypot(...rgb.map((v, c) => data[i * 4 + c] - v)) < 48)) queue[tail++] = i;
  }
  for (let x = 0; x < w; x++) { add(x); add((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { add(y * w); add(y * w + w - 1); }
  while (head < tail) {
    const i = queue[head++]; data[i * 4 + 3] = 0;
    if (i % w) add(i - 1); if (i % w < w - 1) add(i + 1); add(i - w); add(i + w);
  }
  ctx.putImageData(pixels, 0, 0);
  return cropForeground(canvas);
}
export async function prepareTensor(source) {
  const image = await loadImage(source), canvas = document.createElement('canvas');
  canvas.width = canvas.height = 320;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 320, 320); ctx.drawImage(image, 0, 0, 320, 320);
  const rgba = ctx.getImageData(0, 0, 320, 320).data, n = 320 * 320;
  const pixels = new Float32Array(n * 3), mean = [.485, .456, .406], std = [.229, .224, .225];
  let max = 1;
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) max = Math.max(max, rgba[i * 4 + c]);
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) pixels[c * n + i] = (rgba[i * 4 + c] / max - mean[c]) / std[c];
  return { image, pixels };
}
export function applyMask(image, mask) {
  const maskCanvas = document.createElement('canvas'); maskCanvas.width = maskCanvas.height = 320;
  const mc = maskCanvas.getContext('2d'), mi = mc.createImageData(320, 320);
  for (let i = 0; i < mask.length; i++) {
    const value = Math.round(Math.max(0, Math.min(1, (mask[i] - .06) / .9)) * 255);
    mi.data[i * 4] = mi.data[i * 4 + 1] = mi.data[i * 4 + 2] = value; mi.data[i * 4 + 3] = 255;
  }
  mc.putImageData(mi, 0, 0);
  const result = canvasFor(image), ctx = result.getContext('2d');
  const scaled = document.createElement('canvas'); scaled.width = result.width; scaled.height = result.height;
  const sc = scaled.getContext('2d'); sc.drawImage(maskCanvas, 0, 0, result.width, result.height);
  const alpha = sc.getImageData(0, 0, result.width, result.height).data, pixels = ctx.getImageData(0, 0, result.width, result.height);
  for (let i = 0; i < alpha.length; i += 4) pixels.data[i + 3] = Math.round(pixels.data[i + 3] * alpha[i] / 255);
  ctx.putImageData(pixels, 0, 0);
  return cropForeground(result);
}
