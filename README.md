# SelfPage

SelfPage 是 Crystalclear9 个人网站的源码仓库，用于维护和发布开源项目介绍、开发记录、技术文章和研究论文。

[访问个人主页](https://crystalclear9.github.io/SelfPage/)

## 本地运行

项目使用 React 和 Vite，开发与部署环境采用 Node.js 24。在仓库根目录通过 npm 安装锁定版本的依赖：

```sh
git clone https://github.com/Crystalclear9/SelfPage.git
cd SelfPage
npm ci
npm run dev
```

开发服务默认监听 `http://127.0.0.1:5173/`。已发布的文章、教材和配图随仓库提供；修改页面布局或正文时可直接在开发服务中预览。

## 源码结构

| 位置 | 职责 |
| --- | --- |
| [src/App.jsx](src/App.jsx)、[src/pages/](src/pages) | 首页布局、项目详情、文章与论文索引、教材阅读页 |
| [src/data/](src/data) | 个人资料、项目数据、公开路由 |
| [src/components/](src/components)、[src/lib/](src/lib)、[src/styles/](src/styles) | 公共组件、浏览器交互、布局与样式 |
| [content/](content)、[public/](public) | 参与构建的正文和清单，以及按原路径发布的图片、音频和附件 |
| [scripts/](scripts)、[tests/](tests) | 内容导入、静态页生成、数据校验与浏览器测试 |
| [.github/workflows/](.github/workflows) | 拉取请求检查与 GitHub Pages 部署 |

## 内容更新

**个人资料与项目**由 [site.js](src/data/site.js) 维护。`profile` 保存首页资料，`projects` 定义卡片及展示顺序。[project-notes.js](src/data/project-notes.js) 使用相同的项目 ID 保存背景、实现过程和当前进展。修改项目简介与扩写独立详情页，各有对应的数据位置。

**文章与论文**以 Markdown 编写，在 [content/index.json](content/index.json) 登记标题、日期、正文路径及发布状态。索引中的 `type` 与 `slug` 决定公开地址；论文的作者、发表会议与 PDF 也在该条目中维护。

**AILearning 教材**从源目录导入。若源仓库位于相邻的 `AI_Learning/`，执行 `npm run import:learning -- ../AI_Learning`。提交导入后的正文、清单及对应配图即可发布同一版本的资料。[字段定义、正文示例与教材目录规则](docs/CONTENT.md)

## 构建与测试

Vite 生成资源后，预渲染脚本把每个公开页面写入 `dist/`。例如，项目 `gameqa` 生成 `dist/projects/gameqa/index.html`。线上部署前缀为 `/SelfPage/`，本地生产预览使用相同前缀。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

预览地址为 `http://127.0.0.1:4174/SelfPage/`。保留该服务，在第二个终端运行 `npm run check:browser-ci`，可验证同一份构建产物的导航、阅读、光标与历史恢复。[开发环境与测试](docs/DEVELOPMENT.md)

## 发布与维护

发往 `main` 的拉取请求运行生产构建与浏览器回归。站点改动推送到 `main` 后，工作流校验内容并将 `dist/` 发布到 GitHub Pages。仅涉及 README 或 `docs/` 的提交直接更新仓库文档。[工作流与发布配置](docs/DEPLOYMENT.md)

| 维护主题 | 文档 |
| --- | --- |
| 扩展路由、页面类型和客户端导航 | [站点架构](docs/ARCHITECTURE.md) |
| 调整项目筛选、返回入口与角色交互 | [站点功能](docs/FEATURES.md) · [导航与动效](docs/MOTION.md) |
| 替换插画和音轨、更新图片出处 | [站点素材](docs/ASSETS.md) · [教材配图](docs/LEARNING-IMAGE-SOURCES.md) |
