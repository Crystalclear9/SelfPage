# SelfPage

SelfPage 是 Crystalclear9 的个人技术主页，展示开源项目、技术文章与研究论文。站点使用 React 和 Vite 构建，每个项目、文章和教材章节都有独立的静态 HTML，由 GitHub Pages 发布。[访问个人主页](https://crystalclear9.github.io/SelfPage/)

## 站点功能

首页按「应用」和「系统研究」展示项目。卡片上的「项目介绍」打开功能摘要，「了解项目」进入实现说明，「查看源码」打开对应仓库。项目详情页提供相邻项目导航和相关文章入口。

文章目录收录独立笔记和 AILearning 学习资料。AILearning 按分类、主题、章节组织，支持章节翻页、公式、代码高亮和图表。论文详情页集中展示发表信息、作者、研究方法与实验结果，并提供页内目录和 PDF 入口。角色光标、主题切换与语音反馈由客户端加载。[站点功能与导航](docs/FEATURES.md)

## 本地运行

开发与部署使用 Node.js 24。依赖版本由 `package-lock.json` 锁定。首次安装及启动命令如下。

```sh
git clone https://github.com/Crystalclear9/SelfPage.git
cd SelfPage
npm ci
npm run dev
```

开发服务默认地址为 `http://127.0.0.1:5173/`。组件与样式修改由 Vite 热更新；发布索引及正文变更触发页面重新加载。现有工作副本可直接从仓库根目录运行 `npm run dev`。

## 仓库结构

| 目录 | 职责 |
| --- | --- |
| [src/data](src/data) | 个人资料、项目摘要与详情、全站路由表 |
| [src/pages](src/pages) | 项目详情、内容索引、文章、论文与教材阅读页 |
| [src/components](src/components)、[src/lib](src/lib) | 公共组件、导航、筛选、光标和音频播放 |
| [src/styles](src/styles) | 全站布局、阅读排版、导航和角色动效 |
| [content](content) | 发布索引、Markdown 正文与 AILearning 教材快照 |
| [public](public) | 按原路径发布的插画、语音、配图与附件 |
| [scripts](scripts) | 教材导入、内容加载、静态页生成和工作区清理 |
| [tests](tests)、[.github/workflows](.github/workflows) | 内容检查、浏览器回归、持续集成与 Pages 发布 |

## 内容维护

**个人资料与项目。** [site.js](src/data/site.js) 中的 `profile` 管理昵称、简介、公开联系方式和语音路径，`projects` 定义首页项目卡片。首页布局在 [App.jsx](src/App.jsx) 中，项目页的实现说明在 [project-notes.js](src/data/project-notes.js) 中。两份项目数据使用同一 ID；项目数组顺序同时决定首页排列和详情页前后翻页顺序。

| 项目数据 | 显示位置 | GameQA 示例 |
| --- | --- | --- |
| `id`、`category` | 详情页地址、首页分类 | `gameqa` 对应 `/projects/gameqa/`，归入「应用」 |
| `title`、`subtitle`、`description`、`tags` | 卡片标题、副标题、简介、技术标签 | 卡片文案位于 `projects` 的 `gameqa` 条目 |
| `details`、`source` | 介绍弹窗的分项说明、源码入口 | 仓库地址指向 `Crystalclear9/RagGameQa` |
| `motivation`、`implementation`、`scope` | 详情页的背景、实现过程与范围 | `projectNotes.gameqa.implementation` 定义「实现思路」各小节 |

**文章与论文。** 正文分别保存在 `content/articles/` 和 `content/papers/`，标题、摘要、发布日期、正文路径及发布状态登记在 [content/index.json](content/index.json)。`type` 和 `slug` 组成公开地址。论文条目另含作者、发表会议、原文与 PDF 链接；条目的 `project` 字段可将文章或论文关联到项目详情页。

**AILearning。** 教材以单个专题进入文章列表。源仓库位于相邻的 `AI_Learning` 目录时，同步命令为 `npm run import:learning -- ../AI_Learning`。提交范围包括 `content/collections/ailearning/` 下的正文与清单，以及 `public/files/ailearning/` 下的配图。常规站点构建直接读取仓库中的快照。[内容字段、正文格式与导入流程](docs/CONTENT.md)

## 页面生成与站内导航

[路由表](src/data/routes.js) 汇总项目、已发布条目和教材章节。[预渲染脚本](scripts/prerender.mjs) 按公开路径写入正文，例如 GameQA 的产物为 `dist/projects/gameqa/index.html`。直接访问该地址时，浏览器先获得包含标题和正文的 HTML，再由 React 接入主题、筛选和导航。

新增页面类型涉及三个模块：路由表登记公开地址，[页面组件](src/pages)定义视图，[客户端入口](src/main.jsx)加载站内切换所需的数据。现有类型的内容更新沿用同一条生成流程。[架构与组件职责](docs/ARCHITECTURE.md)

## 生产构建与测试

GitHub Pages 的站点前缀为 `/SelfPage/`。本地生产预览使用同一前缀，以覆盖深层页面中的脚本、图片和返回链接。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

`check:content` 校验发布索引及正文格式，`build` 写入 `dist/`，`check:learning` 检查构建后的教材页面、链接、锚点和公式。预览地址为 `http://127.0.0.1:4174/SelfPage/`。浏览器回归在预览服务运行期间从独立终端执行。

```powershell
$env:TEST_URL = 'http://127.0.0.1:4174/SelfPage/'
npm run check:browser-ci
```

回归范围包括光标刷新、页面导航、章节阅读和历史恢复。项目筛选、卡片动效、音频及教材完整渲染各有独立检查。[开发环境与测试命令](docs/DEVELOPMENT.md)

## 部署

发往 `main` 的拉取请求运行生产构建与浏览器回归。站点改动推送到 `main` 后，GitHub Actions 校验内容、构建站点并发布 `dist/`。仅修改 README 或 `docs/` 的提交跳过部署。[工作流配置与发布步骤](docs/DEPLOYMENT.md)

## 交互与素材

首页的分区入场、项目卡片翻转、返回栏和角色光标共用站点的导航与滚动状态。动效参数、组件位置和浏览器验证方法见[导航与动效](docs/MOTION.md)。插画、光标原画和音轨的来源与替换规格见[站点素材](docs/ASSETS.md)，教材插图的路径映射与署名见[教材配图](docs/LEARNING-IMAGE-SOURCES.md)。
