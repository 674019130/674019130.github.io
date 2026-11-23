import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
import { copy } from './content.js';

const $ = (s, el = document) => el.querySelector(s);
const root = document.documentElement;
const params = new URLSearchParams(location.search);
const preview = params.get('preview') === '1';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => motion.matches || params.get('still') === '1';

let language = readLocale();
if (!preview) saveLocale(language);
const c = () => copy[language];
const announce = text => { if (!preview) $('#announce').textContent = text; };

/* ---------- glow engine ---------- */
// Radix step 9: pink, violet, blue, cyan, orange
const COLORS = ['#d6409f', '#6e56cf', '#0090ff', '#00a2c7', '#f76b15'].map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = v => Math.min(1, Math.max(0, v));
// reach: how far up the glow climbs (× height); spread: lobe half-width (× width); sweep: beam travel (× width)
const PRESETS = {
  chat: { reach: .95, spread: .3, idle: .1, sweep: .34 },
  pill: { reach: 1.1, spread: .42, idle: .12, sweep: .26 },
  phone: { reach: .5, spread: .36, idle: .08, sweep: .36 },
};
const ATTACK = .05, RELEASE = .32;
let ready = false; // set once state exists; resizes before that only resize

class Glow {
  constructor(field) {
    this.field = field;
    this.p = PRESETS[field.dataset.preset];
    this.level = new Float32Array(5);
    this.canvas = Object.assign(document.createElement('canvas'), { className: 'glow' });
    this.canvas.setAttribute('aria-hidden', 'true');
    field.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    new ResizeObserver(() => this.resize()).observe(field);
    this.resize();
  }
  resize() {
    const d = Math.min(2, devicePixelRatio || 1);
    this.w = this.field.clientWidth; this.h = this.field.clientHeight;
    this.canvas.width = Math.round(this.w * d); this.canvas.height = Math.round(this.h * d);
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
    if (ready && still()) frame(performance.now(), 0);
  }
  step(bands, dt) {
    for (let i = 0; i < 5; i++) {
      const target = bands[i];
      const tau = target > this.level[i] ? ATTACK : RELEASE;
      this.level[i] += (target - this.level[i]) * (dt ? 1 - Math.exp(-dt / tau) : 1);
    }
  }
  draw(t, gather, dark) {
    const { ctx, w, h, p } = this;
    ctx.clearRect(0, 0, w, h);
    // additive on a transparent canvas: overlapping lobes mix instead of the last one covering the rest
    ctx.globalCompositeOperation = 'lighter';
    const beam = .5 + Math.sin(t * 1.7) * p.sweep;
    for (let i = 0; i < 5; i++) {
      // perceived loudness is roughly the square root of the level; keep a visible floor
      const L = Math.sqrt(Math.max(p.idle, this.level[i]));
      const home = .14 + i * .18, drift = Math.sin(t * .55 + i * 1.9) * .05;
      const x = w * lerp(home + drift, beam + (i - 2) * .03, gather);
      const rx = w * p.spread * lerp(.75 + .45 * L, .72, gather);
      const ry = h * p.reach * lerp(.2 + .8 * L, .78, gather);
      const a = (dark ? .95 : .5) * Math.min(1, .25 + lerp(L, .85, gather));
      lobe(ctx, x, h + ry * .06, rx, ry, COLORS[i], a);
      // a tighter, whiter core hugging the edge reads as the source of the light
      lobe(ctx, x, h + ry * .02, rx * .55, ry * .32, mix(COLORS[i], .45), a * .9);
    }
  }
}

function lobe(ctx, x, y, rx, ry, color, a) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, rgba(color, a));
  g.addColorStop(.35, rgba(color, a * .75));
  g.addColorStop(.7, rgba(color, a * .28));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
const mix = (c, k) => c.map(v => Math.round(v + (255 - v) * k));

const glows = [...document.querySelectorAll('.field[data-preset]')].map(f => new Glow(f));

/* ---------- level sources ---------- */
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
// Speech-like: ~4 syllables a second, 2.6 s phrases with a breath between, per-band colour.
function simulated(t, out) {
  const ph = t % 3.4;
  const phrase = smooth(0, .18, ph) * (1 - smooth(2.45, 2.7, ph));
  const syllable = Math.pow(Math.max(0, Math.sin(t * Math.PI * 4.2)), 1.4);
  const grain = .7 + .3 * Math.sin(t * 13.7) * Math.sin(t * 7.3);
  for (let i = 0; i < 5; i++) out[i] = clamp(phrase * syllable * grain * (.6 + .4 * Math.sin(t * (1.9 + i * .8) + i * 1.3)) * 1.15);
  return out;
}

let audio = null; // { ctx, analyser, stream, spectrum, edges }
async function startMic() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const ctx = new AudioContext();
  const analyser = Object.assign(ctx.createAnalyser(), { fftSize: 1024, smoothingTimeConstant: .5 });
  ctx.createMediaStreamSource(stream).connect(analyser);
  const edges = [90, 180, 360, 720, 1440, 4000].map(f => Math.max(1, Math.round(f / (ctx.sampleRate / 2) * analyser.frequencyBinCount)));
  audio = { ctx, analyser, stream, edges, spectrum: new Uint8Array(analyser.frequencyBinCount) };
}
function stopMic() {
  if (!audio) return;
  audio.stream.getTracks().forEach(tr => tr.stop());
  audio.ctx.close();
  audio = null;
}
function micBands(out) {
  const { analyser, spectrum, edges } = audio;
  analyser.getByteFrequencyData(spectrum);
  for (let i = 0; i < 5; i++) {
    let sum = 0;
    for (let b = edges[i]; b < edges[i + 1]; b++) sum += spectrum[b];
    out[i] = clamp((sum / Math.max(1, edges[i + 1] - edges[i]) / 255 - .18) * 2.4);
  }
  return out;
}

/* ---------- state ---------- */
let mode = ['idle', 'speak', 'think'].includes(params.get('mode')) ? params.get('mode') : 'speak';
let gather = mode === 'think' ? 1 : 0;
const bands = new Float32Array(5), zero = new Float32Array(5), stillBands = Float32Array.from([.5, .7, .62, .45, .35]);
const dark = () => root.dataset.theme === 'dark';

let spoken = 0; // seconds of speech shown on the pill
const timer = $('#timer');
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

let last = performance.now(), raf = 0;
function frame(now, dt = Math.min(.05, (now - last) / 1000)) {
  last = now;
  const t = now / 1000;
  const src = still() ? (mode === 'speak' ? stillBands : zero)
    : mode !== 'speak' ? zero : audio ? micBands(bands) : simulated(t, bands);
  gather += ((mode === 'think' ? 1 : 0) - gather) * (still() ? 1 : 1 - Math.exp(-dt / .35));
  if (mode === 'speak' && !still()) { spoken += dt; timer.textContent = fmt(spoken); }
  for (const g of glows) { g.step(src, still() ? 0 : dt); g.draw(still() ? 1.2 : t, gather, dark()); }
}
function loop(now) { frame(now); raf = requestAnimationFrame(loop); }
function run() {
  cancelAnimationFrame(raf);
  if (still() || document.hidden) { frame(performance.now(), 0); return; }
  last = performance.now();
  raf = requestAnimationFrame(loop);
}
document.addEventListener('visibilitychange', run);
motion.addEventListener('change', run);

/* ---------- controls ---------- */
const micBtn = $('#mic');
function statusFor() { return mode === 'idle' ? c().sIdle : mode === 'think' ? c().sThink : audio ? c().sMic : c().sSpeak; }
function setMode(next, say = true) {
  mode = next;
  if (mode === 'idle') spoken = 0, timer.textContent = fmt(0);
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  root.dataset.mode = mode;
  if (say) announce(statusFor());
  run();
}
document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

function syncMic() {
  micBtn.textContent = audio ? c().micOff : c().micOn;
  micBtn.setAttribute('aria-pressed', String(!!audio));
}
micBtn.addEventListener('click', async () => {
  if (audio) { stopMic(); syncMic(); setMode('idle'); return; }
  micBtn.disabled = true;
  try { await startMic(); syncMic(); setMode('speak'); }
  catch { syncMic(); setMode('speak', false); announce(c().sDenied); }
  finally { micBtn.disabled = false; }
});
if (!navigator.mediaDevices?.getUserMedia) micBtn.hidden = true;

function setTheme(theme, say = true) {
  root.dataset.theme = theme;
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === theme)));
  if (say) announce(theme === 'dark' ? c().themeDark : c().themeLight);
  run();
}
document.querySelectorAll('[data-theme-choice]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeChoice)));

function applyLanguage() {
  const t = c();
  root.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t.title} · ${language === 'zh' ? 'Su UI 实验室' : 'Su UI lab'}`;
  for (const el of document.querySelectorAll('[data-copy]')) el.textContent = t[el.dataset.copy];
  for (const el of document.querySelectorAll('[data-label]')) el.setAttribute('aria-label', t[el.dataset.label]);
  t.notes.forEach(([title, body], i) => { $(`#note-title-${i}`).textContent = title; $(`#note-body-${i}`).textContent = body; });
  $('#stage').setAttribute('aria-label', t.stage);
  $('.field.chat').setAttribute('aria-label', t.chat);
  $('.field.pill').setAttribute('aria-label', t.pill);
  $('.phone').setAttribute('aria-label', t.phone);
  $('#state-group').setAttribute('aria-label', t.stateGroup);
  $('#theme-group').setAttribute('aria-label', t.theme);
  const lang = $('#language');
  lang.textContent = language === 'zh' ? 'EN' : '中';
  lang.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  syncMic();
}
$('#language').addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; saveLocale(language); applyLanguage(); announce(statusFor()); });
followLocale(next => { if (next !== language) { language = next; applyLanguage(); } });

setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
applyLanguage();
ready = true;
setMode(mode, false);
