<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const mark = ref<SVGElement>()
const drawing = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      drawing.value = true
      observer?.disconnect()
    }
  }, { rootMargin: '100px' })
  if (mark.value) observer.observe(mark.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <svg ref="mark" viewBox="0 0 85 40" fill="none" aria-hidden="true" :class="{ drawing }">
    <path pathLength="1" d="M39 9C34 1 15 9 17 17C18 22 34 17 32 25C30 33 12 34 10 28C12 34 32 32 40 18C35 26 34 32 39 29C43 27 47 21 48 19C43 29 46 33 55 26" />
    <path pathLength="1" d="M17 37C34 31 54 31 71 33" />
  </svg>
</template>

<style scoped>
svg { width: 100%; height: 100%; overflow: visible; }
path { stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1 2; }
.drawing path { animation: signature-write 1100ms 350ms linear both; }
.drawing path + path { animation-duration: 400ms; animation-delay: 1530ms; }
@keyframes signature-write { from { stroke-dashoffset: 1.02; } to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .drawing path { animation: none; stroke-dashoffset: 0; } }
</style>
