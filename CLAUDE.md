# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

基于 **Valaxy** (v0.26.1) 框架 + **valaxy-theme-yun** 主题的个人技术博客，部署在 GitHub Pages (`674019130.github.io`)。语言以中文为主。

## Common Commands

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 开发服务器（http://localhost:4859/）
npm run dev

# 构建静态站点
npm run build

# 预览构建产物
npm run serve

# 生成 RSS
npm run rss

# 快速提交并推送（默认 commit message: ":pencil: update content"）
bash update.sh            # 或
bash update.sh "自定义消息"
```

## Architecture

- **Valaxy** 基于 Vite + Vue 3 的静态博客框架，约定式路由
- `valaxy.config.ts` — 框架配置（主题、Markdown、插件、评论系统等）
- `site.config.ts` — 站点元数据（标题、社交链接、赞助、搜索等）
- 评论系统使用 **Waline**，搜索已启用

### Content

- 文章位于 `pages/posts/*.md`，使用 Markdown + YAML Front Matter
- 其他页面：`pages/about/`、`pages/links/`、`pages/archives/`、`pages/tags/`、`pages/categories/`

### Customization

- `components/` — 自定义 Vue 组件（自动加载）
- `layouts/` — 自定义页面布局
- `styles/` — 样式覆盖（`index.scss`、`css-vars.scss`）
- `locales/` — i18n 翻译（`en.yml`、`zh-CN.yml`）
- `public/` — 静态资源（favicon、PWA 图标、RSS feeds）

### Homepage Design

- 首页默认显示英文，并提供 `EN / 中` 页面内切换；不要把全站中文文章页强制改成英文
- 桌面端外框固定为 `700px`，左右内边距各 `32px`，正文实际宽度为 `636px`
- 姓名、正文和章节标题统一使用 `16px / 24px` 作为基础排版尺度，主要靠间距、颜色和字重区分层级，不使用营销页式超大标题
- 手写批注只作为一次性的邮件入口使用，保留 `say hello / 聊聊吧` 文案，并让曲线箭头从文字末端下方自然起笔后指向 CTA；图标集中服务于社交入口、主题和工作栈，不在文章列表里为图标预留空位
- 顶部邮箱图标点击后复制 `nostarsbutmyeyes@gmail.com` 并显示轻量 toast；首屏主 CTA 使用 `Get in touch / 联系我` 菜单，提供 `mailto:` 与首页留言两种联系路径
- 首页留言复用站点现有 Waline 服务并固定使用首页路径 `/`；组件只在首次展开时挂载，关闭后保留状态，不能影响文章页按各自路径隔离的评论
- 首页历史版本保存在 `archive/components/`，归档原因记录在 `archive/README.md`
- 首页经历当前从 `2026-06` 加入 South China Morning Post 起记录，职位为 `AI Agent Engineer`；项目展示保持三项，并优先选择原创且能体现不同能力面的仓库
- 首屏手写提示仍指向邮件联系，主 CTA 同时提供邮件和留言；阅读入口使用 `Explore writing / 浏览文章`，避免“归档”带来的过期感
- 教育与竞赛信息放在 Experience 的折叠详情中，默认收起：山东师范大学计算机科学与技术专业工学硕士（2020）、ACM 省二等奖、数学建模省一等奖
- BERT 经历是在裸 BERT 基础上完成多标签分类，不要描述为 fine-tuning；首页仅在 Search & recommendation 工作栈中低调写作 `BERT · Multi-label classification / BERT · 多标签分类`，不要单列 Modeling 或模型训练模块
- 个人定位必须同时包含搜索与推荐，英文简介明确使用 `search, recommendation, and AI systems`，中文使用 `搜索、推荐与 AI 工程`；不要把能力范围缩写成只有搜索
- 首页采用紧凑的纵向节奏：主要章节间距约 `38px`（移动端约 `34px`），模块内容通常在标题下 `10–12px` 开始，避免重新放大成松散的营销页排版
- 首页控件圆角统一使用约 `7px`，浮层、toast 与评论面板使用 `8px`；Waline 首页留言保留昵称、邮箱和网址三个输入框，以克制的辅助文案说明它们可填但非必填，并固定 `meta: ['nick', 'mail', 'link']`、`requiredMeta: []`
- 首页搜索弹层使用全屏实色中性表面，输入框对齐 `636px` 正文栅并使用 `8px` 圆角；不使用高强度模糊、透明胶囊或黑白反色的搜索结果态

### CI/CD

`.github/workflows/gh-pages.yml`：push 到 `main` 后自动构建并部署到 GitHub Pages，也会每天定时刷新首页活动数据。

### 首页活动热力图

- 站点托管在 GitHub Pages，浏览器端不能依赖本机服务，也不能携带 GitHub token
- `scripts/sync-activity.mjs` 在构建前生成 `data/activity.json`，页面只读取这份静态快照
- 默认使用 GitHub GraphQL contribution calendar；Actions 优先读取可选的 `PROFILE_GITHUB_TOKEN`，否则使用仓库自带的 `GITHUB_TOKEN`
- 本地运行 `npm run activity:github` 刷新 GitHub 数据；已登录 GitHub CLI 时无需额外配置
- 本地运行 `npm run activity:tokdash` 刷新 `data/token-activity.json`。每日数据只保留 `date` 与固定阈值强度 `level`；允许公开最近半年的总 Token、活跃天数和活跃日均值，但不得包含每日实际 token 数、费用、模型或来源明细
- Tokdash Daily activity 直接按固定 Token 阈值分级：`<100M / 100M+ / 300M+ / 500M+ / 1B+`，不使用角标或相对峰值；页面以快照最后一条 Tokdash 数据为终点，不在未同步日期后补空格
- Token Activity 的固定更新策略是：在能访问本机 Tokdash API 的环境执行 `pnpm activity:tokdash`，检查 `data/token-activity.json` 的 `generatedAt`、`period` 与 diff，运行 `pnpm test`，然后把脱敏快照提交进仓库；GitHub Actions 不运行 Tokdash 同步，部署只使用已提交的快照
- Tokdash 默认地址为 `http://127.0.0.1:55423`，可用 `TOKDASH_URL` 覆盖；同步失败且旧快照存在时，脚本会保留旧文件而不中断构建，所以必须确认输出是 `Synced tokdash activity` 且 `generatedAt` 已更新，不能只依赖退出码
- 不得为了自动同步而把 Tokdash API 公开到互联网或让浏览器直连；未来若增加自动化，应在持有 Tokdash 数据的本地主机上定时生成同一脱敏快照，再通过正常 Git 流程提交
- 首页 Activity 默认展示最近半年，Token 在前、GitHub 在后并采用上下排列；Token 同时展示总量、活跃天数和活跃日均值
- GitHub activity 和项目数据在 push 到 `main` 时刷新，并由 Actions 每天 `01:23 UTC` 再刷新一次；这是构建期快照，不是浏览器实时请求
- 定时构建只更新 Pages 构建产物，不提交每日生成的数据变更

### 首页 GitHub 项目

- `scripts/sync-projects.mjs` 在构建前从 GitHub REST API 同步三项精选仓库到 `data/projects.json`
- 默认项目顺序为 `JingbiaoMei/Tokdash`、`674019130/learn-real-claude-code`、`674019130/shadow-reading`；可通过 `GITHUB_FEATURED_PROJECTS` 传入逗号分隔的 `owner/repo` 覆盖，但首页仍应保持精简
- 页面只读取静态快照，不能在浏览器端请求 GitHub API；Actions 与活动热力图共用 token 回退策略
- 本地运行 `npm run projects:github` 刷新项目数据

## Writing Conventions

### Front Matter 模板

```markdown
---
title: 文章标题
date: YYYY-MM-DD
tags: [标签1, 标签2]
categories: [分类]
postTitleClass: 'text-#颜色值'
---

摘要内容...

<!-- more -->

正文...
```

- `<!-- more -->` 用于分隔摘要与正文，必须添加
- `postTitleClass` 可选，用于自定义标题颜色

### 文章内部链接

- 文章路径统一使用无尾斜杠的扩展名省略形式，例如 `/posts/example-post`
- 不要写成 `/posts/example-post/`。Valaxy SSG 生成的是 `dist/posts/example-post.html`；GitHub Pages 会将无尾斜杠路径映射到该文件，但会把带尾斜杠路径当作目录并寻找 `index.html`，导致首次 HTTP 请求返回 404
- 404 页面加载 Valaxy 客户端路由后可能仍能渲染文章，因此浏览器会表现为“先显示 404，再打开成功”；这不是服务端重定向
- 双语文章互链和相关文章链接都必须遵守此规则
- 双语文章使用相同的 `translationKey` 形成一组；首页只展示一个主题条目，并提供 `EN / 中文` 直达入口
- 双语正文顶部使用 `PostLanguageSwitch`，同时生成可见语言切换、正确的页面 `lang` 和 `rel="alternate" hreflang` 元数据

### Categories 层级

顶级分类：**技术笔记** / **读书笔记** / **生活随笔**

技术笔记二级分类：编程语言、算法与数据结构、数据库、分布式系统、工具与环境、AI与大模型、软件工程、Web开发、并发编程

### Tags

使用具体关键词，避免与分类名完全重复。读书笔记统一添加 `读书笔记` 标签。常用标签参见 `.cursor/rules/categories_and_tags_guide.mdc`。
