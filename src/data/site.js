// Public display content only. Never put credentials or private contact details here.
export const profile = {
  name: 'Crystalclear9',
  siteName: 'Crystalclear9',
  subtitle: 'AI 应用与系统探索',
  intro: '我主要做一些 AI 应用，也关注推理和调度相关的系统问题。',
  about: '从任务整理、检索问答，到论文里的调度方法，尝试把想法落实到代码里。这里放着其中的一些项目和记录。',
  github: 'https://github.com/Crystalclear9',
  // Optional: add an email only if you want it to be publicly visible.
  email: '',
};

// Summarized from public READMEs, not an independent runtime verification.
// Source links only: these projects do not have hosted demos.
export const projects = [
  {
    context: '这个项目关注散落在不同输入里的待办信息。处理过程保留原始内容与修正入口，让用户先核对再执行；行动卡片则把个人计划、团队任务和本地草稿放进同一套流程。',
    id: 'suishouban', title: '随手办', repository: 'AigcProject',
    category: '应用', icon: 'phone',
    subtitle: '多模态信息提取与任务整理。',
    description: '面向 Android 的多模态行动助理，把截图、文字和文档里的事项整理成可核对的卡片。确认时间和内容后，再创建提醒或团队任务，让信息收集与后续处理衔接起来。',
    tags: ['Kotlin', 'Android', 'Python'],
    details: [
      { title: '收集信息', text: '从截图、长截图、文字及办公文档中提取待办事项。' },
      { title: '核对与编辑', text: '将关键内容关联到原始证据，保留用户修正，确认后再执行操作。' },
      { title: '个人与团队', text: '围绕行动卡片组织个人计划与团队任务，包含本地草稿及同步流程。' },
    ],
    note: 'Android 客户端与相关服务的配置说明放在仓库 README 中。',
    source: 'https://github.com/Crystalclear9/AigcProject',
  },
  {
    context: '检索部分结合 BM25 与向量检索，分别利用关键词和语义信息寻找资料。知识按游戏组织，对话界面提供会话管理、来源查看和重试入口，便于围绕具体问题继续查询。',
    id: 'gameqa', title: 'GameQA', repository: 'RagGameQa',
    category: '应用', icon: 'game',
    subtitle: '面向游戏知识的检索增强问答。',
    description: '基于检索增强生成的游戏问答项目，先从本地知识库寻找相关内容，再结合模型组织回答。通过混合检索和来源展示，让游戏知识的查询有据可查，也便于回到原文核对。',
    tags: ['Python', 'RAG', '混合检索'],
    details: [
      { title: '知识检索', text: '结合 BM25 与向量检索，从游戏知识库中寻找相关内容。' },
      { title: '领域与模型', text: '按游戏组织知识，提供多模型接入及知识同步配置。' },
      { title: '对话界面', text: '包含多会话管理、来源展示，以及中止和重试等交互。' },
    ],
    note: '前后端源码一并放在仓库中，运行时需要配置知识库和模型服务。',
    source: 'https://github.com/Crystalclear9/RagGameQa',
  },
  {
    context: '复现的重点是把论文中的程序级调度思路落到可阅读的实现中。仓库同时保留后端集成与独立模拟路径，用于从不同运行条件理解调度逻辑；原论文的性能结果仍需进一步验证。',
    id: 'autellix', title: 'Autellix', repository: 'Autellix',
    category: '系统研究', icon: 'layers',
    subtitle: '程序感知调度：从论文到实现。',
    description: '阅读 Autellix 论文后进行的复现尝试，关注如何结合 Agent 程序的调用关系安排推理请求。从程序历史与调度策略入手，结合推理后端和 CPU 模拟路径理解论文中的方法。',
    tags: ['Python', 'vLLM', 'SGLang'],
    details: [
      { title: '程序感知调度', text: '结合程序历史与调用关系，探索多种调度策略。' },
      { title: '推理与模拟', text: '仓库包含 vLLM、SGLang 集成，以及独立的 CPU 模拟路径。' },
      { title: '复现记录', text: '实现内容与实验进展随代码保存在仓库中，便于对照论文阅读。' },
    ],
    note: '这是基于下方原论文的个人论文复现尝试，方法来自原作者。目前尚未完成对论文性能结果的复现。',
    reference: { title: 'Autellix: An Efficient Serving Engine for LLM Agents as General Programs', url: 'https://arxiv.org/abs/2502.13965' },
    source: 'https://github.com/Crystalclear9/Autellix',
  },
  {
    context: '这里把事件采集、样本构建和预测训练串成一个实验流程。模型采用结构化特征与 XGBoost，关注不同分位数下的回返时间；数据配对和预测校准也是需要持续检查的部分。',
    id: 'time-predict', title: 'TimePredictModel', repository: 'TimePredictModel',
    category: '系统研究', icon: 'clock',
    subtitle: '工具调用回返时间的采集与建模。',
    description: '面向 SGLang 工具调用的回返时间预测项目，从调用与返回事件中构建时间标签，再进行特征提取和模型训练。尝试用分位数预测描述等待时间，为分析工具调用的延迟提供依据。',
    tags: ['Python', 'XGBoost', 'SGLang'],
    details: [
      { title: '采集与配对', text: '围绕工具调用和结果回返采集事件，构建时间标签。' },
      { title: '建模流程', text: '使用结构化特征与 XGBoost，探索调用回返时间的分位数预测。' },
      { title: '实验与校准', text: '围绕数据质量、预测校准和验证条件继续实验，目前的结果限于已测试的设置。' },
    ],
    note: '项目仍在实验阶段。数据设置、训练流程和已有结果记录在仓库中。',
    source: 'https://github.com/Crystalclear9/TimePredictModel',
  },
];

// Optional links to other public pages; empty means the section is hidden.
// Example: { title: '我的笔记', description: '技术笔记与学习记录。', href: 'https://your-public-site.example' }
export const extraLinks = [];
