# 第 4 章 PPO 训练循环与稳定性检查

[主题目录](README.md) · [分类目录](../README.md) · [总目录](../../README.md) · [上一章](03-从REINFORCE到GAE的实现细节.md)

同一批轨迹被多轮复用时，当前概率会变化，采集时的旧概率却必须保留原身份。本章沿四个策略版本追踪分子、分母、代理目标和 KL，再组装采样、固定目标与多轮优化的完整循环。只看最后一个损失数，无法判断这些对象有没有被悄悄替换。

## 本章目录

- [1. PPO 首先是一套采集和更新协议](#policy-4-detail-1)
  - [1.1 一轮中的三个时间点](#policy-4-detail-2)
  - [1.2 哪些数组必须固定](#policy-4-detail-3)
  - [图解：多轮 PPO 的同一轨迹：旧概率身份与策略漂移](#visual-policybasedmethods-04)
- [2. 从旧轨迹到固定 GAE](#policy-4-detail-4)
  - [2.1 真实终止、期限与外部截断](#policy-4-detail-5)
  - [2.2 回报目标与 actor 权重](#policy-4-detail-6)
  - [2.3 为什么优势不随 epoch 重建](#policy-4-detail-7)
- [3. 实验一：旧概率身份与错误重算](#policy-4-detail-8)
  - [深入图解：旧策略分母必须固定，重算分母会抹掉真实概率比](#visual-insight-policybasedmethods-04)
- [4. 策略裁剪、价值误差与熵分别作用](#policy-4-detail-9)
  - [4.1 策略裁剪的激励](#policy-4-detail-10)
  - [4.2 本章价值与熵配置](#policy-4-detail-11)
  - [4.3 实验二：平坦 actor 仍可被熵改变](#policy-4-detail-12)
- [5. 完整环境与更新预算](#policy-4-detail-13)
  - [5.1 五步三位置链](#policy-4-detail-14)
  - [5.2 优化与监测](#policy-4-detail-15)
  - [5.3 训练、开发和测试](#policy-4-detail-16)
- [6. 实验三：完整 PPO 训练循环](#policy-4-detail-17)
  - [6.1 实际观察](#policy-4-detail-18)
  - [6.2 同一轮里保持了哪些不变量](#policy-4-detail-19)
- [7. 多 epoch 与小批次的细节](#policy-4-detail-20)
  - [7.1 数据复用不是新交互](#policy-4-detail-21)
  - [7.2 固定优势与尺度](#policy-4-detail-22)
  - [7.3 KL 与实际更新](#policy-4-detail-23)
- [8. 稳定性检查与故障注入](#policy-4-detail-24)
  - [8.1 旧策略故障](#policy-4-detail-25)
  - [8.2 价值、熵和边界故障](#policy-4-detail-26)
- [9. 训练基线的复现契约](#policy-4-detail-46)
  - [9.1 扩展任务前要重新核对的条件](#policy-4-detail-47)
- [10. 完整小批次目标的数量关系](#policy-4-detail-48)
  - [10.1 从回合和到展平数组](#policy-4-detail-49)
  - [10.2 三种损失的分母](#policy-4-detail-50)
  - [10.3 随机重排与最后小批](#policy-4-detail-51)
  - [10.4 有效掩码必须同步应用](#policy-4-detail-52)
- [11. 概率比、归一化与 KL](#policy-4-detail-53)
  - [11.1 比率不是互相独立的自由变量](#policy-4-detail-54)
  - [科学图解：裁剪代理目标不等于限制整体距离](#scientific-plate-04)
  - [11.2 一个可手算的完整动作 KL](#policy-4-detail-55)
  - [11.3 方向与状态分布](#policy-4-detail-56)
  - [11.4 更新后检查，而非替代检查](#policy-4-detail-57)
  - [图解算例：动作概率比受到整行归一化约束](#visual-example-policybasedmethods-04)
- [12. 双动作裁剪的完整反例](#policy-4-detail-58)
  - [12.1 所有动作都在场仍有平坦区域](#policy-4-detail-59)
  - [12.2 实验四：同值裁剪与不同分布](#policy-4-detail-60)
  - [12.3 基线平移与裁剪非线性](#policy-4-detail-61)
  - [12.4 熵不是安全约束](#policy-4-detail-62)
- [13. 目标固定与参数耦合](#policy-4-detail-63)
  - [13.1 采集价值和下一值的同版本条件](#policy-4-detail-64)
  - [13.2 分离参数仍可能被全局技巧耦合](#policy-4-detail-65)
    - [参数分离之后，共同裁剪仍会改变 actor](#visual-global-clip-coupling)
  - [13.3 值裁剪的平坦区如何解读](#policy-4-detail-66)
  - [13.4 最佳状态和续训状态](#policy-4-detail-67)
- [14. 结果、预算与进一步研究](#policy-4-detail-68)
  - [14.1 实际结果的证据范围](#policy-4-detail-69)
  - [14.2 预算匹配的比较](#policy-4-detail-70)
  - [14.3 稳定技巧的消融](#policy-4-detail-71)
  - [14.4 失败的分层定位](#policy-4-detail-72)
- [15. 把一次完整更新算清楚](#policy-4-detail-73)
  - [15.1 动作重要性比不能自动更换状态分布](#policy-4-detail-74)
  - [15.2 用两个不等长回合核对所有求和](#policy-4-detail-75)
  - [15.3 为什么固定优势仍允许当前价值学习](#policy-4-detail-76)
  - [15.4 梯度裁剪与概率裁剪作用于不同对象](#policy-4-detail-77)
  - [15.5 评价策略是否采样也属于问题定义](#policy-4-detail-78)
  - [15.6 从断言到研究证据的层级](#policy-4-detail-79)
- [16. 进一步的综合题与详解](#policy-4-detail-80)
  - [16.1 题十七：同一目标数字为何不代表同一策略](#policy-4-detail-81)
  - [16.2 题十八：遗漏回合尺度后如何比较](#policy-4-detail-82)
  - [16.3 题十九：测试回合很多能否替代训练重复](#policy-4-detail-83)
  - [16.4 题二十：如何确认早停收益而非只确认早停代码](#policy-4-detail-84)
- [参考资料](#policy-4-detail-85)

<a id="policy-4-detail-1"></a>

<a id="sec-1"></a>

## 1. PPO 首先是一套采集和更新协议

PPO 不只是一行最小值公式，而是策略采样、行为概率保存、优势构造、多个 epoch 更新、策略变化监测和重新采集共同组成的程序。如果旧概率随更新漂移、优势在 epoch 中无声重算，或采样动作与评分动作不同，即使代码含有裁剪，也不再是声明的替代目标。

本章在上一章同类五步人工链上运行完整 CPU 训练。它没有使用 Gym、预训练模型或外部数据，所有状态都在内存中。表格策略让我们能追踪每个时间和位置的动作概率，分离 actor 与 critic 避免隐藏共享路径。真实大环境需要额外感知、规模和资源证据，不能由本章回报直接外推。

<a id="policy-4-detail-2"></a>

### 1.1 一轮中的三个时间点

第一时间点是采集：策略按当前参数与环境交互，记录实际动作的 log 概率和当时价值。第二时间点是目标构造：固定这批数据计算 GAE 和 critic 目标。第三时间点是更新：当前策略反复重新评分旧动作，分子变化，旧分母和优势保持不变。几个对象虽然来自同一模型结构，却有不同身份。

更新结束后要用新策略重新收集，下一轮旧概率身份随之刷新。不能把同一份数据永久反复训练而仍称作持续 on-policy 采集，也不能为了让比率接近一在每个小批重置旧分母。完整循环应该能够从一个样本追到对应行为版本。

<a id="sec-1-1"></a>

<a id="policy-4-detail-3"></a>

### 1.2 哪些数组必须固定

本轮的状态、动作、奖励、有效性、旧 log 概率、旧价值、优势与价值目标都来自采集和构造阶段。当前 log 概率、当前价值和当前熵则每次更新重算。保存旧数值通常要分离计算图并独立复制，避免原地修改或共享存储改变所谓快照。只是给变量起 old 名字不提供任何保证。

如果策略有随机层、动作温度、合法掩码或连续动作变换，行为 log 概率必须对应真实采样分布。当前评分应使用同一输入和动作定义，不能换模板、精度路径或动作后处理却继续沿用原分母。概率比描述的是同一个事件在两分布下的比值。

<a id="visual-policybasedmethods-04"></a>

### 图解：多轮 PPO 的同一轨迹：旧概率身份与策略漂移

![复用旧轨迹时当前概率可变，分母必须读取采样时概率](images/04-img-ppo-behavior-snapshot.webp)

[打开原图放大](images/04-img-ppo-behavior-snapshot.webp)

**读图。** 四列是同一批数据被复用时的四个构造策略状态，不是训练实测曲线。采样时动作一的概率固定为 0.5，之后新概率依次为 0.5、0.6、0.7、0.8；另一动作的概率相应为 0.5、0.4、0.3、0.2。正确比率始终用采样时的同一个分母，依次为一、1.2、1.4、1.6。如果每轮用当前网络重算分母，四列都会错误地显示一。

取这个样本的固定优势为一、裁剪幅度为 0.2，代理目标在第二列达到 1.2 后进入平台；完整动作分布的旧到新 KL 却继续增为约 0.0204、0.0872、0.2231。KL 是枚举两个动作并按旧概率加权的精确值，不能只用采到动作的某一个对数比替代。

表的前两行分开记录当前网络与采集快照。每次重新评分只改变分子。两个相邻版本之间可能经过多个小批次更新，表中列的是四个策略状态。上文的裁剪目标针对固定优势样本，而 KL 使用该状态的完整动作分布。

还可以用相邻版本的比率检查“错误滚动分母”为何隐藏累计漂移。如果依次把上一列当作新旧策略，三个比率只显示 $`\frac{0.6}{0.5}=1.2`$、$`\frac{0.7}{0.6}=\frac76`$、$`\frac{0.8}{0.7}=\frac87`$，后两项甚至低于上阈值 1.2；但相对真正行为分布的累计比率已经是 1.4、1.6。若每列直接用当前概率的分离值作分母，比率还会全部成为一。前者忘记累计偏移，后者直接抹去采集身份，都不能继续当作原固定数据 PPO 目标。第 3 节的分母实验将进一步区分“错误比率为一但仍有梯度”和“分子分母梯度完全抵消”。

这个算例说明代理目标进入平台后，整个策略仍可能继续变化：其他样本、熵项或共享参数都可能推动更新。多轮复用需要保存对应状态与动作的旧 log 概率，并核对策略身份、数据批次、固定优势、目标值与终止边界；这些要求与 [PPO 原论文算法 1](https://arxiv.org/pdf/1707.06347) 的采样—多轮优化区分一致。

<a id="sec-2"></a>

<a id="policy-4-detail-4"></a>

## 2. 从旧轨迹到固定 GAE

<a id="policy-4-detail-5"></a>

### 2.1 真实终止、期限与外部截断

本章任务最多五次决策，抵达目标或到期后都无未来奖励，因此下一价值为零、迹递推也结束。它没有外部窗口截断，也不在采集途中自动重置。若迁移到持续环境，需要保留真实最终观察，并让自举与迹连接使用不同条件，不能仅复制本章的结束标志。

有效掩码记录动作前仍在回合内，终止标志记录动作后是否结束。成功动作本身仍计奖励和 log 概率，后续填充才屏蔽。代码保持已结束样本的位置和零奖励，即使向量化仍抽取无用动作，也不会修改其真实轨迹。字段时序必须能被手算重建。

<a id="sec-2-1"></a>

<a id="policy-4-detail-6"></a>

### 2.2 回报目标与 actor 权重

GAE 使用本轮采集时价值和真实下一值，折扣零点九五、迹参数零点九。优势加旧价值形成 critic 自举目标，二者在全部 epoch 中固定。它不是每条轨迹的纯 Monte Carlo 回报，名称与尺度应准确。当前代码不对优势做中心化或标准化，减少额外随机变换，便于和前章约定核对。

Actor 采用起始折扣目标的时间权重。将有效时间步展平后，完整目标按本轮回合数归约；小批次均值乘有效总步数除回合数，保持固定参数、均匀抽样下的相应尺度。Critic 则按有效样本平均平方误差。两者分母不同，是因为估计对象不同，不应都简写成同一个 mean。

<a id="deep-dive-2"></a>

<a id="policy-4-detail-7"></a>

### 2.3 为什么优势不随 epoch 重建

固定优势让每个 epoch 优化同一批旧策略替代目标。若 critic 更新后立即重建，后面的 actor 看到不同权重，已成为另一套交替算法。某些方法可以这样做，但应单独分析，不是对原 PPO 完全无影响的实现优化。旧价值也用于界定目标身份，不只是为了节省计算。

当前策略变化后，旧优势不再是真实新策略优势，这是局部替代的近似来源之一。裁剪试图限制某些过大有利变化，但不消除全部状态分布与估计误差。应通过新交互和独立回报评价，而不是只追求固定数据目标更高。

<a id="policy-4-detail-8"></a>

## 3. 实验一：旧概率身份与错误重算

一个二元策略先保存旧动作 log 概率，再明确改变参数。正确比率会反映变化；若把当前分离值每次当 old，数值总回到一；若两端都是同一个未分离表达，还会完全抵消梯度。三个版本可有相同矩阵形状，却代表不同算法。

```python
import math
import torch
torch.set_num_threads(1)
dtype = torch.float64
initial = torch.tensor([.2,-.3],dtype=dtype)
oldlog = initial.log_softmax(0)[1].detach().clone()
theta = torch.nn.Parameter(initial.clone())
with torch.no_grad():theta.add_(torch.tensor([-.2,.4],dtype=dtype))
newlog = theta.log_softmax(0)[1]
ratio = (newlog-oldlog).exp()
wrong_detached = (newlog-newlog.detach()).exp()
wrong_shared = (newlog-newlog).exp()
assert ratio.item()>1.3 and wrong_detached.item()==1 and wrong_shared.item()==1
correct_obj = torch.minimum(ratio,ratio.clamp(.8,1.2))
bad_obj = torch.minimum(wrong_detached,wrong_detached.clamp(.8,1.2))
good_grad, = torch.autograd.grad(correct_obj,theta,retain_graph=True)
bad_grad, = torch.autograd.grad(bad_obj,theta,retain_graph=True)
shared_grad, = torch.autograd.grad(wrong_shared,theta)
assert torch.equal(good_grad,torch.zeros_like(theta))
assert bad_grad.abs().sum()>0 and torch.equal(shared_grad,torch.zeros_like(theta))
assert torch.equal(oldlog,initial.log_softmax(0)[1])
# 早停在检查之后阻止未来epoch，不自动撤回刚结束的epoch。
used,state = 0,0
for measured in [.01,.04,.05]:
    state += 1;used += 1
    if measured>.03:break
assert used==2 and state==2
print('correct/current-as-old ratio',ratio.item(),wrong_detached.item())
print('good/bad/shared gradients',good_grad.tolist(),bad_grad.tolist(),shared_grad.tolist())
```

这个例子也说明比率等于一不能单独证明实现正确。收集刚结束、尚未更新时，正确比率应全部接近一；更新之后一直一则值得调查。应同时检查固定分母、当前分子和梯度，不能仅打印一个比例就宣布旧策略恢复正确。

<a id="visual-insight-policybasedmethods-04"></a>

### 深入图解：旧策略分母必须固定，重算分母会抹掉真实概率比

![保存旧概率、分离当前概率和使用带梯度当前概率产生不同结果](images/04-img-fixed-denominator-and-stop-gradient.webp)

[打开原图放大](images/04-img-fixed-denominator-and-stop-gradient.webp)

**分离当前概率只改变本次反向计算。** 在当前概率为零点八时，分离值在这次求导中当成常数。下一次前向会重新读取当前概率。表中前向比率相同的两种错误做法，在这一点给出的梯度不同。

图把同一动作的旧行为概率固定为 $`0.5`$、当前概率固定为 $`p=\sigma(\theta)=0.8`$，并取正优势一、裁剪宽度 $`0.2`$。这是便于手算的独立参数点；实验一采用另外的两 logit 初值，检验的是同一机制。第一行使用保存的旧概率，得到比率 $`1.6`$，最大化目标 $`\min(1.6,1.2)=1.2`$；该样本已进入有利变化平台，故对 $`\theta`$ 的局部导数为零。

第二行每次把当前概率的分离值当成旧概率，前向比率为一，但当前这一点的分母在求导时被当成常数。因此 $`\frac{\partial r}{\partial\theta}=\frac{p(1-p)}{\mathrm{stop}(p)}=1-p=0.2`$，且比率一位于未裁剪分支，actor 仍继续推高该动作。第三行把分子分母写成完全相同、都带梯度的表达，$`r=\frac{p(\theta)}{p(\theta)}=1`$，两条导数相消，策略信号则被删除。相同的前向比率一，对应不同的错误梯度。

这里 $`g`$ 表示**最大化**替代目标的导数；若代码最小化负目标，梯度符号相反。图中的零梯度也不等于整个优化器不动，其他样本、熵项和历史动量仍可能改变参数。验收必须联合检查“采样后比率为一”“更新后分子会变”“保存的旧分母不变”和实际梯度，而不能只看比例数值是否平稳。

<a id="sec-3"></a>

<a id="policy-4-detail-9"></a>

## 4. 策略裁剪、价值误差与熵分别作用

<a id="policy-4-detail-10"></a>

### 4.1 策略裁剪的激励

正优势在比率过高时停止获得额外收益，负优势在比率过低时停止获得额外收益；不利方向仍保留修正梯度。这个最小值目标不是把策略参数或概率投影进一个集合。其他样本、熵和优化器状态仍可改变已进入平坦区的动作概率，完整更新后必须重新测量。

比率是无量纲相对量，价值误差是奖励单位，熵是动作分布信息量。三者不能用同一个宽度或系数想当然替代。奖励缩放会改变价值和优势尺度，却不直接改变比率区间；完整算法还受优化器与辅助系数影响。报告具体表达式，比只说用了 PPO 更有用。

<a id="policy-4-detail-11"></a>

### 4.2 本章价值与熵配置

完整循环使用普通固定目标均方误差，不采用价值变化裁剪。熵按当前离散动作全分布精确求和，在采样旧状态上作为局部正则加入，系数零点零零五。它不是通过单个旧动作负 log 概率估算新熵，也不宣称等价于任意完整熵回报目标的全部导数。

Actor 和 Critic 参数表分开，所以价值项不直接改变策略；熵项仍会在 actor 裁剪平坦时推动概率。若改共享主干，需要重新核对价值梯度的策略影响。当前选择是为了清楚隔离机制，而不是证明所有任务应该使用相同结构或系数。

<a id="policy-4-detail-12"></a>

### 4.3 实验二：平坦 actor 仍可被熵改变

构造选一概率零点八、旧概率零点四，正优势比率为二，裁剪 actor 项已平坦。加入熵后梯度不再为零。再用一个可选值裁剪公式展示当前预测可以超出旧值宽度，目标也可能平坦，因此价值裁剪同样不是硬投影。本章完整训练并未使用这项可选表达。

```python
import math
import torch
torch.set_num_threads(1)
dtype = torch.float64
theta = torch.tensor(math.log(4),dtype=dtype,requires_grad=True)
p = theta.sigmoid();ratio = p/.4
actor = -torch.minimum(ratio,ratio.clamp(.8,1.2))
entropy = -p*p.log()-(1-p)*(1-p).log()
actor_gradient, = torch.autograd.grad(actor,theta,retain_graph=True)
total_gradient, = torch.autograd.grad(actor-.1*entropy,theta)
assert actor_gradient.item()==0 and total_gradient.item()>0
value = torch.tensor(1.,dtype=dtype,requires_grad=True)
old,target,width = 0.,2.,.2
bounded = old+(value-old).clamp(-width,width)
raw = .5*(value-target)**2
optional = torch.maximum(raw,.5*(bounded-target)**2)
gradient, = torch.autograd.grad(optional,value)
assert value.item()>old+width and gradient.item()==0
assert abs(optional.item()-1.62)<1e-12
print('flat_actor/with_entropy_gradient',actor_gradient.item(),total_gradient.item())
print('optional_value_loss/current_value/gradient',optional.item(),value.item(),gradient.item())
```

熵系数、价值目标和裁剪形式都是算法配置，不能省略后宣称与另一实现完全相同。局部梯度示例只说明结构性质，不能证明熵总有益或值裁剪总有害。实际选择需要在共同任务与预算下评价完整训练结果。

<a id="policy-4-detail-13"></a>

## 5. 完整环境与更新预算

<a id="policy-4-detail-14"></a>

### 5.1 五步三位置链

初始位置零，目标位置二。左右动作有零点一概率翻转，抵达目标奖励一并结束，其他有效步成本负零点零二，最多五次决策。时间和位置共同索引策略与价值。环境完全可观测、奖励有界，没有感知模型、长记忆或真实机器人动力学。

采集每轮一百二十八回合，共八十轮，初始 actor 与 critic 全零。每轮固定优势后最多四个 epoch，使用随机无放回小批次，每批最多一百二十八个有效时间步。每个 epoch 都遍历当轮有效数据，但当前参数在小批之间变化，因此不是一次全批梯度的精确复制。

<a id="policy-4-detail-15"></a>

### 5.2 优化与监测

使用 Adam，actor 与 critic 分别有明确学习率，合并目标是裁剪 actor 损失加价值误差再减熵奖励。没有优势标准化、值裁剪或梯度范数裁剪；只断言梯度有限，避免隐藏稳定技巧。若新增这些功能，应在正文和配置中说明，并重新检验目标与尺度。

每个 epoch 后在完整旧数据上估计旧到新 KL，超过零点零三就停止后续 epoch，不回滚已经发生的更新。这个监测是经验平均，不是所有状态硬界。本次运行没有触发早停，全部执行四个 epoch，不能把一个存在的分支写成已经在实际训练中发挥保护作用。

<a id="policy-4-detail-16"></a>

### 5.3 训练、开发和测试

训练随机流用于策略与环境交互，另一个流用于小批重排。每十轮用固定独立开发流评估五百一十二回合，保存最好 actor 与 critic 副本。八十轮后恢复所选状态，再用另一独立流评价四千零九十六回合。初始参考使用单独回合，只描述起点。

所有评价仍来自同一人工机制，不是新环境泛化。开发反复选点会有适应性，最终测试不能继续指导调参。只运行一个训练种子，不作稳定性或显著优越性结论；第四章的目标是把完整协议与机制连起来，而不是做算法排行榜。

<a id="sec-4"></a>

<a id="policy-4-detail-17"></a>

## 6. 实验三：完整 PPO 训练循环

以下独立代码包含环境、收集、旧概率、GAE、多 epoch、小批次、KL 监测、选点与测试。所有数组和检查点只在内存中，没有文件下载或模型保存。代码既检查初始比率为一，也检查 epoch 后旧数值不变，防止只依赖训练结果猜测协议正确。

```python
import torch
from torch import nn

torch.set_num_threads(1)
dtype = torch.float64
H,gamma,lam = 5,.95,.9
def collect(actor,critic,n,policy_seed,environment_seed):
    pg = torch.Generator().manual_seed(policy_seed)
    eg = torch.Generator().manual_seed(environment_seed)
    pos = torch.zeros(n,dtype=torch.long)
    alive = torch.ones(n,dtype=torch.bool)
    rows = []
    with torch.no_grad():
        for t in range(H):
            state = pos.clone()
            log_all = actor[t,state].log_softmax(-1)
            action = torch.multinomial(log_all.exp(),1,generator=pg).squeeze(1)
            oldlog = log_all.gather(1,action[:,None]).squeeze(1)
            oldvalue = critic[t,state]
            flip = torch.rand(n,generator=eg)<.1
            executed = torch.logical_xor(action.bool(),flip).long()
            proposed = (pos+2*executed-1).clamp(0,2)
            next_pos = torch.where(alive,proposed,pos)
            reached = alive & next_pos.eq(2)
            reward = torch.where(reached,torch.ones(n,dtype=dtype),
                torch.where(alive,torch.full((n,),-.02,dtype=dtype),torch.zeros(n,dtype=dtype)))
            ended = ~alive | reached | (t==H-1)
            rows.append((state,action,reward,alive.clone(),ended,next_pos.clone(),oldlog.clone(),oldvalue.clone()))
            alive = alive & ~ended
            pos = next_pos
    data = tuple(torch.stack([row[k] for row in rows]) for k in range(8))
    returns = (data[2]*gamma**torch.arange(H,dtype=dtype)[:,None]).sum(0)
    return data,returns,pos.eq(2)
actor = nn.Parameter(torch.zeros(H,3,2,dtype=dtype))
critic = nn.Parameter(torch.zeros(H+1,3,dtype=dtype))
optimizer = torch.optim.Adam([{'params':[actor],'lr':.025},{'params':[critic],'lr':.04}])
shuffle = torch.Generator().manual_seed(515)
best,best_round,state = -float('inf'),None,None
epoch_counts = []
initial = collect(actor,critic,1024,610,611)[1].mean().item()
for update in range(1,81):
    data,_,_ = collect(actor,critic,128,3000+2*update,3001+2*update)
    states,actions,rewards,valid,ended,next_states,oldlogs,oldvalues = data
    times = torch.arange(H)[:,None].expand_as(states)
    with torch.no_grad():
        nextv = critic[times+1,next_states]
        delta = (rewards+gamma*(~ended)*nextv-oldvalues)*valid
        advantages = torch.zeros_like(delta)
        carry = torch.zeros(128,dtype=dtype)
        for t in range(H-1,-1,-1):
            carry = (delta[t]+gamma*lam*(~ended[t])*carry)*valid[t]
            advantages[t] = carry
        targets = advantages+oldvalues
    chosen = valid.reshape(-1)
    tt,ss,aa = times.reshape(-1)[chosen],states.reshape(-1)[chosen],actions.reshape(-1)[chosen]
    old = oldlogs.reshape(-1)[chosen].detach().clone()
    oldv = oldvalues.reshape(-1)[chosen].detach().clone()
    advantage = advantages.reshape(-1)[chosen].detach().clone()
    target = targets.reshape(-1)[chosen].detach().clone()
    weights = gamma**tt.to(dtype)
    M = len(old)
    old_copy,target_copy,oldv_copy = old.clone(),target.clone(),oldv.clone()
    with torch.no_grad():
        current = actor[tt,ss].log_softmax(-1).gather(1,aa[:,None]).squeeze(1)
        assert torch.allclose((current-old).exp(),torch.ones_like(old))
    used = 0
    for epoch in range(4):
        order = torch.randperm(M,generator=shuffle)
        for start in range(0,M,128):
            ix = order[start:start+128]
            log_all = actor[tt[ix],ss[ix]].log_softmax(-1)
            logp = log_all.gather(1,aa[ix,None]).squeeze(1)
            ratio = (logp-old[ix]).exp()
            surrogate = torch.minimum(ratio*advantage[ix],ratio.clamp(.8,1.2)*advantage[ix])
            actor_loss = -(weights[ix]*surrogate).mean()*(M/128)
            prediction = critic[tt[ix],ss[ix]]
            value_loss = .5*(prediction-target[ix]).square().mean()
            entropy = (-(log_all.exp()*log_all).sum(1)*weights[ix]).mean()*(M/128)
            loss = actor_loss+value_loss-.005*entropy
            optimizer.zero_grad();loss.backward()
            assert torch.isfinite(actor.grad).all() and torch.isfinite(critic.grad).all()
            optimizer.step()
        used = epoch+1
        with torch.no_grad():
            newlog = actor[tt,ss].log_softmax(-1).gather(1,aa[:,None]).squeeze(1)
            logratio = newlog-old
            kl = (logratio.exp()-1-logratio).mean().item()
        if kl>.03:break
    epoch_counts.append(used)
    assert torch.equal(old,old_copy) and torch.equal(target,target_copy) and torch.equal(oldv,oldv_copy)
    if update%10==0:
        dev = collect(actor,critic,512,8000,8001)[1].mean().item()
        if dev>best:
            best,best_round = dev,update
            state = (actor.detach().clone(),critic.detach().clone())
with torch.no_grad():
    actor.copy_(state[0]);critic.copy_(state[1])
_,test_return,success = collect(actor,critic,4096,9000,9001)
assert max(epoch_counts)>=2
assert test_return.mean().item()>initial+.25
assert success.double().mean().item()>.9
assert torch.equal(critic[-1],torch.zeros_like(critic[-1]))
print({'initial_reference':initial,'selected_dev':best,'selected_round':best_round,
       'test_return':test_return.mean().item(),'test_success':success.double().mean().item(),
       'epoch_range':[min(epoch_counts),max(epoch_counts)],
       'mean_epochs':sum(epoch_counts)/len(epoch_counts)})

```

<a id="policy-4-detail-18"></a>

### 6.1 实际观察

初始参考折扣回报约零点四六八一五，开发选中第五十轮，开发回报约零点八九六九四。独立测试回报约零点八九一九四，成功率约百分之九十八点三二。每轮实际 epoch 都为四，经验 KL 早停未触发。旧 log 概率、旧值和目标快照保持一致，所有梯度有限，终端价值行零不变。

与前章单次 REINFORCE 和 GAE 的结果接近，但训练预算、随机流和更新程序不同，不能据此给出公平优劣排名。已知小环境的最优折扣参照约零点八九八三二二，当前随机策略接近而未证明精确最优。测试抽样和单次训练限制都需要保留。

<a id="policy-4-detail-19"></a>

### 6.2 同一轮里保持了哪些不变量

采样后尚未更新时，当前动作 log 概率与记录一致，比率为一；每个 epoch 后旧分母、旧值与目标逐张量完全不变。来源状态与动作固定，重新评分只改变当前网络输出。有效数据展平后保留时间索引，使起始折扣权重仍正确。终止与填充不会因展平消失。

这些检查说明当前程序与声明公式一致，不说明环境目标本身合理或复杂任务可靠。若奖励代理有漏洞，PPO 仍会优化漏洞；若观察不足，概率裁剪也不会创造缺失信息。完整算法正确性应放在任务定义与评价边界之内理解。

<a id="sec-5"></a>

<a id="policy-4-detail-20"></a>

## 7. 多 epoch 与小批次的细节

<a id="policy-4-detail-21"></a>

### 7.1 数据复用不是新交互

同一轮四个 epoch 重复使用相同旧轨迹，增加优化次数而不是增加独立环境证据。参数离旧策略越远，替代近似越值得关注。重新收集会刷新状态访问，不能靠持续重排永久替代。报告同时给环境回合、时间步和优化器步数，才看得见真实成本。

不同回合长度使有效步总数变化，小批次最后一批也可能更小。使用均值是一个优化约定，不能声称整轮多次更新与一次全批求和完全等价。若研究严格梯度累积，应按样本数加权后在同一参数点一次更新；本章采用常见随机优化过程，明确保留这一区别。

<a id="policy-4-detail-22"></a>

### 7.2 固定优势与尺度

优势不标准化让本章更容易对应相对回报与基线；这不是说标准化没有价值。若加入，需要说明按整个 rollout 还是每个小批计算，是否排除填充，如何处理零方差，以及怎样影响优势符号与裁剪支路。它属于算法变体，应通过共同评价检验。

同一奖励缩放可能改变 Adam 的数值、价值误差与熵相对权重。不能只因 actor 比率裁剪无量纲，就认定完整训练对奖励尺度完全不变。每个目标都有自己的单位与分母，整体配置才定义执行算法。

<a id="policy-4-detail-23"></a>

### 7.3 KL 与实际更新

当前经验 KL 公式在旧策略动作样本上计算，依赖支持与正确旧概率。它不会约束所有状态，也不直接测任务回报。一次超阈值后停止下一 epoch，没有撤回当前更新；若想回退，需要保存更新前状态并明确恢复优化器等对象。早停和回滚是不同机制。

如果测试中 KL 突增，应先查旧分母漂移、log 概率事件不一致、优势尺度和步长，再考虑降低阈值。只加更多监测不能修复错误目标。好的诊断要能从异常量追到具体数据和参数变化。

<a id="sec-6"></a>

<a id="policy-4-detail-24"></a>

## 8. 稳定性检查与故障注入

<a id="policy-4-detail-25"></a>

### 8.1 旧策略故障

故意把 old 指向当前输出，实验一能发现比率无变化或梯度消失。故意在训练中覆盖旧张量，快照相等断言应失败。若仅凭最后回报能上升，某些错误也可能被简单任务掩盖，因此机制断言比成功曲线更有明确判据。

还可以打乱动作却不打乱旧 log 概率，初始比率通常不再全一；但对称均匀策略可能暂时掩盖，所以应加入非均匀固定策略例子。测试设计应破坏可能隐藏错误的对称性，不能只在全零初始化下核对接口。

<a id="sec-6-1"></a>

<a id="policy-4-detail-26"></a>

### 8.2 价值、熵和边界故障

让目标继续带梯度、把终止后值设非零、把无效填充加入优势统计，都可能产生正常数值却改变目标。可以先在固定数组上故障注入，再检查完整训练是否触发预期断言。梯度有限只是底线，不证明梯度对应正确目标。

熵若只用旧动作负 log 概率替代当前全分布，更新后估计对象不同；值裁剪若误以为硬约束，也可能导致错误解释。每个模块先独立核对，再合并，能让复杂循环仍然透明。前两段机制实验正是完整训练的可追溯基础。

<a id="sec-8"></a>

<a id="policy-4-detail-46"></a>

## 9. 训练基线的复现契约

PPO 实验记录应包含完整代码、有效配置、实际结果与限制，使独立读者能重算目标、检查旧策略概率并重建评价。本章实验全部在内存中完成。从有限任务走向真实系统时，还应重新验证观察定义、动作约束、模型身份、资源预算与评价协议；有限人工任务上的高回报，只支持对应任务和预算下的结论。

<a id="sec-8-1"></a>

<a id="policy-4-detail-47"></a>

### 9.1 扩展任务前要重新核对的条件

若换用新动力学、部分观测或更长时域，先重新定义状态、终止和评价单位，再判断原结论能否迁移。接下来仍使用同一个基线。第 10 节把损失落到小批次的分母，第 11 节检查完整动作分布上的概率比和 KL，第 12 节给出裁剪平坦区的反例。

<a id="policy-4-detail-48"></a>

## 10. 完整小批次目标的数量关系

<a id="policy-4-detail-49"></a>

### 10.1 从回合和到展平数组

设本轮回合数为 $`N`$，有效时间步数为 $`M`$。Actor 完整替代损失是所有有效时间位置的折扣裁剪项求和后除以 $`N`$，不是除以 $`M`$。从展平数组均匀抽一个小批次，以小批均值乘 $`\frac{M}{N}`$，在固定参数与固定数据下可以恢复对应完整目标的期望尺度。代码中的一百二十八分母是回合数，不是永远等于小批长度。

例如每轮平均每回合三步，则 $`\frac{M}{N}`$ 约三。展平均值若直接用于 actor，会少这一尺度；固定当前批可能像学习率差异，但与熵、值项和随机长度结合后不能未经说明视作同一程序。保留原始时间索引又使每项乘正确的起始折扣，展平本身不应改变任务定义。

<a id="policy-4-detail-50"></a>

### 10.2 三种损失的分母

本章价值误差对有效时间步平均，熵正则则与 actor 使用相同时间权重和回合尺度。总损失写成裁剪 actor、固定目标价值误差和局部熵三部分，各自有明确单位。它不是一个所有轴都取平均的通用函数。修改其中一处分母，会改变相对梯度与优化器路径。

若希望按随机有效状态而非随机初始回合定义 actor 代理，可以采用另一归约；关键是准确描述。相同数据能支持多个合理目标，但它们回答不同问题。不要在看到效果后才挑有利解释，应该在实现前写清目标，再让代码中的每个求和与除法对应它。

<a id="policy-4-detail-51"></a>

### 10.3 随机重排与最后小批

每个 epoch 用一个随机排列覆盖全部有效样本，没有放回重复。最后一批可能少于一百二十八，仍按本批均值计算当前优化步。多个小批之间参数已变化，所以整轮更新不等于固定同一参数求所有梯度再一次更新；Adam 的动量与二阶矩也在每步更新，顺序会产生影响。

如果需要精确比较全批与累积，可以冻结参数点，按各小批样本数加权累积梯度后只执行一次优化器。那是另一个更新安排，计算图、内存和策略步数都不同。本章不声称二者等价，只明确采用哪一种。方法研究应把优化器步数也计入预算，不能只统计看过几次数据。

<a id="policy-4-detail-52"></a>

### 10.4 有效掩码必须同步应用

展平时，对时间、状态、动作、旧概率、优势、目标和旧值使用同一有效索引。只筛某个数组会造成身份错配，形状可能仍能广播，因此应主动断言长度和索引一致。终止动作保留，后续填充排除；时间折扣也取自被保留的真实时间，而不是展平后的行号。

可以给每条有效记录临时附回合与时间身份，在小夹具里检查重排后所有字段仍绑定。正式训练不必保留多余展示字段，但协议应可解释。数据对齐错误往往比优化公式更容易发生，也更容易被简单任务的训练上升掩盖。

<a id="policy-4-detail-53"></a>

## 11. 概率比、归一化与 KL

<a id="policy-4-detail-54"></a>

### 11.1 比率不是互相独立的自由变量

给定同一状态，所有动作的新概率必须归一化，因此旧策略加权的完整比率期望为一，前提是支持条件相符。一个动作比率增大，其他动作质量会相应变化。前章逐样本导数把比率暂作独立变量只是局部分析，实际 softmax 参数同时影响整行概率。

<a id="scientific-plate-04"></a>

![动作 A 概率不变，另两个动作概率互换后完整 KL 增大](images/04-img-single-action-ratio-and-full-kl.webp)

[打开原图放大](images/04-img-single-action-ratio-and-full-kl.webp)

表中两组分布的动作 A 概率都为零点二，所以该动作的概率比是一。动作 B、C 的概率互换，完整旧到新 KL 约为一点八九六。单个已采样动作的比率可以保持不变，整组分布仍有明显变化。

旧概率很小的动作可以获得很大比率，而总概率仍合法。例如旧质量百分之一变为一成，比率十；其他动作的比率只略低于一。有限采样可能很少看到该稀有动作，监测覆盖受到限制。反过来，单个大比率也不自动代表整体任务失败，应结合概率质量、状态与回报分析。

<a id="policy-4-detail-55"></a>

### 11.2 一个可手算的完整动作 KL

旧二元概率各半，新概率零点六和零点四，旧到新 KL 为二分之一乘两个 log 比率之和，等于负二分之一乘 $`\log0.96`$，约零点零二零四一。用完整旧动作权重计算比率减一再减 log 比率，也得到同一值，因为比率线性项期望抵消。

样本上的旧 log 减新 log 可能因抽样偏向某动作而为负，这不推翻总体 KL 非负；非负形式逐项不小于零，但仍是有限样本估计。哪个更适合作为诊断取决于方差、稳定性与协议，必须写公式。对于很小的 log 比率，指数减一再减原数可能有消减误差，可使用稳定实现并检查数值范围。

<a id="policy-4-detail-56"></a>

### 11.3 方向与状态分布

旧到新和新到旧 KL 一般不同，采样分布也不同。当前代码在旧状态、旧动作样本上计算相应旧到新估计，不是新访问下的平均，更不是所有状态最大。理论约束如果要求最大状态变化，需要额外覆盖与证明，不能由字段名叫 KL 就满足。

若动作合法集改变或新策略把某个旧可能动作概率设零，旧到新 KL 可发散；反向方向又有不同支持条件。有限 softmax 常保持正概率，但数值下溢、硬掩码和动作后处理会改变实际支持。应该从真实行为分布出发，而不是只看模型输出是否有限。

<a id="policy-4-detail-57"></a>

### 11.4 更新后检查，而非替代检查

初始比率全一验证采样身份，更新后比率与 KL 验证实际变化，旧快照断言验证存储身份，三者互补。只做其中一个无法覆盖其他错误。比如分母每步重算可以让初始和后续都一，却失去旧行为；只保存快照但动作错位，也会评分另一个事件。

监测频率也有作用。每 epoch 检查不能防止某个中间小批已经造成很大变化，只能在检查后停止未来步骤。若任务需要更细限制，可以更频繁监测或回退，但增加计算并改变算法。报告应把实际执行与设计动机分开，尤其本次规则没有触发。

<a id="visual-example-policybasedmethods-04"></a>

### 图解算例：动作概率比受到整行归一化约束

![裁剪目标处在同一平台时，完整动作分布的 KL 可以差很多](images/04-img-full-distribution-clip-counterexample.webp)

[打开原图放大](images/04-img-full-distribution-clip-counterexample.webp)

固定一个状态、两个动作，旧策略各给概率二分之一，优势分别为正一、负一。令新策略对**正优势动作**给概率 $`x`$，两动作概率比分别为 $`2x,2(1-x)`$。两项共同参与代理目标。裁剪区间只规定代理目标如何计算。

按旧策略对两个动作各加权二分之一。未裁剪代理为 $`2x-1`$；裁剪代理在 $`x\ge0.6`$ 时等于 $`0.2`$，继续提高 $`x`$ 不再改善这一固定优势目标。完整分布距离为：
```math
D_{\mathrm{KL}}(\pi_{\mathrm{old}}\Vert\pi_x)=-\frac12\log\bigl(4x(1-x)\bigr).
```
当 $`x=0.6,0.9,0.99`$ 时，KL 分别约为 $`0.020411,0.510826,1.614463`$ nat，目标却都在同一平台。所有动作比率的旧策略加权均值仍为一，归一化也没有限制 KL 变大。

因此目标裁剪消除的是一部分继续变化的激励，不是对策略分布距离的硬约束；共享参数、其他状态或额外损失仍可能推动变化。图为完整动作求和的解析反例，没有抽样误差；实践中的经验 KL 又多一层估计波动。参照 [Spinning Up 对 PPO 裁剪与 KL 早停的说明](https://spinningup.openai.com/en/latest/algorithms/ppo.html)。

<a id="policy-4-detail-58"></a>

## 12. 双动作裁剪的完整反例

<a id="policy-4-detail-59"></a>

### 12.1 所有动作都在场仍有平坦区域

设旧策略两动作各半，旧优势分别为负一和一，新策略选正优势动作概率为 $`x`$。未裁剪替代目标为 $`2x-1`$。宽度零点二时，当 $`x`$ 不小于零点六，正动作比率达到或超过上界，负动作比率达到或低于下界，两项都进入有利变化平坦区，平均裁剪目标为零点二。

因此零点六、零点九甚至零点九九都可给相同裁剪值，但完整 KL 差很多。这个例子不依赖未采样动作，说明平坦区本身就不提供继续拉回边界的强制力。实际优化会停在哪里，取决于其他目标、共享样本、优化器和路径，不能由裁剪阈值单独确定。

<a id="policy-4-detail-60"></a>

### 12.2 实验四：同值裁剪与不同分布

下面完整枚举两动作概率，核对裁剪值与解析 KL；再在网格上加入小熵项，观察它在平坦区偏向较高熵的位置。网格只是这个一维玩具的数值检查，不是通用 PPO 优化器。它帮助解释第二段实验中熵为什么仍可在平坦 actor 上产生作用。

```python
import numpy as np
xs = np.array([.5,.6,.9,.99])
def objective(x):
    positive = np.minimum(2*x,np.clip(2*x,.8,1.2))
    negative = np.minimum(-2*(1-x),-np.clip(2*(1-x),.8,1.2))
    return (positive+negative)/2
values = objective(xs)
kl = -.5*np.log(4*xs*(1-xs))
assert np.allclose(values,[0.,.2,.2,.2])
assert kl[3]>kl[2]>kl[1]>kl[0]
grid = np.linspace(.001,.999,999)
entropy = -grid*np.log(grid)-(1-grid)*np.log1p(-grid)
best = grid[np.argmax(objective(grid)+.1*entropy)]
assert abs(best-.6)<.002
print('positive_action_probabilities',xs.tolist())
print('clipped_values',values.tolist(),'full_KL',kl.tolist(),'entropy_regularized_grid_best',best)
```

这个玩具说明不同目标共同定义完整更新。小熵项在平坦区更偏向靠近各半的合法概率，但这不是所有任务的普遍最优选择；真实优势、访问和数据会变化。它也没有证明梯度训练一定走到网格最优，只验证目标形状和分布差异。

<a id="policy-4-detail-61"></a>

### 12.3 基线平移与裁剪非线性

普通策略梯度中动作无关基线在完整期望下抵消，但固定优势统一平移可能改变 PPO 的优势符号与裁剪支路。未裁剪动作比率线性期望可只差状态常数，裁剪后的 min 一般不能这样交换。优势中心化是一个实际配置，不能用基线定理直接证明整轮多步目标完全不变。

这也解释为何比较标准化时要同时记录符号比例和裁剪激活，而不是只看标准差变小。不同小批各自中心化，还会让同一记录在不同分组下获得不同权重。可以研究其稳定收益，但应准确承认目标和路径的变化。

<a id="policy-4-detail-62"></a>

### 12.4 熵不是安全约束

熵奖励鼓励分布多样，在本玩具平坦区可提供回拉，但不能保证所有比率或 KL 小。它也可能保留次优动作概率，降低已知明确任务的最终回报。若只在容易状态高熵，仍可能缺少关键探索。应结合原任务表现、覆盖和成本评价，而不是把熵越大直接当越稳。

本章熵是在旧采样状态上的当前分布局部正则，没有把未来熵回报完整加入 GAE。因此不把它宣称为任意最大熵目标的精确梯度。一个小系数可以有实用作用，理论解释仍应与实际公式一致。

<a id="policy-4-detail-63"></a>

## 13. 目标固定与参数耦合

<a id="policy-4-detail-64"></a>

### 13.1 采集价值和下一值的同版本条件

采集期间没有任何优化器更新，所以记录的旧价值与收集完成后计算的下一价值属于同一 critic 版本。若异步系统在采集中持续更新，需要额外版本管理，不能沿用这项一致性。旧概率同理，真实行为可能跨多个版本，分母应按每条记录对应。

目标构造在无梯度区域，之后独立复制有效部分，防止更新或原地赋值改变。当前值用于拟合，但不会通过目标反向。若改成共享网络，actor 更新可以改变当前 critic 输出，却不能无声改旧目标。计算图与数据快照两层都需要明确。

<a id="policy-4-detail-65"></a>

### 13.2 分离参数仍可能被全局技巧耦合

当前 actor 和 critic 参数分离，Adam 参数组各自维护状态，因此价值梯度不直接修改策略。若未来加入针对全部参数的统一梯度范数裁剪，较大 critic 梯度可能通过共同缩放因子改变 actor 更新，即使参数没有共享。完整算法分析应包含这种优化器外部操作。

类似地，学习率调度、梯度累积、混合精度缩放和失败步跳过，都可能影响两者相对路径。不能只看网络结构分离就宣布全部训练互不影响。本章没有启用这些额外机制，让基础循环更容易检查；扩展时需逐项补证据。

<a id="visual-global-clip-coupling"></a>

#### 参数分离之后，共同裁剪仍会改变 actor

![联合范数裁剪让 Critic 梯度大小间接改变 Actor 分量](images/04-img-joint-gradient-clipping.webp)

[打开原图放大](images/04-img-joint-gradient-clipping.webp)

把问题缩到两个标量参数块，actor 梯度固定为三。第一行取 critic 梯度四，联合梯度范数为五；若统一裁到范数一，actor 分量成为 $`\frac35=0.6`$，critic 成为 $`\frac45=0.8`$。第二行只把 critic 梯度改为四十，actor 的原始导数完全不变，联合范数却变成 $`\sqrt{1609}`$，actor 分量降到约 $`0.074790`$。

全局裁剪把两个梯度分量乘同一个因子。Critic 的原梯度增大后，联合范数变大，Actor 的原始分量虽保持三，乘上的因子却变小。

共同缩放因子 $`\min(1,\frac c{\sqrt{\|g_a\|^2+\|g_c\|^2}})`$ 依赖两个块，因此 critic 可以通过这条路径影响 actor 更新。若两块分别裁到一，actor 在两个例子中都会得到一；这又是另一套算法，不能把三种结果只称为同一种“梯度裁剪”。

图只比较进入优化器前的梯度分量，学习率还未乘入；对 SGD，一步位移与这些分量直接成比例。对带历史状态的 Adam，则还要经过其矩更新，不能把图中的比例当作一般最终位移比。更不能把全局梯度范数限制理解为 PPO 的动作概率比限制或 KL 约束。本章现有实验没有启用这项额外操作，图是解释扩展时需要检查的耦合，而不是声称已有实跑开启了该配置。

<a id="policy-4-detail-66"></a>

### 13.3 值裁剪的平坦区如何解读

实验二旧值零、目标二、当前值一，普通半平方误差为零点五；把变化裁到零点二后误差为一点六二，取最大选择后者，且裁剪分支导数为零。它并没有把当前值强制改回零点二，也不保证当前批还能修正该点。下一轮旧值刷新后又是另一局部目标。

这不是说值裁剪永远有害，而是说明它是一种有具体激励的选择。奖励尺度、旧值误差和拟合次数都会影响效果。完整代码明确不使用，避免把可选机制混进基础结果。研究它的价值应有独立对照，而非从名字中的稳定二字推出结论。

<a id="policy-4-detail-67"></a>

### 13.4 最佳状态和续训状态

开发选点保存 actor 与 critic 独立副本，最终恢复的是两份同轮状态，支持该函数的推理评价。若要从该点继续完全相同训练，还需恢复优化器动量、更新计数、随机流和数据位置。当前没有演练这种续训，不将内存权重恢复扩大为轨迹恢复保证。

临时文件不是复现的必要形式，当前完整代码与配置已在正文中，运行只在内存产生状态。真实工程若依赖外部模型或词表，就需要按需求保存合法依赖；清理无用生成物与保留运行条件是不同事。最终结果应该让另一个读者不靠聊天补充也能理解对象身份。

<a id="policy-4-detail-68"></a>

## 14. 结果、预算与进一步研究

<a id="policy-4-detail-69"></a>

### 14.1 实际结果的证据范围

本次八十轮各收一百二十八回合，环境交互数量和每轮有效步由终止长度决定。全部四 epoch 执行说明早停规则没有实际中断，不能将其作为成功原因。第五十轮被开发选择，最终测试表现接近已知小模型参照，但没有重复种子和跨动力学验证。

解析机制、完整训练和独立模型参照提供不同证据：前者解释目标形状，训练说明当前程序可学习，参照提供任务上限。任何一种都不能替代另外两种。当前结果没有测量真实硬件吞吐、复杂感知或长期探索，因此也不填写这些未测指标。

<a id="policy-4-detail-70"></a>

### 14.2 预算匹配的比较

比较 PPO 与前章方法时，应统一或明确环境回合、总时间步、优化器步数、调参次数和评价协议。PPO 多 epoch 使用更多计算，固定交互下改善可能有意义，但不是固定时间下必然更高效。不同问题需要不同资源轴，应该在结论中准确命名。

可以先固定同一采集预算，比较一次更新与多轮复用；再固定总优化器步，比较更多新交互与重复旧数据。每种对照都保留旧身份与边界检查。若性能不同，进一步观察 KL、critic 外推和覆盖，形成可检验解释，而不是只用算法名称归因。

<a id="policy-4-detail-71"></a>

### 14.3 稳定技巧的消融

优势归一化、值裁剪、梯度裁剪、熵和 KL 早停可以分别研究，不能同时全部加入后说某一项有效。固定开发规则与选择机会，报告实际触发比例和失败回归。某机制存在但未触发，只能算实现覆盖，不能算已观察到收益。

消融也可能改变资源消耗，例如频繁 KL 检查需要额外评分，更多 epoch 增加反向次数。报告质量同时给成本，避免只展示最终最好分数。小环境适合先验证语义，复杂任务则需要新证据，不能从一个玩具确定所有默认配置。

<a id="policy-4-detail-72"></a>

### 14.4 失败的分层定位

比率异常优先查旧分母与动作身份，优势异常优先查奖励、边界和价值，策略骤变查目标尺度与完整优化器，独立回报下降再查访问、探索与模型误差。不同层检查各自有明确小例子，能让调试从模糊感觉变成可复算问题。

保留失败运行、未触发规则和没有改善的对照，也能积累知识。研究的完整性不是所有曲线都向上，而是知道哪个条件被验证、哪个仍未知、哪个反例推翻了假设。把这些写入正式资料，下一轮扩展才不需要从印象重新开始。

<a id="policy-4-detail-73"></a>

## 15. 把一次完整更新算清楚

<a id="policy-4-detail-74"></a>

### 15.1 动作重要性比不能自动更换状态分布

固定一个旧采样状态 $`s`$，并假设新策略的动作支持包含在旧策略支持内。对于不随参数求导的函数 $`f(s,a)`$，完整动作求和满足

```math
\begin{aligned}
&\sum_a\pi_{\mathrm{old}}(a\vert s)\frac{\pi_\theta(a\vert s)}{\pi_{\mathrm{old}}(a\vert s)}f(s,a)\\
&\quad =\sum_a\pi_\theta(a\vert s)f(s,a).
\end{aligned}
```

这里变换的只有条件动作分布。若状态本来按旧策略访问，外层仍是旧状态分布。过去动作改变了今天到达哪个状态，今天的单步动作比不能抹去过去的差异。PPO 替代目标有意保留旧访问并使用旧优势，以便从当前批构造可优化的局部目标；把这个近似描述成新策略真实回报的精确重要性估计，会越过成立条件。

例如初始状态选左会到达没有奖励的分支，选右才到有机会成功的分支。即使第二步的动作条件概率完全相同，第一步新策略更偏向右也会改变第二步的状态频率。只给第二步样本乘第二步比率，不能恢复新的分支频率。相反，对一条完整轨迹使用每一步比率的乘积，在环境初始分布与动力学相同、支持充分时可以恢复对应轨迹分布，但乘积会随时域产生严重方差，并非本章采用的 PPO 目标。

因此，多 epoch 的价值来自在同一局部问题上多做优化，代价是当前策略逐渐远离生成数据的策略。裁剪、变化监测和重新采集都围绕这个矛盾设计。不能把反复评分的次数解释成看到了同样多的新环境信息，也不能因为数据没有变化就认为优化过程没有分布问题。旧访问没有变化，当前实际执行时的访问却可能已经变化。

<a id="policy-4-detail-75"></a>

### 15.2 用两个不等长回合核对所有求和

考虑一批只有两个回合，第一回合在第一个动作后结束，第二回合执行两个动作。设三个有效位置的优势按时间顺序为一、二、三，起始折扣为零点九，更新前比率均为一。未加熵时，这批 actor 替代目标为 $`\frac{(1+2+0.9\times3)}{2}=2.85`$。三个位置直接求平均得到一点九，少掉了回合尺度因子一点五。它们不是同一个数值目标。

展平后的三个权重应为一、一、零点九。第二个回合的第一步不能因为排在数组第二行就乘零点九，第一回合已经终止也不能让第二个回合的时间重新从数组序号推断。时间是每次任务开始后的相对位置，回合边界是这个定义的一部分。这个手算同时检验记录身份、有效掩码、折扣和分母，能发现只看张量形状无法发现的错误。

假设固定参数，均匀抽取一个有效位置。该位置加权贡献乘 $`\frac{M}{N}=\frac{3}{2}`$ 后取期望，恰好为上述二点八五。因此小批公式在这个意义上对应完整目标。但是若按固定顺序把前两个位置放一批、第三个位置单独放最后一批，每批都更新一次，最后一条记录会有独立一步的影响；不能把这些变化参数上的梯度简单相加后说与全批更新完全一致。独立均匀抽样的无偏说法、随机重排的执行过程以及一次完整求和，是三个需要区分的对象。

<a id="policy-4-detail-76"></a>

### 15.3 为什么固定优势仍允许当前价值学习

旧优势回答的是旧策略下这个动作相对旧价值的表现，价值目标则为 critic 提供拟合任务。它们都应固定，但当前 critic 输出必须保留对自身参数的梯度。若把整个当前值计算包进无梯度区域，价值损失虽然仍能显示数字，却不再训练 critic；若反过来允许目标通过旧值链反向，当前更新又可能通过移动目标来降低误差。两种错误都可能被一个可正常打印的损失掩盖。

以单个样本目标二为例，当前预测一，半平方误差梯度对预测为负一，应把预测推高。如果目标被错误地写成与当前预测始终相同，损失与梯度都会零；这不是已经学好，而是标签身份失效。如果目标只含当前预测的一部分，梯度大小和方向也可能发生变化。正确的实现让固定目标像数据标签一样参与数值计算，同时只让当前输出连接可训练参数。

本章先构造旧 GAE 再令目标等于旧价值加旧优势。对有限轨迹，这个目标通常是使用旧 critic 的多步混合估计，不等于每一条样本的无偏真实价值。固定它保证优化问题没有在 epoch 内偷偷改变，并不消除估计偏差。critic 的改进要由独立拟合误差、后续优势和任务结果共同观察，不能单凭目标被冻结就称其正确。

<a id="policy-4-detail-77"></a>

### 15.4 梯度裁剪与概率裁剪作用于不同对象

概率裁剪改变目标的分支导数，梯度范数裁剪则在反向完成后对梯度向量进行缩放。前者按样本的优势符号和概率比决定是否平坦，后者按全部参与参数的梯度长度决定缩放。如果一个参数同时影响很多样本，它仍可能在自己某条样本已平坦时被其他样本推动；如果梯度很小，范数裁剪完全不会触发，概率却仍可能跨过某个预设区间。

进一步说，在 Adam 中，实际参数步还取决于历史一阶矩与二阶矩。当前梯度为零，不一定表示这一步参数完全不动，因为过去的动量仍可存在。即使使用普通梯度下降，参数空间的一小步也不能直接换成所有状态的同等概率步，网络敏感度与状态输入不同。本章不用参数步长、梯度范数或单个裁剪阈值替代真实分布监测，原因就在这里。

如果未来启用梯度范数裁剪，应该记录它在哪个反向与优化器位置执行，覆盖哪些参数，阈值的单位如何随损失归约变化。先对回合平均再裁剪，与先对时间步平均再用同一阈值裁剪，会产生不同触发比例。一个稳定技巧必须连同目标尺度解释，单独报阈值不够复现。也不能把梯度裁剪的数值保护解释为任务回报或约束满足的证明。

<a id="policy-4-detail-78"></a>

### 15.5 评价策略是否采样也属于问题定义

当前开发和测试都按冻结策略采样，而不是每步选最大概率动作。两者在一个随机策略上可能得到不同回报。采样评价描述训练分布下的随机行为，贪心评价描述从该概率模型派生的另一条确定性规则。若开发用一种方式、最终测试换另一种方式，就必须说明所选对象和最终执行对象的差别，不能让读者以为只增加了测试样本。

例如策略在状态零有九成概率朝目标行动，另一成概率后退，采样测试会包含后退造成的机会损失；贪心测试则始终选择较大概率动作，但环境动作翻转仍然保留。更高的贪心分数不证明随机策略估计错了，只是换了行为规则。反过来，在需要随机化的部分观测任务里，贪心也可能更差。本章不从单个完全可观测链推出普遍选择。

最终冻结以后，应固定策略参数、动作规则、环境版本和统计量定义。测试中的随机动作与环境噪声可以继续变化，因为我们要估计它们的期望表现。冻结对象并不是消除一切随机性，而是阻止根据测试结果继续改变被评价程序。报告均值与成功率时应同时说明回合数；若要置信区间，应处理完整回合作为评价单位，而不是把同一回合的相关时间步假装成独立样本。

<a id="policy-4-detail-79"></a>

### 15.6 从断言到研究证据的层级

初始比率为一、目标不变和有限梯度这些断言，都只覆盖具体的机制条件。它们有很强的定位价值：失败时可以阻止错误结果继续传播，通过时却没有证明环境建模合理、奖励代表真实需求或算法普遍稳定。完整训练再补上程序能够在这个任务获得反馈并改善的证据，独立评价则估计最终冻结程序的表现。每层证据都有清楚对象。

研究扩展可以在这个基础上提出更窄的假设，例如增加 epoch 是否在固定交互下提高开发回报，或降低学习率是否减少过大的实际 KL。应事先说明对照、预算与判定，不在看到数据后换成功定义。若某次更新的值误差下降但任务回报下降，需要继续分析 critic 目标、访问变化和策略步，而不是删去这次运行。能够解释失败的教材，才足以支持下一步独立研究。

<a id="policy-4-detail-80"></a>

## 16. 进一步的综合题与详解

<a id="policy-4-detail-81"></a>

### 16.1 题十七：同一目标数字为何不代表同一策略

题目：旧二动作概率各半，优势为负一和一。候选甲的正优势动作概率为零点六，候选乙为零点九九。两者的 PPO 裁剪目标相同，是否可以在其余评价全部省略时任意选择？

解答：先算两个动作比率。甲为一点二与零点八，乙为一点九八与零点零二。按优势符号取最小值后，两者完整目标都为零点二，但旧到新 KL 分别约零点零二零四与一点六一四。旧负优势动作在乙中几乎消失，在甲中仍有四成质量。

这说明相同代理值留下很大的行为差异。若真实优势估计含误差或分支仍有探索价值，两者未来数据也会不同。因此应根据预设的更新、监测与开发规则选择，并重新采集验证，不能从同一个裁剪标量推出任务等价。

<a id="policy-4-detail-82"></a>

### 16.2 题十八：遗漏回合尺度后如何比较

题目：原批次有一百回合、三百有效步，actor 用有效步均值，价值项也用有效步均值。现在把 actor 改为回合尺度而保持其他配置，能否说只是修正了一个不影响结论的常数？

解答：actor 梯度将整体乘三，价值梯度没有同样变化，熵若没有同步更改还会改变相对权重。即使 actor 与 critic 参数分离，actor 的有效步幅、Adam 状态与实际 KL 都可能改变；若共享参数，联合方向还会改变。不同批次长度又使这个比例随轮次变化。应把它记录为目标归约和优化配置的变更，重新比较实际更新与回报。若想隔离单纯尺度，可在固定数据和参数上先核对梯度，再研究相应学习率补偿，但不能预先声称整个训练轨迹严格相同。

<a id="policy-4-detail-83"></a>

### 16.3 题十九：测试回合很多能否替代训练重复

题目：一个训练种子得到的策略测试十万回合，均值误差已经很小，是否因此能断言这个算法在该任务上稳定？

解答：大量测试只会更精确地估计这个固定训练结果的条件表现。训练随机种子改变初始化、采样轨迹和优化路径，可能得到另一套参数，这种变异没有被增加同一个策略的测试回合覆盖。需要独立重复训练，并且对每个冻结结果按相同规则评价，才能研究训练稳定性。

调参过程也应保留相同开发角色和选择机会。两类不确定性都重要：少量测试会使单个策略表现估计嘈杂，只有一个训练种子则无法刻画训练结果分布，不能用其中一种样本量冒充另一种。

<a id="policy-4-detail-84"></a>

### 16.4 题二十：如何确认早停收益而非只确认早停代码

题目：完整运行中每轮四个 epoch 都执行，另外的机制夹具成功触发了 KL 停止。能否说本次高回报证明 KL 早停有效？

解答：夹具证明控制流在超过阈值后会停止未来 epoch，且不会回滚已经执行的更新；完整训练证明这一配置可运行，但其阈值从未实际触发。因此当前结果无法归因于早停。

要研究收益，需要预设会发生不同更新路径的对照，例如在相同采集预算与随机种子下比较启用与关闭监测，记录触发轮次、减少的优化步、实际 KL 与独立回报。若高学习率下更常触发，也要检查是否只是减少了训练量。结论应具体到观察到的条件和成本，而不是因为程序含有一个保护分支就宣布它普遍有效。

<a id="policy-4-detail-85"></a>

## 参考资料

- [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)：裁剪替代目标的原论文。
- [Trust Region Policy Optimization](https://proceedings.mlr.press/v37/schulman15.html)：更新约束的理论背景。
- [PyTorch Adam](https://docs.pytorch.org/docs/stable/generated/torch.optim.Adam.html)：优化器参数组的官方接口。
- [PyTorch multinomial](https://docs.pytorch.org/docs/stable/generated/torch.multinomial.html)：离散采样接口。

---

[主题目录](README.md) · [分类目录](../README.md) · [总目录](../../README.md) · [上一章](03-从REINFORCE到GAE的实现细节.md)
