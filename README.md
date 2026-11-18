# SelfPage

SelfPage 是 Crystalclear9 的个人项目、技术文章与研究论文站点，使用 React 和 Vite 构建，部署在 GitHub Pages。构建脚本为每个项目、文章章节和论文生成独立 HTML，读者可以直接访问正文，也可以在关闭 JavaScript 时通过普通链接浏览。项目筛选、主题切换与角色光标由客户端提供。

[访问网站](https://crystalclear9.github.io/SelfPage/) · [AILearning 学习资料](https://crystalclear9.github.io/SelfPage/articles/ailearning/) · [K-GAT 论文](https://crystalclear9.github.io/SelfPage/papers/k-gat/)

## 站点内容

首页收录五个项目。随手办关注多模态信息提取与任务核对，GameQA 使用检索增强生成回答游戏知识问题，SandBoxSim 模拟自然生态与自主居民。系统研究部分收录 Autellix 的论文复现，以及面向工具回返时间预测的 TimePredictModel。各项目有独立详情页和源码入口，展示顺序、分类及介绍由本站维护。

文章与论文有各自的索引。AILearning 在文章列表中占一个入口，读者从专题进入分类、主题和单章，各章有可直接引用的网址。论文页集中呈现作者、发表信息、方法图、实验分析与原文入口。首页使用统一导航，详情页提供返回上级和返回个人主页两种操作。

## 仓库结构

| 位置 | 职责 |
| --- | --- |
| `src/App.jsx`、`src/pages/` | 组合首页、项目详情、文章列表、教材章节和论文正文 |
| `src/data/` | 管理公开资料、项目记录和路由清单 |
| `src/components/`、`src/lib/`、`src/styles/` | 实现跨页组件、导航和音频逻辑，以及布局和交互样式 |
| `content/`、`public/` | 分别保存参与构建的内容源文件和按原路径发布的静态资源 |
| `vite.config.js`、`scripts/` | 配置部署前缀、加载内容、导入教材并生成各路由的 HTML |
| `tests/`、`.github/workflows/` | 检查内容和浏览器行为，构建并部署通过检查的产物 |

### 页面生成

以一个教材章节为例，导入脚本从源目录读取 Markdown，在清单中记录章节路径和父级。构建时，路由表据此产生页面地址，教材渲染器解析公式、代码和相对链接，预渲染脚本把正文写入对应目录的 `index.html`。直接访问时，浏览器收到的 HTML 已包含正文。站内切换章节时，客户端读取目标页的预渲染正文，并复用当前文档中的角色光标。新增页面类型时，应同时检查路由登记、首次访问与站内切换三条路径。

## 本地开发

项目要求 Node.js 22.12 或更高版本。CI 使用 Node.js 24。首次检出仓库后，在项目根目录安装锁文件指定的依赖并启动开发服务。

```sh
npm ci
npm run dev
```

默认开发地址为 `http://127.0.0.1:5173/`。开发服务使用根路径，线上站点使用 `/SelfPage/`。涉及路由、图片或附件的修改，应按下文的生产路径验证。

## 内容维护

| 维护项 | 源文件 | 约定 |
| --- | --- | --- |
| 首页与项目卡片 | `src/data/site.js` | `profile` 保存公开简介与语音路径，`projects` 定义项目 ID、分类、摘要及源码仓库。 |
| 项目详情 | `src/data/project-notes.js` | 通过项目 ID 关联首页卡片。实现说明、设计取舍和复现记录在此维护。 |
| 文章与论文 | `content/articles/`、`content/papers/`、`content/index.json` | Markdown 保存正文，索引保存标题、正文路径和发布状态。论文条目另含作者、发表信息及 PDF 链接。 |
| AILearning | `content/collections/ailearning/` | 本站保存源资料的快照，按分类、主题和章节生成阅读页。更新时从本地 AILearning 仓库重新导入。 |

例如，源仓库位于相邻的 `AI_Learning` 目录时，运行 `npm run import:learning -- ../AI_Learning`，再检查本次导入的 Markdown、配图和清单差异。普通站点构建直接读取已提交的快照。字段示例与附件路径见[内容维护文档](docs/CONTENT.md)。

## 构建、验证与发布

以下 PowerShell 命令使用与线上一致的路径构建站点，并在固定端口启动生产预览。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

`check:content` 校验内容索引和 Markdown 渲染。`build` 将静态资源与预渲染页面写入 `dist/`。`check:learning` 检查生成的学习资料页，包括站内链接、章节锚点和公式输出。

预览运行后，在另一个终端执行 `npm run check:browser-ci`。该命令默认访问 `http://127.0.0.1:4174/SelfPage/`，依次验证光标刷新与历史返回、页面导航、移动端章节阅读和过渡恢复。本地默认使用 Edge，CI 使用 Playwright 安装的 Chromium。

面向 `main` 的拉取请求会运行构建和回归检查。推送到 `main` 后，工作流将通过检查的同一份 `dist/` 发布到 GitHub Pages。具体步骤见[发布工作流](.github/workflows/deploy.yml)与[部署及回退说明](docs/DEPLOYMENT.md)。

## 按改动选择检查

| 改动 | 本地验证重点 |
| --- | --- |
| 项目卡片、分类或详情 | 在生产预览运行 `npm run check:projects` 和 `npm run check:pages`，再从卡片进入详情，用浏览器后退检查原列表。 |
| 教材正文与插图 | 构建后运行 `npm run check:learning` 和 `node tests/learning-references.mjs`；涉及排版或渲染器时，在预览上运行 `node tests/learning-render.mjs` 检查逐页渲染。 |
| 光标、翻页或滚动 | 运行 `npm run check:cursor`、`npm run check:motion`；在桌面浏览器保持指针静止，依次检查进入详情、返回和刷新。 |
| 构建前缀或入口资源 | 运行 `npm run check:assets` 与 `npm run check:static`，直接打开嵌套网址，查看 CSS、脚本和图片请求。 |

浏览器专项检查使用运行中的生产预览；在测试终端设置 `TEST_URL` 可统一指定地址。Windows 下停止预览后，`npm run clean` 会将生产构建、本地报告及 Vite 缓存移入回收站。

## 开发文档

| 文档 | 内容 |
| --- | --- |
| [架构与数据流](docs/ARCHITECTURE.md) | 页面组件、数据边界、预渲染与客户端导航 |
| [本地开发与测试](docs/DEVELOPMENT.md) | 目录结构、专项测试、构建产物与本地清理 |
| [功能说明](docs/FEATURES.md) · [导航与动效](docs/MOTION.md) | 页面操作、滚动行为、光标状态与减少动态效果模式 |
| [站点素材](docs/ASSETS.md) · [学习资料配图](docs/LEARNING-IMAGE-SOURCES.md) | 插画、字体、音频及文章配图的来源 |
