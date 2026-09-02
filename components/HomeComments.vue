<script setup lang="ts">
import type { WalineInitOptions } from '@waline/client'
import { Waline } from '@waline/client/component'
import { useAppStore, useRuntimeConfig } from 'valaxy'
import { computed } from 'vue'
import '@waline/client/style'

type HomeWalineOptions = WalineInitOptions & {
  cdn?: string
  types?: string[]
  emoji?: string[]
}

const props = defineProps<{
  locale: 'en' | 'zh'
}>()

const appStore = useAppStore()
const runtimeConfig = useRuntimeConfig()
const options = computed(() => runtimeConfig.value.addons['valaxy-addon-waline']?.options as HomeWalineOptions | undefined)
const clientOptions = computed(() => {
  const { cdn: _cdn, types: _types, emoji: _emoji, ...rest } = options.value || { serverURL: '' }
  return rest
})
const emoji = computed(() => {
  const cdn = options.value?.cdn || '//unpkg.com/'
  const types = options.value?.types || ['bilibili', 'qq', 'weibo']
  const customEmoji = options.value?.emoji || []
  return [
    ...types.map(type => `${cdn}@waline/emojis/${type}/`),
    ...customEmoji.map(item => `${item}/`),
  ]
})
</script>

<template>
  <div v-if="options?.serverURL" class="home-waline">
    <Waline
      v-bind="clientOptions"
      :server-u-r-l="options.serverURL"
      path="/"
      :lang="locale === 'en' ? 'en-US' : 'zh-CN'"
      :dark="appStore.isDark"
      :emoji="emoji"
      :meta="['nick', 'mail', 'link']"
      :required-meta="[]"
    />
  </div>
</template>

<style scoped>
.home-waline {
  --waline-font-size: 12px;
  --waline-avatar-size: 36px;
  --waline-m-avatar-size: 32px;
  --waline-theme-color: var(--home-text);
  --waline-active-color: var(--home-muted);
  --waline-color: var(--home-text);
  --waline-bg-color: transparent;
  --waline-bg-color-light: var(--home-soft);
  --waline-bg-color-hover: var(--home-soft);
  --waline-border-color: var(--home-rule);
  --waline-disable-bg-color: var(--home-soft);
  --waline-disable-color: var(--home-muted);
  --waline-info-bg-color: var(--home-soft);
  --waline-info-color: var(--home-muted);
  --waline-box-shadow: none;
}

.home-waline :deep(.wl-panel) {
  margin: 0;
  border-radius: var(--home-radius-panel, 8px);
}

.home-waline :deep(.wl-comment) {
  align-items: flex-start;
  margin-bottom: 8px;
}

.home-waline :deep(.wl-login-info) {
  flex: 0 0 44px;
  width: 44px;
  margin: 8px 6px 0 0;
}

.home-waline :deep(.wl-login-nick) {
  margin-top: 2px;
  font-size: 10px;
  line-height: 14px;
}

.home-waline :deep(.wl-header) {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-radius: var(--home-radius-panel, 8px) var(--home-radius-panel, 8px) 0 0;
}

.home-waline :deep(.wl-header-item:not(:last-child)) {
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.home-waline :deep(.wl-header label) {
  padding: 6px 7px;
  font-size: 11px;
  line-height: 16px;
}

.home-waline :deep(.wl-header input) {
  min-height: 16px;
  padding: 6px 4px;
  font-size: 11px;
  line-height: 16px;
}

.home-waline :deep(.wl-editor) {
  width: calc(100% - 16px);
  min-height: 96px;
  margin: 8px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 20px;
}

.home-waline :deep(.wl-btn) {
  box-sizing: border-box;
  height: 28px;
  min-width: 0;
  padding: 0 10px;
  border-radius: var(--home-radius-control, 7px);
  font-size: 11px;
  line-height: 26px;
}

.home-waline :deep(.wl-footer) {
  align-items: center;
  min-height: 28px;
  margin: 6px 8px 8px;
}

.home-waline :deep(.wl-actions) {
  align-items: center;
  gap: 1px;
}

.home-waline :deep(.wl-action) {
  display: inline-grid !important;
  place-items: center;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--home-muted);
  font-size: 14px;
  line-height: 1;
  transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
}

.home-waline :deep(.wl-action:hover),
.home-waline :deep(.wl-action:focus-visible) {
  border-color: var(--home-rule);
  background: var(--home-soft);
  color: var(--home-text);
}

.home-waline :deep(.wl-action:focus-visible) {
  outline: 2px solid color-mix(in srgb, var(--home-text) 28%, transparent);
  outline-offset: 1px;
}

.home-waline :deep(.wl-action svg) {
  display: block;
  width: 14px;
  height: 14px;
}

.home-waline :deep(.wl-actions > a.wl-action svg),
.home-waline :deep(.wl-actions > button.wl-action:nth-of-type(2) svg) {
  width: 15px;
  height: 15px;
}

.home-waline :deep(.wl-info) {
  align-items: center;
  gap: 4px;
}

.home-waline :deep(.wl-info button) {
  margin-inline-start: 0;
}

.home-waline :deep(.wl-text-number) {
  margin-inline-end: 2px;
  font-size: 11px;
  line-height: 16px;
}

.home-waline :deep(.wl-card) {
  border-bottom-style: solid;
  border-radius: var(--home-radius-panel, 8px);
}

.home-waline :deep(.wl-meta-head) {
  padding: 4px 2px;
}

.home-waline :deep(.wl-count) {
  font-size: 14px;
}

.home-waline :deep(.wl-empty) {
  padding: 12px 0;
  font-size: 12px;
}

.home-waline :deep(.wl-power) {
  padding: 4px 0;
}
</style>
