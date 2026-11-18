# SelfPage

Crystalclear9 的个人技术站，收录 AI 应用、系统研究项目、学习笔记和论文。项目页记录实现思路并链接源码，文章按主题和章节组织，论文页集中展示发表信息、方法与实验结果。[访问个人主页](https://crystalclear9.github.io/SelfPage/)

站点使用 React 和 Vite 构建，发布到 GitHub Pages。构建时生成各页面的 HTML，公式、代码和正文随页面一起交付。浏览器端负责项目筛选、章节切换、主题设置和角色光标等交互。

## 运行

依赖范围由 `package.json` 的 `engines.node` 声明（`>=22.12.0`），持续集成使用 Node.js 24。项目使用 npm 和随仓库提交的锁文件。

```sh
git clone https://github.com/Crystalclear9/SelfPage.git
cd SelfPage
npm ci
npm run dev
```

开发服务默认监听 `http://127.0.0.1:5173/`。仓库包含已发布的教材快照，首次运行即可浏览项目、文章与论文。仅在更新教材时使用外部 AILearning 源目录。

## 仓库布局

```text
src/
  App.jsx          首页布局与页面分发
  main.jsx         客户端入口与站内导航
  data/            个人资料、项目记录和路由表
  pages/           内容索引、项目详情和阅读页
  components/      公共界面组件
  lib/             导航、筛选、音频等交互逻辑
  styles/          布局、阅读排版与动效样式
content/           发布索引、Markdown 正文、教材快照
public/            插画、音频、配图与附件
scripts/           内容导入、渲染、预渲染与维护工具
tests/             内容校验与浏览器回归
.github/workflows/ 构建与部署
docs/              开发与维护手册
```

## 内容来源

| 内容 | 维护位置 | 发布方式 |
| --- | --- | --- |
| 个人资料与项目 | [site.js](src/data/site.js)、[project-notes.js](src/data/project-notes.js) | `profile` 提供主页信息；`projects` 和 `projectNotes` 按 ID 关联卡片与详情页。项目数组决定展示顺序。 |
| 文章与论文 | [发布索引](content/index.json)、`content/articles/`、`content/papers/` | 索引保存公开地址、元数据与发布状态，Markdown 保存正文。论文作者、会议与 PDF 地址随索引维护。 |
| AILearning | [教材快照](content/collections/ailearning)、[配图目录](public/files/ailearning) | 导入脚本从源目录生成章节清单并复制正文与配图。站点构建直接读取已提交的快照。 |

源目录位于本站仓库旁的 `AI_Learning/` 时，同步命令为 `npm run import:learning -- ../AI_Learning`。正文、清单与配图作为同一批内容提交。项目字段、文章条目示例与附件路径见[内容维护](docs/CONTENT.md)。

## 构建与发布

`npm run build` 先由 Vite 打包前端资源，再按路由生成 `dist/<路径>/index.html` 和 `dist/404.html`。例如，项目 ID `gameqa` 对应 `dist/projects/gameqa/index.html`。当前 Pages 站点挂载在 `/SelfPage/`；本地复核发布路径时，构建与预览使用相同前缀。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run build
npm run preview -- --port 4174 --strictPort
```

预览地址为 `http://127.0.0.1:4174/SelfPage/`。发往 `main` 的拉取请求运行内容检查、生产构建和浏览器回归。站点变更推送到 `main` 后，工作流校验并部署 `dist/`。只涉及 README 或 `docs/` 的提交跳过部署。[发布工作流](.github/workflows/deploy.yml)

## 开发文档

| 文档 | 内容 |
| --- | --- |
| [架构](docs/ARCHITECTURE.md) | 路由生成、首屏 HTML、客户端挂载、站内导航与组件生命周期 |
| [本地开发](docs/DEVELOPMENT.md) | 运行环境、测试命令、预览配置、渲染故障定位与工作区清理 |
| [内容维护](docs/CONTENT.md) | 项目数据结构、发布索引、文章与论文排版、教材导入和引用检查 |
| [部署](docs/DEPLOYMENT.md) | Pages 配置、工作流触发条件、发布产物、版本核对与回退 |
| [站点功能](docs/FEATURES.md) · [导航与动效](docs/MOTION.md) | 页面操作、返回目标、滚动反馈及角色交互 |
| [站点素材](docs/ASSETS.md) · [教材配图](docs/LEARNING-IMAGE-SOURCES.md) | 资源规格、来源、音轨配置、图片路径与署名 |
