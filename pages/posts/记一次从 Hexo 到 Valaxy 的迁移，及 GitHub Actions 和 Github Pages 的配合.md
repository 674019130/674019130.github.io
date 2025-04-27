---
title: 记一次从 Hexo 到 Valaxy 的迁移，GitHub Actions 部署 GitHub Pages
# date: 2024-05-03 02:28:12
tags: [Valaxy, Hexo, 博客迁移, GitHub Actions, GitHub Pages]
categories: [技术笔记, Web开发, 工具与环境]
author: 苏
postTitleClass: 'text-#FF8EB3'
top: 3
# type: yuque
# color: 'red'
# color: '#FF8EB3'
# color: 'rgb(255, 0, 191)'
# color: '255, 0, 255'
---

*仿佛只有有一个自己的博客，才像个理想中的程序员。*

*从买一台云主机，部署 WordPress，到 Hexo，再到前几天被 [云游君](https://github.com/YunYouJun) 安利的（也就是现在在使用的）Valaxy，也经历了蛮久。*

*但是记录和折腾这么久，自己又真正学到了什么东西呢？*

<!-- more -->


## 迁移

> Migrate from Hexo to Valaxy https://valaxy.site/migration/hexo

Valaxy 目前的文档还不太完善，最起码对一个没怎么搞过前端的人来说是这样的:cry:。

先创建一个新的 Valaxy 项目，然后传到自己的 GitHub 仓库中。

整个迁移分为两部分，迁移内容和迁移配置。

内容上可以兼容 markdown 文件，只需要挪动位置即可。

但是配置上存在较大的差异，通过读 TypeScript 写的引擎源码（其实是读接口定义的注释 :laughing: ）搞定了大部分配置，博客看起来勉强能用惹。

接下来要搞定的就是部署的问题，这中间曾经有几个问题很困扰我，我根据迁移的进程一个个来说。

### 从单纯的静态页面到一个 Vue 项目，GitHub Pages 如何识别该项目内容是一个静态页面的呢？

如果整个项目只有静态页面，是一个 HTML 和 JavaScript 组成的网站，那么入口是很好识别的，`index.html`。

但是现在这个项目是一个 Vue 项目，里面是 .md 文件和一些样式和语法，那么怎么找到 `index.html` 呢？事实上，在 `npm run build` 之前，是没有 `index.html` 这个文件的。

我按照指南里的部署手册，使用 GitHub Pages 的方式（这么说在我的理解里可能不太合适，感觉应该是用 GitHub Actions 来部署 GitHub Pages）。

项目在初始化时就已内置文件[`.github/workflows/gh-pages.yml`](https://github.com/YunYouJun/valaxy/blob/main/packages/create-valaxy/template-blog/.github/workflows/gh-pages.yml) 以实现 GitHub Actions 的自动部署工作流。

但是这个时候我还不太懂他们交互的方式和辅助部署的方式，尤其是前期我没搞好项目配置，导致思考的时候走了一些弯路。

### GitHub Actions 已经启动了工作流了，为什么没有部署到 username.github.io 呢？

这时候我有几个猜想：

1. 仓库名称不对，不应该以 `username.github.io` 作为仓库名称，应是 Valaxy 项目代码一个仓库，`username.github.io` 一个仓库，避免占用地址之后导致识别不到真正的静态页面的内容。
2. 仓库确实应该以 `username.github.io` 为名字，根据工作流确实也已经生成了 `./dist` 里的文件，只是缺少部署这个动作。
3. GitHub Pages 存在延迟，其实已经成功部署了，只是还没有刷新。

多次验证之后，发现第二个猜想可能更接近真相。又去读了一遍指南，其中提到

> - 上传至 GitHub Repo，打开 `Settings` -> `Pages`，选择 `gh-pages` 分支。
>
> `gh-pages` 已由 `.github/workflows/gh-pages.yml` 自动部署。

那么这个 `gh-pages` 分支是做什么用的呢？

切换到这个分支，发现这就是打包生成的静态页面的内容，也就是说其实 GitHub Actions 做的事情是将打包后的文件发布到新的分支中，这样一个仓库里既有项目源代码，又有生成的文件。

到这里答案就已经呼之欲出了，确实是 **缺少将打包后的文件识别为网站入口** 这一行为。

于是尝试切换了 Pages 的部署方式，从 GitHub Actions 切换到 `gh-pages` 分支，并更新一次项目代码以触发 CI，之后根据设置，自动触发了 deployment。

![image-20240503120129238.png](https://s2.loli.net/2024/05/03/fIeo1Tx7gXZkc6C.png)
![image-20240503120115816.png](https://s2.loli.net/2024/05/03/GUZ1hYoaXVCrERq.png)

## 后记

首先再次对 [云游君](https://github.com/YunYouJun) 表示感谢，迁移之后不但部署更方便，实时查看渲染效果的功能也非常方便，还有很多别的便利之处我还没完全搞懂（一定是因为使用手册还没写完的原因），但是真的炒鸡方便了！

其实反思一下有什么收获，主要是在思考和猜测的过程中，在验证自己想法的过程中，不但获取了其他领域的知识，还加深了对 CI 流程的理解。正是因为 **想破脑袋也得不出正确结论** 这一行为的存在，才使获得的知识印象更加深刻吧。

也为自己的行动力感到骄傲！:white_check_mark:
