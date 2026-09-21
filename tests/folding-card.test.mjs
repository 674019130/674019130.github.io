import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

function harness(reduced = false) {
  const elements = new Map(), callbacks = new Map(), windows = {}, documents = {}
  let now = 0, id = 0
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      value: '0', textContent: '', attributes: {}, listeners: {}, inert: false, offsetWidth: 440,
      dataset: {}, getBoundingClientRect() { return { left: 0, top: 0, width: 440, height: 430 } },
      style: { values: {}, setProperty(k, v) { this.values[k] = v } }, classList: { add() {}, remove() {} },
      setAttribute(k, v) { this.attributes[k] = v },
      addEventListener(k, fn) { this.listeners[k] = fn },
      setPointerCapture() {}, hasPointerCapture() { return true }, releasePointerCapture() {}, focus() {},
    })
    return elements.get(selector)
  }
  vm.runInNewContext(readFileSync(new URL('../public/lab/folding-card/script.js', import.meta.url), 'utf8'), {
    document: { querySelector: element, addEventListener(k, fn) { documents[k] = fn } },
    window: { addEventListener(k, fn) { windows[k] = fn } },
    preview: false, isStill: () => reduced, motionQuery: { addEventListener() {} },
    requestAnimationFrame(fn) { callbacks.set(++id, fn); return id }, cancelAnimationFrame(i) { callbacks.delete(i) },
    setTimeout, clearTimeout,
  })
  return { element, windows, click: s => element(s).listeners.click(),
    advance(ms) { for (let t = 0; t < ms; t += 16) { now += 16; const pending = [...callbacks.values()]; callbacks.clear(); pending.forEach(fn => fn(now)) } },
  }
}

test('folding animation reverses from its current position and settles closed', () => {
  const h = harness(); h.click('#toggle'); h.advance(160)
  assert.ok(Number(h.element('#fold').value) > 0 && Number(h.element('#fold').value) < 180)
  h.click('#toggle'); h.advance(1800)
  assert.equal(h.element('#fold').value, '0')
  assert.equal(h.element('#inside').inert, true)
})

test('still mode has immediate endpoints, correct hidden faces and escape reset', () => {
  const h = harness(true); h.click('#toggle')
  assert.equal(h.element('#fold').value, '180')
  assert.equal(h.element('#inside').inert, false)
  assert.equal(h.element('.cover').attributes['aria-hidden'], 'true')
  h.windows.keydown({ key: 'Escape' })
  assert.equal(h.element('#fold').value, '0')
  assert.equal(h.element('#inside').inert, true)
})

test('slider preserves partial angle and reset cancels it', () => {
  const h = harness(); h.element('#fold').value = '90'; h.element('#fold').listeners.input()
  assert.equal(h.element('#amount').value, '90°')
  assert.equal(h.element('#inside').inert, true)
  h.click('#reset'); h.advance(1800)
  assert.equal(h.element('#fold').value, '0')
})

test('cancelled horizontal drag settles safely and contact link does not start a drag', () => {
  const h = harness(true), book = h.element('#book')
  const event = { button: 0, pointerId: 1, clientX: 220, clientY: 0, target: { closest() { return null } } }
  book.listeners.pointerdown(event)
  book.listeners.pointermove({ ...event, clientX: 50 })
  book.listeners.pointercancel({ ...event, type: 'pointercancel' })
  assert.equal(h.element('#fold').value, '180')
  book.listeners.pointerdown({ ...event, target: { closest() { return {} } } })
  book.listeners.pointerup({ ...event, type: 'pointerup' })
  assert.equal(h.element('#fold').value, '180')
})


test('Duo handoff blurs mid-fold but returns sharp endpoint content', () => {
  const h = harness(), slider = h.element('#fold'), style = h.element('#book').style.values
  slider.value = '90'; slider.listeners.input()
  assert.equal(style['--blur'], '9px')
  assert.equal(style['--cover-opacity'], '0')
  assert.ok(Number(style['--base-opacity']) > 0)
  slider.value = '180'; slider.listeners.input()
  assert.ok(parseFloat(style['--blur']) < .001)
  assert.equal(style['--base-opacity'], '1')
})

test('pointer light persists while parked and responds to the hinge normal', () => {
  const h = harness(), stage = h.element('#stage'), leaf = h.element('#leaf')
  stage.listeners.pointermove({ clientX: 420, clientY: 90 }); h.advance(16)
  const first = leaf.style.values['--light-x']
  h.advance(1000)
  assert.equal(leaf.style.values['--light-x'], first)
  stage.listeners.pointermove({ clientX: 20, clientY: 330 }); h.advance(16)
  assert.notEqual(leaf.style.values['--light-x'], first)
  const moved = leaf.style.values['--light-x']
  h.element('#fold').value = '125'; h.element('#fold').listeners.input()
  assert.notEqual(leaf.style.values['--light-x'], moved)
  h.click('#finish')
  assert.equal(h.element('#book').dataset.foil, 'false')
})
