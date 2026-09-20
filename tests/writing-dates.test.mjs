import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const dates = JSON.parse(await readFile(new URL('../data/writing-dates.json', import.meta.url), 'utf8'))

test('latest writing has explicit dates for both Jev languages', () => {
  assert.equal(dates['/posts/jev-first-look-en'], '2026-09-20 18:00:00')
  assert.equal(dates['/posts/jev-first-look-zh'], dates['/posts/jev-first-look-en'])
})

test('undated and commented-date legacy posts cannot become new posts on deploy', () => {
  assert.equal(dates['/posts/关于代码规范的一些粗浅想法'], undefined)
  assert.equal(dates['/posts/DSPy 0x01'], undefined)
})

test('publication index contains only public routes and stable date strings', () => {
  for (const [path, date] of Object.entries(dates)) {
    assert.ok(path.startsWith('/posts/'))
    assert.ok(Number.isFinite(Date.parse(date.replace(' ', 'T'))))
  }
})
