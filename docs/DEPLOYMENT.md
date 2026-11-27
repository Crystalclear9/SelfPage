# GitHub Pages 部署

发布源位于仓库 **Settings → Pages → Build and deployment → Source**，取值为 **GitHub Actions**。部署由 [deploy.yml](../.github/workflows/deploy.yml) 管理，生产分支为 `main`，产物目录为 `dist/`。

## 触发条件

| 事件 | 检查范围 | 发布行为 |
| --- | --- | --- |
| 推送到 `main` | 内容索引、生产构建、教材检查、容量统计和 GameQA 标题往返过渡 | 上传并发布 `dist/` |
| 手动运行 | 对所选版本执行同一构建与检查流程 | 通过 github-pages 环境发布 |

自动任务忽略只涉及 `README.md` 和 `docs/**` 的提交。文章与论文在 `content/` 中维护，属于站点发布内容。同一分支连续触发运行时，新运行取代尚未完成的旧运行。

## 发布一次普通修改

在仓库目录中完成编辑与本地检查，确认本次文件范围：

```powershell
git status --short
git diff --check
git diff
```

以项目详情正文为例，提交与发布命令如下。

```powershell
git add src/data/project-notes.js
git diff --cached
git commit -m "Update project descriptions"
git push origin main
```

## 构建任务

运行器为 Ubuntu 24.04，Node.js 版本为 24，依赖按 npm 锁文件安装。`build` 任务先执行 `npm run check:content`，再设置部署前缀，执行 `npm run build` 及 `npm run check:learning`。

工作流通过 `actions/configure-pages` 读取站点前缀，并将当前提交写入 `VITE_SITE_REVISION`。构建时统一补齐末尾斜杠，将结果写入 `SITE_BASE_PATH`。例如 `/projects/gameqa/` 对应公开地址 `/SelfPage/projects/gameqa/`，其产物仍位于 `dist/projects/gameqa/index.html`。

浏览器检查运行器优先使用预装 Chrome，缺少时安装 Chromium。任务在 4174 端口启动生产预览，等待带前缀的首页返回成功响应，再执行 `node tests/project-transition.mjs`，验证进入 GameQA 及返回首页时的原生标题过渡。测试通过 `TEST_URL` 读取完整预览地址，`BROWSER_CHANNEL` 选择运行器上的浏览器。[本地复现命令](DEVELOPMENT.md#生产预览)

`scripts/pages-size.mjs` 生成 `dist/assets/build-size.json`。Actions 摘要列出发布总量、相对上次的变化、新增的大图和重复图片。首次生成的清单用作后续发布的比较基线。

## 发布和版本回退

构建成功后，`build` 上传 `dist/` 为 `github-pages` 产物。`deploy` 使用同一次运行的产物，在同名环境中发布，所需权限为 `pages: write` 和 `id-token: write`。Actions 运行记录标明提交 SHA，部署环境给出站点地址。

手动发布入口为 **Actions → Deploy GitHub Pages → Run workflow**。选择 `main` 并运行即可重新构建当前版本。回退已发布的站点修改时，在 `main` 上执行 `git revert <提交号>`，核对差异并推送；新提交按相同流程部署。

## 日志定位

| 阶段 | 日志或现象 | 定位依据 |
| --- | --- | --- |
| 读取 Pages 配置 | `Get Pages site failed`、404 | 仓库 Pages 是否已启用，发布源是否设为 GitHub Actions |
| 启动生产预览 | 无法连接 4174 端口 | 查看预览步骤输出的启动日志，核对端口、`TEST_URL` 和路径前缀 |
| 发布文件 | `syncing_files` | Pages 正在同步已上传的产物，最终状态以该次部署记录为准 |
| 访问详情页 | 有 HTML，样式或脚本缺失 | 对比 HTML 中资源前缀与部署地址；旧标签页还可按请求文件名查询[入口映射](../scripts/legacy-entrypoints.json) |
