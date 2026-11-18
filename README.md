# SelfPage

Crystalclear9 的个人主页，使用 React 和 Vite 构建，部署在 GitHub Pages。首页展示个人简介和开源项目，文章与论文通过各自的目录阅读。加藤惠的插画、角色光标和语音贯穿首页交互。[访问个人主页](https://crystalclear9.github.io/SelfPage/)

## 本地开发

首次检出时使用以下命令。项目使用 Node.js 24 开发和发布，`npm ci` 根据提交的锁文件安装依赖。已有工作副本时，直接在仓库根目录启动开发服务。

```sh
git clone https://github.com/Crystalclear9/SelfPage.git
cd SelfPage
npm ci
npm run dev
```

默认地址是 `http://127.0.0.1:5173/`。修改首页布局从 [App.jsx](src/App.jsx) 开始；修改介绍、项目分类或展示顺序，直接编辑 [site.js](src/data/site.js)。

## 接手后的第一次修改

从一个已有项目走一遍开发流程，可以同时熟悉首页、独立页面和生产路径。下面以 GameQA 为例。

1. 在 [site.js](src/data/site.js) 找到 `id: "gameqa"`。修改 `subtitle` 后保存，打开首页「项目与实践」，选择「应用」。卡片标题下方会显示新的副标题。
2. 点击卡片的「项目介绍」。弹窗的分项说明来自同一条记录的 `details`。关闭弹窗后点击「了解项目」进入独立页面，其中「实现思路」来自 [project-notes.js](src/data/project-notes.js) 的 `gameqa.implementation`。这两处适合分别写功能摘要和具体实现。
3. 运行下文的生产构建，在预览地址直接打开 `/SelfPage/projects/gameqa/`。刷新后，页面应保留项目标题、正文和样式。点「全部项目」返回首页的项目分区，再切换一次分类，检查返回位置。
4. 用 `git diff -- src/data/site.js src/data/project-notes.js` 核对本次内容差异。提交源文件后，发布工作流从源码生成对应 HTML。

### 日常改动入口

| 要做的事 | 从哪里入手 | 完成后看哪里 |
| --- | --- | --- |
| 调整桌面或移动端布局 | [布局样式](src/styles/base.css) 与对应组件的类名；阅读页使用 [content.css](src/styles/content.css) | 生产预览里同一地址的宽屏和窄屏布局 |
| 发布一份关联项目的笔记 | 新建 Markdown 并在发布索引中填写 `project` | 文章列表、文章详情、项目页的「相关记录」；见[发布文章](docs/CONTENT.md#发布文章) |
| 更新一章教材及配图 | 在 AILearning 源目录改正文与图片，再导入快照 | 分类目录、章节直达地址、图片与页内锚点；见[同步步骤](docs/CONTENT.md#同步-ailearning) |
| 修改角色反馈或播放逻辑 | 从 [AnimatedCursor.jsx](src/components/AnimatedCursor.jsx) 或 [useVoice.js](src/lib/useVoice.js) 进入 | 首页触发反馈后进入子页，再后退、刷新，观察当前衣装与播放状态 |
| 改变页面地址或构建路径 | [routes.js](src/data/routes.js)、[Vite 配置](vite.config.js) 与[预渲染脚本](scripts/prerender.mjs) | 直接打开目标页、站内进入、刷新、历史返回四条路径 |

## 仓库结构

| 目录 | 职责 |
| --- | --- |
| [src/data](src/data) | 个人资料、项目摘要与详情、全站路由表 |
| [src/pages](src/pages) | 项目详情、内容索引、文章、论文与教材阅读页 |
| [src/components](src/components)、[src/lib](src/lib)、[src/styles](src/styles) | 页面组件、导航与音频逻辑、布局和交互动效 |
| [content](content) | 发布索引、Markdown 正文和 AILearning 教材快照 |
| [public](public) | 按原路径发布的插画、语音、教材配图与论文附件 |
| [scripts](scripts) | 内容导入与校验、Markdown 渲染、静态页面生成 |
| [tests](tests)、[.github/workflows](.github/workflows) | 内容与浏览器回归、持续集成和 Pages 发布 |

## 内容从哪里改

**项目。** 首页卡片读取 `projects`，详情页从 [project-notes.js](src/data/project-notes.js) 读取背景、实现过程与验证范围。两处通过项目 ID 关联，该 ID 也是公开网址的一部分。以 GameQA 为例，修改卡片摘要只涉及 `projects` 中的 `gameqa` 条目；补充检索流程则修改同名详情记录。项目数组的顺序同时决定首页排序与详情页的前后翻页。

**文章与论文。** 正文分别写在 `content/articles/` 和 `content/papers/`，标题、摘要、发布日期与正文路径登记在 [content/index.json](content/index.json)。构建器根据已发布条目的类型和 slug 生成索引与详情页。论文的署名、会议和原文地址也在同一条记录中维护。

**AILearning。** 教材以专题形式进入文章列表。章节内容在源仓库编辑，再从本站根目录运行 `npm run import:learning -- ../AI_Learning`。导入结果包括 Markdown 快照、章节清单和配图；一起提交这三部分，其他开发者就能从同一版本构建站点。索引字段、目录约定和配图示例见[内容维护](docs/CONTENT.md)。

## 页面如何生成

[路由表](src/data/routes.js) 汇总项目、已发布条目和教材章节。[预渲染脚本](scripts/prerender.mjs) 遍历这张表，为每个地址写出带正文的 HTML。例如项目 ID 为 `gameqa` 时，构建产物是 `dist/projects/gameqa/index.html`。GitHub Pages 直接提供这份文件；浏览器加载脚本后接入筛选、主题、光标和站内导航。

扩展页面类型涉及三个入口：路由表定义地址，[页面组件](src/pages)负责展示，[客户端入口](src/main.jsx)负责挂载和站内切换。普通内容更新复用现有页面类型。[架构说明](docs/ARCHITECTURE.md)

## 验证与发布

线上站点位于 `/SelfPage/`。在 PowerShell 中使用相同的前缀构建和预览，可以直接核对深层页面的样式、图片与站内链接。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

打开 `http://127.0.0.1:4174/SelfPage/`。保留预览进程，在第二个终端运行 `npm run check:browser-ci`，覆盖页面导航、章节阅读、光标和历史恢复。[开发与测试](docs/DEVELOPMENT.md)

发往 `main` 的拉取请求运行生产构建与浏览器回归。站点改动合入 `main` 后，工作流发布本次生成的 `dist/`。仅更新 README 或 `docs/` 时跳过部署。[发布流程](docs/DEPLOYMENT.md)

## 交互与素材

[站点功能](docs/FEATURES.md)记录首页筛选、阅读导航、主题与语音的使用方式。[导航与动效](docs/MOTION.md)说明滚动入场、卡片翻转和角色光标的实现。替换插画或音轨时查阅[素材规格与来源](docs/ASSETS.md)；教材图片的路径与署名单独收录在[教材配图](docs/LEARNING-IMAGE-SOURCES.md)。
