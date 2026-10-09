import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chronologicalGroups, receiveGroupDate } from '../public/lab/timeline/model.js';

test('a newly appended group moves into chronological position as soon as its date arrives', () => {
  const jan = { id: 'jan', sortDate: '2025-01-08' };
  const jul = { id: 'jul', sortDate: '2025-07-04' };
  const winter = { id: 'winter', sortDate: '2026-01-14' };
  const incoming = { id: 'new', rows: [{ id: 'same-row' }] };
  const groups = [jan, jul, winter, incoming];
  const sorted = receiveGroupDate(groups, 'new', '2025-04-09');
  assert.deepEqual(sorted.map(group => group.id), ['jan', 'new', 'jul', 'winter']);
  assert.equal(sorted[1], incoming, 'preserve group identity and its content');
  assert.equal(sorted[1].rows[0].id, 'same-row');
  assert.deepEqual(groups.map(group => group.id), ['jan', 'jul', 'winter', 'new'], 'do not reorder the input array in place');
});

test('corrections work in both directions and at the two ends', () => {
  let groups = [{ id: 'a', sortDate: '2025-01-01' }, { id: 'b', sortDate: '2025-06-01' }, { id: 'c', sortDate: '2026-01-01' }];
  groups = receiveGroupDate(groups, 'a', '2027-01-01');
  assert.deepEqual(groups.map(group => group.id), ['b', 'c', 'a']);
  groups = receiveGroupDate(groups, 'c', '2024-01-01');
  assert.deepEqual(groups.map(group => group.id), ['c', 'b', 'a']);
});

test('equal dates and undated groups retain their arrival order', () => {
  const groups = [{ id: 'u1' }, { id: 'a', sortDate: '2025-01-01' }, { id: 'u2' }, { id: 'b', sortDate: '2025-01-01' }];
  assert.deepEqual(chronologicalGroups(groups).map(group => group.id), ['a', 'b', 'u1', 'u2']);
});

test('incomplete, impossible and unknown-group metadata cannot move a group', () => {
  for (const date of [null, '', 'April', '2025-4-9', '2025-02-30', '2025-13-01']) {
    const groups = [{ id: 'a', sortDate: '2025-01-01' }, { id: 'new' }];
    assert.equal(receiveGroupDate(groups, 'new', date), groups);
    assert.equal(groups[1].sortDate, undefined);
  }
  const groups = [{ id: 'a' }];
  assert.equal(receiveGroupDate(groups, 'missing', '2025-04-09'), groups);
});

test('the original 24-event fixture retains complete Chinese text coverage', async () => {
  const { readFile } = await import('node:fs/promises');
  const { translations, copy } = await import('../public/lab/timeline/content.js');
  const source = await readFile(new URL('../public/lab/timeline/script.js', import.meta.url), 'utf8');
  const initial = JSON.parse(source.split('const PREVIEW_GROUPS = ')[1].split(';\n\nconst CHANGE_EVENTS')[0]);
  const events = JSON.parse(source.split('const CHANGE_EVENTS = ')[1].split(';\n\nconst timelineList')[0]);
  assert.equal(events.length, 24);
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    for (const [key, entry] of Object.entries(value)) {
      if (['headline', 'summary', 'dateLabel'].includes(key)) assert.ok(translations[entry], `Missing translation: ${entry}`);
      else visit(entry);
    }
  };
  visit(initial); visit(events);
  assert.deepEqual(Object.keys(copy.en).sort(), Object.keys(copy.zh).sort());
});

test('from-zero events introduce every empty group before streaming its items', async () => {
  const { buildFromEmptyEvents } = await import('../public/lab/timeline/model.js');
  const fixture = ['spring', 'summer', 'winter'].map(id => ({ id, items: [0, 1, 2].map(n => ({ id: `${id}-${n}`, headline: 'Example' })) }));
  const snapshot = structuredClone(fixture);
  const events = buildFromEmptyEvents(fixture);
  assert.equal(events.length, 9);
  const received = new Set();
  for (const event of events) {
    if (event.type === 'add_group') {
      assert.equal(received.has(event.groupId), false);
      assert.deepEqual(event.group.items, []);
      received.add(event.groupId);
    } else {
      assert.ok(received.has(event.groupId), 'items require an already received group');
      assert.equal(event.itemId, event.item.id);
    }
  }
  assert.equal(received.size, 3);
  assert.deepEqual(fixture, snapshot, 'replays cannot consume or change the original fixture');
  assert.deepEqual(buildFromEmptyEvents(fixture), events, 'replay produces the same stream');
  assert.deepEqual(buildFromEmptyEvents([]), []);
});
