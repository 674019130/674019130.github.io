<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'

const zh = ref(false)
const experiments = [
  { slug: 'color-drift', title: 'Color drift', titleZh: '流动色彩', date: '2026-09-22', dateLabel: 'Sep 22, 2026', dateLabelZh: '2026 年 9 月 22 日' },
  { slug: 'live-numbers', title: 'Live numbers', titleZh: '动态数字', date: '2026-09-22', dateLabel: 'Sep 22, 2026', dateLabelZh: '2026 年 9 月 22 日' },
  { slug: 'folding-card', title: 'Folding card', titleZh: '折叠名片', date: '2026-09-21', dateLabel: 'Sep 21, 2026', dateLabelZh: '2026 年 9 月 21 日' },
  { slug: 'timeline', title: 'Streaming timeline', titleZh: '流式时间线', date: '2026-09-14', dateLabel: 'Sep 14, 2026', dateLabelZh: '2026 年 9 月 14 日' },
  { slug: 'receipt', title: 'Receipt printer', titleZh: '小票打印机', date: '2026-09-15', dateLabel: 'Sep 15, 2026', dateLabelZh: '2026 年 9 月 15 日' },
  { slug: 'mascot', title: 'Expressive mascot', titleZh: '表情角色', date: '2026-09-15', dateLabel: 'Sep 15, 2026', dateLabelZh: '2026 年 9 月 15 日' },
]
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
        <div class="lab-list"><LabExperimentPreview v-for="experiment in experiments" :key="experiment.slug" v-bind="experiment" :zh="zh" /></div>
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
.lab-list { margin: 34px 0 30px; padding: 12px 0; border-top: 1px solid var(--home-rule); border-bottom: 1px solid var(--home-rule); }
footer { font-size: 12px; }
a:focus-visible, button:focus-visible { outline: 2px solid #4a5b96; outline-offset: 5px; }
@keyframes lab-arrive { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .lab-frame { animation: none; } a { transition: none; } }
</style>
