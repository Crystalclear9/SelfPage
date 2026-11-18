# 内容维护

## 首页与项目

在 [site.js](../src/data/site.js) 中编辑 `profile`。`subtitle` 出现在首屏，`intro` 和 `about` 组成「关于我」。`github` 指向公开主页，填写 `email` 后会显示邮件入口。首屏标题下的补充说明在 [App.jsx](../src/App.jsx)。

每个展示项目有两份内容。先在 `projects` 更新卡片标题、副标题、简介、分类和源码地址，再在 [project-notes.js](../src/data/project-notes.js) 用相同的 ID 编辑详情页。

| 内容 | 写法 |
| --- | --- |
| 首页卡片 | 用一句话说明项目解决什么问题，简介补充实现方式。`category` 生成筛选选项，`source` 用于「查看源码」。 |
| 项目背景 | `motivation` 交代使用场景或研究问题。Autellix 是一次论文复现，原方法通过项目的 `reference` 字段引用。 |
| 实现过程 | `implementation` 的每项含 `title` 和 `text`。按处理流程讲清输入、关键选择和输出。 |
| 当前进展 | `scopeTitle` 与 `scope` 记录已实现的部分、实验条件和仍待验证的问题。 |

当前展示随手办（`suishouban`）、GameQA（`gameqa`）、Autellix（`autellix`）、TimePredictModel（`time-predict`）和 SandBoxSim（`sandboxsim`）。ID 用于 `/projects/<id>/` 和文章关联，数组顺序决定首页排序和项目翻页顺序。

## 发布文章

在 `content/articles/` 写 Markdown，再把条目加入[内容索引](../content/index.json)。例如，文件 `content/articles/retrieval-notes.md` 对应以下记录。

```json
{
  "type": "articles",
  "slug": "retrieval-notes",
  "title": "检索流程实现记录",
  "date": "2026-11-18",
  "summary": "从文档分段到结果排序，记录一次检索流程的实现。",
  "body": "articles/retrieval-notes.md",
  "published": true
}
```

`body` 相对 `content/`，`slug` 决定公开地址。写作期间可设 `published: false`，准备预览详情页时改为 `true`。使用小写英文、数字和连字符命名 slug，日期采用 `YYYY-MM-DD`。保存后运行 `npm run check:content` 核对索引。

## 维护论文

论文条目使用 `type: "papers"`，正文放在 `content/papers/`。`authors` 按署名顺序填写，`venue` 填发表会议或期刊，`externalUrl` 对应发表页面。`pdf` 可以是 HTTPS 链接，也可以指向 `public/files/` 下的文件，索引写作 `files/文件名.pdf`，本地附件采用英文文件名。

[K-GAT 正文](../content/papers/k-gat.md)与[配图](../public/files/k-gat)可以作为编排示例。首页索引保留正式题目与摘要，详情页按问题、方法和实验展开。K-GAT 的会议标记为 EMNLP 2026，发表入口指向 OpenReview，PDF 指向 arXiv，索引日期沿用预印本日期。

## 同步 AILearning

文章列表通过 `ailearning` 条目进入专题。分类、主题、章节与阅读指南由[专题清单](../content/collections/ailearning/manifest.json)生成。更新专题摘要或日期时编辑内容索引，修改教材正文时编辑源资料。

1. 在源目录查看 `git status --short`。导入读取磁盘上的内容，包含未提交的编辑，清单中的 `revision` 记录源仓库 HEAD。
2. 从本站根目录执行下面的命令。第一个参数是源工作区路径。
3. 对照 Git 差异检查 `content/collections/ailearning/` 和 `public/files/ailearning/`。章节改名或撤下时，核对清单与正文引用后清理旧副本。正文、清单和配图一并提交。

```powershell
npm run import:learning -- ../AI_Learning
$env:SITE_BASE_PATH = '/SelfPage/'
npm run check:content
npm run build
npm run check:learning
node tests/learning-references.mjs
```

目录中的 README 提供分类与主题说明。`01-标题.md` 生成 `chapter-01`；修改标题时可以保留编号和网址。添加顶级分类或阅读指南时，同步更新[导入映射](../scripts/import-learning.mjs)。

### 查看实际渲染

打开生产预览，在另一个终端设置对应的 `TEST_URL`，运行 `npm run check:learning-ui` 和 `node tests/learning-render.mjs`。前者覆盖目录与阅读导航，后者核对实际页面中的图片解码和不同阅读环境。预览命令见[开发与测试](DEVELOPMENT.md)。

- **公式与代码**。正文公式由 KaTeX 排版，围栏代码块按语言标记着色。显示 Markdown 语法示例时放入反引号或围栏，保留原样。
- **图片与定位**。源文件使用相对路径，导入后由本站提供图片。带片段的 SVG 引用保留 `#view-id`。图像路径、许可与署名见[教材配图](LEARNING-IMAGE-SOURCES.md)。
- **资料引用**。内部 Markdown 链接映射到发布路由，章内目录使用标题或显式锚点。检查外部资料时运行 `node tests/learning-references.mjs --external`。[历史检查记录](LEARNING-LINK-AUDIT.json)保存了 2026-11-08 对 248 个外部地址的检查结果。
