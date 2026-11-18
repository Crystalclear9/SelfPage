# Crystalclear9 的个人主页

从一张截图里提取待办，到让多个智能体围绕证据分工，这里记录我在 AI 应用和系统方面做过的尝试。首页可以翻看项目卡片，沿着感兴趣的问题进入实现笔记和源码；想坐下来慢慢读，也可以直接打开学习章节或论文。加藤惠会安静地陪你翻页。如果故意在空白处来回晃几下鼠标，她会等半拍，悄悄压低眼帘。每次进入站点或刷新时会选定一套衣装，接下来翻到哪一页都是同一套。

[打开首页](https://crystalclear9.github.io/SelfPage/) · [读 AILearning](https://crystalclear9.github.io/SelfPage/articles/ailearning/) · [看 K-GAT 论文介绍](https://crystalclear9.github.io/SelfPage/papers/k-gat/)

## 在本机打开

使用 Node.js 22.12 或更高版本，部署工作流使用 Node.js 24。

```sh
npm ci
npm run dev
```

打开终端显示的地址，默认是 `http://127.0.0.1:5173/`。改项目介绍时可以直接看卡片、简介弹窗和详情页的效果。

## 下一次更新从哪里开始

| 想改什么 | 从这里开始 |
| --- | --- |
| 个人介绍、头像和点赞语音 | `src/data/site.js` 的 `profile`。音频放在 `public/audio/` |
| 项目卡片和实现笔记 | 在 `src/data/site.js` 改摘要、分类和仓库链接，在 `src/data/project-notes.js` 改详情。两处用项目 ID 关联 |
| 独立文章或论文 | 在 `content/articles/` 或 `content/papers/` 写 Markdown，再到 `content/index.json` 填写标题、摘要和发布信息 |
| AILearning 学习资料 | 在教材源目录改正文与配图，再运行 `npm run import:learning -- ../AI_Learning`。目录、章内引用和前后章链接随快照生成 |
| 首页滚动、翻页与阅读导航 | 页面组合在 `src/App.jsx` 与 `src/pages/`，共享控件在 `src/components/`，样式在 `src/styles/` |

项目详情适合写实现时做过的选择。例如，随手办从截图里的事项讲到用户如何核对提醒，Autellix 则从原论文的调度问题讲到个人复现的进展。学习资料可以按主题逐章读。论文页适合把方法图和实验结果放在对应的论述旁边。字段示例与素材路径见[内容维护手册](docs/CONTENT.md)。

## 发布前预览

React 与 Vite 负责页面和交互，构建脚本为每个公开地址生成独立 HTML。用 GitHub Pages 的子路径预览，能同时检查从首页点进去和直接打开深层链接这两种读法。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
npm run preview
```

打开 `http://127.0.0.1:4173/SelfPage/`。在另一个终端执行下面的命令，可以用浏览器验证导航与整套教材的实际渲染。

```powershell
$env:TEST_URL = 'http://127.0.0.1:4173/SelfPage/'
npm run check:navigation
node tests/learning-render.mjs
```

推送到 `main` 后，GitHub Actions 会从源码重新构建并发布。[部署与回退](docs/DEPLOYMENT.md)

## 开发手册

- [功能与操作](docs/FEATURES.md) · [滚动与导航](docs/MOTION.md)
- [模块与数据流](docs/ARCHITECTURE.md) · [本地开发、测试与清理](docs/DEVELOPMENT.md)
- [插画、字体与语音来源](docs/ASSETS.md) · [学习资料配图署名](docs/LEARNING-IMAGE-SOURCES.md)
