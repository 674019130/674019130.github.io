import { copy } from './content.js';
import { matchTokens, nearestLevel } from './model.js';
const $ = s => document.querySelector(s);
const card = $('.answer'), body = $('.answer-content'), handle = $('#handle'), wrap = $('.answer-wrap');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
let language = params.get('lang') === 'zh' ? 'zh' : 'en';
let level = 3, heights = [], drag = null, heightAnimation = null, width = 0;
const animations = new Set();
const reduce = () => motion.matches || params.get('still') === '1';
const c = () => copy[language];
const duration = 420;
const slow = ['localhost', '127.0.0.1'].includes(location.hostname) ? Math.max(1, Math.min(20, Number(params.get('motion')) || 1)) : 1;
const easing = 'cubic-bezier(.22,1,.36,1)';
function animate(element, frames, options = {}) {
  const animation = element.animate(frames, { duration, easing, ...options });
  animation.playbackRate = 1 / slow;
  animations.add(animation);
  animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  return animation;
}
function build(index) {
  const content = document.createElement('div'); content.className = 'answer-content';
  function words(el, value) {
    const accessible = document.createElement('span'); accessible.className = 'sr-only'; accessible.textContent = value; el.append(accessible);
    const tokens = language === 'zh' ? Array.from(value) : value.match(/\S+|\s+/g);
    for (const token of tokens) {
      if (/^\s+$/.test(token)) { el.append(document.createTextNode(token)); continue; }
      const span = document.createElement('span'); span.className = 'word'; span.setAttribute('aria-hidden', 'true'); span.textContent = token; el.append(span);
    }
  }
  for (const [tag, value] of c().answers[index]) {
    const block = document.createElement(tag === 'h' ? 'h3' : tag);
    if (tag === 'ul') for (const line of value) { const li = document.createElement('li'); words(li, line); block.append(li); }
    else words(block, value);
    content.append(block);
  }
  return content;
}
function measure() {
  heights = c().answers.map((_, i) => {
    const probe = build(i);
    Object.assign(probe.style, { position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: `${card.clientWidth}px`, top: '0' });
    card.append(probe); const height = probe.getBoundingClientRect().height; probe.remove(); return height;
  });
}
function settle(from) {
  const to = heights[level];
  heightAnimation?.cancel(); card.style.height = `${to}px`;
  if (!reduce() && Math.abs(from-to) > .5) {
    heightAnimation = animate(card, [{height: `${from}px`}, {height: `${to}px`}]);
  }
}
function sync() {
  handle.setAttribute('aria-valuenow', String(level));
  handle.setAttribute('aria-valuetext', c().levels[level]);
  $('.level').textContent = c().levels[level];
  $('#shorter').disabled = level === 0; $('#longer').disabled = level === 3;
  const tokenCount = body.querySelectorAll('.word').length;
  const seconds = Math.max(1, Math.ceil(tokenCount / (language === 'zh' ? 7 : 3.5)));
  $('.read-time').textContent = `${seconds} ${c().time}`;
  $('.status').textContent = `${c().copied}: ${c().levels[level]}`;
}
function change(next, instant = false) {
  next = Math.max(0, Math.min(3, next));
  const fromHeight = card.getBoundingClientRect().height;
  const old = [...body.querySelectorAll('.word')].map(el => ({
    text: el.textContent, rect: el.getBoundingClientRect(), opacity: getComputedStyle(el).opacity,
    font: getComputedStyle(el).font, color: getComputedStyle(el).color
  }));
  // Read the current visible pose first; cancelling before reading would jump back to the previous layout.
  for (const a of animations) a.cancel(); animations.clear();
  $('.ghosts').replaceChildren();
  level = next;
  const fresh = build(level); body.replaceChildren(...fresh.childNodes);
  const newer = [...body.querySelectorAll('.word')];
  if (!instant && !reduce()) {
    const pairs = matchTokens(old.map(o => o.text), newer.map(el => el.textContent));
    const matchedOld = new Set(pairs.map(p => p[0]));
    const matchedNew = new Map(pairs.map(([a,b]) => [b,a]));
    const bounds = card.getBoundingClientRect();
    for (let i=0; i<newer.length; i++) {
      const el = newer[i], rect = el.getBoundingClientRect();
      if (matchedNew.has(i)) {
        const previous = old[matchedNew.get(i)];
        animate(el, [{ transform: `translate(${previous.rect.left-rect.left}px, ${previous.rect.top-rect.top}px)`, opacity: previous.opacity }, { transform: 'translate(0,0)', opacity: 1 }]);
      } else animate(el, [{opacity: 0, filter: 'blur(3px)', transform: 'translateY(5px)'}, {opacity: 1, filter: 'blur(0)', transform: 'translateY(0)'}], {duration: 300});
    }
    old.forEach((previous, i) => {
      if (matchedOld.has(i)) return;
      const ghost = document.createElement('span'); ghost.className = 'ghost'; ghost.textContent = previous.text;
      Object.assign(ghost.style, { left: `${previous.rect.left-bounds.left}px`, top: `${previous.rect.top-bounds.top}px`, font: previous.font, color: previous.color });
      $('.ghosts').append(ghost);
      const a = animate(ghost, [{opacity: previous.opacity, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(3px)', transform: 'translateY(-3px)'}], {duration: 180});
      a.finished.then(() => ghost.remove()).catch(() => ghost.remove());
    });
  }
  if (!drag) {
    if (instant) card.style.height = `${heights[level]}px`;
    else settle(fromHeight);
  } else card.style.height = `${drag.height}px`;
  sync();
}
function finish(cancel = false) {
  if (!drag) return;
  const initial = drag.level, pointer = drag.pointer;
  const from = card.getBoundingClientRect().height;
  drag = null; wrap.classList.remove('dragging');
  if (handle.hasPointerCapture(pointer)) handle.releasePointerCapture(pointer);
  if (cancel) change(initial); else settle(from);
  sync();
}
handle.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || drag) return;
  event.preventDefault(); handle.focus({preventScroll:true});
  const height = card.getBoundingClientRect().height;
  heightAnimation?.cancel(); card.style.height = `${height}px`;
  drag = {pointer:event.pointerId, y:event.clientY, start:height, height, level};
  wrap.classList.add('dragging'); handle.setPointerCapture(event.pointerId);
});
handle.addEventListener('pointermove', event => {
  if (!drag || drag.pointer !== event.pointerId) return;
  const height = Math.max(heights[0], Math.min(heights[3] + 24, drag.start + event.clientY-drag.y));
  drag.height = height; card.style.height = `${height}px`;
  const next = nearestLevel(height, heights);
  if (next !== level) change(next);
});
handle.addEventListener('pointerup', () => finish());
handle.addEventListener('pointercancel', () => finish(true));
handle.addEventListener('lostpointercapture', () => finish(true));
handle.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); finish(true); return; }
  const next = {ArrowUp: level-1, ArrowDown: level+1, ArrowLeft: level-1, ArrowRight: level+1, Home:0, End:3}[event.key];
  if (next === undefined) return;
  event.preventDefault(); finish(); change(next);
});
$('#shorter').addEventListener('click', () => { finish(); change(level-1); });
$('#longer').addEventListener('click', () => { finish(); change(level+1); });
$('#reset').addEventListener('click', () => { finish(); change(3); });
function localize() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = `${c().title} · Su UI lab`;
  document.querySelector('meta[name="description"]').content = c().intro;
  for (const el of document.querySelectorAll('[data-copy]')) el.textContent = c()[el.dataset.copy];
  for (let i=0; i<3; i++) { $(`#note-title-${i}`).textContent = c().notes[i][0]; $(`#note-body-${i}`).textContent = c().notes[i][1]; }
  $('#language').textContent = language === 'zh' ? 'EN' : '中';
  $('#language').setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  handle.setAttribute('aria-label', c().handle);
  $('.stage').setAttribute('aria-label', c().title);
  measure(); change(level, true);
}
$('#language').addEventListener('click', () => {
  finish(); language = language === 'zh' ? 'en' : 'zh';
  const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url);
  localize();
});
motion.addEventListener('change', () => { finish(); change(level, true); });
new ResizeObserver(entries => {
  const next = entries[0].contentRect.width;
  if (Math.abs(next-width)<.5) return;
  width = next; finish(); measure(); change(level, true);
}).observe($('.conversation'));
localize();
