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

### CI/CD

`.github/workflows/gh-pages.yml`：push 到 `main` 后自动构建并部署到 GitHub Pages。

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

### Categories 层级

顶级分类：**技术笔记** / **读书笔记** / **生活随笔**

技术笔记二级分类：编程语言、算法与数据结构、数据库、分布式系统、工具与环境、AI与大模型、软件工程、Web开发、并发编程

### Tags

使用具体关键词，避免与分类名完全重复。读书笔记统一添加 `读书笔记` 标签。常用标签参见 `.cursor/rules/categories_and_tags_guide.mdc`。
