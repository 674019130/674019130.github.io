# 首页加载动效：完整调用链核对

核对日期：2026-09-14。范围是 `https://sanyam.sh/` 的首页、它的组件依赖以及进入/离开首页的路由边界，不把 Lab 内每个演示自己的动画混入首页。

公开仓库当前提交：`42a494e94bdf480240a4b8e95afa09cd72fcb9ec`。同时重新下载线上首页及其实际加载的 `0cbj6k6x8zb98.js`、`2nuhcq-hs1d1y.css` 和字体 CSS，确认以下关键参数存在于发布产物中。

## 1. 固定入场：七个块

`Reveal` 容器等待 150ms，子块每隔 80ms 开始；每块从 opacity 0、y 4px 到 opacity 1、y 0，持续 400ms，easeOut。

| 块 | 开始 | 结束 |
|---|---:|---:|
| 头像 | 150ms | 550ms |
| 第一段 | 230ms | 630ms |
| 经历与导航段落 | 310ms | 710ms |
| 作品段落 | 390ms | 790ms |
| 联系段落 | 470ms | 870ms |
| 分隔线 | 550ms | 950ms |
| 页脚 | 630ms | 1030ms |

当前实现没有 blur。首页 storyboard 和少量注释仍有旧的 blur 描述，但 Reveal 实现与线上 JS 都只有 opacity 和 y。页脚中的社交图标作为一个整体随页脚入场，没有每个图标单独的 stagger。

## 2. 名字彩色扫入

- 仅第一段的姓名，不是整段逐字打字，也不是文字循环替换。
- 从挂载后 230ms 开始，持续 1200ms；约 1430ms 完成。
- 一个占文字宽度 34% 的色带，其中心从 -17% 移动到 117%。
- 色带为 `#c679c4 → #fa3d1d → #ffb005 → #e1e1fe → #0358f7`。
- 色带左边留下正常深色文字，右边仍透明。结束后完全恢复正文主色。
- easing 是分段定义的 easeInOutCubic，不是 linear。
- reduced-motion 直接输出普通可见文字，不能简单把动画暂停在透明的起点。

## 3. 导航下划线延后绘出

内容块完成后才开始，按文中出现顺序绘出：

| 链接 | 开始 | 结束 |
|---|---:|---:|
| currently | 1030ms | 1480ms |
| write | 1170ms | 1620ms |
| lab | 1310ms | 1760ms |

每条持续 450ms，`cubic-bezier(0.22, 1, 0.36, 1)`，`scaleX(0 → 1)`，左端为原点，fill-mode both。延迟期间维持零宽度，避免先闪现完整下划线。

只给首页正文中无品牌图标的文字导航绘制；品牌胶囊和页脚 about/contact/privacy 下划线不参与这个顺序。

## 4. 签名：进入视口、加载 SVG、分两笔

签名使用一次性的 IntersectionObserver（Motion useInView），root margin 为 100px。进入范围后请求 `/assets/signature.svg`，插入路径时开始 CSS 动画。因此时间原点是 SVG 插入，不是页面挂载。

- 第一笔：插入后 350ms 开始，1100ms 完成，linear。
- 第二笔：插入后 1530ms 开始，400ms 完成，linear。
- 第一笔结束于 1450ms，第二笔开始前有 80ms 抬笔间隔。
- 两笔都使用 pathLength=1、stroke-dasharray 和 stroke-dashoffset。
- reduced-motion 直接显示完整笔迹。

宽屏初始视口通常就能触发；矮屏可能要滚动后才触发。网络延迟也会改变用户实际看到的时间。不能把签名硬算成“页面加载后第几毫秒必定结束”。

## 5. 唱片：等待真实播放数据

首页挂载后请求 `/api/now-playing`，之后每 30 秒轮询。只有 isPlaying、albumArt 和 title 都有效才显示。

- 封面出现：460ms，从 opacity 0 / 横向偏移 0 到可见 / 偏移 30%，使用 `cubic-bezier(0.22, 1, 0.36, 1)`。
- 头像 40px，所以默认露出约 12px。
- 封面本身以 8 秒一圈的速度持续旋转，linear infinite。
- 暂停播放：460ms 隐藏，等动画结束再卸载；不是立即删掉封面。
- 头像/唱片脱落彩蛋期间旋转暂停，保留当前角度。
- reduced-motion 不执行移动、旋转；隐藏分支也不等待不会发生的 animationend。

Hover/focus/tooltip 打开后偏移变为 50%（约 20px）是交互反馈，不是初次加载动画。数据未返回或没有播放歌曲时，初始首页不会出现唱片。

## 6. 路由进入/退出：260ms 淡化

每页有 React ViewTransition 边界，旧/新 root 使用 260ms ease crossfade。它发生在客户端站内导航，不等同于首次完整刷新；`update="none"` 防止普通状态更新、计时器和动画结束事件触发整页快照过渡。

不支持该能力或启用 reduced-motion 时需要静态导航退化。它与上述七块入场是两个层级。

## 7. 排除的其他效果

- 头像点击摇晃、8 次点击脱落、重力/回弹/归位：pointer 驱动，不是自动加载。
- 链接 hover 底色向上长出：200ms，交互触发。
- Tooltip：150ms 的淡入和 0.95 → 1 缩放；音乐 tooltip 延迟 150ms，社交 tooltip 延迟 200ms，必须先 hover/focus。
- 选区端点：文字被选中后出现；hover 拉高是 200ms，不属于入场。
- 全局 CSS 的 new-circle、folder-in、stem-bloom、cloud-drift：其他页面/实验使用，首页没有调用；不能因样式文件包含它们就声称首页播放它们。
- Toast：没有首页挂载时自动触发的通知。

## 本博客落地与差异

- 加入名字色带扫入，使用原生 requestAnimationFrame 和同样的 34% 色带/分段 cubic 曲线，结束后恢复普通文字；不引入 React 或 Motion 依赖。
- write / long-running notes / UI lab 三条下划线对应 1030 / 1170 / 1310ms 的顺序。
- 分隔线与页脚拆为独立入场块。页脚只淡入，保留已验证的搜索弹层定位修复，避免变换祖先再次影响 fixed 弹层。
- 自己的 Su 签名分主笔迹和下划线两笔，由进入视口触发，不复用作者私人签名素材；本地 SVG 不需要网络请求。
- 没有添加唱片，因为博客没有对应的真实播放数据源；也没有把唱片写成伪造的正在播放状态。
- 没有改全站路由过渡，文章页与旧版保持原行为。
- NameSweep 的起点是组件挂载，页面块和下划线在父组件挂载前暂停，使各层使用同一轮挂载作为起点；禁用 JS 时通过 noscript 显示完整静态内容。具体帧仍受浏览器调度影响，不宣称所有设备下逐帧相同。
- 本次构建及 3 项既有测试通过；Vue 类型检查没有新增组件诊断。浏览器复看若因前台被占用而中断，会单独报告，不能把源码核对等同于视觉逐帧实测。

## 来源

- [线上首页](https://sanyam.sh/)
- [首页编排](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/app/page.tsx)
- [Reveal](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/components/ui/reveal.tsx)
- [DiaText](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/components/ui/dia-text.tsx)
- [InlineLink](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/components/ui/inline-link.tsx)
- [Signature](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/components/home/signature.tsx)
- [NowPlaying](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/components/home/now-playing.tsx)
- [全局 CSS](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/app/globals.css)
- [路由边界](https://github.com/SanyamPunia/www/blob/42a494e94bdf480240a4b8e95afa09cd72fcb9ec/components/ui/page-transition.tsx)
- [Yaak PR #519](https://github.com/mountain-loop/yaak/pull/519)、[PR #523](https://github.com/mountain-loop/yaak/pull/523)，均核实为 merged。

## 最终验证记录

- `npm run build` 静态生成成功，实际检查 `dist/index.html`、`dist/lab.html` 和 `dist/home-classic.html`。
- 本地预览 `/`、`/lab.html`、两个品牌 PNG 均返回 HTTP 200；首页产物包含 Yaak、UI lab 与正确图片路径。
- `npm test`：3/3；`git diff --check`：通过。
- Vue 类型检查没有指向本次新增组件的诊断，仍有既有 Valaxy/旧归档/HomeComments 诊断；完整命令和诊断见 `home-motion-types-2026-09-14.txt`。
- Chrome 中实际复看了窄窗口首页，确认官方黄蓝标志、正文导航与换行；连续加载与滚动签名的完整逐帧复测被前台窗口持续操作打断，未宣称通过。
- 旧版组件与冻结快照逐字节一致。本次未提交、推送或部署。
