# SelfPage

Crystalclear9 的个人技术站，收录 AI 应用、系统研究、技术文章与论文。首页按主题展示项目，详情页记录实现思路并链接到源码。学习资料按章阅读，论文有独立的图文介绍页。

[个人主页](https://crystalclear9.github.io/SelfPage/) · [AILearning](https://crystalclear9.github.io/SelfPage/articles/ailearning/) · [K-GAT](https://crystalclear9.github.io/SelfPage/papers/k-gat/)

## 本地运行

项目使用 React、Vite 和 Node.js 22.12+，发布环境使用 Node.js 24。

```sh
npm ci
npm run dev
```

打开终端显示的地址，默认是 `http://127.0.0.1:5173/`。开发服务会随源码修改更新页面。

## 站点内容

| 栏目 | 内容 | 维护入口 |
| --- | --- | --- |
| 个人介绍 | 公开简介、头像、GitHub 链接和问候语音 | `src/data/site.js` 中的 `profile` |
| 应用 | 随手办从截图与文档整理待办，GameQA 提供游戏知识问答，SandBoxSim 模拟生态与居民行为 | 同文件的 `projects` 定义卡片，`src/data/project-notes.js` 保存详情 |
| 系统研究 | Autellix 记录推理调度论文复现，TimePredictModel 研究工具回返时间预测 | 项目 ID 关联首页、详情及前后页 |
| 文章 | 独立技术笔记与 AILearning 教材专题 | `content/index.json`、`content/articles/`、`content/collections/` |
| 论文 | 发表信息、作者、正文、配图与原文入口 | `content/papers/` 和 `public/files/` |

## 构建与发布

Vite 打包资源，预渲染脚本为每个公开地址写出独立 HTML。读者直接打开章节链接即可获得正文。用线上路径验证本地构建时，在 PowerShell 中运行：

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run build
npm run preview -- --port 4174 --strictPort
```

预览地址为 `http://127.0.0.1:4174/SelfPage/`。拉取请求会运行浏览器回归；推送到 `main` 后，GitHub Actions 校验内容并发布构建产物。[开发与测试](docs/DEVELOPMENT.md) · [发布流程](docs/DEPLOYMENT.md)

## 维护手册

| 任务 | 文档 |
| --- | --- |
| 发布文章、补充论文、更新项目或同步教材 | [内容维护](docs/CONTENT.md) |
| 扩展路由、理解预渲染与客户端生命周期 | [架构](docs/ARCHITECTURE.md) |
| 查询导航、阅读、主题和首页操作 | [站点功能](docs/FEATURES.md) |
| 修改卡片翻转、分区入场、返回按钮或角色光标 | [交互动效](docs/MOTION.md) |
| 替换站点图片、语音或维护教材插图署名 | [站点素材](docs/ASSETS.md) · [教材配图](docs/LEARNING-IMAGE-SOURCES.md) |
