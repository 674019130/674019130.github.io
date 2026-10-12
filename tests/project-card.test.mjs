import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { initialTasks, summary, footerLine, escapeTarget, people, statuses } from '../public/lab/project-card/model.js'
import { copy } from '../public/lab/project-card/content.js'

test('summary counts the whole project or one person', () => {
  const tasks = initialTasks()
  assert.deepEqual(summary(tasks), { done: 3, total: 5, left: 2 })
  assert.deepEqual(summary(tasks, 'mara'), { done: 2, total: 2, left: 0 })
  assert.deepEqual(summary(tasks, 'priya'), { done: 0, total: 1, left: 1 })
  assert.equal(initialTasks()[0] === tasks[0], false, 'reset gets fresh task objects')
})

test('footer prefers person focus, then the active row, then the count', () => {
  const tasks = initialTasks()
  assert.deepEqual(footerLine(tasks), { kind: 'left', left: 2 })
  assert.deepEqual(footerLine(tasks, { task: 'checklist' }), { kind: 'assigned', person: 'priya' })
  assert.deepEqual(footerLine(tasks, { task: 'welcome' }), { kind: 'doneBy', person: 'mara' })
  assert.equal(footerLine(tasks, { person: 'jonas', task: 'welcome' }).kind, 'person')
  assert.deepEqual(footerLine(tasks, { task: 'missing' }), { kind: 'left', left: 2 })
  assert.deepEqual(footerLine(tasks.map(t => ({ ...t, done: true }))), { kind: 'all' })
})

test('escape steps back one layer at a time', () => {
  assert.equal(escapeTarget({ picker: true, lockedPerson: 'mara', pinned: true }), 'picker')
  assert.equal(escapeTarget({ picker: false, lockedPerson: 'mara', pinned: true }), 'filter')
  assert.equal(escapeTarget({ picker: false, lockedPerson: null, pinned: true }), 'pinned')
  assert.equal(escapeTarget({ picker: false, lockedPerson: null, pinned: false }), null)
})

test('both languages cover every task, status, footer line and note', () => {
  const keys = lang => Object.keys(copy[lang]).sort()
  assert.deepEqual(keys('zh'), keys('en'))
  for (const lang of ['en', 'zh']) {
    const t = copy[lang]
    for (const task of initialTasks()) assert.ok(t.tasks[task.id])
    for (const status of statuses) assert.ok(t.statuses[status])
    assert.equal(t.notes.length, 4)
    assert.equal(t.footer.person('Mara', 1, 2)[2], true)
  }
  assert.equal(people.length, 3)
})

test('page keeps attribution, implementation notes and the snippet anchors', () => {
  const html = readFileSync(new URL('../public/lab/project-card/index.html', import.meta.url), 'utf8')
  assert.ok(html.includes('https://x.com/flohoeller/status/2109230261858656727'))
  for (let i = 0; i < 4; i++) assert.ok(html.includes(`id="note-title-${i}"`))
  for (const snippet of ['grid-template-rows: 0fr', 'pathLength="100"', 'getComputedStyle(previous)', ':focus-visible']) assert.ok(html.includes(snippet), snippet)
})
