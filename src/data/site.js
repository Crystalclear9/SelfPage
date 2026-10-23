// Public repository summaries reviewed 2026-10-23; no runtime claims.
export const profile = {
  "name": "Crystalclear9",
  "siteName": "Crystalclear9",
  "subtitle": "AI 应用与系统探索",
  "intro": "我主要做一些 AI 应用，也关注推理和调度相关的系统问题。",
  "about": "从任务整理、检索问答，到论文里的调度方法，尝试把想法落实到代码里。这里放着其中的一些项目和记录。",
  "github": "https://github.com/Crystalclear9",
  "email": "",
  "avatarVoice": "audio/megumi-greeting.flac",
  "likeVoice": "audio/megumi-like.flac",
  "unlikeVoice": "audio/megumi-unlike.flac"
};
export const projects = [
  {
    "context": "围绕证据收集、草稿生成、核对与执行组织工作流。用户修正形成新版本并从检查点继续，未经确认的模型输出不直接创建任务；个人与团队工作区保留各自状态。",
    "id": "suishouban",
    "title": "随手办",
    "repository": "AigcProject",
    "category": "应用",
    "icon": "phone",
    "subtitle": "多模态信息提取与任务整理。",
    "description": "面向 Android 的多模态行动助理，把截图、文字和文档里的事项整理成可核对的卡片。确认时间和内容后，再创建提醒或团队任务，让信息收集与后续处理衔接起来。",
    "tags": [
      "Kotlin",
      "Android",
      "Python"
    ],
    "details": [
      {
        "title": "收集信息",
        "text": "从截图、长截图、文字及办公文档中提取待办事项。"
      },
      {
        "title": "核对与编辑",
        "text": "将关键内容关联到原始证据，保留用户修正，确认后再执行操作。"
      },
      {
        "title": "个人与团队",
        "text": "围绕行动卡片组织个人计划与团队任务，包含本地草稿及同步流程。"
      }
    ],
    "note": "Android 客户端与相关服务的配置说明放在仓库 README 中。",
    "source": "https://github.com/Crystalclear9/AigcProject"
  },
  {
    "context": "检索部分结合 BM25 与向量检索，分别利用关键词和语义信息寻找资料。知识按游戏组织，对话界面提供会话管理、来源查看和重试入口，便于围绕具体问题继续查询。",
    "id": "gameqa",
    "title": "GameQA",
    "repository": "RagGameQa",
    "category": "应用",
    "icon": "game",
    "subtitle": "面向游戏知识的检索增强问答。",
    "description": "基于检索增强生成的游戏问答项目，先从本地知识库寻找相关内容，再结合模型组织回答。通过混合检索和来源展示，让游戏知识的查询有据可查，也便于回到原文核对。",
    "tags": [
      "Python",
      "RAG",
      "混合检索"
    ],
    "details": [
      {
        "title": "知识检索",
        "text": "结合 BM25 与向量检索，从游戏知识库中寻找相关内容。"
      },
      {
        "title": "领域与模型",
        "text": "按游戏组织知识，提供多模型接入及知识同步配置。"
      },
      {
        "title": "对话界面",
        "text": "包含多会话管理、来源展示，以及中止和重试等交互。"
      }
    ],
    "note": "前后端源码一并放在仓库中，运行时需要配置知识库和模型服务。",
    "source": "https://github.com/Crystalclear9/RagGameQa"
  },
  {
    "context": "复现的重点是把论文中的程序级调度思路落到可阅读的实现中。仓库同时保留后端集成与独立模拟路径，用于从不同运行条件理解调度逻辑；原论文的性能结果仍需进一步验证。",
    "id": "autellix",
    "title": "Autellix",
    "repository": "Autellix",
    "category": "系统研究",
    "icon": "layers",
    "subtitle": "程序感知调度：从论文到实现。",
    "description": "对 Autellix 论文的非官方独立复现尝试，实现程序感知调度，并适配 vLLM 与 SGLang。仓库记录了小模型功能验证；核心方法实现不等同于原作者代码、相同 CUDA 实现或论文性能复现。",
    "tags": [
      "Python",
      "vLLM",
      "SGLang"
    ],
    "details": [
      {
        "title": "程序感知调度",
        "text": "结合程序历史与调用关系，探索多种调度策略。"
      },
      {
        "title": "推理与模拟",
        "text": "仓库包含 vLLM、SGLang 集成，以及独立的 CPU 模拟路径。"
      },
      {
        "title": "复现记录",
        "text": "实现内容与实验进展随代码保存在仓库中，便于对照论文阅读。"
      }
    ],
    "note": "这是基于下方原论文的个人论文复现尝试，方法来自原作者。目前尚未完成对论文性能结果的复现。",
    "reference": {
      "title": "Autellix: An Efficient Serving Engine for LLM Agents as General Programs",
      "url": "https://arxiv.org/abs/2502.13965"
    },
    "source": "https://github.com/Crystalclear9/Autellix"
  },
  {
    "context": "这里把事件采集、样本构建和预测训练串成一个实验流程。模型采用结构化特征与 XGBoost，关注不同分位数下的回返时间；数据配对和预测校准也是需要持续检查的部分。",
    "id": "time-predict",
    "title": "TimePredictModel",
    "repository": "TimePredictModel",
    "category": "系统研究",
    "icon": "clock",
    "subtitle": "工具回返时间的采集、AFT 建模与条件预测。",
    "description": "独立的工具回返时间预测插件，串联事件采集、关联、特征转换、XGBoost AFT 训练和模型验收发布。从生存分布计算条件剩余时间与窗口概率，为外部调度模块提供接口；生产环境仍需单独验收。",
    "tags": [
      "Python",
      "XGBoost",
      "SGLang"
    ],
    "details": [
      {
        "title": "事件与标签",
        "text": "区分精确回返与真实截断标签，按时间及完整工作流划分数据。"
      },
      {
        "title": "AFT 建模",
        "text": "使用结构化特征与生存模型，计算条件剩余时间和窗口概率。"
      },
      {
        "title": "接口与验收",
        "text": "提供采集、发布及客户端接口；本地检查不代表真实 GPU 与生产性能通过。"
      }
    ],
    "note": "项目仍在实验阶段。数据设置、训练流程和已有结果记录在仓库中。",
    "source": "https://github.com/Crystalclear9/TimePredictModel"
  },
  {
    "id": "sandboxsim",
    "title": "SandBoxSim",
    "repository": "SandBoxSim",
    "category": "应用",
    "icon": "game",
    "subtitle": "自然生态与自主居民的 3D 沙盒模拟。",
    "description": "使用 Godot 与 C# 构建的沙盒模拟游戏。玩家调整地形、水源和资源，居民根据需求与可达性进行采集、建造和迁移；通过人物档案、世界事件和每日曲线，观察环境与聚落逐渐变化。",
    "tags": [
      "C#",
      "Godot",
      ".NET"
    ],
    "details": [
      {
        "title": "自由塑造世界",
        "text": "调整地貌、生命与气候，观察水土、天气、资源和居民活动之间的关系。"
      },
      {
        "title": "居民与聚落",
        "text": "围绕需求、材料和可达性组织自主行为，结合人物档案与历史记录观察生存和聚落变化。"
      },
      {
        "title": "观察与实验",
        "text": "提供图层、曲线、世界保存，以及独立的固定步进和性能对照接口。"
      }
    ],
    "note": "源码运行需要 Godot .NET 与 .NET 开发环境。游戏玩法与实验接口分开维护，运行方式和验证范围见仓库文档。",
    "source": "https://github.com/Crystalclear9/SandBoxSim"
  },
  {
    "id": "predictdesign",
    "title": "PredictDesign",
    "repository": "PredictDesign",
    "category": "系统研究",
    "icon": "layers",
    "subtitle": "多智能体协作过程中的下一步预测。",
    "description": "将多智能体运行视为动态协作图，在查询到达和执行过程中预测后续调用。面向冷启动场景，先预测、再执行，真实动作完成后才更新在线记忆，避免未来信息进入评估。",
    "tags": [
      "Python",
      "Agent",
      "在线预测"
    ],
    "details": [
      {
        "title": "内容概览",
        "text": "将多智能体运行视为动态协作图，在查询到达和执行过程中预测后续调用。面向冷启动场景，先预测、再执行，真实动作完成后才更新在线记忆，避免未来信息进入评估。"
      },
      {
        "title": "阅读与使用",
        "text": "实现、运行条件与维护记录见公开仓库。"
      }
    ],
    "note": "介绍依据公开仓库整理，未将仓库记录视为本站独立运行验证。",
    "source": "https://github.com/Crystalclear9/PredictDesign"
  },
  {
    "id": "outdoorsweb",
    "title": "OutdoorsWeb",
    "repository": "OutdoorsWeb",
    "category": "应用",
    "icon": "phone",
    "subtitle": "户外场地布展预约与审批。",
    "description": "基于 React、Node.js 与 SQLite 的布展预约应用，围绕企业申请、设计图提交、场地安排和审批组织流程，支持冲突提示、改期、公告及操作记录。",
    "tags": [
      "React",
      "Node.js",
      "SQLite"
    ],
    "details": [
      {
        "title": "内容概览",
        "text": "基于 React、Node.js 与 SQLite 的布展预约应用，围绕企业申请、设计图提交、场地安排和审批组织流程，支持冲突提示、改期、公告及操作记录。"
      },
      {
        "title": "阅读与使用",
        "text": "实现、运行条件与维护记录见公开仓库。"
      }
    ],
    "note": "介绍依据公开仓库整理，未将仓库记录视为本站独立运行验证。",
    "source": "https://github.com/Crystalclear9/OutdoorsWeb"
  },
  {
    "id": "hustdatabase",
    "title": "HustDataBase",
    "repository": "HustDataBase",
    "category": "课程实践",
    "icon": "layers",
    "subtitle": "数据库系统原理实验记录。",
    "description": "按实验与关卡整理 MySQL 数据库实践代码，保留题目对应的实现，便于回顾查询与数据库操作。仓库记录了平台测试情况，具体要求以课程任务为准。",
    "tags": [
      "MySQL",
      "SQL"
    ],
    "details": [
      {
        "title": "内容概览",
        "text": "按实验与关卡整理 MySQL 数据库实践代码，保留题目对应的实现，便于回顾查询与数据库操作。仓库记录了平台测试情况，具体要求以课程任务为准。"
      },
      {
        "title": "阅读与使用",
        "text": "实现、运行条件与维护记录见公开仓库。"
      }
    ],
    "note": "介绍依据公开仓库整理，未将仓库记录视为本站独立运行验证。",
    "source": "https://github.com/Crystalclear9/HustDataBase"
  },
  {
    "id": "operationsystem",
    "title": "OperationSystem",
    "repository": "OperationSystem",
    "category": "课程实践",
    "icon": "layers",
    "subtitle": "基于 RISC-V PKE 的操作系统实验。",
    "description": "围绕教育用 PKE 内核开展操作系统实践，涵盖异常与系统调用、内存管理等实验。代码基于上游教学工程，阅读时需结合原实验说明与许可证。",
    "tags": [
      "RISC-V",
      "C",
      "PKE"
    ],
    "details": [
      {
        "title": "内容概览",
        "text": "围绕教育用 PKE 内核开展操作系统实践，涵盖异常与系统调用、内存管理等实验。代码基于上游教学工程，阅读时需结合原实验说明与许可证。"
      },
      {
        "title": "阅读与使用",
        "text": "实现、运行条件与维护记录见公开仓库。"
      }
    ],
    "note": "介绍依据公开仓库整理，未将仓库记录视为本站独立运行验证。",
    "source": "https://github.com/Crystalclear9/OperationSystem"
  },
  {
    "id": "computercomposition",
    "title": "ComputerCompostionTeamWork",
    "repository": "ComputerCompostionTeamWork",
    "category": "课程实践",
    "icon": "layers",
    "subtitle": "计算机组成课程的电路实践。",
    "description": "保存课程团队实践中的电路文件，包括时钟、显示、计分及游戏对象相关模块。以仓库中的电路工程为主要入口，供查看模块连接与逻辑实现。",
    "tags": [
      "数字电路",
      "课程设计"
    ],
    "details": [
      {
        "title": "内容概览",
        "text": "保存课程团队实践中的电路文件，包括时钟、显示、计分及游戏对象相关模块。以仓库中的电路工程为主要入口，供查看模块连接与逻辑实现。"
      },
      {
        "title": "阅读与使用",
        "text": "实现、运行条件与维护记录见公开仓库。"
      }
    ],
    "note": "介绍依据公开仓库整理，未将仓库记录视为本站独立运行验证。",
    "source": "https://github.com/Crystalclear9/ComputerCompostionTeamWork"
  },
  {
    "id": "ailearning",
    "title": "AILearning",
    "repository": "AILearning",
    "category": "学习资料",
    "icon": "layers",
    "subtitle": "按主题组织的 AI 学习教材。",
    "description": "从数学与编程基础延伸到机器学习、深度学习和研究专题，通过推导、图解、代码与练习梳理概念。本站文章区提供分层目录和独立章节，也可在源码仓库阅读。",
    "tags": [
      "Markdown",
      "数学",
      "AI"
    ],
    "details": [
      {
        "title": "内容概览",
        "text": "从数学与编程基础延伸到机器学习、深度学习和研究专题，通过推导、图解、代码与练习梳理概念。本站文章区提供分层目录和独立章节，也可在源码仓库阅读。"
      },
      {
        "title": "阅读与使用",
        "text": "实现、运行条件与维护记录见公开仓库。"
      }
    ],
    "note": "介绍依据公开仓库整理，未将仓库记录视为本站独立运行验证。",
    "source": "https://github.com/Crystalclear9/AILearning"
  },
  {
    "id": "selfpage",
    "title": "SelfPage",
    "repository": "SelfPage",
    "category": "应用",
    "icon": "phone",
    "subtitle": "个人项目、文章与论文的静态站点。",
    "description": "使用 React 与 Vite 构建个人主页，通过静态预渲染提供项目说明和独立文章。围绕公式、代码高亮、本地图片和页面导航维护统一的阅读体验。",
    "tags": [
      "React",
      "Vite",
      "GitHub Pages"
    ],
    "details": [
      {
        "title": "内容概览",
        "text": "使用 React 与 Vite 构建个人主页，通过静态预渲染提供项目说明和独立文章。围绕公式、代码高亮、本地图片和页面导航维护统一的阅读体验。"
      },
      {
        "title": "阅读与使用",
        "text": "实现、运行条件与维护记录见公开仓库。"
      }
    ],
    "note": "介绍依据公开仓库整理，未将仓库记录视为本站独立运行验证。",
    "source": "https://github.com/Crystalclear9/SelfPage"
  }
];
export const extraLinks = [];
