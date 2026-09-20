import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

async function fixture(reduce = false) {
  const text = readFileSync(new URL('../components/CloudBackground.vue', import.meta.url), 'utf8')
  const script = text.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*$/gm, '').replace(/^withDefaults.*$/gm, '')
  const mounted = [], cleanup = [], listeners = new Map()
  const media = { matches: reduce, addEventListener: (k, fn) => listeners.set(`media:${k}`, fn), removeEventListener: k => listeners.delete(`media:${k}`) }
  const document = { hidden: false, addEventListener: (k, fn) => listeners.set(k, fn), removeEventListener: k => listeners.delete(k) }
  const runtime = { ref: value => ({ value }), nextTick: async () => {}, watch: () => {}, onMounted: fn => mounted.push(fn), onBeforeUnmount: fn => cleanup.push(fn), matchMedia: () => media, document }
  const code = ts.transpileModule(script + '\n;globalThis.state={video,paused,source,sync};', { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText
  vm.runInNewContext(code, runtime)
  let plays = 0, pauses = 0
  const player = { playbackRate: 1, play: () => { plays++; return Promise.resolve() }, pause: () => { pauses++ } }
  runtime.state.video.value = player
  mounted.forEach(fn => fn())
  await runtime.state.sync()
  return { ...runtime.state, document, player, listeners, cleanup, media, count: () => ({ plays, pauses }) }
}

test('cloud video starts slowly and pauses when the page is hidden', async () => {
  const f = await fixture()
  assert.equal(f.player.playbackRate, 0.7)
  assert.match(f.source.value, /background.mp4$/)
  const before = f.count()
  f.document.hidden = true
  await f.listeners.get('visibilitychange')()
  assert.equal(f.count().plays, before.plays)
  assert.ok(f.count().pauses > before.pauses)
})
test('reduced motion loads no video until the visitor explicitly plays it', async () => {
  const f = await fixture(true)
  assert.equal(f.source.value, undefined)
  assert.equal(f.count().plays, 0)
  f.paused.value = false
  await f.sync()
  assert.ok(f.count().plays > 0)
})
test('manual pause survives visibility changes and listeners are removed on exit', async () => {
  const f = await fixture()
  f.paused.value = true
  const before = f.count().plays
  f.document.hidden = false
  await f.listeners.get('visibilitychange')()
  assert.equal(f.count().plays, before)
  f.cleanup.forEach(fn => fn())
  assert.equal(f.listeners.size, 0)
})
