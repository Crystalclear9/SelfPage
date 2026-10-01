// Public display content only. Never put credentials or private contact details here.
export const profile = {
  name: 'Crystalclear9',
  siteName: '春日来信',
  subtitle: 'AI 应用与系统探索',
  intro: '这个主页整理我的开源项目、实现思路和个人收藏。',
  about: '项目主要涉及任务整理、检索问答和推理调度。这里保留概览，具体实现、使用方式和当前进展放在各自的仓库中。',
  github: 'https://github.com/Crystalclear9',
  // Optional: add an email only if you want it to be publicly visible.
  email: '',
  interests: ['AI 应用', '开源代码', '二次元', '加藤惠'],
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
    note: 'Android 应用源码。运行环境与配置方式请以仓库 README 为准。',
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
    note: '包含前端与后端源码，需要自行配置并启动服务。本站不提供在线问答。',
    source: 'https://github.com/Crystalclear9/RagGameQa',
  },
  {
    id: 'autellix', title: 'Autellix', repository: 'Autellix',
    category: '系统研究', icon: 'layers',
    subtitle: '以 Agent 程序为单位的推理调度。',
    description: '围绕 LLM Agent 程序的推理调度研究实现。包含推理后端集成，以及独立的 CPU 模拟器。',
    tags: ['Python', 'vLLM', 'SGLang'],
    details: [
      { title: '程序感知调度', text: '结合程序历史与调用关系，探索多种调度策略。' },
      { title: '推理与模拟', text: '仓库包含 vLLM、SGLang 集成，以及独立的 CPU 模拟路径。' },
      { title: '研究边界', text: '基于 Autellix 论文展开实现，不代表已经复现论文中的性能结果。' },
    ],
    note: '研究实现。实际运行需要匹配的后端版本与计算环境；实现范围以 README 为准。',
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
      { title: '验证边界', text: '项目仍有数据、校准与验证限制，不能将受控实验结果视为生产性能。' },
    ],
    note: '研究中的训练与预测系统，尚未完成生产验收。详细限制见仓库文档。',
    source: 'https://github.com/Crystalclear9/TimePredictModel',
  },
];

// Optional links to other public pages; empty means the section is hidden.
// Example: { title: '我的笔记', description: '技术笔记与学习记录。', href: 'https://your-public-site.example' }
export const extraLinks = [];

export const gallery = [
  { image: 'keyvisual-1.jpg', title: '樱花盛开的坂道', description: '《冴えない彼女の育てかた Fine》官方视觉', width: 1200, height: 1232 },
  { image: 'keyvisual-3.jpg', title: '故事里的你', description: '《冴えない彼女の育てかた Fine》官方视觉', width: 1200, height: 1232 },
  { image: 'keyvisual-2.jpg', title: '相遇之后', description: '《冴えない彼女の育てかた Fine》官方视觉', width: 1200, height: 1232 },
];
