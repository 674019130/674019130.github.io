<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
withDefaults(defineProps<{ page?: 'home' | 'about' | 'archives' }>(), { page: 'home' })
const mode = ref('soft')
const video = ref<HTMLVideoElement>()
const paused = ref(false)
let reduced: MediaQueryList | undefined
function sync() {
  if (!video.value) return
  video.value.playbackRate = 0.7
  if (paused.value || mode.value === 'off' || document.hidden || reduced?.matches) video.value.pause()
  else video.value.play().catch(() => { paused.value = true })
}
onMounted(() => {
  reduced = matchMedia('(prefers-reduced-motion: reduce)')
  paused.value = reduced.matches
  reduced.addEventListener('change', sync)
  document.addEventListener('visibilitychange', sync)
  sync()
})
onBeforeUnmount(() => {
  reduced?.removeEventListener('change', sync)
  document.removeEventListener('visibilitychange', sync)
})
watch([mode, paused], sync)
</script>

<template>
  <div class="cloud-preview" :data-mode="mode" :data-page="page">
    <div class="cloud-backdrop" aria-hidden="true">
      <video ref="video" muted loop playsinline preload="auto" poster="/preview-cloud/poster.jpeg" @loadedmetadata="sync">
        <source src="/preview-cloud/background.mp4" type="video/mp4">
      </video>
      <div class="cloud-veil" />
    </div>
    <div class="cloud-content"><slot><LetterHome /></slot></div>
    <aside class="cloud-controls" aria-label="背景预览设置">
      <nav aria-label="预览页面">
        <RouterLink v-for="item in [{ path: '/', label: '首页' }, { path: '/about/', label: '关于' }, { path: '/archives/', label: '归档' }]" :key="item.path" :to="{ path: item.path, query: { background: 'clouds' } }">{{ item.label }}</RouterLink>
      </nav>
      <button v-for="item in [{ id: 'soft', label: '柔和' }, { id: 'raw', label: '原视频' }, { id: 'off', label: '无背景' }]" :key="item.id" :aria-pressed="mode === item.id" @click="mode = item.id">{{ item.label }}</button>
      <button :disabled="mode === 'off'" :aria-pressed="paused" @click="paused = !paused">{{ paused ? '播放' : '暂停' }}</button>
    </aside>
  </div>
</template>

<style scoped>
.cloud-preview { position: relative; isolation: isolate; }
.cloud-content { position: relative; z-index: 1; }
.cloud-backdrop { position: fixed; inset: 0; z-index: 0; pointer-events: none; background: #a7c4ce; }
.cloud-backdrop video { width: 100%; height: 100%; object-fit: cover; }
.cloud-veil { position: absolute; inset: 0; background: rgb(255 255 255 / 66%); transition: background 250ms; }
.cloud-preview :deep(.letter-home) { position: relative; z-index: 1; background: transparent; padding-bottom: 100px; --home-muted: #394b52; --home-text: #172d38; }
.cloud-preview[data-mode='raw'] .cloud-veil { background: rgb(255 255 255 / 18%); }
.cloud-preview[data-mode='off'] .cloud-backdrop { visibility: hidden; }
.cloud-preview[data-mode='off'] :deep(.letter-home) { background: var(--home-bg); }
.cloud-preview :deep(.letter-arrival) { animation: none; opacity: 1; transform: none; }
.cloud-controls { position: fixed; z-index: 10; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 4px; padding: 6px; border: 1px solid #d6dfe1; border-radius: 12px; background: #fffffff2; box-shadow: 0 4px 20px #263b4910; color: #394b52; font: 12px/1.4 system-ui; white-space: nowrap; }
.cloud-controls nav { display: flex; border-right: 1px solid #d6dfe1; padding-right: 5px; }
.cloud-controls a { padding: 9px 8px; border-radius: 7px; color: inherit; text-decoration: none; }
.cloud-controls a.router-link-exact-active { background: #e4ecef; }
.cloud-controls a:focus-visible { outline: 2px solid #4a5b96; }
.cloud-controls button { padding: 9px 11px; border: 0; border-radius: 7px; cursor: pointer; background: transparent; color: inherit; }
.cloud-controls button[aria-pressed='true'] { background: #e4ecef; color: #172d38; }
.cloud-controls button:hover { background: #edf2f4; }
.cloud-controls button:focus-visible { outline: 2px solid #4a5b96; outline-offset: 2px; }
.cloud-controls button:disabled { opacity: .4; cursor: default; }
:global(html.dark .cloud-preview .cloud-veil) { background: rgb(18 27 34 / 78%); }
:global(html.dark .cloud-preview[data-mode='raw'] .cloud-veil) { background: rgb(18 27 34 / 48%); }
:global(html.dark .cloud-preview .letter-home) { --home-muted: #dae4e8; --home-text: #f3f6f7; }
.cloud-preview[data-page='archives'] .cloud-veil { background: rgb(255 255 255 / 84%); }
.cloud-preview[data-page='about'] .cloud-veil { background: rgb(255 255 255 / 72%); }
.cloud-preview[data-mode='raw'] .cloud-veil { background: rgb(255 255 255 / 18%); }
.cloud-preview[data-page='archives'] :deep(.post-item) { opacity: 1 !important; transform: none !important; }
.cloud-preview[data-page='archives'] :deep(.animate-fade-in) { animation: none; opacity: 1; }
.cloud-preview:not([data-page='home']) { padding-bottom: 90px; }
.cloud-preview:not([data-page='home']):not([data-mode='off']) :deep(.yun-card) { background: rgb(255 255 255 / 48%); box-shadow: none; }
:global(body:has(.cloud-preview:not([data-page='home'])) .yun-bg),
:global(body:has(.cloud-preview:not([data-page='home'])) .yun-page-header-gradient) { display: none; }
:global(html.dark .cloud-preview[data-page='about'] .cloud-veil) { background: rgb(18 27 34 / 82%); }
:global(html.dark .cloud-preview[data-page='archives'] .cloud-veil) { background: rgb(18 27 34 / 90%); }
:global(html.dark .cloud-preview:not([data-page='home']):not([data-mode='off']) .yun-card) { background: rgb(24 25 24 / 55%); }
@media (max-width: 480px) { .cloud-controls { flex-wrap: wrap; justify-content: center; width: max-content; max-width: calc(100vw - 24px); } .cloud-controls nav { flex-basis: 100%; justify-content: center; border-right: 0; padding-right: 0; } .cloud-preview:not([data-page='home']) { padding-bottom: 135px; } }
@media (max-width: 480px) { .cloud-controls { bottom: 12px; } .cloud-controls button { padding: 10px 8px; } }
@media (prefers-reduced-motion: reduce) { .cloud-veil { transition: none; } }
</style>
