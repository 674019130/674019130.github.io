// Sample repository data and the pure geometry of the commit graph.

// Top to bottom. Rows join and leave the card as the agent works, but never change order.
export const ORDER = ['merge', 'mm', 'c1', 'l1', 'l2', 'c2', 's1', 'c3', 's2', 'base'];
// 0 = main, 1 = the PR branch, 2 = a teammate's branch.
export const LANE = { merge: 0, mm: 1, c1: 1, l1: 0, l2: 0, c2: 1, s1: 2, c3: 1, s2: 2, base: 0 };
export const LX = [10, 26, 42];
export const ROW = 32;

export const FILES = [
  ['src/auth/refresh.ts', 164, 0],
  ['test/session-refresh.test.ts', 219, 0],
  ['src/middleware.ts', 58, 21],
  ['src/auth.ts', 41, 16],
];
export const TESTS = 42;

// Each conflict belongs to the commit on main that touched the same line.
export const CONFLICTS = [
  { commit: 'l1', file: 'middleware.ts', line: 18, lena: 'const session = await readSession(req, keys)', you: 'if (nearExpiry(session)) await refresh(session)' },
  { commit: 'l2', file: 'auth.ts', line: 42, lena: 'return verify(token, keys.current)', you: 'return refreshIfNear(token, 5 * MINUTE)' },
  { commit: 'l2', file: 'auth.ts', line: 57, lena: 'const ttl = keys.current.ttl', you: 'const ttl = session.expiresAt - Date.now()' },
];

export const CHECKS = [
  { id: 'tests', tip: 'vitest · 42 passed, 0 failed', time: '38s' },
  { id: 'lint', tip: 'eslint · 0 problems', time: '9s' },
  { id: 'types', tip: 'tsc --noEmit · no errors', time: '21s' },
  { id: 'preview', tip: 'pr-128.acme-webapp.dev', time: '1m 04s' },
];

export function diffTotals(files = FILES) {
  return files.reduce((sum, [, add, del]) => ({ add: sum.add + add, del: sum.del + del }), { add: 0, del: 0 });
}

export function conflictsByCommit(conflicts = CONFLICTS) {
  const out = {};
  for (const c of conflicts) out[c.commit] = (out[c.commit] || 0) + 1;
  return out;
}

const commit = (title, hash, who, when, tone, extra = {}) => ({ title, hash, who, when, tone, node: 'dot', ...extra });

// Commit messages stay in English in both languages; rows with a titleKey are UI labels.
export function baseRows() {
  return {
    c1: { titleKey: 'uncommitted', tone: 'faint', node: 'dash', busy: true, tag: ['feat/session-refresh', 'blue'], right: { k: 'files', n: 4, tone: 'checking' } },
    c2: commit('Refresh sessions near expiry', 'c70a92', 'you', '25m', 'you'),
    s1: commit('Add analytics consent banner', 'e83c51', 'Sam', '32m', 'other', { tag: ['feat/checkout-analytics', 'teal'] }),
    c3: commit('Read session expiry from the token', '1f8e3b', 'you', '40m', 'you'),
    s2: commit('Track checkout funnel events', '62b0e4', 'Sam', '2h', 'other'),
    base: commit('Bump next to 16.3', '9c2d4a', 'Sam', '3h', 'other', { tag: ['main', 'main'] }),
  };
}
export const firstCommit = () => commit('Add session refresh tests', 'd29f50', 'you', 'now', 'you', { tag: ['feat/session-refresh', 'blue'], right: null, busy: false, titleKey: null });
export const lenaRows = () => ({
  l1: commit('Read sessions with the current key', '5be27d', 'Lena', '6m', 'other', { tag: ['main', 'main'], flash: true }),
  l2: commit('Rotate session keys', 'a3f9c1', 'Lena', '18m', 'other', { flash: true }),
});

const CONN = { blue: 'var(--blue)', amber: 'var(--amber)', green: 'var(--green)', purple: 'var(--purple)' };

/*
 * Paths for row i of the visible rows `ids`, in that row's own 52x32 box.
 * Every segment runs from the previous row's centre (y = -16) to this row's centre (y = 16),
 * so a row can be inserted or animated in height without redrawing its neighbours.
 */
export function graphPaths(ids, i, { merged = false, conn = 'blue', flows = [] } = {}) {
  const id = ids[i], lines = [], lights = [];
  const at = k => ids.indexOf(k);
  const iBase = at('base'), iMerge = at('merge'), iMm = at('mm');
  const firstMain = ids.findIndex(k => LANE[k] === 0 && k !== 'merge');
  const top0 = iMerge >= 0 ? iMerge : firstMain;
  const top1 = ids.findIndex(k => LANE[k] === 1);
  const top2 = ids.findIndex(k => LANE[k] === 2);
  const branch = merged ? 'var(--purple)' : 'var(--blue)';
  const [x0, x1, x2] = LX;
  const line = (d, stroke, dash = false, opacity = 1) => lines.push({ d, stroke, dash, opacity });
  const light = (key, d, color, rev = false) => { if (flows.includes(key)) lights.push({ d, color, rev }); };

  if (i > top0 && i <= iBase) {
    const pending = i <= firstMain && !merged;
    line(`M${x0} -16V16`, 'var(--main)', pending, pending ? 0.7 : 1);
    light('m', `M${x0} -16V16`, 'var(--faint)');
  }
  if (i > top1 && i <= iBase) {
    const d = i === iBase ? `M${x1} -16C${x1} 6 ${x0} 2 ${x0} 16` : `M${x1} -16V16`;
    line(d, branch); light('b', d, branch);
  }
  if (top2 >= 0 && i > top2 && i <= iBase) line(i === iBase ? `M${x2} -16C${x2} 8 ${x0} 4 ${x0} 16` : `M${x2} -16V16`, 'var(--teal)', false, 0.75);
  if (iMerge >= 0 && i === iMerge + 1) {
    const d = `M${x0} -16C${x0} -4 ${x1} 2 ${x1} 16`;
    line(d, CONN[conn], !merged); light('conn', d, CONN[conn]);
  }
  if (iMerge < 0 && i === 0) { line(`M${x0 - 2} -10L${x1} 16`, 'var(--blue)', true, 0.8); light('b', `M${x0 - 2} -10L${x1} 16`, 'var(--blue)'); }
  if (id === 'l1' && iMm >= 0) {
    // main joins the branch at the merge commit, which may sit several rows higher
    const ty = 16 - ROW * (i - iMm);
    const d = `M${x0} 16C${x0} ${ty + 30} ${x1} ${ty + 22} ${x1} ${ty}`;
    line(d, merged ? 'var(--purple)' : 'var(--main)'); light('mm', d, 'var(--amber)', true);
  }
  if (id === 'base') line(`M${x0} 16V34`, 'var(--main)', true, 0.6);
  return { lines, lights };
}

// Text whose digits are its only change (a test counter) keeps its place without a blur.
export const shape = s => String(s).replace(/\d+/g, '#');

// One frame of the decode effect: the first share of the text is real, the rest is noise.
const NOISE = 'abcdefghijklmnopqrstuvwxyz0123456789';
export function scrambleFrame(text, progress, random = Math.random) {
  const p = Math.max(0, Math.min(1, progress));
  const n = Math.floor(p * p * text.length);
  let tail = '';
  for (let i = n; i < text.length; i++) tail += text[i] === ' ' ? ' ' : NOISE[Math.floor(random() * NOISE.length)];
  return { head: text.slice(0, n), tail };
}
