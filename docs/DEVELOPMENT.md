# 本地开发

使用与 CI 相同的 Node.js 24，在仓库根目录运行 `npm ci`。日常编辑使用开发服务，验收路由、样式与素材路径时使用生产预览。

## 两种运行方式

| 场景 | 命令 | 地址 |
| --- | --- | --- |
| 编辑组件或正文 | `npm run dev` | 默认 `http://127.0.0.1:5173/` |
| 阅读构建产物 | `npm run preview -- --port 4174 --strictPort` | 按下面的配置使用 `/SelfPage/` |

在 PowerShell 中构建发布版本并启动预览：

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
node tests/voice.mjs
npm run check:content
npm run build
npm run check:learning
npm run preview -- --port 4174 --strictPort
```

保持预览运行，在第二个终端设置 `$env:TEST_URL = 'http://127.0.0.1:4174/SelfPage/'`，执行 `npm run check:browser-ci`。这组测试依次覆盖光标、导航、移动端阅读和过渡恢复，本地默认使用 Edge。修改源码后重新构建即可更新预览；切回根路径开发时，在开发终端执行 `Remove-Item Env:SITE_BASE_PATH -ErrorAction SilentlyContinue`。

## 按改动选择测试

| 改动 | 检查 | 观察点 |
| --- | --- | --- |
| 新增文章或论文 | `check:content`、`check:pages` | 草稿过滤、元数据、正文与详情页直达 |
| 导入教材 | `check:learning`、`node tests/learning-references.mjs` | 在构建后逐页核对锚点、站内目标、图片与公式 |
| 修改教材渲染 | `check:learning-ui`、`node tests/learning-render.mjs`、`node tests/code-blocks.mjs` | 实际解码图片；切换明暗、宽窄视口和脚本状态，检查代码缩进、字体与语法颜色 |
| 项目筛选与首页编排 | `check:projects`、`check:chapters` | 分类切换后的滚动位置、卡片往返入场与标题停靠 |
| 修改路由或入口资源 | `check:entry`、`check:navigation`、`check:assets`、`check:static` | 收藏与刷新、前进后退、旧页面加载资源、纯 HTML 阅读 |
| 光标、语音或动作 | `check:cursor`、`check:motion`、`node tests/voice.mjs` | 衣装切换、命中位置、减少动态效果、取消和重试 |
| 全站控件与性能 | `check:ui`、`npm run audit` | 窄屏菜单、主题、弹窗和 Lighthouse 报告 |

表中的 `check:*` 使用 `npm run` 执行。浏览器用例针对运行中的预览；`check:learning` 和引用扫描直接读取 `dist/`。

## 定位渲染问题

- **深层链接只有文字。** 在 Network 中查看该页的 HTML、`assets/site.css` 及响应类型。将线上请求与同前缀的生产预览对照，可区分路径错误与旧入口失效。
- **切章后正文滞后。** 查看目标 HTML 中的 `#learning-content`，再检查客户端提交后的章节标题。两处标题不同，说明问题出在客户端换页阶段。
- **公式、代码或图片异常。** 从具体章节复现，比较预渲染 HTML 与启用脚本后的页面。检查 KaTeX 字体请求、代码 token 的计算颜色，以及图片解码结果。
- **F5 后仍是系统箭头。** 在桌面 Edge 将鼠标停在正文，按 F5，观察首次移动前显示的指针。衣装与图层的工作方式见[角色光标](MOTION.md#角色光标)。

## 工作区清理

构建结果位于 `dist/`，截图及性能报告位于 `.local/reports/`。停止预览后，Windows 下运行 `npm run clean`，将 `dist/`、`.local/` 和 Vite 缓存移入回收站。查看待处理路径可使用 `powershell -NoProfile -File scripts/clean.ps1 -WhatIf`。教材快照、公开附件与依赖锁文件属于项目输入。
