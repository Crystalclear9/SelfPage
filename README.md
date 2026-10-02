# Crystalclear9 · 个人主页

[访问网站](https://crystalclear9.github.io/SelfPage/) · [GitHub 主页](https://github.com/Crystalclear9) · [部署说明](docs/DEPLOYMENT.md) · [素材来源](docs/ASSETS.md)

Crystalclear9 的个人网站，用于整理公开源码项目与实现思路。以加藤惠头像、鼠标指针和少量插画作为个人元素，采用 React 与 Vite 构建，发布至 GitHub Pages。

## 设计与功能

- 项目分类、简要介绍、详情弹窗及源码仓库入口。
- 透明底加藤惠全身角色光标，直接替换系统指针，弹窗内同样生效；触屏保持原生交互。
- 深浅主题、轻量樱花拖尾及本地偏好记忆。
- 桌面与移动端布局，键盘焦点管理及减少动态效果适配。
- 构建时预渲染完整正文；JavaScript 不可用时，介绍、图片与源码链接仍可访问。

本站展示源码与项目说明，不提供项目在线演示。运行时不请求 GitHub API，不包含账号登录、数据收集或第三方统计脚本。

## 开发环境

Node.js 22.12+，推荐使用与 CI 一致的 Node.js 24。

```bash
npm ci
npm run dev
```

开发服务器默认运行于 `http://127.0.0.1:5173/`。

```bash
npm run build
npm run preview
```

构建产物写入 `dist/`，预览默认地址为 `http://127.0.0.1:4173/`。页面应通过 HTTP 服务访问，不支持直接双击源码 HTML 文件。

## 项目结构

```text
.github/workflows/deploy.yml   GitHub Pages 构建与部署
public/                       原始图片、图标与 robots.txt
src/
  App.jsx                     页面结构与交互状态
  main.jsx                    客户端入口与静态正文 hydration
  components/
    Modal.jsx                 弹窗与焦点恢复
    PetalTrail.jsx            Canvas 鼠标拖尾
  data/site.js                个人资料、项目与链接配置
  styles.css                  主题、布局和响应式样式
scripts/
  prerender.mjs               构建后生成完整静态 HTML
  audit.mjs                   Lighthouse 审核
tests/                       浏览器交互与静态降级检查
docs/                        部署与素材文档
```

`node_modules/`、`dist/` 和 `.local/` 为依赖、构建及检查产物，不提交至仓库。测试截图与报告统一写入 `.local/reports/`。

## 内容维护

公开内容集中在 [`src/data/site.js`](src/data/site.js)。

| 配置项 | 说明 |
| --- | --- |
| `profile` | 公开昵称、个人介绍、GitHub 链接及可选邮箱 |
| `projects` | 项目分类、简介、技术标签、详情与源码地址 |
| `extraLinks` | 其他页面的标题、简介和公开网址；空数组时隐藏 |

项目分类自动根据数据生成；调整数组顺序即可改变展示顺序。邮箱留空时不显示联系入口。

新增其他页面的格式：

```js
export const extraLinks = [
  {
    title: '笔记',
    description: '学习过程中的记录与整理。',
    href: 'https://example.com/notes/',
  },
];
```

以上地址仅为示例，请替换为实际公开地址。前端配置会随构建产物公开，不应写入访问令牌、密码或私人服务地址。

## 渲染与资源路径

生产构建先由 Vite 生成资源，再复用 `App.jsx` 输出静态正文；浏览器加载 JavaScript 后为相同内容接入交互。静态与交互模式共享数据源，不维护两份页面文案。

`SITE_BASE_PATH` 控制部署子路径，默认 `/`。GitHub Actions 自动使用 Pages 返回的 `base_path`，本仓库为 `/SelfPage/`。自定义构建时，构建与预览需使用相同变量。

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run build
npm run preview
```

对应预览地址为 `http://127.0.0.1:4173/SelfPage/`。详细配置与故障排查见 [部署说明](docs/DEPLOYMENT.md)。

## 验证

先启动构建预览，再执行：

```powershell
$env:TEST_URL = 'http://127.0.0.1:4173/'
npm run check:ui
npm run check:static
npm run audit
```

| 命令 | 检查范围 |
| --- | --- |
| `check:ui` | 项目筛选、弹窗、焦点恢复、角色指针、主题持久化、鼠标拖尾与多尺寸布局 |
| `check:static` | 禁用或拦截 JavaScript 时的正文、图片和链接，以及脚本延迟时的首次加载 |
| `audit` | 目标地址的 Lighthouse 性能、无障碍、最佳实践与 SEO 审核 |

浏览器检查默认使用 Microsoft Edge；可用 `BROWSER_CHANNEL=chrome` 指定本机 Chrome。GitHub Pages 子路径或线上检查请将 `TEST_URL` 改为完整站点地址。静态降级检查应针对生产构建，开发服务器不执行预渲染。

## 部署

推送 `main` 后自动执行依赖安装、静态构建与 Pages 发布。CI 固定使用 Ubuntu 24.04 与 Node.js 24。

站点地址：**https://crystalclear9.github.io/SelfPage/**。不带 `/SelfPage/` 的账号根地址不是本仓库的发布入口。

## 素材与权利归属

主视觉与头像来自作品官方网站，透明角色光标由 imagegen 生成，来源及使用位置记录于 [素材文档](docs/ASSETS.md)。本站为个人项目主页，与作品官方无关联。第三方图片、字体和图标的权利归属各自权利方，不因本仓库公开而自动获得再分发授权。
