<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ zh: boolean }>()
const link = ref<HTMLAnchorElement>()
const open = ref(false)
const source = ref('')
const x = ref(0)
const y = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
let keyboard = false
let suppressed = false
const width = 336
const height = 224

function position(px: number, py: number) {
  x.value = Math.max(12, Math.min(window.innerWidth - width - 12, px + width + 30 < window.innerWidth ? px + 18 : px - width - 18))
  y.value = Math.max(12, Math.min(window.innerHeight - height - 12, py + height + 26 < window.innerHeight ? py + 14 : py - height - 14))
}
function show() {
  if (open.value || timer || suppressed) return
  timer = setTimeout(() => {
    timer = undefined
    const dark = document.documentElement.classList.contains('dark')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    source.value = `/lab/timeline/?preview=1&theme=${dark ? 'dark' : 'light'}${still ? '&still=1' : ''}`
    open.value = true
  }, 70)
}
function move(event: PointerEvent) {
  if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
  keyboard = false
  position(event.clientX, event.clientY)
  show()
}
function close() {
  if (timer) clearTimeout(timer)
  timer = undefined
  open.value = false
}
function leave() {
  suppressed = false
  if (!keyboard) close()
}
function focus() {
  if (!link.value?.matches(':focus-visible')) return
  keyboard = true
  suppressed = false
  const box = link.value.getBoundingClientRect()
  position(box.left + 20, box.bottom)
  show()
}
function dismiss(event: KeyboardEvent) {
  if (event.key === 'Escape') { suppressed = true; close() }
}
onMounted(() => {
  window.addEventListener('scroll', close, { passive: true, capture: true })
  window.addEventListener('resize', close)
  window.addEventListener('keydown', dismiss)
})
onBeforeUnmount(() => {
  close()
  window.removeEventListener('scroll', close, true)
  window.removeEventListener('resize', close)
  window.removeEventListener('keydown', dismiss)
})
</script>

<template>
  <a ref="link" class="experiment-row" href="/lab/timeline/" @pointermove="move" @pointerleave="leave" @focus="focus" @blur="close" @click="close">
    <span>{{ props.zh ? '流式时间线' : 'Streaming timeline' }}</span>
    <span class="row-rule" aria-hidden="true" />
    <time datetime="2026-09-14">{{ props.zh ? '2026 年 9 月 14 日' : 'Sep 14, 2026' }}</time>
    <span class="row-arrow" aria-hidden="true">↗</span>
  </a>
  <Teleport to="body">
    <div v-if="open" class="timeline-hover-preview" :style="{ left: `${x}px`, top: `${y}px` }" aria-hidden="true" inert>
      <iframe :src="source" title="Timeline motion preview" tabindex="-1" scrolling="no" />
    </div>
  </Teleport>
</template>

<style scoped>
.experiment-row { display: flex; align-items: center; gap: 16px; padding: 16px 12px; margin: 0 -12px; color: var(--home-text); text-decoration: none; border-radius: 6px; transition: background 160ms; }
.experiment-row:hover, .experiment-row:focus-visible { background: var(--home-rule); }
.experiment-row:focus-visible { outline: 2px solid #7181a5; outline-offset: 3px; }
.row-rule { flex: 1; height: 1px; background: var(--home-rule); min-width: 12px; }
time { font-size: 11px; color: var(--home-muted); white-space: nowrap; }
.row-arrow { color: var(--home-muted); font-size: 12px; }
.timeline-hover-preview { position: fixed; width: 336px; height: 224px; max-width: calc(100vw - 24px); overflow: hidden; border-radius: 8px; border: 1px solid #d8dadd; background: #fff; box-shadow: 0 12px 40px #0002; pointer-events: none; z-index: 50; animation: preview-in 180ms ease-out; }
:global(html.dark) .timeline-hover-preview { border-color: #414441; background: #202220; }
iframe { width: 600px; height: 400px; border: 0; transform: scale(.56); transform-origin: top left; display: block; pointer-events: none; }
@keyframes preview-in { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
@media (max-width: 420px) { .experiment-row { gap: 10px; } time { font-size: 10px; } }
@media (prefers-reduced-motion: reduce) { .timeline-hover-preview { animation: none; } .experiment-row { transition: none; } }
</style>
