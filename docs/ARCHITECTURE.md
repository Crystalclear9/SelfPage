# 架构

SelfPage 将公开数据和 Markdown 编译成静态页面。GitHub Pages 提供 HTML、脚本、样式和附件，浏览器负责筛选、导航与阅读交互。

## 静态页面构建流程

1. `src/data/site.js` 提供个人资料和项目顺序。`scripts/content.mjs` 读取内容索引，按发布日期排序，并通过 Vite 的 `virtual:writing` 模块提供已发布条目。
2. `src/data/routes.js` 合并首页、项目、文章与论文，以及 AILearning 清单中的子页。`href()` 为站内地址添加部署前缀，`currentPath()` 把浏览器地址还原为应用路径。
3. `scripts/prerender.mjs` 加载与客户端相同的组件，逐条路由输出 `dist/<路径>/index.html`，并生成 `dist/404.html`。学习资料在这一步渲染公式、代码和正文。
4. `src/main.jsx` 接管页面。已有 HTML 使用 `hydrateRoot`，开发环境的空挂载点使用 `createRoot`。站点标签页统一显示「Crystalclear9 | 个人主页」，页面描述随路由更新。

构建入口使用稳定的 `assets/site.js`、`assets/site.css` 路径，HTML 通过内容摘要查询参数标识版本。`scripts/legacy-entrypoints.json` 保存迁移前的入口名，构建时为旧 HTML 生成对应副本。

## 直接访问与站内导航

直接打开教材章节时，客户端从当前文档的 `#learning-content` 取得正文。站内进入另一章时，`readPage` 请求目标 HTML，提取同一节点；开发服务从 `__learning` 返回片段。独立文章与论文按需加载 `WritingDetail`，论文的章节和图注由 `PaperBody` 排版。

支持 Navigation API 的浏览器在当前文档内切换已注册的站内路由。页面数据就绪后，应用提交内容、恢复滚动并更新描述。连续跳转会取消过期请求，加载目标失败时由浏览器重新请求该地址。刷新、下载、新标签页和外部链接使用浏览器原生导航。

`Site` 保留共享光标，内部 `App` 以路径为 key。换页时，项目筛选、弹窗与页面监听器随旧页面卸载；会话衣装和浏览器偏好有独立的存储周期。

## 组件与状态

| 维护位置 | 职责 |
| --- | --- |
| `App`、`ContentPage` | 首页分区、主题与喜欢状态；选择项目、索引、正文与 404 页面 |
| `useProjectFilter`、`ProjectPager` | 替换筛选结果；按完整项目数组计算相邻项目 |
| `LearningPage`、`WritingDetail`、`PaperBody` | 教材层级、独立正文、论文页内目录 |
| `PageNavigation`、`ScrollToTop`、`Modal` | 返回目的地、滚动方向、顶部入口、弹窗焦点 |
| `ChapterMotion`、`PointerSurfaces`、`AnimatedCursor` | 模块进出视口、鼠标命中区域、人物与状态反馈 |
| `useVoice`、`voice-player.js` | 首页音轨预缓冲、互斥播放、停止与失败重试 |

业务组件通过自定义事件通知角色光标。事件名为 `cursor-feedback`。头像使用 `greeting`，喜欢状态使用 `like` 或 `unlike`，复制成功后发送 `copied`，筛选结果更新后发送 `filtered`。角色组件按事件类型切换表情或姿态。头像组件负责语音，项目弹窗负责写入剪贴板。

## 教材页面的导入、构建与加载

微积分第一章的路由由源文件所在的分类、主题和章节编号组成。导入、构建与阅读三个阶段共用同一条清单记录。

| 阶段 | 输入与输出 | 负责模块 |
| --- | --- | --- |
| 导入 | 源文件 `Mathematics/Calculus/01-导数偏导数与链式法则.md` → 快照中的同名文件和路由 `/articles/ailearning/mathematics/calculus/chapter-01/` | [import-learning.mjs](../scripts/import-learning.mjs) 读取标题、推导路由及父级 |
| 构建 | 快照与清单 → 带章标题、公式、语法着色和 `#learning-content` 的 HTML | [learning.mjs](../scripts/learning.mjs) 处理正文，[prerender.mjs](../scripts/prerender.mjs) 写入路由目录 |
| 浏览 | 当前页或目标页的 HTML → `LearningPage` 接收正文，显示目录、上级链接和相邻章节 | [main.jsx](../src/main.jsx) 读取正文，[LearningPage.jsx](../src/pages/LearningPage.jsx) 组织页面 |

章节标题取自源 Markdown 的一级标题，在下次导入时更新。公式解析规则由构建渲染器统一处理，重新构建后作用于所有章节。直接访问和站内换章使用相同的正文节点；若两者显示的章标题不同，可核对 `readPage` 请求地址、响应中的 `#learning-content` 与 React 提交的页面路径。

## 页面状态的生命周期

页面跳转由浏览器的 `navigate` 事件进入。`readPage` 完成后，`flushSync` 提交新树，然后恢复滚动、打开锚点所在的折叠块、发送 `site-page-rendered`。新页面的 `App` 因路径 key 改变而重新挂载，共享角色光标位于该 key 之外。原生刷新重新加载文档，从 head 中的首屏入口开始执行。

首页筛选值在组件挂载时初始化。语音播放器在组件卸载或 `pagehide` 事件触发时停止。主题与喜欢状态存于本地，跨访问保留。播放器同时清除缓冲定时器并解除窗口监听。相关代码见 [useProjectFilter.js](../src/lib/useProjectFilter.js)、[useVoice.js](../src/lib/useVoice.js) 和 [main.jsx](../src/main.jsx)。

## 新增页面类型

在 `src/data/routes.js` 登记公开路径，并在页面组件中实现该路径的视图。预渲染器按路由表输出 HTML；站内切换由 `readPage` 装配目标页面的数据。用同一个地址验证直接访问、站内点击、刷新和历史返回，可以分别覆盖静态入口与客户端导航。[内容字段](CONTENT.md) · [本地验证](DEVELOPMENT.md)
