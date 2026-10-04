# 本地开发与验证

本文说明如何从仓库源码运行网站、选择修改位置，以及在发布前检查结果。内容上传见 [内容维护](CONTENT.md)，线上发布见 [部署说明](DEPLOYMENT.md)。

## 1. 准备环境

需要 Git、Node.js 和 npm。项目声明 Node.js 22.12+，日常开发建议使用与 CI 一致的 Node.js 24。浏览器回归脚本默认使用本机 Microsoft Edge；只编辑内容、启动开发服务和构建不需要运行浏览器测试。

首次获取源码：

```powershell
git clone https://github.com/Crystalclear9/SelfPage.git
cd SelfPage
node --version
npm --version
npm ci
```

已经有工作目录时，先运行 `git status --short` 查看未提交内容。工作区干净且需要同步远程时，使用 `git pull --ff-only`；有本地修改时先处理这些修改，避免在同步过程中混入不相关内容。

`npm ci` 按 `package-lock.json` 安装依赖。只改文案或样式时无需更新依赖版本；有意调整依赖时使用 npm 更新，并同时提交 `package.json` 和锁文件。

## 2. 开发服务与生产预览

### 开发服务

```powershell
# 清除当前终端可能遗留的部署前缀，按根路径开发。
Remove-Item Env:SITE_BASE_PATH -ErrorAction SilentlyContinue
npm run dev
```

默认打开 `http://127.0.0.1:5173/`。终端需保持运行，按 Ctrl+C 停止。端口被占用时以 Vite 实际打印的地址为准。

源码修改会触发开发更新，`content/` 的变化会触发内容模块重新加载。开发服务主要用于编辑反馈；静态首屏、资源前缀和独立页面访问应使用生产预览检查。

### 按线上子路径预览

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run build
npm run preview -- --port 4173
```

访问 `http://127.0.0.1:4173/SelfPage/`。`preview` 读取 `dist/`，不会随着源码变更自动重新构建；修改后需再次运行 `npm run build`。PowerShell 环境变量只对当前进程及其子进程有效，换终端时应重新设置。

## 3. 从哪一层修改

| 需求 | 入口 | 注意事项 |
| --- | --- | --- |
| 修改昵称、个人说明、GitHub 地址 | `src/data/site.js` 的 `profile` | 邮箱留空时不生成邮件入口 |
| 修改项目卡片、分类和简介弹窗 | `src/data/site.js` 的 `projects` | 保持已有 `id` 稳定 |
| 扩充项目独立详情 | `src/data/project-notes.js` | 对应项目 ID 必须存在 |
| 新增文章、论文或附件 | `content/`、`public/files/` | 按内容指南配置元数据 |
| 调整首页结构、公共导航 | `src/App.jsx` | 同时检查桌面与手机菜单 |
| 调整项目详情、文章列表和正文 | `src/pages/ContentPage.jsx` | 同时检查静态渲染与客户端加载 |
| 修改主题、基础排版 | `src/styles/base.css` | 浅色、深色共用主题变量 |
| 修改滚动、翻页、光标 | 对应组件与 `src/styles/` | 文件职责见交互文档，保留减少动态效果分支 |
| 修改分类切换 | `src/lib/useProjectFilter.js` | 检查列表缩短时的定位和快速连续点击 |
| 修改收藏、刷新入口 | `src/lib/home-entry.js` | 独立内联脚本，不依赖 React 初始化 |

## 4. 页面如何生成

构建流程是 `vite build`，随后执行 `scripts/prerender.mjs`：

1. `scripts/content.mjs` 读取文章、论文索引，筛选并校验已发布条目。
2. Vite 编译客户端代码、样式和本地字体，生成静态资源。
3. `src/data/routes.js` 汇总首页、项目页、内容索引及已发布正文路由。
4. 预渲染脚本使用共享 React 组件输出各路由 HTML，并填写页面标题和描述。
5. 浏览器先显示 HTML，`src/main.jsx` 再进行 hydration，接入筛选、偏好与交互。

目前没有文章和论文条目时，构建生成首页、四个项目页、两个内容索引，共七个常规页面，另有 `404.html`。发布内容后页面数量随索引增加。开发新组件时，不应在服务端渲染阶段直接读取 `window`、剪贴板或本地存储；浏览器行为放入事件处理或 effect。

新增内部链接使用 `src/data/routes.js` 的 `href()`，使其带上构建前缀。直接写 `/projects/...` 会指向域名根目录，在 `/SelfPage/` 部署下可能访问错误位置。

## 5. 验证命令及范围

先构建并保持生产预览运行，在另一个终端执行：

```powershell
$env:TEST_URL = 'http://127.0.0.1:4173/SelfPage/'
npm run check:pages
```

所有浏览器命令都建议明确设置 `TEST_URL`，不要依赖不同脚本各自的默认地址。

| 命令 | 检查内容 | 是否需要预览服务 |
| --- | --- | --- |
| `npm run build` | 当前索引校验、客户端打包与页面预渲染 | 否 |
| `npm run check:content` | 测试样例的元数据规则、草稿排除、Markdown 与论文渲染 | 否 |
| `npm run check:pages` | 项目和内容索引直接打开、刷新、无 JS、手机溢出 | 是 |
| `npm run check:static` | 禁用、阻断、延迟脚本时的内容与 hydration | 是 |
| `npm run check:ui` | 基础控件、筛选、弹窗、偏好持久化、多种宽度 | 是 |
| `npm run check:motion` | 滚动动效、角色状态、弹窗、触屏和减少动态效果 | 是 |
| `npm run check:navigation` | 返回、历史遍历、翻页、导航选中态、顶部按钮互斥 | 是 |
| `npm run check:entry` | 新入口、同页收藏、刷新逐帧位置和弹窗反馈 | 是 |
| `npm run check:projects` | 项目区定位、筛选切换、操作行、复制链接与光晕清理 | 是 |
| `npm run check:recovery` | 人为挂起过渡或阻断脚本后的恢复 | 是，建议本地 |
| `npm run audit` | Lighthouse 性能、可访问性、最佳实践与 SEO 报告 | 是 |

按修改范围运行相关检查即可。新增或删除项目后，还应检查 `tests/` 中固定项目数量、名称及路由的断言是否需要更新。自动化检查不会判断文字是否准确、素材授权是否适合当前用途，也不能替代实际阅读。

Lighthouse 结果写入 `.local/reports/lighthouse.json`，部分浏览器测试也会在该目录写截图。报告反映当前机器、浏览器和网络条件，不作为所有设备的固定性能结论。审计使用调试端口 9223，同一时间只运行一个审计进程。

## 6. 手动检查建议

完成影响页面的修改后，查看至少一个宽屏和一个窄屏布局，检查标题换行、按钮间距及横向溢出。涉及动效时，分别向上、向下滚动，并切换减少动态效果设置。

内容变更重点查看正文段落、侧栏锚点、附件与来源链接。导航变更重点区分首次进入、刷新、前进后退及站内链接。复制链接在 HTTPS 或 localhost 环境中测试，并确认浏览器拒绝剪贴板访问时仍有文字提示。

## 7. 清理与常见本地问题

```powershell
# 先停止预览和测试，再查看清理目标。
powershell -NoProfile -File scripts/clean.ps1 -WhatIf
npm run clean
```

清理仅删除 `dist/` 与 `.local/`；脚本拒绝跟随其中的链接目录或文件。`node_modules/`、源码、附件、锁文件及 Git 历史保留。需要预览时重新构建即可。

| 现象 | 处理方式 |
| --- | --- |
| 预览仍显示旧内容 | 重新构建，确认浏览器打开的是对应端口和路径 |
| `ERR_CONNECTION_REFUSED` | 启动预览，核对 `TEST_URL` 与终端打印地址 |
| 提示找不到 Edge | 安装本机 Microsoft Edge；不要假设所有脚本都支持浏览器通道覆盖 |
| 页面能打开但资源 404 | 核对构建时的 `SITE_BASE_PATH` 与访问网址 |
| 清理后预览失败 | 重新执行构建，`preview` 本身不会生成 `dist/` |
| 内容检查失败 | 从第一条错误定位元数据或文件，参照内容指南修正 |

修改完成后用 `git diff --check` 检查格式，用 `git diff` 确认变更范围，再提交所需文件。发布与恢复步骤见部署文档。
