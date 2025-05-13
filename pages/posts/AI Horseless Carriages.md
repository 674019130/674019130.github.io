---
title: AI Horseless Carriages 读书笔记
date: 2025-04-27 14:17:00
tags: [AI, 读书笔记]
categories: [技术笔记, AI与大模型]
postTitleClass: 'text-#4169E1'
top: 6
---

> I suspect that in the future we'll look back and laugh at the idea that a "prompt injection" (like "Ignore previous instructions...") was something to be concerned about.


> 未来我们可能会对"提示注入"这种担忧感到好笑。
![蒸汽机车](https://koomen.dev/images/steam-carriage.png)

<!-- more -->

Origin link: [AI Horseless Carriages](https://koomen.dev/essays/horseless-carriages/?open_in_browser=true#a-better-email-assistant)

非常值得阅读的文章，不管是产品经理还是开发人员（事实上在开发 AI 应用时，开发人员的实现方式对产品形态的影响同样很大），都可以从中获得启发。

作者将当前许多 AI 应用比作「无马的马车」 (Horseless Carriages)（点名 Gmail 内嵌的 AI
助手），其实是在揭示我们**正用新技术模仿旧工作流的现状**。我们往往只是在现有流程上用 AI 进行改良或者直接把功能塞进去，而非创造全新的、AI 原生的交互范式，就像早期的汽车模仿马车的形态。

![蒸汽机车](https://koomen.dev/images/steam-carriage.png)

作者强调应该把 `System Prompt` 的编辑权限交给用户，并认为 `System Prompt` 应该像 `User Prompt` 一样，可以拥有模板，可以根据用户的私人信息定制，可以被持续迭代。而不是给出一个一刀切（one-size-fits-all）的 `System Prompt`。
这虽然有关安全问题，但是重点是用户应该有选择权，而不是被动的接受。

作者还将几个自己实现的简单的 AI Agent 应用嵌入了页面，读者只需要点击按钮就可以体验。不但非常有说服力（看我自己实现的比 Gmail 做的牛逼多了），而且给了读者自己编辑尝试的机会，我之前从未体验过这种交互，这阅读体验上升了好几个台阶。
![Pete Koomen 文章中其中一个 AI Agent 交互](https://s2.loli.net/2025/04/27/z2MqxKiRkt9e5rZ.png)