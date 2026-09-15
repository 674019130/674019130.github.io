import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'

function harness(slug, reduced = false) {
  let now = 0
  let id = 0
  const timers = new Map()
  const elements = new Map()
  function element(key) {
    if (!elements.has(key)) elements.set(key, {
      dataset: {}, attributes: {}, listeners: {}, offsetWidth: 1,
      setAttribute(name, value) { this.attributes[name] = value },
      toggleAttribute(name, enabled) { if (enabled) this.attributes[name] = ''; else delete this.attributes[name] },
      addEventListener(name, fn) { this.listeners[name] = fn },
    })
    return elements.get(key)
  }
  const moods = ['idle', 'thinking', 'happy', 'proud', 'sleepy'].map(mood => {
    const el = element(mood); el.dataset.mood = mood; return el
  })
  element('#mascot').dataset.mood = 'idle'
  element('#printer').dataset.state = 'idle'
  const schedule = (fn, delay) => { timers.set(++id, { at: now + delay, fn }); return id }
  const context = {
    document: { querySelector: element, querySelectorAll: selector => selector.includes('data-mood') ? moods : [] },
    preview: false, isStill: () => reduced,
    motionQuery: { addEventListener() {} }, window: { addEventListener() {} },
    setTimeout: schedule, clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => schedule(fn, 16), cancelAnimationFrame: id => timers.delete(id),
  }
  vm.runInNewContext(readFileSync(new URL(`../public/lab/${slug}/script.js`, import.meta.url), 'utf8'), context)
  return {
    element,
    click: selector => element(selector).listeners.click(),
    advance(ms) {
      const end = now + ms
      while (true) {
        const entry = [...timers].sort((a, b) => a[1].at - b[1].at).find(([, timer]) => timer.at <= end)
        if (!entry) break
        timers.delete(entry[0]); now = entry[1].at; entry[1].fn()
      }
      now = end
    },
  }
}

test('receipt reset cancels pending completion and printing can restart', () => {
  const h = harness('receipt')
  h.click('#print'); h.advance(500); h.click('#reset'); h.advance(3000)
  assert.equal(h.element('#printer').dataset.state, 'idle')
  h.click('#print'); h.advance(2550)
  assert.equal(h.element('#printer').dataset.state, 'printed')
  assert.equal(h.element('#print').disabled, false)
})

test('reduced-motion receipt becomes printed without the feed delay', () => {
  const h = harness('receipt', true)
  h.click('#print')
  assert.equal(h.element('#printer').dataset.state, 'printed')
})

test('manual mood selection interrupts the sequence without stale mood changes', () => {
  const h = harness('mascot')
  h.click('#play'); h.advance(2000)
  assert.equal(h.element('#mascot').dataset.mood, 'thinking')
  h.click('proud'); h.advance(15000)
  assert.equal(h.element('#mascot').dataset.mood, 'proud')
  h.click('#reset')
  assert.equal(h.element('#mascot').dataset.mood, 'idle')
})
