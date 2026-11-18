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

### 给 GameQA 增加一篇相关记录

沿用上面的 `retrieval-notes` 示例，在条目中加入 `"project": "gameqa"`。填入的是 `projects` 中稳定的 ID；`title` 用于页面显示，`repository` 则是 GitHub 仓库名。这里 GameQA 的三个值分别是 `gameqa`、`GameQA` 和 `RagGameQa`。

在 `content/articles/retrieval-notes.md` 写入正文。详情页已经用索引的 `title` 生成一级标题，正文从二级标题开始。例如：

```markdown
## 检索流程

查询先进入候选检索，再由排序阶段选择交给回答模块的片段。

## 如何核对结果

选定同一个问题，分别记录召回的文档、排序后的片段和回答采用的来源。
```

保存两份文件后打开开发服务。文章列表按 `date` 倒序排列；点入该条目可读到完整正文。再打开 GameQA 的详情页，页内目录和正文末尾都会出现「相关记录」。这是同一条索引记录的两个入口，日后修改标题或摘要只需编辑一次。在生产构建中，对应文件为 `dist/articles/retrieval-notes/index.html`。

### 发布索引字段

| 字段 | 读取规则与效果 |
| --- | --- |
| `published` | 布尔值 `true` 参与构建。草稿仍保存在源码目录。 |
| `type`、`slug` | 两者组成公开地址。同一类型内 slug 唯一，使用小写字母、数字与单个连字符分段。 |
| `title`、`summary`、`date` | 标题用于列表与详情，摘要同时生成路由描述，日期按有效日历日期排序。 |
| `body` | 相对 `content/` 的 Markdown 文件。已发布条目至少提供正文、PDF 或外部页面之一。 |
| `project` | 对应项目 ID，使条目出现在该项目的相关记录中。 |
| `authors`、`venue` | 作者字符串数组按给定顺序展示；`venue` 展示会议或期刊名称。 |
| `externalUrl`、`pdf` | 分别生成发表页面和阅读 PDF 的入口。正文图片另由 Markdown 引用。 |


## 维护论文

论文条目使用 `type: "papers"`，正文放在 `content/papers/`。`authors` 按署名顺序填写，`venue` 填发表会议或期刊，`externalUrl` 对应发表页面。`pdf` 可以是 HTTPS 链接，也可以指向 `public/files/` 下的文件，索引写作 `files/文件名.pdf`，本地附件采用英文文件名。

[K-GAT 正文](../content/papers/k-gat.md)与[配图](../public/files/k-gat)可以作为编排示例。首页索引保留正式题目与摘要，详情页按问题、方法和实验展开。K-GAT 的会议标记为 EMNLP 2026，发表入口指向 OpenReview，PDF 指向 arXiv，索引日期沿用预印本日期。

### 论文插图与页内目录

[PaperBody.jsx](../src/pages/PaperBody.jsx) 将每个二级标题及其后的内容组成一个研究小节。目录取自这些标题，按顺序生成 `#paper-section-1` 等定位地址。正文里可以继续用三级标题组织实验条件和结果。调整二级标题的顺序也会改变这些位置编号。

独占一个段落的 Markdown 图片会成为带图注的 figure，图片替代文字同时作为图注。要并排比较两张图，在同一小节内连续写两个图片段落；在两段之间插入一段解释，页面就会将它们分别排版。例如，下面的两个路径对应本站已有的 K-GAT 图片：

```markdown
## 协作结构的两类偏差

![规划过度时的协作结构](/files/k-gat/over-planning.png)

![规划不足时的协作结构](/files/k-gat/under-planning.png)
```

写入正文的地址从 `/files/` 开始，对应仓库里的 `public/files/`。渲染器在生产环境补上 `/SelfPage/`。直接访问论文详情，点击页内目录，观察当前小节、两张图的顺序、图注，以及窄屏下的阅读顺序。

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
