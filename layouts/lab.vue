<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'

const zh = ref(false)
useHead(computed(() => ({
  title: zh.value ? 'UI 实验室' : 'UI lab',
  htmlAttrs: { lang: zh.value ? 'zh-CN' : 'en' },
})))
</script>

<template>
  <YunLayoutWrapper :footer="false" no-margin>
    <main class="portfolio-home lab-home">
      <div class="lab-frame">
        <header>
          <RouterLink to="/" class="lab-back">← {{ zh ? '首页' : 'home' }}</RouterLink>
          <button type="button" :aria-label="zh ? 'Switch to English' : '切换为中文'" @click="zh = !zh">{{ zh ? 'EN' : '中' }}</button>
        </header>
        <h1>{{ zh ? 'UI 实验室' : 'UI lab' }}</h1>
        <p>{{ zh ? '一些关于界面、交互与动效的小实验。' : 'Small experiments in interfaces, interactions, and motion.' }}</p>
        <div class="lab-empty">
          <span class="lab-dot" aria-hidden="true" />
          <p>{{ zh ? '实验还在整理中。' : 'Experiments are still being put together.' }}</p>
        </div>
        <footer><RouterLink to="/archives/">{{ zh ? '先看看文章' : 'Explore the writing' }} ↗</RouterLink></footer>
      </div>
    </main>
  </YunLayoutWrapper>
</template>

<style scoped>
.lab-home { --home-bg: #fff; --home-text: #1a1a1a; --home-muted: #6b6b6b; --home-rule: #ebebeb; min-height: 100svh; padding: 64px 24px; box-sizing: border-box; background: var(--home-bg); color: var(--home-text); font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif; font-size: 14.4px; line-height: 1.65; }
:global(html.dark .lab-home) { --home-bg: #181918; --home-text: #eceeec; --home-muted: #b1b5b1; --home-rule: #363936; }
.lab-frame { max-width: 538px; margin: 0 auto; animation: lab-arrive 400ms ease-out; }
header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 38px; }
button { background: none; border: 0; color: var(--home-muted); padding: 8px; font: inherit; cursor: pointer; }
a { color: var(--home-muted); text-decoration: none; transition: color 200ms; }
a:hover { color: var(--home-text); }
h1 { font-size: 16.8px; font-weight: 500; margin: 0 0 10px; }
p { margin: 0; color: var(--home-muted); }
.lab-empty { display: flex; gap: 12px; align-items: center; border-top: 1px solid var(--home-rule); border-bottom: 1px solid var(--home-rule); margin: 38px 0 24px; padding: 28px 0; }
.lab-dot { width: 5px; height: 5px; border-radius: 50%; background: #9b9b9b; flex-shrink: 0; }
footer { font-size: 12px; }
a:focus-visible, button:focus-visible { outline: 2px solid #4a5b96; outline-offset: 5px; }
@keyframes lab-arrive { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .lab-frame { animation: none; } a { transition: none; } }
</style>
