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

## 校验与公开范围

```bash
npm run check:content
npm run build
```

构建对已发布条目检查重复网址、无效日期、缺少正文文件、越界路径以及错误的链接格式。只有 `published: true` 的内容进入校验、页面和客户端模块；未发布草稿不会生成预览页面。`check:content` 使用测试样例验证加载器，当前索引的校验以实际构建为准。

这是静态发布流程，不包含后台上传或在线编辑。可在本地编辑，或通过 GitHub 上传文件并编辑元数据；推送后由 Actions 构建。`public/` 下的文件始终会部署，公开仓库中的草稿也能通过仓库访问。私人内容应保存在仓库之外。
