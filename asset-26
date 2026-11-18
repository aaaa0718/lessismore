// Short, locally synthesized cues: no audio downloads or autoplay workarounds.
let context;
let lastPlayed = -Infinity;
function tone(ctx, start, from, to, duration, volume, type = 'sine') {
  const oscillator = ctx.createOscillator(), gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(from, start);
  oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + .008);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain); gain.connect(ctx.destination);
  oscillator.start(start); oscillator.stop(start + duration + .02);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
export async function playSound(kind, { newStamp = false, isActive = () => true } = {}) {
  const requested = performance.now();
  try {
    if (document.hidden || !isActive()) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    if (!context || context.state === 'closed') context = new Audio();
    if (context.state !== 'running') await context.resume();
    // A blocked opening must never play later when the user finally taps.
    if (context.state !== 'running' || performance.now() - requested > 400 || document.hidden || !isActive()) return;
    if (performance.now() - lastPlayed < 150) return;
    lastPlayed = performance.now();
    const now = context.currentTime + .015;
    if (kind === 'opening') {
      tone(context, now, 440, 880, .13, .045);
      tone(context, now + .14, 660, 1100, .17, .035);
    } else if (kind === 'saved') {
      tone(context, now, 680, 310, .15, .065);
      if (newStamp) {
        tone(context, now + .24, 155, 65, .13, .09);
        tone(context, now + .24, 360, 180, .055, .025, 'triangle');
      }
    }
  } catch { /* Sound is optional and must never interrupt recording. */ }
}
