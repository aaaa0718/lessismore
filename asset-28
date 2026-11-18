const smooth = value => value * value * (3 - 2 * value);
function tween(time, keys, ease = false) {
  for (let i = 1; i < keys.length; i++) {
    const [end, to] = keys[i], [start, from] = keys[i - 1];
    if (time <= end) {
      const fraction = Math.max(0, (time - start) / (end - start));
      return from + (to - from) * (ease ? smooth(fraction) : fraction);
    }
  }
  return keys.at(-1)[1];
}

// Compose a single transparent canvas after the atlas loads. This avoids nested
// SVG image viewports and animated SVG masks on mobile browsers.
export function drawTeaGirl(ctx, image, time) {
  const size = image.naturalWidth / 2;
  const part = (column, row, x, y, width, height) =>
    ctx.drawImage(image, column * size, row * size, size, size, x, y, width, height);
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  ctx.clearRect(0, 0, 320, 450);
  ctx.globalAlpha = 1;
  part(0, 1, 42, 247, 236, 200);
  part(0, 0, 5, 0, 310, 310);
  const happy = tween(time, [[0, 0], [68, 0], [69, 1], [94, 1], [95, 0], [100, 0]]);
  if (happy > 0) {
    ctx.save(); ctx.globalAlpha = happy;
    ctx.beginPath();
    ctx.ellipse(115, 199, 32, 25, 0, 0, Math.PI * 2);
    ctx.ellipse(209, 199, 32, 25, 0, 0, Math.PI * 2);
    ctx.clip(); part(1, 0, 5, 0, 310, 310); ctx.restore();
    ctx.save(); ctx.globalAlpha = happy;
    ctx.beginPath(); ctx.ellipse(167, 233, 17, 12, 0, 0, Math.PI * 2);
    ctx.clip(); part(1, 0, 5, 10, 310, 310); ctx.restore();
  }
  const mouth = tween(time, [[0, 0], [19, 0], [27, 1], [44, 1], [51, 0], [100, 0]]);
  if (mouth > 0) {
    ctx.save(); ctx.globalAlpha = mouth; ctx.fillStyle = '#fbdac5';
    ctx.beginPath(); ctx.ellipse(168, 233, 12, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8c5d47'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(164, 234); ctx.quadraticCurveTo(168, 238, 172, 234); ctx.stroke(); ctx.restore();
  }
  const lift = tween(time, [[0, 0], [12, 0], [29, -34], [43, -34], [57, 0], [100, 0]], true);
  part(1, 1, 60, 248 + lift, 220, 220);
  const joy = tween(time, [[0, 0], [69, 0], [77, 1], [90, 1], [97, 0], [100, 0]], true);
  if (joy > 0) {
    ctx.save(); ctx.globalAlpha = joy * .9; ctx.translate(277, 114 - joy * 9);
    ctx.scale(.75 + joy * .25, .75 + joy * .25); ctx.translate(-277, -110);
    ctx.strokeStyle = '#b39bbf'; ctx.fillStyle = '#e9dfee'; ctx.lineWidth = 3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const heart = new Path2D('M277 105c-14-17-26 0-12 10l13 10 12-14c10-13-6-23-13-6Z');
    ctx.fill(heart); ctx.stroke(heart);
    ctx.stroke(new Path2D('M290 85l5-7m3 20 8-2')); ctx.restore();
  }
}
