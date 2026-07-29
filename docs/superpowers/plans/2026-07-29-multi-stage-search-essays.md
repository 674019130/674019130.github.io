# Multi-Stage Search Essays and Blog Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish standalone Chinese and English essays about multi-stage search ranking, upgrade the compatible Valaxy stack, and replace the accumulated homepage pins with a curated six-post order while hiding Stats Card.

**Architecture:** Keep the two language versions as independent Valaxy posts with explicit language metadata and reciprocal links. Upgrade the framework and theme as one coordinated dependency change, migrate the removed config key, then apply content-only frontmatter changes for homepage curation. Validate the result through reproducible installs, TypeScript, SSG build, rendered-page inspection, and a public-information scan.

**Tech Stack:** Valaxy 0.28.11, valaxy-theme-yun 0.28.11, Markdown, Mermaid, TypeScript 5.9.3, pnpm 10.14.0, GitHub Pages Actions.

## Global Constraints

- Work on branch `blog/multi-stage-search-essays`; do not push or merge `main` during implementation.
- Preserve every existing article file and route; removing a `top` field is allowed, deleting a post is not.
- Keep TypeScript at `^5.9.3` and `packageManager` at `pnpm@10.14.0`.
- Use Valaxy and valaxy-theme-yun `^0.28.11`, valaxy-addon-bangumi `^0.4.0`, and valaxy-addon-twikoo `^0.0.4`.
- Keep company names, service names, internal acronyms, request/debug fields, real business examples, exact thresholds, weights, windows, formulas, and language-routing rules out of both public posts.
- Keep `.github/workflows/gh-pages.yml` unchanged; a push to `main` remains the only publication trigger.
- Update both tracked lockfiles so their direct dependency versions match `package.json`.
- Do not treat pre-existing TypeScript diagnostics as new regressions; record the exact baseline and post-change commands if any remain.

---

### Task 1: Upgrade the Valaxy Dependency Set

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `package-lock.json`
- Modify: `valaxy.config.ts`

**Interfaces:**
- Consumes: the existing Valaxy site configuration and both tracked lockfiles.
- Produces: a reproducible Valaxy 0.28.11 build with unchanged dead-link behavior.

- [ ] **Step 1: Capture the baseline install, type-check, and build status**

Run:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm build
```

Expected: install and SSG build exit 0. Record the complete `tsc` command and diagnostics if the existing project does not type-check cleanly.

- [ ] **Step 2: Update direct dependency declarations**

Apply these exact `package.json` changes and leave all other versions unchanged:

```json
{
  "dependencies": {
    "valaxy": "^0.28.11",
    "valaxy-addon-bangumi": "^0.4.0",
    "valaxy-addon-components": "^0.1.0",
    "valaxy-addon-lightgallery": "^0.0.4",
    "valaxy-addon-twikoo": "^0.0.4",
    "valaxy-addon-waline": "^0.2.1",
    "valaxy-theme-yun": "^0.28.11"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

- [ ] **Step 3: Migrate the removed Valaxy config field**

Replace the root-level setting:

```ts
ignoreDeadLinks: true,
```

with this root-level build block in `defineValaxyConfig`:

```ts
build: {
  ignoreDeadLinks: true,
},
```

Expected: dead links remain ignored, using the supported Valaxy 0.28.11 location.

- [ ] **Step 4: Regenerate both tracked lockfiles**

Run:

```bash
pnpm install --lockfile-only
npm install --package-lock-only --ignore-scripts
```

Expected: `pnpm-lock.yaml` and `package-lock.json` resolve the four changed direct dependencies to their declared versions without changing TypeScript or pnpm.

- [ ] **Step 5: Verify the upgraded framework in isolation**

Run:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm build
git diff --check
```

Expected: install and build exit 0. Type-check is either clean or has no diagnostics beyond the recorded baseline. `git diff --check` prints nothing.

- [ ] **Step 6: Commit the dependency upgrade**

```bash
git add package.json pnpm-lock.yaml package-lock.json valaxy.config.ts
git commit -m "chore: upgrade Valaxy to 0.28.11"
```

### Task 2: Write the Chinese and English Search Essays

**Files:**
- Create: `pages/posts/multi-stage-search-ranking-zh.md`
- Create: `pages/posts/multi-stage-search-ranking-en.md`

**Interfaces:**
- Consumes: Valaxy Markdown/frontmatter and built-in Mermaid rendering from Task 1.
- Produces: two standalone posts at `/posts/multi-stage-search-ranking-zh/` and `/posts/multi-stage-search-ranking-en/` with reciprocal links.

- [ ] **Step 1: Create the Chinese post frontmatter and summary**

Use this exact frontmatter:

```yaml
---
title: 当相关性遇见时效性：多阶段搜索排序的工程设计
date: 2026-07-29 12:00:00
lang: zh-CN
tags: [Search, Information Retrieval, BM25, ANN, Rerank]
categories: [技术笔记, 软件工程]
toc: true
top: 100
---
```

Open with the thesis that production search is a sequence of decisions about objectives, candidate sets, priors, and expensive ranking stages—not a single scoring formula. Place `<!-- more -->` after the Chinese summary and link the English version as `/posts/multi-stage-search-ranking-en/`.

- [ ] **Step 2: Write the Chinese conceptual flow**

Use these section headings in order:

```markdown
## 先选择目标，再讨论算法
## 一张图看懂两条排序路径
## 相关性路径：从候选到最终顺序
## 为什么时效性要出现两次
## Rerank 不是推倒重来
## 时间排序也需要相关性门槛
## 拿到一个 Query，如何推断它的结果
## 设计边界与常见误区
## 结语
```

The diagnostic section walks through five observable stages: choose the ordering objective; infer lexical and semantic candidate sources; identify quality filtering/cutoff; identify base score, two freshness adjustments, and rerank; explain the final ordering and likely failure stage.

- [ ] **Step 3: Add three Chinese Mermaid diagrams**

The overview diagram branches from the query into relevance-first and time-first objectives. The relevance diagram contains separate nodes in this order:

```text
Lexical recall + semantic recall
→ first freshness prior
→ score normalization and fusion
→ second freshness calibration
→ rerank with the base score retained
→ final ordering
```

The time diagram contains:

```text
Lexical recall
→ match-quality groups
→ adaptive cutoff
→ newest/oldest ordering
```

Use conceptual labels only. Do not show numeric thresholds, weights, internal names, special-query dictionaries, language routing, or vendor details.

- [ ] **Step 4: Create the English post frontmatter and summary**

Use this exact frontmatter:

```yaml
---
title: "When Relevance Meets Recency: Engineering a Multi-Stage Search Ranking System"
date: 2026-07-29 12:05:00
lang: en
tags: [Search, Information Retrieval, BM25, ANN, Rerank]
categories: [技术笔记, 软件工程]
toc: true
top: 90
---
```

Write an idiomatic English summary rather than a sentence-by-sentence translation, place `<!-- more -->` after it, and link the Chinese version as `/posts/multi-stage-search-ranking-zh/`.

- [ ] **Step 5: Write the standalone English article**

Use these section headings in order:

```markdown
## Choose the Objective Before the Algorithm
## Two Ranking Paths at a Glance
## The Relevance Path: From Candidates to Final Order
## Why Freshness Appears Twice
## Reranking Should Not Erase the Prior
## Chronological Sorting Still Needs a Relevance Gate
## Given a Query, How Can We Reason About Its Results?
## Design Boundaries and Common Misconceptions
## Closing Thoughts
```

Cover the same reasoning model and diagrams as the Chinese post, but phrase the examples and transitions naturally for an English technical audience. Keep both posts independently understandable.

- [ ] **Step 6: Scan the posts for completeness and public safety**

Run:

```bash
rg -n 'TBD|TODO|FIXME|PLACEHOLDER|待补充|内部|公司|服务名|索引名|debug|request field|threshold =|weight =' pages/posts/multi-stage-search-ranking-{zh,en}.md
rg -n '^## ' pages/posts/multi-stage-search-ranking-{zh,en}.md
rg -n '^```mermaid|<!-- more -->|multi-stage-search-ranking-(zh|en)' pages/posts/multi-stage-search-ranking-{zh,en}.md
```

Expected: no placeholders or exposed implementation identifiers; each post has nine headings, one excerpt marker, a reciprocal link, and three Mermaid blocks.

- [ ] **Step 7: Commit the bilingual articles**

```bash
git add pages/posts/multi-stage-search-ranking-zh.md pages/posts/multi-stage-search-ranking-en.md
git commit -m "docs: publish bilingual multi-stage search essays"
```

### Task 3: Recurate Homepage Pins and Hide Stats Card

**Files:**
- Modify: `pages/posts/AI Horseless Carriages.md`
- Modify: `pages/posts/Cursor 实践总结.md`
- Modify: `pages/posts/DSPy 0x01.md`
- Modify: `pages/posts/Google Prompt Engineering 白皮书阅读笔记.md`
- Modify: `pages/posts/Sharing Valuable Articles on AI Usage.md`
- Modify: `pages/posts/Stats Card.md`
- Modify: `pages/posts/Windows 下 docker 使用笔记.md`
- Modify: `pages/posts/hexo-to-valaxy-migration.md`
- Modify: `pages/posts/从Chatbot到Multi-Agent-v1批评与改进点.md`
- Modify: `pages/posts/从Chatbot到Multi-Agent-架构演进-v1.md`
- Modify: `pages/posts/从Chatbot到Multi-Agent-架构演进-v2.md`
- Modify: `pages/posts/评测迭代 0x01.md`
- Modify: `pages/posts/北京、海、雨.md`
- Modify: `pages/posts/（空）Google Agent Companion 白皮书阅读笔记.md`

**Interfaces:**
- Consumes: Valaxy's descending numeric `top` ordering and `hide: true` semantics.
- Produces: exactly six pinned posts and a Stats Card route excluded from the homepage and archives.

- [ ] **Step 1: Assign the approved pin values**

Set this exact mapping; the new posts already received their values in Task 2:

```text
100  multi-stage-search-ranking-zh.md
 90  multi-stage-search-ranking-en.md
 80  从Chatbot到Multi-Agent-架构演进-v2.md
 70  评测迭代 0x01.md
 60  从Chatbot到Multi-Agent-v1批评与改进点.md
 50  北京、海、雨.md
```

- [ ] **Step 2: Remove all unapproved pin fields**

Remove `top:` from these exact files:

```text
pages/posts/AI Horseless Carriages.md
pages/posts/Cursor 实践总结.md
pages/posts/DSPy 0x01.md
pages/posts/Google Prompt Engineering 白皮书阅读笔记.md
pages/posts/Sharing Valuable Articles on AI Usage.md
pages/posts/Windows 下 docker 使用笔记.md
pages/posts/hexo-to-valaxy-migration.md
pages/posts/从Chatbot到Multi-Agent-架构演进-v1.md
pages/posts/（空）Google Agent Companion 白皮书阅读笔记.md
```

Do not change their titles, bodies, routes, or existing `hide` values. Stats Card is handled separately in Step 3.

- [ ] **Step 3: Hide Stats Card without deleting it**

In `pages/posts/Stats Card.md`, replace its `top` field with:

```yaml
hide: true
```

Expected: the file and direct route remain, while Valaxy excludes it from the index and archives.

- [ ] **Step 4: Verify the complete frontmatter state**

Run:

```bash
rg -n --glob '*.md' '^(title|top|hide):' pages/posts
```

Expected: exactly six `top:` lines with values `100`, `90`, `80`, `70`, `60`, and `50`; `Stats Card.md` contains `hide: true` and no `top:` line; no other body content changes are present.

- [ ] **Step 5: Commit the homepage curation**

```bash
git add pages/posts
git commit -m "content: refresh pinned posts and hide stats card"
```

### Task 4: Validate the Rendered Blog

**Files:**
- Verify: `dist/`
- Verify: `pages/posts/multi-stage-search-ranking-zh.md`
- Verify: `pages/posts/multi-stage-search-ranking-en.md`
- Verify: `pages/posts/Stats Card.md`
- Verify: all files changed since `main`

**Interfaces:**
- Consumes: the dependency, article, and frontmatter commits from Tasks 1–3.
- Produces: evidence that the branch is safe to review and later merge into `main` for automatic deployment.

- [ ] **Step 1: Run final reproducibility and static checks**

Run:

```bash
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm build
git diff --check main...HEAD
git status --short --branch
```

Expected: install and build exit 0; type-check has no new diagnostics compared with Task 1; diff check prints nothing; only generated ignored files may exist outside Git status.

- [ ] **Step 2: Inspect generated routes and index content**

Run:

```bash
find dist -type f -name 'index.html' | rg 'multi-stage-search-ranking-(zh|en)|[Ss]tats'
rg -l 'When Relevance Meets Recency|当相关性遇见时效性' dist/index.html dist/posts/*/index.html
rg -l 'Stats Card' dist/index.html dist/archives/index.html dist/posts/*/index.html
```

Expected: both new post routes exist and appear on the homepage; Stats Card appears only in its direct generated post route, not in homepage or archives.

- [ ] **Step 3: Preview and visually inspect the built site**

Run:

```bash
pnpm serve --host 127.0.0.1
```

Inspect the homepage, both new article routes, archives, search UI, and Stats Card direct route at desktop and narrow widths. Expected: the six pinned posts appear in approved order; all six Mermaid diagrams render; headings and TOCs are readable; reciprocal links work; no hydration error or clipped diagram is visible.

- [ ] **Step 4: Review the branch diff and dependency impact**

Run:

```bash
git diff --stat main...HEAD
git diff --name-status main...HEAD
git log --oneline --decorate main..HEAD
pnpm outdated --long
```

Expected: only the design/plan, two posts, dependency/config files, lockfiles, and intended frontmatter files changed. Remaining outdated entries are only deferred TypeScript 7 and pnpm 11 toolchain majors or packages already at their latest stable version.

- [ ] **Step 5: Record the handoff without publishing**

Report the branch name, commit list, exact validation commands, any pre-existing diagnostics, homepage behavior change, Valaxy/Node compatibility requirement, and the fact that merging or pushing to `main` will trigger automatic GitHub Pages deployment. Do not push or merge until the user explicitly approves publication.
