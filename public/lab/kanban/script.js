import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
import { copy } from './content.js';
import { people, columns, initialCards, inCell, cellOf, cellKey, laneIds, load, wouldExceed, moveCard, position, nudge, createCard, nextId } from './model.js';

const $ = selector => document.querySelector(selector);
const board = $('#board'), heads = $('#heads'), lanesEl = $('#lanes'), scroller = $('#scroller'), layer = $('#drag-layer');
const params = new URLSearchParams(location.search);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const preview = params.get('preview') === '1';
const still = () => motion.matches || params.get('still') === '1';
if (params.get('still') === '1') document.documentElement.dataset.still = 'true';
// Local visual QA can slow the same motion with ?motion=8; production ignores it.
const slow = ['localhost', '127.0.0.1'].includes(location.hostname) ? Math.max(1, Math.min(20, Number(params.get('motion')) || 1)) : 1;
const easing = 'cubic-bezier(.22, 1, .36, 1)';
const ms = n => n * slow;

let language = readLocale();
saveLocale(language);
const c = () => copy[language];
let cards = initialCards(), view = 'status';
let composer = null;     // { cell } while the inline composer is open
let pending = null;      // pointer down, not yet a drag
let drag = null;         // pointer drag in progress
let grabbed = null;      // keyboard drag in progress
const cardEls = new Map();
const flips = new WeakMap();

const svg = body => `<svg viewBox="0 0 16 16" aria-hidden="true">${body}</svg>`;
const icons = {
  due: svg('<rect x="2.5" y="3.5" width="11" height="10" rx="2"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3"/>'),
  check: svg('<path d="m2 4 1.3 1.3L5.5 3M2 10l1.3 1.3L5.5 9M8 4.3h6M8 10.3h6"/>'),
  plus: svg('<path d="M8 3v10M3 8h10"/>'),
};
const person = id => people.find(p => p.id === id);
const columnName = status => c().columns[status];
const titleOf = card => card.title ?? c().cards[card.id];
function avatar(owner, size = '') {
  const p = person(owner);
  return p ? `<span class="avatar ${size}" data-person="${p.id}" title="${p.name}">${p.initials}</span>` : `<span class="avatar empty ${size}" title="${c().unassigned}"></span>`;
}
function announce(text) { $('#announce').textContent = text; }

// Moving a focused element normally blurs it; moveBefore keeps focus where supported.
function place(parent, el, ref = null) {
  if (el === ref || (el.parentNode === parent && (ref ? el.nextSibling === ref : parent.lastChild === el))) return;
  const focused = document.activeElement === el;
  try { if (!parent.moveBefore || !el.isConnected) throw 0; parent.moveBefore(el, ref); } catch { parent.insertBefore(el, ref); }
  if (focused && document.activeElement !== el) el.focus({ preventScroll: true });
}

// FLIP: read the visible rects (in-flight transforms included), cancel, change the layout, play back.
function flip(mutate, skip = null) {
  if (still()) { mutate(); return; }
  const before = new Map();
  for (const el of cardEls.values()) if (el.isConnected && el !== skip) before.set(el, el.getBoundingClientRect());
  for (const el of before.keys()) flips.get(el)?.cancel();
  mutate();
  for (const [el, a] of before) {
    if (!el.isConnected) continue;
    const b = el.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (Math.abs(dx) < .5 && Math.abs(dy) < .5) continue;
    flips.set(el, el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: ms(340), easing }));
  }
}

function cardEl(card) {
  let el = cardEls.get(card.id);
  if (!el) {
    el = document.createElement('div');
    el.className = 'card';
    el.tabIndex = 0;
    el.dataset.id = card.id;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-describedby', 'kb-help');
    cardEls.set(card.id, el);
  }
  const t = c();
  const meta = [
    card.due ? `<span class="meta">${icons.due}${t.date(card.due)}</span>` : '',
    card.check ? `<span class="meta">${icons.check}${card.check[0]}/${card.check[1]}</span>` : '',
    card.points != null ? `<span class="meta">${t.points(card.points)}</span>` : '',
  ].join('');
  el.innerHTML = `<div class="card-top"><span class="card-id">${card.id}</span>${card.tag ? `<span class="tag" data-tag="${card.tag}">${t.tags[card.tag]}</span>` : ''}</div>
<p class="card-title"></p><div class="card-foot">${meta}${avatar(card.owner)}</div>`;
  el.querySelector('.card-title').textContent = titleOf(card);
  el.setAttribute('aria-roledescription', t.draggable);
  el.setAttribute('aria-label', `${card.id}, ${titleOf(card)}, ${person(card.owner)?.name ?? t.unassigned}`);
  return el;
}

heads.innerHTML = columns.map(column => `<div class="head" data-status="${column.id}"><span class="head-name"></span><span class="head-count"></span><span class="badge"></span><button type="button" class="icon-button" data-add="${column.id}">${icons.plus}</button></div>`).join('');
// Heads are updated in place so a focused "+" survives every re-layout.
function renderHeads() {
  for (const column of columns) {
    const { count, limit, over } = load(cards, column.id);
    const head = heads.querySelector(`[data-status="${column.id}"]`);
    head.toggleAttribute('data-over', over);
    head.querySelector('.head-name').textContent = columnName(column.id);
    head.querySelector('.head-count').textContent = limit != null ? `${count}/${limit}` : count;
    head.querySelector('.badge').textContent = c().overLimit;
    head.querySelector('button').setAttribute('aria-label', c().addTo(columnName(column.id)));
  }
  $('#board-count').textContent = c().count(cards.length);
}

// Builds lanes/cells for the current view, reusing existing cells, then slots every card in order.
function layout() {
  const lanes = view === 'lanes' ? laneIds(cards, composer?.cell.owner === null) : ['any'];
  const keep = new Set();
  lanes.forEach((lane, li) => {
    const key = `lane-${view}-${lane ?? 'none'}`;
    let laneEl = lanesEl.querySelector(`[data-lane="${key}"]`);
    if (!laneEl) {
      laneEl = document.createElement('section');
      laneEl.className = 'lane';
      laneEl.dataset.lane = key;
      laneEl.innerHTML = `${view === 'lanes' ? '<h3 class="lane-head"></h3>' : ''}<div class="lane-cells"></div>`;
      for (const column of columns) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.cell = cellKey(view === 'lanes' ? { status: column.id, owner: lane } : { status: column.id });
        cell.dataset.status = column.id;
        if (view === 'lanes') cell.dataset.owner = lane ?? '';
        cell.innerHTML = `<button type="button" class="add">${icons.plus}<span></span></button>`;
        laneEl.lastChild.append(cell);
      }
    }
    if (lanesEl.children[li] !== laneEl) place(lanesEl, laneEl, lanesEl.children[li] ?? null);
    keep.add(laneEl);
    if (view === 'lanes') {
      const count = cards.filter(card => card.owner === lane).length;
      laneEl.querySelector('.lane-head').innerHTML = `${avatar(lane, 'small')}<span></span><span class="lane-count">${count}</span>`;
      laneEl.querySelector('.lane-head span:not(.avatar):not(.lane-count)').textContent = person(lane)?.name ?? c().unassigned;
    }
  });
  // Fill the new cells first; stale lanes leave only after their cards have moved out.
  for (const cellEl of [...keep].flatMap(lane => [...lane.querySelectorAll('.cell')])) {
    const cell = view === 'lanes' ? { status: cellEl.dataset.status, owner: cellEl.dataset.owner || null } : { status: cellEl.dataset.status };
    const add = cellEl.querySelector('.add');
    add.querySelector('span').textContent = c().addCard;
    add.setAttribute('aria-label', view === 'lanes' ? c().addFor(columnName(cell.status), person(cell.owner)?.name ?? c().unassigned) : c().addTo(columnName(cell.status)));
    for (const card of cards.filter(item => inCell(item, cell))) {
      const el = cardEls.get(card.id) ?? cardEl(card);
      if (drag?.el === el) continue;
      place(cellEl, el, add);
    }
    cellEl.toggleAttribute('data-over', load(cards, cell.status).over);
    const form = cellEl.querySelector('.composer');
    if (composer && cellKey(composer.cell) === cellEl.dataset.cell) { if (!form) cellEl.insertBefore(composerEl(), add); }
    else form?.remove();
    add.hidden = !!(composer && cellKey(composer.cell) === cellEl.dataset.cell);
  }
  [...lanesEl.children].forEach(el => { if (!keep.has(el)) el.remove(); });
  board.dataset.view = view;
  renderHeads();
}
function cellFromEl(cellEl) {
  return view === 'lanes' ? { status: cellEl.dataset.status, owner: cellEl.dataset.owner || null } : { status: cellEl.dataset.status };
}
function cellElFor(cell) { return lanesEl.querySelector(`.cell[data-cell="${cellKey(cell)}"]`); }

/* ---------- Pointer drag ---------- */
const pickedUp = el => el.closest('.card') && !el.closest('button, textarea, input, a');
lanesEl.addEventListener('pointerdown', e => {
  const el = e.target.closest('.card');
  if (!el || e.button !== 0 || drag || grabbed || !pickedUp(e.target)) return;
  pending = { el, pointerId: e.pointerId, type: e.pointerType, x: e.clientX, y: e.clientY, timer: 0 };
  // Touch must hold still briefly, so a swipe across the board still scrolls it.
  if (e.pointerType !== 'mouse') {
    el.dataset.pressing = '';
    pending.timer = setTimeout(() => { if (pending) begin(pending.x, pending.y); }, 220);
  }
});
function dropPending() {
  if (!pending) return;
  clearTimeout(pending.timer);
  delete pending.el.dataset.pressing;
  pending = null;
}
window.addEventListener('pointermove', e => {
  if (pending && e.pointerId === pending.pointerId) {
    const distance = Math.hypot(e.clientX - pending.x, e.clientY - pending.y);
    if (pending.type === 'mouse' && distance > 4) begin(e.clientX, e.clientY);
    else if (pending.type !== 'mouse') { if (distance > 8) dropPending(); else { pending.x = e.clientX; pending.y = e.clientY; } }
  }
  if (drag && e.pointerId === drag.pointerId) { drag.px = e.clientX; drag.py = e.clientY; retarget(); }
});
window.addEventListener('pointerup', e => {
  if (pending && e.pointerId === pending.pointerId) dropPending();
  if (drag && e.pointerId === drag.pointerId) finish(true);
});
window.addEventListener('pointercancel', e => {
  if (pending && e.pointerId === pending.pointerId) dropPending();
  if (drag && e.pointerId === drag.pointerId) finish(false);
});
// Only a live drag blocks scrolling; this listener must be non-passive to be allowed to.
document.addEventListener('touchmove', e => { if (drag) e.preventDefault(); }, { passive: false });
lanesEl.addEventListener('contextmenu', e => { if (pending || drag) e.preventDefault(); });

function begin(x, y) {
  const { el, pointerId } = pending;
  dropPending();
  const card = cards.find(item => item.id === el.dataset.id);
  const rect = el.getBoundingClientRect();
  flips.get(el)?.cancel();
  const slot = document.createElement('div');
  slot.className = 'slot';
  slot.style.height = `${rect.height}px`;
  el.replaceWith(slot);
  el.style.width = `${rect.width}px`;
  el.dataset.lifted = '';
  layer.append(el);
  const cell = cellOf(card, view);
  drag = { el, id: card.id, pointerId, slot, origin: { cell, index: position(cards, card.id, view).index }, cell, index: position(cards, card.id, view).index,
    ox: x - rect.left, oy: y - rect.top, px: x, py: y, x: rect.left, y: rect.top, vx: 0, r: 0, lastX: x, frame: 0 };
  document.documentElement.dataset.dragging = '';
  mark();
  tick();
  announce(c().announce.lifted(card.id, columnName(card.status)));
}

// One frame loop: follow the pointer, lean with velocity, auto-scroll near edges.
function tick() {
  if (!drag) return;
  drag.x = drag.px - drag.ox;
  drag.y = drag.py - drag.oy;
  drag.vx += ((drag.px - drag.lastX) - drag.vx) * .3;
  drag.lastX = drag.px;
  const lean = still() ? 0 : Math.max(-7, Math.min(7, 1.6 + drag.vx * .45));
  drag.r += (lean - drag.r) * .18;
  drag.el.style.translate = `${drag.x}px ${drag.y}px`;
  drag.el.style.rotate = `${drag.r.toFixed(2)}deg`;
  const box = scroller.getBoundingClientRect();
  const edge = 48;
  const sx = drag.px < box.left + edge ? -1 : drag.px > box.right - edge ? 1 : 0;
  const sy = drag.py < edge ? -1 : drag.py > innerHeight - edge ? 1 : 0;
  if (sx && scroller.scrollWidth > scroller.clientWidth) { scroller.scrollLeft += sx * 12; retarget(); }
  if (sy) { scrollBy(0, sy * 12); retarget(); }
  drag.frame = requestAnimationFrame(tick);
}

function retarget() {
  const hit = document.elementFromPoint(drag.px, drag.py)?.closest('.cell');
  const cellEl = hit ?? cellElFor(drag.cell);
  if (!cellEl) return;
  const siblings = [...cellEl.querySelectorAll(':scope > .card')];
  // Compare against layout boxes (offsetTop ignores FLIP transforms), so sliding cards cannot flicker the slot.
  const y = drag.py - cellEl.getBoundingClientRect().top;
  let index = siblings.findIndex(el => y < el.offsetTop + el.offsetHeight / 2);
  if (index < 0) index = siblings.length;
  const cell = cellFromEl(cellEl);
  if (cellKey(cell) === cellKey(drag.cell) && index === drag.index) return;
  drag.cell = cell; drag.index = index;
  flip(() => cellEl.insertBefore(drag.slot, siblings[index] ?? cellEl.querySelector('.composer, .add')));
  mark();
}
function mark() {
  for (const el of lanesEl.querySelectorAll('.cell')) {
    const target = drag && el.dataset.cell === cellKey(drag.cell);
    el.toggleAttribute('data-target', target);
    el.toggleAttribute('data-warn', !!target && wouldExceed(cards, drag.id, drag.cell.status));
  }
}

function finish(commit) {
  const { el, slot, id, origin } = drag;
  cancelAnimationFrame(drag.frame);
  const from = { x: drag.x, y: drag.y, r: drag.r };
  const before = cards;
  if (commit) cards = moveCard(cards, id, drag.cell, drag.index);
  else flip(() => { const home = cellElFor(origin.cell); home.insertBefore(slot, [...home.querySelectorAll(':scope > .card')][origin.index] ?? home.querySelector('.composer, .add')); });
  slot.replaceWith(el);
  delete el.dataset.lifted;
  el.style.width = el.style.translate = el.style.rotate = '';
  drag = null;
  delete document.documentElement.dataset.dragging;
  mark();
  cardEl(cards.find(item => item.id === id));
  flip(layout, el);
  // Settle from the exact lifted pose (tilt included) into the slot.
  const to = el.getBoundingClientRect();
  if (!still()) el.animate([{ translate: `${from.x - to.left}px ${from.y - to.top}px`, rotate: `${from.r}deg`, scale: 1.03 }, { translate: '0 0', rotate: '0deg', scale: 1 }], { duration: ms(360), easing });
  const card = cards.find(item => item.id === id);
  if (!commit) announce(c().announce.cancelled(id, columnName(card.status)));
  else if (before !== cards) announce(c().announce.dropped(id, columnName(card.status), load(cards, card.status)));
}

/* ---------- Keyboard drag ---------- */
lanesEl.addEventListener('keydown', e => {
  const el = e.target.closest('.card');
  if (!el || e.target !== el || drag) return;
  const id = el.dataset.id;
  if (!grabbed && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault();
    grabbed = { id, snapshot: cards };
    el.dataset.grabbed = '';
    const card = cards.find(item => item.id === id);
    announce(c().announce.grabbed(id, columnName(card.status)));
    return;
  }
  if (!grabbed || grabbed.id !== id) return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); release(true); return; }
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); release(false); return; }
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const target = nudge(cards, id, e.key, view);
  if (!target) return;
  cards = moveCard(cards, id, target.cell, target.index);
  cardEl(cards.find(item => item.id === id));
  flip(layout);
  el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: still() ? 'auto' : 'smooth' });
  const card = cards.find(item => item.id === id);
  const at = position(cards, id, view);
  announce(c().announce.moved(columnName(card.status), view === 'lanes' ? person(card.owner)?.name ?? c().unassigned : null, at.index + 1, at.total, load(cards, card.status)));
});
function release(commit) {
  const el = cardEls.get(grabbed.id);
  const id = grabbed.id;
  if (!commit) { cards = grabbed.snapshot; cardEl(cards.find(item => item.id === id)); flip(layout); }
  delete el.dataset.grabbed;
  grabbed = null;
  const card = cards.find(item => item.id === id);
  announce(commit ? c().announce.dropped(id, columnName(card.status), load(cards, card.status)) : c().announce.cancelled(id, columnName(card.status)));
}
lanesEl.addEventListener('focusout', e => {
  if (grabbed && e.target.dataset?.id === grabbed.id && e.relatedTarget && e.relatedTarget !== e.target) release(true);
});

/* ---------- Composer ---------- */
function composerEl() {
  const form = document.createElement('form');
  form.className = 'composer';
  form.innerHTML = '<textarea rows="2" maxlength="80"></textarea><div class="composer-row"><span class="composer-hint"></span><button type="submit"></button></div>';
  const area = form.querySelector('textarea');
  area.placeholder = c().composer.placeholder;
  area.setAttribute('aria-label', c().composer.label);
  form.querySelector('.composer-hint').textContent = c().composer.hint;
  form.querySelector('button').textContent = c().composer.add;
  form.addEventListener('submit', e => { e.preventDefault(); commitComposer(area, true); });
  area.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); commitComposer(area, true); }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeComposer(true); }
  });
  form.addEventListener('focusout', e => {
    if (form.contains(e.relatedTarget)) return;
    setTimeout(() => { if (composer && !form.contains(document.activeElement) && form.isConnected) area.value.trim() ? commitComposer(area, false) : closeComposer(false); });
  });
  return form;
}
function openComposer(cell) {
  if (drag || grabbed) return;
  composer = { cell };
  flip(layout);
  const form = cellElFor(cell)?.querySelector('.composer');
  form?.querySelector('textarea').focus({ preventScroll: true });
  form?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function closeComposer(restoreFocus) {
  if (!composer) return;
  const cell = composer.cell;
  composer = null;
  flip(layout);
  if (restoreFocus) cellElFor(cell)?.querySelector('.add')?.focus({ preventScroll: true });
}
// Enter keeps the composer open for the next card; blurring with text saves and closes.
function commitComposer(area, keepOpen) {
  const title = area.value.trim().replace(/\s+/g, ' ');
  if (!title || !composer) { closeComposer(true); return; }
  const cell = composer.cell;
  const id = nextId(cards);
  cards = createCard(cards, cell, title);
  area.value = '';
  composer = keepOpen ? { cell } : null;
  flip(layout);
  const el = cardEls.get(id);
  if (el && !still()) el.animate([{ opacity: 0, scale: .96 }, { opacity: 1, scale: 1 }], { duration: ms(260), easing });
  if (keepOpen) cellElFor(cell)?.querySelector('.composer textarea')?.focus({ preventScroll: true });
  announce(c().announce.created(id, columnName(cell.status)));
}
board.addEventListener('click', e => {
  const head = e.target.closest('[data-add]');
  if (head) { openComposer(view === 'lanes' ? { status: head.dataset.add, owner: null } : { status: head.dataset.add }); return; }
  const add = e.target.closest('.add');
  if (add) openComposer(cellFromEl(add.closest('.cell')));
});

/* ---------- View, theme, language ---------- */
const toggle = $('#view-group');
function moveThumb(animate) {
  const active = toggle.querySelector('[aria-pressed="true"]');
  toggle.toggleAttribute('data-instant', !animate || still());
  toggle.style.setProperty('--thumb-x', `${active.offsetLeft}px`);
  toggle.style.setProperty('--thumb-w', `${active.offsetWidth}px`);
}
function setView(next, animate = true) {
  if (next === view || drag) return;
  if (grabbed) release(true);
  composer = null;
  toggle.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === next)));
  moveThumb(animate);
  const run = () => { view = next; layout(); };
  animate ? flip(run) : run();
  announce(c().announce.view(next));
}
toggle.addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });

function setTheme(theme, say = true) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === theme)));
  if (say) announce(c().announce.theme(theme === 'dark'));
}
function applyLanguage() {
  const t = c();
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t.title} · ${language === 'zh' ? 'Su UI 实验室' : 'Su UI lab'}`;
  for (const el of document.querySelectorAll('[data-copy]')) el.textContent = t[el.dataset.copy];
  t.notes.forEach(([title, body], i) => { $(`#note-title-${i}`).textContent = title; $(`#note-body-${i}`).textContent = body; });
  const lang = $('#language');
  lang.textContent = language === 'zh' ? 'EN' : '中';
  lang.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  toggle.setAttribute('aria-label', t.viewLabel);
  $('#theme-group').setAttribute('aria-label', t.theme);
  $('.stage').setAttribute('aria-label', t.stage);
  // Copy changes in place; order, view, grab and composer state are untouched.
  for (const card of cards) cardEl(card);
  lanesEl.querySelectorAll('.composer').forEach(form => {
    form.querySelector('textarea').placeholder = t.composer.placeholder;
    form.querySelector('.composer-hint').textContent = t.composer.hint;
    form.querySelector('button').textContent = t.composer.add;
  });
  layout();
  moveThumb(false);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drag) { e.preventDefault(); finish(false); }
});
$('#reset').addEventListener('click', () => {
  if (drag) finish(false);
  if (grabbed) release(false);
  composer = null;
  cards = initialCards();
  for (const card of cards) cardEl(card);
  for (const [id, el] of cardEls) if (!cards.some(card => card.id === id)) { el.remove(); cardEls.delete(id); }
  toggle.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === 'status')));
  moveThumb(true);
  flip(() => { view = 'status'; layout(); });
  announce(c().announce.reset);
});
document.querySelectorAll('[data-theme-choice]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeChoice)));
$('#language').addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; saveLocale(language); applyLanguage(); });
followLocale(next => { if (next !== language) { language = next; applyLanguage(); } });
addEventListener('resize', () => moveThumb(false));

setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', false);
applyLanguage();
