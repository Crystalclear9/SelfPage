# SelfPage

SelfPage 是 Crystalclear9 个人网站的源码仓库。网站用于介绍个人开源项目、记录开发过程，以及发布技术文章和研究论文。

[访问个人主页](https://crystalclear9.github.io/SelfPage/)

## 本地运行

CI 使用 Node.js 24，npm 按仓库中的 `package-lock.json` 安装依赖。

```sh
git clone https://github.com/Crystalclear9/SelfPage.git
cd SelfPage
npm ci
npm run dev
```

开发地址为 `http://127.0.0.1:5173/`。仓库已包含发布所用的文章、教材快照与配图。编辑首页和页面组件时，Vite 会更新浏览器中的页面。

## 内容维护

| 内容 | 编辑位置 | 页面上的变化 |
| --- | --- | --- |
| 个人资料 | [site.js](src/data/site.js) 中的 `profile` | 首页简介、联系方式和互动语音 |
| 项目 | 同文件的 `projects` 数组，以及 [project-notes.js](src/data/project-notes.js) | 数组决定卡片分类与顺序；同一 ID 的详情记录提供项目背景、实现过程和进展 |
| 文章与论文 | [发布索引](content/index.json) 和 `content/articles/`、`content/papers/` 下的 Markdown | 索引决定标题、地址与发布状态，Markdown 提供正文。论文的作者、会议和 PDF 地址也在索引中维护 |
| AILearning | 教材源仓库 | 导入器复制正文和配图，生成分类、主题、章节之间的导航关系 |

教材源目录位于相邻的 `AI_Learning/` 时，同步命令如下。导入结果分别保存在 `content/collections/ailearning/` 和 `public/files/ailearning/`，两部分随同一次内容更新提交。[内容字段与发布示例](docs/CONTENT.md)

```sh
npm run import:learning -- ../AI_Learning
```

## 开发结构

首页布局在 [App.jsx](src/App.jsx)。`src/pages/` 实现项目详情、文章索引、教材和论文阅读页；`src/components/` 与 `src/lib/` 提供导航、筛选、音频和光标等共享功能，样式集中在 `src/styles/`。

[路由表](src/data/routes.js) 将项目 ID、文章 slug 和教材清单映射到公开地址。[预渲染脚本](scripts/prerender.mjs) 为每个地址生成对应的 `index.html`；[客户端入口](src/main.jsx) 在这份 HTML 上挂载 React。例如 `gameqa` 的页面文件为 `dist/projects/gameqa/index.html`，线上地址为 `/SelfPage/projects/gameqa/`。[构建与导航架构](docs/ARCHITECTURE.md)

### 目录约定

| 路径 | 用途 |
| --- | --- |
| `content/` | 参与构建的内容源文件。文章的 `body` 字段相对此目录解析。 |
| `public/` | 按原文件名发布的资源。例如 `public/files/k-gat/training.png` 在论文正文中引用为 `/files/k-gat/training.png`。 |
| `scripts/` | 内容加载、教材导入、静态页面生成与本地维护工具。 |
| `tests/` | 内容、资源与浏览器交互检查。CI 的执行顺序由 `.github/workflows/deploy.yml` 定义。 |
| `dist/` | 生产构建的输出目录，也是 GitHub Pages 使用的发布根目录。 |

## 构建与发布

在 PowerShell 中使用线上路径前缀构建，随后启动生产预览：

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

生产预览位于 `http://127.0.0.1:4174/SelfPage/`。预览运行期间，可在另一终端执行 `npm run check:browser-ci`，检查真实页面中的导航、章节阅读、光标和历史恢复。[测试命令与浏览器配置](docs/DEVELOPMENT.md)

发往 `main` 的拉取请求运行构建和浏览器回归。站点变更推送至 `main` 后，GitHub Actions 将通过内容检查的 `dist/` 发布到 Pages。仅修改 README 或 `docs/` 时跳过部署。[部署配置与版本回退](docs/DEPLOYMENT.md)

## 界面与资源

[站点功能](docs/FEATURES.md)记录页面操作与导航目的地，[导航与动效](docs/MOTION.md)说明滚动入场、卡片布局和光标姿态的实现。插画、角色光标和语音的来源与规格见[站点素材](docs/ASSETS.md)，教材图片的引用路径与署名见[教材配图](docs/LEARNING-IMAGE-SOURCES.md)。
