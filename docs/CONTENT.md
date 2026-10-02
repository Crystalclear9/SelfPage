# 内容维护

## 项目

修改 `src/data/site.js` 中的 `projects`。每个项目的 `id` 生成 `/projects/<id>/`，首页、详情页和介绍弹窗共用简介与实现说明。`source` 指向源码；`reference` 可记录原论文标题与链接。

项目文案应区分方法来源、实现范围和验证结果。Autellix 标注为他人论文的个人复现尝试，原论文不作为本站作者的发表成果列入论文索引。

## 新增文章

1. 在 `content/articles/` 创建 Markdown 文件，例如 `retrieval-notes.md`。
2. 在 `content/index.json` 数组中加入以下对象，替换标题、日期和摘要。
3. 本地预览、核对内容后，将 `published` 改为 `true`。
4. 执行构建和检查，提交并推送至 `main`。

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

构建拒绝重复网址、无效日期、缺少正文文件、越界路径以及错误的链接格式。只有 `published: true` 的内容进入页面和客户端模块。

这是静态发布流程，不包含后台上传或在线编辑。可在本地编辑，或通过 GitHub 上传文件并编辑元数据；推送后由 Actions 构建。`public/` 下的文件始终会部署，公开仓库中的草稿也能通过仓库访问。私人内容应保存在仓库之外。
