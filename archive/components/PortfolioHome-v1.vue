<!-- Archived: superseded by the bilingual, typography-led homepage. -->
<script setup lang="ts">
import type { Post } from 'valaxy/types'
import { usePostListWithCollections } from 'valaxy'
import { computed } from 'vue'

const posts = usePostListWithCollections({})
const recentPosts = computed(() => posts.value.filter(post => !post._collection).slice(0, 6))

const focusAreas = [
  { index: '01', name: 'Search systems', detail: 'retrieval, relevance, ranking' },
  { index: '02', name: 'Agent systems', detail: 'harness, evaluation, multi-agent' },
  { index: '03', name: 'Data systems', detail: 'DDIA, distributed trade-offs' },
  { index: '04', name: 'Engineering', detail: 'tools, practice, reflection' },
]

function postTitle(post: Post) {
  if (typeof post.title === 'string')
    return post.title
  return post.title?.['zh-CN'] || post.title?.en || 'Untitled'
}

function formatDate(date: Post['date']) {
  if (!date)
    return ''
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

</script>

<template>
  <main class="portfolio-home">
    <div class="portfolio-frame">
      <header class="profile-header home-reveal home-reveal-1">
        <div>
          <RouterLink class="profile-name" to="/" aria-label="苏的主页">
            苏
          </RouterLink>
          <p class="profile-role">
            Search · Agents · Systems
          </p>
        </div>

        <nav class="profile-actions" aria-label="主页导航">
          <a href="https://github.com/674019130" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
            <span class="i-ri-github-line" aria-hidden="true" />
          </a>
          <a href="/atom.xml" aria-label="RSS" title="RSS">
            <span class="i-ri-rss-line" aria-hidden="true" />
          </a>
          <YunToggleDark class="home-icon-button" title="切换深色模式" transition />
          <YunSearchTrigger class="home-icon-button" title="搜索" />
        </nav>
      </header>

      <section class="intro home-reveal home-reveal-2" aria-labelledby="intro-title">
        <h1 id="intro-title">
          你好，我是苏。做搜索与 AI 工程，也写数据系统、Agent 架构和软件实践。
        </h1>
        <p>
          这里是我的公开工作台：长期笔记、阶段性复盘，以及那些值得被讲清楚的问题。
        </p>
        <div class="intro-actions">
          <RouterLink class="primary-action" :to="recentPosts[0]?.path || '/archives/'">
            读最新文章
            <span class="i-ri-arrow-right-line" aria-hidden="true" />
          </RouterLink>
          <RouterLink class="secondary-action" to="/archives/">
            浏览归档
          </RouterLink>
        </div>
      </section>

      <HomeActivity class="home-reveal home-reveal-3" />

      <section class="home-section home-reveal home-reveal-4" aria-labelledby="focus-title">
        <div class="section-heading">
          <div>
            <p class="section-kicker">
              INDEX / 02
            </p>
            <h2 id="focus-title">
              Focus
            </h2>
          </div>
          <RouterLink class="section-link" to="/tags/">
            All topics
            <span class="i-ri-arrow-right-line" aria-hidden="true" />
          </RouterLink>
        </div>

        <div class="focus-list">
          <div v-for="area in focusAreas" :key="area.index" class="focus-row">
            <span class="focus-index">{{ area.index }}</span>
            <strong>{{ area.name }}</strong>
            <span>{{ area.detail }}</span>
          </div>
        </div>
      </section>

      <section class="home-section home-reveal home-reveal-5" aria-labelledby="writing-title">
        <div class="section-heading">
          <div>
            <p class="section-kicker">
              NOTES / 03
            </p>
            <h2 id="writing-title">
              Latest writing
            </h2>
          </div>
          <RouterLink class="section-link" to="/archives/">
            Archive
            <span class="i-ri-arrow-right-line" aria-hidden="true" />
          </RouterLink>
        </div>

        <ol class="writing-list">
          <li v-for="post in recentPosts" :key="post.path">
            <AppLink :to="post.path || '/archives/'">
              <span class="writing-title">{{ postTitle(post) }}</span>
              <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
              <span class="i-ri-arrow-right-up-line writing-arrow" aria-hidden="true" />
            </AppLink>
          </li>
        </ol>
      </section>

      <footer class="home-footer home-reveal home-reveal-5">
        <span>苏 · Since 2022</span>
        <span>Built with Valaxy, deployed on GitHub Pages.</span>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.portfolio-home {
  --home-bg: #fbfbfa;
  --home-text: #171918;
  --home-muted: #727874;
  --home-soft: #f0f1ef;
  --home-rule: #dfe2df;
  --home-accent: #1f6550;
  --home-accent-strong: #174b3d;
  --activity-0: #ebedeb;
  --activity-1: #bad8cb;
  --activity-2: #72ae96;
  --activity-3: #358069;
  --activity-4: #185440;

  min-height: 100vh;
  background: var(--home-bg);
  color: var(--home-text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  letter-spacing: 0;
}

.portfolio-frame {
  width: min(100% - 40px, 760px);
  margin: 0 auto;
  padding: 70px 0 36px;
}

.profile-header,
.section-heading,
.activity-meta,
.home-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-name {
  color: var(--home-text);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
}

.profile-role {
  margin: 5px 0 0;
  color: var(--home-muted);
  font-size: 14px;
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-actions > a,
.profile-actions :deep(.home-icon-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--home-muted);
  font-size: 19px;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.profile-actions > a:hover,
.profile-actions :deep(.home-icon-button:hover) {
  background: var(--home-soft);
  color: var(--home-text);
  transform: translateY(-1px);
}

.profile-actions > a:focus-visible,
.profile-actions :deep(.home-icon-button:focus-visible),
.portfolio-home a:focus-visible {
  outline: 2px solid var(--home-accent);
  outline-offset: 3px;
}

.intro {
  padding: 54px 0 10px;
}

.intro h1 {
  max-width: 700px;
  margin: 0;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 620;
  line-height: 1.32;
  letter-spacing: 0;
}

.intro p {
  max-width: 650px;
  margin: 20px 0 0;
  color: var(--home-muted);
  font-size: 17px;
  line-height: 1.8;
}

.intro-actions {
  display: flex;
  gap: 10px;
  margin-top: 28px;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--home-rule);
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.primary-action {
  gap: 8px;
  border-color: var(--home-text);
  background: var(--home-text);
  color: var(--home-bg);
}

.secondary-action {
  background: transparent;
  color: var(--home-text);
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-1px);
}

.primary-action:hover {
  border-color: var(--home-accent-strong);
  background: var(--home-accent-strong);
}

.secondary-action:hover {
  border-color: var(--home-text);
  background: var(--home-soft);
}

.home-section {
  padding: 70px 0 0;
}

.section-heading {
  gap: 20px;
}

.section-heading h2 {
  margin: 5px 0 0;
  font-size: 21px;
  font-weight: 650;
  line-height: 1.3;
}

.section-kicker {
  margin: 0;
  color: var(--home-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--home-muted);
  font-size: 13px;
  text-decoration: none;
  transition: color 180ms ease;
}

.section-link:hover {
  color: var(--home-accent);
}

.focus-list,
.writing-list {
  margin: 24px 0 0;
  border-top: 1px solid var(--home-rule);
}

.focus-row {
  display: grid;
  grid-template-columns: 38px 180px 1fr;
  align-items: baseline;
  min-height: 54px;
  padding: 16px 0;
  border-bottom: 1px solid var(--home-rule);
  font-size: 14px;
}

.focus-row strong {
  font-weight: 620;
}

.focus-row > span:last-child,
.focus-index {
  color: var(--home-muted);
}

.focus-index {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
}

.writing-list {
  padding: 0;
  list-style: none;
}

.writing-list a {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 20px;
  align-items: center;
  gap: 18px;
  min-height: 64px;
  padding: 12px 0;
  border-bottom: 1px solid var(--home-rule);
  color: var(--home-text);
  text-decoration: none;
  transition: color 180ms ease, padding 180ms ease;
}

.writing-list a:hover {
  padding-left: 6px;
  color: var(--home-accent);
}

.writing-title {
  overflow: hidden;
  font-size: 15px;
  font-weight: 540;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.writing-list time {
  color: var(--home-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
}

.writing-arrow {
  color: var(--home-muted);
  font-size: 15px;
}

.home-footer {
  margin-top: 76px;
  padding-top: 20px;
  border-top: 1px solid var(--home-rule);
  color: var(--home-muted);
  font-size: 11px;
}

.home-reveal {
  animation: home-reveal 500ms both cubic-bezier(.2, .75, .25, 1);
}

.home-reveal-1 { animation-delay: 40ms; }
.home-reveal-2 { animation-delay: 100ms; }
.home-reveal-3 { animation-delay: 160ms; }
.home-reveal-4 { animation-delay: 220ms; }
.home-reveal-5 { animation-delay: 280ms; }

@keyframes home-reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .portfolio-frame {
    width: min(100% - 32px, 760px);
    padding-top: 34px;
  }

  .profile-header {
    align-items: flex-start;
  }

  .profile-actions {
    margin-right: -8px;
  }

  .intro {
    padding-top: 46px;
  }

  .intro h1 {
    font-size: 29px;
  }

  .intro p {
    font-size: 16px;
  }

  .home-section {
    padding-top: 58px;
  }

  .focus-row {
    grid-template-columns: 34px 1fr;
  }

  .focus-row > span:last-child {
    grid-column: 2;
    margin-top: 5px;
    font-size: 13px;
  }

  .writing-list a {
    grid-template-columns: minmax(0, 1fr) 18px;
    gap: 10px;
  }

  .writing-title {
    white-space: normal;
  }

  .writing-list time {
    display: none;
  }

  .home-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-reveal {
    animation: none;
  }

  .portfolio-home *,
  .portfolio-home *::before,
  .portfolio-home *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
