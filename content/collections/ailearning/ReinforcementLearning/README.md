# 强化学习

本分类共 4 个主题。MDP → 价值方法建立表格决策基础，再进入策略梯度与 Actor-Critic，最后整合深度强化学习。表格方法只需 Python、NumPy 和相关数学；神经网络实现再补 PyTorch。DQN 分支可在价值方法与 PyTorch 后先读，连续控制再衔接策略方法。具体安排见[学习路线](../学习路线.md)。

## 四个主题怎样衔接

| 学习阶段 | 输入和要求解的对象 | 应完成的检查 |
| --- | --- | --- |
| MDP与规划 | 已知奖励和转移模型，求价值与策略 | 状态充分性、终止语义、Bellman残差及规划误差 |
| 表格价值学习 | 交互样本，估计固定策略或最优动作价值 | 访问覆盖、行为与目标策略、独立收益及有限预算误差 |
| 策略方法 | 参数化动作分布，优化明确的期望目标 | 梯度估计、基线与优势、采样分布及更新约束 |
| 深度强化学习 | 函数近似、经验复用及复杂控制 | 目标与状态、分布变化、优化稳定性和复现协议 |

先在可精确求解的有限模型中检查实现，再扩大到采样与参数化。精确Bellman算子收缩并不自动证明投影、离策略采样和神经网络组成的实际更新收敛；训练回报也不自动等于冻结策略的部署收益。每次进入新主题，都要重新确认目标、可见信息、数据来源和最终评价。

**长篇完成状态：** 本分类 4 个主题、16 章均已达到每章 12000–20000 汉字纯正文标准。全库进度见[长篇教材覆盖表](../README.md#textbook-status)。

## 主题与章节

### [马尔可夫决策过程](MDP/README.md)

- [第 1 章 状态动作奖励与回报](MDP/01-状态动作奖励与回报.md)
- [第 2 章 价值函数Bellman方程与规划](MDP/02-价值函数Bellman方程与规划.md)
- [第 3 章 有限状态动态规划完整算例](MDP/03-有限状态动态规划完整算例.md)
- [第 4 章 部分可观测与奖励建模边界](MDP/04-部分可观测与奖励建模边界.md)

### [价值方法](ValueBasedMethods/README.md)

- [第 1 章 蒙特卡洛TD与动作价值](ValueBasedMethods/01-蒙特卡洛TD与动作价值.md)
- [第 2 章 一维导航的表格Q学习](ValueBasedMethods/02-一维导航的表格Q学习.md)
- [第 3 章 探索策略多步学习与资格迹](ValueBasedMethods/03-探索策略多步学习与资格迹.md)
- [第 4 章 价值学习的评估与失败诊断](ValueBasedMethods/04-价值学习的评估与失败诊断.md)

### [策略梯度与Actor-Critic](PolicyBasedMethods/README.md)

- [第 1 章 策略梯度与方差控制](PolicyBasedMethods/01-策略梯度与方差控制.md)
- [第 2 章 Actor-Critic优势与PPO](PolicyBasedMethods/02-Actor-Critic优势与PPO.md)
- [第 3 章 从REINFORCE到GAE的实现细节](PolicyBasedMethods/03-从REINFORCE到GAE的实现细节.md)
- [第 4 章 PPO训练循环与稳定性检查](PolicyBasedMethods/04-PPO训练循环与稳定性检查.md)

### [深度强化学习](DeepRL/README.md)

- [第 1 章 DQN经验回放与目标网络](DeepRL/01-DQN经验回放与目标网络.md)
- [第 2 章 连续控制奖励设计与实验](DeepRL/02-连续控制奖励设计与实验.md)
- [第 3 章 DQN最小训练更新与DoubleDQN](DeepRL/03-DQN最小训练更新与DoubleDQN.md)
- [第 4 章 连续控制离线学习与复现协议](DeepRL/04-连续控制离线学习与复现协议.md)

[返回总目录](../README.md)
