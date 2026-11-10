import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
import { copy } from './content.js';
import { ORDER, N, APP_H, COLLAPSED, GAP, HEIGHTS, offset, cardTop, step } from './model.js';

const $ = (s, el = document) => el.querySelector(s);
const root = document.documentElement;
const params = new URLSearchParams(location.search);
const preview = params.get('preview') === '1';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
if (params.get('still') === '1') root.dataset.still = 'true';
const still = () => motion.matches || root.dataset.still === 'true';

let language = readLocale();
if (!preview) saveLocale(language);
const c = () => copy[language];
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const announce = text => { if (!preview) $('#announce').textContent = text; };

const svg = d => `<svg class="i" viewBox="0 0 16 16" aria-hidden="true">${d}</svg>`;
const ICONS = {
  flight: svg('<path d="M2.2 9.2 8 7.4 12.8 3.2c.6-.5 1.5.3 1 .9L9.7 9.6l-1.4 4.6-1.2-3-4-1.2z"/>'),
  route: svg('<circle cx="4" cy="4" r="1.6"/><circle cx="12" cy="12" r="1.6"/><path d="M4 5.6v3.4a2 2 0 0 0 2 2h4.4M10.4 5.6 12 7.2l1.6-1.6"/>'),
  stays: svg('<path d="M2.5 11.5V7.8A1.8 1.8 0 0 1 4.3 6h7.4a1.8 1.8 0 0 1 1.8 1.8v3.7M2.5 9.5h11"/><path d="M5 6V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V6"/>'),
  dining: svg('<path d="M5 2.5v4M5 6.5v7M8.5 2.5v4c0 1-1 1.6-1.75 2M11 2.5c-.8.8-1.5 2.2-1.5 3.5 0 1.4.8 2 1.5 2.5V13.5"/>'),
  budget: svg('<rect x="2.5" y="4.5" width="11" height="8" rx="1.6"/><path d="M2.5 7h11M5.5 9.8h2"/>'),
  info: svg('<circle cx="8" cy="8" r="5.6"/><path d="M8 7.2v3.2M8 5.2v.01"/>'),
};

const app = $('#app');
const deck = $('#deck');
let focus = ORDER.indexOf(params.get('focus') || 'flight');
if (focus < 0) focus = ORDER.indexOf('flight');
const cards = new Map(); // key -> element

/* ---------- card markup ---------- */
function tripScene() {
  // A torii gate against a blue sky, like the reference's cover photo.
  return `<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <circle cx="302" cy="84" r="30" fill="#f4d05e" opacity=".92"/>
    <ellipse cx="92" cy="70" rx="36" ry="7" fill="#fff" opacity=".3"/>
    <ellipse cx="300" cy="150" rx="26" ry="6" fill="#fff" opacity=".22"/>
    <ellipse cx="180" cy="46" rx="20" ry="5" fill="#fff" opacity=".2"/>
    <path d="M44 116 Q200 88 356 116 L356 136 Q200 108 44 136 Z" fill="#1d2c44"/>
    <path d="M56 132 Q200 104 344 132 L344 152 Q200 124 56 152 Z" fill="#d8402c"/>
    <rect x="84" y="168" width="232" height="15" rx="2" fill="#d8402c"/>
    <rect x="118" y="150" width="20" height="150" fill="#d8402c"/>
    <rect x="262" y="150" width="20" height="150" fill="#bf3524"/>
    <rect x="192" y="150" width="16" height="18" fill="#bf3524"/>
    <rect x="110" y="294" width="36" height="6" fill="#1d2c44"/>
    <rect x="254" y="294" width="36" height="6" fill="#1d2c44"/>
    <path d="M0 300 0 290 400 282 400 300Z" fill="#16283f" opacity=".5"/>
    <path d="M58 96q8-8 16 0M140 60q8-8 16 0" stroke="#dfe8f2" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>
  </svg>`;
}

function headerHtml(key) {
  const t = c()[key];
  return `<header class="card-h"><span class="ci">${ICONS[key]}</span><span class="nm">${esc(c().categories[key])}</span><span class="st">${esc(t.stat)}</span></header>`;
}

function bodyHtml(key) {
  const t = c()[key];
  if (key === 'flight') return `<div class="fl-meta"><span class="no">${esc(t.meta[0])}</span><span class="cl">${esc(t.meta[1])}</span></div>
    <div class="fl-route">
      <div class="fl-city"><div class="cd">${esc(t.from[0])}</div><div class="nm">${esc(t.from[1])}</div><div class="tm">${esc(t.depart)}</div></div>
      <div class="fl-arc"><svg viewBox="0 0 96 40" preserveAspectRatio="none" aria-hidden="true">
        <defs><mask id="flwipe"><path class="fl-wipe" pathLength="100" d="M4 36C30 6 66 6 92 30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></mask></defs>
        <g mask="url(#flwipe)"><path d="M4 36C30 6 66 6 92 30" fill="none" stroke="var(--map-line)" stroke-width="1.4" stroke-dasharray="1 3.4" stroke-linecap="round"/></g></svg>
        <svg class="fl-plane" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"/></svg></div>
      <div class="fl-city right"><div class="cd">${esc(t.to[0])}</div><div class="nm">${esc(t.to[1])}</div><div class="tm">${esc(t.arrive)}<sup>${esc(t.nextDay)}</sup></div></div>
    </div>
    <div class="fl-dur">${esc(t.duration)}</div>
    <div class="fl-grid">${t.grid.map(([lb, vl]) => `<div class="cell"><div class="lb">${esc(lb)}</div><div class="vl">${esc(vl)}</div></div>`).join('')}</div>`;
  if (key === 'route') return `<div class="rt-map"><svg viewBox="0 0 366 292" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      ${[...Array(6)].map((_, r) => `<line x1="10" x2="356" y1="${18 + r * 46}" y2="${18 + r * 46}" stroke="var(--line)" stroke-width="1" stroke-dasharray="1.5 5"/>`).join('')}
      <path class="rt-path" pathLength="100" d="M296 44C240 66 232 110 196 130 160 150 128 152 108 186 92 214 74 232 48 240" fill="none" stroke="var(--route-line)" stroke-width="2.2" stroke-linecap="round"/>
      ${t.stops.map(([nm, d], i) => { const p = [[296, 44], [196, 130], [108, 186], [48, 240]][i]; const delay = 300 + i * 110; return `<circle style="transition-delay:${delay}ms" cx="${p[0]}" cy="${p[1]}" r="4.6" fill="var(--pop)" stroke="var(--route-line)" stroke-width="2.4"/>
        <text style="transition-delay:${delay}ms" x="${p[0] + (i === 3 ? -12 : 12)}" y="${p[1] - 9}" text-anchor="${i === 3 ? 'end' : 'start'}" font-size="12.5" font-weight="600" fill="var(--fg)">${esc(nm)}</text>
        <text style="transition-delay:${delay + 60}ms" x="${p[0] + (i === 3 ? -12 : 12)}" y="${p[1] + 17}" text-anchor="${i === 3 ? 'end' : 'start'}" font-size="10.5" fill="var(--mut)">${esc(d)}</text>`; }).join('')}
    </svg></div><div class="rt-legs">${t.legs.map(([nm, ds, cl]) => `<span class="pill pill-line pill-dot" style="--c:var(--${cl})"><b>${esc(nm)}</b>${esc(ds)}</span>`).join('')}</div>`;
  if (key === 'stays') return `<div class="st-grid">${t.rows.map(([dt, nm, nt, pr], i) => `<div class="st-cell" style="--c:var(--${['blue', 'green', 'amber', 'red'][i]})"><div class="dt">${esc(dt)}</div><div class="nm">${esc(nm)}</div><div class="ft"><span>${esc(nt)}</span><span>${esc(pr)}</span></div></div>`).join('')}</div>
    <div class="st-tip">${ICONS.info}<span>${esc(t.tip)}</span></div>`;
  if (key === 'dining') return `<div class="dn-rows">${t.rows.map(([dy, tm, nm, ds, tag, cls]) => `<div class="dn-row"><div><div class="dy">${esc(dy)}</div><div class="tm">${esc(tm)}</div></div><div><div class="nm">${esc(nm)}</div><div class="ds">${esc(ds)}</div></div><span class="pill ${cls}">${esc(tag)}</span></div>`).join('')}</div>`;
  if (key === 'budget') return `<div class="bg-top"><span class="big">${esc(t.total)}</span><span class="of">${esc(t.of)}</span></div>
    <div class="bg-chips">${t.rows.map(([nm, sp, cap, cl]) => `<span class="pill pill-wash pill-dot" style="--c:var(--${cl === 'yellow' ? 'amber' : cl});--w:var(--${cl === 'yellow' ? 'amber' : cl}-wash)">${esc(nm)} ${esc(sp)}</span>`).join('')}</div>
    <div class="bg-chart">
      <div class="bg-bars" role="img" aria-label="${esc(t.of)}">
        <div class="tick" style="top:20%"><span>$800</span></div><div class="tick" style="top:60%"><span>$400</span></div><div class="tick" style="top:99%"><span>$0</span></div>
        ${[['20', 88, 'red'], ['21', 26, 'soft-blue'], ['22', 64, 'soft-blue'], ['23', 50, 'soft-blue'], ['24', 32, 'map-dot'], ['25', 24, 'map-dot'], ['26', 18, 'map-dot']].map(([d, h, cl], i) =>
          `<div class="bar" style="--h:${h};--c:var(--${cl});transition-delay:${180 + i * 45}ms"></div>`).join('')}
      </div>
      <div class="bg-days">${t.days.map(([d, w], i) => `<div class="d${i === Number(t.today) ? ' today' : ''}">${d}<small>${w}</small></div>`).join('')}</div>
    </div>`;
  return '';
}

function buildCard(key) {
  const el = document.createElement('article');
  el.className = `card card-${key}`;
  el.tabIndex = 0;
  el.dataset.key = key;
  if (key === 'trip') {
    el.innerHTML = `<div class="inner">${tripScene()}<div class="cap"><span class="t">${esc(c().trip.title)}</span><span class="d">${esc(c().trip.date)}</span></div></div>`;
  } else {
    el.innerHTML = `<div class="inner">${headerHtml(key)}<div class="body">${bodyHtml(key)}</div></div>`;
  }
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `${c().categories[key]} — ${key === 'trip' ? `${c().trip.title}, ${c().trip.date}` : c()[key].stat}`);
  return el;
}

function build() {
  deck.innerHTML = '';
  cards.clear();
  for (const key of ORDER) {
    const el = buildCard(key);
    cards.set(key, el);
    deck.appendChild(el);
  }
}

// Rebuilt cards carry no transform yet; without this they'd all cascade
// from translateY(0). Snap them into place, then hand motion back.
function buildAndLayout() {
  deck.classList.add('no-motion');
  build();
  layout();
  if (!still()) requestAnimationFrame(() => requestAnimationFrame(() => deck.classList.remove('no-motion')));
}

/* ---------- layout ---------- */
const appH = () => app.clientHeight || APP_H;
function layout() {
  for (let j = 0; j < N; j++) {
    const key = ORDER[j];
    const el = cards.get(key);
    const d = offset(j, focus);
    el.classList.toggle('on', d === 0);
    el.classList.toggle('far', Math.abs(d) >= 2);
    el.style.height = `${d === 0 ? HEIGHTS[key] : COLLAPSED}px`;
    el.style.transform = `translateY(${cardTop(j, focus, appH())}px)`;
    el.tabIndex = Math.abs(d) <= 1 ? 0 : -1;
    el.setAttribute('aria-expanded', String(d === 0));
  }
}

function goTo(index, say = true) {
  if (index === focus) return;
  focus = index;
  layout();
  if (say) announce(c().announce(c().categories[ORDER[focus]]));
}
const advance = dir => goTo(step(focus, dir));

/* ---------- autoplay ---------- */
let auto = false, autoTimer = 0;
function setAuto(on, say = true) {
  auto = on;
  clearTimeout(autoTimer);
  $('#auto').setAttribute('aria-pressed', String(auto));
  if (say) announce(auto ? c().autoplayOn : c().autoplayOff);
  if (auto) {
    autoTimer = setTimeout(function tick() {
      advance(-1);
      autoTimer = setTimeout(tick, 2600);
    }, still() ? 400 : 1200);
  }
}
function userStop() { if (auto) setAuto(false, false); }

/* ---------- drag & wheel ---------- */
let dragY = 0, dragging = false, py = 0, moved = false, lastT = 0, lastY = 0, vel = 0;
function setDeck(y) { deck.style.transform = `translate3d(0,${y}px,0)`; }
app.addEventListener('pointerdown', e => {
  dragging = true; moved = false; py = e.clientY; lastY = e.clientY; lastT = performance.now(); vel = 0;
  app.setPointerCapture(e.pointerId);
});
app.addEventListener('pointermove', e => {
  if (!dragging) return;
  const y = e.clientY, now = performance.now();
  if (Math.abs(y - py) > 4) moved = true;
  if (moved) {
    vel = 0.8 * vel + 0.2 * ((y - lastY) / Math.max(1, now - lastT));
    dragY = y - py;
    deck.classList.add('dragging');
    setDeck(dragY);
  }
  lastY = y; lastT = now;
});
function release() {
  if (!dragging) return;
  dragging = false;
  deck.classList.remove('dragging');
  setDeck(0);
  if (moved) {
    userStop();
    if (dragY > 64 || vel > 0.4) advance(-1);
    else if (dragY < -64 || vel < -0.4) advance(1);
  }
  dragY = 0; moved = false;
}
app.addEventListener('pointerup', release);
app.addEventListener('pointercancel', release);
// Swallow the click that follows a real drag, so it can't refocus a card.
app.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);

let wheelAcc = 0, wheelTimer = 0;
app.addEventListener('wheel', e => {
  e.preventDefault();
  userStop();
  wheelAcc += e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => wheelAcc = 0, 220);
  if (wheelAcc > 70) { wheelAcc = 0; advance(1); }
  else if (wheelAcc < -70) { wheelAcc = 0; advance(-1); }
}, { passive: false });

/* ---------- card clicks & keys ---------- */
deck.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card || moved) return;
  const j = ORDER.indexOf(card.dataset.key);
  if (j !== focus) { userStop(); goTo(j); }
});
deck.addEventListener('keydown', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); userStop(); advance(1); }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); userStop(); advance(-1); }
  else if (e.key === 'Enter' || e.key === ' ') {
    const j = ORDER.indexOf(card.dataset.key);
    if (j !== focus) { e.preventDefault(); userStop(); goTo(j); }
  }
});

/* ---------- page controls & copy ---------- */
$('#auto').addEventListener('click', () => setAuto(!auto));
$('#replay').addEventListener('click', () => { userStop(); goTo(ORDER.indexOf('flight')); });

function setTheme(theme, say = true) {
  root.dataset.theme = theme;
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === theme)));
  if (say) announce(theme === 'dark' ? c().themeDark : c().themeLight);
}
document.querySelectorAll('[data-theme-choice]').forEach(b => b.addEventListener('click', () => { userStop(); setTheme(b.dataset.themeChoice); }));

function applyLanguage() {
  const t = c();
  root.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t.title} · ${language === 'zh' ? 'Su UI 实验室' : 'Su UI lab'}`;
  for (const el of document.querySelectorAll('[data-copy]')) el.textContent = t[el.dataset.copy];
  t.notes.forEach(([title, body], i) => { $(`#note-title-${i}`).textContent = title; $(`#note-body-${i}`).textContent = body; });
  app.setAttribute('aria-label', t.appLabel);
  $('#stage').setAttribute('aria-label', t.stage);
  $('#theme-group').setAttribute('aria-label', t.theme);
  const lang = $('#language');
  lang.textContent = language === 'zh' ? 'EN' : '中';
  lang.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  // Rebuild card contents in place; focus position is preserved.
  buildAndLayout();
}
$('#language').addEventListener('click', () => { userStop(); language = language === 'en' ? 'zh' : 'en'; saveLocale(language); applyLanguage(); });
followLocale(next => { if (next !== language) { language = next; applyLanguage(); } });

new ResizeObserver(() => { layout(); }).observe(app);

setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
applyLanguage();
if (still()) deck.classList.add('no-motion');
if (params.get('auto') === '1' && !still()) setAuto(true, false);
