# 贝叶斯计算与近似推断

连接后验积分、变分优化与 MCMC，明确近似偏差及采样诊断的证据边界。

**先修知识：** 贝叶斯参数估计、KL、梯度与线性代数；第二章需马尔可夫链基本概念。

**正文篇幅状态：** 本主题现有 2 章均已按长篇教材标准展开，逐章纯正文达到 12000–20000 汉字。全库进度见[长篇教材覆盖表](../../README.md#textbook-status)。

## 章节与学习目标

| 章节 | 核心内容 | 深入讲解入口 |
| --- | --- | --- |
| [第 1 章 变分推断、ELBO 与近似后验](01-变分推断ELBO与近似后验.md) | ELBO与KL方向、CAVI和完整非共轭优化、参数相关性、预测与校准参照 | [进入讲解](01-变分推断ELBO与近似后验.md#deep-dive-2) |
| [第 2 章 MCMC 不变分布、HMC 与收敛诊断](02-MCMC不变分布HMC与收敛诊断.md) | MH通量与目标坐标、HMC可逆体积证明、完整采样、ESS及遗漏模式诊断 | [进入讲解](02-MCMC不变分布HMC与收敛诊断.md#deep-dive-2) |

## 阅读顺序与验收

第 1 章固定概率模型，先区分近似族、优化与后验函数误差；第 2 章转向保持同一目标的随机核、HMC几何及有限计算诊断。可在相同相关高斯上比较平均场结构偏差与采样方差，再进入非共轭模型。遇到公式先复算低维例子，再进入实验设计；不要把局部数值检查当成算法整体效果证明。

**完成要求：** 独立推导 ELBO；解释均值场相关方向的误差；证明 MH 不变性并区分 ESS、混合与模型检验。

作答后再阅读各章解析。能够独立说明一个失效条件，并设计一个可区分竞争解释的对照实验，才算完成本主题的进阶学习。

## 回看先修知识

- [概率模型](../../MachineLearning/ProbabilisticModels/README.md)
- [信息论](../../Mathematics/InformationTheory/README.md)
- [数值计算](../../Mathematics/NumericalMethods/README.md)

## 参考资料

- [Variational Inference Review](https://arxiv.org/abs/1601.00670)
- [Stan Posterior Analysis](https://mc-stan.org/docs/reference-manual/analysis.html)

[进阶目录](../README.md) · [学习路线](../../学习路线.md#advanced-topics) · [总目录](../../README.md)
