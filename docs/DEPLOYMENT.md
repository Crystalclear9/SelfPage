# 发布到 GitHub Pages

本站通过 [deploy.yml](../.github/workflows/deploy.yml) 发布。仓库 Settings → Pages → Build and deployment 中的 Source 选择 **GitHub Actions**。工作流读取 Pages 提供的路径，将同一次构建得到的 `dist/` 上传并部署。

## 工作流触发条件

| 入口 | 运行内容 | 结果 |
| --- | --- | --- |
| 发往 `main` 的拉取请求 | 内容、语音、生产构建、学习资料和浏览器回归 | 在仓库名对应的子路径验证页面 |
| 推送到 `main` | 内容、语音、生产构建和学习资料检查 | 发布通过检查的产物 |
| Actions → Run workflow | 手动选择分支，`browser_checks` 默认开启 | `main` 发布，其他分支用于验证 |

自动任务忽略仅涉及 `README.md` 和 `docs/` 的改动。文章、论文与教材正文位于 `content/`，修改后会触发构建。同一分支连续推送时，工作流取消较早的运行。

## 运行环境与任务权限

工作流使用 Ubuntu 24.04 和 Node.js 24，通过 `npm ci` 安装锁定的依赖。浏览器回归优先使用运行器上的 Chrome，缺少时由 Playwright 安装 Chromium。复现同一部署前缀及测试地址的命令见[生产预览](DEVELOPMENT.md#生产预览)。

| 任务 | 输入 | 输出与权限 |
| --- | --- | --- |
| `build` | 当前提交、锁文件和部署前缀 | 读取仓库内容及 Pages 配置。发布分支上传 `dist/` 为 `github-pages` 产物 |
| `deploy` | 同次运行的 `github-pages` 产物 | 在 `github-pages` 环境中发布；使用 `pages: write` 和 `id-token: write` |

## 部署状态与版本核对

Actions 运行记录关联触发构建的提交 SHA。部署成功后，`github-pages` 环境提供这一版的站点地址。回退使用 `git revert <提交号>` 生成新的提交；推送至 `main` 后，工作流重新构建并发布该版本。

| 现象 | 检查位置 |
| --- | --- |
| 配置 Pages 时返回 404 | 核对仓库的 Pages Source 和工作流所在分支，查看此次运行的提交 SHA。 |
| 浏览器回归无法连接预览 | 打开生产预览步骤，查看服务启动日志、端口和 `TEST_URL` 的末尾路径。 |
| 直接访问子页只有文字 | 在 Network 面板检查 CSS、JS 请求地址，对照构建使用的 `SITE_BASE_PATH` 与发布产物中的入口文件。 |
| 部署显示 `syncing_files` | 这是 Pages 同步文件的阶段。查看该次部署的最终状态与页面地址。 |

## 部署前缀与产物目录

1. 发布 `main` 时，`actions/configure-pages` 读取仓库 Pages 配置。工作流把得到的 `base_path` 规范为带末尾斜杠的 `SITE_BASE_PATH`。拉取请求使用仓库名模拟同样的子路径。
2. [vite.config.js](../vite.config.js) 将该值设为 Vite 的 `base`。[路由辅助函数](../src/data/routes.js)的 `href()` 把应用内路径转换为公开地址。例如 `/projects/gameqa/` 会生成 `/SelfPage/projects/gameqa/`。
3. [prerender.mjs](../scripts/prerender.mjs) 在 `dist/projects/gameqa/index.html` 写入正文。`dist/` 本身就是发布根目录，内部第一层是 `projects/`、`articles/`、`assets/` 等目录。
4. 构建任务上传整个 `dist/`。部署任务使用同一运行里的 `github-pages` 产物，最终链接在 Actions 的 `github-pages` 环境中。

如果更换仓库名或迁移到自定义域名，先用目标前缀重新构建。在生产预览分别打开首页和一个深层链接，核对 HTML 中脚本、CSS、正文图片与返回链接的前缀。若线上只有旧标签页异常，检查 Network 中请求的脚本名；[旧入口映射](../scripts/legacy-entrypoints.json)用于让先前发布的 HTML 找到构建资源。

## 手动运行浏览器回归

在仓库 Actions 中选择 **Verify and deploy GitHub Pages → Run workflow**，选择要验证的分支，勾选 `browser_checks`。非 `main` 分支完成到构建与验证；选择 `main` 会继续发布。
