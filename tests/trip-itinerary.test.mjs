import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ORDER, N, APP_H, COLLAPSED, GAP, HEIGHTS, offset, cardTop, step } from '../public/lab/trip-itinerary/model.js'

const F = ORDER.indexOf('flight')

test('the deck is cyclic: the trip photo sits below flight and above budget', () => {
  const trip = ORDER.indexOf('trip'), budget = ORDER.indexOf('budget')
  assert.equal(offset(trip, F), 1, 'trip renders below flight')
  assert.equal(offset(trip, ORDER.indexOf('budget')), -1, 'trip renders above budget')
})

test('the focused card is centered and expanded; only its neighbours peek', () => {
  for (const key of ORDER) {
    const f = ORDER.indexOf(key)
    const top = cardTop(f, f)
    assert.ok(top > 0 && top + HEIGHTS[key] < APP_H, `${key} fits the panel`)
    for (let j = 0; j < N; j++) {
      const d = offset(j, f)
      const y = cardTop(j, f)
      if (d === -1) assert.ok(y >= 0 && y < top, `${key}: card above peeks inside`)
      if (d === 1) assert.ok(y > top && y < APP_H, `${key}: card below peeks inside`)
      // |d| >= 2 cards render at opacity 0 (.far) regardless of position,
      // so only ±1 ever peeks — checked structurally, not geometrically.
      if (Math.abs(d) >= 2) assert.ok(Math.abs(d) <= 3, `${key}: cyclic distance bounded`)
    }
  }
})

test('stepping up the stack replays the video order and wraps at the top', () => {
  let f = ORDER.indexOf('flight')
  const seen = []
  for (let i = 0; i < N; i++) { seen.push(ORDER[f]); f = step(f, -1) }
  assert.deepEqual(seen, ['flight', 'route', 'stays', 'dining', 'budget', 'trip'])
  assert.equal(step(ORDER.indexOf('trip'), -1), F, 'wraps back to flight')
})

test('neighbours chase the growing card: gaps stay constant', () => {
  for (const key of ORDER) {
    const f = ORDER.indexOf(key)
    const above = cardTop(step(f, -1), f)
    const below = cardTop(step(f, 1), f)
    assert.equal(cardTop(f, f) - GAP - COLLAPSED, above, `${key}: peek above is flush`)
    assert.equal(cardTop(f, f) + HEIGHTS[key] + GAP, below, `${key}: peek below is flush`)
  }
})
