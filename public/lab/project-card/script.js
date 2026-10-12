import { readLocale, saveLocale, followLocale } from '../shared/locale.js';
import { copy } from './content.js';
import { people, statuses, initialTasks, summary, footerLine, lineKey, escapeTarget } from './model.js';

const $ = selector => document.querySelector(selector);
const card = $('#card'), disclosure = $('#disclosure'), pill = $('#status'), pickerWrap = $('#picker-wrap'), picker = $('#picker');
const details = $('#details'), footerWrap = $('#footer-wrap'), list = $('.tasks'), crowd = $('.people');
const params = new URLSearchParams(location.search);
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const preview = params.get('preview') === '1';
const still = () => motion.matches || params.get('still') === '1';
if (params.get('still') === '1') document.documentElement.dataset.still = 'true';
// Local visual QA can slow the same motion with ?motion=8; production ignores it.
const slow = ['localhost', '127.0.0.1'].includes(location.hostname) ? Math.max(1, Math.min(20, Number(params.get('motion')) || 1)) : 1;
if (slow > 1) document.documentElement.style.setProperty('--open-ms', `${380 * slow}ms`);
const easing = 'cubic-bezier(.22,1,.36,1)';

let language = readLocale();
saveLocale(language);
const c = () => copy[language];
let tasks = initialTasks(), status = 'progress';
let hovered = false, pinned = preview, pickerOpen = false, keyboardInside = false;
let activeTask = null, hoverPerson = null, lockedPerson = null, touchTimer = 0;
let shownDone = -1, shownLine = '', shownStatus = '';
let widthAnimation = null;

const svg = (body, cls = '') => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${body}</svg>`;
const icons = {
  todo: '<circle cx="12" cy="12" r="8" stroke-dasharray="3.1 3.2"/>',
  progress: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none"/>',
  review: '<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.6"/>',
  done: '<circle cx="12" cy="12" r="8.5"/><path d="m8.4 12.3 2.5 2.4 4.7-5"/>',
};

// Five track and five fill circles; each owns a fifth of pathLength="100".
for (const layer of ['.ring-track', '.ring-fill']) {
  $(layer).innerHTML = Array.from({ length: 5 }, (_, i) => `<circle cx="12" cy="12" r="9" pathLength="100" stroke-dashoffset="${-(i * 20 + 3)}"/>`).join('');
}
const segments = [...document.querySelectorAll('.ring-fill circle')];

crowd.innerHTML = people.map(p => `<button type="button" class="avatar" data-person="${p.id}" aria-pressed="false">${p.initial}</button>`).join('');
const avatars = [...crowd.children];
picker.innerHTML = statuses.map(s => `<button type="button" class="option" data-status="${s}" aria-pressed="false">${svg(icons[s])}<span></span></button>`).join('');
const options = [...picker.children];
list.innerHTML = tasks.map((task, i) => {
  const owner = people.find(p => p.id === task.owner);
  return `<li class="task" data-task="${task.id}" style="--i:${i}"><label><input type="checkbox"><span class="check" aria-hidden="true">${svg('<path class="tick" pathLength="1" d="m7.6 12.4 3 2.9 5.8-6.2"/>')}</span><span class="task-name"></span><span class="sr-only"></span><span class="mini" data-person="${owner.id}" aria-hidden="true">${owner.initial}</span></label></li>`;
}).join('');
const rows = [...list.children];
const rowOf = id => rows.find(row => row.dataset.task === id);

// Two layers in one clipped grid cell: the old face leaves from where it is.
function swap(windowEl, face, { direction = 1, immediate = false } = {}) {
  windowEl.querySelectorAll('.swap-leave').forEach(el => el.remove());
  const previous = windowEl.querySelector('.swap-face');
  face.classList.add('swap-face');
  if (previous && !immediate && !still()) {
    const seen = getComputedStyle(previous);
    const from = { transform: seen.transform === 'none' ? 'translateY(0)' : seen.transform, opacity: seen.opacity, filter: seen.filter === 'none' ? 'blur(0px)' : seen.filter };
    previous.getAnimations().forEach(a => a.cancel());
    previous.classList.replace('swap-face', 'swap-leave');
    previous.setAttribute('aria-hidden', 'true');
    previous.animate([from, { transform: `translateY(${-70 * direction}%)`, opacity: 0, filter: 'blur(2px)' }], { duration: 200 * slow, easing, fill: 'forwards' })
      .finished.then(() => previous.remove(), () => {});
    windowEl.append(face);
    face.animate([{ transform: `translateY(${70 * direction}%)`, opacity: 0, filter: 'blur(2px)' }, { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' }], { duration: 280 * slow, easing, fill: 'backwards' });
  } else {
    previous?.remove();
    windowEl.append(face);
  }
}
function span(text, cls) { const el = document.createElement('span'); if (cls) el.className = cls; el.textContent = text; return el; }

function renderRing(immediate) {
  const { done } = summary(tasks);
  segments.forEach((seg, i) => seg.toggleAttribute('data-on', i < done));
  if (done !== shownDone) swap($('.ring-count'), span(String(done)), { direction: done > shownDone ? 1 : -1, immediate: immediate || shownDone < 0 });
  shownDone = done;
}
function renderPill(immediate) {
  if (status === shownStatus && !immediate) return;
  const from = pill.getBoundingClientRect().width;
  pill.dataset.status = status;
  const face = span('');
  face.innerHTML = svg(icons[status]);
  face.append(span(c().statuses[status]));
  swap($('.pill-window'), face, { direction: statuses.indexOf(status) >= statuses.indexOf(shownStatus) ? 1 : -1, immediate: immediate || !shownStatus });
  shownStatus = status;
  // Animate the measured width so the due date slides instead of jumping.
  widthAnimation?.cancel();
  const to = pill.getBoundingClientRect().width;
  if (!immediate && !still() && from && Math.abs(from - to) > .5) widthAnimation = pill.animate([{ width: `${from}px` }, { width: `${to}px` }], { duration: 300 * slow, easing });
  pill.setAttribute('aria-label', `${c().statusLabel}: ${c().statuses[status]}`);
  options.forEach(option => option.setAttribute('aria-pressed', String(option.dataset.status === status)));
}
function renderFooter(immediate) {
  const person = hoverPerson || lockedPerson;
  const line = footerLine(tasks, { person, task: person ? null : activeTask });
  const key = lineKey(line) + language;
  if (key === shownLine && !immediate) return;
  const name = id => people.find(p => p.id === id)?.name;
  const f = c().footer;
  const parts = line.kind === 'person' ? f.person(name(line.person), line.done, line.total)
    : line.kind === 'left' ? f.left(line.left) : line.kind === 'all' ? f.all() : f[line.kind](name(line.person));
  const face = span('');
  // Person lines lead with the name; row lines end with it.
  if (parts[2]) face.append(Object.assign(document.createElement('strong'), { textContent: parts[0] }), parts[1]);
  else { face.append(parts[0]); if (parts[1]) face.append(Object.assign(document.createElement('strong'), { textContent: parts[1] })); }
  swap($('.foot-text'), face, { immediate: immediate || !shownLine });
  shownLine = key;
}
function renderFocus() {
  const person = hoverPerson || lockedPerson;
  avatars.forEach(a => {
    a.toggleAttribute('data-dim', !!person && a.dataset.person !== person);
    a.toggleAttribute('data-focus', a.dataset.person === person);
    a.setAttribute('aria-pressed', String(a.dataset.person === lockedPerson));
  });
  rows.forEach(row => {
    const task = tasks.find(t => t.id === row.dataset.task);
    row.toggleAttribute('data-dim', !!person && task.owner !== person);
    row.toggleAttribute('data-active', !person && row.dataset.task === activeTask);
  });
}
function renderTasks() {
  rows.forEach(row => {
    const task = tasks.find(t => t.id === row.dataset.task);
    row.toggleAttribute('data-done', task.done);
    row.querySelector('input').checked = task.done;
  });
}
function sync({ immediate = false } = {}) {
  const open = pinned || hovered || pickerOpen || keyboardInside;
  card.dataset.open = String(open);
  disclosure.setAttribute('aria-expanded', String(open));
  details.inert = !open; footerWrap.inert = !open;
  pickerWrap.dataset.open = String(pickerOpen);
  pickerWrap.inert = !pickerOpen;
  pill.setAttribute('aria-expanded', String(pickerOpen));
  $('#pin').setAttribute('aria-pressed', String(pinned));
  renderTasks(); renderRing(immediate); renderPill(immediate); renderFocus(); renderFooter(immediate);
}
function announce(text) { $('#announce').textContent = text; }

function applyLanguage() {
  const t = c();
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${t.title} · ${language === 'zh' ? 'Su UI 实验室' : 'Su UI lab'}`;
  for (const el of document.querySelectorAll('[data-copy]')) el.textContent = t[el.dataset.copy];
  t.notes.forEach(([title, body], i) => { $(`#note-title-${i}`).textContent = title; $(`#note-body-${i}`).textContent = body; });
  const toggle = $('#language');
  toggle.textContent = language === 'zh' ? 'EN' : '中';
  toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  crowd.setAttribute('aria-label', t.people);
  picker.setAttribute('aria-label', t.statusGroup);
  $('.stage').setAttribute('aria-label', language === 'zh' ? '项目卡片实验' : 'Project card experiment');
  $('#theme-group').setAttribute('aria-label', t.theme);
  avatars.forEach(a => a.setAttribute('aria-label', t.personLabel(people.find(p => p.id === a.dataset.person).name)));
  options.forEach(o => { o.querySelector('span').textContent = t.statuses[o.dataset.status]; });
  rows.forEach(row => {
    const task = tasks.find(item => item.id === row.dataset.task);
    row.querySelector('.task-name').textContent = t.tasks[task.id];
    row.querySelector('.sr-only').textContent = t.assignedSr(people.find(p => p.id === task.owner).name);
  });
  // Text changes in place; state (open, filter, checks, status) is untouched.
  sync({ immediate: true });
}

function setTheme(theme, say = true) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === theme)));
  if (say) announce(c().announce.theme(theme === 'dark'));
}
function setPicker(open, focus = false) {
  pickerOpen = open; sync();
  if (open && focus) options.find(o => o.dataset.status === status)?.focus({ preventScroll: true });
}
function setLocked(person) {
  lockedPerson = person; hoverPerson = null; sync();
  announce(c().announce.filter(person && people.find(p => p.id === person).name));
}

card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovered = true; sync(); } });
card.addEventListener('pointerleave', e => {
  if (e.pointerType !== 'mouse') return;
  hovered = false; hoverPerson = null; activeTask = null; sync();
});
card.addEventListener('focusin', e => { keyboardInside = e.target.matches(':focus-visible'); sync(); });
card.addEventListener('focusout', e => {
  if (card.contains(e.relatedTarget)) return;
  keyboardInside = false; activeTask = null; hoverPerson = null;
  if (pickerOpen) pickerOpen = false;
  sync();
});
disclosure.addEventListener('click', () => { pinned = !pinned; sync(); announce(c().announce.pinned(pinned)); });
pill.addEventListener('click', e => setPicker(!pickerOpen, e.detail === 0));
picker.addEventListener('click', e => {
  const option = e.target.closest('.option');
  if (!option) return;
  status = option.dataset.status;
  // Move focus out before the picker turns inert, or focusout would collapse the card.
  pill.focus({ preventScroll: true });
  pickerOpen = false; sync();
  announce(c().announce.status(c().statuses[status]));
});
picker.addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const index = options.indexOf(document.activeElement);
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : (index + (/Right|Down/.test(e.key) ? 1 : -1) + options.length) % options.length;
  options[next].focus();
});
crowd.addEventListener('pointerover', e => {
  const avatar = e.target.closest('.avatar');
  if (e.pointerType !== 'mouse' || !avatar) return;
  hoverPerson = avatar.dataset.person; sync();
});
crowd.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && hoverPerson) { hoverPerson = null; sync(); } });
crowd.addEventListener('click', e => {
  const avatar = e.target.closest('.avatar');
  if (avatar) setLocked(lockedPerson === avatar.dataset.person ? null : avatar.dataset.person);
});
list.addEventListener('pointerover', e => {
  const row = e.target.closest('.task');
  if (e.pointerType !== 'mouse' || !row || activeTask === row.dataset.task) return;
  activeTask = row.dataset.task; sync();
});
list.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && activeTask) { activeTask = null; sync(); } });
list.addEventListener('focusin', e => {
  if (!e.target.matches(':focus-visible')) return;
  activeTask = e.target.closest('.task').dataset.task; sync();
});
list.addEventListener('pointerdown', e => {
  // Touch has no hover, so a tapped row stays highlighted for a moment.
  const row = e.target.closest('.task');
  if (e.pointerType === 'mouse' || !row) return;
  clearTimeout(touchTimer);
  activeTask = row.dataset.task;
  touchTimer = setTimeout(() => { activeTask = null; sync(); }, 1600);
});
list.addEventListener('change', e => {
  const id = e.target.closest('.task').dataset.task;
  tasks = tasks.map(task => task.id === id ? { ...task, done: e.target.checked } : task);
  sync();
  const { left } = summary(tasks);
  announce(c().announce.task(c().tasks[id], e.target.checked, left ? c().footer.left(left)[0] : c().footer.all()[0]));
});
$('#open').addEventListener('click', () => announce(c().announce.open));
document.addEventListener('pointerdown', e => {
  if (pickerOpen && !pickerWrap.contains(e.target) && !pill.contains(e.target)) { pickerOpen = false; sync(); }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const target = escapeTarget({ picker: pickerOpen, lockedPerson, pinned });
  if (target === 'picker') { pill.focus({ preventScroll: true }); setPicker(false); }
  else if (target === 'filter') setLocked(null);
  else if (target === 'pinned') { pinned = false; sync(); announce(c().announce.pinned(false)); }
});

$('#pin').addEventListener('click', () => { pinned = !pinned; sync(); announce(c().announce.pinned(pinned)); });
$('#reset').addEventListener('click', () => {
  tasks = initialTasks(); status = 'progress'; pinned = preview; pickerOpen = false; lockedPerson = null; hoverPerson = null; activeTask = null;
  sync(); announce(c().announce.reset);
});
document.querySelectorAll('[data-theme-choice]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeChoice)));
$('#language').addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; saveLocale(language); applyLanguage(); });
followLocale(next => { if (next !== language) { language = next; applyLanguage(); } });

setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', false);
applyLanguage();
