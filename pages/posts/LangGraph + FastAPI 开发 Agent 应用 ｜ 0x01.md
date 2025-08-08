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
hide: true
---

<!-- more -->

## 前言

这篇文章可能不会马上触及到代码，会首先拿出很大篇幅来聊一下为什么选择 LangGraph 而不是别的。在了解到或者说在用 LangChain 的时候，我几乎每天都在想：
- 我为什么要用这个框架而不是别的？
- 为此我要从 Java 转到 Python，这值得吗？

第一个问题比较复杂，需要展开来讲讲，而且我个人的见识也很粗浅，必然不是全面的。第二个是我个人的问题，用 LangChain 的肯定有相当一部分原本就是用 Python 的。

### 为什么用 LangGraph（LangChain）？

我们从另一个问题开始：如果我不用 LangGraph，我会用什么？
那么引出另一个比较 base 的问题：我用这些框架的目的是什么？
其他 LLM 应用开发框架：

LlamaIndex: 主要侧重于数据密集型的 LLM 应用，尤其是在构建基于私有数据的知识库问答系统（RAG - Retrieval Augmented Generation）方面非常强大。它提供了丰富的数据连接器、索引构建和查询引擎。

Semantic Kernel (来自微软): 强调与微软生态（如 Azure OpenAI Service, Microsoft Graph）的集成，并提供了一种将 LLM 与传统编程语言（如 C#, Python）更紧密结合的方式，通过 "Skills" 和 "Planners" 的概念来组织和执行任务。

Haystack (来自 deepset): 另一个专注于构建搜索和问答系统的框架，支持多种 LLM 和向量数据库。

DSPy (来自斯坦福): 提出了一种新的编程模型，将重点从 "prompt engineering" 转移到 "program optimization"，通过编译器自动优化 prompt 和模型权重。

AutoGen (来自微软): 一个用于构建多代理对话系统的框架，允许开发者定义不同角色的 Agent 并让它们协同工作。

LangChain 的 Java 版本： LangChain 确实有 Java 版本 (LangChain4j)，它也在努力追赶 Python 版本的功能。但通常 Python 版本会更先支持新的特性和集成。
