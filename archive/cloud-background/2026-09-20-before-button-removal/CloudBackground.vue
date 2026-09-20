<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
withDefaults(defineProps<{ page?: 'home' | 'about' | 'archives' }>(), { page: 'home' })
const source = ref<string>()
const video = ref<HTMLVideoElement>()
const paused = ref(false)
let reduced: MediaQueryList | undefined
async function sync() {
  if (!video.value) return
  if (!paused.value && !source.value) {
    source.value = '/media/clouds/background.mp4'
    await nextTick()
    if (!video.value) return
  }
  video.value.playbackRate = 0.7
  if (paused.value || document.hidden) video.value.pause()
  else video.value.play().catch((error: DOMException) => {
    if (error.name !== 'AbortError') paused.value = true
  })
}
function motionChanged() {
  paused.value = reduced?.matches ?? false
  sync()
}
onMounted(() => {
  reduced = matchMedia('(prefers-reduced-motion: reduce)')
  paused.value = reduced.matches
  reduced.addEventListener('change', motionChanged)
  document.addEventListener('visibilitychange', sync)
  sync()
})
onBeforeUnmount(() => {
  reduced?.removeEventListener('change', motionChanged)
  document.removeEventListener('visibilitychange', sync)
})
watch(paused, sync)
</script>

<template>
  <div class="cloud-background" :data-page="page">
    <div class="cloud-backdrop" aria-hidden="true">
      <video ref="video" muted loop playsinline preload="metadata" poster="/media/clouds/poster.webp" :src="source" @loadedmetadata="sync" @error="paused = true">
      </video>
      <div class="cloud-veil" />
    </div>
    <div class="cloud-content"><slot><LetterHome /></slot></div>
    <button class="cloud-motion" type="button" :aria-pressed="paused" @click="paused = !paused">
      {{ paused ? '播放背景' : '暂停背景' }}
    </button>
  </div>
</template>

<style scoped>
.cloud-background { position: relative; isolation: isolate; }
.cloud-content { position: relative; z-index: 1; }
.cloud-backdrop { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: #a7c4ce; }
.cloud-backdrop video { width: 100%; height: 100%; object-fit: cover; }
.cloud-veil { position: absolute; inset: 0; background: rgb(255 255 255 / 66%); transition: background 250ms; }
.cloud-background :deep(.letter-home) { position: relative; z-index: 1; background: transparent; padding-bottom: 100px; --home-muted: #394b52; --home-text: #172d38; }
.cloud-background :deep(.letter-arrival) { animation: none; opacity: 1; transform: none; }
.cloud-motion { position: fixed; left: max(16px, env(safe-area-inset-left)); bottom: max(16px, env(safe-area-inset-bottom)); z-index: 10; border: 1px solid #d6dfe1; border-radius: 8px; padding: 8px 12px; background: #ffffffed; color: #394b52; font: 12px/1.4 system-ui; cursor: pointer; }
.cloud-motion:hover { background: #fff; }
.cloud-motion:focus-visible { outline: 2px solid #4a5b96; outline-offset: 3px; }
:global(html.dark .cloud-background .cloud-veil) { background: rgb(18 27 34 / 78%); }
:global(html.dark .cloud-background .letter-home) { --home-muted: #dae4e8; --home-text: #f3f6f7; }
.cloud-background[data-page='archives'] .cloud-veil { background: rgb(255 255 255 / 84%); }
.cloud-background[data-page='about'] .cloud-veil { background: rgb(255 255 255 / 72%); }
.cloud-background[data-page='archives'] :deep(.post-item) { opacity: 1 !important; transform: none !important; }
.cloud-background[data-page='archives'] :deep(.animate-fade-in) { animation: none; opacity: 1; }
.cloud-background:not([data-page='home']) { padding-bottom: 90px; }
.cloud-background:not([data-page='home']) :deep(.yun-card) { background: rgb(255 255 255 / 48%); box-shadow: none; }
:global(body:has(.cloud-background:not([data-page='home'])) .yun-bg),
:global(body:has(.cloud-background:not([data-page='home'])) .yun-page-header-gradient) { display: none; }
:global(html.dark .cloud-background[data-page='about'] .cloud-veil) { background: rgb(18 27 34 / 82%); }
:global(html.dark .cloud-background[data-page='archives'] .cloud-veil) { background: rgb(18 27 34 / 90%); }
:global(html.dark .cloud-background:not([data-page='home']) .yun-card) { background: rgb(24 25 24 / 55%); }
@media (prefers-reduced-motion: reduce) { .cloud-veil { transition: none; } }
</style>
