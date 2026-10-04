# 内容维护

## 项目

修改 `src/data/site.js` 中的 `projects`。每个项目的 `id` 生成 `/projects/<id>/`，首页与介绍弹窗保持简短。`source` 指向源码；`reference` 可记录原论文标题与链接。

独立详情页正文放在 `src/data/project-notes.js`，使用同一个项目 `id` 关联：`motivation` 说明问题背景，`implementation` 展开实现过程，`scopeTitle` 和 `scope` 说明当前范围与验证边界。新增项目时需一并补充正文。内容依据公开仓库整理，不复制敏感配置，也不把 README 中的性能声明直接改写为已验证结论。

项目文案应区分方法来源、实现范围和验证结果。Autellix 标注为他人论文的个人复现尝试，原论文不作为本站作者的发表成果列入论文索引。

当前项目 ID 与详情路径：

| 项目 | ID | 相对站点路径 |
| --- | --- | --- |
| 随手办 | `suishouban` | `/projects/suishouban/` |
| GameQA | `gameqa` | `/projects/gameqa/` |
| Autellix | `autellix` | `/projects/autellix/` |
| TimePredictModel | `time-predict` | `/projects/time-predict/` |

已有 ID 应保持稳定，它同时用于页面网址、文章关联和项目间翻页。新增项目需同时更新 `projects` 与 `projectNotes`；项目数组顺序决定首页和前后翻页顺序。分类取自 `category`，筛选按钮自动生成。

维护正文时，优先更新具体处理流程、关键设计选择和验证边界。首页的 `description` 与弹窗的 `details` 保留摘要，较长的解释放入 `projectNotes.implementation`。论文方法、仓库自述的测试记录和本人独立验证的结果应分别表述；配置教程与易变的参数留在原项目仓库维护。

## 新增文章

### 文件与发布状态

1. 在 `content/articles/` 创建 Markdown 文件，例如 `retrieval-notes.md`。
2. 在 `content/index.json` 数组中加入以下对象，替换标题、日期和摘要。
3. 编辑期间保持 `published: false`；需要查看生成页面时，在本地临时设为 `true`，再启动开发服务或重新构建预览。
4. 核对正文、图片与链接。准备发布则保留 `true`，否则改回 `false` 后再提交。
5. 执行构建和检查，提交并推送至 `main`。

```json
{
  "type": "articles",
  "slug": "retrieval-notes",
  "title": "检索流程实现记录",
  "date": "2026-10-02",
  "summary": "本文的具体问题、实现范围与观察结果。",
  "body": "articles/retrieval-notes.md",
  "project": "gameqa",
  "published": false
}
```

`project` 可省略，填写项目 ID 后会自动显示在该项目的“相关记录”中。`slug` 仅使用小写英文、数字和连字符，决定永久网址；日期使用有效的 `YYYY-MM-DD`。索引按日期倒序排列。

Markdown 支持标题、列表、代码块、表格、引用和图片。正文标题建议从 `##` 开始，页面已渲染文章标题。代码块保留语言标记，当前不提供语法高亮。原始 HTML 不执行。

```markdown
## 问题
说明输入、约束与预期结果。

## 实现
记录方法和必要的代码片段。

## 验证与限制
区分已观察到的结果与尚未验证的假设。

![实验结果](/files/retrieval-result.png)
```

正文图片放在 `public/files/`；使用 `/files/文件名` 引用，构建自动加上站点部署前缀。站外链接使用完整 HTTPS 地址。

## 新增论文

论文说明放在 `content/papers/`。元数据示例（占位内容应替换为真实信息，保持未发布直到核对完毕）：

```json
{
  "type": "papers",
  "slug": "paper-slug",
  "title": "论文标题",
  "date": "2026-10-02",
  "summary": "研究问题与论文摘要。",
  "authors": ["实际作者姓名"],
  "venue": "实际发表渠道或预印本平台",
  "body": "papers/paper-slug.md",
  "pdf": "files/paper-slug.pdf",
  "externalUrl": "https://example.org/replace-with-publication-url",
  "published": false
}
```

`authors`、`venue`、`body`、`pdf`、`externalUrl` 均可按实际情况省略，但已发布条目至少需要正文、PDF 或外部链接之一。不提供的字段不会生成按钮。PDF 支持 `public/files/` 内的文件或 HTTPS 地址。没有材料时保持空索引即可，无需发布占位条目。

## 元数据字段速查

`content/index.json` 始终是 JSON 数组，多个对象之间使用逗号；JSON 不支持注释和尾随逗号。下面的“必填”指已发布条目。

| 字段 | 类型与要求 | 页面用途 |
| --- | --- | --- |
| `type` | 必填；`articles` 或 `papers` | 决定所属列表和 URL 前缀 |
| `slug` | 必填；小写字母、数字、单连字符分隔 | 决定正文的永久路径 |
| `title` | 必填；非空字符串 | 正文标题、索引标题、浏览器标题 |
| `date` | 必填；真实有效的 `YYYY-MM-DD` | 展示日期并按日期倒序排列 |
| `summary` | 必填；非空字符串 | 索引摘要、正文导语、页面描述 |
| `published` | 只有布尔值 `true` 表示发布 | 字符串 `"true"` 不会发布 |
| `body` | 可选；相对 `content/` 的 `.md` 文件路径 | 载入正文；文件必须存在 |
| `project` | 可选；现有项目 ID | 显示在项目页的相关记录中 |
| `authors` | 可选；字符串数组 | 论文作者列表，按原顺序展示 |
| `venue` | 可选；字符串 | 论文发表渠道或预印本平台 |
| `pdf` | 可选；`files/...pdf` 或 HTTPS 地址 | 生成“阅读 PDF”按钮 |
| `externalUrl` | 可选；完整 HTTPS 地址 | 生成发表页面链接 |

同一个 `type` 下的 `slug` 不可重复。`project` 的关联值应人工核对，当前加载器不会拒绝未知项目 ID；填写错误会使条目无法出现在预期的项目页中。远程 HTTPS 资源的可访问性也需要手动检查。

## 新增项目的完整示例

项目不是 Markdown 条目，需要在两个 JavaScript 数据文件中各增加一项。以下为结构示例，标题、说明和源码地址需替换后再使用。

在 `src/data/site.js` 的 `projects` 数组中追加：

```javascript
{
  id: 'example-project',
  title: '项目名称',
  repository: 'RepositoryName',
  category: '应用',
  icon: 'layers',
  subtitle: '用一句话说明用途。',
  description: '概括使用场景、主要处理流程和输出。',
  tags: ['Python', 'FastAPI'],
  details: [
    { title: '输入与处理', text: '用于介绍弹窗的简短说明。' },
    { title: '输出与核对', text: '说明结果如何呈现和检查。' },
  ],
  note: '说明运行条件或当前限制。',
  source: 'https://github.com/your-account/your-repository',
}
```

`icon` 当前映射为 `phone`、`game`、`layers` 和 `clock`；未映射值使用通用代码图标。`repository` 是仓库标识，按钮使用完整的 `source`。如属论文复现，可增加 `reference: { title: '原论文标题', url: 'https://...' }`，它会生成论文来源并将页首标记为论文复现。

在 `src/data/project-notes.js` 的 `projectNotes` 对象中追加同名键：

```javascript
'example-project': {
  motivation: '问题出现的场景，以及为什么采用这个实现方向。',
  implementation: [
    { title: '数据进入系统', text: '描述输入、主要处理和异常分支。' },
    { title: '结果如何使用', text: '描述输出、交互或下游消费方式。' },
  ],
  scopeTitle: '实现范围与使用条件',
  scope: [
    '已经完成的实现与可核对的验证记录。',
    '尚未覆盖的场景、依赖条件和下一步需要验证的问题。',
  ],
}
```

两处 ID 必须完全一致；详情渲染直接读取对应正文，缺少 `projectNotes` 会导致构建失败。构建后检查首页、介绍弹窗、直接打开详情，以及前后项目导航。现有测试包含四个项目的固定断言，新增项目时需同步调整。

## 图片、PDF 与链接路径

| 使用位置 | 示例 | 对应文件或地址 |
| --- | --- | --- |
| 正文文件 `body` | `articles/retrieval-notes.md` | `content/articles/retrieval-notes.md` |
| Markdown 图片 | `/files/retrieval-result.png` | `public/files/retrieval-result.png` |
| 本地 PDF 元数据 | `files/paper-slug.pdf` | `public/files/paper-slug.pdf` |
| 站外发表链接 | `https://example.org/paper` | 完整的远程地址 |

PDF 元数据中的本地路径不能以 `/` 开头，扩展名使用 `.pdf`；当前校验仅接受英文字母、数字、下划线、连字符、点和目录分隔符。建议图片和附件也统一使用简短英文文件名，避免大小写差异。Windows 上可读取的错误大小写路径，在 Linux 构建或线上可能失效。

Markdown 中 `/files/` 开头的链接会自动加上部署前缀；其他站内地址不会普遍自动重写。例如链接到项目时，可使用本站完整网址 `https://crystalclear9.github.io/SelfPage/projects/gameqa/`。移动部署位置后，需要同时核查这些手写地址。

## 修改、撤下和更换内容

修改标题、摘要和正文不会改变链接，改变 `slug` 或 `type` 则会改变 URL。当前没有旧正文地址自动重定向功能；已有分享链接应尽量保留原 slug。

暂时撤下内容时将 `published` 改为 `false` 并重新发布。对应页面不再生成，但关联附件仍位于 `public/`，公开仓库历史也仍保留原文。删除文章记录不会自动删除 PDF 或图片；确需移除附件时，先检查其他文章是否仍在引用。

论文后续有正式发表版本时，可在同一条目中更新 `venue`、`externalUrl`、PDF 与说明。作者顺序和日期按实际材料维护，不通过复制条目制造两个相同路径。

## 不在当前正文渲染范围内的功能

目前使用 React Markdown 与 GFM，支持常见表格和任务列表；没有数学公式渲染插件、代码语法高亮、评论系统、站内搜索或在线上传后台。论文公式较多时可以提供 PDF，并在 Markdown 中写摘要和阅读说明。需要这些额外功能时，应先修改渲染实现，不能仅靠增加元数据字段启用。

## 校验与公开范围

```bash
npm run check:content
npm run build
```

构建对已发布条目检查重复网址、无效日期、缺少正文文件、越界路径以及错误的链接格式。只有 `published: true` 的内容进入校验、页面和客户端模块；未发布草稿不会生成预览页面。`check:content` 使用测试样例验证加载器，当前索引的校验以实际构建为准。

这是静态发布流程，不包含后台上传或在线编辑。可在本地编辑，或通过 GitHub 上传文件并编辑元数据；推送后由 Actions 构建。`public/` 下的文件始终会部署，公开仓库中的草稿也能通过仓库访问。私人内容应保存在仓库之外。

常见错误可按以下顺序排查：

| 构建信息或现象 | 核对位置 |
| --- | --- |
| `content/index.json must be an array` | 根节点是否为 `[]` 而非单个对象 |
| `Invalid content type or slug` | type 枚举、slug 字符与连字符格式 |
| `Missing metadata` / `Invalid date` | 标题、摘要、日期及日期是否真实存在 |
| `Duplicate route` | 同一分类中是否重复使用 slug |
| `Invalid Markdown path` 或文件读取失败 | body 是否在 content 内，扩展名、大小写及文件是否正确 |
| `Missing or invalid PDF` | PDF 路径格式和实际文件是否一致 |
| `Published entry has no content` | 正文是否为空，是否至少有 PDF 或外部链接 |
| 已发布但项目页无相关记录 | project 是否等于该项目的 id |

发布前至少检查索引摘要、正文换行、图片、PDF、外链和返回入口。浏览器预览不会自动检查远程链接内容是否正确，仍需实际打开核对。
