# 进阶理论与研究专题

本分类包含 **7 个主题、18 个章节**。它们在基础与应用讲义之上展开，每章给出对象与假设、推导、算例、方法比较、实验设计及练习解析。按研究问题选择分支，无需依次读完所有主题。

## 阅读入口

| 主题 | 解决的问题 | 先修主线 |
| --- | --- | --- |
| [统&#8288;计&#8288;学&#8288;习&#8288;理&#8288;论](LearningTheory/README.md) | 从总体风险、稳定性、PAC-Bayes 与局部复杂度解释泛化，区分预测对象及快速率条件。 | 概率、优化 |
| [因&#8288;果&#8288;推&#8288;断&#8288;与&#8288;效&#8288;应&#8288;估&#8288;计](CausalInference/README.md) | 从干预识别、加权与双重稳健，连接有限时域离策略评价。 | 统计、模型评估 |
| [贝&#8288;叶&#8288;斯&#8288;计&#8288;算&#8288;与&#8288;近&#8288;似&#8288;推&#8288;断](BayesianComputation/README.md) | 连接后验积分、变分优化与 MCMC，明确近似偏差及采样诊断的证据边界。 | 概率模型、信息论 |
| [自&#8288;监&#8288;督&#8288;表&#8288;示&#8288;学&#8288;习](SelfSupervisedLearning/README.md) | 研究配对、对比目标、非对比约束和掩码任务如何塑造表示。 | 神经网络基础、信息论 |
| [连&#8288;续&#8288;生&#8288;成&#8288;与&#8288;流&#8288;匹&#8288;配](ContinuousGenerativeModels/README.md) | 连接去噪得分、反向动力学、概率流与条件路径速度，明确时间方向和误差来源。 | 生成模型、概率 |
| [高&#8288;效&#8288;训&#8288;练&#8288;与&#8288;推&#8288;理&#8288;系&#8288;统](EfficientModelSystems/README.md) | 从状态与 I/O 预算理解分片、重计算、量化和实际推理瓶颈。 | PyTorch、计算机系统 |
| [不&#8288;确&#8288;定&#8288;性&#8288;与&#8288;分&#8288;布&#8288;鲁&#8288;棒&#8288;性](UncertaintyAndRobustness/README.md) | 区分概率校准、保形覆盖、最坏群体与拒答条件风险。 | 模型评估、统计 |

## 按问题选择路径

理论主线：统计学习理论 → 根据问题进入因果或不确定性。概率计算主线：概率模型 → 贝叶斯计算；生成研究主线：扩散基础 → 连续生成。表示主线：神经网络与信息论 → 自监督；系统主线：PyTorch 与计算机系统 → 高效训练与推理。各支线之间有联系，但不互为全部先修。

| 研究产出 | 应回答的问题 |
| --- | --- |
| 推导笔记 | 对象、条件、等式来源与失效反例分别是什么 |
| 独立算例 | 参考结果怎样得到，程序核对哪项性质 |
| 对照实验 | 哪个因素被改变，数据与预算是否匹配 |
| 结果报告 | 效果、波动、代价及未覆盖范围是否清楚 |

## 全部章节

### [统计学习理论](LearningTheory/README.md)

- [第 1 章 总体风险、一致收敛与模型选择](LearningTheory/01-总体风险一致收敛与模型选择.md)
- [第 2 章 算法稳定性、插值与隐式偏置](LearningTheory/02-算法稳定性插值与隐式偏置.md)
- [第 3 章 PAC-Bayes、变分界与随机预测器](LearningTheory/03-PACBayes变分界与随机预测器.md)
- [第 4 章 局部复杂度、快速率与数据依赖泛化](LearningTheory/04-局部复杂度快速率与数据依赖泛化.md)

### [因果推断与效应估计](CausalInference/README.md)

- [第 1 章 潜在结果、因果图与效应识别](CausalInference/01-潜在结果因果图与效应识别.md)
- [第 2 章 倾向加权、双重稳健与交叉拟合](CausalInference/02-倾向加权双重稳健与交叉拟合.md)
- [第 3 章 序贯决策、重要性采样与离策略评价](CausalInference/03-序贯决策重要性采样与离策略评价.md)

### [贝叶斯计算与近似推断](BayesianComputation/README.md)

- [第 1 章 变分推断、ELBO 与近似后验](BayesianComputation/01-变分推断ELBO与近似后验.md)
- [第 2 章 MCMC 不变分布、HMC 与收敛诊断](BayesianComputation/02-MCMC不变分布HMC与收敛诊断.md)

### [自监督表示学习](SelfSupervisedLearning/README.md)

- [第 1 章 对比目标、InfoNCE 与负样本机制](SelfSupervisedLearning/01-对比目标InfoNCE与负样本机制.md)
- [第 2 章 表示坍塌、非对比目标与掩码建模](SelfSupervisedLearning/02-表示坍塌非对比目标与掩码建模.md)

### [连续生成与流匹配](ContinuousGenerativeModels/README.md)

- [第 1 章 得分匹配、随机微分方程与概率流](ContinuousGenerativeModels/01-得分匹配随机微分方程与概率流.md)
- [第 2 章 流匹配、连续性方程与路径选择](ContinuousGenerativeModels/02-流匹配连续性方程与路径选择.md)

### [高效训练与推理系统](EfficientModelSystems/README.md)

- [第 1 章 训练显存分解、分片与重计算](EfficientModelSystems/01-训练显存分解分片与重计算.md)
- [第 2 章 量化误差、校准与推理瓶颈](EfficientModelSystems/02-量化误差校准与推理瓶颈.md)

### [不确定性与分布鲁棒性](UncertaintyAndRobustness/README.md)

- [第 1 章 概率校准、保形预测与覆盖保证](UncertaintyAndRobustness/01-概率校准保形预测与覆盖保证.md)
- [第 2 章 分布变化、重要性加权与最坏群体风险](UncertaintyAndRobustness/02-分布变化重要性加权与最坏群体风险.md)
- [第 3 章 选择性预测、拒答与风险覆盖控制](UncertaintyAndRobustness/03-选择性预测拒答与风险覆盖控制.md)

[总目录](../README.md) · [学习路线](../学习路线.md#advanced-topics) · [内容范围与掌握标准](../内容范围与掌握标准.md)
