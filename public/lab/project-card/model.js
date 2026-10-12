// Pure state helpers shared by the page and the node tests.
export const people = [
  { id: 'mara', initial: 'M', name: 'Mara' },
  { id: 'jonas', initial: 'J', name: 'Jonas' },
  { id: 'priya', initial: 'P', name: 'Priya' },
];
export const statuses = ['todo', 'progress', 'review', 'done'];
export const initialTasks = () => [
  { id: 'welcome', owner: 'mara', done: true },
  { id: 'workspace', owner: 'jonas', done: true },
  { id: 'invite', owner: 'mara', done: true },
  { id: 'checklist', owner: 'priya', done: false },
  { id: 'emails', owner: 'jonas', done: false },
];
export function summary(tasks, owner = null) {
  const list = owner ? tasks.filter(task => task.owner === owner) : tasks;
  const done = list.filter(task => task.done).length;
  return { done, total: list.length, left: list.length - done };
}
// A person in focus outranks the hovered row, which outranks the overall count.
export function footerLine(tasks, { person = null, task = null } = {}) {
  if (person) return { kind: 'person', person, ...summary(tasks, person) };
  const row = task && tasks.find(item => item.id === task);
  if (row) return { kind: row.done ? 'doneBy' : 'assigned', person: row.owner };
  const { left } = summary(tasks);
  return left ? { kind: 'left', left } : { kind: 'all' };
}
export const lineKey = line => JSON.stringify(line);
// Escape closes the innermost layer first.
export function escapeTarget({ picker, lockedPerson, pinned }) {
  if (picker) return 'picker';
  if (lockedPerson) return 'filter';
  if (pinned) return 'pinned';
  return null;
}
