# GitHub Pages 部署

## 发布配置

- 仓库：`Crystalclear9/SelfPage`
- 分支：`main`
- 网站：[crystalclear9.github.io/SelfPage](https://crystalclear9.github.io/SelfPage/)
- Pages Source：**GitHub Actions**（`build_type: workflow`）
- 工作流：`.github/workflows/deploy.yml`

工作流使用 Node.js 24 执行 `npm ci`、内容检查和生产构建，将 `dist/` 上传至 Pages。日常发布只需提交源码并推送到 `main`，不提交构建产物，也不需要在前端配置中填写令牌。

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
```

`check:recovery` 会注入故障以验证恢复逻辑，建议对本地生产预览运行。完整检查命令见 [README](../README.md)。

## 故障排查

| 现象 | 检查项 |
| --- | --- |
| configure-pages 返回 Not Found | 仓库已启用 Pages，Source 为 GitHub Actions |
| 页面或静态资源 404 | 完整网址包含 `/SelfPage/`，构建前缀与部署位置一致 |
| 正文可见但交互不可用 | Network 中应用脚本的状态、缓存与拦截情况 |
| 翻页卡住或需要刷新 | 记录目标网址、浏览器和失败请求；检查是否加载最新 HTML，以及过渡保护脚本是否存在 |
| 本地文件双击不能使用 | 通过 `npm run dev` 或 `npm run preview` 提供 HTTP 服务 |

过渡保护脚本可结束失败或超时的动画，但不证明所有空白页问题均由动画引起。部署成功和具体访问环境下正常渲染需分别验证。

参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
