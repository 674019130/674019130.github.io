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
        <a class="lab-experiment" href="/lab/timeline/">
          <div class="lab-preview" aria-hidden="true">
            <span class="preview-line unchanged" /><span class="preview-line changed" />
            <span class="preview-line removed" /><span class="preview-line added" />
          </div>
          <div class="experiment-heading"><h2>{{ zh ? '流式时间线' : 'Streaming timeline' }}</h2><span aria-hidden="true">↗</span></div>
          <p>{{ zh ? '新证据逐条到来，变化清晰可见。试试更新、增删与折叠。' : 'New evidence, one row at a time. Explore edits, additions, and folded removals.' }}</p>
          <span class="experiment-open">{{ zh ? '打开实验' : 'Open experiment' }} →</span>
        </a>
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
.lab-experiment { display: block; margin: 38px 0 24px; padding: 24px 0; border-top: 1px solid var(--home-rule); border-bottom: 1px solid var(--home-rule); }
.lab-preview { display: grid; gap: 9px; padding: 12px 0 22px 14px; border-left: 1px solid var(--home-rule); margin: 0 0 18px 4px; }
.preview-line { display: block; height: 7px; width: 65%; max-width: 280px; border-radius: 2px; background: var(--home-rule); }
.preview-line.changed { width: 78%; background: #bd7d1830; border-left: 2px solid #bd7d18; }
.preview-line.removed { width: 45%; background: #bd4f4525; border-left: 2px solid #bd4f45; }
.preview-line.added { width: 72%; background: #2d8a5630; border-left: 2px solid #2d8a56; }
.experiment-heading { display: flex; justify-content: space-between; gap: 16px; align-items: center; color: var(--home-text); }
h2 { margin: 0 0 8px; font-size: 15px; font-weight: 500; }
.experiment-open { display: inline-block; font-size: 12px; margin-top: 16px; }
.lab-experiment:hover .experiment-open { text-decoration: underline; text-underline-offset: 4px; }
footer { font-size: 12px; }
a:focus-visible, button:focus-visible { outline: 2px solid #4a5b96; outline-offset: 5px; }
@keyframes lab-arrive { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .lab-frame { animation: none; } a { transition: none; } }
</style>
