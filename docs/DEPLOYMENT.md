# GitHub Pages 部署

## 发布目标

- 仓库：`Crystalclear9/SelfPage`
- 分支：`main`
- 发布模式：GitHub Actions（`build_type: workflow`）
- 网站：https://crystalclear9.github.io/SelfPage/

## 工作流

1. 读取仓库 Pages 配置。
2. 使用 Node.js 24 与 `npm ci` 安装锁定依赖。
3. 从 Pages 元数据读取部署子路径。
4. 执行 Vite 构建，并生成可独立阅读的静态 HTML。
5. 上传 `dist/`，随后部署到 `github-pages` 环境。

默认 `GITHUB_TOKEN` 用于发布现有站点，无需在项目配置中填入个人令牌。

## 首次配置

在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。然后推送到 `main`，或在 **Actions → Deploy GitHub Pages → Run workflow** 中选择 `main`。

检查最新提交对应的运行记录。旧失败记录不会因新版本修复而消失；重跑旧记录仍会使用旧提交中的工作流。

## 资源路径

构建使用 `SITE_BASE_PATH`，例如 `/SelfPage/`。图片、字体、JavaScript 与 CSS 均使用同一部署前缀。部署到自定义域名根路径时应为 `/`，修改后重新构建。

## 故障排查

| 现象 | 检查方式 |
| --- | --- |
| Pages 配置返回 `Not Found` | 确认站点已启用，Source 为 GitHub Actions，而不是 Deploy from a branch |
| Actions 仍显示旧版本警告 | 确认运行记录的提交 SHA 与 `main` 一致 |
| 账号根地址返回 404 | 使用完整地址 `https://crystalclear9.github.io/SelfPage/` |
| 首次访问没有交互 | 静态正文应仍可见；检查浏览器 Network 中脚本是否加载成功 |
| 图片、CSS 或 JS 返回 404 | 检查构建的 `SITE_BASE_PATH` 与发布路径是否一致 |
| 刷新后恢复正常 | 检查首次请求的状态、缓存与网络拦截；不要仅凭一次 HTTP 200 判断页面正常 |
| 本地双击 HTML 不能使用 | 使用 `npm run dev` 或 `npm run preview` 启动 HTTP 服务 |

默认正文不会等待滚动动画或脚本初始化才显示。禁用 JavaScript 时，项目源码仍通过普通链接访问，筛选及弹窗按钮隐藏。

## 验收

通过 `TEST_URL` 指向线上地址运行 `check:ui` 和 `check:static`，同时确认最新 Actions 的 build、deploy 均成功。部署成功与特定网络环境下的可达性是不同的检查项。

参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 独立页面

构建为每个项目、内容索引和已发布文章输出对应目录的 `index.html`，同时输出 `404.html`。无需单页路由重写或 404 跳转脚本。验收时应直接打开子页面并刷新，避免只从首页点击验证。新增文章与论文的操作见 [内容维护](CONTENT.md)。

子页面顶部与页脚的返回链接均由部署前缀生成，不需要额外重定向。页面过渡为浏览器增强功能，不影响静态 HTML 或 Pages 路由。
