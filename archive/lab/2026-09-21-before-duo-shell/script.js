// @ts-check
(() => {
  const stage = /** @type {HTMLElement} */ (document.querySelector('#stage'));
  const leaf = /** @type {HTMLElement} */ (document.querySelector('#leaf'));
  const baseShape = /** @type {SVGPathElement} */ (document.querySelector('#base-shape'));
  const leafShape = /** @type {SVGPathElement} */ (document.querySelector('#leaf-shape'));
  const rimShape = /** @type {SVGPathElement} */ (document.querySelector('#rim-shape'));
  const finishButton = /** @type {HTMLButtonElement} */ (document.querySelector('#finish'));
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
  let lightX = .25, lightY = -.3, lightFrame = 0, holographic = true;
  /** @type {{id:number, x:number, y:number, start:number, moved:boolean, horizontal:boolean}|null} */
  let drag = null;
  /** @type {ReturnType<typeof setTimeout>|undefined} */
  let previewTimer;
  const still = () => manualStill || isStill();
  const clamp = (/** @type {number} */ value) => Math.max(0, Math.min(1, value));
  const smooth = (/** @type {number} */ a, /** @type {number} */ b, /** @type {number} */ x) => {
    const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t);
  };
  /** @param {number[][]} points */
  function roundedPath(points) {
    const radius = 9;
    const corners = points.map((point, i) => {
      const before = points[(i + points.length - 1) % points.length];
      const after = points[(i + 1) % points.length];
      const toward = (/** @type {number[]} */ other) => {
        const distance = Math.hypot(other[0] - point[0], other[1] - point[1]);
        const ratio = Math.min(point[0] === 220 ? 0 : radius, distance / 3) / Math.max(distance, .001);
        return [point[0] + (other[0] - point[0]) * ratio, point[1] + (other[1] - point[1]) * ratio];
      };
      return { point, in: toward(before), out: toward(after) };
    });
    return corners.map((c, i) => `${i ? 'L' : 'M'}${c.in.join(',')}Q${c.point.join(',')} ${c.out.join(',')}`).join('') + 'Z';
  }
  function lighting() {
    const theta = Math.PI * (1 - clamp(position));
    // A shared pointer light, reflected by each independently oriented surface.
    for (const [surface, angle] of /** @type {[HTMLElement, number][]} */ ([[inside, 0], [leaf, position < .5 ? theta - Math.PI : theta]])) {
      const nx = Math.sin(angle), nz = Math.cos(angle);
      const diffuse = Math.max(0, (nx * lightX + nz * 1.6) / Math.hypot(lightX, lightY, 1.6));
      const lx = clamp(.5 + lightX * .48 - nx * .30);
      const ly = clamp(.5 + lightY * .5);
      surface.style.setProperty('--light-x', `${lx * 100}%`);
      surface.style.setProperty('--light-y', `${ly * 100}%`);
      surface.style.setProperty('--spectrum-x', `${50 + lightX * 65 + nx * 55}%`);
      surface.style.setProperty('--spectrum-y', `${50 + lightY * 65}%`);
      surface.style.setProperty('--rainbow-angle', `${110 + lightX * 55 - lightY * 35 + nx * 55}deg`);
      surface.style.setProperty('--specular', String(.18 + .48 * diffuse));
    }
  }
  function render() {
    const p = clamp(position), theta = Math.PI * (1 - p);
    const z = 220 * Math.sin(theta), perspective = 1100 / (1100 - z);
    const outerX = 220 - 220 * Math.cos(theta) * perspective;
    const topY = 150 - 150 * perspective, bottomY = 150 + 150 * perspective;
    const left = [[outerX, topY], [220, 0], [220, 300], [outerX, bottomY]];
    const base = [[220, 0], [440, 0], [440, 300], [220, 300]];
    const clip = (/** @type {number[][]} */ points) => `polygon(${points.map(([x, y]) => `${x / 440 * 100}% ${(y + 75) / 450 * 100}%`).join(',')})`;
    book.style.setProperty('--base-clip', clip(base));
    book.style.setProperty('--leaf-clip', clip(left));
    baseShape.setAttribute('d', roundedPath(base));
    const path = roundedPath(left);
    leafShape.setAttribute('d', path); rimShape.setAttribute('d', path);
    const minX = Math.min(outerX, 220), maxX = Math.max(outerX, 440);
    book.style.setProperty('--shift', `${(220 - (minX + maxX) / 2) / 440 * 100}%`);
    // Content stays front-facing: the surface clips it instead of rotating glyphs.
    // Hinge angle, not elapsed time, drives blur and the display handoff.
    const middle = Math.sin(Math.PI * p);
    book.style.setProperty('--blur', `${still() ? 0 : 9 * middle ** 2}px`);
    book.style.setProperty('--cover-opacity', String(1 - smooth(.08, .47, p)));
    book.style.setProperty('--inner-opacity', String(smooth(.5, .95, p)));
    book.style.setProperty('--base-opacity', String(smooth(.16, .85, p)));
    book.style.setProperty('--content-shift', `${-15 * middle}px`);
    book.style.setProperty('--inner-shift', `${28 * (1 - p)}px`);
    book.style.setProperty('--hinge-alpha', String(.08 + .24 * middle));
    lighting();
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
    velocity += ((target - position) * 145 - velocity * 23) * dt;
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
  finishButton.addEventListener('click', () => {
    holographic = !holographic; book.dataset.foil = String(holographic);
    finishButton.setAttribute('aria-pressed', String(holographic));
  });
  function updateLight(/** @type {PointerEvent} */ event) {
    const box = stage.getBoundingClientRect();
    lightX = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    lightY = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    if (!lightFrame) lightFrame = requestAnimationFrame(() => { lightFrame = 0; lighting(); });
  }
  stage.addEventListener('pointermove', updateLight);
  stage.addEventListener('pointerdown', updateLight);
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
  window.addEventListener('pagehide', () => { cancelPreview(); stop(); cancelAnimationFrame(lightFrame); });
  render();
  if (preview) {
    setTarget(1, true);
    if (!still()) previewTimer = setTimeout(() => { setTarget(0); previewTimer = setTimeout(() => setTarget(1), 1800); }, 1300);
  }
})();
