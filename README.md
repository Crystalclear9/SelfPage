# SelfPage

SelfPage 是 Crystalclear9 个人网站的源码仓库，用于维护和发布开源项目介绍、开发记录、技术文章和研究论文。

[访问个人主页](https://crystalclear9.github.io/SelfPage/)

## 文档导航

| 要做的事情 | 阅读位置 |
| --- | --- |
| 了解网站已有功能、操作方式和本地偏好 | [功能说明与使用指南](docs/FEATURES.md) |
| 理解模块关系、数据约定、状态和扩展方式 | [开发设计与扩展约定](docs/ARCHITECTURE.md) |
| 首次运行、理解目录、选择测试、清理产物 | [本地开发与验证](docs/DEVELOPMENT.md) |
| 修改个人介绍、项目说明，添加文章、论文与附件 | [内容维护](docs/CONTENT.md) |
| 推送发布、检查 Actions、定位线上问题、回退版本 | [GitHub Pages 部署](docs/DEPLOYMENT.md) |
| 理解滚动、筛选、返回按钮、光标与刷新行为 | [导航与动效实现](docs/MOTION.md) |
| 查看插画、角色光标、字体及图标的来源 | [素材来源](docs/ASSETS.md) |
| 查询教材插图的文件路径、作者与许可 | [教材配图与署名](docs/LEARNING-IMAGE-SOURCES.md) |

## 已实现功能

- **个人介绍**：头像、公开 GitHub 入口与两段简短说明；介绍内容集中在 `profile` 中维护。
- **项目展示**：分类筛选、简介弹窗、五个独立详情页、源码跳转和项目链接复制。
- **内容发布**：Markdown 文章、论文索引、作者与发表信息、PDF 和项目关联记录；通过仓库文件维护。
- **AILearning 专题**：文章列表保留一个入口，进入后按分类、主题、章节阅读；支持公式、章内目录和前后章导航。
- **页面导航**：分区定位、滚动选中态、项目前后翻页、上滑返回条、互斥的回到顶部入口。
- **阅读入口**：独立 HTML、直接访问与刷新、收藏首屏定位、浏览器历史位置恢复。
- **视觉交互**：浅深色主题、加藤惠光标、樱花拖尾、头像问候及首页板块与项目卡片滚动动效。
- **论文阅读**：静态连续的图文排版，提供页内目录、对照图组与返回导航；正文不随滚动出现或消失。
- **阅读环境**：静态阅读、窄屏布局、键盘操作和减少动态效果支持。

## 本地运行

项目使用 React 和 Vite，开发与部署环境采用 Node.js 24。在仓库根目录通过 npm 安装锁定版本的依赖：

```sh
git clone https://github.com/Crystalclear9/SelfPage.git
cd SelfPage
npm ci
npm run dev
```

开发服务默认监听 `http://127.0.0.1:5173/`。已发布的文章、教材和配图随仓库提供；修改页面布局或正文时可直接在开发服务中预览。

## 内容与页面

| 内容 | 维护位置 | 页面路径 |
| --- | --- | --- |
| 个人资料、项目说明 | `src/data/site.js` | `/`、`/projects/<id>/` |
| 项目详情正文 | `src/data/project-notes.js` | `/projects/<id>/` |
| 文章 | `content/index.json`、`content/articles/` | `/articles/`、`/articles/<slug>/` |
| AILearning 资料 | `content/collections/ailearning/` | `/articles/ailearning/` 及其下级页面 |
| 论文 | `content/index.json`、`content/papers/` | `/papers/`、`/papers/<slug>/` |
| 公开 PDF、正文图片 | `public/files/` | `/files/<filename>` |

页面路径相对于站点根目录。项目 ID 关联卡片、详情正文和项目间翻页。首页展示随手办、GameQA、Autellix、TimePredictModel 和 SandBoxSim；Autellix 在详情页标注为论文复现，并附原论文链接。

文章与论文通过 `content/index.json` 发布。AILearning 在文章列表中使用一个专题入口，子页面由教材清单生成。源资料位于相邻目录时，运行 `npm run import:learning -- ../AI_Learning` 更新快照；正文、清单和配图随同一次修改提交。

## 项目结构

```text
.github/workflows/  GitHub Pages 构建与部署
content/            文章、论文正文与元数据
public/             直接发布的图片、图标和附件
src/
  App.jsx           首页与公共页面框架
  main.jsx          客户端入口
  components/       导航、头像、光标、弹窗和拖尾
  data/             个人资料、项目及路由数据
  lib/              首页入口、项目筛选、翻页方向与异常恢复
  pages/            项目详情、内容索引和正文
  styles/           基础、内容、导航及动效样式
scripts/            内容校验、静态生成、性能检查与产物清理
tests/              内容、渲染及交互回归检查
docs/               内容维护、部署、交互及素材文档
```

## 构建与测试

Vite 生成资源后，预渲染脚本把每个公开页面写入 `dist/`。例如，项目 `gameqa` 生成 `dist/projects/gameqa/index.html`。线上部署前缀为 `/SelfPage/`，本地生产预览使用相同前缀。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

预览地址为 `http://127.0.0.1:4174/SelfPage/`。

## 检查与发布

| 改动范围 | 检查命令 |
| --- | --- |
| 文章、论文与项目说明 | `npm run check:content`、`npm run build`；启动预览后执行 `npm run check:pages` |
| 教材导入与引用 | 构建后执行 `npm run check:learning`、`node tests/learning-references.mjs` |
| 首页、项目筛选与动效 | 在生产预览上执行 `npm run check:projects`、`npm run check:chapters`、`npm run check:motion` |
| 导航、阅读与刷新 | 在生产预览上执行 `npm run check:browser-ci` |

浏览器测试使用 `TEST_URL` 指定预览地址。发往 `main` 的拉取请求运行生产构建和浏览器回归；站点改动推送至 `main` 后，工作流校验并发布 `dist/`。仅修改 README 或 `docs/` 时跳过 Pages 部署。
