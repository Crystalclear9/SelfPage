# Crystalclear9 · 个人网站

[访问网站](https://crystalclear9.github.io/SelfPage/) · [内容维护](docs/CONTENT.md) · [部署说明](docs/DEPLOYMENT.md) · [交互实现](docs/MOTION.md) · [素材来源](docs/ASSETS.md)

个人项目、技术文章与论文的静态网站。使用 React、Vite 和构建时预渲染，发布至 GitHub Pages。每个页面输出独立 HTML，支持直接访问、刷新和无 JavaScript 阅读；客户端加载后接入筛选、主题及交互。

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
| 文章 | `content/index.json`、`content/articles/` | `/articles/`、`/articles/<slug>/` |
| 论文 | `content/index.json`、`content/papers/` | `/papers/`、`/papers/<slug>/` |
| 公开 PDF、正文图片 | `public/files/` | `/files/<filename>` |

路径均相对站点根目录。文章与论文目前为空，仅 `published: true` 的条目生成页面。Markdown、PDF、发表链接和项目关联的配置见 [内容维护](docs/CONTENT.md)。这是文件驱动的静态发布流程，不包含在线编辑后台。

本站提供项目说明和源码链接，不提供在线演示。Autellix 是基于[原论文](https://arxiv.org/abs/2502.13965)的个人复现尝试，原方法归论文作者，尚未完成对论文性能结果的复现。

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
  lib/              首页入口、翻页方向与异常恢复
  pages/            项目详情、内容索引和正文
  styles/           基础、内容、导航及动效样式
scripts/            内容校验、静态生成和性能检查
tests/              内容、渲染及交互回归检查
docs/               内容维护、部署、交互及素材文档
```

`package-lock.json` 用于锁定依赖；空内容目录中的 `.gitkeep` 用于保留后续发布位置。二者都应提交。

`node_modules/` 是本地开发依赖，`dist/` 是构建输出，`.local/` 是截图和报告，均被 Git 忽略。构建输出和报告可删除，命令会重新生成；无需手工上传 `dist/`，CI 从源码构建。

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
```

浏览器检查使用本机 Microsoft Edge。各检查分别覆盖独立页面、静态首屏、基础交互、滚动与光标、返回导航，以及异常过渡恢复。`npm run audit` 生成 Lighthouse 报告。

## 交互与发布约定

- 首页上滑显示回到顶部，页脚按钮可见时隐藏悬浮按钮；子页面上滑显示返回导航，下滑收起。
- 收藏或直接打开首页时从首屏开始；站内返回分区保留定位，浏览后的首页地址不保留分区锚点。`check:entry` 覆盖入口、历史恢复及项目介绍弹窗。
- 滚动卡片、页面翻页、头像与角色光标均支持减少动态效果设置。浏览器不支持页面过渡时使用普通导航。
- 翻页保护脚本独立于应用包，过渡失败或超时后释放正文。实现和测试范围见 [交互说明](docs/MOTION.md)。
- 推送到 `main` 触发 GitHub Actions。仓库 Pages 的 Source 应为 **GitHub Actions**。
- `public/` 会直接发布；公开仓库内的未发布 Markdown 也可通过源码访问，不应存放私人内容或凭据。
