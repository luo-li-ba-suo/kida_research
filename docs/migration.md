# 起点知识库迁移对照

来源：`RL_OffPolicy_CreditAssignment_1103_v1.3.html`。首次整理日期：2026-11-15。

全量覆盖 47 个阅读块。演讲配速、转场提示和控制面板已去除。公式保留原 TeX 注释，教学图与论文图保留来源说明。

| 原编号 | 对应内容 | 目的文章 |
|---|---|---|
| 01 | 一次交互中的两个学习问题 | [Off-policy 训练的可靠性：分清两种不一致](../notes/off-policy-reliability.html#block-01) |
| 02 | 用同一个前缀拆开两种概率差异 | [Off-policy 训练的可靠性：分清两种不一致](../notes/off-policy-reliability.html#block-02) |
| 03 | GSPO：把裁剪单位变成整个回答 | [GSPO：让优化粒度与序列奖励对齐](../notes/gspo.html#block-03) |
| 04 | R3：训练时沿着 rollout 的专家路径 | [R3：在训练中重放 rollout 的专家路径](../notes/r3.html#block-04) |
| 05 | IcePop：失配太大的 token 暂不参与该项更新 | [IcePop：单独处理训练与推理的概率失配](../notes/icepop.html#block-05) |
| 06 | 不同方法改变的更新环节 | [Off-policy 训练的可靠性：分清两种不一致](../notes/off-policy-reliability.html#block-06) |
| 07 | 从最大化 return 出发，推到策略梯度 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-07) |
| 08 | 把其中一项叫做 score：它的均值恰好为零 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-08) |
| 09 | 把 E[R s] 展开，理想更新只剩协方差 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-09) |
| 10 | 实际样本来自 q：两项都可能出问题 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-10) |
| 11 | drift 的方向，其实是拟合 sampler 的交叉熵方向 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-11) |
| 12 | teacher 也在移动：追上一次偏差，下一轮又出现 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-12) |
| 13 | Score Centering：直接消掉平均 score | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-13) |
| 14 | 怎样算平均 score？先用 top-k 重建 sampler 分布 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-14) |
| 15 | 再次利用零均值性质，把 tail 求和消掉 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-15) |
| 16 | SC 之后还不够：Cov 的分布仍然是 q | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-16) |
| 17 | 用 IS 校正分布，再用 TIS / MIS 控制极端权重 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-17) |
| 18 | 量化与 Staleness，要分开看 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-18) |
| 19 | M2PO：让极端 log-ratio 对应项退出更新 | [M2PO：在旧数据的信息与极端失配之间取舍](../notes/m2po.html#block-19) |
| 20 | VCPO：按有效样本量调整更新强度 | [VCPO：用有效样本量判断更新强度](../notes/vcpo.html#block-20) |
| 21 | 局部 advantage 的五个入口 | [长程信用分配：从五类证据找到局部学习信号](../notes/credit-assignment-map.html#block-21) |
| 22 | 成功的轨迹有绕路，失败的轨迹有好动作 | [GraphGPO：连接已有轨迹，重新分配局部信用](../notes/graphgpo.html#block-22) |
| 23 | step advantage 到底怎么算？ | [GiGPO：同一状态下，不同尝试如何比较](../notes/gigpo.html#block-23) |
| 24 | GiGPO：在同一状态下比较不同尝试 | [GiGPO：同一状态下，不同尝试如何比较](../notes/gigpo.html#block-24) |
| 25 | 同状态比较，仍可能把后续失败算到前面 | [GiGPO：同一状态下，不同尝试如何比较](../notes/gigpo.html#block-25) |
| 26 | 失败前缀，可以接上另一条轨迹的成功后缀 | [GraphGPO：连接已有轨迹，重新分配局部信用](../notes/graphgpo.html#block-26) |
| 27 | 图上的成功距离，提供另一种信用证据 | [GraphGPO：连接已有轨迹，重新分配局部信用](../notes/graphgpo.html#block-27) |
| 28 | 重复状态是证据，也是一项假设 | [GraphGPO：连接已有轨迹，重新分配局部信用](../notes/graphgpo.html#block-28) |
| 29 | 同文比较，三个环境均有提升 | [GraphGPO：连接已有轨迹，重新分配局部信用](../notes/graphgpo.html#block-29) |
| 30 | 先检查证据覆盖，再期待训练收益 | [GraphGPO：连接已有轨迹，重新分配局部信用](../notes/graphgpo.html#block-30) |
| 31 | SWEET-RL：让 Critic 看见训练时参考信息 | [SWEET-RL：让训练期参考信息帮助局部评价](../notes/sweet-rl.html#block-31) |
| 32 | HCAPO：用事后条件化评分，重加权回报 | [HCAPO：事后信息如何进入信用估计](../notes/hcapo.html#block-32) |
| 33 | IGPO：正确答案更容易预测，作为进展信号 | [IGPO：把正确答案的可预测性作为进展信号](../notes/igpo.html#block-33) |
| 34 | TRACE：衡量答案预测缺口的相对缩小 | [TRACE：从相对预测进展回看工具调用的价值](../notes/trace.html#block-34) |
| 35 | iStar：整体偏好，也可以训练局部奖励 | [iStar：从整体偏好中学习局部奖励](../notes/istar.html#block-35) |
| 36 | ITPO：把 token 的隐式信号聚合到完整一轮 | [ITPO：把隐式奖励聚合到完整交互轮次](../notes/itpo.html#block-36) |
| 37 | ArCHer：把完整语言行动作为高层动作 | [ArCHer：在语言行动与 token 两个尺度学习](../notes/archer.html#block-37) |
| 38 | HiPER：规划、切换与执行，各有优势信号 | [HiPER：区分规划、切换和执行的优势信号](../notes/hiper.html#block-38) |
| 39 | 从训练现象到可检验的诊断 | [训练诊断：先验证证据，再组合机制](../notes/agent-training-diagnostics.html#block-39) |
| 40 | 同一个公式，先说明在哪个随机变量层级上 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-40) |
| 41 | 先近似尾部，再精确化简 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-41) |
| 42 | 看权重，也看梯度何时为零 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-42) |
| 43 | GRPO 的组内中心化，为什么仍不够？ | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-43) |
| 44 | 更强量化下，SC 的优势变得明显 | [Score Centering：从平均 score 漂移理解 off-policy 不稳定](../notes/score-centering.html#block-44) |
| 45 | 局部正优势，不保证最终优势为正 | [GraphGPO：连接已有轨迹，重新分配局部信用](../notes/graphgpo.html#block-45) |
| 46 | 相似机制，可以交叉，不必强造继承 | [长程信用分配：从五类证据找到局部学习信号](../notes/credit-assignment-map.html#block-46) |
| 47 | 原始论文索引 | [训练诊断：先验证证据，再组合机制](../notes/agent-training-diagnostics.html#block-47) |

## 论文核对记录

核对范围见各行。教学推断和实验外推仍以文章里的适用边界为准。

| 论文 | 原始来源 | 核对位置 |
|---|---|---|
| Score Centering | [原文](https://arxiv.org/html/2609.20807v1) | §3–4 的漂移分解、式 (8) 与附录 A 的 top-k 近似，以及 §5.3 图 4、§5.4 图 1。 |
| GSPO | [原文](https://arxiv.org/abs/2507.18071) | 方法节的式 (5) 及序列级裁剪。笔记中 token 数值图为教学示例。 |
| R3 | [原文](https://arxiv.org/abs/2510.11370) | 路由重放方法节的 Top-K mask 替换与训练端权重重算。 |
| IcePop | [原文](https://arxiv.org/abs/2510.18855) | IcePop 方法节对训推 discrepancy ratio 与 masking 的定义。0.02/0.08 是教学示例。 |
| M2PO | [原文](https://arxiv.org/html/2510.01161v2) | §5 的 log-ratio 二阶矩及筛选方向，§4 的高滞后训练曲线。 |
| VCPO | [原文](https://arxiv.org/html/2602.17616v2) | §3.2 ESS 步长缩放、§3.3 最小方差 baseline。示意权重用于解释集中度。 |
| GiGPO | [原文](https://arxiv.org/html/2505.10978v2) | anchor state grouping、step-level relative advantage 和 episode/step 优势融合。轨迹手算是教学例子。 |
| GraphGPO | [原文](https://arxiv.org/html/2605.26684v2) | §4 的图结构与图优势，表 1–2 的 ALFWorld、WebShop、Sokoban 成功率。路径与融合手算是教学例子。 |
| SWEET-RL | [原文](https://arxiv.org/abs/2503.15478) | 方法段中的 training-time information 与 critic。参考实现用于说明直觉。 |
| HCAPO | [原文](https://arxiv.org/html/2603.08754v1) | hindsight ratio 的理论定义及 LLM 验证近似。实际归因效果受终态与评分质量影响。 |
| IGPO | [原文](https://arxiv.org/abs/2510.14967) | 式 (3) 的平均 token 对数概率，以及动作前后信息奖励。−2 到 −0.8 是教学数值。 |
| TRACE | [原文](https://arxiv.org/html/2607.13988v1) | 单步 log-ratio TD 与式 (8)–(9) 的归一化 K 步窗口。 |
| iStar | [原文](https://arxiv.org/abs/2509.19199) | 整体轨迹偏好更新 PRM，以及相对上一轮策略快照的步骤奖励。 |
| ITPO | [原文](https://arxiv.org/html/2603.23550v1) | 隐式过程奖励的 turn 聚合和可选归一化。表中 token 分数是教学构造。 |
| ArCHer | [原文](https://proceedings.mlr.press/v235/zhou24t.html) | 论文摘要与方法对高层 off-policy value、低层 on-policy policy gradient 的描述。 |
| HiPER | [原文](https://arxiv.org/html/2602.16165v1) | 单一自回归 LLM 的层级生成与 HAE 的 switch、high、low 估计。 |
