---
title: 对自己写的东西做一次中肯 Review：Agent 架构文的十个盲点
date: 2026-04-13 22:25:00
tags: [Agent, LLM, 反思, Review, 写作]
categories: [技术笔记, AI与大模型]
postTitleClass: 'text-#c8956c'
top: 60
readmore: true
toc: true
---

> 我把 v1 的 Agent 架构长文交给 Claude 做了一次"中肯评价"，让它 think harder，告诉我哪里写错了、哪里视野不够、哪里是我看不到的盲点。结果是一份比我想象中更狠的 review。这篇文章就是这份 review 本身——作为一份"对自己写的东西做系统 review"的模板，同时也是 [v2](/posts/从Chatbot到Multi-Agent-架构演进-v2/) 改写的起点。
>
> v1 见 [这里](/posts/从Chatbot到Multi-Agent-架构演进-v1/) 。

<!-- more -->

## 核心论点的问题

**v1 反复强调"主循环从未改变"——这是美学陈述，不是事实。**

被保留的是**消息往返抽象**，不是主循环本身。主循环经历了四次形变：

1. **同步 → 流式**：现代 Agent 是 token 级流式，工具调用可以在生成过程中被解析并提前触发。主循环变成了有状态事件解析器。
2. **不可中断 → 可抢占**：Claude Code 的 ESC 中断、用户随时注入新消息，意味着主循环必须是 preemptable state machine。
3. **Reasoning/thinking 阶段**：o1/o3/Claude extended thinking 引入了对用户不可见的中间态，有独立计费、缓存、观测需求。
4. **while loop → 显式 FSM**：Claude Code 的 Plan Mode / Edit Mode / Auto-accept Mode 是不同的合法动作集，已经不是 while + 补丁能描述的。

把演进写成连续的，会让读者低估下一次断层。

---

## 十个盲点

### 盲点 1：模型与 harness 是共进化的

最大盲点。v1 把模型当黑盒/常量，harness 当变量。

真实故事：Claude Code 的 harness 设计被**回灌进 Claude 4.x 的训练数据**。Anthropic 专门训练模型去适应自己的 harness 行为。结果是——你看到的"最佳实践"很多不是来自原理，而是来自这一代模型恰好被训练成这样。

比喻修正：不是"发动机稳定，车架精细化"，更像是"发动机每三个月换一台，车架必须重新设计"。

### 盲点 2：Eval 不是子章节，是瓶颈

v1 把 eval 塞在可观测性里，篇幅很短。真实情况：**Agent 开发的限速环节是 eval**。

Eval 难题：
- 分布漂移
- 快 vs 准的矛盾
- LLM-as-judge 的偏见（judge 和被评估同源时互相偏袒）
- 长尾故障采样

为什么是瓶颈：Agent 输出高方差、多路径、长尾。没有 eval 根本不知道改动是变好还是变坏。

### 盲点 3：成本经济学与 unit economics

v1 只提了 prompt cache。缺失的病态：

- **失败的代价 ≈ 成功的代价**
- **Spiral of death**：Agent 卡住 → 重试 → 上下文膨胀 → 每轮更贵
- **Multi-agent 放大效应**：N 个 Agent 两两通信是 O(N²)
- **Unit economics 决定商业模式**：一次任务成本决定能不能订阅制/包月
- **Agent 不知道自己的预算**：跑到没钱也不会因为"花得差不多了"而收敛

预算管理完全在 harness 层，是一个开放问题。

### 盲点 4：Prompt Injection 完全没提

最严重漏洞。是 Agent 安全的"未解难题"，等同于分布式系统里的"没有 perfect failure detector"。

形态：
- 直接注入（网页里嵌"忽略之前的指令"）
- 间接注入（zero-width 字符藏指令）
- Confused deputy
- 数据外泄
- MCP 供应链攻击

没有根治方案，只有纵深防御：
- 沙盒网络白名单
- 二次 LLM 清洗（自己也可能被注入）
- 写操作人类门禁
- 敏感环境变量隔离
- XML 标签标注"不可信内容"
- 能力边界 explicit 告知模型

沙盒只防 shell 层，不防语义层。**Prompt Injection 才是 Agent 安全的主战场。**

### 盲点 5：Human-in-the-loop 是设计轴

v1 把 Agent 写成自主决策单元，框架太强。真实谱系：

```
完全自主 ←──────────────────────────→ 完全手动
(后台研究) (CC auto) (CC plan) (Cursor Tab) (Copilot 补全)
```

这条轴上的每个点是不同的产品，有不同的 harness、用户期望、错误容忍度、eval 方法。

Claude Code / Cursor / ChatGPT Agent 都支持"中断 → 继续"。这不是辅助功能，是产品定义。

### 盲点 6：缺少"失败模式目录"

DDIA 的精髓是讲故障。v1 全是 happy path。

对应的 Agent 失败目录：
- Context poisoning（一次错误工具结果污染后续推理）
- Goal drift（跑着忘了任务）
- Premature stopping（过早完成）
- Overconfident hallucination（编造未返回的工具结果）
- Repetition trap（同一错误动作试 20 次）
- Refusal cascade
- Scope creep
- Silent truncation（压缩后模型不知道）
- Context anxiety（长上下文下的焦虑表现）
- Tool result gaslighting（空/误导性的工具返回）

每一种都对应一套缓解。Todo 工具的重要性在这里被凸显——它是缓解 goal drift 和 silent truncation 的关键。

### 盲点 7：UI/UX 是架构的一部分

v1 是 server-side 视角。但 Agent 产品命脉在前端：

- 流式工具调用渲染
- Diff 预览
- 错误纠正 UI
- 长任务进度反馈
- 优雅中断

Claude Code 的成功有一半来自 TUI 交互设计。这块太大，v2 只需要点一下观点即可。

### 盲点 8：Determinism、现场保存与还原

Agent 默认不确定。生产环境需要：

- 可复现的 trace（尽量逼近）
- Replay 能力（旧 trace 在新 harness 下重跑）
- 版本固化与 A/B
- Seed 管理（隔离工具的非确定性）
- **现场保存（checkpoint）与还原（resume）** — 长任务的必需品

### 盲点 9：生态视野局限在 Anthropic/Claude Code

v1 几乎不提：

- OpenAI 系（Operator / ChatGPT Agent / Computer Use）
- Google 系（Gemini 的 tool calling 差异）
- Cursor/Cline/Aider
- 学术（ReAct / Reflexion / Voyager / Toolformer）

自检问题——"如果 Anthropic 明天消失，我的架构世界观还剩多少？"

v2 重点补充：Gemini tool calling 的差异、Computer Use 作为另一种范式。

### 盲点 10："为什么需要 Agent"——最哲学的缺口

v1 没在开头问这个问题。

Agent 适合的问题：
- 规格无法事前写清楚
- 解决路径依赖运行时观察
- 需要多抽象层切换

不适合 Agent 的（更好的选择）：
- 规格清晰的数据处理 → workflow
- 低延迟交互 → 简单 prompt
- 高一致性需求 → tool-use 薄封装
- 可脚本化的重复任务 → 脚本

v2 应该从这里开头，**先回答为什么，再讲怎么**。

---

## 为什么 v1 会有这些盲点

1. **构建者视角，不是运维者视角**（day 1 vs day 100 问题）
2. **后端背景，UX 被划到"另一层"**
3. **Claude Code 沉浸式学习，视野被参考实现锁定**
4. **把"过去半年没变"外推成"未来不会变"**
5. **写作偏陈述少论辩**，缺"你可能以为 X，但其实 Y"的张力

---

## v2 整合策略

- **开头新增**：为什么要 Agent（盲点 10）+ 模型-harness 共进化作为暗线（盲点 1）
- **B 章节扩充**：eval 部分展开，不单开章（盲点 2）
- **B+ 扩充**：成本/预算管理子节（盲点 3）、失败模式目录（盲点 6）、Prompt injection 防御（盲点 4）
- **B++ 扩充**：Human-in-the-loop 作为设计轴（盲点 5）、现场保存/还原（盲点 8）、UI/UX 点到即止（盲点 7）
- **C 扩充**：Gemini tool calling 差异、Computer Use 作为另一范式（盲点 9）
- **D 延伸**：多 Agent 的成本放大效应

---

本系列：
- [v1 版本](/posts/从Chatbot到Multi-Agent-架构演进-v1/) —— 被 review 的对象
- [v2 版本](/posts/从Chatbot到Multi-Agent-架构演进-v2/) —— 按这份 review 重写的结果

> 基于我和 Claude 的对话整理。2026-04-13
