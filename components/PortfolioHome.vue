<script setup lang="ts">
import { useHead } from '@unhead/vue'
import type { Post } from 'valaxy/types'
import { usePostListWithCollections } from 'valaxy'
import { computed, onBeforeUnmount, ref } from 'vue'
import projectsSnapshot from '../data/projects.json'

type HomeLocale = 'en' | 'zh'
type HomePost = Post & {
  lang?: string
  translationKey?: string
}

interface ProjectSnapshot {
  name: string
  description: string
  url: string
  stars: number
  language: string | null
}

const locale = ref<HomeLocale>('en')
const posts = usePostListWithCollections({})
const emailAddress = 'nostarsbutmyeyes@gmail.com'
const emailToastVisible = ref(false)
const emailCopied = ref(false)
let emailToastTimer: ReturnType<typeof setTimeout> | undefined

function postLocale(post: HomePost): HomeLocale | undefined {
  if (post.lang === 'en')
    return 'en'
  if (post.lang?.toLowerCase().startsWith('zh'))
    return 'zh'
}

const recentWriting = computed(() => {
  const groups = new Map<string, HomePost[]>()

  for (const post of posts.value.filter(post => !post._collection) as HomePost[]) {
    const key = post.translationKey || post.path || String(post.title)
    const variants = groups.get(key) || []
    variants.push(post)
    groups.set(key, variants)
  }

  return [...groups.entries()].slice(0, 6).map(([key, variants]) => ({
    key,
    post: variants.find(post => postLocale(post) === locale.value) || variants[0],
    variants: [...variants]
      .filter(post => postLocale(post))
      .sort((a, b) => (postLocale(a) === 'en' ? -1 : 1) - (postLocale(b) === 'en' ? -1 : 1)),
  }))
})

const copy = {
  en: {
    name: 'Su',
    role: 'Search · Agents · Data systems',
    intro: 'Hi, I’m Su. I build search and AI systems, and write about data-intensive software, agent architecture, and engineering practice.',
    context: 'This is my public workbench: long-running notes, iteration logs, and problems worth explaining clearly.',
    latest: 'Email me',
    browse: 'Explore writing',
    annotation: 'say hello',
    activity: 'Activity',
    themes: 'Themes',
    topics: 'All topics',
    experience: 'Experience',
    present: 'Jun 2026 — Present',
    scmpWork: 'Engineering · Search & AI systems',
    moreExperience: 'More',
    education: 'Education',
    degree: 'M.Eng. in Computer Science and Technology',
    graduated: 'Shandong Normal University · 2020',
    awards: 'Selected awards',
    acmAward: 'ACM Provincial Second Prize',
    modelingAward: 'Mathematical Modeling Provincial First Prize',
    workingSet: 'Working set',
    projects: 'Projects',
    githubProfile: 'GitHub profile',
    writing: 'Latest writing',
    archive: 'All writing',
    since: 'Su · Since 2022',
    built: 'Built with Valaxy, deployed on GitHub Pages.',
    language: 'Language',
    darkMode: 'Toggle dark mode',
    search: 'Search',
    copyEmail: 'Copy email address',
    emailCopied: 'Email copied',
    emailAddress: 'Email address',
    dismiss: 'Dismiss',
    description: 'Search systems, AI agents, data-intensive software, and engineering notes by Su.',
  },
  zh: {
    name: '苏',
    role: '搜索 · Agent · 数据系统',
    intro: '你好，我是苏。我做搜索与 AI 工程，也写数据密集型软件、Agent 架构和工程实践。',
    context: '这里是我的公开工作台：长期笔记、阶段性复盘，以及那些值得被讲清楚的问题。',
    latest: '给我写信',
    browse: '浏览文章',
    annotation: '聊聊吧',
    activity: '活动',
    themes: '主题',
    topics: '全部主题',
    experience: '经历',
    present: '2026 年 6 月至今',
    scmpWork: '工程 · 搜索与 AI 系统',
    moreExperience: '更多',
    education: '教育经历',
    degree: '计算机科学与技术 · 工学硕士',
    graduated: '山东师范大学 · 2020 年毕业',
    awards: '竞赛经历',
    acmAward: 'ACM 省级二等奖',
    modelingAward: '数学建模省级一等奖',
    workingSet: '工作栈',
    projects: '项目',
    githubProfile: 'GitHub 主页',
    writing: '最近写作',
    archive: '全部文章',
    since: '苏 · 写于 2022 至今',
    built: '使用 Valaxy 构建，部署于 GitHub Pages。',
    language: '语言',
    darkMode: '切换深色模式',
    search: '搜索',
    copyEmail: '复制邮箱地址',
    emailCopied: '邮箱已复制',
    emailAddress: '邮箱地址',
    dismiss: '关闭',
    description: '苏的搜索系统、AI Agent、数据密集型软件与工程笔记。',
  },
} as const

const focusAreas = [
  {
    icon: 'i-ri-search-eye-line',
    name: { en: 'Search systems', zh: '搜索系统' },
    detail: { en: 'retrieval, relevance, ranking', zh: '召回、相关性与排序' },
  },
  {
    icon: 'i-ri-robot-2-line',
    name: { en: 'Agent systems', zh: 'Agent 系统' },
    detail: { en: 'harness, evaluation, multi-agent', zh: '框架、评测与多 Agent' },
  },
  {
    icon: 'i-ri-database-2-line',
    name: { en: 'Data systems', zh: '数据系统' },
    detail: { en: 'DDIA, distributed trade-offs', zh: 'DDIA 与分布式权衡' },
  },
  {
    icon: 'i-ri-tools-line',
    name: { en: 'Engineering', zh: '工程实践' },
    detail: { en: 'tools, practice, reflection', zh: '工具、实践与复盘' },
  },
] as const

const workingGroups = [
  {
    label: { en: 'Languages', zh: '语言' },
    items: [
      { name: 'Java', icon: 'i-simple-icons-openjdk' },
      { name: 'Python', icon: 'i-simple-icons-python' },
      { name: 'TypeScript', icon: 'i-simple-icons-typescript' },
    ],
  },
  {
    label: { en: 'Search & data', zh: '搜索与数据' },
    items: [
      { name: 'Elasticsearch', icon: 'i-simple-icons-elasticsearch' },
      { name: 'PostgreSQL', icon: 'i-simple-icons-postgresql' },
      { name: 'Redis', icon: 'i-simple-icons-redis' },
    ],
  },
  {
    label: { en: 'Modeling', zh: '模型训练' },
    items: [
      {
        name: 'BERT · Multi-label fine-tuning',
        localizedName: { en: 'BERT · Multi-label fine-tuning', zh: 'BERT · 多标签分类训练' },
        icon: 'i-ri-brain-line',
      },
    ],
  },
  {
    label: { en: 'Product stack', zh: '产品技术栈' },
    items: [
      { name: 'Next.js', icon: 'i-simple-icons-nextdotjs' },
      { name: 'Vercel', icon: 'i-simple-icons-vercel' },
      { name: 'Supabase', icon: 'i-simple-icons-supabase' },
    ],
  },
  {
    label: { en: 'Infrastructure', zh: '基础设施' },
    items: [
      { name: 'Docker', icon: 'i-simple-icons-docker' },
      { name: 'Kubernetes', icon: 'i-simple-icons-kubernetes' },
      { name: 'Linux', icon: 'i-simple-icons-linux' },
    ],
  },
  {
    label: { en: 'Workflow', zh: '工作流' },
    items: [
      { name: 'GitHub', icon: 'i-simple-icons-github' },
      { name: 'Codex', icon: 'i-simple-icons-openai' },
      { name: 'Claude Code', icon: 'i-simple-icons-claude' },
      { name: 'Cursor', icon: 'i-simple-icons-cursor' },
    ],
  },
] as const

const projectDescriptions: Record<string, Record<HomeLocale, string>> = {
  'learn-real-claude-code': {
    en: 'A source-guided study of industrial TypeScript agent architecture.',
    zh: '沿源码理解工业级 TypeScript Agent 架构。',
  },
  'shadow-reading': {
    en: 'An immersive English speaking tool built around shadow reading.',
    zh: '围绕影子跟读法构建的沉浸式英语口语工具。',
  },
  'Tokdash': {
    en: 'A local dashboard for agent sessions, token usage, cost, and quota trends.',
    zh: '查看 Agent 会话、Token 用量、费用与配额趋势的本地仪表盘。',
  },
}

const featuredProjects = computed(() => (projectsSnapshot.projects as ProjectSnapshot[]).map(project => ({
  ...project,
  description: projectDescriptions[project.name]?.[locale.value] || project.description,
})))

const t = computed(() => copy[locale.value])

useHead(computed(() => ({
  title: locale.value === 'en' ? 'Su — Search, Agents & Data Systems' : '苏 — 搜索、Agent 与数据系统',
  htmlAttrs: { lang: locale.value === 'en' ? 'en' : 'zh-CN' },
  meta: [{ name: 'description', content: t.value.description }],
})))

function postTitle(post: Post) {
  if (typeof post.title === 'string')
    return post.title
  return post.title?.[locale.value === 'en' ? 'en' : 'zh-CN']
    || post.title?.['zh-CN']
    || post.title?.en
    || 'Untitled'
}

function languageLabel(post: HomePost) {
  return postLocale(post) === 'zh' ? '中文' : 'EN'
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

function dismissEmailToast() {
  emailToastVisible.value = false
  if (emailToastTimer)
    clearTimeout(emailToastTimer)
}

async function showEmailToast() {
  emailCopied.value = false
  try {
    await navigator.clipboard.writeText(emailAddress)
    emailCopied.value = true
  }
  catch {
    // The address remains visible when clipboard access is unavailable.
  }

  emailToastVisible.value = true
  if (emailToastTimer)
    clearTimeout(emailToastTimer)
  emailToastTimer = setTimeout(() => {
    emailToastVisible.value = false
  }, 3600)
}

onBeforeUnmount(() => {
  if (emailToastTimer)
    clearTimeout(emailToastTimer)
})
</script>

<template>
  <main class="portfolio-home">
    <div class="portfolio-frame">
      <header class="profile-header home-reveal home-reveal-1">
        <div>
          <h1 class="profile-title">
            <RouterLink class="profile-name" to="/" :aria-label="`${t.name} home`">
              {{ t.name }}
            </RouterLink>
          </h1>
          <p class="profile-role">
            {{ t.role }}
          </p>
        </div>

        <div class="profile-tools">
          <nav class="profile-actions" aria-label="Social links">
            <a href="https://github.com/674019130" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
              <span class="i-ri-github-line" aria-hidden="true" />
            </a>
            <a class="optional-social" href="https://www.zhihu.com/people/meng-bo-lin-50" target="_blank" rel="noreferrer" aria-label="Zhihu" title="Zhihu">
              <span class="i-ri-zhihu-line" aria-hidden="true" />
            </a>
            <a class="optional-social" href="https://space.bilibili.com/85830279" target="_blank" rel="noreferrer" aria-label="Bilibili" title="Bilibili">
              <span class="i-ri-bilibili-line" aria-hidden="true" />
            </a>
            <button type="button" :aria-label="t.copyEmail" :title="t.copyEmail" @click="showEmailToast">
              <span class="i-ri-mail-line" aria-hidden="true" />
            </button>
            <a class="optional-social" href="/atom.xml" aria-label="RSS" title="RSS">
              <span class="i-ri-rss-line" aria-hidden="true" />
            </a>
          </nav>

          <span class="tool-divider" aria-hidden="true" />

          <div class="locale-switch" role="group" :aria-label="t.language">
            <button :class="{ active: locale === 'en' }" type="button" @click="locale = 'en'">
              EN
            </button>
            <button :class="{ active: locale === 'zh' }" type="button" @click="locale = 'zh'">
              中
            </button>
          </div>
          <YunToggleDark class="home-icon-button" :title="t.darkMode" transition />
          <YunSearchTrigger />
        </div>
      </header>

      <section class="intro home-reveal home-reveal-2" aria-label="Introduction">
        <p>{{ t.intro }}</p>
        <p>{{ t.context }}</p>

        <div class="intro-actions-wrap">
          <a
            class="hand-note"
            href="mailto:nostarsbutmyeyes@gmail.com"
            :aria-label="locale === 'en' ? 'Email Su' : '给苏写邮件'"
          >
            <span>{{ t.annotation }}</span>
            <svg viewBox="0 0 94 28" fill="none">
              <path d="M4 8C24 22 52 22 84 12" />
              <path d="M76 9L85 12L79 19" />
            </svg>
          </a>
          <div class="intro-actions">
            <a class="primary-action" href="mailto:nostarsbutmyeyes@gmail.com">
              {{ t.latest }}
              <span class="i-ri-arrow-right-line" aria-hidden="true" />
            </a>
            <RouterLink class="secondary-action" to="/archives/">
              {{ t.browse }}
            </RouterLink>
          </div>
        </div>
      </section>

      <HomeActivity :locale="locale" :heading="t.activity" class="home-reveal home-reveal-3" />

      <section class="home-section home-reveal home-reveal-4" aria-labelledby="themes-title">
        <div class="section-heading">
          <h2 id="themes-title">
            {{ t.themes }}
          </h2>
          <RouterLink class="section-link" to="/tags/">
            {{ t.topics }}
            <span class="i-ri-arrow-right-line" aria-hidden="true" />
          </RouterLink>
        </div>

        <div class="themes-grid">
          <div v-for="(area, index) in focusAreas" :key="area.name.en" class="theme-item">
            <div class="theme-marker" aria-hidden="true">
              <span :class="{ active: index === 0 }" />
            </div>
            <div class="theme-name">
              <span class="theme-icon"><span :class="area.icon" aria-hidden="true" /></span>
              <strong>{{ area.name[locale] }}</strong>
            </div>
            <p>{{ area.detail[locale] }}</p>
          </div>
        </div>
      </section>

      <section class="home-section home-reveal home-reveal-5" aria-labelledby="experience-title">
        <div class="section-heading">
          <h2 id="experience-title">
            {{ t.experience }}
          </h2>
        </div>

        <div class="experience-row">
          <div class="experience-line" aria-hidden="true">
            <span />
          </div>
          <div class="experience-main">
            <strong>South China Morning Post</strong>
            <span>{{ t.scmpWork }}</span>
          </div>
          <time datetime="2026-06">{{ t.present }}</time>
        </div>

        <details class="experience-details">
          <summary>
            {{ t.moreExperience }}
            <span class="i-ri-arrow-down-s-line" aria-hidden="true" />
          </summary>
          <div class="experience-details-content">
            <div>
              <span>{{ t.education }}</span>
              <strong>{{ t.degree }}</strong>
              <small>{{ t.graduated }}</small>
            </div>
            <div>
              <span>{{ t.awards }}</span>
              <strong>{{ t.acmAward }}</strong>
              <small>{{ t.modelingAward }}</small>
            </div>
          </div>
        </details>
      </section>

      <section class="home-section home-reveal home-reveal-5" aria-labelledby="working-title">
        <div class="section-heading">
          <h2 id="working-title">
            {{ t.workingSet }}
          </h2>
        </div>

        <div class="working-list">
          <div v-for="group in workingGroups" :key="group.label.en" class="working-row">
            <span class="working-label">{{ group.label[locale] }}</span>
            <div class="working-items">
              <span v-for="item in group.items" :key="item.name" class="working-item">
                <span :class="item.icon" aria-hidden="true" />
                {{ 'localizedName' in item ? item.localizedName[locale] : item.name }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="home-section home-reveal home-reveal-5" aria-labelledby="projects-title">
        <div class="section-heading">
          <h2 id="projects-title">
            {{ t.projects }}
          </h2>
          <a class="section-link" href="https://github.com/674019130?tab=repositories" target="_blank" rel="noreferrer">
            {{ t.githubProfile }}
            <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
          </a>
        </div>

        <ol class="project-list">
          <li v-for="project in featuredProjects" :key="project.name">
            <a :href="project.url" target="_blank" rel="noreferrer">
              <span class="project-copy">
                <strong>{{ project.name }}</strong>
                <span>{{ project.description }}</span>
              </span>
              <span class="project-meta">
                <span v-if="project.language">{{ project.language }}</span>
                <span><span class="i-ri-star-line" aria-hidden="true" /> {{ project.stars }}</span>
              </span>
              <span class="i-ri-arrow-right-up-line project-arrow" aria-hidden="true" />
            </a>
          </li>
        </ol>
      </section>

      <section class="home-section home-reveal home-reveal-5" aria-labelledby="writing-title">
        <div class="section-heading">
          <h2 id="writing-title">
            {{ t.writing }}
          </h2>
          <RouterLink class="section-link" to="/archives/">
            {{ t.archive }}
            <span class="i-ri-arrow-right-line" aria-hidden="true" />
          </RouterLink>
        </div>

        <ol class="writing-list">
          <li v-for="entry in recentWriting" :key="entry.key" class="writing-row">
            <div class="writing-copy">
              <AppLink
                class="writing-title"
                :to="entry.post.path || '/archives/'"
                :lang="entry.post.lang"
              >
                {{ postTitle(entry.post) }}
              </AppLink>
              <nav v-if="entry.variants.length > 1" class="writing-languages" :aria-label="locale === 'en' ? 'Article languages' : '文章语言版本'">
                <AppLink
                  v-for="variant in entry.variants"
                  :key="variant.path"
                  :to="variant.path || '/archives/'"
                  :lang="variant.lang"
                  :hreflang="variant.lang"
                  :class="{ active: variant.path === entry.post.path }"
                >
                  {{ languageLabel(variant) }}
                </AppLink>
              </nav>
            </div>
            <time :datetime="String(entry.post.date)">{{ formatDate(entry.post.date) }}</time>
            <AppLink
              class="writing-arrow"
              :to="entry.post.path || '/archives/'"
              :aria-label="postTitle(entry.post)"
            >
              <span class="i-ri-arrow-right-up-line" aria-hidden="true" />
            </AppLink>
          </li>
        </ol>
      </section>

      <footer class="home-footer home-reveal home-reveal-5">
        <span>{{ t.since }}</span>
        <span>{{ t.built }}</span>
      </footer>
    </div>

    <Transition name="email-toast">
      <aside v-if="emailToastVisible" class="email-toast" role="status" aria-live="polite">
        <span class="email-toast-icon" aria-hidden="true">
          <span :class="emailCopied ? 'i-ri-check-line' : 'i-ri-mail-line'" />
        </span>
        <span class="email-toast-copy">
          <strong>{{ emailCopied ? t.emailCopied : t.emailAddress }}</strong>
          <span>{{ emailAddress }}</span>
        </span>
        <button type="button" :aria-label="t.dismiss" :title="t.dismiss" @click="dismissEmailToast">
          <span class="i-ri-close-line" aria-hidden="true" />
        </button>
      </aside>
    </Transition>
  </main>
</template>

<style scoped>
.portfolio-home {
  --home-bg: #fdfdfc;
  --home-text: #202220;
  --home-muted: #767a76;
  --home-soft: #f4f4f2;
  --home-rule: #dedfdd;
  --home-accent: #383b38;
  --activity-0: #ededeb;
  --activity-1: #d5d7d4;
  --activity-2: #aeb2ae;
  --activity-3: #777c78;
  --activity-4: #383d39;
  --activity-5: #202421;

  min-height: 100vh;
  background: var(--home-bg);
  color: var(--home-text);
  font-family: Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
}

.portfolio-frame {
  box-sizing: border-box;
  width: min(100%, 700px);
  margin: 0 auto;
  padding: 56px 32px 32px;
}

.profile-header,
.profile-tools,
.profile-actions,
.section-heading,
.home-footer {
  display: flex;
  align-items: center;
}

.profile-header,
.section-heading,
.home-footer {
  justify-content: space-between;
}

.profile-title,
.profile-role {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
}

.profile-title,
.profile-name {
  font-weight: 500;
}

.profile-name {
  color: var(--home-text);
  text-decoration: none;
}

.profile-role {
  color: var(--home-muted);
  font-weight: 400;
}

.profile-tools {
  gap: 2px;
}

.profile-actions {
  gap: 1px;
}

.profile-actions > a,
.profile-actions > button,
.profile-tools :deep(.home-icon-button),
.profile-tools :deep(.yun-search-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--home-muted);
  font-size: 16px;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}

.profile-actions > a:hover,
.profile-actions > button:hover,
.profile-tools :deep(.home-icon-button:hover),
.profile-tools :deep(.yun-search-btn:hover) {
  background: var(--home-soft);
  color: var(--home-text);
}

.tool-divider {
  width: 1px;
  height: 14px;
  margin: 0 5px;
  background: var(--home-rule);
}

.locale-switch {
  display: inline-grid;
  grid-template-columns: repeat(2, 27px);
  height: 26px;
  padding: 2px;
  border: 1px solid var(--home-rule);
  border-radius: 5px;
}

.locale-switch button {
  padding: 0;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--home-muted);
  font-size: 10px;
  line-height: 20px;
  cursor: pointer;
}

.locale-switch button.active {
  background: var(--home-text);
  color: var(--home-bg);
}

.portfolio-home a:focus-visible,
.portfolio-home button:focus-visible {
  outline: 2px solid var(--home-text);
  outline-offset: 2px;
}

.intro {
  padding-top: 24px;
}

.intro > p {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
}

.intro > p + p {
  margin-top: 10px;
}

.intro-actions-wrap {
  position: relative;
  margin-top: 24px;
}

.intro-actions {
  display: flex;
  gap: 8px;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid var(--home-rule);
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
}

.primary-action {
  gap: 6px;
  border-color: var(--home-text);
  background: var(--home-text);
  color: var(--home-bg);
}

.secondary-action {
  background: transparent;
  color: var(--home-text);
}

.primary-action:hover {
  opacity: .86;
}

.secondary-action:hover {
  border-color: var(--home-muted);
  background: var(--home-soft);
}

.hand-note {
  position: absolute;
  top: -9px;
  right: calc(100% + 12px);
  width: 102px;
  color: #9a9d99;
  font-family: "Bradley Hand", "Segoe Print", "Comic Sans MS", cursive;
  font-size: 14px;
  line-height: 18px;
  text-decoration: none;
  text-align: right;
  transform: rotate(-5deg);
  transform-origin: right center;
}

.hand-note svg {
  display: block;
  width: 94px;
  height: 28px;
  margin-top: -3px;
  overflow: visible;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.home-section {
  padding-top: 48px;
}

.section-heading {
  min-height: 24px;
  gap: 20px;
}

.section-heading h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--home-muted);
  font-size: 13px;
  line-height: 20px;
  text-decoration: none;
  transition: color 160ms ease;
}

.section-link:hover {
  color: var(--home-text);
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 18px;
}

.theme-item {
  min-width: 0;
}

.theme-marker {
  position: relative;
  height: 12px;
  border-top: 1px solid var(--home-rule);
}

.theme-marker span {
  position: absolute;
  top: -4px;
  left: 6px;
  width: 7px;
  height: 7px;
  border: 2px solid var(--home-bg);
  border-radius: 50%;
  background: #aeb1ae;
  box-shadow: 0 0 0 1px var(--home-rule);
}

.theme-marker span.active {
  background: var(--home-text);
}

.theme-name {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  margin-top: 5px;
  font-size: 13px;
  line-height: 20px;
}

.theme-name strong {
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.theme-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--home-rule);
  border-radius: 6px;
  background: var(--home-soft);
  color: var(--home-muted);
}

.theme-icon {
  width: 24px;
  height: 24px;
  font-size: 13px;
}

.theme-item > p {
  margin: 4px 8px 0 31px;
  color: var(--home-muted);
  font-size: 11px;
  line-height: 16px;
}

.working-list {
  margin-top: 14px;
}

.working-row {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  align-items: center;
  min-height: 42px;
}

.working-label {
  color: var(--home-muted);
  font-size: 13px;
}

.working-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
}

.working-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--home-text);
  font-size: 13px;
  line-height: 20px;
}

.working-item > span {
  color: var(--home-muted);
  font-size: 14px;
}

.experience-row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 64px;
  margin-top: 10px;
}

.experience-line {
  position: relative;
  align-self: stretch;
}

.experience-line::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 9px;
  width: 1px;
  background: var(--home-rule);
  content: "";
}

.experience-line span {
  position: absolute;
  top: 26px;
  left: 6px;
  width: 7px;
  height: 7px;
  border: 2px solid var(--home-bg);
  border-radius: 50%;
  background: var(--home-text);
  box-shadow: 0 0 0 1px var(--home-rule);
}

.experience-main {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.experience-main strong {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.experience-main span,
.experience-row time {
  color: var(--home-muted);
  font-size: 12px;
  line-height: 18px;
}

.experience-details {
  margin-left: 30px;
  border-top: 1px solid var(--home-rule);
}

.experience-details summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  min-height: 32px;
  color: var(--home-muted);
  font-size: 11px;
  line-height: 16px;
  cursor: pointer;
  list-style: none;
}

.experience-details summary::-webkit-details-marker {
  display: none;
}

.experience-details summary > span {
  font-size: 13px;
  transition: transform 160ms ease;
}

.experience-details[open] summary > span {
  transform: rotate(180deg);
}

.experience-details-content {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  padding: 2px 0 14px;
}

.experience-details-content > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.experience-details-content span,
.experience-details-content small {
  color: var(--home-muted);
  font-size: 11px;
  line-height: 16px;
}

.experience-details-content strong {
  margin: 3px 0 1px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}

.project-list,
.writing-list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.project-list > li + li,
.writing-list > li + li {
  border-top: 1px solid var(--home-rule);
}

.project-list a {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 16px;
  align-items: center;
  gap: 12px;
  min-height: 66px;
  padding: 8px 0;
  box-sizing: border-box;
  color: var(--home-text);
  text-decoration: none;
}

.project-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.project-copy strong {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.project-copy > span {
  overflow: hidden;
  color: var(--home-muted);
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--home-muted);
  font-size: 11px;
  line-height: 16px;
}

.project-meta > span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.project-arrow,
.writing-arrow {
  color: var(--home-muted);
  font-size: 13px;
}

.project-list a:hover strong,
.writing-title:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.writing-list {
  margin-top: 14px;
}

.writing-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 16px;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 7px 0;
  box-sizing: border-box;
}

.writing-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.writing-title {
  overflow: hidden;
  color: var(--home-text);
  font-size: 14px;
  font-weight: 450;
  line-height: 20px;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.writing-languages {
  display: flex;
  gap: 9px;
  min-height: 16px;
}

.writing-languages a {
  color: var(--home-muted);
  font-size: 10px;
  line-height: 16px;
  text-decoration: none;
}

.writing-languages a.active,
.writing-languages a:hover {
  color: var(--home-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.writing-list time {
  color: var(--home-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  line-height: 16px;
}

.writing-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.home-footer {
  margin-top: 56px;
  padding-top: 16px;
  border-top: 1px solid var(--home-rule);
  color: var(--home-muted);
  font-size: 11px;
  line-height: 16px;
}

.email-toast {
  position: fixed;
  z-index: 30;
  right: 24px;
  bottom: 24px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 10px;
  width: min(340px, calc(100vw - 48px));
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--home-text) 15%, var(--home-rule));
  border-radius: 6px;
  background: color-mix(in srgb, var(--home-bg) 96%, transparent);
  box-shadow: 0 12px 36px rgba(24, 26, 24, 0.12), 0 2px 8px rgba(24, 26, 24, 0.06);
  color: var(--home-text);
  backdrop-filter: blur(16px);
}

.email-toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--home-rule);
  border-radius: 5px;
  background: var(--home-soft);
  color: var(--home-text);
  font-size: 16px;
}

.email-toast-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.email-toast-copy strong {
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
}

.email-toast-copy > span {
  overflow: hidden;
  color: var(--home-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.email-toast > button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--home-muted);
  font-size: 15px;
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}

.email-toast > button:hover {
  background: var(--home-soft);
  color: var(--home-text);
}

.email-toast-enter-active,
.email-toast-leave-active {
  transition: opacity 180ms ease, transform 220ms cubic-bezier(.2, .75, .25, 1);
}

.email-toast-enter-from,
.email-toast-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.home-reveal {
  animation: home-reveal 400ms both cubic-bezier(.2, .75, .25, 1);
}

.home-reveal-1 { animation-delay: 30ms; }
.home-reveal-2 { animation-delay: 70ms; }
.home-reveal-3 { animation-delay: 110ms; }
.home-reveal-4 { animation-delay: 150ms; }
.home-reveal-5 { animation-delay: 190ms; }

@keyframes home-reveal {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 760px) {
  .portfolio-frame {
    padding: 32px 20px 28px;
  }

  .profile-role {
    font-size: 14px;
  }

  .profile-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .profile-header > div:first-child {
    display: contents;
  }

  .profile-title {
    grid-column: 1;
    grid-row: 1;
  }

  .profile-tools {
    grid-column: 2;
    grid-row: 1;
  }

  .profile-role {
    grid-column: 1 / -1;
    grid-row: 2;
    margin-top: 1px;
  }

  .optional-social,
  .tool-divider {
    display: none !important;
  }

  .profile-tools {
    gap: 0;
  }

  .profile-actions > a,
  .profile-actions > button,
  .profile-tools :deep(.home-icon-button),
  .profile-tools :deep(.yun-search-btn) {
    width: 26px;
  }

  .locale-switch {
    margin: 0 2px;
  }

  .intro {
    padding-top: 28px;
  }

  .intro-actions-wrap {
    margin-top: 46px;
  }

  .hand-note {
    top: -36px;
    right: auto;
    left: 2px;
    width: 98px;
    text-align: left;
    transform: rotate(-3deg);
    transform-origin: left center;
  }

  .hand-note svg {
    width: 74px;
    margin-left: 18px;
  }

  .home-section {
    padding-top: 44px;
  }

  .themes-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 22px;
  }

  .theme-item > p {
    margin-left: 31px;
  }

  .working-row {
    grid-template-columns: 1fr;
    gap: 5px;
    padding: 7px 0;
  }

  .working-items {
    gap: 7px 14px;
  }

  .writing-title {
    white-space: normal;
  }

  .writing-list time {
    display: none;
  }

  .writing-row {
    grid-template-columns: minmax(0, 1fr) 14px;
  }

  .experience-row {
    grid-template-columns: 20px minmax(0, 1fr);
  }

  .experience-row time {
    grid-column: 2;
  }

  .experience-details-content {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .project-list a {
    grid-template-columns: minmax(0, 1fr) 16px;
  }

  .project-meta {
    display: none;
  }

  .home-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .email-toast {
    right: 16px;
    bottom: 16px;
    width: calc(100vw - 32px);
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
