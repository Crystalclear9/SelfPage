# AI 学习教材

这是一套可按章节自学的 AI 教材，分为 **8 个分类、47 个主题、186 个章节**，覆盖数学、编程、计算机基础、机器学习、深度学习、应用方向、强化学习与进阶研究专题。各章从问题与概念出发，通过推导、完整算例和可运行实验解释方法，再以反例、方法比较和练习解析帮助巩固与深入。

初学者按[基础学习路线](学习路线.md#basic)建立完整知识链；已有基础可按[进阶学习路线](学习路线.md#advanced)重点阅读证明条件、方法比较和研究练习。

## 开始学习

- [学习路线与阶段验收](学习路线.md)：按先修关系安排学习，选择视觉、语言、生成或强化学习方向。
- [内容范围与掌握标准](内容范围与掌握标准.md)：了解各主题的学习范围、逐主题验收及进阶衔接。
- [运行环境](运行环境.md)：区分完整 Python 示例、SQL 与特定 shell 命令，配置可复现环境。
- [术语与符号](术语与符号.md)：查阅跨主题数学符号和容易混淆的概念。

目录按“分类 → 主题 → 章节”逐层展开。先用[学习路线](学习路线.md)确定当前阶段，再进入主题目录选择章节；章内目录用于定位推导、实验和练习。已有基础时，可通过下方的[完整章节索引](#textbook-status)直接找具体章节。

## 分类目录

| 分类 | 主题数 | 章节数 |
| --- | ---: | ---: |
| [编&#8288;程&#8288;基&#8288;础](Programming/README.md) | 5 | 22 |
| [数&#8288;学&#8288;基&#8288;础](Mathematics/README.md) | 8 | 32 |
| [计&#8288;算&#8288;机&#8288;基&#8288;础](ComputerScience/README.md) | 5 | 21 |
| [机&#8288;器&#8288;学&#8288;习](MachineLearning/README.md) | 6 | 26 |
| [深&#8288;度&#8288;学&#8288;习](DeepLearning/README.md) | 6 | 25 |
| [应&#8288;用&#8288;与&#8288;研&#8288;究&#8288;方&#8288;向](AI-Domains/README.md) | 6 | 26 |
| [强&#8288;化&#8288;学&#8288;习](ReinforcementLearning/README.md) | 4 | 16 |
| [进&#8288;阶&#8288;理&#8288;论&#8288;与&#8288;研&#8288;究&#8288;专&#8288;题](AdvancedStudies/README.md) | 7 | 18 |

## 进阶专题

完成相关先修后，可进入[进阶篇](AdvancedStudies/README.md)：学习理论、因果推断、贝叶斯计算、自监督表示、连续生成与流匹配、高效模型系统、不确定性与分布鲁棒性。各主题用两到四章深入一个问题链，包含推导、比较、算例和研究练习；顺序见[进阶分支路线](学习路线.md#advanced-topics)。

<a id="textbook-status"></a>

## 完整章节索引

下表按教材的分类顺序列出全部主题、章节与主要内容。初次学习时，先进入主题首页了解先修要求和阅读顺序；查阅某个问题时，可以直接打开对应章节，使用章内目录定位概念、推导、实验或题解。

| 主题 | 章节 | 主要内容 |
| --- | --- | --- |
| [P&#8288;y&#8288;t&#8288;h&#8288;o&#8288;n&#8288;&nbsp;&#8288;编&#8288;程&#8288;基&#8288;础](Programming/Python/README.md) | [01 变量容器与控制流程](Programming/Python/01-变量容器与控制流程.md)、[02 函数、类与迭代器](Programming/Python/02-函数类与迭代器.md)、[03 文件、异常、环境与脚本组织](Programming/Python/03-文件异常环境与脚本组织.md)、[04 模块、包、数据类与配置管理](Programming/Python/04-模块包数据类与配置管理.md)、[05 调试、测试与可复现小项目](Programming/Python/05-调试测试与可复现小项目.md)、[06 对象协议、类型约束与执行模型](Programming/Python/06-对象协议类型约束与执行模型.md) | 对象与所有权、函数与流式统计、文件恢复、配置模式、调试与完整项目、协议和执行机制 |
| [N&#8288;u&#8288;m&#8288;P&#8288;y&#8288;&nbsp;&#8288;数&#8288;值&#8288;数&#8288;组](Programming/NumPy/README.md) | [01 数组形状、索引与广播](Programming/NumPy/01-数组形状索引与广播.md)、[02 向量化、线性代数与可复现实验](Programming/NumPy/02-向量化线性代数与可复现实验.md)、[03 高级索引、批量运算与内存布局](Programming/NumPy/03-高级索引批量运算与内存布局.md)、[04 用 NumPy 实现线性回归训练](Programming/NumPy/04-用NumPy实现线性回归训练.md) | 轴与广播、索引映射、数值误差、向量化、批量运算、内存布局与复现实验 |
| [P&#8288;a&#8288;n&#8288;d&#8288;a&#8288;s&#8288;&nbsp;&#8288;表&#8288;格&#8288;处&#8288;理](Programming/Pandas/README.md) | [01 数据表索引缺失与清洗](Programming/Pandas/01-数据表索引缺失与清洗.md)、[02 分组连接与防止数据泄漏](Programming/Pandas/02-分组连接与防止数据泄漏.md)、[03 时间序列窗口与数据质量检查](Programming/Pandas/03-时间序列窗口与数据质量检查.md)、[04 从原始表到训练样本的完整流程](Programming/Pandas/04-从原始表到训练样本的完整流程.md) | 表语义与清洗契约、分组和连接、双时间窗口与版本重放、成熟标签和训练服务一致性 |
| [M&#8288;a&#8288;t&#8288;p&#8288;l&#8288;o&#8288;t&#8288;l&#8288;i&#8288;b&#8288;&nbsp;&#8288;可&#8288;视&#8288;化](Programming/Matplotlib/README.md) | [01 图形对象坐标与常用图表](Programming/Matplotlib/01-图形对象坐标与常用图表.md)、[02 训练诊断分布比较与导出](Programming/Matplotlib/02-训练诊断分布比较与导出.md)、[03 多子图误差条与统计表达](Programming/Matplotlib/03-多子图误差条与统计表达.md)、[04 构建模型诊断图与图表交付](Programming/Matplotlib/04-构建模型诊断图与图表交付.md) | 图形对象和坐标、训练及分布比较、配对区间与层级单位、可追溯诊断和图表交付 |
| [P&#8288;y&#8288;T&#8288;o&#8288;r&#8288;c&#8288;h&#8288;&nbsp;&#8288;深&#8288;度&#8288;学&#8288;习&#8288;编&#8288;程](Programming/PyTorch/README.md) | [01 张量自动求导与模型接口](Programming/PyTorch/01-张量自动求导与模型接口.md)、[02 完整训练验证与保存](Programming/PyTorch/02-完整训练验证与保存.md)、[03 数据集设备与高效训练](Programming/PyTorch/03-数据集设备与高效训练.md)、[04 检查点恢复与训练代码组织](Programming/PyTorch/04-检查点恢复与训练代码组织.md) | 存储与求导、归约和训练协议、数据与设备性能、状态完整性及恢复对照 |
| [微&#8288;积&#8288;分](Mathematics/Calculus/README.md) | [01 导数、偏导数与链式法则](Mathematics/Calculus/01-导数偏导数与链式法则.md)、[02 积分、泰勒展开与曲率](Mathematics/Calculus/02-积分泰勒展开与曲率.md)、[03 多元微分、隐函数与解的敏感性](Mathematics/Calculus/03-多元微分与隐函数.md)、[04 从导数到训练目标的推导实践](Mathematics/Calculus/04-从导数到训练目标的推导实践.md) | 可微与计算图、积分和余项、曲率与步长、隐函数与伴随、目标归约和完整训练实验 |
| [线&#8288;性&#8288;代&#8288;数](Mathematics/LinearAlgebra/README.md) | [01 向量矩阵与线性变换](Mathematics/LinearAlgebra/01-向量矩阵与线性变换.md)、[02 投影、最小二乘与矩阵分解](Mathematics/LinearAlgebra/02-投影最小二乘与矩阵分解.md)、[03 线性方程组与稳定求解](Mathematics/LinearAlgebra/03-线性方程组与稳定求解.md)、[04 从协方差到 PCA 的完整实践](Mathematics/LinearAlgebra/04-从协方差到PCA的完整实践.md) | 基与子空间、投影与 QR/SVD、稳定求解与误差证书、协方差与 PCA 完整实践 |
| [概&#8288;率&#8288;论](Mathematics/Probability/README.md) | [01 条件概率与贝叶斯推断](Mathematics/Probability/01-条件概率与贝叶斯推断.md)、[02 随机变量期望与常见分布](Mathematics/Probability/02-随机变量期望与常见分布.md)、[03 联合分布边缘化与条件期望](Mathematics/Probability/03-联合分布边缘化与条件期望.md)、[04 采样大数定律与蒙特卡洛推断](Mathematics/Probability/04-采样大数定律与蒙特卡洛推断.md) | 条件化与贝叶斯、分布与矩、联合和条件期望、采样极限定理与蒙特卡洛估计 |
| [统&#8288;计&#8288;学](Mathematics/Statistics/README.md) | [01 参数估计与置信区间](Mathematics/Statistics/01-参数估计与置信区间.md)、[02 假设检验相关性与实验](Mathematics/Statistics/02-假设检验相关性与实验.md)、[03 线性回归的统计解释](Mathematics/Statistics/03-线性回归的统计解释.md)、[04 重采样实验设计与报告实践](Mathematics/Statistics/04-重采样实验设计与报告实践.md) | 估计与覆盖、检验与实验设计、回归推断及稳健方差、重采样单位和完整报告 |
| [优&#8288;化&#8288;方&#8288;法](Mathematics/Optimization/README.md) | [01 目标函数、梯度下降与约束](Mathematics/Optimization/01-目标函数梯度下降与约束.md)、[02 动量自适应方法与训练诊断](Mathematics/Optimization/02-动量自适应方法与训练诊断.md)、[03 凸性二阶方法与约束优化](Mathematics/Optimization/03-凸性二阶方法与约束优化.md)、[04 优化实验记录与故障定位](Mathematics/Optimization/04-优化实验记录与故障定位.md) | 下降与随机梯度、动量与自适应状态、二阶约束与对偶、实验诊断和公平成本 |
| [数&#8288;值&#8288;计&#8288;算](Mathematics/NumericalMethods/README.md) | [01 浮点误差、条件数与稳定计算](Mathematics/NumericalMethods/01-浮点误差条件数与稳定计算.md)、[02 数值求导、积分与蒙特卡洛](Mathematics/NumericalMethods/02-数值求导积分与蒙特卡洛.md)、[03 线性系统条件数与病态问题](Mathematics/NumericalMethods/03-线性系统条件数与病态问题.md)、[04 根查找数值积分与停止准则](Mathematics/NumericalMethods/04-根查找数值积分与停止准则.md) | 浮点与误差模型、差分和积分、反问题谱滤波与参数选择、可靠求根与停止证据 |
| [矩&#8288;阵&#8288;微&#8288;积&#8288;分](Mathematics/MatrixCalculus/README.md) | [01 梯度雅可比与形状约定](Mathematics/MatrixCalculus/01-梯度雅可比与形状约定.md)、[02 批量损失与反向传播推导](Mathematics/MatrixCalculus/02-批量损失与反向传播推导.md)、[03 Softmax交叉熵与归一化求导](Mathematics/MatrixCalculus/03-Softmax交叉熵与归一化求导.md)、[04 从零实现两层网络的梯度检查](Mathematics/MatrixCalculus/04-从零实现两层网络的梯度检查.md) | 微分与伴随、批量归约及共享参数、稳定分类和归一化、全参数梯度与二阶检查 |
| [信&#8288;息&#8288;论](Mathematics/InformationTheory/README.md) | [01 信息量熵与编码直觉](Mathematics/InformationTheory/01-信息量熵与编码直觉.md)、[02 交叉熵KL散度与分类训练](Mathematics/InformationTheory/02-交叉熵KL散度与分类训练.md)、[03 最大似然交叉熵与困惑度](Mathematics/InformationTheory/03-最大似然交叉熵与困惑度.md)、[04 互信息特征选择与估计限制](Mathematics/InformationTheory/04-互信息特征选择与估计限制.md) | 熵与编码、KL与分类评分、序列似然和困惑度、互信息估计与无泄漏特征选择 |
| [数&#8288;据&#8288;结&#8288;构&#8288;与&#8288;算&#8288;法](ComputerScience/DataStructuresAndAlgorithms/README.md) | [01 复杂度与基础数据结构](ComputerScience/DataStructuresAndAlgorithms/01-复杂度与基础数据结构.md)、[02 二分排序与图遍历](ComputerScience/DataStructuresAndAlgorithms/02-二分排序与图遍历.md)、[03 递归动态规划与最优子结构](ComputerScience/DataStructuresAndAlgorithms/03-递归动态规划与最优子结构.md)、[04 堆近邻与大数据处理策略](ComputerScience/DataStructuresAndAlgorithms/04-堆近邻与大数据处理策略.md) | 计算模型与摊还、二分排序及图证明、状态充分性和近似动态规划、可合并Top-k与近邻外存策略 |
| [计&#8288;算&#8288;机&#8288;系&#8288;统&#8288;基&#8288;础](ComputerScience/ComputerSystems/README.md) | [01 程序执行内存与存储](ComputerScience/ComputerSystems/01-程序执行内存与存储.md)、[02 进程线程并发与性能分析](ComputerScience/ComputerSystems/02-进程线程并发与性能分析.md)、[03 I/O 缓存与数据加载流水线](ComputerScience/ComputerSystems/03-I_O缓存与数据加载流水线.md)、[04 GPU 并行、显存与分布式系统](ComputerScience/ComputerSystems/04-GPU并行显存与分布式入门.md)、[05 性能建模、基准实验与瓶颈推断](ComputerScience/ComputerSystems/05-性能建模基准实验与瓶颈推断.md) | 执行与虚拟内存、同步与并发、缓存背压和I/O流水线、GPU资源与归约、性能建模和受控实验 |
| [G&#8288;i&#8288;t&#8288;&nbsp;&#8288;版&#8288;本&#8288;管&#8288;理](ComputerScience/Git/README.md) | [01 工作区暂存区与提交](ComputerScience/Git/01-工作区暂存区与提交.md)、[02 分支合并冲突与实验复现](ComputerScience/Git/02-分支合并冲突与实验复现.md)、[03 检查历史定位问题与安全撤销](ComputerScience/Git/03-检查历史定位问题与安全撤销.md)、[04 协作分支与实验版本规范](ComputerScience/Git/04-协作分支与实验版本规范.md) | 索引与对象图、合并语义、历史定位与撤销、引用同步及实验交付 |
| [L&#8288;i&#8288;n&#8288;u&#8288;x&#8288;&nbsp;&#8288;与&#8288;命&#8288;令&#8288;行](ComputerScience/Linux/README.md) | [01 路径文件管道与权限](ComputerScience/Linux/01-路径文件管道与权限.md)、[02 进程日志远程与环境管理](ComputerScience/Linux/02-进程日志远程与环境管理.md)、[03 Shell脚本参数与作业管理](ComputerScience/Linux/03-Shell脚本参数与作业管理.md)、[04 服务器实验的监控与故障排查](ComputerScience/Linux/04-服务器实验的监控与故障排查.md) | 路径与描述符、进程信号和日志、脚本状态机、资源监控与故障诊断 |
| [数&#8288;据&#8288;库&#8288;与&#8288;&nbsp;&#8288;S&#8288;Q&#8288;L](ComputerScience/Databases/README.md) | [01 关系模型筛选与聚合](ComputerScience/Databases/01-关系模型筛选与聚合.md)、[02 连接索引事务与特征数据](ComputerScience/Databases/02-连接索引事务与特征数据.md)、[03 窗口函数与时间特征 SQL](ComputerScience/Databases/03-窗口函数与时间特征SQL.md)、[04 索引执行计划与可靠数据提取](ComputerScience/Databases/04-索引执行计划与可靠数据提取.md) | 多重集与缺失、连接和事务、双时间窗口、索引计划及可恢复提取 |
| [机&#8288;器&#8288;学&#8288;习&#8288;基&#8288;础](MachineLearning/Foundations/README.md) | [01 学习任务、数据与模型：从问题定义到可检验的学习系统](MachineLearning/Foundations/01-学习任务数据与模型.md)、[02 泛化、偏差方差与完整学习流程](MachineLearning/Foundations/02-泛化偏差方差与学习流程.md)、[03 特征工程、正则化与数据偏差](MachineLearning/Foundations/03-特征工程正则化与数据偏差.md)、[04 从问题定义到上线监测的完整学习流程](MachineLearning/Foundations/04-从问题定义到上线监测的完整流程.md)、[05 决策论、代理损失与统计一致性](MachineLearning/Foundations/05-决策论代理损失与统计一致性.md) | 任务契约、风险分解、特征与偏差、评估部署、代理校准及决策 |
| [监&#8288;督&#8288;学&#8288;习](MachineLearning/SupervisedLearning/README.md) | [01 线性回归与逻辑回归](MachineLearning/SupervisedLearning/01-线性回归与逻辑回归.md)、[02 决策树、随机森林与梯度提升](MachineLearning/SupervisedLearning/02-决策树集成与其他模型.md)、[03 支持向量机、核方法与近邻](MachineLearning/SupervisedLearning/03-支持向量机核方法与近邻.md)、[04 集成学习、调参与可解释性](MachineLearning/SupervisedLearning/04-集成学习调参与可解释性.md) | 回归与逻辑模型、树与集成、SVM 对偶与核、近邻、调参与解释的适用条件 |
| [模&#8288;型&#8288;评&#8288;估](MachineLearning/ModelEvaluation/README.md) | [01 分类回归与概率指标](MachineLearning/ModelEvaluation/01-分类回归与概率指标.md)、[02 交叉验证泄漏与公平比较](MachineLearning/ModelEvaluation/02-交叉验证泄漏与公平比较.md)、[03 阈值选择概率校准与成本决策](MachineLearning/ModelEvaluation/03-阈值选择概率校准与成本决策.md)、[04 不确定性漂移与评估报告](MachineLearning/ModelEvaluation/04-不确定性漂移与评估报告.md) | 概率与排序指标、部署单位及嵌套选择、校准成本和容量、漂移识别与序贯报告 |
| [无&#8288;监&#8288;督&#8288;学&#8288;习](MachineLearning/UnsupervisedLearning/README.md) | [01 聚类距离与簇的假设](MachineLearning/UnsupervisedLearning/01-聚类距离与簇的假设.md)、[02 降维可视化与结果验证](MachineLearning/UnsupervisedLearning/02-降维可视化与结果验证.md)、[03 异常检测与密度模型](MachineLearning/UnsupervisedLearning/03-异常检测与密度模型.md)、[04 聚类与降维的完整实验协议](MachineLearning/UnsupervisedLearning/04-聚类与降维的完整实验协议.md) | 距离与聚类目标、PCA及邻域可视化、异常密度与新颖性、稳定性和完整外部验证协议 |
| [概&#8288;率&#8288;模&#8288;型](MachineLearning/ProbabilisticModels/README.md) | [01 生成式分类与朴素贝叶斯](MachineLearning/ProbabilisticModels/01-生成式分类与朴素贝叶斯.md)、[02 隐变量高斯混合与EM](MachineLearning/ProbabilisticModels/02-隐变量高斯混合与EM.md)、[03 贝叶斯参数估计与后验预测](MachineLearning/ProbabilisticModels/03-贝叶斯参数估计与后验预测.md)、[04 隐马尔可夫模型与序列推断](MachineLearning/ProbabilisticModels/04-隐马尔可夫模型与序列推断.md) | 生成分类与平滑、混合模型和EM条件、贝叶斯联合预测、HMM推断与多序列学习 |
| [机&#8288;器&#8288;学&#8288;习&#8288;实&#8288;践&#8288;项&#8288;目](MachineLearning/Projects/README.md) | [01 项目设计与数据协议](MachineLearning/Projects/01-项目设计与数据协议.md)、[02 可运行分类实验](MachineLearning/Projects/02-可运行分类实验.md)、[03 回归扩展与项目报告](MachineLearning/Projects/03-回归扩展与项目报告.md)、[04 可运行回归项目与残差分析](MachineLearning/Projects/04-可运行回归项目与残差分析.md)、[05 特征审查模型说明与交付清单](MachineLearning/Projects/05-特征审查模型说明与交付清单.md) | 数据协议、分组分类与回归、残差及重采样、解释边界与完整交付 |
| [神&#8288;经&#8288;网&#8288;络&#8288;基&#8288;础](DeepLearning/NeuralNetworkBasics/README.md) | [01 前向传播激活函数与损失](DeepLearning/NeuralNetworkBasics/01-前向传播激活函数与损失.md)、[02 反向传播初始化与训练诊断](DeepLearning/NeuralNetworkBasics/02-反向传播初始化与训练诊断.md)、[03 初始化归一化与残差连接](DeepLearning/NeuralNetworkBasics/03-初始化归一化与残差连接.md)、[04 损失设计正则化与训练排错](DeepLearning/NeuralNetworkBasics/04-损失设计正则化与训练排错.md) | 稳定损失、计算图求导、初始化与归一化、正则化及训练排错 |
| [卷&#8288;积&#8288;神&#8288;经&#8288;网&#8288;络](DeepLearning/CNN/README.md) | [01 卷积运算感受野与尺寸](DeepLearning/CNN/01-卷积运算感受野与尺寸.md)、[02 网络结构迁移学习与实验](DeepLearning/CNN/02-网络结构迁移学习与实验.md)、[03 经典结构多尺度与视觉Transformer](DeepLearning/CNN/03-经典结构多尺度与视觉Transformer.md)、[04 从尺寸推导到训练实验设计](DeepLearning/CNN/04-从尺寸推导到训练实验设计.md) | 卷积几何与感受野、迁移与状态、多尺度和视觉Transformer、完整视觉实验 |
| [循&#8288;环&#8288;神&#8288;经&#8288;网&#8288;络](DeepLearning/RNN/README.md) | [01 序列状态与时间反向传播](DeepLearning/RNN/01-序列状态与时间反向传播.md)、[02 LSTM门控GRU与应用边界](DeepLearning/RNN/02-LSTM门控GRU与应用边界.md)、[03 序列到序列与注意力桥接](DeepLearning/RNN/03-序列到序列与注意力桥接.md)、[04 变长序列与时间预测实践](DeepLearning/RNN/04-变长序列与时间预测实践.md) | 共享状态与BPTT、门控完整导数、条件生成与搜索、变长及时间预测完整实验 |
| [注&#8288;意&#8288;力&#8288;机&#8288;制](DeepLearning/Attention/README.md) | [01 查询键值与加权读取](DeepLearning/Attention/01-查询键值与加权读取.md)、[02 自注意力多头与掩码](DeepLearning/Attention/02-自注意力多头与掩码.md)、[03 手写多头注意力与形状检查](DeepLearning/Attention/03-手写多头注意力与形状检查.md)、[04 注意力效率位置与解释实验](DeepLearning/Attention/04-注意力效率位置与解释实验.md) | QKV全导数、掩码与多头、完整前反向对照、在线归一化和位置解释反例 |
| [T&#8288;r&#8288;a&#8288;n&#8288;s&#8288;f&#8288;o&#8288;r&#8288;m&#8288;e&#8288;r](DeepLearning/Transformer/README.md) | [01 网络块位置与架构类型](DeepLearning/Transformer/01-网络块位置与架构类型.md)、[02 自回归训练生成与缓存](DeepLearning/Transformer/02-自回归训练生成与缓存.md)、[03 编码器解码器的最小结构实践](DeepLearning/Transformer/03-编码器解码器的最小结构实践.md)、[04 训练预算长上下文与推理优化](DeepLearning/Transformer/04-训练预算长上下文与推理优化.md) | 完整网络块、似然与缓存、编码解码训练、预算与长上下文评价 |
| [深&#8288;度&#8288;学&#8288;习&#8288;实&#8288;践&#8288;项&#8288;目](DeepLearning/Projects/README.md) | [01 任务数据与实验设计](DeepLearning/Projects/01-任务数据与实验设计.md)、[02 可运行训练与最佳模型选择](DeepLearning/Projects/02-可运行训练与最佳模型选择.md)、[03 错误分析消融与交付](DeepLearning/Projects/03-错误分析消融与交付.md)、[04 训练曲线检查点与推理接口](DeepLearning/Projects/04-训练曲线检查点与推理接口.md)、[05 消融设计资源比较与项目报告](DeepLearning/Projects/05-消融设计资源比较与项目报告.md) | 图像任务与协议、完整CNN和线性基线、错误配对与交互、恢复状态机和比较报告 |
| [计&#8288;算&#8288;机&#8288;视&#8288;觉](AI-Domains/ComputerVision/README.md) | [01 图像表示分类与迁移学习](AI-Domains/ComputerVision/01-图像表示分类与迁移学习.md)、[02 检测分割与视觉评价](AI-Domains/ComputerVision/02-检测分割与视觉评价.md)、[03 检测与分割的模型流程](AI-Domains/ComputerVision/03-检测与分割的模型流程.md)、[04 视觉项目的数据审计与鲁棒性](AI-Domains/ComputerVision/04-视觉项目的数据审计与鲁棒性.md) | 图像几何和分类、检测分割评价与流程、来源谱系、背景捷径和风险覆盖 |
| [自&#8288;然&#8288;语&#8288;言&#8288;处&#8288;理](AI-Domains/NLP/README.md) | [01 文本清洗分词与向量表示](AI-Domains/NLP/01-文本清洗分词与向量表示.md)、[02 分类标注生成与评价](AI-Domains/NLP/02-分类标注生成与评价.md)、[03 检索序列标注与文本分类实践](AI-Domains/NLP/03-检索序列标注与文本分类实践.md)、[04 生成任务数据质量与评价设计](AI-Domains/NLP/04-生成任务数据质量与评价设计.md) | Unicode和分词、向量几何、CRF与实体、检索分类实践、事实引用和生成评价 |
| [大&#8288;语&#8288;言&#8288;模&#8288;型](AI-Domains/LargeLanguageModels/README.md) | [01 分词预训练与语言建模](AI-Domains/LargeLanguageModels/01-分词预训练与语言建模.md)、[02 指令微调偏好学习与 LoRA](AI-Domains/LargeLanguageModels/02-指令微调偏好学习与LoRA.md)、[03 RAG 工具使用与系统评估](AI-Domains/LargeLanguageModels/03-RAG工具使用与系统评估.md)、[04 微调数据设计与训练验收](AI-Domains/LargeLanguageModels/04-微调数据设计与训练验收.md)、[05 RAG系统拆解与评估集构建](AI-Domains/LargeLanguageModels/05-RAG系统拆解与评估集构建.md) | 自回归与后训练、DPO和LoRA、监督数据与完整微调、证据系统和失败归因 |
| [生&#8288;成&#8288;模&#8288;型](AI-Domains/GenerativeModels/README.md) | [01 分布建模与变分自编码器](AI-Domains/GenerativeModels/01-分布建模与变分自编码器.md)、[02 对抗生成与模式覆盖](AI-Domains/GenerativeModels/02-对抗生成与模式覆盖.md)、[03 扩散去噪与采样](AI-Domains/GenerativeModels/03-扩散去噪与采样.md)、[04 自回归模型与归一化流](AI-Domains/GenerativeModels/04-自回归模型与归一化流.md)、[05 生成实验设计与可控性评价](AI-Domains/GenerativeModels/05-生成实验设计与可控性评价.md) | ELBO与重参数化、对抗分布和覆盖、DDPM推导与训练、精确流及评价边界 |
| [图&#8288;机&#8288;器&#8288;学&#8288;习](AI-Domains/GraphMachineLearning/README.md) | [01 图表示消息传递与GCN](AI-Domains/GraphMachineLearning/01-图表示消息传递与GCN.md)、[02 过平滑采样与图评估](AI-Domains/GraphMachineLearning/02-过平滑采样与图评估.md)、[03 GCN手算GraphSAGE与图注意力](AI-Domains/GraphMachineLearning/03-GCN手算GraphSAGE与图注意力.md)、[04 图级任务异质图与评估实践](AI-Domains/GraphMachineLearning/04-图级任务异质图与评估实践.md) | 消息算子与等变、谱和采样、聚合表达力、批图和异质关系及候选评价 |
| [多&#8288;模&#8288;态&#8288;学&#8288;习](AI-Domains/MultimodalLearning/README.md) | [01 模态编码对齐与对比学习](AI-Domains/MultimodalLearning/01-模态编码对齐与对比学习.md)、[02 融合跨模态生成与评估](AI-Domains/MultimodalLearning/02-融合跨模态生成与评估.md)、[03 对比目标跨注意力与训练阶段](AI-Domains/MultimodalLearning/03-对比目标跨注意力与训练阶段.md)、[04 音视频对齐与多模态实验](AI-Domains/MultimodalLearning/04-音视频对齐与多模态实验.md) | 双向对比与多正例、融合条件和梯度、训练阶段、时间测量及音视频实验 |
| [马&#8288;尔&#8288;可&#8288;夫&#8288;决&#8288;策&#8288;过&#8288;程](ReinforcementLearning/MDP/README.md) | [01 状态动作奖励与回报](ReinforcementLearning/MDP/01-状态动作奖励与回报.md)、[02 价值函数Bellman方程与规划](ReinforcementLearning/MDP/02-价值函数Bellman方程与规划.md)、[03 有限状态动态规划完整算例](ReinforcementLearning/MDP/03-有限状态动态规划完整算例.md)、[04 部分可观测与奖励建模边界](ReinforcementLearning/MDP/04-部分可观测与奖励建模边界.md) | 控制充分性与回报、Bellman与规划误差、完整动态规划、信念和奖励边界 |
| [价&#8288;值&#8288;方&#8288;法](ReinforcementLearning/ValueBasedMethods/README.md) | [01 蒙特卡洛TD与动作价值](ReinforcementLearning/ValueBasedMethods/01-蒙特卡洛TD与动作价值.md)、[02 一维导航的表格Q学习](ReinforcementLearning/ValueBasedMethods/02-一维导航的表格Q学习.md)、[03 探索策略多步学习与资格迹](ReinforcementLearning/ValueBasedMethods/03-探索策略多步学习与资格迹.md)、[04 价值学习的评估与失败诊断](ReinforcementLearning/ValueBasedMethods/04-价值学习的评估与失败诊断.md) | MC与TD、SARSA和Q学习、探索多步与资格迹、独立评价及失败诊断 |
| [策&#8288;略&#8288;梯&#8288;度&#8288;与&#8288;A&#8288;c&#8288;t&#8288;o&#8288;r&#8288;-&#8288;C&#8288;r&#8288;i&#8288;t&#8288;i&#8288;c](ReinforcementLearning/PolicyBasedMethods/README.md) | [01 策略梯度与方差控制](ReinforcementLearning/PolicyBasedMethods/01-策略梯度与方差控制.md)、[02 Actor–Critic、优势与 PPO](ReinforcementLearning/PolicyBasedMethods/02-Actor-Critic优势与PPO.md)、[03 从 REINFORCE 到 GAE 的实现细节](ReinforcementLearning/PolicyBasedMethods/03-从REINFORCE到GAE的实现细节.md)、[04 PPO 训练循环与稳定性检查](ReinforcementLearning/PolicyBasedMethods/04-PPO训练循环与稳定性检查.md) | 轨迹似然比与方差、优势及GAE、PPO裁剪边界、完整采样更新和独立评价 |
| [深&#8288;度&#8288;强&#8288;化&#8288;学&#8288;习](ReinforcementLearning/DeepRL/README.md) | [01 DQN经验回放与目标网络](ReinforcementLearning/DeepRL/01-DQN经验回放与目标网络.md)、[02 连续控制奖励设计与实验](ReinforcementLearning/DeepRL/02-连续控制奖励设计与实验.md)、[03 DQN最小训练更新与DoubleDQN](ReinforcementLearning/DeepRL/03-DQN最小训练更新与DoubleDQN.md)、[04 连续控制离线学习与复现协议](ReinforcementLearning/DeepRL/04-连续控制离线学习与复现协议.md) | 神经价值与回放、连续动作梯度、完整DQN、最大熵与离线支持及复现 |
| [贝&#8288;叶&#8288;斯&#8288;计&#8288;算&#8288;与&#8288;近&#8288;似&#8288;推&#8288;断](AdvancedStudies/BayesianComputation/README.md) | [01 变分推断、ELBO 与近似后验](AdvancedStudies/BayesianComputation/01-变分推断ELBO与近似后验.md)、[02 MCMC 不变分布、HMC 与收敛诊断](AdvancedStudies/BayesianComputation/02-MCMC不变分布HMC与收敛诊断.md) | ELBO与均值场、完整变分优化、MH和坐标目标、HMC及有限采样诊断 |
| [自&#8288;监&#8288;督&#8288;表&#8288;示&#8288;学&#8288;习](AdvancedStudies/SelfSupervisedLearning/README.md) | [01 对比目标、InfoNCE 与负样本机制](AdvancedStudies/SelfSupervisedLearning/01-对比目标InfoNCE与负样本机制.md)、[02 表示坍塌、非对比目标与掩码建模](AdvancedStudies/SelfSupervisedLearning/02-表示坍塌非对比目标与掩码建模.md) | InfoNCE与负例机制、队列和完整训练、坍塌反例、非对比及掩码目标 |
| [因&#8288;果&#8288;推&#8288;断&#8288;与&#8288;效&#8288;应&#8288;估&#8288;计](AdvancedStudies/CausalInference/README.md) | [01 潜在结果、因果图与效应识别](AdvancedStudies/CausalInference/01-潜在结果因果图与效应识别.md)、[02 倾向加权、双重稳健与交叉拟合](AdvancedStudies/CausalInference/02-倾向加权双重稳健与交叉拟合.md)、[03 序贯决策、重要性采样与离策略评价](AdvancedStudies/CausalInference/03-序贯决策重要性采样与离策略评价.md) | 潜在结果与识别、调整与前门、双重稳健及交叉拟合、序贯评价与支持 |
| [连&#8288;续&#8288;生&#8288;成&#8288;与&#8288;流&#8288;匹&#8288;配](AdvancedStudies/ContinuousGenerativeModels/README.md) | [01 得分匹配、随机微分方程与概率流](AdvancedStudies/ContinuousGenerativeModels/01-得分匹配随机微分方程与概率流.md)、[02 流匹配、连续性方程与路径选择](AdvancedStudies/ContinuousGenerativeModels/02-流匹配连续性方程与路径选择.md) | 得分与去噪、反向SDE和概率流、条件边缘速度、完整人工训练及求解误差 |
| [高&#8288;效&#8288;训&#8288;练&#8288;与&#8288;推&#8288;理&#8288;系&#8288;统](AdvancedStudies/EfficientModelSystems/README.md) | [01 训练显存分解、分片与重计算](AdvancedStudies/EfficientModelSystems/01-训练显存分解分片与重计算.md)、[02 量化误差、校准与推理瓶颈](AdvancedStudies/EfficientModelSystems/02-量化误差校准与推理瓶颈.md) | 状态所有权与峰值、归约及重计算、量化校准几何、完整训练和速度证据 |
| [不&#8288;确&#8288;定&#8288;性&#8288;与&#8288;分&#8288;布&#8288;鲁&#8288;棒&#8288;性](AdvancedStudies/UncertaintyAndRobustness/README.md) | [01 概率校准、保形预测与覆盖保证](AdvancedStudies/UncertaintyAndRobustness/01-概率校准保形预测与覆盖保证.md)、[02 分布变化、重要性加权与最坏群体风险](AdvancedStudies/UncertaintyAndRobustness/02-分布变化重要性加权与最坏群体风险.md)、[03 选择性预测、拒答与风险覆盖控制](AdvancedStudies/UncertaintyAndRobustness/03-选择性预测拒答与风险覆盖控制.md) | 概率校准与保形排名、分布迁移与群体风险、冻结规则的拒答风险认证 |
| [统&#8288;计&#8288;学&#8288;习&#8288;理&#8288;论](AdvancedStudies/LearningTheory/README.md) | [01 总体风险、一致收敛与模型选择](AdvancedStudies/LearningTheory/01-总体风险一致收敛与模型选择.md)、[02 算法稳定性、插值与隐式偏置](AdvancedStudies/LearningTheory/02-算法稳定性插值与隐式偏置.md)、[03 PAC-Bayes、变分界与随机预测器](AdvancedStudies/LearningTheory/03-PACBayes变分界与随机预测器.md)、[04 局部复杂度、快速率与数据依赖泛化](AdvancedStudies/LearningTheory/04-局部复杂度快速率与数据依赖泛化.md) | 一致收敛、算法稳定性、隐式偏置、PAC-Bayes、有限类快速率与局部化 |

阅读时以先修关系串联章节：学习理论先掌握集中不等式与风险，再学习稳定性、PAC-Bayes 和快速率；Python 对象协议接在函数、类与异常基础之后；监督学习的回归与分类章可与模型评估交叉阅读。具体安排见[学习路线](学习路线.md)。

## 如何阅读

各主题首页章节表中的“深入讲解入口”可以直接进入对应机制或推导。各章连续展开概念、证明、完整例题、方法比较与分层题解；整体覆盖见上方[完整章节索引](#textbook-status)。建议先独立复算，再对照解析，不把看过公式当成已经掌握。

每个主题先看 README 中的先修知识与阅读路径，再进入章节。分类按知识归属组织，文件夹排列不代表必须逐类学完；PyTorch 与神经网络基础可并行，视觉、语言、生成、图、多模态和强化学习按目标选择。

| 阅读层次 | 需要解决的问题 | 建议做法 |
| --- | --- | --- |
| 概念与原理 | 对象是什么，输入输出和符号表示什么 | 先读定义，确认先修知识、轴含义与问题目标 |
| 对应算例与机制 | 结论如何落实为计算，步骤为何这样安排 | 在相关概念之后复算例子，追踪状态、形状与归约 |
| 进阶推导 | 结论在什么条件下成立，方法有何取舍 | 补中间步骤，区分数学性质、实现行为与实验结果 |
| 基础练习与边界追问 | 能否独立应用，改变条件后是否仍成立 | 先作答，再用推导或反例核对解析 |
| 研究与综合练习 | 能否连接多章并设计有效验证 | 按主题或支线验收，固定数据、预算和选择规则 |

初学者先走[基础学习路线](学习路线.md#basic)，进阶推导可以在基础闭环完成后返回；已有基础可从[进阶路线](学习路线.md#advanced)和章内目录进入。基础算例随对应知识安排，练习由应用走向条件判断，再进入研究与综合任务。

代码帮助验证机制，不能替代原理。运行前先说明期望性质，运行后解释输入、输出和关键中间量；前向一致、梯度一致、训练稳定和独立效果改善是不同层次的证据。

## 排版与示例约定

文件统一使用 UTF-8；公式使用 `$...$`、`$$...$$` 数学标记，建议用支持 LaTeX 的 Markdown 阅读器。章节内目录采用显式锚点，文件之间采用相对路径，移动资料时请整体保留目录结构。

Python 完整示例带必要导入与人工或内置数据；SQL、Git、Linux 命令有环境前提，不能在任意终端直接混用。涉及梯度、划分、归约与概率时，按所在章节定义理解符号与系数；环境要求见[运行环境](运行环境.md)。

每个主题保留作者教材、原始论文或官方文档入口。讲义覆盖各主题的核心学习链条；继续深入特定研究问题时，可据参考资料查阅完整理论、实现细节与版本说明。
