# 导航与动效实现

## 页面结构与滚动

| 区域 | 行为 | 主要文件 |
| --- | --- | --- |
| 首屏与个人介绍 | 宽屏首屏停留，插画放大，个人介绍左右展开 | `src/styles/chapters.css` |
| 项目列表 | 双向翻转进入视口，中间保持正面；侧栏在宽屏停留 | `src/styles/motion.css` |
| 文章与论文 | 入口展开、正文条目进入、阅读进度线 | `src/styles/content.css` |
| 页面切换 | 进入展开、返回反向收回、相邻项目横向切换 | `src/lib/navigation.js`、`src/styles/navigation.css` |

滚动编排使用 CSS scroll/view timeline，不拦截滚轮或修改滚动速度。卡片间距为 16px，窄屏为 12px；最大翻转角度分别为 36°、26°，中央 38%–62% 区间保持正面。正文不会等待动画结束才显示。

首屏展开节奏参考 [wutaghost](https://wutaghost.github.io/)，本站的文案、插画和页面结构独立维护。

## 返回与项目翻页

顶部导航将文章和论文合并为“文章与论文”，定位到首页 `#writing` 板块。首页按滚动位置更新导航选中态；文章、论文及其正文页保持该项选中。浅色主题使用深色文字，深色主题使用对应的高对比文字。

刷新首页时，head 脚本临时将根元素的 `scroll-behavior` 设为 `auto`，使浏览器直接恢复原阅读位置。`pageshow` 后经过两帧恢复原样式，后续点击分区仍平滑滚动。`check:entry` 逐帧检查刷新位置，避免仅验证最终位置而漏掉恢复过程中的滚动动画。

`src/lib/home-entry.js` 内联于 HTML head。直接访问首页时从顶部开始，旧收藏的分区锚点会被清理；刷新和历史遍历保留浏览器滚动恢复。带同站 referrer 的跨页分区链接先完成定位再清理地址。首页内的锚点点击使用原生滚动，随后通过 `replaceState` 清理地址。Navigation API 还处理页面已打开时从浏览器收藏触发的同文档锚点导航，区分页面内链接点击和历史遍历；这条路径不会重新执行 head 脚本。外部直接链接到首页分区也按首屏入口处理；无 JavaScript 时保留原生锚点行为。

项目介绍弹窗的内容以 6px 位移分层淡入，说明条目悬停时轻微提亮并横移 2px，关闭后恢复焦点但不滚动页面。减少动态效果模式关闭这些位移动画。

`PageNavigation` 统一提供返回主页及所属列表的链接。页首入口离开视口后，向上滚动显示悬浮返回条，向下滚动隐藏。隐藏时使用 `inert` 移出焦点顺序；条内存在键盘焦点时保持可见。

`ScrollToTop` 仅用于首页：离开页首 240px 后向上滚动显示，向下滚动隐藏。页脚原有按钮进入视口时，悬浮按钮立即隐藏，避免两个入口同时出现。

上述组件读取真实滚动位置，4px 阈值过滤轻微抖动，通过 requestAnimationFrame 合并更新。触屏、滚轮和键盘滚动使用相同逻辑，悬浮控件不改变正文布局。

`ProjectPager` 按项目数组顺序提供前后导航，不循环跳回第一项。第一项可返回全部项目，最后一项可继续浏览文章。项目标题通过同名 View Transition 快照跨页衔接，动画约 0.7 秒，普通链接与浏览器历史行为保留。

## 翻页异常恢复

`src/lib/transition-guard.js` 由 Vite 内联到 HTML head，在应用脚本加载前注册监听。过渡准备失败或超过 1.8 秒时调用 `skipTransition()`，结束视觉快照并显示已加载正文，不刷新页面；历史缓存恢复时清理旧的出站过渡。

`check:recovery` 覆盖人为挂起动画、阻断应用脚本、正常过渡保留及历史返回。这是过渡异常的恢复机制，不替代对网络错误或其他渲染故障的诊断。

## 头像与角色光标

`ProfileAvatar` 为原生按钮，支持鼠标、触屏、Enter 和空格。触发后头像摆动一次、显示问候，动作期间不叠加重复动画。

角色素材为 `public/images/megumi-cursor.svg`，热点 `(8, 12)` 对应指尖。`AnimatedCursor` 使用不接收点击的 manual popover，保持在弹窗之上；移动、点击、长按、拖动、文本、等待、复制和方向调整各有反馈。`data-cursor` 可声明额外语义，如 `read`、`download`、`ew-resize`。

`PointerSurfaces` 负责表面倾转、局部光斑和点击波纹。动画帧合并 DOM 更新，固定复用粒子节点；事件处理不改变原生点击、选字、拖拽和右键菜单行为。

## 降级与验证

- 减少动态效果模式关闭翻页、滚动、头像摆动和动态光标，保留静态内容、导航和文字反馈。
- 触屏不显示鼠标角色。不支持 Popover API 或角色图片不可用时保留原生光标回退。
- 不支持滚动时间线或跨文档过渡时使用普通布局与导航。
- `check:motion` 检查滚动、光标和弹窗；`check:navigation` 检查返回入口、互斥按钮、翻页方向和头像；`check:recovery` 检查过渡异常恢复。

样式加载顺序由 `src/main.jsx` 维护。背景、文字与强调色使用 `base.css` 的主题变量，交互组件卸载时清理监听与计时器。

参考：[CSS 滚动驱动动画](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)、[跨文档 View Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40view-transition)、[Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)。
