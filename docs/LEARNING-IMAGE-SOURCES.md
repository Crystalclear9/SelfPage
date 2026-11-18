# 教材配图

## 配图清单与源文件

贝叶斯计算章节的坐标更新图引用路径为 `images/01-cavi-coordinate-progress.webp`，导入时保留它相对于主题目录的位置，发布副本位于 [BayesianComputation/images](../public/files/ailearning/AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp)。[专题清单](../content/collections/ailearning/manifest.json) 的 `images` 字段可用于核对其他配图。

修改图片时，先更新源资料中的文件和引用，再按[同步步骤](CONTENT.md#同步-ailearning)导入。新增第三方插图时记下作者、来源、许可及改动，随图附带的许可文件放在源素材旁。

## 核对发布结果

构建后运行 `node tests/learning-references.mjs` 检查本地文件和 SVG 片段。启动生产预览后运行 `node tests/learning-render.mjs`，检查浏览器能否解码图片。排查缺图时依次核对正文的相对路径、清单条目、发布文件的大小写，以及 SVG 引用中的片段名。

## 源文件与发布路径映射

| 查看位置 | 示例 |
| --- | --- |
| 主题目录里的章节 Markdown | `images/01-cavi-coordinate-progress.webp` |
| 导入清单的 `images` 项 | `AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp` |
| GitHub Pages 的 Network 请求 | `/SelfPage/files/ailearning/AdvancedStudies/BayesianComputation/images/01-cavi-coordinate-progress.webp` |

章节引用以当前 Markdown 所在目录为基准，清单路径以源仓库根目录为基准。发布地址由站点前缀、附件目录和清单路径组成，保留文件名大小写及原引用中的 SVG 片段。若请求成功但图示区域不对，查看 SVG 内是否存在片段指定的元素；若浏览器返回 404，检查清单条目与发布副本的目录层级。

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
