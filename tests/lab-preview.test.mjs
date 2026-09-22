import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const { parse, compileScript } = require('@vue/compiler-sfc')
const { createSSRApp } = require('vue')
const { renderToString } = require('vue/server-renderer')
const ts = require('typescript')
const file = new URL('../components/LabExperimentPreview.vue', import.meta.url)
const { descriptor } = parse(readFileSync(file, 'utf8'))
const compiled = compileScript(descriptor, { id: 'lab-preview-test', inlineTemplate: true })
const { outputText } = ts.transpileModule(compiled.content, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
})
const exports = {}
vm.runInNewContext(outputText, { exports, require })

test('lab links render during SSR without teleporting into the document body', async () => {
  for (const slug of ['timeline', 'receipt', 'mascot', 'folding-card', 'live-numbers', 'color-drift']) {
    const context = {}
    const html = await renderToString(createSSRApp(exports.default, {
      zh: false, slug, title: slug, titleZh: slug, date: '2026-09-15',
      dateLabel: 'Sep 15, 2026', dateLabelZh: '2026 年 9 月 15 日',
    }), context)
    assert.ok(html.includes(`href="/lab/${slug}/"`))
    assert.equal(context.teleports?.body, undefined)
    assert.ok(!html.includes('<iframe'))
  }
})
