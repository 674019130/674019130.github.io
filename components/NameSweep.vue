<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ text: string }>()
const element = ref<HTMLElement>()
let frame = 0
let preference: MediaQueryList | undefined

function restoreText() {
  cancelAnimationFrame(frame)
  const style = element.value?.style
  if (!style) return
  style.removeProperty('color')
  style.removeProperty('background-image')
}

function handleMotionPreference() {
  if (preference?.matches) restoreText()
}

onMounted(() => {
  preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', handleMotionPreference)
  if (preference.matches) return
  const start = performance.now() + 230
  const palette = ['#c679c4', '#fa3d1d', '#ffb005', '#e1e1fe', '#0358f7']
  const draw = (now: number) => {
    const target = element.value
    if (!target) return
    const progress = Math.max(0, Math.min(1, (now - start) / 1200))
    if (progress === 1) {
      restoreText()
      return
    }
    // Cubic acceleration/deceleration; the colour front traverses -17% to 117%.
    const eased = progress < .5 ? 4 * progress ** 3 : 1 - 4 * (1 - progress) ** 3
    const left = eased * 134 - 34
    const right = left + 34
    const stops = [
      `var(--home-text, #1a1a1a) ${left}%`,
      ...palette.map((colour, index) => `${colour} ${left + index * 8.5}%`),
      `transparent ${right}%`,
    ]
    target.style.color = 'transparent'
    target.style.backgroundImage = `linear-gradient(90deg, ${stops.join(', ')})`
    frame = requestAnimationFrame(draw)
  }
  frame = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  preference?.removeEventListener('change', handleMotionPreference)
})
</script>

<template>
  <span ref="element" class="name-sweep">{{ text }}</span>
</template>

<style scoped>
.name-sweep {
  color: var(--home-text, #1a1a1a);
  background-clip: text;
  -webkit-background-clip: text;
}
@media (prefers-reduced-motion: reduce) {
  .name-sweep { color: var(--home-text, #1a1a1a) !important; background-image: none !important; }
}
</style>
