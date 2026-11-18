# 架构

SelfPage 将公开数据和 Markdown 编译成静态页面。GitHub Pages 提供 HTML、脚本、样式和附件，浏览器负责筛选、导航与阅读交互。

## 从源文件到页面

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

业务组件在动作发生时发出 `cursor-feedback`。头像使用 `greeting`，喜欢状态使用 `like` 或 `unlike`，复制成功后发送 `copied`，筛选结果更新后发送 `filtered`。角色组件消费这些事件；播放语音和写入剪贴板仍由各自的业务入口完成。

## 扩展一个页面

在 `src/data/routes.js` 登记公开路径，并在页面组件中实现该路径的视图。预渲染器按路由表输出 HTML；站内切换由 `readPage` 装配目标页面的数据。用同一个地址验证直接访问、站内点击、刷新和历史返回，可以分别覆盖静态入口与客户端导航。[内容字段](CONTENT.md) · [本地验证](DEVELOPMENT.md)
