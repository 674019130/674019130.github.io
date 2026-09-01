import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const activity = JSON.parse(await readFile(new URL('../data/activity.json', import.meta.url), 'utf8'))
const tokenActivity = JSON.parse(await readFile(new URL('../data/token-activity.json', import.meta.url), 'utf8'))

test('activity snapshot has a stable, privacy-safe shape', () => {
  assert.ok(['github', 'tokdash'].includes(activity.source))
  assert.match(activity.period.from, /^\d{4}-\d{2}-\d{2}$/)
  assert.match(activity.period.to, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(Array.isArray(activity.days))
  assert.ok(activity.days.length > 0)

  const dates = activity.days.map(day => day.date)
  assert.equal(new Set(dates).size, dates.length)
  assert.deepEqual(dates, [...dates].sort())

  for (const day of activity.days) {
    const allowedKeys = activity.source === 'github'
      ? ['count', 'date', 'level']
      : ['date', 'level']
    assert.deepEqual(Object.keys(day).sort(), allowedKeys)
    assert.match(day.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(Number.isInteger(day.level) && day.level >= 0 && day.level <= 4)
  }
})

test('token activity exposes aggregate stats without daily token totals', () => {
  assert.equal(tokenActivity.source, 'tokdash')
  assert.match(tokenActivity.period.from, /^\d{4}-\d{2}-\d{2}$/)
  assert.match(tokenActivity.period.to, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(Array.isArray(tokenActivity.days))
  assert.deepEqual(Object.keys(tokenActivity.summary).sort(), [
    'activeDays',
    'averageTokensPerActiveDay',
    'totalTokens',
  ])
  assert.ok(Number.isFinite(tokenActivity.summary.totalTokens) && tokenActivity.summary.totalTokens >= 0)
  assert.ok(Number.isFinite(tokenActivity.summary.averageTokensPerActiveDay) && tokenActivity.summary.averageTokensPerActiveDay >= 0)

  for (const day of tokenActivity.days) {
    assert.deepEqual(Object.keys(day).sort(), ['date', 'level'])
    assert.match(day.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(Number.isInteger(day.level) && day.level >= 1 && day.level <= 5)
  }
})
