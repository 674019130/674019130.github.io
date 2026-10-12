// Pure board state shared by the page and the node tests.
export const people = [
  { id: 'emma', name: 'Emma Collins', initials: 'EC' },
  { id: 'marcus', name: 'Marcus Johnson', initials: 'MJ' },
  { id: 'chloe', name: 'Chloe Nguyen', initials: 'CN' },
  { id: 'daniel', name: 'Daniel Kim', initials: 'DK' },
];
// A null limit means the column is never "over".
export const columns = [
  { id: 'backlog', limit: null },
  { id: 'progress', limit: 3 },
  { id: 'review', limit: 2 },
  { id: 'done', limit: null },
];
export const tags = ['billing', 'design', 'api', 'lifecycle'];

const seed = [
  ['BIL-142', 'backlog', 'daniel', 'billing', '10-02', [0, 3], 5],
  ['BIL-151', 'backlog', 'chloe', 'lifecycle', '10-06', null, 3],
  ['BIL-155', 'backlog', 'marcus', 'billing', null, null, 2],
  ['BIL-160', 'backlog', 'emma', 'design', null, null, 1],
  ['BIL-128', 'progress', 'emma', 'design', '09-26', [2, 4], 3],
  ['BIL-133', 'progress', 'daniel', 'api', '09-25', [1, 2], 5],
  ['BIL-137', 'progress', 'marcus', 'billing', '09-30', null, 3],
  ['BIL-119', 'review', 'chloe', 'billing', '09-24', [2, 3], 3],
  ['BIL-124', 'review', 'emma', 'design', null, null, 2],
  ['BIL-102', 'done', 'daniel', 'api', null, null, 8],
  ['BIL-108', 'done', 'emma', 'design', null, null, 3],
  ['BIL-111', 'done', 'marcus', 'billing', null, null, 5],
];
export const initialCards = () => seed.map(([id, status, owner, tag, due, check, points]) => ({ id, status, owner, tag, due, check: check && [...check], points }));

// A cell is a column ({ status }) or, in swimlanes, one person's slice of it ({ status, owner }).
export const inCell = (card, cell) => card.status === cell.status && (!('owner' in cell) || card.owner === cell.owner);
export const cellOf = (card, view) => view === 'lanes' ? { status: card.status, owner: card.owner } : { status: card.status };
export const cellKey = cell => `${cell.status}|${'owner' in cell ? cell.owner ?? 'none' : 'any'}`;
// Unassigned cards (from the composer) get their own lane only when one exists.
export const laneIds = (cards, extra = false) => cards.some(card => card.owner == null) || extra ? [...people.map(p => p.id), null] : people.map(p => p.id);

export function load(cards, status) {
  const { limit } = columns.find(column => column.id === status);
  const count = cards.filter(card => card.status === status).length;
  return { count, limit, over: limit != null && count > limit };
}
// Dropping is never blocked; the target only warns that it will go over.
export function wouldExceed(cards, id, status) {
  const card = cards.find(item => item.id === id);
  if (!card || card.status === status) return false;
  const { count, limit } = load(cards, status);
  return limit != null && count + 1 > limit;
}

// `index` counts the target cell's cards without the moving one.
export function moveCard(cards, id, cell, index) {
  const card = cards.find(item => item.id === id);
  if (!card) return cards;
  const moved = { ...card, status: cell.status, ...('owner' in cell ? { owner: cell.owner } : {}) };
  const rest = cards.filter(item => item.id !== id);
  const siblings = rest.filter(item => inCell(item, cell));
  const i = Math.max(0, Math.min(index, siblings.length));
  let at;
  if (i < siblings.length) at = rest.indexOf(siblings[i]);
  else if (siblings.length) at = rest.indexOf(siblings.at(-1)) + 1;
  else at = rest.findLastIndex(item => item.status === cell.status) + 1 || rest.length;
  return [...rest.slice(0, at), moved, ...rest.slice(at)];
}
export function position(cards, id, view) {
  const card = cards.find(item => item.id === id);
  const list = cards.filter(item => inCell(item, cellOf(card, view)));
  return { index: list.indexOf(card), total: list.length };
}

// Keyboard moves: left/right change column, up/down reorder and, in swimlanes, cross lanes.
export function nudge(cards, id, key, view) {
  const card = cards.find(item => item.id === id);
  if (!card) return null;
  const cell = cellOf(card, view);
  const list = cards.filter(item => inCell(item, cell));
  const index = list.indexOf(card);
  const size = target => cards.filter(item => item.id !== id && inCell(item, target)).length;
  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const next = columns[columns.findIndex(column => column.id === card.status) + (key === 'ArrowRight' ? 1 : -1)];
    if (!next) return null;
    const target = { ...cell, status: next.id };
    return { cell: target, index: Math.min(index, size(target)) };
  }
  if (key === 'Home') return index > 0 ? { cell, index: 0 } : null;
  if (key === 'End') return index < list.length - 1 ? { cell, index: list.length - 1 } : null;
  if (key !== 'ArrowUp' && key !== 'ArrowDown') return null;
  const step = key === 'ArrowDown' ? 1 : -1;
  if (list[index + step]) return { cell, index: index + step };
  if (view !== 'lanes') return null;
  const lanes = laneIds(cards);
  const lane = lanes[lanes.indexOf(card.owner) + step];
  if (lane === undefined) return null;
  const target = { status: card.status, owner: lane };
  return { cell: target, index: step > 0 ? 0 : size(target) };
}

export function nextId(cards) {
  const top = Math.max(0, ...cards.map(card => Number(card.id.split('-')[1]) || 0));
  return `BIL-${top + 1}`;
}
export function createCard(cards, cell, title) {
  const card = { id: nextId(cards), status: cell.status, owner: cell.owner ?? null, tag: null, due: null, check: null, points: null, title };
  return moveCard([...cards, card], card.id, cell, Infinity);
}
