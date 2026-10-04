# GitHub Pages 部署

## 发布配置

- 仓库：`Crystalclear9/SelfPage`
- 分支：`main`
- 网站：[crystalclear9.github.io/SelfPage](https://crystalclear9.github.io/SelfPage/)
- Pages Source：**GitHub Actions**（`build_type: workflow`）
- 工作流：`.github/workflows/deploy.yml`

工作流使用 Node.js 24 执行 `npm ci`、内容检查和生产构建，将 `dist/` 上传至 Pages。日常发布只需提交源码并推送到 `main`，不提交构建产物，也不需要在前端配置中填写令牌。

构建和部署运行于 `ubuntu-24.04`。工作流同时支持手动触发，同一 Pages 部署组有新任务时会取消仍在进行的旧任务。浏览器回归检查不在当前 CI 中；需要在推送前按修改范围执行。

## 发布一次普通修改

在仓库目录中完成编辑与本地检查，确认本次文件范围：

```powershell
git status --short
git diff --check
git diff
```

按本次改动选择文件进行暂存，不需要把本地报告或构建目录加入 Git。例如仅修改介绍正文：

```powershell
git add src/data/project-notes.js
git diff --cached
git commit -m "Update project descriptions"
git push origin main
```

如果当前不在 `main`，先确认分支和计划采用的合并方式，不能把示例推送命令理解为自动切换分支。正常发布无需强制推送。

在仓库 Actions 中找到与本次提交 SHA 对应的运行：build 成功表示源码和静态页面已构建；deploy 成功才表示该产物已发布至 Pages。旧任务显示 cancelled 时，检查是否有更新的提交正在部署。即使只更新说明文档，当前工作流也会执行，因为没有按文件路径排除文档变更。

## 路径与静态页面

`SITE_BASE_PATH` 控制资源和导航前缀。当前值为 `/SelfPage/`，由 Pages 元数据提供；自定义域名根路径部署使用 `/`。修改前缀后需重新构建。

每个项目、内容索引和已发布文章输出对应目录的 `index.html`，另外生成 `404.html`。不使用 SPA 路由重写。静态 HTML 与客户端共享组件和数据，脚本不可用时仍可阅读正文并使用普通链接。

## 发布后检查

确认最新提交对应的 build、deploy 成功，再检查首页、项目页和内容索引的直接访问与刷新。旧失败记录不会因新发布成功而消失。

```powershell
$env:TEST_URL = 'https://crystalclear9.github.io/SelfPage/'
npm run check:pages
npm run check:static
npm run check:navigation
npm run check:entry
```

`check:recovery` 会注入故障以验证恢复逻辑，建议对本地生产预览运行。完整检查命令见 [README](../README.md)。

## 故障排查

| 现象 | 检查项 |
| --- | --- |
| configure-pages 返回 Not Found | 仓库已启用 Pages，Source 为 GitHub Actions |
| 页面或静态资源 404 | 完整网址包含 `/SelfPage/`，构建前缀与部署位置一致 |
| 正文可见但交互不可用 | Network 中应用脚本的状态、缓存与拦截情况 |
| 翻页卡住或需要刷新 | 记录目标网址、浏览器和失败请求；检查是否加载最新 HTML，以及过渡保护脚本是否存在 |
| 收藏仍定位到项目区 | 确认收藏是首页 `/SelfPage/#projects` 而非项目详情页，并让已有标签页载入最新脚本；分别检查新标签页与同页再次打开收藏 |
| 刷新从首屏滑向原位置 | 检查新版 `data-home-entry` 内联脚本是否存在；刷新应即时恢复，正常分区点击仍平滑滚动 |
| 新文章或论文没有出现 | 检查 `published`、正文路径和最新构建结果；草稿不生成页面 |
| 本地文件双击不能使用 | 通过 `npm run dev` 或 `npm run preview` 提供 HTTP 服务 |

过渡保护脚本可结束失败或超时的动画，但不证明所有空白页问题均由动画引起。部署成功和具体访问环境下正常渲染需分别验证。

## 定位失败的工作流

先确认失败运行使用的是哪一个提交，避免反复排查已经被后续修复替代的历史错误。随后打开第一个失败步骤的日志，按阶段处理：

1. **Pages 配置阶段**：核对仓库 Settings → Pages 的发布来源以及仓库是否可使用 Pages。配置问题不能通过修改前端路径修复。
2. **依赖安装阶段**：查看 Node 版本、锁文件和 npm 的首条错误。本地可先使用 `npm ci` 检查锁文件安装，不应直接删除锁文件绕过失败。
3. **内容检查或构建阶段**：复制同一提交到本地，设置 `/SelfPage/` 前缀后构建；按文件名、字段或缺失路径修正。
4. **产物上传阶段**：确认构建已生成 `dist/`，上传步骤读取的也是该目录。
5. **部署阶段**：检查 Pages、环境审批或工作流权限相关的明确报错。若任务还在等待环境条件，则不等于已经部署成功。

页面显示旧版本时，先核对最新提交是否部署成功，再重新加载标签页。新构建的资源文件带内容哈希，旧标签页仍可能运行旧脚本；强制刷新仅用于诊断缓存，不应作为正常使用前提。

## 回退有问题的修改

已发布的修改可通过 `git revert` 生成一条反向提交，保留历史，随后由 Actions 发布回退后的源码。先检查工作区和历史，下面的 SHA 需替换为实际要撤销的普通提交：

```powershell
git status --short
git log --oneline -8
git revert COMMIT_SHA_TO_REVERT
```

发生冲突时按文件内容处理；决定放弃本次回退可执行 `git revert --abort`。合并提交需要单独确认父分支语义，不直接套用普通提交示例。回退完成后重新构建并检查受影响页面，再执行 `git push origin main`。

回退仅影响选定提交。如果后续提交依赖被撤销的结构，可能需要额外修正；不要假设撤销任意一个提交就一定能恢复到某个完整旧版本。部署结束后应核对线上页面及新运行的提交 SHA。

## 更换仓库路径或域名时

当前源码以 `/SelfPage/` 为线上前缀。本地通过 `SITE_BASE_PATH` 模拟部署位置，CI 从 configure-pages 输出计算前缀；改名或迁移时需同时核对 Pages 配置、README 中的网站地址、正文手写的站内链接，以及已有分享链接。

更改构建前缀本身不会配置自定义域名、DNS 或旧地址重定向。迁移前先在对应前缀下做生产预览，至少验证首页资源、一个项目详情、内容索引和附件。素材许可与公开内容范围仍按各自文档维护。

参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
