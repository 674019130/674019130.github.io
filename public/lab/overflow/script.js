import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
import { copy } from './content.js';
import { R, TAU, C, GAP, GHOST, VOID, mod, clamp, homeAt, topFor, wrapTop, railTheta, stampDistances, dashOffset, glyphOnBall, splatter, copiesInView, pointAt, remapY } from './model.js';

const $ = (selector, el = document) => el.querySelector(selector);
const root = document.documentElement;
const params = new URLSearchParams(location.search);
const preview = params.get('preview') === '1';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const stillParam = params.get('still') === '1';
if (stillParam) root.dataset.still = 'true';
const reduced = () => motion.matches || stillParam;

let language = readLocale();
if (!preview) saveLocale(language);
const c = () => copy[language];
const announce = text => { if (!preview) $('#announce').textContent = text; };

const stage = $('#stage'), scroller = $('#scroller'), canvas = $('#ink'), ctx = canvas.getContext('2d');
const ball = $('#ball'), glyph = $('#glyph');

/* ---------- state ---------- */
// Rails and void paths are stored relative to their zone, so a relayout only remaps them.
const S = {
  lap: 1, inVoid: false, mode: 'rail',
  rails: [{ lap: 1, from: 0, frac: 0, phase: 0, alpha: 1 }],   // fractions of the rail
  voids: [],                                                    // { lap, pts: [{x, y, s}] relative to the rail end, theta0, alpha }
  strokes: [],                                                  // { pts in page coords, theta0, ink, dots }
  ball: { x: 0, sy: 0, y: 0 }, v: { x: 0, y: 0 }, theta: 0, dir: { x: 0, y: 1 }, lead: 0,
  pointer: null, grab: null, key: null, history: [],
};
let g = null, dpr = 1, inks = {}, auto = false, autoAcc = 0, last = performance.now();
const rail = () => S.rails.find(r => r.lap === S.lap);
const stroke = () => (S.mode === 'rail' ? null : S.strokes.at(-1));

/* ---------- page ---------- */
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function renderPage(el, lap) {
  const a = c().article;
  el.innerHTML = `<header><h2>${esc(a.title)}</h2><p class="meta"><span>${esc(a.read)}</span><span class="lap">${esc(a.lap(lap))}</span></p></header>`
    + a.sections.map(([title, body]) => `<section><h3>${esc(title)}</h3><p>${esc(body)}</p></section>`).join('');
}
function renderLaps() {
  $('#page-a .lap').textContent = c().article.lap(S.lap);
  $('#page-b .lap').textContent = c().article.lap(S.lap + 1);
}

function measure() {
  const w = stage.clientWidth, h = stage.clientHeight;
  $('#void').style.height = `${Math.round(h * VOID)}px`;
  const contentEnd = $('#page-a').offsetHeight;
  const railX = parseFloat(getComputedStyle(scroller).getPropertyValue('--rail')) || 36;
  g = { w, h, railX, railTop: 24, railEnd: contentEnd - 36, contentEnd, L: $('#page-b').offsetTop, amp: Math.min(170, (w - railX) * 0.42) };
  dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  const css = getComputedStyle(stage);
  inks = { blue: css.getPropertyValue('--ink-blue').trim(), lead: css.getPropertyValue('--ink-lead').trim() };
}
const placeOf = top => { const home = homeAt(top, g); return { zone: home.zone, t: home.zone === 'read' ? home.p : home.q }; };
// Keep the lap, the ink and the reading place; only pixels move.
function relayout(rebuild) {
  const place = g ? placeOf(scroller.scrollTop) : null, before = g;
  if (rebuild) { renderPage($('#page-a'), S.lap); renderPage($('#page-b'), S.lap + 1); }
  measure();
  if (before && (before.contentEnd !== g.contentEnd || before.L !== g.L))
    for (const s of S.strokes) for (const p of [...s.pts, ...s.dots]) p.y = remapY(p.y, before, g);
  if (place) scroller.scrollTop = topFor(place.zone, place.t, g);
  snapHome();
}

/* ---------- motion ---------- */
const railY = frac => g.railTop + frac * (g.railEnd - g.railTop);
const railFrac = y => clamp((y - g.railTop) / (g.railEnd - g.railTop), 0, 1);
const home = () => homeAt(scroller.scrollTop, g);
function snapHome() {
  const h = home();
  S.ball.x = h.x; S.ball.sy = h.sy; S.v = { x: 0, y: 0 };
  S.ball.y = h.y;
  if (h.zone === 'read' && S.mode === 'rail') S.theta = railTheta(h.y, g, rail().phase);
}

function nextLap() {
  S.lap++;
  const h = home();
  // The new lap starts at the angle the ball already has, so nothing jumps.
  S.rails.push({ lap: S.lap, from: 0, frac: 0, phase: mod(S.theta - (h.y - g.railTop) / R, TAU), alpha: 1 });
  S.rails = S.rails.filter(r => r.lap >= S.lap - 1);
  S.voids = S.voids.filter(v => v.lap >= S.lap - 1);
  for (const s of S.strokes) for (const p of [...s.pts, ...s.dots]) p.y -= g.L;
  S.ball.y -= g.L;
  S.inVoid = false;
  renderLaps();
  announce(c().announce.lap(S.lap));
}
function wrap() {
  if (!g || scroller.scrollTop < g.L) return;
  const { top, laps } = wrapTop(scroller.scrollTop, g.L);
  scroller.scrollTop = top;
  for (let i = 0; i < laps; i++) nextLap();
}

function startStroke() {
  S.strokes.push({ pts: [{ x: S.ball.x, y: S.ball.sy + scroller.scrollTop, s: 0 }], theta0: S.theta, ink: S.lead > 0.5 ? 'lead' : 'blue', dots: [] });
  if (S.strokes.length > 40) S.strokes.shift();
}
function addPoint(list, x, y) {
  const p = list.at(-1), d = Math.hypot(x - p.x, y - p.y);
  if (d < 1.5) return 0;
  list.push({ x, y, s: p.s + d });
  return d;
}

// Moves the ball to (x, sy) on screen. It rolls by the distance travelled on the paper,
// so holding it still while the page scrolls underneath turns it too.
function rollTo(x, sy, top) {
  const y = sy + top, dx = x - S.ball.x, dy = y - S.ball.y, d = Math.hypot(dx, dy);
  S.ball.x = x; S.ball.sy = sy; S.ball.y = y;
  if (d > 0.01) { S.theta += d / R; S.dir = { x: dx / d, y: dy / d }; }
}

function step(dt) {
  const top = scroller.scrollTop, h = homeAt(top, g);
  if ((h.zone === 'void') !== S.inVoid) {
    S.inVoid = h.zone === 'void';
    if (S.inVoid) {
      if (!S.voids.some(v => v.lap === S.lap)) S.voids.push({ lap: S.lap, pts: [], theta0: 0, alpha: 1 });
      S.voids = S.voids.filter(v => v.lap >= S.lap - 1);
      announce(c().announce.past);
    }
  }
  // Graphite in the blank area, blue again as the page comes back.
  S.lead = h.zone === 'void' ? clamp(h.q / 0.06, 0, 1) * clamp((1 - h.q) / 0.06, 0, 1) : 0;

  const k = reduced() ? 1 : 1 - Math.exp(-dt / 60);
  if (S.mode === 'rail') {
    const x = S.ball.x + (h.x - S.ball.x) * k, sy = S.ball.sy + (h.sy - S.ball.sy) * k;
    if (h.zone === 'read') {
      const y = sy + top, r = rail();
      S.ball.x = x; S.ball.sy = sy; S.ball.y = y; S.dir = { x: 0, y: 1 };
      // On the rail the angle is a function of y; after a throw it settles back into the groove.
      const off = mod(railTheta(y, g, r.phase) - S.theta + Math.PI, TAU) - Math.PI;
      S.theta += off * (k === 1 ? 1 : Math.min(1, k * 2));
      if (Math.abs(x - g.railX) < 2) r.frac = Math.max(r.frac, railFrac(y));
    } else {
      rollTo(x, sy, top);
      const v = S.voids.find(p => p.lap === S.lap), px = x - g.railX, py = sy + top - g.contentEnd;
      if (!v.pts.length) { v.pts.push({ x: px, y: py, s: 0 }); v.theta0 = S.theta; }
      else if (py > v.pts.at(-1).y + 1.5) addPoint(v.pts, px, py);
    }
  } else {
    const b = S.ball;
    if (S.mode === 'drag') {
      const x = S.pointer.x + S.grab.x, sy = S.pointer.y + S.grab.y;
      rollTo(b.x + (x - b.x) * Math.max(k, 0.5), b.sy + (sy - b.sy) * Math.max(k, 0.5), top);
    } else if (S.mode === 'key') {
      rollTo(b.x + (S.key.x - b.x) * k, b.sy + (S.key.y - b.sy) * k, top);
    } else if (S.mode === 'fling') {
      const f = Math.exp(-dt / 140);
      S.v.x *= f; S.v.y *= f;
      let x = b.x + S.v.x * dt, sy = b.sy + S.v.y * dt;
      if (x < 14 || x > g.w - 14) { S.v.x *= -0.4; x = clamp(x, 14, g.w - 14); }
      if (sy < 14 || sy > g.h - 14) { S.v.y *= -0.4; sy = clamp(sy, 14, g.h - 14); }
      rollTo(x, sy, top);
      if (Math.hypot(S.v.x, S.v.y) < 0.15) S.mode = 'return';
    } else if (S.mode === 'return') {
      const W = 0.011, t = Math.min(dt, 32);
      S.v.x += ((h.x - b.x) * W * W - 2 * W * S.v.x) * t;
      S.v.y += ((h.sy - b.sy) * W * W - 2 * W * S.v.y) * t;
      rollTo(b.x + S.v.x * t, b.sy + S.v.y * t, top);
      if (Math.hypot(h.x - b.x, h.sy - b.sy) < 1 && Math.hypot(S.v.x, S.v.y) < 0.05) { S.mode = 'rail'; snapHome(); }
    }
    const s = S.strokes.at(-1);
    if (s && S.mode !== 'rail') {
      const y = b.sy + top, d = addPoint(s.pts, b.x, y);
      const speed = d / Math.max(dt, 1);
      if (!reduced() && S.mode !== 'key') for (const drop of splatter(speed)) {
        const n = { x: -S.dir.y, y: S.dir.x };
        s.dots.push({ x: b.x + S.dir.x * drop.along + n.x * drop.across, y: y + S.dir.y * drop.along + n.y * drop.across, r: drop.r });
      }
    }
  }
  S.history.push({ t: performance.now(), x: S.ball.x, y: S.ball.sy });
  while (S.history.length > 2 && S.history[0].t < performance.now() - 90) S.history.shift();

  // Earlier laps fade on entering the blank area, so the copy below already shows the next lap.
  const fade = reduced() ? 1 : 1 - Math.exp(-dt / 220);
  for (const r of S.rails) { const t = r.lap === S.lap && !S.inVoid ? 1 : GHOST; r.alpha += (t - r.alpha) * fade; }
  for (const v of S.voids) { const t = v.lap === S.lap || (v.lap === S.lap - 1 && !S.inVoid) ? 1 : GHOST; v.alpha += (t - v.alpha) * fade; }
}

/* ---------- drawing ---------- */
function bounds(pts, pad = 12) {
  let lo = Infinity, hi = -Infinity;
  for (const p of pts) { if (p.y < lo) lo = p.y; if (p.y > hi) hi = p.y; }
  return [lo - pad, hi + pad];
}
function stamp(x, y, a, color) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(a - Math.PI / 2);
  ctx.fillStyle = color; ctx.font = '600 18px ui-serif, Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('∞', 0, 1);
  ctx.restore();
}
function drawPath(pts, theta0, color, width, alpha, dots) {
  if (pts.length < 2 && !(dots && dots.length)) return;
  const [lo, hi] = bounds(dots && dots.length ? [...pts, ...dots] : pts, 24);
  const top = scroller.scrollTop;
  for (const k of copiesInView(lo, hi, top, g.h, g.L)) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, dpr * (k * g.L - top));
    ctx.globalAlpha = alpha;
    if (pts.length > 1) {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round';
      ctx.setLineDash([C - GAP, GAP]); ctx.lineDashOffset = dashOffset(theta0);
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke(); ctx.setLineDash([]);
      for (const s of stampDistances(theta0, pts.at(-1).s)) { const p = pointAt(pts, s); stamp(p.x, p.y, p.a, color); }
    }
    if (dots) { ctx.fillStyle = color; for (const d of dots) { ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, TAU); ctx.fill(); } }
  }
}
function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const r of S.rails) {
    if (r.frac <= r.from) continue;
    const y0 = railY(r.from), y1 = railY(r.frac);
    drawPath([{ x: g.railX, y: y0, s: 0 }, { x: g.railX, y: y1, s: y1 - y0 }], railTheta(y0, g, r.phase), inks.blue, 5, r.alpha);
  }
  for (const v of S.voids) drawPath(v.pts.map(p => ({ x: p.x + g.railX, y: p.y + g.contentEnd, s: p.s })), v.theta0, inks.lead, 4, v.alpha);
  for (const s of S.strokes) drawPath(s.pts, s.theta0, inks[s.ink], 4, 1, s.dots);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;

  ball.style.transform = `translate(${S.ball.x.toFixed(2)}px, ${S.ball.sy.toFixed(2)}px)`;
  ball.style.setProperty('--lead', `${Math.round(S.lead * 100)}%`);
  const m = glyphOnBall(S.theta, S.dir), a = Math.atan2(S.dir.y, S.dir.x) * 180 / Math.PI;
  glyph.setAttribute('transform', `translate(${m.ox.toFixed(2)} ${m.oy.toFixed(2)}) rotate(${a.toFixed(1)}) scale(${m.squash.toFixed(3)} 1) rotate(${(-a).toFixed(1)})`);
  glyph.style.opacity = m.visible ? m.opacity.toFixed(2) : '0';
}

function frame(now) {
  const dt = Math.min(48, now - last); last = now;
  if (g) {
    if (auto && S.mode !== 'drag') {
      autoAcc += 0.07 * dt;
      const whole = Math.floor(autoAcc);
      if (whole) { scroller.scrollTop += whole; autoAcc -= whole; }
    }
    wrap();
    step(dt);
    draw();
  }
  requestAnimationFrame(frame);
}

/* ---------- input ---------- */
const local = e => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
ball.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  e.preventDefault();
  ball.setPointerCapture(e.pointerId);
  const p = local(e);
  S.pointer = p; S.grab = { x: S.ball.x - p.x, y: S.ball.sy - p.y };
  if (S.mode === 'rail') startStroke();
  S.mode = 'drag'; ball.classList.add('held');
});
ball.addEventListener('pointermove', e => { if (S.mode === 'drag') S.pointer = local(e); });
function release() {
  if (S.mode !== 'drag') return;
  ball.classList.remove('held');
  if (reduced()) { S.mode = 'rail'; snapHome(); return; }
  const a = S.history[0], b = S.history.at(-1), t = Math.max(16, b.t - a.t);
  S.v = { x: (b.x - a.x) / t, y: (b.y - a.y) / t };
  S.mode = Math.hypot(S.v.x, S.v.y) > 0.15 ? 'fling' : 'return';
}
ball.addEventListener('pointerup', release);
ball.addEventListener('pointercancel', release);
ball.addEventListener('lostpointercapture', release);

ball.addEventListener('keydown', e => {
  const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (delta) {
    e.preventDefault();
    if (S.mode === 'rail') startStroke();
    if (S.mode !== 'key') S.key = { x: S.ball.x, y: S.ball.sy };
    S.mode = 'key';
    const n = e.shiftKey ? 72 : 24;
    S.key = { x: clamp(S.key.x + delta[0] * n, 14, g.w - 14), y: clamp(S.key.y + delta[1] * n, 14, g.h - 14) };
  } else if ((e.key === 'Escape' || e.key === 'Enter') && S.mode === 'key') {
    e.preventDefault();
    if (reduced()) { S.mode = 'rail'; snapHome(); } else { S.v = { x: 0, y: 0 }; S.mode = 'return'; }
  }
});
ball.addEventListener('blur', () => { if (S.mode === 'key') { if (reduced()) { S.mode = 'rail'; snapHome(); } else { S.v = { x: 0, y: 0 }; S.mode = 'return'; } } });

scroller.addEventListener('scroll', wrap, { passive: true });

function setAuto(on, say = true) {
  auto = on; autoAcc = 0;
  $('#auto').setAttribute('aria-pressed', String(on));
  if (say) announce(c().announce.auto(on));
}
$('#auto').addEventListener('click', () => setAuto(!auto));
$('#end').addEventListener('click', () => scroller.scrollTo({ top: g.contentEnd - g.h, behavior: reduced() ? 'auto' : 'smooth' }));
$('#clear').addEventListener('click', () => {
  const r = rail();
  S.strokes = []; S.rails = [r]; r.from = r.frac = S.inVoid ? 1 : railFrac(S.ball.sy + scroller.scrollTop);
  S.voids = S.voids.filter(v => v.lap === S.lap).map(v => ({ ...v, pts: [] }));
  if (S.mode !== 'rail') startStroke();
  announce(c().announce.cleared);
});

function setTheme(theme, say = true) {
  root.dataset.theme = theme;
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === theme)));
  if (g) measure();
  if (say) announce(c().announce.theme(theme === 'dark'));
}
document.querySelectorAll('[data-theme-choice]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeChoice)));

function applyLanguage() {
  const t = c();
  root.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t.title} – ${language === 'zh' ? 'Su UI 实验室' : 'Su UI lab'}`;
  for (const el of document.querySelectorAll('[data-copy]')) el.textContent = t[el.dataset.copy];
  t.notes.forEach(([title, body], i) => { $(`#note-title-${i}`).textContent = title; $(`#note-body-${i}`).textContent = body; });
  stage.setAttribute('aria-label', t.stage);
  scroller.setAttribute('aria-label', t.scroller);
  ball.setAttribute('aria-label', t.ball);
  $('#theme-group').setAttribute('aria-label', t.theme);
  const lang = $('#language');
  lang.textContent = language === 'zh' ? 'EN' : '中';
  lang.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  relayout(true);
}
$('#language').addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; saveLocale(language); applyLanguage(); });
followLocale(next => { if (next !== language) { language = next; applyLanguage(); } });

// A drawn loop for thumbnails, so a still frame still shows the idea.
function seedStill() {
  scroller.scrollTop = topFor('read', 0.42, g);
  const h = home(), r = rail();
  r.frac = railFrac(h.y);
  S.theta = railTheta(h.y, g, r.phase);
  const cx = g.railX + g.amp * 1.1, rx = g.amp * 1.05, ry = 64, pts = [];
  for (let i = 0; i <= 120; i++) {
    const a = Math.PI + (i / 120) * TAU * 1.15;
    const x = cx + rx * Math.cos(a) * (1 - i / 400), y = h.y + 36 + ry * Math.sin(a);
    const p = pts.at(-1);
    pts.push({ x, y, s: p ? p.s + Math.hypot(x - p.x, y - p.y) : 0 });
  }
  S.strokes.push({ pts, theta0: 0.6, ink: 'blue', dots: [] });
  snapHome();
}

setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
applyLanguage();
new ResizeObserver(() => relayout(false)).observe(stage);
document.fonts?.ready.then(() => relayout(false));
if (stillParam) seedStill();
else if (preview) setAuto(true, false);
motion.addEventListener('change', () => { if (motion.matches) snapHome(); });
requestAnimationFrame(frame);
