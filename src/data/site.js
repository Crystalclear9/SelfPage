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
    id: 'suishouban', title: '随手办', repository: 'AigcProject',
    category: '应用', icon: 'phone',
    subtitle: '多模态信息提取与任务整理。',
    description: '面向 Android 的多模态行动助理。将截图、文字和文档里的事项整理成卡片，在核对后创建提醒或团队任务。',
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
    id: 'gameqa', title: 'GameQA', repository: 'RagGameQa',
    category: '应用', icon: 'game',
    subtitle: '面向游戏知识的检索增强问答。',
    description: '基于检索增强生成的游戏问答项目。结合本地知识库和混合检索，整理游戏相关问题与参考来源。',
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
    id: 'autellix', title: 'Autellix', repository: 'Autellix',
    category: '系统研究', icon: 'layers',
    subtitle: '程序感知调度：从论文到实现。',
    description: '阅读 Autellix 论文后进行的复现尝试，关注如何结合 Agent 程序的调用关系安排推理请求。',
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
    id: 'time-predict', title: 'TimePredictModel', repository: 'TimePredictModel',
    category: '系统研究', icon: 'clock',
    subtitle: '工具调用回返时间的采集与建模。',
    description: '面向 SGLang 工具调用的回返时间预测项目，涵盖事件采集、特征构建与预测模型训练。',
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
