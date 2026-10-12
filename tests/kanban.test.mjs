import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { initialCards, columns, people, load, wouldExceed, moveCard, nudge, position, laneIds, createCard, nextId } from '../public/lab/kanban/model.js'
import { copy } from '../public/lab/kanban/content.js'

const ids = (cards, status, owner) => cards.filter(c => c.status === status && (owner === undefined || c.owner === owner)).map(c => c.id)

test('seed matches the reference board and its limits', () => {
  const cards = initialCards()
  assert.equal(cards.length, 12)
  assert.deepEqual(columns.map(c => load(cards, c.id).count), [4, 3, 2, 3])
  assert.deepEqual(load(cards, 'progress'), { count: 3, limit: 3, over: false })
  assert.equal(load(cards, 'backlog').over, false, 'no limit never goes over')
  assert.notEqual(initialCards()[0], cards[0], 'reset gets fresh objects')
})

test('moving into a full column warns and then reports over limit', () => {
  const cards = initialCards()
  assert.equal(wouldExceed(cards, 'BIL-142', 'review'), true)
  assert.equal(wouldExceed(cards, 'BIL-119', 'review'), false, 'reordering inside a column never warns')
  const next = moveCard(cards, 'BIL-142', { status: 'review' }, 2)
  assert.deepEqual(load(next, 'review'), { count: 3, limit: 2, over: true })
  assert.deepEqual(ids(next, 'review'), ['BIL-119', 'BIL-124', 'BIL-142'])
})

test('index places a card among its new siblings and clamps', () => {
  const cards = initialCards()
  assert.deepEqual(ids(moveCard(cards, 'BIL-111', { status: 'progress' }, 0), 'progress'), ['BIL-111', 'BIL-128', 'BIL-133', 'BIL-137'])
  assert.deepEqual(ids(moveCard(cards, 'BIL-128', { status: 'progress' }, 99), 'progress'), ['BIL-133', 'BIL-137', 'BIL-128'])
  const empty = moveCard(moveCard(moveCard(cards, 'BIL-119', { status: 'done' }, 0), 'BIL-124', { status: 'done' }, 0), 'BIL-102', { status: 'review' }, 0)
  assert.deepEqual(ids(empty, 'review'), ['BIL-102'], 'an emptied column accepts a card')
})

test('a swimlane drop changes the owner as well as the status', () => {
  const next = moveCard(initialCards(), 'BIL-160', { status: 'progress', owner: 'chloe' }, 0)
  const card = next.find(c => c.id === 'BIL-160')
  assert.equal(card.status, 'progress'); assert.equal(card.owner, 'chloe')
  assert.deepEqual(ids(next, 'progress', 'chloe'), ['BIL-160'])
})

test('keyboard nudges move across columns, positions and lanes', () => {
  const cards = initialCards()
  assert.deepEqual(nudge(cards, 'BIL-151', 'ArrowRight', 'status'), { cell: { status: 'progress' }, index: 1 })
  assert.equal(nudge(cards, 'BIL-142', 'ArrowLeft', 'status'), null)
  assert.equal(nudge(cards, 'BIL-142', 'ArrowUp', 'status'), null)
  const down = nudge(cards, 'BIL-142', 'ArrowDown', 'status')
  const moved = moveCard(cards, 'BIL-142', down.cell, down.index)
  assert.deepEqual(position(moved, 'BIL-142', 'status'), { index: 1, total: 4 })
  assert.deepEqual(nudge(cards, 'BIL-142', 'End', 'status'), { cell: { status: 'backlog' }, index: 3 })
  // Emma has one backlog card, so Down crosses into Marcus's lane.
  assert.deepEqual(nudge(cards, 'BIL-160', 'ArrowDown', 'lanes'), { cell: { status: 'backlog', owner: 'marcus' }, index: 0 })
  assert.equal(nudge(cards, 'BIL-160', 'ArrowUp', 'lanes'), null)
})

test('composer cards are unassigned and get their own lane', () => {
  const cards = initialCards()
  assert.equal(nextId(cards), 'BIL-161')
  const next = createCard(cards, { status: 'review' }, 'Refund receipts')
  const card = next.find(c => c.id === 'BIL-161')
  assert.equal(card.owner, null); assert.equal(card.title, 'Refund receipts')
  assert.deepEqual(ids(next, 'review'), ['BIL-119', 'BIL-124', 'BIL-161'])
  assert.deepEqual(laneIds(cards), people.map(p => p.id))
  assert.equal(laneIds(next).at(-1), null)
  assert.deepEqual(ids(createCard(cards, { status: 'done', owner: 'emma' }, 'x'), 'done', 'emma'), ['BIL-108', 'BIL-161'])
})

test('both languages cover every card, column, tag and note', () => {
  const keys = lang => Object.keys(copy[lang]).sort()
  assert.deepEqual(keys('zh'), keys('en'))
  for (const lang of ['en', 'zh']) {
    const t = copy[lang]
    for (const card of initialCards()) { assert.ok(t.cards[card.id], card.id); if (card.tag) assert.ok(t.tags[card.tag]) }
    for (const column of columns) assert.ok(t.columns[column.id])
    assert.equal(t.notes.length, 4)
    assert.deepEqual(Object.keys(t.announce).sort(), Object.keys(copy.en.announce).sort())
  }
  assert.equal(copy.en.date('09-26'), 'Sep 26')
  assert.equal(copy.zh.date('10-02'), '10 月 2 日')
})

test('page keeps attribution, implementation notes and the snippet anchors', () => {
  const html = readFileSync(new URL('../public/lab/kanban/index.html', import.meta.url), 'utf8')
  const script = readFileSync(new URL('../public/lab/kanban/script.js', import.meta.url), 'utf8')
  assert.ok(html.includes('https://x.com/eliakuratli/status/2109299245891416065'))
  for (let i = 0; i < 4; i++) assert.ok(html.includes(`id="note-title-${i}"`))
  for (const snippet of ['{ passive: false }', 'el.offsetTop + el.offsetHeight / 2', "1.6 + drag.vx * .45", 'moveBefore']) {
    assert.ok(html.includes(snippet), snippet)
    assert.ok(script.includes(snippet), `script still uses ${snippet}`)
  }
})
