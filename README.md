# Crystalclear9 · 个人网站

[网站](https://crystalclear9.github.io/SelfPage/) · [内容维护](docs/CONTENT.md) · [部署](docs/DEPLOYMENT.md) · [动效](docs/MOTION.md) · [素材来源](docs/ASSETS.md)

Crystalclear9 的个人技术站，集中展示项目、开发记录与论文材料。使用 React 和 Vite 构建，在构建阶段生成各页面 HTML，部署至 GitHub Pages。加藤惠插画、头像和角色光标作为个人视觉元素。

## 页面

| 路径（相对站点根目录） | 内容 |
| --- | --- |
| `/` | 个人介绍、项目概览、文章与论文入口 |
| `/projects/suishouban/` | 随手办 |
| `/projects/gameqa/` | GameQA |
| `/projects/autellix/` | Autellix 论文的个人复现尝试 |
| `/projects/time-predict/` | TimePredictModel |
| `/articles/` | 技术文章索引 |
| `/papers/` | 论文索引 |
| `/articles/<slug>/`、`/papers/<slug>/` | 已发布内容的独立页面 |

每个页面均输出独立 HTML，可直接访问、刷新和在禁用 JavaScript 时阅读。项目介绍基于公开仓库整理，不代表已经完成独立运行验证。本站提供源码入口，不提供项目在线演示。

Autellix 的原方法与研究贡献归[原论文作者](https://arxiv.org/abs/2502.13965)。此处仓库属于个人复现尝试，不声称完整复现或达到原论文的性能结果。

## 导航与交互

- 项目、文章和论文页面的顶部、页脚均提供“返回个人主页”；正文页另提供返回所属列表的链接。
- 站内页面使用浏览器原生跨文档过渡，切换时滑入并缩放，导航栏保持稳定。链接、刷新和前进后退保持浏览器默认行为；不支持过渡的浏览器直接导航。
- 项目卡片随滚动从上下两端翻转回正，中央阅读区保持稳定。卡片间距为 16px，窄屏为 12px。
- 头像支持鼠标、触屏和键盘点击，播放一次轻微摆动并显示问候；角色光标沿用现有素材与动作。
- 减少动态效果模式关闭页面过渡、卡片翻转和头像摆动，保留导航及文字反馈。

## 本地开发

Node.js 22.12+；CI 使用 Node.js 24。

```bash
npm ci
npm run dev
```

本地开发默认地址为 `http://127.0.0.1:5173/`。模拟当前 GitHub Pages 子路径：

```powershell
$env:SITE_BASE_PATH = '/SelfPage/'
npm run build
npm run preview
```

预览默认地址为 `http://127.0.0.1:4173/SelfPage/`。构建与预览使用相同的 `SITE_BASE_PATH`；根路径部署使用 `/`。

## 目录

```text
content/
  index.json                  文章、论文元数据
  articles/                   文章 Markdown
  papers/                     论文说明 Markdown
public/
  images/                     插画与角色光标
  files/                      公开 PDF 和正文图片
src/
  App.jsx                     首页及公共页面框架
  main.jsx                    客户端入口、样式加载和 hydration
  data/                       个人资料、项目与路由数据
  pages/                      项目详情、内容索引和 Markdown 正文
  components/
    PageNavigation.jsx        统一返回主页与列表入口
    ProfileAvatar.jsx         头像问候反馈
    AnimatedCursor.jsx        角色光标状态
    PointerSurfaces.jsx       表面倾转、光斑和波纹
    Modal.jsx                 弹窗及焦点管理
    PetalTrail.jsx            Canvas 拖尾
  styles/
    base.css                  主题、首页布局与响应式
    content.css               详情页与正文排版
    motion.css                页面滚动与光标动作
    pointer.css               鼠标表面反馈
    navigation.css            返回按钮与页面过渡
    avatar.css                头像交互
scripts/                      内容校验、静态生成与性能检查
tests/                       内容、导航、页面与交互检查
docs/                        内容维护、部署、动效与素材说明
```

`node_modules/` 是本地依赖，`dist/` 是构建输出，`.local/reports/` 是检查生成的报告与截图，均不纳入版本控制。无需提交构建产物；GitHub Actions 从源码重新生成。

## 内容维护

项目和个人资料修改 `src/data/site.js`。项目 ID 同时用于详情页网址，发布后应保持稳定。邮箱为空时隐藏联系入口。

文章和论文采用 Markdown 正文与 JSON 元数据分离的方式。仅 `published: true` 的条目参与构建；未发布内容不生成页面，也不进入客户端内容模块。文章可独立发布，论文可提供摘要、PDF 或外部发表链接。当前索引为空，页面展示真实空状态。具体字段、操作步骤和示例见 [CONTENT.md](docs/CONTENT.md)。

## 检查

```powershell
npm run check:content
$env:TEST_URL = 'http://127.0.0.1:4173/SelfPage/'
npm run check:pages
npm run check:navigation
npm run check:static
npm run check:ui
npm run check:motion
npm run audit
```

浏览器检查使用本机 Microsoft Edge。`check:navigation` 验证所有子页面的返回入口、无脚本导航、历史记录、页面过渡及头像反馈。`check:pages` 覆盖新增路由的直接访问、刷新、无脚本渲染及移动端宽度；其余检查覆盖首页静态正文、主题、筛选、弹窗、光标和减少动态效果设置。

## 实现约束

- 静态 HTML 与客户端共享组件和内容数据，避免首屏依赖脚本才能显示。
- 滚动效果使用 CSS scroll/view timeline；不拦截滚轮，不修改浏览器滚动速度。
- 触屏和减少动态效果模式使用降级样式，正文保持可读。
- 内容在构建时读取，不依赖运行时 GitHub API；不包含登录、数据库或第三方统计。
- 前端配置和 `public/` 文件均会公开。公开仓库中的未发布 Markdown 也可以通过源码访问，不应提交私人草稿或凭据。
