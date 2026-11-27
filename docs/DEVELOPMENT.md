# 本地开发

使用与 CI 相同的 Node.js 24，在仓库根目录运行 `npm ci`。日常编辑使用开发服务，验收路由、样式与素材路径时使用生产预览。

## 服务与配置

`npm run dev` 默认在 `http://127.0.0.1:5173/` 提供源码开发服务。生产预览使用 `npm run preview` 读取构建输出；该模式包含部署前缀、预渲染 HTML、入口资源版本以及发布状态过滤。

| 环境变量 | 生效阶段 | 本站常用值 |
| --- | --- | --- |
| `SITE_BASE_PATH` | Vite 开发、构建和生产预览的根路径 | 本地开发 `/`；Pages 构建与预览 `/SelfPage/` |
| `TEST_URL` | 浏览器测试和 Lighthouse 的访问地址 | `http://127.0.0.1:4174/SelfPage/` |
| `BROWSER_CHANNEL` | 支持该变量的光标与过渡测试所用浏览器 | 本地默认 `msedge`；CI 使用 `chrome` 或 `chromium` |

### 生产预览

在仓库根目录的 PowerShell 终端运行：

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
node tests/voice.mjs
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

预览服务读取 `dist/`。源文件变更后重新构建即可更新预览内容。切回根路径开发时，在启动开发服务的终端执行 `Remove-Item Env:SITE_BASE_PATH -ErrorAction SilentlyContinue`。

### 浏览器回归

预览服务运行期间，在另一终端从仓库根目录执行：

```powershell
$env:TEST_URL = 'http://127.0.0.1:4174/SelfPage/'
npm run check:navigation
npm run check:learning-ui
node tests/cursor-refresh.mjs
npm run check:recovery
```

`TEST_URL` 指向同一份生产预览。上述检查分别覆盖导航、章节、静止光标与页面恢复。

### 浏览器环境

本地浏览器测试以 Microsoft Edge 为主。发布流程验证 GameQA 的标题过渡，也可使用 Playwright 安装的 Chromium 复现该项检查。

```powershell
npx playwright install chromium
$env:BROWSER_CHANNEL = 'chromium'
node tests/project-transition.mjs
```

`check:learning` 适合每次内容构建后执行。调整公式处理、代码高亮、教材图片路径或全局阅读样式时，再运行 `node tests/learning-render.mjs`。它逐页打开折叠内容、等待字体与图片就绪，分别检查启用和关闭 JavaScript、375px 和 1440px 视口、浅色和深色主题。失败输出中的路由可直接拼在预览地址后复现。

## 开发入口

| 需求 | 入口 | 对应页面或行为 |
| --- | --- | --- |
| 修改昵称、个人说明、GitHub 地址 | `src/data/site.js` 的 `profile` | “关于我”读取 `intro`、`about` 两段；邮箱留空时不生成邮件入口 |
| 修改首屏的补充说明 | `src/App.jsx` 的 `hero-description` | 与个人介绍独立维护，调整技术方向时核对两处文案 |
| 修改项目卡片、分类和简介弹窗 | `src/data/site.js` 的 `projects` | 保持已有 `id` 稳定 |
| 扩充项目独立详情 | `src/data/project-notes.js` | 对应项目 ID 必须存在 |
| 新增文章、论文或附件 | `content/`、`public/files/` | 按内容指南配置元数据 |
| 同步 AILearning 学习资料 | `scripts/import-learning.mjs`、`content/collections/ailearning/` | 一个专题入口，下级章节不写入文章列表 |
| 调整学习目录和章节阅读页 | `src/pages/LearningPage.jsx`、`scripts/learning.mjs` | 检查深层链接、公式、锚点与静态阅读 |
| 调整首页结构、公共导航 | `src/App.jsx` | 同时检查桌面与手机菜单 |
| 调整项目详情、文章列表 | `src/pages/ContentPage.jsx` | 独立文章与论文正文由 `WritingDetail.jsx` 承载 |
| 调整论文正文、配图和页内目录 | `src/pages/PaperBody.jsx`、`src/styles/content.css` | 保持静态连续阅读，核对图片尺寸、图注和锚点 |
| 修改主题、基础排版 | `src/styles/base.css` | 浅色、深色共用主题变量 |
| 修改滚动、翻页、光标 | 对应组件与 `src/styles/` | 文件职责见交互文档，保留减少动态效果分支 |
| 修改分类切换 | `src/lib/useProjectFilter.js` | 检查列表缩短时的定位和快速连续点击 |
| 修改收藏、刷新入口 | `src/lib/home-entry.js` | 独立内联脚本，不依赖 React 初始化 |

## 测试命令与覆盖范围

| 改动 | 检查 | 观察点 |
| --- | --- | --- |
| 新增文章或论文 | `check:content`、`check:pages` | 草稿过滤、元数据、正文与详情页直达 |
| 导入教材 | `check:learning`、`node tests/learning-references.mjs` | 在构建后逐页核对锚点、站内目标、图片与公式 |
| 修改教材渲染 | `check:learning-ui`、`node tests/learning-render.mjs`、`node tests/code-blocks.mjs` | 实际解码图片；切换明暗、宽窄视口和脚本状态，检查代码缩进、字体与语法颜色 |
| 项目筛选与首页编排 | `check:projects`、`check:chapters` | 分类切换后的滚动位置、卡片往返入场与标题停靠 |
| 修改路由或入口资源 | `check:entry`、`check:navigation`、`check:assets`、`check:static` | 收藏与刷新、前进后退、旧页面加载资源、纯 HTML 阅读 |
| 光标、语音或动作 | `node tests/cursor-refresh.mjs`、`check:motion`、`node tests/voice.mjs` | 衣装切换、命中位置、减少动态效果、取消和重试 |
| 全站控件与性能 | `check:ui`、`npm run audit` | 窄屏菜单、主题、弹窗和 Lighthouse 报告 |

表中的 `check:*` 对应 package.json 中的 npm 脚本。语音测试直接检验播放器；`check:content` 检验索引和 Markdown；`check:learning` 与引用扫描读取 `dist/`。涉及界面、样式和历史记录的测试使用运行中的 HTTP 服务。

## 手动验收场景

| 验收对象 | 实际操作 | 预期结果 |
| --- | --- | --- |
| 项目卡片 | 在「全部」向下滚动，再选「应用」，打开 GameQA 并返回 | 列表从筛选后的内容开始，项目标题、详情和返回目标对应同一项目 |
| 教材阅读 | 从「文章」进入分类、主题、章节，复制章节地址到新标签页 | 两个入口展示相同章标题、目录、公式和图片；前后章链接沿清单顺序切换 |
| 图文排版 | 将视口调到 375px，查看含表格、长代码与图片的章节，再切换深色主题 | 长代码保留缩进和语法颜色；内容可阅读，页面整体宽度贴合视口 |
| 历史恢复 | 同一标签页从首页进入详情后按后退，再按前进 | 地址、主标题、返回操作和滚动位置对应当前页面 |

## 渲染诊断

| 表现 | 检查位置 | 判断依据 |
| --- | --- | --- |
| 子页面有文字，缺少样式 | Network 中该页 HTML 引用的 `assets/site.css` | 当前部署前缀为 `/SelfPage/`。CSS 请求应返回样式表；响应为 HTML 时，先追踪请求路径。 |
| 站内换章后仍显示上一章 | 目标页 HTML 中的 `#learning-content`、换页后的正文 | 核对章节链接的 href、目标文档标题和清单中的章节编号，再比较直接访问与点击打开的结果。 |
| 代码无颜色或公式字体异常 | 代码 token 的计算样式、KaTeX 字体请求 | HTML 已有高亮节点时检查样式；HTML 中存在 `.katex-error` 时检查公式源文与构建渲染。 |
| 章节插图缺失 | 渲染后的 `img.src`、文件大小写、SVG 片段 | 本地引用检查覆盖路径和片段，逐页浏览器检查覆盖图片解码。[教材配图](LEARNING-IMAGE-SOURCES.md) |
| 静止刷新后显示系统箭头 | 首屏内联光标样式、当前衣装与姿态图层 | 在桌面 Edge 按 F5，记录首次移动前的显示结果，与样式及图层状态对照。[角色光标](MOTION.md#角色光标) |

## 工作区清理

在仓库根目录运行 `git status --short --ignored` 可同时查看源码改动、未跟踪文件和已忽略的本地产物。其中 `!!` 表示命中忽略规则；例如 `node_modules/` 是运行开发服务所需的依赖，`dist/` 是可重新构建的站点副本。

Windows 下的 `npm run clean` 直接删除仓库根目录的 `dist/` 和 `.local/`。先结束教材导入并停止占用这些目录的预览服务；如果上一次导入中断，应先恢复教材快照，再清理暂存区。[教材同步](CONTENT.md#同步-ailearning)

| 本地产物 | 用途 | 重新生成方式 |
| --- | --- | --- |
| `dist/` | 生产页面与打包资源 | `npm run build` |
| `.local/reports/` | 浏览器测试截图、界面检查结果和 Lighthouse 报告 | 运行对应测试或 `npm run audit` |
| `.local/learning-import/` | 教材导入的暂存文件、锁和目录替换记录 | 下次运行 `npm run import:learning` 时创建 |

在仓库根目录运行以下命令，可依次预览清理目标并执行清理。

```powershell
powershell -NoProfile -File scripts/clean.ps1 -WhatIf
npm run clean
```

`node_modules/` 保存本机开发依赖。Vite 在其中创建 `.vite/` 和 `.vite-temp/` 作为缓存，可在停止相关进程后单独清理。再次使用生产预览前需执行 `npm run build`；直接运行会保存截图的测试时，可用 `New-Item -ItemType Directory -Force .local/reports` 创建输出目录。

教材正文以清单的 `pages[].file` 对应 `content/collections/ailearning/`，附件以 `images[]` 对应 `public/files/ailearning/`。这两组文件属于构建输入，随教材更新一起维护。[教材同步](CONTENT.md#同步-ailearning)
