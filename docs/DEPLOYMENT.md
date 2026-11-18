# 发布到 GitHub Pages

本站通过 [deploy.yml](../.github/workflows/deploy.yml) 发布。仓库 Settings → Pages → Build and deployment 中的 Source 选择 **GitHub Actions**。工作流读取 Pages 提供的路径，将同一次构建得到的 `dist/` 上传并部署。

## 哪些修改会发布

| 入口 | 运行内容 | 结果 |
| --- | --- | --- |
| 发往 `main` 的拉取请求 | 内容、语音、生产构建、学习资料和浏览器回归 | 在仓库名对应的子路径验证页面 |
| 推送到 `main` | 内容、语音、生产构建和学习资料检查 | 发布通过检查的产物 |
| Actions → Run workflow | 手动选择分支，`browser_checks` 默认开启 | `main` 发布，其他分支用于验证 |

自动任务忽略仅涉及 `README.md` 和 `docs/` 的改动。文章、论文与教材正文位于 `content/`，修改后会触发构建。同一分支连续推送时，工作流取消较早的运行。

## 从本地复核构建

在仓库根目录运行以下命令，以线上子路径预览。这能直接发现详情页中的脚本、图片或字体误用了域名根路径。

```powershell
npm ci
$env:SITE_BASE_PATH = '/SelfPage/'
node tests/voice.mjs
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

预览运行后，在另一个终端设置 `$env:TEST_URL = 'http://127.0.0.1:4174/SelfPage/'`，运行 `npm run check:browser-ci`。CI 使用 Ubuntu 24.04 与 Node.js 24，优先使用运行器自带的 Chrome；缺少时安装 Chromium。详细覆盖范围见[开发与测试](DEVELOPMENT.md)。

## 确认线上版本

在 Actions 中按提交 SHA 打开对应运行。`build` 生成静态页面并上传 `github-pages` 产物，`deploy` 使用 Pages 写入权限和 OIDC 发布。打开部署环境提供的地址，直接访问一个子页面，再检查首页导航与该页的资源加载。

| 现象 | 检查位置 |
| --- | --- |
| 配置 Pages 时返回 404 | 核对仓库的 Pages Source 和工作流所在分支，查看此次运行的提交 SHA。 |
| 浏览器回归无法连接预览 | 打开生产预览步骤，查看服务启动日志、端口和 `TEST_URL` 的末尾路径。 |
| 直接访问子页只有文字 | 在 Network 面板检查 CSS、JS 请求地址，对照构建使用的 `SITE_BASE_PATH` 与发布产物中的入口文件。 |
| 部署显示 `syncing_files` | 这是 Pages 同步文件的阶段。查看该次部署的最终状态与页面地址。 |

需要撤回某次站点修改时，在 `main` 上对相应提交执行 `git revert <提交号>`，检查差异并推送。回退后的源码沿用同一发布流程。

## 发布路径如何传递

1. 发布 `main` 时，`actions/configure-pages` 读取仓库 Pages 配置。工作流把得到的 `base_path` 规范为带末尾斜杠的 `SITE_BASE_PATH`。拉取请求使用仓库名模拟同样的子路径。
2. [vite.config.js](../vite.config.js) 将该值设为 Vite 的 `base`。[路由辅助函数](../src/data/routes.js)的 `href()` 把应用内路径转换为公开地址。例如 `/projects/gameqa/` 会生成 `/SelfPage/projects/gameqa/`。
3. [prerender.mjs](../scripts/prerender.mjs) 在 `dist/projects/gameqa/index.html` 写入正文。`dist/` 本身就是发布根目录，内部第一层是 `projects/`、`articles/`、`assets/` 等目录。
4. 构建任务上传整个 `dist/`。部署任务使用同一运行里的 `github-pages` 产物，最终链接在 Actions 的 `github-pages` 环境中。

如果更换仓库名或迁移到自定义域名，先用目标前缀重新构建。在生产预览分别打开首页和一个深层链接，核对 HTML 中脚本、CSS、正文图片与返回链接的前缀。若线上只有旧标签页异常，检查 Network 中请求的脚本名；[旧入口映射](../scripts/legacy-entrypoints.json)用于让先前发布的 HTML 找到构建资源。

## 手动运行浏览器回归

在仓库 Actions 中选择 **Verify and deploy GitHub Pages → Run workflow**，选择要验证的分支，勾选 `browser_checks`。非 `main` 分支完成到构建与验证；选择 `main` 会继续发布。若本次仅更新维护手册，在 GitHub 查看对应提交的 Markdown 即可核对交付。
