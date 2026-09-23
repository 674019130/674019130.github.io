<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import archive from '../data/weekly/issues.json'

const route = useRoute()
const router = useRouter()
const issues = archive.issues
const current = computed(() => issues.find(issue => issue.id === route.query.issue) || issues[0])
const zh = computed(() => route.query.lang !== 'en')
const visible = computed(() => current.value?.items.map(item => ({ ...item, text: zh.value ? item.change : item.change_en })) || [])
const playing = ref(false)
const revealed = ref(999)
const typed = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
let preference: MediaQueryList | undefined
const symbols: Record<string, string> = { added: '+', changed: '~', warning: '!', removed: '−', discovery: '↗' }
function stop() { clearInterval(timer); timer = undefined; playing.value = false; revealed.value = 999 }
function replay() {
  stop()
  if (preference?.matches || !visible.value.length) return
  revealed.value = 0
  typed.value = 0
  playing.value = true
  timer = setInterval(() => {
    const row = visible.value[revealed.value]
    if (!row) { stop(); return }
    typed.value += 1
    if (typed.value > Array.from(row.text).length + 7) {
      revealed.value += 1
      typed.value = 0
      if (revealed.value >= visible.value.length) stop()
    }
  }, 48)
}
function toggleLanguage() {
  stop()
  void router.replace({ query: { ...route.query, lang: zh.value ? 'en' : 'zh' } })
}
function visibility() { if (document.hidden) stop() }
onMounted(() => {
  preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', stop)
  document.addEventListener('visibilitychange', visibility)
  replay()
})
onBeforeUnmount(() => { stop(); preference?.removeEventListener('change', stop); document.removeEventListener('visibilitychange', visibility) })
watch([current, zh], stop)
function shownChange(text: string, index: number) {
  return playing.value && index === revealed.value ? Array.from(text).slice(0, typed.value).join('') : text
}
useHead(computed(() => ({ title: zh.value ? 'AI / Agents 周报' : 'This week in agents', htmlAttrs: { lang: zh.value ? 'zh-CN' : 'en' } })))
</script>

<template>
  <main class="portfolio-home weekly-page" :lang="zh ? 'zh-CN' : 'en'">
    <section v-if="current" class="weekly-frame" :aria-label="zh ? '本周 AI 变化' : 'This week in agents'">
      <header class="board-header">
        <h1>this week in agents</h1>
        <div class="board-meta"><span>{{ current.period_start.slice(5).replace('-', '.') }} — {{ current.period_end.slice(5).replace('-', '.') }}, {{ current.period_start.slice(0, 4) }}</span><button class="language" :aria-label="zh ? 'Switch to English' : '切换中文'" @click="toggleLanguage">{{ zh ? 'EN' : '中' }}</button></div>
      </header>
      <ol class="weekly-list">
        <li v-for="(item, index) in visible" :key="item.id" class="change-row" :class="[item.kind, { pending: playing && index > revealed }]">
          <span class="item-symbol" aria-hidden="true">{{ symbols[item.kind] || '~' }}</span>
          <a class="product" :href="item.url" target="_blank" rel="noopener noreferrer" :aria-label="`${item.product} — ${zh ? '原始来源' : 'original source'}`" @focus="stop">{{ item.product }}</a>
          <span class="change"><span class="change-measure">{{ item.text }}</span><span class="change-typed" aria-hidden="true">{{ shownChange(item.text, index) }}<span v-if="playing && index === revealed" class="cursor">▍</span></span></span>
        </li>
      </ol>
    </section>
    <p v-else class="weekly-frame">{{ zh ? '第一期正在整理。' : 'The first issue is on its way.' }}</p>
  </main>
</template>

<style scoped>
.weekly-page { --home-bg:#fff; --home-text:#1a1a1a; --home-muted:#6b6b6b; --accent:#366bb1; --added:#287b45; --warning:#946b0b; --removed:#bb4141; min-height:100svh; box-sizing:border-box; background:var(--home-bg); color:var(--home-text); padding:64px 24px; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,'PingFang SC',monospace; -webkit-font-smoothing:antialiased; }
:global(html.dark .weekly-page) { --home-bg:#181918; --home-text:#eceeec; --home-muted:#a4aaa5; --accent:#80b6ef; --added:#7bc58d; --warning:#d7b458; --removed:#ed8982; }
.weekly-frame { width:100%; max-width:538px; margin:auto; }
.board-header { display:flex; align-items:center; justify-content:space-between; gap:16px; font-size:11px; color:var(--home-muted); }
h1 { font-size:13px; color:var(--home-text); font-weight:600; margin:0; }
.board-meta { display:flex; align-items:center; gap:12px; }.language { background:none; border:0; padding:10px 0 10px 6px; color:var(--home-muted); font:inherit; cursor:pointer; }.language:hover { color:var(--home-text); }
.weekly-list { padding:0; margin:42px 0 0; list-style:none; }
.change-row { --semantic:var(--added); display:grid; grid-template-columns:14px 158px minmax(0,1fr); gap:12px; width:100%; text-align:left; font-size:13px; line-height:1.8; padding:8px 0; }.pending { visibility:hidden; }.changed { --semantic:var(--accent); }.warning,.discovery { --semantic:var(--warning); }.removed { --semantic:var(--removed); }
.item-symbol,.product { color:var(--semantic); }.product { overflow-wrap:anywhere; text-decoration:none; align-self:start; }.product:hover { text-decoration:underline; text-underline-offset:4px; }.change { color:var(--home-muted); position:relative; overflow-wrap:anywhere; }.change-measure { opacity:0; }.change-typed { position:absolute; inset:0; }.cursor { color:var(--home-text); margin-left:1px; }
a:focus-visible,button:focus-visible { outline:2px solid var(--accent); outline-offset:4px; }
@media(max-width:600px) { .weekly-page { padding:36px 24px 48px; }.board-header { align-items:flex-start; flex-wrap:wrap; row-gap:6px; }h1 { font-size:12px; padding-top:10px; }.board-meta { font-size:10px; }.change-row { grid-template-columns:12px 120px minmax(0,1fr); gap:8px; font-size:11px; }.weekly-list { margin-top:32px; } }
@media(max-width:360px) { .change-row { grid-template-columns:12px 102px minmax(0,1fr); } }
@media(prefers-reduced-motion:reduce) { .pending { visibility:visible; } }
</style>
