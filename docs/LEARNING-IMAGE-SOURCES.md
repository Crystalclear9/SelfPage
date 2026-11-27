# 教材配图与署名

## 当前教材配图

教材的 Markdown 和图片按源仓库中的相对位置配对。导入时，正文写入 `content/collections/ailearning/`，配图写入 [public/files/ailearning](../public/files/ailearning)，路径登记在[教材清单](../content/collections/ailearning/manifest.json)的 `images` 字段。更新图片时在源教材中替换对应文件，随后按[同步流程](CONTENT.md#同步-ailearning)导入正文与素材。

生产构建后运行 `node tests/learning-references.mjs`，核对页面所引用的图片和 SVG 片段。检查实际解码与显示尺寸时，在生产预览上运行 `node tests/learning-render.mjs`。

## 历史版本的外部配图

以下署名对应曾随教材发布的外部图示。文件链接指向保留这批素材的仓库快照，原作与许可链接供查阅。

- [pca](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/pca.svg)：Nicoguaro；[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:GaussianScatterPCA.svg)。
- [rnn](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/rnn.svg)：fdeloche；[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:Recurrent_neural_network_unfold.svg)。
- [svm](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/svm.svg)：ZackWeinberg（基于 Cyc 原图）；[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:Svm_separating_hyperplanes_%28SVG%29.svg)。
- [descent](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/descent.svg)：Zerodamage（基于 Olegalexandrov 原图）；公有领域；[原始来源](https://commons.wikimedia.org/wiki/File:Gradient_descent.svg)。
- [network](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/network.svg)：Glosser.ca；[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)；[原始来源](https://commons.wikimedia.org/wiki/File:Colored_neural_network.svg)。
- [no_padding_no_strides](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/no_padding_no_strides.gif)：Vincent Dumoulin、Francesco Visin；[MIT](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/conv-arithmetic-LICENSE.txt)；[原始来源](https://github.com/vdumoulin/conv_arithmetic)。
- [no_padding_strides](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/no_padding_strides.gif)：Vincent Dumoulin、Francesco Visin；[MIT](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/conv-arithmetic-LICENSE.txt)；[原始来源](https://github.com/vdumoulin/conv_arithmetic)。
- [dilation](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/dilation.gif)：Vincent Dumoulin、Francesco Visin；[MIT](https://github.com/Crystalclear9/SelfPage/blob/374423aa3690150ca586d7a819fae5a3ef7e8f9e/public/files/ailearning/assets/external/conv-arithmetic-LICENSE.txt)；[原始来源](https://github.com/vdumoulin/conv_arithmetic)。

主页角色插画、两套光标原画与音频见[站点素材说明](ASSETS.md)。角色表现的参考与设计取舍见[角色交互](MOTION.md#角色光标)。
