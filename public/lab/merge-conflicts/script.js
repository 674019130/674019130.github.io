import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
import { copy } from './content.js';
import { ORDER, LANE, LX, FILES, TESTS, CONFLICTS, CHECKS, diffTotals, conflictsByCommit, baseRows, firstCommit, lenaRows, graphPaths, shape, scrambleFrame } from './model.js';

const $ = (selector, el = document) => el.querySelector(selector);
const root = document.documentElement;
const params = new URLSearchParams(location.search);
const preview = params.get('preview') === '1';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
if (params.get('still') === '1') root.dataset.still = 'true';
const still = () => motion.matches || root.dataset.still === 'true';
// Local visual QA can slow the same motion with ?motion=8; production ignores it.
const slow = ['localhost', '127.0.0.1'].includes(location.hostname) ? Math.max(1, Math.min(20, Number(params.get('motion')) || 1)) : 1;

let language = readLocale();
if (!preview) saveLocale(language);
const c = () => copy[language];

const svg = d => `<svg class="i" viewBox="0 0 16 16" aria-hidden="true">${d}</svg>`;
const I = {
  chev: svg('<path d="M6 4l4 4-4 4"/>'),
  down: svg('<path d="M4 6l4 4 4-4"/>'),
  warn: svg('<path d="M8 2.6l5.8 10H2.2z"/><path d="M8 6.6v2.7M8 11.2v.01"/>'),
  check: svg('<path d="M3.5 8.5l3 3 6-6.5"/>'),
  merge: svg('<circle cx="4.5" cy="3.8" r="1.6"/><circle cx="4.5" cy="12.2" r="1.6"/><circle cx="11.5" cy="8" r="1.6"/><path d="M4.5 5.4v5.2M4.5 5.4c0 1.8 1.6 2.6 5.4 2.6"/>'),
  ext: svg('<path d="M6.5 3.5h-3v9h9v-3M9 3.5h3.5V7M12.5 3.5L7 9"/>'),
};
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const announce = text => { if (!preview) $('#announce').textContent = text; };

/* ---------- state ---------- */
// Copy is stored as keys, so a language switch can re-render any moment of the story.
let S;
const fresh = () => ({ user: null, think: null, card: null, reply: false, chip: 'create', diff: true, merged: false, mark: 'idle' });

/* ---------- engine: one async script with gates you can fast-forward through ---------- */
let runId = 0, ff = null, auto = false, autoTimer = 0, quiet = false;
const gates = {};
const CANCEL = {};
const wait = ms => { const id = runId; return new Promise(r => ff ? r() : setTimeout(r, ms * slow)).then(() => { if (id !== runId) throw CANCEL; }); };
function gate(name) {
  const id = runId;
  if (ff) return Promise.resolve(null);
  return new Promise(res => { gates[name] = res; scheduleAuto(); }).then(v => { if (id !== runId) throw CANCEL; return v; });
}
function scheduleAuto() {
  clearTimeout(autoTimer);
  const name = Object.keys(gates)[0];
  if (!auto || !name) return;
  autoTimer = setTimeout(() => {
    $(`[data-act="${name}"]`)?.classList.add('pressing');
    setTimeout(() => press(name), 260);
  }, name === 'start' ? 900 : 1900);
}
function press(name, payload) {
  const g = gates[name]; if (!g) return;
  delete gates[name]; clearTimeout(autoTimer); g(payload);
}
function mark(label) {
  S.mark = label;
  document.querySelectorAll('[data-jump]').forEach(b => b.toggleAttribute('aria-current', false));
  $(`[data-jump="${label}"]`)?.setAttribute('aria-current', 'step');
  if (ff === label) { ff = null; render(); settle(); }
}
// Let the instantly-built state paint once before transitions come back.
// rAF can stall in a background tab or an unpainted frame, so a timer backs it up.
function settle() {
  const done = () => { if (!ff) root.classList.remove('ff'); };
  requestAnimationFrame(() => requestAnimationFrame(done));
  setTimeout(done, 120);
}
function start(target) {
  runId++; clearTimeout(autoTimer);
  Object.keys(gates).forEach(k => delete gates[k]);
  ff = target === 'idle' ? null : target;
  root.classList.toggle('ff', !!ff);
  $('#convo').innerHTML = ''; cache.clear(); rowEls.clear();
  S = fresh(); render();
  flow().catch(e => { if (e !== CANCEL) console.error(e); });
}

/* ---------- the story ---------- */
async function flow() {
  mark('idle');
  const text = await gate('start');
  S.user = text ? { text } : { key: 'create' }; S.chip = 'creating'; render();
  await wait(550);
  S.think = { t0: performance.now(), done: false, steps: [] }; render();
  await wait(500);
  S.card = { pr: false, state: null, rows: baseRows(), conn: 'blue', checks: false, flow: ['b'], foot: { icon: 'spin', step: ['committing'] } };
  render();
  await wait(1500);

  const R = S.card.rows;
  Object.assign(R.c1, firstCommit());
  S.think.steps.push('committed');
  S.card.foot = { icon: 'spin', step: ['pushing'] }; render();
  await wait(1100);
  S.card.foot = { icon: 'spin', step: ['opening'] }; render();
  await wait(1100);

  S.card.pr = true; S.card.state = 'open';
  S.think.steps.push('opened');
  R.merge = { titleKey: 'mergeInto', tone: 'other', node: 'spinner', busy: true, right: null };
  S.card.foot = { icon: 'spin', step: ['fetching'] };
  S.card.flow = ['m']; render();
  announce(c().announce.opened);
  await wait(700);
  delete R.base.tag;
  Object.assign(R, lenaRows());
  render();
  await wait(1000);
  R.merge.right = { k: 'checking', tone: 'checking' };
  S.card.foot = { icon: 'spin', step: ['checking'] };
  S.card.flow = ['m', 'conn']; render();
  await wait(1300);

  const per = conflictsByCommit();
  R.merge.busy = false;
  Object.assign(R.l1, { tone: 'conflict', nodeTone: 'amber', badge: per.l1, flash: false });
  Object.assign(R.l2, { tone: 'conflict', nodeTone: 'amber', badge: per.l2, flash: false });
  Object.assign(R.merge, { node: 'warn', right: { k: 'conflicts', n: CONFLICTS.length, tone: 'amber' } });
  S.card.conn = 'amber';
  S.card.foot = { icon: 'warn', final: 'conflicts', btn: { act: 'resolve', label: 'resolve' } };
  S.think.steps.push('conflicts');
  S.think.done = true; S.chip = 'conflicts';
  S.card.flow = []; render();
  await wait(300);
  S.reply = true; render();
  announce(c().announce.conflicts);
  mark('conflicts');

  await gate('resolve');
  mark('resolving');
  announce(c().announce.resolving);
  S.chip = 'resolving';
  S.card.foot = { icon: 'spin', step: ['mergingMain'], btn: { busy: true, label: 'resolving' } };
  R.merge.node = 'warn-pulse';
  S.card.flow = ['m', 'mm']; render();
  await wait(1000);
  R.mm = { title: 'Merge main into feat/session-refresh', tone: 'you', node: 'ring-busy', busy: true, tag: ['feat/session-refresh', 'blue'], right: { k: 'count', n: '0/3', tone: 'checking' } };
  render();
  await wait(700);
  for (let k = 1; k <= CONFLICTS.length; k++) {
    S.card.foot = { ...S.card.foot, step: ['resolving', k] };
    R.mm.right = { k: 'count', n: `${k}/3`, tone: 'checking' }; render();
    await wait(1000);
    const row = R[CONFLICTS[k - 1].commit];
    row.badge -= 1;
    if (!row.badge) Object.assign(row, { badge: 'ok', tone: 'other', nodeTone: null });
    const left = CONFLICTS.length - k;
    R.merge.right = left ? { k: 'conflicts', n: left, tone: 'amber' } : { k: 'resolved', tone: 'amber' };
    render();
  }
  await wait(400);
  S.card.foot = { ...S.card.foot, step: ['pushingMerge'] };
  Object.assign(R.mm, { hash: '7e0c3b', who: 'you', when: 'now', right: null });
  S.card.flow = ['b']; render();
  await wait(1100);
  for (let n = 1; n <= TESTS; n++) {
    S.card.foot = { ...S.card.foot, step: ['testing', n, TESTS] };
    R.mm.right = { k: 'count', n: `${n}/${TESTS}`, tone: 'checking' }; R.mm.prog = n / TESTS; render();
    await wait(n < 6 ? 120 : 45);
  }
  await wait(300);

  Object.assign(R.mm, { right: null, prog: null, busy: false, node: 'ring' });
  delete R.l1.badge; delete R.l2.badge;
  Object.assign(R.merge, { node: 'ok', right: { k: 'ready', tone: 'green' } });
  S.card.conn = 'green'; S.card.checks = true; S.chip = 'ready';
  S.card.foot = { icon: 'ok', final: 'ready', btn: { act: 'merge', label: 'merge', icon: I.merge } };
  S.card.flow = []; render();
  announce(c().announce.ready);
  mark('ready');

  await gate('merge');
  S.chip = 'merging';
  S.card.foot = { icon: 'spin', step: ['merging'], btn: { busy: true, label: 'merging' } };
  R.merge.busy = true;
  S.card.conn = 'purple'; S.card.flow = ['b', 'conn']; render();
  await wait(1300);

  S.merged = true; S.card.state = 'merged'; S.card.checks = false;
  Object.assign(R.merge, { titleKey: 'mergedInto', tone: 'you', node: 'merged', busy: false, tag: ['main', 'main'], right: { k: 'merged', tone: 'purple' } });
  delete R.l1.tag;
  ['mm', 'c1', 'c2', 'c3'].forEach((id, i) => { R[id].sweep = i * 110; });
  S.card.foot = { icon: 'merged', final: 'merged', btn: { act: 'github', label: 'github', icon: I.ext, plain: true } };
  S.chip = 'merged'; S.diff = false;
  S.card.flow = []; render();
  announce(c().announce.merged);
  mark('merged');
}

/* ---------- rendering ---------- */
const cache = new Map();
const rowEls = new Map();
function set(el, key, html) { if (cache.get(key) === html) return false; cache.set(key, html); el.innerHTML = html; return true; }
function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
const lively = () => !ff && !quiet && !still();

function slot(id, make) {
  let el = document.getElementById(id);
  if (!el) { el = make(); el.id = id; if (!quiet) el.classList.add('appear'); $('#convo').appendChild(el); }
  return el;
}
const tag = (name, cls) => Object.assign(document.createElement(name), { className: cls });

function render() {
  renderChips();
  if (S.user) set(slot('u', () => tag('div', 'bubble')), 'u', esc(S.user.text ?? c().chips[S.user.key]));
  if (S.think) renderThink();
  if (S.card) renderCard();
  if (S.reply) {
    const el = slot('reply', () => tag('p', 'reply'));
    const html = c().reply;
    if (cache.get('reply') !== html) { cache.set('reply', html); el.innerHTML = lively() ? streamWords(html) : html; }
  }
}

function streamWords(html) {
  let i = 0;
  return html.replace(/(<code>.*?<\/code>|<b>.*?<\/b>|[^\s<]+)/g, m => `<span class="w" style="animation-delay:${(i++) * 22}ms">${m}</span>`);
}

// Decode a title out of noise, left to right; the unresolved tail is drawn fainter.
function scramble(el, text) {
  if (!el || !lively()) return;
  const dur = (260 + text.length * 16) * slow;
  const t0 = performance.now();
  const tick = now => {
    if (!el.isConnected) return;
    const p = Math.min(1, (now - t0) / dur);
    const { head, tail } = scrambleFrame(text, p);
    el.innerHTML = esc(head) + (tail ? `<span class="scr">${tail}</span>` : '');
    if (p < 1) requestAnimationFrame(tick); else el.textContent = text;
  };
  requestAnimationFrame(tick);
}

function renderThink() {
  const el = slot('think', () => {
    const d = tag('div', 'think');
    d.innerHTML = `<button type="button" aria-expanded="false">${I.chev}<span class="lbl"></span></button><ol hidden></ol>`;
    d.firstElementChild.addEventListener('click', e => {
      const open = e.currentTarget.getAttribute('aria-expanded') !== 'true';
      e.currentTarget.setAttribute('aria-expanded', String(open)); d.querySelector('ol').hidden = !open;
    });
    return d;
  });
  tickThink();
  set($('ol', el), 'think-steps', S.think.steps.map(k => `<li>${esc(c().log[k])}</li>`).join(''));
}
function tickThink() {
  const el = document.getElementById('think');
  if (!S?.think || !el) return;
  const t = c().think;
  const secs = Math.max(0, Math.floor((performance.now() - S.think.t0) / 1000));
  set($('.lbl', el), 'think-lbl', S.think.done ? esc(t.worked(5)) : `<span class="shim">${t.thinking}</span> <span class="secs">${secs}s</span>`);
}
setInterval(tickThink, 250);

function cardShell() {
  const d = tag('article', 'card');
  d.innerHTML = `<div class="card-h"><h2></h2><span class="st"></span></div><div class="rows"></div>
    <div class="checks"><div><ul></ul></div></div>
    <div class="foot"><div class="fs"><span class="ic"></span><span class="tx"></span></div><span class="fb"></span></div>
    <div class="pop" id="pop" role="tooltip"></div>`;
  return d;
}
function renderCard() {
  const C = S.card, t = c();
  const card = slot('card', cardShell);
  set($('h2', card), 'h2', `Refresh sessions in the auth middleware${C.pr ? `<span class="num${lively() ? ' appear' : ''}"> #128</span>` : ''}`);
  set($('.st', card), 'st', C.state ? `<span class="pill-state ${C.state}">${C.state === 'open' ? t.open : t.mergedState}</span>` : '');
  renderRows($('.rows', card));
  set($('.checks ul', card), 'checks', CHECKS.map(({ id, tip, time }, i) => {
    const [label, value] = t.checks[id];
    return `<li class="chk" tabindex="0" style="--i:${i}">${I.check}${label} <em>${value}</em><span class="tip" role="tooltip">${esc(tip)}<em>${time}</em></span></li>`;
  }).join(''));
  $('.checks', card).classList.toggle('on', C.checks);
  set($('#pop'), 'pop', `<header>${t.pop.header}</header>${CONFLICTS.map(x => `<section><h3>${x.file}<span>${t.pop.line(x.line)}</span></h3><div class="cl lena"><span>${t.pop.lena}</span><code>${esc(x.lena)}</code></div><div class="cl"><span>${t.pop.you}</span><code>${esc(x.you)}</code></div></section>`).join('')}`);

  const f = C.foot;
  const icon = { spin: '<span class="spin"></span>', warn: I.warn, ok: I.check, merged: I.merge }[f.icon];
  set($('.fs .ic', card), 'f-ic', icon);
  $('.fs .ic', card).className = `ic ${f.icon}`;
  let tx;
  if (f.step) { const [key, ...args] = f.step; const s = t.steps[key]; tx = `<span class="shim">${esc(typeof s === 'function' ? s(...args) : s)}</span>`; }
  else if (f.final === 'conflicts') tx = t.foot.conflicts(`<button type="button" class="conf-link" id="conf" aria-describedby="pop">${t.foot.conflictLink}</button>`);
  else tx = esc(t.foot[f.final]);
  const before = cache.get('f-tx');
  set($('.fs .tx', card), 'f-tx', tx);
  if (before !== undefined && shape(before) !== shape(tx) && lively()) restart($('.fs', card), 'blurin');
  const b = f.btn;
  set($('.fb', card), 'f-btn', !b ? '' : b.busy ? `<span class="btn busy"><span class="spin"></span>${t.buttons[b.label]}</span>`
    : `<button type="button" class="btn ${b.plain ? 'plain' : 'soft'}" data-act="${b.act}">${b.icon || ''}${t.buttons[b.label]}</button>`);
  if (f.final !== 'conflicts') $('#pop').classList.remove('show');
}

function nodeColor(id, r) {
  if (r.nodeTone === 'amber') return 'var(--amber)';
  if (LANE[id] === 1) return S.merged ? 'var(--purple)' : 'var(--blue)';
  if (LANE[id] === 2) return 'var(--teal)';
  return 'var(--main)';
}
function nodeHTML(id, r, ping) {
  const st = `left:${LX[LANE[id]]}px;--c:${nodeColor(id, r)}`;
  const p = ping ? ' ping' : '';
  switch (r.node) {
    case 'spinner': return `<span class="node spinner" style="${st}"><span class="spin"></span></span>`;
    case 'warn': return `<span class="node big${p}" style="${st};--c:var(--amber)">!</span>`;
    case 'warn-pulse': return `<span class="node big pulse" style="${st};--c:var(--amber)">!</span>`;
    case 'ok': return `<span class="node big${p}" style="${st};--c:var(--green)">${I.check}</span>`;
    case 'merged': return `<span class="node merged${p}" style="${st};--c:var(--purple)"></span>`;
    case 'ring': return `<span class="node ring" style="${st}"></span>`;
    case 'ring-busy': return `<span class="node ring busy" style="${st}"></span>`;
    case 'dash': return `<span class="node dash" style="${st}"></span>`;
    default: return `<span class="node dot" style="${st}"></span>`;
  }
}
function graphSVG(ids, i) {
  const { lines, lights } = graphPaths(ids, i, { merged: S.merged, conn: S.card.conn, flows: S.card.flow });
  const paths = lines.map(l => `<path d="${l.d}" style="stroke:${l.stroke};opacity:${l.opacity}"${l.dash ? ' stroke-dasharray="2.5 3"' : ''}/>`)
    .concat(still() ? [] : lights.map(l => `<path class="flow${l.rev ? ' rev' : ''}" d="${l.d}" style="--fc:color-mix(in srgb,${l.color} 45%,#fff)"/>`));
  return `<svg viewBox="0 0 52 32" aria-hidden="true">${paths.join('')}</svg>`;
}

function renderRows(box) {
  const t = c(), R = S.card.rows;
  const ids = ORDER.filter(k => R[k]);
  ids.forEach((id, i) => {
    const r = R[id];
    let el = rowEls.get(id);
    const isNew = !el;
    if (!el) {
      el = tag('div', `row${box.dataset.ready && !ff ? ' enter' : ''}`);
      el.innerHTML = '<div class="g"></div><div class="tt"></div><div class="mt"></div>';
      const next = ids.slice(i + 1).map(k => rowEls.get(k)).find(Boolean);
      box.insertBefore(el, next || null);
      rowEls.set(id, el);
      void el.offsetHeight;
      el.classList.remove('enter');
    }
    el.classList.toggle('flash', !!r.flash && lively());
    if (r.sweep != null && !el.classList.contains('sweep') && lively()) { el.style.setProperty('--d', `${r.sweep}ms`); el.classList.add('sweep'); }
    const title = r.titleKey ? t.rows[r.titleKey] : r.title;
    const tagKind = r.tag && (S.merged && r.tag[1] === 'blue' ? 'purple' : r.tag[1]);
    // A node that turns into a milestone state sends out one ring.
    if (el._node && el._node !== r.node && ['warn', 'ok', 'merged'].includes(r.node) && lively()) el._ping = r.node;
    el._node = r.node;
    set(el.children[0], `${id}:g`, graphSVG(ids, i) + nodeHTML(id, r, el._ping === r.node));
    set(el.children[1], `${id}:t`,
      `<span class="ttl tone-${r.tone}${r.busy ? ' shim' : ''}">${esc(title)}</span>`
      + (r.tag ? `<span class="tag ${tagKind}">${r.tag[0]}</span>` : '')
      + (r.badge === 'ok' ? `<span class="badge ok">${I.check}</span>` : r.badge ? `<span class="badge">${r.badge}</span>` : ''));
    // New rows and renamed rows decode their title; a language switch does not count as a rename.
    const renamed = el._title !== undefined && el._title !== (r.titleKey || r.title);
    if ((renamed || (isNew && box.dataset.ready))) scramble($('.ttl', el.children[1]), title);
    el._title = r.titleKey || r.title;
    const meta = r.right
      ? `<span class="st-${r.right.tone}">${esc(t.status[r.right.k](r.right.n))}</span>`
      : r.hash ? `<span class="hash">${r.hash}</span><span class="who">${r.who === 'you' ? t.you : r.who} · ${r.when === 'now' ? t.now : r.when}</span>` : '';
    const before = cache.get(`${id}:m`);
    set(el.children[2], `${id}:m`, meta);
    if (before !== undefined && shape(before) !== shape(meta) && lively()) restart(el.children[2], 'blurin');
    let pg = $('.prog', el);
    if (r.prog != null) {
      if (!pg) { pg = tag('div', 'prog'); pg.innerHTML = '<i></i>'; el.appendChild(pg); }
      pg.style.setProperty('--p', r.prog);
    } else if (pg) pg.remove();
  });
  box.dataset.ready = '1';
}

function renderChips() {
  const t = c().chips;
  const { add, del } = diffTotals();
  const chip = {
    create: `<button type="button" class="chip" data-act="start">${t.create}</button>`,
    creating: `<span class="chip"><span class="spin"></span><span class="shim">${t.creating}</span></span>`,
    conflicts: `<span class="chip"><span class="dot" style="color:var(--amber)"></span>#128 <span class="amber">${t.conflicts}</span></span>`,
    resolving: `<span class="chip"><span class="spin"></span>#128 <span class="shim">${t.resolving}</span></span>`,
    ready: `<span class="chip"><span class="dot" style="color:var(--green)"></span>#128 <span class="green">${t.ready}</span></span>`,
    merging: `<span class="chip"><span class="spin"></span>#128 <span class="shim">${t.merging}</span></span>`,
    merged: `<span class="chip"><span class="purple" style="display:inline-flex">${I.merge}</span>#128 <span class="purple">${t.merged}</span></span>`,
  }[S.chip];
  const diff = S.diff ? `<button type="button" class="chip diff" id="diffbtn" aria-expanded="false" aria-label="${c().diff}: +${add} −${del}"><span class="a">+${add}</span><span class="d">−${del}</span><span class="bars" aria-hidden="true"><i></i><i></i><i></i><i class="r"></i><i class="n"></i></span>${I.down}</button>` : '';
  set($('#chips'), 'chips', chip + diff);
}

/* ---------- events ---------- */
function closeFiles() { $('.files')?.remove(); $('#diffbtn')?.setAttribute('aria-expanded', 'false'); }
document.addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  if (act) {
    if (act.dataset.act === 'start') { const v = $('#prompt').value.trim(); $('#prompt').value = ''; press('start', v || null); }
    else press(act.dataset.act);
  }
  const jump = e.target.closest('[data-jump]');
  if (jump) start(jump.dataset.jump);
  const diff = e.target.closest('#diffbtn');
  if (diff && !$('.files')) {
    const box = tag('div', 'files');
    box.innerHTML = FILES.map(([file, a, r]) => `<div><code>${file}</code><span class="n"><span style="color:var(--add)">+${a}</span> <span style="color:var(--del)">−${r}</span></span></div>`).join('');
    $('#chips').appendChild(box); diff.setAttribute('aria-expanded', 'true');
  } else if (!e.target.closest('.files')) closeFiles();
  if (e.target.closest('#conf')) $('#pop')?.classList.toggle('show');
  else if (!e.target.closest('#pop')) $('#pop')?.classList.remove('show');
});
const hoverPop = on => e => { if (e.target.closest?.('#conf')) $('#pop')?.classList.toggle('show', on); };
document.addEventListener('mouseover', hoverPop(true));
document.addEventListener('mouseout', hoverPop(false));
document.addEventListener('focusin', hoverPop(true));
document.addEventListener('focusout', hoverPop(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('#pop')?.classList.remove('show'); closeFiles(); } });

$('#composer').addEventListener('submit', e => {
  e.preventDefault();
  if (!gates.start) return;
  const v = $('#prompt').value.trim();
  $('#prompt').value = '';
  press('start', v || null);
});
$('#prompt').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('#composer').requestSubmit(); } });
$('#replay').addEventListener('click', () => start('idle'));
$('#auto').addEventListener('click', e => {
  auto = !auto;
  e.currentTarget.setAttribute('aria-pressed', String(auto));
  announce(c().announce.autoplay(auto));
  if (auto && S.mark === 'merged') start('idle'); else scheduleAuto();
});

function setTheme(theme, say = true) {
  root.dataset.theme = theme;
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === theme)));
  if (say) announce(c().announce.theme(theme === 'dark'));
}
document.querySelectorAll('[data-theme-choice]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeChoice)));

function applyLanguage() {
  const t = c();
  root.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t.title} · ${language === 'zh' ? 'Su UI 实验室' : 'Su UI lab'}`;
  for (const el of document.querySelectorAll('[data-copy]')) el.textContent = t[el.dataset.copy];
  for (const el of document.querySelectorAll('[data-copy-composer]')) el.textContent = t.composer[el.dataset.copyComposer];
  for (const el of document.querySelectorAll('[data-aria]')) el.setAttribute('aria-label', t.composer[el.dataset.aria]);
  for (const el of document.querySelectorAll('[data-jump]')) el.textContent = t.jumps[el.dataset.jump];
  t.notes.forEach(([title, body], i) => { $(`#note-title-${i}`).textContent = title; $(`#note-body-${i}`).textContent = body; });
  $('#prompt').placeholder = t.composer.placeholder;
  $('#stage').setAttribute('aria-label', t.stage);
  $('#jump-group').setAttribute('aria-label', t.jump);
  $('#theme-group').setAttribute('aria-label', t.theme);
  const lang = $('#language');
  lang.textContent = language === 'zh' ? 'EN' : '中';
  lang.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  // Same state, new words: re-render in place without replaying entrances.
  if (S) {
    quiet = true; root.classList.add('ff');
    render();
    quiet = false; settle();
  }
}
$('#language').addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; saveLocale(language); applyLanguage(); });
followLocale(next => { if (next !== language) { language = next; applyLanguage(); } });

setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
applyLanguage();
const initial = preview ? 'conflicts' : params.get('state');
start(['conflicts', 'resolving', 'ready', 'merged'].includes(initial) ? initial : 'idle');
