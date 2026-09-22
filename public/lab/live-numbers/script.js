// @ts-check
import { assets, quoteSnapshot, priceText } from './model.js';
const $ = (/** @type {string} */ s) => /** @type {HTMLElement} */ (document.querySelector(s));
const params = new URLSearchParams(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const animateBox = /** @type {HTMLInputElement} */ ($('#animate'));
const tabularBox = /** @type {HTMLInputElement} */ ($('#tabular'));
let range = 'live', tick = 0, paused = false;
/** @type {ReturnType<typeof setInterval>|undefined} */
let timer;
/** @type {Map<HTMLElement, () => void>} */
const active = new Map();
const cells = assets.map(asset => {
  const row = document.createElement('tr');
  const name = document.createElement('td'); name.textContent = asset.name;
  const symbol = document.createElement('td'); symbol.textContent = asset.symbol;
  const price = document.createElement('td'); const change = document.createElement('td');
  const value = document.createElement('span'); value.className = 'number';
  const delta = document.createElement('span'); delta.className = 'number change';
  price.append(value); change.append(delta); row.append(name, symbol, price, change); $('#quotes').append(row);
  return { value, delta };
});
function canAnimate() { return animateBox.checked && !reduced.matches && params.get('still') !== '1'; }
/** @param {HTMLElement} cell @param {string} value @param {boolean} motion */
function setNumber(cell, value, motion) {
  active.get(cell)?.();
  const previous = cell.getAttribute('aria-label') || '';
  if (previous === value) return;
  cell.setAttribute('aria-label', value);
  cell.replaceChildren();
  const direction = Number(value.replace(/[^\d.-]/g, '')) >= Number(previous.replace(/[^\d.-]/g, '')) ? 1 : -1;
  /** @type {Animation[]} */
  const animations = [];
  /** @type {HTMLElement[]} */
  const oldNodes = [];
  [...value].forEach((char, index) => {
    const slot = document.createElement('span'); slot.className = 'digit'; slot.setAttribute('aria-hidden', 'true');
    const next = document.createElement('span'); next.textContent = char; slot.append(next);
    const oldChar = previous[previous.length - value.length + index];
    if (motion && oldChar && oldChar !== char && /\d/.test(char) && /\d/.test(oldChar)) {
      const old = document.createElement('span'); old.className = 'old'; old.textContent = oldChar; slot.append(old); oldNodes.push(old);
      const timing = { duration: 380, easing: 'cubic-bezier(.22,.68,0,1)' };
      animations.push(next.animate([{ transform: `translateY(${direction * 100}%)`, opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], timing));
      animations.push(old.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${-direction * 100}%)`, opacity: 0 }], timing));
    }
    cell.append(slot);
  });
  if (animations.length) {
    const finish = () => { animations.forEach(a => a.cancel()); oldNodes.forEach(n => n.remove()); if (active.get(cell) === finish) active.delete(cell); };
    active.set(cell, finish);
    Promise.all(animations.map(a => a.finished.catch(() => {}))).then(finish);
  }
}
function render(motion = false) {
  quoteSnapshot(range, tick).forEach((quote, i) => {
    setNumber(cells[i].value, priceText(quote.price), motion && canAnimate());
    setNumber(cells[i].delta, `${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)}%`, motion && canAnimate());
    cells[i].delta.dataset.negative = String(quote.change < 0);
  });
}
function schedule() {
  clearInterval(timer); timer = undefined;
  if (!paused && range === 'live' && !document.hidden) timer = setInterval(() => { tick++; render(true); }, 600);
  document.documentElement.dataset.paused = String(paused || range !== 'live');
  $('#feed-label').textContent = range !== 'live' ? 'Simulated snapshot' : paused ? 'Feed paused' : 'Simulated live feed';
}
document.querySelectorAll('button[data-range]').forEach(button => button.addEventListener('click', () => {
  const next = /** @type {HTMLElement} */ (button).dataset.range || 'live';
  if (next === range) return;
  range = next;
  document.querySelectorAll('button[data-range]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  render(true); schedule();
  $('#announcement').textContent = `${button.textContent} selected.`;
}));
tabularBox.addEventListener('change', () => {
  document.documentElement.dataset.tabular = String(tabularBox.checked);
  $('#explanation').textContent = tabularBox.checked ? 'Equal-width digits keep the columns steady.' : 'Proportional digits: watch the spacing change as values update.';
});
animateBox.addEventListener('change', () => { if (!canAnimate()) active.forEach(f => f()); });
$('#pause').addEventListener('click', () => {
  paused = !paused; $('#pause').textContent = paused ? 'Resume' : 'Pause'; $('#pause').setAttribute('aria-pressed', String(paused)); schedule();
});
reduced.addEventListener('change', () => { if (!canAnimate()) active.forEach(f => f()); });
document.addEventListener('visibilitychange', () => { if (document.hidden) active.forEach(f => f()); schedule(); });
window.addEventListener('pagehide', () => { clearInterval(timer); active.forEach(f => f()); });
window.addEventListener('pageshow', schedule);
render(); schedule();
