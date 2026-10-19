import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ORDER, LANE, FILES, CONFLICTS, CHECKS, ROW, diffTotals, conflictsByCommit, baseRows, firstCommit, lenaRows, graphPaths, shape, scrambleFrame } from '../public/lab/merge-conflicts/model.js'
import { copy } from '../public/lab/merge-conflicts/content.js'

const all = ORDER.slice()
const paths = (ids, id, opts) => graphPaths(ids, ids.indexOf(id), opts)

test('the diff chip and the conflict badges come from the same data as the card', () => {
  assert.deepEqual(diffTotals(), { add: 482, del: 37 })
  assert.equal(FILES.length, 4)
  assert.deepEqual(conflictsByCommit(), { l1: 1, l2: 2 })
  assert.equal(CONFLICTS.length, 3)
  for (const c of CONFLICTS) assert.equal(LANE[c.commit], 0, 'every conflict comes from a commit on main')
})

test('seed rows are fresh objects and the first commit replaces the uncommitted row', () => {
  const a = baseRows(), b = baseRows()
  assert.notEqual(a.c1, b.c1)
  assert.equal(a.c1.titleKey, 'uncommitted')
  const c1 = Object.assign(a.c1, firstCommit())
  assert.equal(c1.titleKey, null)
  assert.equal(c1.busy, false)
  assert.equal(c1.hash, 'd29f50')
  assert.deepEqual(Object.keys(lenaRows()), ['l1', 'l2'])
})

test('every lane is continuous from the base commit up to its top row', () => {
  const ids = all
  const base = ids.indexOf('base')
  for (let i = 1; i <= base; i++) {
    const { lines } = graphPaths(ids, i)
    const has = x => lines.some(l => l.d.startsWith(`M${x} -16`))
    assert.ok(has(10), `main reaches row ${ids[i]}`)
    if (i > ids.indexOf('mm')) assert.ok(has(26), `branch reaches row ${ids[i]}`)
    if (i > ids.indexOf('s1')) assert.ok(has(42), `teammate branch reaches row ${ids[i]}`)
  }
  assert.equal(graphPaths(ids, 0).lines.length, 0, 'nothing is drawn above the merge row')
})

test('segments stay inside one row except the main-into-branch curve', () => {
  const ids = all
  for (let i = 0; i < ids.length; i++) {
    for (const { d } of graphPaths(ids, i).lines) {
      const ys = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(Number).filter((_, k) => k % 2 === 1)
      if (ids[i] === 'l1' && d.includes('C10')) {
        assert.equal(Math.min(...ys), 16 - ROW * (ids.indexOf('l1') - ids.indexOf('mm')), 'curve ends on the merge commit')
      } else {
        assert.ok(ys.every(y => y >= -16 && y <= 34), `${ids[i]}: ${d}`)
      }
    }
  }
})

test('the connector to main follows the state colour and goes solid once merged', () => {
  const ids = all
  const conn = opts => paths(ids, 'mm', opts).lines.find(l => l.d.startsWith('M10 -16C10 -4'))
  assert.equal(conn({ conn: 'amber' }).stroke, 'var(--amber)')
  assert.equal(conn({ conn: 'amber' }).dash, true)
  assert.equal(conn({ conn: 'purple', merged: true }).dash, false)
  const before = ['c1', 'c2', 's1', 'c3', 's2', 'base']
  assert.ok(graphPaths(before, 0).lines.some(l => l.dash && l.d.startsWith('M8 -10')), 'before the PR exists a dashed stub points at main')
})

test('light only runs on the lanes the current step names', () => {
  const ids = all
  assert.equal(paths(ids, 'c2').lights.length, 0)
  assert.equal(paths(ids, 'c2', { flows: ['b'] }).lights.length, 1)
  assert.deepEqual(paths(ids, 'c2', { flows: ['m', 'b'] }).lights.map(l => l.d), ['M10 -16V16', 'M26 -16V16'])
  const mm = paths(ids, 'l1', { flows: ['mm'] }).lights
  assert.equal(mm.length, 1)
  assert.equal(mm[0].rev, true, 'main flows upward into the branch')
})

test('blur-in ignores counters but not new wording', () => {
  assert.equal(shape('Running 17 of 42 tests'), shape('Running 18 of 42 tests'))
  assert.notEqual(shape('Running 42 of 42 tests'), shape('Pushing the merge'))
  assert.equal(shape('1/3'), shape('2/3'))
})

test('decode keeps spaces, resolves left to right and ends on the real text', () => {
  const text = 'Rotate session keys'
  const zero = () => 0
  assert.deepEqual(scrambleFrame(text, 0, zero), { head: '', tail: 'aaaaaa aaaaaaa aaaa' })
  const mid = scrambleFrame(text, 0.5, zero)
  assert.ok(text.startsWith(mid.head))
  assert.equal(mid.head.length + mid.tail.length, text.length)
  assert.deepEqual(scrambleFrame(text, 1), { head: text, tail: '' })
  assert.deepEqual(scrambleFrame(text, 7), { head: text, tail: '' }, 'progress is clamped')
})

test('both languages carry the same copy', () => {
  const keys = o => Object.keys(o).sort()
  assert.deepEqual(keys(copy.en), keys(copy.zh))
  for (const k of Object.keys(copy.en)) {
    const v = copy.en[k]
    if (v && typeof v === 'object' && !Array.isArray(v)) assert.deepEqual(keys(v), keys(copy.zh[k]), k)
  }
  assert.equal(copy.en.notes.length, 4)
  assert.equal(copy.zh.notes.length, 4)
  for (const lang of ['en', 'zh']) {
    for (const { id } of CHECKS) assert.ok(copy[lang].checks[id], `${lang} check ${id}`)
    assert.match(copy[lang].steps.testing(3, 42), /3/)
    assert.match(copy[lang].foot.conflicts('<b>x</b>'), /<b>x<\/b>/)
  }
})
