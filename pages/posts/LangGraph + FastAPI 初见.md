---
title: LangGraph + FastAPI 开发 Agent 应用 ｜ 0x01
# date: 2024-05-02 02:28:12
tags: [LangGraph, FastAPI]
categories: [技术笔记, AI应用开发]
postTitleClass: 'text-#4169E1'
# postTitleClass: 'text-rgb(62, 52, 52)'
toc: true
top: 4
codeHeightLimit: 300
medium_zoom: true
---

<!-- more -->

## 前言

这篇文章可能不会马上触及到代码，会首先拿出很大篇幅来聊一下为什么选择 LangGraph 而不是别的。在了解到或者说在用 LangChain 的时候，我几乎每天都在想：
- 我为什么要用这个框架而不是别的？
- 为此我要从 Java 转到 Python，这值得吗？

第一个问题很大，第二个是我个人的问题，用 LangChain 的肯定有相当一部分原本就是用 Python 的。

### 为什么用 LangGraph（LangChain）？

我们从另一个问题开始：如果我不用 LangGraph，我会用什么？
那么引出另一个比较 base 的问题：我用这些框架的目的是什么？

是的，我们要开发一个 Agent 应用。我要控制 Agent 的执行流程，我需要 Agent 的输出，我需要 Agent 的输入，我需要 Agent 的中间状态，我需要 Agent 的中间输出。