# 教材配图

## 引用与发布路径

教材插图随源章节导入。[清单](../content/collections/ailearning/manifest.json)的 `images` 字段保存相对源仓库的路径，发布副本沿用相同目录结构。贝叶斯计算章节中的坐标更新图对应以下位置。

| 位置 | 路径 |
| --- | --- |
| 章节 Markdown 中的引用 | `images/01-cavi-coordinate-progress.webp` |
| 清单条目 | `AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp` |
| 本站发布副本 | [public/files/ailearning 下的图像](../public/files/ailearning/AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp) |
| 浏览器请求 | `/SelfPage/files/ailearning/AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp` |

更换插图时，在源资料中更新文件和 Markdown 引用，再[同步教材](CONTENT.md#同步-ailearning)。第三方插图同时记录作者、原始来源、许可及改动，许可文件与图片存放在同一目录。

## 图像检查

构建后运行 `node tests/learning-references.mjs`，脚本从生成的 HTML 提取引用，核对本地文件和 SVG 片段目标。生产预览中的逐页检查使用 `node tests/learning-render.mjs`，由浏览器展开折叠内容并解码图片。前者可定位路径和锚点错误，后者可发现文件存在但解码失败的图像。

## 早期版本使用的外部插图

以下署名对应历史教材快照，可按图名追溯素材与许可。

| 图名 | 作者 | 许可 | 来源 |
| --- | --- | --- | --- |
| `pca` | Nicoguaro | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [原始来源](https://commons.wikimedia.org/wiki/File:GaussianScatterPCA.svg) |
| `rnn` | fdeloche | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [原始来源](https://commons.wikimedia.org/wiki/File:Recurrent_neural_network_unfold.svg) |
| `svm` | ZackWeinberg（基于 Cyc 原图） | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [原始来源](https://commons.wikimedia.org/wiki/File:Svm_separating_hyperplanes_%28SVG%29.svg) |
| `descent` | Zerodamage（基于 Olegalexandrov 原图） | 公有领域 | [原始来源](https://commons.wikimedia.org/wiki/File:Gradient_descent.svg) |
| `network` | Glosser.ca | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [原始来源](https://commons.wikimedia.org/wiki/File:Colored_neural_network.svg) |
| `no_padding_no_strides` | Vincent Dumoulin、Francesco Visin | MIT | [原始来源](https://github.com/vdumoulin/conv_arithmetic) |
| `no_padding_strides` | Vincent Dumoulin、Francesco Visin | MIT | [原始来源](https://github.com/vdumoulin/conv_arithmetic) |
| `dilation` | Vincent Dumoulin、Francesco Visin | MIT | [原始来源](https://github.com/vdumoulin/conv_arithmetic) |
