---
title: Cursor 个人最佳实践总结
# date: 2024-05-02 02:28:12
tags: [Cursor]
categories: [笔记, 工具]
postTitleClass: 'text-#112313'
# postTitleClass: 'text-rgb(62, 52, 52)'
toc: true
top: 4
codeHeightLimit: 300
medium_zoom: true
---

> 在使用新工具的路上四处张望，捡起了一些未知价值的石子。

<!-- more -->

# Cursor 个人最佳实践总结

0. 不依赖 Cursor，必要情况下自己手写，以及 Cursor 写出来的代码自己也得能写，时间允许的情况下可以写得更好


1. 在每次成功的 Agent run 之后反思总结，**根据其内容迭代更新 Cursor Rules**（尝试用更新后的 Rules 做同一件事，观察效果）
2. 定期更新、整理 Cursor Rules
3. review agent workflow 中的每一步，**做到完全掌握 agent 究竟做了什么**，拒绝做甩手掌柜
4. **teach better than fix**，通过 snippet 去教会大模型应该怎么做
5. cursor rules 文件中尽量添加代码片段（单样本 / 少样本）
6. 功能开发要求 agent 自测通过