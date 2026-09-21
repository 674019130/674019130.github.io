// @ts-check
(() => {
  const book = /** @type {HTMLElement} */ (document.querySelector('#book'));
  const innerFace = /** @type {HTMLElement} */ (document.querySelector('.inner'));
  const coverFace = /** @type {HTMLElement} */ (document.querySelector('.cover'));
  const inside = /** @type {HTMLElement} */ (document.querySelector('#inside'));
  const slider = /** @type {HTMLInputElement} */ (document.querySelector('#fold'));
  const amount = /** @type {HTMLOutputElement} */ (document.querySelector('#amount'));
  const toggle = /** @type {HTMLButtonElement} */ (document.querySelector('#toggle'));
  const reset = /** @type {HTMLButtonElement} */ (document.querySelector('#reset'));
  const motion = /** @type {HTMLButtonElement} */ (document.querySelector('#motion'));
  const status = /** @type {HTMLElement} */ (document.querySelector('#status'));
  let position = 0, target = 0, velocity = 0, frame = 0, lastTime = 0;
  let manualStill = false;
  /** @type {{id:number, x:number, y:number, start:number, moved:boolean, horizontal:boolean}|null} */
  let drag = null;
  /** @type {ReturnType<typeof setTimeout>|undefined} */
  let previewTimer;
  const still = () => manualStill || isStill();
  const clamp = (/** @type {number} */ value) => Math.max(0, Math.min(1, value));
  function render() {
    const p = clamp(position);
    book.style.setProperty('--fold', `${180 * (1 - p)}deg`);
    book.style.setProperty('--shift', `${-25 * (1 - p)}%`);
    book.style.setProperty('--shade', String(.015 + .23 * Math.sin(Math.PI * p)));
    slider.value = String(Math.round(p * 180));
    amount.value = `${Math.round(p * 180)}°`;
    inside.inert = p < .98;
    innerFace.setAttribute('aria-hidden', String(p < .5));
    coverFace.setAttribute('aria-hidden', String(p >= .5));
    toggle.setAttribute('aria-expanded', String(p >= .98));
    toggle.textContent = target > .5 ? 'Close card' : 'Open card';
    status.textContent = p < .01 ? 'Closed · tap the card to open' : p > .99 ? 'Open · tap the cover to close' : 'Unfolding · drag to explore';
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  function tick(/** @type {number} */ now) {
    const dt = Math.min((now - (lastTime || now - 16)) / 1000, .032);
    lastTime = now;
    velocity += ((target - position) * 180 - velocity * 25) * dt;
    position += velocity * dt;
    if (Math.abs(target - position) < .0005 && Math.abs(velocity) < .005) {
      position = target; velocity = 0; stop(); render(); return;
    }
    render(); frame = requestAnimationFrame(tick);
  }
  function setTarget(/** @type {number} */ value, immediate = false) {
    target = clamp(value);
    if (immediate || still()) { stop(); position = target; velocity = 0; render(); }
    else if (!frame) { lastTime = 0; frame = requestAnimationFrame(tick); }
  }
  function cancelPreview() { clearTimeout(previewTimer); }
  toggle.addEventListener('click', () => { cancelPreview(); setTarget(target > .5 ? 0 : 1); });
  reset.addEventListener('click', () => { cancelPreview(); setTarget(0); });
  slider.addEventListener('input', () => { cancelPreview(); setTarget(Number(slider.value) / 180, true); });
  motion.addEventListener('click', () => {
    manualStill = !manualStill; motion.setAttribute('aria-pressed', String(manualStill));
    if (still()) { cancelPreview(); setTarget(target, true); }
  });
  motionQuery.addEventListener('change', () => { if (still()) { cancelPreview(); setTarget(target, true); } });
  book.addEventListener('pointerdown', event => {
    if (event.button !== 0 || (/** @type {Element} */ (event.target)).closest('a')) return;
    cancelPreview(); stop(); velocity = 0;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, start: position, moved: false, horizontal: false };
    book.setPointerCapture(event.pointerId);
  });
  book.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; drag.horizontal = Math.abs(dx) >= Math.abs(dy); }
    if (!drag.horizontal) return;
    book.classList.add('dragging');
    setTarget(drag.start - dx / (book.offsetWidth / 2), true);
  });
  function finish(/** @type {PointerEvent} */ event) {
    if (!drag || drag.id !== event.pointerId) return;
    const previous = drag; drag = null; book.classList.remove('dragging');
    if (book.hasPointerCapture(event.pointerId)) book.releasePointerCapture(event.pointerId);
    if (event.type === 'pointercancel') setTarget(position >= .5 ? 1 : 0);
    else if (!previous.moved) setTarget(target > .5 ? 0 : 1);
    else setTarget(position >= .5 ? 1 : 0);
  }
  book.addEventListener('pointerup', finish);
  book.addEventListener('pointercancel', finish);
  book.addEventListener('lostpointercapture', event => { if (drag) finish(event); });
  window.addEventListener('keydown', event => { if (event.key === 'Escape') { cancelPreview(); setTarget(0); toggle.focus(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelPreview(); setTarget(target, true); } });
  window.addEventListener('pagehide', () => { cancelPreview(); stop(); });
  render();
  if (preview) {
    setTarget(1, true);
    if (!still()) previewTimer = setTimeout(() => { setTarget(0); previewTimer = setTimeout(() => setTarget(1), 1800); }, 1300);
  }
})();
