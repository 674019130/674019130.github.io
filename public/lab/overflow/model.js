// Pure geometry for the rolling ink ball. Everything here is testable without a DOM.
export const R = 13;                 // ball radius, px
export const TAU = Math.PI * 2;
export const C = TAU * R;            // one revolution of travel
export const GAP = 16;               // blank ribbon left around each stamp
export const GHOST = 0.16;           // what an earlier lap fades to
export const VOID = 1.7;             // blank paper after the text, in viewport heights

export const mod = (a, n) => ((a % n) + n) % n;
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const smooth = t => t * t * (3 - 2 * t);

// Reading zone: the ball is a scroll thumb, from the top of the rail to its end.
export const railSpan = g => Math.max(1, g.contentEnd - g.h);
// Void zone: blank paper, then the cloned top of the page; wrapping happens at g.L.
export const voidSpan = g => Math.max(1, g.L - g.contentEnd + g.h);

export function homeAt(top, g) {
  if (top <= g.contentEnd - g.h) {
    const p = clamp(top / railSpan(g), 0, 1);
    const y = g.railTop + p * (g.railEnd - g.railTop);
    return { zone: 'read', p, q: 0, x: g.railX, y, sy: y - top };
  }
  const q = clamp((top - (g.contentEnd - g.h)) / voidSpan(g), 0, 1);
  const s0 = g.railEnd - g.contentEnd + g.h, mid = g.h * 0.6, s1 = g.railTop;
  // Sink a little, drift, then rise to meet the top of the page arriving from below.
  const sy = q < 0.4 ? s0 + (mid - s0) * smooth(q / 0.4)
    : q < 0.6 ? mid
    : mid + (s1 - mid) * smooth((q - 0.6) / 0.4);
  const bend = Math.sin(Math.PI * q) ** 2 * (1 + 0.6 * Math.sin(4 * Math.PI * q)) / 1.6;
  return { zone: 'void', p: 1, q, x: g.railX + g.amp * bend, y: top + sy, sy };
}

// Inverse of homeAt for a zone and its progress, used to keep the place across relayouts.
export function topFor(zone, t, g) {
  return zone === 'read' ? clamp(t, 0, 1) * railSpan(g) : g.contentEnd - g.h + clamp(t, 0, 1) * voidSpan(g);
}

export function wrapTop(top, L) {
  let laps = 0;
  while (top >= L) { top -= L; laps++; }
  return { top, laps };
}

// The mark faces you at θ = 0 and touches the paper at θ = π, once per revolution.
export const railTheta = (y, g, phase) => phase + (y - g.railTop) / R;
export const firstStamp = theta0 => R * mod(Math.PI - theta0, TAU);
export function stampDistances(theta0, length) {
  const out = [];
  for (let s = firstStamp(theta0); s <= length; s += C) out.push(s);
  return out;
}
// Canvas dash pattern [C - GAP, GAP]: the gap is centred on every stamp.
export const dashOffset = theta0 => mod(C - GAP / 2 - firstStamp(theta0), C);

// Where the mark on the ball appears, seen from above while it rolls along dir.
export function glyphOnBall(theta, dir) {
  const c = Math.cos(theta), s = Math.sin(theta);
  return { ox: dir.x * s * R * 0.78, oy: dir.y * s * R * 0.78, squash: Math.max(0.05, c), visible: c > 0, opacity: clamp(c * 2.2, 0, 1) };
}

// A hard flick throws a few drops sideways. Restrained on purpose: at most two per frame.
export function splatter(speed, random = Math.random) {
  if (speed < 1.2) return [];
  const n = random() < Math.min(1, (speed - 1.2) * 0.6) ? 1 + (random() < 0.3 ? 1 : 0) : 0;
  const drops = [];
  for (let i = 0; i < n; i++) {
    const side = random() < 0.5 ? -1 : 1;
    drops.push({ along: (random() - 0.3) * 10, across: side * (8 + random() * 14), r: 0.8 + random() * Math.min(2, speed * 0.6) });
  }
  return drops;
}

// Which copies of a path, k·L apart, intersect the viewport [top, top + h].
export function copiesInView(minY, maxY, top, h, L) {
  const out = [];
  for (let k = Math.ceil((top - maxY) / L); k <= Math.floor((top + h - minY) / L); k++) out.push(k || 0);
  return out;
}

export function pointAt(pts, s) {
  let lo = 0, hi = pts.length - 1;
  if (s <= 0 || hi === 0) return { x: pts[0].x, y: pts[0].y, a: hi ? Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x) : Math.PI / 2 };
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m].s < s) lo = m; else hi = m; }
  const a = pts[lo], b = pts[hi], t = clamp((s - a.s) / Math.max(1e-6, b.s - a.s), 0, 1);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, a: Math.atan2(b.y - a.y, b.x - a.x) };
}

// Hand-drawn ink is kept in page coordinates. After a relayout, the text part and the blank
// part are stretched separately, so a loop drawn over a paragraph stays over it.
export function remapY(y, from, to) {
  const k = Math.floor(y / from.L), r = y - k * from.L;
  const out = r < from.contentEnd
    ? r * to.contentEnd / from.contentEnd
    : to.contentEnd + (r - from.contentEnd) * (to.L - to.contentEnd) / (from.L - from.contentEnd);
  return out + k * to.L;
}
