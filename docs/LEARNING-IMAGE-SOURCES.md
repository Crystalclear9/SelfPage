# 教材配图

## 引用与发布路径

教材插图随源章节导入。[清单](../content/collections/ailearning/manifest.json)的 `images` 字段保存相对源仓库的路径，发布副本沿用相同目录结构。贝叶斯计算章节中的坐标更新图对应以下位置。

| 位置 | 路径 |
| --- | --- |
| 章节 Markdown 中的引用 | `images/01-cavi-coordinate-progress.webp` |
| 清单条目 | `AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp` |
| 本站发布副本 | [public/files/ailearning 下的图像](../public/files/ailearning/AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp) |
| 浏览器请求 | `/SelfPage/files/ailearning/AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp` |

图片更新在源章节目录中完成：替换素材，修改 Markdown 相对路径，再[导入教材](CONTENT.md#同步-ailearning)。导入器识别 SVG、PNG、JPG、JPEG、GIF 和 WebP，同时复制同目录的许可文本。新增第三方素材时，记录作者、来源、许可和本地改动。

## 图片引用与验证

渲染器以当前章节所在目录为基准解析相对路径，在清单中找到对应文件后，为 URL 加上部署前缀并编码各段路径。图片原有的查询参数与 SVG 片段跟随目标文件保留。清单中缺少目标时，构建错误 `Missing learning image` 会给出解析后的路径。[教材渲染器](../scripts/learning.mjs)

| 验证层 | 命令 | 检查对象 |
| --- | --- | --- |
| 文件与引用 | `node tests/learning-references.mjs` | 构建后的 HTML、对应的本地文件以及 SVG 中命名的片段目标 |
| 浏览器解码 | `node tests/learning-render.mjs` | 生产预览中的正文图片，包括折叠内容内的图片、窄屏和深色模式下的布局 |

## 早期版本使用的外部插图

以下署名对应历史教材快照，可按图名追溯素材与许可。

- `pca`：Nicoguaro。[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。[原始素材](https://commons.wikimedia.org/wiki/File:GaussianScatterPCA.svg)
- `rnn`：fdeloche。[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。[原始素材](https://commons.wikimedia.org/wiki/File:Recurrent_neural_network_unfold.svg)
- `svm`：ZackWeinberg（基于 Cyc 原图）。[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)。[原始素材](https://commons.wikimedia.org/wiki/File:Svm_separating_hyperplanes_%28SVG%29.svg)
- `descent`：Zerodamage（基于 Olegalexandrov 原图）。公有领域。[原始素材](https://commons.wikimedia.org/wiki/File:Gradient_descent.svg)
- `network`：Glosser.ca。[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)。[原始素材](https://commons.wikimedia.org/wiki/File:Colored_neural_network.svg)
- `no_padding_no_strides`：Vincent Dumoulin、Francesco Visin。MIT。[原始素材](https://github.com/vdumoulin/conv_arithmetic)
- `no_padding_strides`：Vincent Dumoulin、Francesco Visin。MIT。[原始素材](https://github.com/vdumoulin/conv_arithmetic)
- `dilation`：Vincent Dumoulin、Francesco Visin。MIT。[原始素材](https://github.com/vdumoulin/conv_arithmetic)
