<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useSiteConfig } from 'valaxy'
import projects from '../data/projects.json'

const HomeComments = defineAsyncComponent(() => import('./HomeComments.vue'))
const site = useSiteConfig()
const motionReady = ref(false)
onMounted(() => { motionReady.value = true })
const locale = ref<'en' | 'zh'>('en')
const zh = computed(() => locale.value === 'zh')
const email = 'nostarsbutmyeyes@gmail.com'
const notice = ref('')
const commentsMounted = ref(false)
const commentsOpen = ref(false)
const commentHeading = ref<HTMLElement>()
const commentTrigger = ref<HTMLButtonElement>()
let noticeTimer: ReturnType<typeof setTimeout> | undefined

const projectFallbacks = {
  'Tokdash': 'https://github.com/JingbiaoMei/Tokdash',
  'kaifan': 'https://github.com/674019130/kaifan',
  'learn-real-claude-code': 'https://github.com/674019130/learn-real-claude-code',
}
const projectUrl = (name: keyof typeof projectFallbacks) =>
  projects.projects.find(project => project.name === name)?.url || projectFallbacks[name]

useHead(computed(() => ({
  title: zh.value ? '苏' : 'Su',
  htmlAttrs: { lang: zh.value ? 'zh-CN' : 'en' },
  // Keep static content readable without hydration; with JS, all arrivals share a mount-time clock.
  noscript: [{ innerHTML: '<style>.letter-home .letter-arrival{animation:none!important;opacity:1!important;transform:none!important}.letter-home .letter-link::after{animation:none!important;transform:none!important}</style>' }],
  meta: [{ name: 'description', content: zh.value
    ? '苏的搜索、推荐与 AI 工程，长期笔记和个人项目。'
    : 'Search, recommendation, and AI systems. Engineering notes and personal projects by Su.' }],
})))

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email)
    notice.value = zh.value ? '邮箱已复制' : 'Email copied'
  }
  catch {
    notice.value = email
  }
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => { notice.value = '' }, 4000)
}

async function toggleComments() {
  commentsOpen.value = !commentsOpen.value
  if (commentsOpen.value) commentsMounted.value = true
  await nextTick()
  if (commentsOpen.value) commentHeading.value?.focus({ preventScroll: false })
  else commentTrigger.value?.focus({ preventScroll: true })
}

onBeforeUnmount(() => { if (noticeTimer) clearTimeout(noticeTimer) })
</script>

<template>
  <main class="portfolio-home letter-home" :class="{ 'letter-ready': motionReady }" :lang="zh ? 'zh-CN' : 'en'">
    <div class="letter-frame">
      <h1 class="letter-sr">{{ zh ? '苏' : 'Su' }}</h1>

      <header class="letter-arrival letter-portrait">
        <RouterLink to="/about/" :aria-label="zh ? '关于苏' : 'About Su'" class="portrait-link">
          <img :src="site.author?.avatar" :alt="zh ? '苏的头像' : 'Su’s portrait'" width="40" height="40" fetchpriority="high">
        </RouterLink>
      </header>

      <div class="letter-prose" :class="{ 'letter-chinese': zh }">
        <p class="letter-arrival letter-lead">
          <template v-if="zh">你好，我是<NameSweep text="苏" />。我做搜索、推荐与 AI 工程，也写数据密集型软件、Agent 架构和工程实践。喜欢把复杂的问题想清楚，再把它们做得简单一点。</template>
          <template v-else>Hi, I’m <NameSweep text="Su" />. I build search, recommendation, and AI systems, and write about data-intensive software, agent architecture, and engineering practice. I like making complicated things a little easier to understand.</template>
        </p>

        <p class="letter-arrival">
          <template v-if="zh">目前在 <a class="letter-pill" href="https://www.scmp.com/" target="_blank" rel="noopener noreferrer"><img class="letter-brand" src="/brand/scmp.png" width="16" height="16" alt="">南华早报</a> 做 AI Agent Engineer，关注搜索、推荐与 Agent 系统。我把实践中的思考写成<RouterLink class="letter-link writing-link" to="/archives/">文章</RouterLink>，整理<RouterLink class="letter-link notes-link" to="/categories/">长期笔记</RouterLink>，也留了一间 <RouterLink class="letter-link lab-link" to="/lab">UI 实验室</RouterLink>。</template>
          <template v-else>Currently an AI Agent Engineer at <a class="letter-pill" href="https://www.scmp.com/" target="_blank" rel="noopener noreferrer"><img class="letter-brand" src="/brand/scmp.png" width="16" height="16" alt="">South China Morning Post</a>, working on search, recommendation, and agent systems. I <RouterLink class="letter-link writing-link" to="/archives/">write</RouterLink> about what I learn, and keep <RouterLink class="letter-link notes-link" to="/categories/">long-running notes</RouterLink>, with a <RouterLink class="letter-link lab-link" to="/lab">UI lab</RouterLink> for small interface experiments.</template>
        </p>

        <p class="letter-arrival">
          <template v-if="zh">我也做一些小工具：<a class="letter-pill" :href="projectUrl('Tokdash')" target="_blank" rel="noopener noreferrer"><span class="i-ri-terminal-box-line" aria-hidden="true" />Tokdash</a> 用来查看 Agent 会话与用量，<a class="letter-pill" :href="projectUrl('kaifan')" target="_blank" rel="noopener noreferrer"><span class="i-ri-restaurant-line" aria-hidden="true" />开饭</a> 帮忙决定今天吃什么。还有一份沿着 <a class="letter-pill" :href="projectUrl('learn-real-claude-code')" target="_blank" rel="noopener noreferrer"><span class="i-ri-code-s-slash-line" aria-hidden="true" />Claude Code</a> 源码展开的架构研究。我也为 <a class="letter-pill" href="https://github.com/mountain-loop/yaak/pulls?q=is%3Apr+author%3A674019130+is%3Amerged" target="_blank" rel="noopener noreferrer"><img class="letter-brand" src="/brand/yaak.png" width="16" height="16" alt="">Yaak</a> 做过一些贡献。</template>
          <template v-else>I also build small tools: <a class="letter-pill" :href="projectUrl('Tokdash')" target="_blank" rel="noopener noreferrer"><span class="i-ri-terminal-box-line" aria-hidden="true" />Tokdash</a> for agent sessions and usage, and <a class="letter-pill" :href="projectUrl('kaifan')" target="_blank" rel="noopener noreferrer"><span class="i-ri-restaurant-line" aria-hidden="true" />Kaifan</a> for deciding where to eat. Along the way, I study how <a class="letter-pill" :href="projectUrl('learn-real-claude-code')" target="_blank" rel="noopener noreferrer"><span class="i-ri-code-s-slash-line" aria-hidden="true" />Claude Code</a> is put together, and contribute to <a class="letter-pill" href="https://github.com/mountain-loop/yaak/pulls?q=is%3Apr+author%3A674019130+is%3Amerged" target="_blank" rel="noopener noreferrer"><img class="letter-brand" src="/brand/yaak.png" width="16" height="16" alt="">Yaak</a>.</template>
        </p>

        <p class="letter-arrival">
          <template v-if="zh">这里是我的公开工作台。如果你也在琢磨这些问题，或者只是想打个招呼，欢迎<a class="letter-link contact-link" :href="`mailto:${email}`">写邮件</a>，或<button ref="commentTrigger" class="letter-link contact-link" type="button" :aria-expanded="commentsOpen" aria-controls="letter-comments" @click="toggleComments">留句话</button>。</template>
          <template v-else>This is my public workbench. If you’re thinking about similar things, have an idea, or just want to say hello, <a class="letter-link contact-link" :href="`mailto:${email}`">send a note</a> or <button ref="commentTrigger" class="letter-link contact-link" type="button" :aria-expanded="commentsOpen" aria-controls="letter-comments" @click="toggleComments">leave a message</button>.</template>
        </p>
      </div>

      <hr class="letter-rule letter-arrival">
      <footer class="letter-footer letter-arrival">
        <div class="letter-footer-row">
          <RouterLink to="/about/" class="letter-signature" :aria-label="zh ? '关于苏' : 'About Su'">
            <LetterSignature />
          </RouterLink>
          <nav class="letter-tools profile-header" :aria-label="zh ? '链接与工具' : 'Links and tools'">
            <a href="https://github.com/674019130" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><span class="i-ri-github-line" aria-hidden="true" /></a>
            <a href="https://space.bilibili.com/85830279" target="_blank" rel="noopener noreferrer" aria-label="Bilibili" title="Bilibili"><span class="i-ri-bilibili-line" aria-hidden="true" /></a>
            <button type="button" :aria-label="zh ? '复制邮箱' : 'Copy email'" :title="zh ? '复制邮箱' : 'Copy email'" @click="copyEmail"><span class="i-ri-mail-line" aria-hidden="true" /></button>
            <a href="/atom.xml" aria-label="RSS" title="RSS"><span class="i-ri-rss-line" aria-hidden="true" /></a>
            <YunSearchTrigger />
            <YunToggleDark :title="zh ? '切换深色模式' : 'Toggle dark mode'" />
          </nav>
        </div>
        <div class="letter-footer-row letter-secondary">
          <nav :aria-label="zh ? '更多页面' : 'More pages'">
            <RouterLink to="/about/">{{ zh ? '关于' : 'about' }}</RouterLink>
            <RouterLink to="/archives/">{{ zh ? '文章' : 'writing' }}</RouterLink>
            <RouterLink to="/home-classic">{{ zh ? '旧版首页' : 'classic home' }}</RouterLink>
          </nav>
          <div class="letter-language" role="group" :aria-label="zh ? '语言' : 'Language'">
            <button type="button" :aria-pressed="!zh" @click="locale = 'en'">EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" :aria-pressed="zh" @click="locale = 'zh'">中</button>
          </div>
        </div>
      </footer>

      <section v-if="commentsMounted" id="letter-comments" v-show="commentsOpen" class="letter-comments" aria-labelledby="letter-comment-heading" @keydown.esc="toggleComments">
        <div class="letter-footer-row">
          <h2 id="letter-comment-heading" ref="commentHeading" tabindex="-1">{{ zh ? '留句话' : 'Leave a message' }}</h2>
          <button type="button" @click="toggleComments">{{ zh ? '关闭' : 'Close' }}</button>
        </div>
        <p>{{ zh ? '昵称、邮箱与网址都可以不填。' : 'Name, email, and website are all optional.' }}</p>
        <HomeComments :locale="locale" />
      </section>
    </div>
    <div class="letter-notice" role="status" aria-live="polite"><span v-if="notice">{{ notice }}</span></div>
  </main>
</template>

<style scoped>
.letter-home {
  --home-bg: #fff;
  --home-text: #1a1a1a;
  --home-muted: #6b6b6b;
  --home-soft: #f4f4f5;
  --home-rule: #ebebeb;
  --letter-writing: #4a5b96;
  --letter-notes: #2f6f6a;
  --letter-contact: #7a4f78;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  box-sizing: border-box;
  background: var(--home-bg);
  color: var(--home-muted);
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
}
:global(html.dark .letter-home) {
  --home-bg: #181918;
  --home-text: #eceeec;
  --home-muted: #b1b5b1;
  --home-soft: #282b28;
  --home-rule: #363936;
  --letter-writing: #b3bfeb;
  --letter-notes: #95c5be;
  --letter-contact: #d1a9d0;
}
.letter-frame { width: 100%; max-width: 538px; }
.letter-sr { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.letter-portrait { margin-bottom: 38px; }
.portrait-link { display: inline-block; border-radius: 50%; }
.portrait-link img { display: block; width: 40px; height: 40px; border-radius: 50%; object-fit: cover; transition: transform 350ms cubic-bezier(.22,1,.36,1); }
.portrait-link:hover img { transform: rotate(-8deg); }
.letter-prose { font-size: 14.4px; line-height: 1.65; }
.letter-prose p { margin: 0 0 38px; text-wrap: pretty; }
.letter-prose .letter-lead { color: var(--home-text); }
.letter-pill { display: inline-flex; align-items: center; gap: .5em; padding: .25em .5em; border-radius: 999px; line-height: 1; vertical-align: middle; transform: translateY(-.06em); background: var(--home-soft); color: var(--home-text); white-space: nowrap; text-decoration: none; transition: background-color 200ms ease; }
.letter-pill:hover { background: color-mix(in srgb, var(--home-text) 10%, var(--home-bg)); }
.letter-pill:active { background: color-mix(in srgb, var(--home-text) 17%, var(--home-bg)); }
.letter-pill > span { display: inline-block; width: .9em; height: .9em; flex-shrink: 0; }
.letter-pill .letter-brand { width: .95em; height: .95em; flex-shrink: 0; object-fit: contain; border-radius: 2px; }
.letter-link { --link-color: var(--letter-writing); position: relative; isolation: isolate; border: 0; padding: 0; background: transparent; color: var(--link-color); font: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; }
.notes-link { --link-color: var(--letter-notes); }
.contact-link, .lab-link { --link-color: var(--letter-contact); }
.letter-link::after { content: ''; position: absolute; left: 0; right: 0; bottom: -.08em; height: .12em; border-radius: 2px; background: var(--link-color); opacity: .5; }
.letter-link::before { content: ''; position: absolute; z-index: -1; inset: 0 -.12em -.04em; background: color-mix(in srgb, var(--link-color) 12%, transparent); transform: scaleY(0); transform-origin: bottom; transition: transform 200ms ease; border-radius: 3px 3px 0 0; }
.letter-link:hover::before, .letter-link:focus-visible::before { transform: scaleY(1); }
.letter-home a:focus-visible, .letter-home button:focus-visible, .letter-comments h2:focus-visible { outline: 2px solid var(--letter-writing); outline-offset: 5px; }
.letter-rule { margin: 0 0 22px; border: 0; border-top: 1px solid var(--home-rule); }
.letter-footer { font-size: 12px; }
.letter-footer-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.letter-signature { display: block; color: var(--home-text); width: 64px; height: 36px; }
.letter-tools { display: flex; align-items: center; gap: 3px; }
.letter-tools > a, .letter-tools > button, .letter-tools :deep(.yun-icon-btn) { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; border: 0; border-radius: 5px; background: transparent; color: var(--home-muted); font-size: 14px; cursor: pointer; transition: background-color 180ms, color 180ms; }
.letter-tools > a:hover, .letter-tools > button:hover { background: var(--home-soft); color: var(--home-text); }
.letter-tools span { width: 14px; height: 14px; }
.letter-tools :deep(.yun-search-popup) { position: fixed; z-index: 50; }
.letter-tools:has(.yun-search-popup) :deep(.yun-search-btn) { position: fixed; top: 24px; right: 24px; z-index: 51; }
.letter-secondary { margin-top: 15px; }
.letter-secondary nav { display: flex; flex-wrap: wrap; gap: 14px; }
.letter-secondary a { color: var(--home-muted); text-decoration: underline; text-decoration-color: var(--home-rule); text-underline-offset: 4px; transition: color 180ms; }
.letter-secondary a:hover { color: var(--home-text); }
.letter-language { display: flex; align-items: center; gap: 4px; }
.letter-language button { border: 0; padding: 4px; color: var(--home-muted); background: transparent; font: inherit; cursor: pointer; }
.letter-language button[aria-pressed=true] { color: var(--home-text); font-weight: 600; }
.letter-comments { margin-top: 38px; border-top: 1px solid var(--home-rule); padding-top: 24px; }
.letter-comments h2 { font-size: 15px; color: var(--home-text); }
.letter-comments p, .letter-comments button { font-size: 12px; }
.letter-comments button { color: var(--home-muted); }
.letter-comments p { margin: 12px 0 20px; }
.letter-notice { position: fixed; z-index: 60; bottom: 24px; left: 24px; right: 24px; display: flex; justify-content: center; pointer-events: none; font-size: 13px; }
.letter-notice span { padding: 10px 16px; border: 1px solid var(--home-rule); border-radius: 8px; background: var(--home-bg); color: var(--home-text); box-shadow: 0 3px 16px #00000008; overflow-wrap: anywhere; }
.letter-arrival { animation: letter-arrive 400ms both ease-out; }
.letter-portrait { animation-delay: 150ms; }
.letter-prose p:nth-child(1) { animation-delay: 230ms; }
.letter-prose p:nth-child(2) { animation-delay: 310ms; }
.letter-prose p:nth-child(3) { animation-delay: 390ms; }
.letter-prose p:nth-child(4) { animation-delay: 470ms; }
.letter-rule { animation-delay: 550ms; }
.letter-footer { animation-name: letter-footer-arrive; animation-delay: 630ms; }
/* Navigation arrives after the reading blocks settle; contact links remain immediately legible. */
.letter-prose .writing-link::after, .letter-prose .notes-link::after, .letter-prose .lab-link::after { transform-origin: left; animation: letter-underline 450ms cubic-bezier(.22,1,.36,1) both; }
.letter-prose .writing-link::after { animation-delay: 1030ms; }
.letter-prose .notes-link::after { animation-delay: 1170ms; }
.letter-prose .lab-link::after { animation-delay: 1310ms; }
@keyframes letter-underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.letter-home:not(.letter-ready) .letter-arrival,
.letter-home:not(.letter-ready) .letter-link::after { animation-play-state: paused; }
@keyframes letter-footer-arrive { from { opacity: 0; } to { opacity: 1; } }
@keyframes letter-arrive { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 640px) {
  .letter-home { padding: 52px 24px; }
  .letter-prose { line-height: 1.85; }
  .letter-chinese { font-size: 15px; }
  .letter-prose p { margin-bottom: 32px; }
  .letter-tools { gap: 2px; }
}
@media (prefers-reduced-motion: reduce) {
  .letter-home *, .letter-home *::before, .letter-home *::after { animation: none !important; transition: none !important; }
  .portrait-link:hover img { transform: none; }
}
</style>
