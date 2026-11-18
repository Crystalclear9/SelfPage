# 站点架构

SelfPage 的发布单元是一个目录中的 `index.html`。构建端和浏览器共用路由表及 React 组件：构建端写出带正文的页面，浏览器端在已有 DOM 上挂载交互。

## 构建输入

| 输入 | 加载方式 | 结果 |
| --- | --- | --- |
| 首页资料与项目 | [site.js](../src/data/site.js) 和 [project-notes.js](../src/data/project-notes.js) 按 ID 提供摘要与正文 | 首页卡片及 `/projects/<id>/` |
| 独立文章与论文 | [content.mjs](../scripts/content.mjs) 读取发布索引，过滤草稿、校验字段并按日期倒序排列 | Vite 虚拟模块 `virtual:writing` 提供条目、正文和详情地址 |
| AILearning | [learning.mjs](../scripts/learning.mjs) 读取专题清单、Markdown 和图片路径 | 专题目录、分级路由与渲染后的章节正文 |

[路由表](../src/data/routes.js) 汇总这些输入。`href()` 为站内路径加上 Vite 的部署前缀，`currentPath()` 从浏览器地址解析应用路径。教材专题条目的发布状态同时控制下级路由。

## 静态页面生成

`npm run build` 先运行 Vite，再运行 [prerender.mjs](../scripts/prerender.mjs)。脚本以打包生成的首页 HTML 为模板，逐条渲染路由，在 `#root` 写入组件标记并替换页面描述。普通页面落在 `dist/<路由>/index.html`，缺省错误页为 `dist/404.html`。

入口脚本和样式使用稳定文件名 `assets/site.js`、`assets/site.css`。模板中的资源地址带有对应文件的内容摘要，文件变化时查询参数随之更新。[旧入口映射](../scripts/legacy-entrypoints.json) 记录此前发布过的文件名，构建阶段为旧页面保留相应资源路径。

## 教材正文的加载

以微积分第一章为例，导入器从 `Mathematics/Calculus/01-导数偏导数与链式法则.md` 提取标题、章节编号与父目录，生成 `/articles/ailearning/mathematics/calculus/chapter-01/`。预渲染器将公式、图片及代码块写入该页的 `#learning-content`。

| 访问方式 | 正文来源 |
| --- | --- |
| 直接访问生产地址 | 客户端从当前文档的 `#learning-content` 读取已有正文 |
| 生产环境站内换章 | `readPage` 请求目标 HTML，提取目标文档中的同名节点 |
| 本地开发 | Vite 插件在 `__learning?route=…` 返回指定章节的 HTML 片段 |

普通文章与论文由 `WritingDetail` 按需加载。论文正文另经 `PaperBody` 处理二级标题、页内目录和对照图组。[阅读页组件](../src/pages)

## 导航与组件生命周期

[main.jsx](../src/main.jsx) 对预渲染页面调用 `hydrateRoot`；开发服务的空挂载点使用 `createRoot`。支持 Navigation API 的浏览器会拦截已登记的站内跨页导航。`readPage` 准备目标数据后，`flushSync` 提交新视图，更新页面描述、恢复滚动并发送 `site-page-rendered` 事件。刷新、下载、新标签页与外部链接沿用浏览器导航。

`Site` 跨页保留角色光标，内部 `App` 按路径重新挂载。项目筛选和弹窗随页面卸载，主题、喜欢状态及本次衣装有各自的存储周期。头像、点赞、复制和筛选完成时，业务组件通过 `cursor-feedback` 发送动作类型；角色组件据此切换姿态。[光标与页面状态](MOTION.md)

## 扩展页面类型

1. 在 `src/data/routes.js` 登记公开路径、标题和描述。已有项目、文章和论文由数据自动生成路由。
2. 在 `src/pages/` 实现视图，并接入首页或内容页的分发逻辑。需要完整正文的页面在构建阶段向预渲染器提供相应数据。
3. 若站内跳转需读取独立数据，在 `readPage` 添加对应加载逻辑。核对同一地址的静态 HTML 与客户端切换后的主标题、正文和返回链接。[生产预览与回归](DEVELOPMENT.md)
