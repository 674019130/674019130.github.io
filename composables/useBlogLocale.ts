import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocale, useValaxyI18n } from 'valaxy'
import { useRoute, useRouter } from 'vue-router'

type BlogLocale = 'en' | 'zh'
function normalize(value: unknown): BlogLocale | undefined {
  if (typeof value !== 'string') return
  if (/^zh(?:-|$)/i.test(value)) return 'zh'
  if (/^en(?:-|$)/i.test(value)) return 'en'
}

/** Custom pages and theme controls share Valaxy's persisted locale. */
export function useBlogLocale(fallback: BlogLocale = 'en') {
  const { locale: globalLocale } = useValaxyI18n()
  const { toggleLocale } = useLocale()
  const route = useRoute()
  const router = useRouter()
  const mounted = ref(false)
  const locale = computed<BlogLocale>({
    get: () => mounted.value ? normalize(globalLocale.value) || fallback : fallback,
    set: (value) => {
      toggleLocale(value === 'zh' ? 'zh-CN' : 'en')
      // Keep explicit deep links in agreement with the current selection.
      if (route.query.lang) void router.replace({ query: { ...route.query, lang: value === 'zh' ? 'zh-CN' : 'en' } })
    },
  })
  function restorePage(event: PageTransitionEvent) {
    if (!event.persisted) return
    try {
      const saved = normalize(localStorage.getItem('valaxy-locale'))
      if (saved) locale.value = saved
    } catch { /* Storage can be disabled. */ }
  }
  onBeforeUnmount(() => window.removeEventListener('pageshow', restorePage))
  onMounted(() => {
    window.addEventListener('pageshow', restorePage)
    let saved: string | null = null
    try { saved = localStorage.getItem('valaxy-locale') } catch { /* Storage can be disabled. */ }
    const initial = normalize(route.query.lang) || normalize(saved) || fallback
    toggleLocale(initial === 'zh' ? 'zh-CN' : 'en')
    mounted.value = true
  })
  watch(() => route.query.lang, (value) => {
    const next = normalize(value)
    if (mounted.value && next) toggleLocale(next === 'zh' ? 'zh-CN' : 'en')
  })
  const zh = computed({ get: () => locale.value === 'zh', set: (value: boolean) => { locale.value = value ? 'zh' : 'en' } })
  return { locale, zh }
}
