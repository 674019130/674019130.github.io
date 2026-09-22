import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { assets, quoteSnapshot, priceText } from '../public/lab/live-numbers/model.js'

function harness(reduced = false) {
  const nodes = new Map(), intervals = new Map(), events = {}, windowEvents = {}
  let id = 0, animationCount = 0
  function node() { return { textContent: '', checked: true, dataset: {}, attrs: {}, listeners: {}, children: [],
    append(...n) { this.children.push(...n) }, replaceChildren() { this.children = [] }, remove() {},
    setAttribute(k,v) { this.attrs[k] = v }, getAttribute(k) { return this.attrs[k] },
    addEventListener(k,fn) { this.listeners[k] = fn },
    animate() { animationCount++; return { cancel() {}, finished: new Promise(() => {}) } },
  } }
  const get = key => { if (!nodes.has(key)) nodes.set(key,node()); return nodes.get(key) }
  const buttons = ['live','hour','day','week'].map(range => { const b=node(); b.dataset.range=range; return b })
  const document = { hidden: false, documentElement: node(), querySelector: get, querySelectorAll: () => buttons, createElement: node, addEventListener(k,fn) { events[k]=fn } }
  const source = readFileSync(new URL('../public/lab/live-numbers/script.js',import.meta.url),'utf8').replace(/^import .*;$/m,'')
  vm.runInNewContext(source, { assets,quoteSnapshot,priceText,document,location:{ search:'' }, URLSearchParams, matchMedia:()=>({matches:reduced,addEventListener(){}}), window:{addEventListener(k,fn){windowEvents[k]=fn}}, setInterval(fn){intervals.set(++id,fn);return id}, clearInterval(i){intervals.delete(i)} })
  return { get, buttons, document, events, intervals, windowEvents, animations:()=>animationCount, step(){ [...intervals.values()].forEach(fn=>fn()) } }
}
test('snapshots are repeatable and prices retain their required precision',()=>{
  assert.deepEqual(quoteSnapshot('week',0),quoteSnapshot('week',999))
  assert.equal(priceText(.6101),'$0.6101'); assert.equal(priceText(65873.7),'$65,873.70')
  for(const range of ['live','hour','day','week']) for(const q of quoteSnapshot(range,40)) assert.ok(q.price>0 && Number.isFinite(q.change))
})
test('pause, range switching and visibility preserve a single live timer',()=>{
  const h=harness(); assert.equal(h.intervals.size,1)
  h.get('#pause').listeners.click(); assert.equal(h.intervals.size,0)
  h.buttons[3].listeners.click(); assert.equal(h.intervals.size,0)
  h.buttons[0].listeners.click(); assert.equal(h.intervals.size,0)
  h.get('#pause').listeners.click(); assert.equal(h.intervals.size,1)
  h.document.hidden=true;h.events.visibilitychange();assert.equal(h.intervals.size,0)
  h.document.hidden=false;h.events.visibilitychange();assert.equal(h.intervals.size,1)
  h.windowEvents.pagehide();assert.equal(h.intervals.size,0)
})
test('reduced motion and animation opt-out update values without creating animations',()=>{
  const h=harness(true);h.step();h.buttons[3].listeners.click();assert.equal(h.animations(),0)
  const standard=harness();standard.step();assert.ok(standard.animations()>0)
  standard.get('#animate').checked=false;standard.get('#animate').listeners.change()
  const count=standard.animations();standard.step();assert.equal(standard.animations(),count)
})
