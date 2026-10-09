const $ = selector => document.querySelector(selector);
const shape = $('#shape');
const trigger = $('#trigger');
const sheet = $('#sheet');
const confirmation = $('#confirmation');
const faces = { closed: trigger, open: sheet, sent: confirmation };
const people = ['Emma', 'Marcus', 'Jasmine', 'Daniel', 'Chloe'];
const selected = new Set();
const timers = new Set();
const flights = new Set();
let fail = false;
let sending = false;
let generation = 0;
let transitionId = 0;
let shellAnimation;
let copyTimer;
let displayedCount = 0;
// Local visual QA can slow the exact same keyframes without changing production.
const motionScale = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? Math.min(24, Math.max(1, Number(options.get('motion')) || 1)) : 1;
const icons = {
  copy: '<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
  check: '<path class="check-stroke" d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  x: '<path d="m4 3 12 18h4L8 3ZM4 21 20 3"/>',
  spinner: '<path d="M20 12a8 8 0 1 1-8-8"/>',
  slack: '<g stroke="none"><path fill="#36c5f0" d="M8 2a2 2 0 1 1-2 2V2Zm0 5a2 2 0 1 1 0 4H2a2 2 0 0 1 0-4Z"/><path fill="#2eb67d" d="M22 8a2 2 0 1 1-2-2h2Zm-5 0a2 2 0 1 1-4 0V2a2 2 0 0 1 4 0Z"/><path fill="#ecb22e" d="M16 22a2 2 0 1 1 2-2v2Zm0-5a2 2 0 1 1 0-4h6a2 2 0 0 1 0 4Z"/><path fill="#e01e5a" d="M2 16a2 2 0 1 1 2 2H2Zm5 0a2 2 0 1 1 4 0v6a2 2 0 0 1-4 0Z"/></g>',
};
function icon(name) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', '0 0 24 24'); el.setAttribute('aria-hidden', 'true');
  el.innerHTML = icons[name]; if (name === 'spinner') el.classList.add('spinner'); return el;
}
document.querySelectorAll('[data-icon]').forEach(el => el.replaceChildren(icon(el.dataset.icon)));
$('#close').replaceChildren(icon('close'));
const announce = text => { $('#announcement').textContent = text; };
function later(callback, delay) {
  const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
  timers.add(timer); return timer;
}
function animate(el, frames, options = {}) {
  if (isStill()) return null;
  return el.animate(frames, { easing: 'cubic-bezier(.22,1,.36,1)', ...options, duration: (options.duration ?? 420) * motionScale, delay: (options.delay ?? 0) * motionScale });
}
function dimensions(value) {
  const width = value === 'closed' ? 112 : Math.min(value === 'open' ? 384 : 300, $('.stage').clientWidth);
  const face = faces[value];
  face.style.width = `${width - 2}px`;
  return { width, height: value === 'closed' ? 42 : face.scrollHeight + 2, radius: value === 'closed' ? 21 : 26 };
}
// A damped spring samples the shell geometry. Content has its own fixed-width
// layer so intermediate shell widths cannot reflow or squeeze the labels.
function morph(value, immediate = false) {
  const computed = getComputedStyle(shape);
  const from = { width: parseFloat(computed.width), height: parseFloat(computed.height), radius: parseFloat(computed.borderRadius) };
  const to = dimensions(value);
  if (shellAnimation) shellAnimation.cancel();
  Object.assign(shape.style, { width: `${to.width}px`, height: `${to.height}px`, borderRadius: `${to.radius}px` });
  if (immediate || isStill()) return;
  const frames = Array.from({ length: 61 }, (_, i) => {
    const t = i / 60;
    const progress = i === 60 ? 1 : 1 - Math.exp(-8.5 * t) * (Math.cos(9 * t) + .55 * Math.sin(9 * t));
    return { width: `${from.width + (to.width - from.width) * progress}px`, height: `${from.height + (to.height - from.height) * progress}px`, borderRadius: `${from.radius + (to.radius - from.radius) * progress}px`, offset: t };
  });
  shellAnimation = animate(shape, frames, { duration: 680, easing: 'linear' });
}
function state(value, focus = true, immediate = false) {
  const id = ++transitionId; const old = faces[shape.dataset.state]; const face = faces[value];
  Object.values(faces).forEach(el => { el.getAnimations().forEach(a => a.cancel()); el.inert = el !== face; if (el !== face && el !== old) el.hidden = true; });
  face.hidden = false; shape.dataset.state = value;
  trigger.setAttribute('aria-expanded', String(value !== 'closed'));
  morph(value, immediate);
  if (old !== face) {
    if (immediate || isStill()) old.hidden = true;
    else {
      const exit = animate(old, [{ opacity: 1, filter: 'blur(0px)', transform: 'translate(-50%,-50%) scale(1)' }, { opacity: 0, filter: 'blur(5px)', transform: 'translate(-50%,-50%) scale(.92)' }], { duration: 140, fill: 'forwards' });
      exit?.finished.then(() => { if (id === transitionId) old.hidden = true; exit.cancel(); }, () => {});
      animate(face, [{ opacity: 0, filter: 'blur(6px)', transform: 'translate(-50%,-46%) scale(.94)' }, { opacity: 1, filter: 'blur(0px)', transform: 'translate(-50%,-50%) scale(1)' }], { duration: 420, delay: value === 'closed' ? 120 : 100, fill: 'backwards' });
    }
  }
  if (focus) (value === 'closed' ? trigger : value === 'open' ? $('#copy') : $('#done')).focus({ preventScroll: true });
}
function avatar(index) {
  const image = document.createElement('img'); image.className = 'avatar'; image.src = `./avatars/${people[index].toLowerCase()}.jpg`;
  image.alt = ''; image.width = 40; image.height = 40; image.draggable = false; return image;
}
function copyContent(name, label, immediate = false) {
  const button = $('#copy');
  if (button.dataset.label === label) return;
  let window = button.querySelector('.copy-window');
  if (!window) { window = document.createElement('span'); window.className = 'copy-window'; button.replaceChildren(window); }
  button.dataset.label = label; button.setAttribute('aria-label', label);
  button.style.setProperty('--copy-duration', `${340 * motionScale}ms`);
  window.querySelectorAll('.copy-leave').forEach(el => el.remove());
  const previous = window.firstElementChild;
  const next = document.createElement('span'); next.className = 'button-content copy-face'; next.dataset.kind = name;
  next.setAttribute('aria-hidden', 'true'); next.append(icon(name), label);
  if (previous) {
    if (immediate || isStill()) previous.remove();
    else {
      // Continue from the visible position if a state change interrupts entry.
      const visible = getComputedStyle(previous);
      previous.style.setProperty('--copy-exit-from', visible.transform);
      previous.style.setProperty('--copy-exit-opacity', visible.opacity);
      previous.classList.remove('copy-enter'); previous.classList.add('copy-leave');
      previous.addEventListener('animationend', event => { if (event.target === previous) previous.remove(); });
    }
  }
  if (!immediate && !isStill()) next.classList.add('copy-enter');
  window.append(next);
}
function buttonContent(button, name, label, immediate = false) {
  if (button.id === 'copy') { copyContent(name, label, immediate); return; }
  const content = document.createElement('span'); content.className = 'button-content';
  if (name) content.append(icon(name)); const text = document.createElement('span'); text.textContent = label; content.append(text);
  button.replaceChildren(content);
  animate(content, [{ opacity: 0, transform: 'translateY(5px)', filter: 'blur(3px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }], { duration: 250 });
}
function sendLabel() {
  const label = $('#send-label');
  if (sending) { label.replaceChildren(icon('spinner'), 'Sending'); return; }
  if (!selected.size) { label.textContent = 'Send'; displayedCount = 0; return; }
  const count = document.createElement('span'); count.className = 'count';
  const next = document.createElement('span'); next.textContent = selected.size;
  count.append(next); label.replaceChildren('Send to ', count, selected.size === 1 ? ' person' : ' people');
  if (displayedCount !== selected.size) {
    const direction = selected.size > displayedCount ? 1 : -1;
    const previous = document.createElement('span'); previous.className = 'old-count'; previous.setAttribute('aria-hidden', 'true'); previous.textContent = displayedCount; count.append(previous);
    animate(previous, [{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${-direction * 110}%)`, opacity: 0 }], { duration: 300 })?.finished.then(() => previous.remove(), () => previous.remove());
    if (isStill()) previous.remove();
    animate(next, [{ transform: `translateY(${direction * 110}%)`, opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 300 });
  }
  displayedCount = selected.size;
}
function update() {
  const positions = new Map([...$('#selected').children].map(el => [el.dataset.person, el.getBoundingClientRect()]));
  const chips = new Map([...document.querySelectorAll('#selected .chip')].map(el => [Number(el.dataset.person), el]));
  $('#selected .placeholder')?.remove();
  chips.forEach((el, index) => { if (!selected.has(index)) el.remove(); });
  for (const index of selected) {
    let chip = chips.get(index);
    if (!chip) {
      chip = document.createElement('button'); chip.className = 'chip'; chip.dataset.person = index;
      chip.setAttribute('aria-label', `Remove ${people[index]}`); chip.append(avatar(index), people[index], icon('close'));
      chip.addEventListener('click', () => togglePerson(index, true)); $('#selected').append(chip);
      // Geometry is stable before fly() measures its landing rectangle.
      animate(chip, [{ opacity: 0 }, { opacity: 1 }]);
    }
    chip.disabled = sending;
    const from = positions.get(String(index)); const to = chip.getBoundingClientRect();
    if (from && from.left !== to.left) animate(chip, [{ transform: `translateX(${from.left - to.left}px)` }, { transform: 'translateX(0)' }]);
  }
  if (!selected.size) { const el = document.createElement('span'); el.className = 'placeholder'; el.textContent = 'Pick people below'; $('#selected').append(el); }
  document.querySelectorAll('[data-pick]').forEach(el => { el.setAttribute('aria-pressed', String(selected.has(Number(el.dataset.pick)))); el.disabled = sending; });
  $('#send').disabled = !selected.size || sending; $('#access').disabled = sending; sendLabel();
  if (shape.dataset.state === 'open') morph('open');
}
function fly(index, from, destination) {
  if (isStill() || !from.width || !destination) return;
  const to = destination.getBoundingClientRect(); const flight = avatar(index); flight.classList.add('flying-avatar');
  Object.assign(flight.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.append(flight); destination.style.visibility = 'hidden';
  const dx = to.left - from.left, dy = to.top - from.top, scale = to.width / from.width;
  const animation = animate(flight, [
    { transform: 'translate(0,0) scale(1)', offset: 0 },
    { transform: `translate(${dx * .6}px,${dy * .68 - 14}px) scale(${1 + (scale - 1) * .55})`, offset: .55 },
    { transform: `translate(${dx}px,${dy}px) scale(${scale})`, offset: 1 },
  ], { duration: 520, easing: 'cubic-bezier(.25,.85,.25,1)', fill: 'forwards' });
  // Keep the exact landing pose until the real image is visible in the same task.
  const cleanup = () => { destination.style.visibility = ''; flight.remove(); animation?.cancel(); flights.delete(cleanup); };
  flights.add(cleanup); animation?.finished.then(cleanup, cleanup);
}
function togglePerson(index, returnFocus = false) {
  if (sending) return;
  const adding = !selected.has(index); const button = $(`[data-pick="${index}"]`);
  const origin = adding ? button.querySelector('img') : $(`.chip[data-person="${index}"] img`);
  const from = origin.getBoundingClientRect();
  adding ? selected.add(index) : selected.delete(index);
  $('#error').hidden = true; update();
  fly(index, from, adding ? $(`.chip[data-person="${index}"] img`) : button.querySelector('img'));
  if (returnFocus) button.focus(); announce(`${people[index]} ${adding ? 'selected' : 'removed'}`);
}
people.forEach((name, index) => {
  const button = document.createElement('button'); button.className = 'person'; button.dataset.pick = index;
  button.setAttribute('aria-pressed', 'false'); button.setAttribute('aria-label', `Select ${name}`);
  const portrait = document.createElement('span'); portrait.className = 'portrait'; portrait.append(avatar(index));
  const badge = document.createElement('span'); badge.className = 'selected-badge'; badge.append(icon('check')); portrait.append(badge);
  button.append(portrait, name); button.addEventListener('click', () => togglePerson(index)); $('#people').append(button);
});
function resetTransient() {
  generation++; timers.forEach(clearTimeout); timers.clear(); flights.forEach(cleanup => cleanup()); sending = false;
  sheet.removeAttribute('aria-busy'); $('#error').hidden = true;
  document.querySelectorAll('[data-channel]').forEach(button => { button.disabled = false; button.classList.remove('is-success'); buttonContent(button, button.dataset.channel === 'Email' ? 'mail' : button.dataset.channel.toLowerCase(), button.dataset.channel); });
  $('#copy').classList.remove('is-success'); buttonContent($('#copy'), 'copy', 'Copy', true);
}
function close(focus = true, immediate = false) { resetTransient(); update(); state('closed', focus, immediate); }
trigger.addEventListener('click', () => state('open'));
$('#close').addEventListener('click', () => close());
$('#done').addEventListener('click', () => { close(); selected.clear(); update(); });
$('#undo').addEventListener('click', () => { resetTransient(); update(); state('open'); announce('Demo share undone. Recipients kept for editing.'); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !event.defaultPrevented && shape.dataset.state !== 'closed') { event.preventDefault(); close(); } });
document.addEventListener('pointerdown', event => { if (shape.dataset.state !== 'closed' && !shape.contains(event.target) && !event.target.closest('.demo-controls')) close(false); });
$('#access').addEventListener('change', () => { $('#access-description').textContent = `${$('#access').selectedIndex ? 'Only selected people' : 'Can view'} · demo setting`; });
$('#copy').addEventListener('click', async () => {
  const current = generation;
  try {
    await navigator.clipboard.writeText($('#link').value); if (current !== generation) return;
    clearTimeout(copyTimer); timers.delete(copyTimer); $('#copy').classList.add('is-success'); buttonContent($('#copy'), 'check', 'Copied'); announce('Link copied');
    copyTimer = later(() => { $('#copy').classList.remove('is-success'); buttonContent($('#copy'), 'copy', 'Copy'); }, 2400 * motionScale);
  } catch { if (current !== generation) return; $('#link').focus(); $('#link').select(); announce('Clipboard unavailable. Copy the selected link manually.'); buttonContent($('#copy'), 'copy', 'Retry'); }
});
for (const [id, outcome] of [['works', false], ['fails', true]]) $(`#${id}`).addEventListener('click', () => { fail = outcome; $('#works').setAttribute('aria-pressed', String(!fail)); $('#fails').setAttribute('aria-pressed', String(fail)); });
document.querySelectorAll('[data-channel]').forEach(button => button.addEventListener('click', () => {
  const outcome = fail; button.disabled = true; buttonContent(button, 'spinner', button.dataset.channel);
  later(() => { button.disabled = false; button.classList.toggle('is-success', !outcome); buttonContent(button, outcome ? 'close' : 'check', outcome ? 'Retry' : 'Done'); announce(`${button.dataset.channel}: ${outcome ? 'simulated failure, try again' : 'demo complete, nothing sent'}`); }, 800);
}));
$('#send').addEventListener('click', () => {
  if (!selected.size || sending) return;
  const outcome = fail; sending = true; $('#error').hidden = true; sheet.setAttribute('aria-busy', 'true'); update();
  later(() => {
    sending = false; sheet.removeAttribute('aria-busy');
    if (outcome) { $('#error').textContent = 'Demo delivery failed. Try again with “Send works”.'; $('#error').hidden = false; update(); $('#send').focus(); animate(shape, [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
    const recipients = [...selected]; $('#sent-avatars').replaceChildren(...recipients.map(avatar));
    const badge = document.createElement('span'); badge.className = 'sent-badge'; badge.append(icon('check')); $('#sent-avatars').append(badge);
    $('#sent-title').textContent = `Sent to ${recipients.slice(0, 2).map(index => people[index]).join(', ')}${recipients.length > 2 ? `, and ${recipients.length - 2} other${recipients.length > 3 ? 's' : ''}` : ''}`;
    $('#sent-detail').textContent = 'Demo complete · no message was sent';
    state('sent'); update(); announce('Demo complete. No message was sent.');
  }, 1000);
});
window.addEventListener('resize', () => morph(shape.dataset.state, true));
motionQuery.addEventListener('change', () => { document.documentElement.toggleAttribute('data-still', isStill()); if (isStill()) { document.getAnimations().forEach(a => { if (a.effect?.getTiming().iterations === Infinity) a.cancel(); else a.finish(); }); flights.forEach(cleanup => cleanup()); } });
document.documentElement.toggleAttribute('data-still', isStill());
buttonContent($('#copy'), 'copy', 'Copy', true);
window.addEventListener('pagehide', () => close(false, true));
if (preview) { selected.add(1); selected.add(2); update(); state('open', false, true); }
