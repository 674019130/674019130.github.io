<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'

type ArticleLocale = 'en' | 'zh'

const props = defineProps<{
  current: ArticleLocale
  englishPath: string
  chinesePath: string
}>()

const siteConfig = useSiteConfig()
const languages = computed(() => [
  { code: 'en', hreflang: 'en', label: 'English', path: props.englishPath },
  { code: 'zh', hreflang: 'zh-CN', label: '中文', path: props.chinesePath },
] as const)
const label = computed(() => props.current === 'en' ? 'Also available in' : '其他语言')

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.value.url).toString()
}

useHead(computed(() => ({
  htmlAttrs: { lang: props.current === 'en' ? 'en' : 'zh-CN' },
  link: [
    ...languages.value.map(language => ({
      rel: 'alternate',
      hreflang: language.hreflang,
      href: absoluteUrl(language.path),
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: absoluteUrl(props.englishPath),
    },
  ],
})))
</script>

<template>
  <nav class="post-language-switch" :aria-label="label">
    <span>{{ label }}</span>
    <AppLink
      v-for="language in languages"
      :key="language.code"
      :to="language.path"
      :lang="language.hreflang"
      :hreflang="language.hreflang"
      :aria-current="language.code === current ? 'page' : undefined"
    >
      {{ language.label }}
    </AppLink>
  </nav>
</template>

<style scoped>
.post-language-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 28px;
  padding-bottom: 12px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  color: var(--va-c-text-light, #767a76);
  font-size: 13px;
  line-height: 20px;
}

.post-language-switch a {
  color: inherit;
  text-decoration: none;
  text-underline-offset: 3px;
}

.post-language-switch a[aria-current="page"],
.post-language-switch a:hover {
  color: var(--va-c-text, currentColor);
  text-decoration: underline;
}
</style>
