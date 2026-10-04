# Crystalclear9 · 个人网站

[访问网站](https://crystalclear9.github.io/SelfPage/) · [内容维护](docs/CONTENT.md) · [部署说明](docs/DEPLOYMENT.md) · [交互实现](docs/MOTION.md) · [素材来源](docs/ASSETS.md)

个人项目、技术文章与论文的静态网站。使用 React、Vite 和构建时预渲染，发布至 GitHub Pages。每个页面输出独立 HTML，支持直接访问、刷新和无 JavaScript 阅读；客户端加载后接入筛选、主题及交互。

## 文档导航

| 要做的事情 | 阅读位置 |
| --- | --- |
| 首次运行、理解目录、选择测试、清理产物 | [本地开发与验证](docs/DEVELOPMENT.md) |
| 修改项目介绍、添加文章或论文、上传图片和 PDF | [内容维护](docs/CONTENT.md) |
| 推送发布、检查 Actions、定位线上问题、回退版本 | [GitHub Pages 部署](docs/DEPLOYMENT.md) |
| 理解滚动、筛选、返回按钮、光标与刷新行为 | [导航与动效实现](docs/MOTION.md) |
| 查看插画、角色光标、字体及图标的来源 | [素材来源](docs/ASSETS.md) |

## 开发与构建

Node.js 22.12+，推荐与 CI 一致的 Node.js 24。

```bash
npm ci
npm run dev
```

开发地址默认为 `http://127.0.0.1:5173/`。按当前 GitHub Pages 子路径构建和预览：

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run build
npm run preview
```

预览地址默认为 `http://127.0.0.1:4173/SelfPage/`。根路径部署使用 `/`；构建与预览需使用相同的 `SITE_BASE_PATH`。

## 内容与页面

| 内容 | 维护位置 | 页面路径 |
| --- | --- | --- |
| 个人资料、项目说明 | `src/data/site.js` | `/`、`/projects/<id>/` |
| 项目详情正文 | `src/data/project-notes.js` | `/projects/<id>/` |
| 文章 | `content/index.json`、`content/articles/` | `/articles/`、`/articles/<slug>/` |
| 论文 | `content/index.json`、`content/papers/` | `/papers/`、`/papers/<slug>/` |
| 公开 PDF、正文图片 | `public/files/` | `/files/<filename>` |

路径均相对站点根目录。文章与论文目前为空，仅 `published: true` 的条目生成页面。Markdown、PDF、发表链接和项目关联的配置见 [内容维护](docs/CONTENT.md)。这是文件驱动的静态发布流程，不包含在线编辑后台。

本站提供项目说明和源码链接，不提供在线演示。Autellix 是基于[原论文](https://arxiv.org/abs/2502.13965)的个人复现尝试，原方法归论文作者，尚未完成对论文性能结果的复现。

目前展示随手办、GameQA、Autellix 和 TimePredictModel。首页卡片与介绍弹窗用于快速浏览，独立详情页按问题背景、实现过程、适用范围和代码参考展开。项目说明依据公开仓库整理，不代表本站对各项目进行了完整运行或性能复验。

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

`package-lock.json` 用于锁定依赖；空内容目录中的 `.gitkeep` 用于保留后续发布位置。二者都应提交。

`node_modules/` 是本地开发依赖，`dist/` 是构建输出，`.local/` 是截图和报告，均被 Git 忽略。构建输出和报告可删除，命令会重新生成；无需手工上传 `dist/`，CI 从源码构建。

Windows 下运行 `npm run clean` 清理 `dist/` 和 `.local/`，保留依赖、源码、内容及 Git 历史。先停止预览和报告生成任务，再执行清理。可用 `powershell -NoProfile -File scripts/clean.ps1 -WhatIf` 查看目标；清理后需重新构建才能使用预览服务。

## 检查

先运行 `npm run check:content` 与 `npm run build`，再启动预览，在另一个终端指定地址：

```powershell
$env:TEST_URL = 'http://127.0.0.1:4173/SelfPage/'
npm run check:pages
npm run check:static
npm run check:ui
npm run check:motion
npm run check:navigation
npm run check:recovery
npm run check:entry
npm run check:projects
```

浏览器检查使用本机 Microsoft Edge。各检查分别覆盖独立页面、静态首屏、基础交互、滚动与光标、返回导航，以及异常过渡恢复。`npm run audit` 生成 Lighthouse 报告。

按改动范围选择检查，浏览器命令统一显式设置 `TEST_URL`，避免脚本默认端口不同：

| 改动 | 建议检查 |
| --- | --- |
| 项目文案、文章和论文 | `build`、`check:pages`；修改内容加载逻辑时加 `check:content` |
| 首页布局、项目筛选、光标 | `check:ui`、`check:projects`、`check:motion` |
| 首页入口、返回与翻页 | `check:entry`、`check:navigation`、`check:recovery` |
| 预渲染与脚本加载 | `check:static`、`check:pages` |

`check:content` 验证内容加载与渲染规则，`build` 读取当前内容索引并生成页面。CI 当前执行这两项；浏览器检查需在本地或指定的部署地址单独运行。

## 交互与发布约定

- 首页上滑显示回到顶部，页脚按钮可见时隐藏悬浮按钮；子页面上滑显示返回导航，下滑收起。
- 宽屏项目区左侧在导航下方偏上位置停留；分类切换将缩短后的列表定位到开头，以淡入淡出衔接。“了解项目”和“查看源码”并排放置，项目介绍内可复制页面链接。
- 角色光标提示阅读、源码和筛选等操作，复制成功后显示确认；触屏与减少动态效果模式保留普通按钮和文字提示。
- 收藏或直接打开首页时从首屏开始；刷新直接恢复阅读位置，站内返回分区与历史遍历保留定位，浏览后的首页地址不保留分区锚点。`check:entry` 覆盖入口、历史恢复及项目介绍弹窗。
- 滚动卡片、页面翻页、头像与角色光标均支持减少动态效果设置。浏览器不支持页面过渡时使用普通导航。
- 翻页保护脚本独立于应用包，过渡失败或超时后释放正文。实现和测试范围见 [交互说明](docs/MOTION.md)。
- 推送到 `main` 触发 GitHub Actions。仓库 Pages 的 Source 应为 **GitHub Actions**。
- `public/` 会直接发布；公开仓库内的未发布 Markdown 也可通过源码访问，不应存放私人内容或凭据。
