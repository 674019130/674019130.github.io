import { test } from 'node:test'
import assert from 'node:assert/strict'
import { R, C, GAP, TAU, mod, homeAt, topFor, wrapTop, railTheta, stampDistances, dashOffset, glyphOnBall, splatter, copiesInView, pointAt, remapY } from '../public/lab/overflow/model.js'
import { copy } from '../public/lab/overflow/content.js'

const g = { w: 640, h: 520, railX: 36, railTop: 24, railEnd: 1464, contentEnd: 1500, L: 1500 + 884, amp: 170 }
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`)

test('in the text the ball runs the whole rail, from the top of the frame to the bottom', () => {
  const start = homeAt(0, g), end = homeAt(g.contentEnd - g.h, g)
  assert.equal(start.zone, 'read')
  near(start.y, g.railTop); near(start.sy, g.railTop)
  near(end.y, g.railEnd); near(end.sy, g.h - (g.contentEnd - g.railEnd))
  assert.equal(start.x, g.railX)
})

test('the void path is continuous at both ends and keeps moving down the paper', () => {
  const edge = g.contentEnd - g.h
  near(homeAt(edge + 1e-9, g).sy, homeAt(edge, g).sy, 1e-3)
  near(homeAt(edge + 1e-9, g).x, g.railX, 1e-3)
  const arrive = homeAt(g.L, g)
  near(arrive.sy, g.railTop); near(arrive.x, g.railX)
  // after wrapping, the next lap starts exactly where the void ended
  near(homeAt(0, g).sy, arrive.sy)
  let prev = -Infinity
  for (let top = edge; top <= g.L; top += 4) {
    const h = homeAt(top, g)
    assert.ok(h.y > prev, `content y increases at ${top}`)
    assert.ok(h.x >= g.railX - 1e-9 && h.x <= g.railX + g.amp + 1e-9)
    prev = h.y
  }
})

test('topFor inverts homeAt in both zones, so a relayout keeps the place', () => {
  for (const t of [0, 0.25, 0.8, 1]) {
    near(homeAt(topFor('read', t, g), g).p, t)
    if (t > 0) near(homeAt(topFor('void', t, g), g).q, t)
  }
})

test('wrapping removes whole laps only', () => {
  assert.deepEqual(wrapTop(100, g.L), { top: 100, laps: 0 })
  assert.deepEqual(wrapTop(g.L + 40, g.L), { top: 40, laps: 1 })
  assert.deepEqual(wrapTop(g.L * 2, g.L), { top: 0, laps: 2 })
})

test('stamps are one circumference apart, where the mark faces the paper', () => {
  for (const theta0 of [0, 1, Math.PI, 5.9]) {
    const s = stampDistances(theta0, 1000)
    assert.ok(s.length >= 11)
    s.slice(1).forEach((d, i) => near(d - s[i], C))
    for (const d of s) near(mod(theta0 + d / R, TAU), Math.PI, 1e-9)
  }
  // rolling the rail back to a stamp finds the mark underneath again
  const phase = 0.7, y = g.railTop + stampDistances(phase, 2000)[3]
  near(Math.cos(railTheta(y, g, phase)), -1)
})

test('the dash gap is centred on every stamp', () => {
  for (const theta0 of [0, 2.2, 4]) {
    const offset = dashOffset(theta0)
    for (const s of stampDistances(theta0, 600)) {
      const at = mod(s + offset, C)
      near(at, C - GAP / 2, 1e-9)
    }
  }
})

test('the mark is visible on top, hidden underneath, and moves with the roll', () => {
  const down = { x: 0, y: 1 }
  assert.equal(glyphOnBall(0, down).visible, true)
  near(glyphOnBall(0, down).oy, 0)
  assert.equal(glyphOnBall(Math.PI, down).visible, false)
  assert.ok(glyphOnBall(0.6, down).oy > 0, 'rolling forward carries the mark forward')
  assert.ok(glyphOnBall(-0.6, down).oy < 0)
})

test('drops only appear on a hard flick and stay sparse', () => {
  assert.deepEqual(splatter(1, () => 0), [])
  let n = 0
  for (let i = 0; i < 200; i++) n += splatter(4).length
  assert.ok(n > 0 && n <= 400)
  for (const d of splatter(5, () => 0)) assert.ok(Math.abs(d.across) >= 8 && d.r <= 2.8)
})

test('ink is drawn at every copy of the page that is in view', () => {
  assert.deepEqual(copiesInView(30, 400, 0, 520, g.L), [0])
  // near the end of a lap the copy of the top of the page is visible one L below
  assert.deepEqual(copiesInView(30, 400, g.L - 200, 520, g.L), [1])
  // the tail of the void path shows above, at the top of the next lap
  assert.deepEqual(copiesInView(g.L + 10, g.L + 30, 0, 520, g.L), [-1])
})

test('hand-drawn ink stays over the same paragraph after a relayout', () => {
  const to = { ...g, contentEnd: 1200, L: 1200 + 884 }
  near(remapY(750, g, to), 600)
  near(remapY(g.contentEnd + 100, g, to), to.contentEnd + 100)
  near(remapY(-g.L + 750, g, to), -to.L + 600)
  near(remapY(remapY(900, g, to), to, g), 900)
})

test('pointAt interpolates along arc length', () => {
  const pts = [{ x: 0, y: 0, s: 0 }, { x: 0, y: 10, s: 10 }, { x: 10, y: 10, s: 20 }]
  assert.deepEqual(pointAt(pts, 5), { x: 0, y: 5, a: Math.PI / 2 })
  const p = pointAt(pts, 15)
  near(p.x, 5); near(p.y, 10); near(p.a, 0)
})

test('both languages cover the same copy, with the same sections and notes', () => {
  const keys = o => Object.keys(o).sort()
  assert.deepEqual(keys(copy.en), keys(copy.zh))
  assert.deepEqual(keys(copy.en.announce), keys(copy.zh.announce))
  assert.equal(copy.en.article.sections.length, copy.zh.article.sections.length)
  assert.equal(copy.en.notes.length, 4)
  assert.equal(copy.zh.notes.length, 4)
  for (const lang of ['en', 'zh']) {
    assert.ok(!JSON.stringify(copy[lang]).includes(' · '), `${lang} copy uses no middle dot separators`)
    assert.ok(copy[lang].article.lap(2).includes('2'))
  }
})
