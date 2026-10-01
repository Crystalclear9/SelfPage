# 春日来信

Crystalclear9 的个人主页。以加藤惠为主题，展示公开源码项目与作品官方插画。

## 本地运行

需要 Node.js 22.12+ 或 24+。

```bash
npm ci
npm run dev
```

开发地址：http://127.0.0.1:5173 。

```bash
npm run build
npm run preview
```

构建文件位于 `dist/`。请通过 HTTP 服务访问，不要直接双击源 `index.html`。

## 已接入的内容

- 公开账号：https://github.com/Crystalclear9
- 站点仓库：https://github.com/Crystalclear9/SelfPage
- 项目：随手办、GameQA、Autellix、TimePredictModel。
- 所有项目仅链接公开源码，没有在线演示或已经上线的承诺。
- 简介依据各仓库公开 README 整理，不代表本主页独立验证了项目运行效果。

## 自己修改内容

编辑 `src/content.js`，不需要改组件：

| 字段 | 用途 | 是否需要填写 |
| --- | --- | --- |
| `profile.name` | 公开显示昵称 | 已填 Crystalclear9，可改 |
| `profile.subtitle` | 首页一句话介绍 | 可选 |
| `profile.intro` / `about` | 关于我的文字 | 可选，建议换成自己的表达 |
| `profile.github` | GitHub 主页 | 已填 |
| `profile.email` | 公开邮箱 | 完全可选，留空就不显示 |
| `projects` | 项目简介、分类、技术标签、详情、源码链接 | 已填四个公开项目，可增删 |
| `extraLinks` | 其他网站的标题、简介、网址 | 可选，默认不显示 |
| `gallery` | 图集与来源说明 | 可选 |

添加其他页面的示例：

```js
export const extraLinks = [
  {
    title: '我的笔记',
    description: '技术笔记与学习记录。',
    href: 'https://你的公开网站地址',
  },
];
```

这段仅用于说明，实际配置保持为空，不会出现未配置的假入口。项目分类根据 `projects` 自动生成。修改项目顺序即改变展示顺序。

所有 `src/content.js` 内容会公开打包到浏览器。不要填写密码、访问令牌、私人服务地址或不想公开的个人信息。本网站的 GitHub Pages 部署不需要自行填写 PAT/API key。

## GitHub Pages 发布

远程仓库：`Crystalclear9/SelfPage`，分支：`main`。

1. 打开 [Pages 设置](https://github.com/Crystalclear9/SelfPage/settings/pages)。
2. 在 **Build and deployment → Source** 选择 **GitHub Actions**。
3. 在 [Actions](https://github.com/Crystalclear9/SelfPage/actions) 中运行 **Deploy GitHub Pages**，或推送新提交触发。
4. 工作流成功后，站点地址为 **https://crystalclear9.github.io/SelfPage/**。

`.github/workflows/deploy.yml` 会安装锁定依赖、构建并部署。`base: './'` 兼容仓库子路径。后续只需修改内容并推送 `main`。

如果第一次工作流在 `configure-pages` 处失败，先完成第 2 步再重新运行即可。仓库设置及账号登录由你自行操作，勿把登录信息放进前端文件。

可选：在仓库 About 中把 Website 设置为上述 Pages 地址。域名、邮箱和其他页面均不必填写，网站也能正常使用。

参考：[GitHub 自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 交互

- 轻量樱花拖尾，最多 30 枚；可关闭，空闲暂停，触屏不绘制。
- 深浅主题默认遵循系统，手动设置在当前浏览器保存。
- 项目筛选、简介弹窗、直接跳转源码仓库。
- 图集放大、左右方向键切换、Esc 关闭、关闭后恢复焦点。
- 手机导航、减少动态效果适配。
- 喜欢状态仅保存在本机，不生成虚假的全站点赞数。
- 无分析脚本，无运行时 GitHub API 请求，无第三方图片/字体请求。

## 维护与检查

`npm run check:ui` 使用本机 Microsoft Edge 执行 Playwright 浏览器检查。默认访问开发服务器；设置 `TEST_URL` 可以改为构建预览。其他系统可修改浏览器 channel 或安装 Playwright Chromium。

`node scripts/audit.mjs` 对 4173 端口的构建预览运行移动端 Lighthouse。截图和报告位于不提交的 `artifacts/`。本次本地结果：性能 96，无障碍 100，最佳实践 100，SEO 100；线上网络和设备可能改变分数。

图片来源见 `ASSETS.md`。本站为非官方个人主题站，代码和角色插画的权利归属分开处理。
