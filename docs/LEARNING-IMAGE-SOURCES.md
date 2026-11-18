# 教材配图

当前发布清单见 [AILearning 快照](../content/collections/ailearning/manifest.json) 的 `images` 字段。主题图解随源资料导入，目录层级保留在 `public/files/ailearning/` 下。维护单张图时，先在源章节中确认 Markdown 相对路径，再在清单和发布目录中核对同一路径。文件名大小写应与正文一致。

导入后运行 `npm run build` 和 `node tests/learning-references.mjs`，核对本地图片与 SVG 片段引用。要检查浏览器能否实际解码图片，在生产预览上运行 `node tests/learning-render.mjs`。引入第三方配图时，记录原始来源、作者、许可与改动，并将随图提供的许可文件与素材一并导入。

## 历史外部插图

以下是早期教材快照使用过的外部素材。当前清单未列入这些文件，保留来源记录供核查旧版本使用。

- `pca`：Nicoguaro；[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:GaussianScatterPCA.svg)。
- `rnn`：fdeloche；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:Recurrent_neural_network_unfold.svg)。
- `svm`：ZackWeinberg（基于 Cyc 原图）；[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:Svm_separating_hyperplanes_%28SVG%29.svg)。
- `descent`：Zerodamage（基于 Olegalexandrov 原图）；公有领域；[原始来源](https://commons.wikimedia.org/wiki/File:Gradient_descent.svg)。
- `network`：Glosser.ca；[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:Colored_neural_network.svg)。
- `no_padding_no_strides`：Vincent Dumoulin、Francesco Visin；MIT；[原始来源](https://github.com/vdumoulin/conv_arithmetic)。
- `no_padding_strides`：Vincent Dumoulin、Francesco Visin；MIT；[原始来源](https://github.com/vdumoulin/conv_arithmetic)。
- `dilation`：Vincent Dumoulin、Francesco Visin；MIT；[原始来源](https://github.com/vdumoulin/conv_arithmetic)。

主页角色插画、两套光标原画与音频见[站点素材说明](ASSETS.md)。角色表现的参考与设计取舍见[角色交互](MOTION.md#加藤惠什么时候回应)。
