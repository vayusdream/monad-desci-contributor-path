export type TrackId = "research" | "science" | "builder" | "community";

export interface LearningResource {
  title: string;
  desc: string;
  url: string;
}

export interface RecommendedProject {
  name: string;
  desc: string;
  url: string;
}

export interface TrackTask {
  type: string;
  title: string;
  summary: string;
  estMinutes: number;
  acceptance: string[];
  submissionHint: string;
}

export interface Track {
  id: TrackId;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  accent: string;
  participants: number;
  avgHours: string;
  resources: LearningResource[];
  projects: RecommendedProject[];
  task: TrackTask;
}

export const TRACKS: Record<TrackId, Track> = {
  research: {
    id: "research",
    name: "Research",
    nameEn: "Research",
    tagline: "把你的第一篇 Research Note 留在链上",
    description:
      "从阅读一篇开放科学论文开始,学会用最小成本产出一份可被引用的研究笔记。",
    accent: "#1e3a5c",
    participants: 128,
    avgHours: "2–3 小时",
    resources: [
      {
        title: "DeSci 是什么:一次说清楚",
        desc: "十分钟了解去中心化科学解决的三个系统性问题",
        url: "https://example.org/desci-101",
      },
      {
        title: "如何写一份可被引用的 Research Note",
        desc: "结构、引用规范与链上存证的最小实践",
        url: "https://example.org/research-note-guide",
      },
      {
        title: "开放科学数据集入门",
        desc: "认识 DeSci 生态里常见的开放数据集与检索方式",
        url: "https://example.org/open-data-101",
      },
    ],
    projects: [
      { name: "Molecule", desc: "IP-NFT 驱动的生物医药众筹协议", url: "https://molecule.xyz" },
      { name: "ResearchHub", desc: "开放同行评审与研究激励平台", url: "https://researchhub.com" },
      { name: "DeSci Labs", desc: "去中心化论文出版基础设施", url: "https://desci.com" },
    ],
    task: {
      type: "Research Note",
      title: "为一篇开放科学论文写一份 300 字研究笔记",
      summary:
        "任选一篇 DeSci 相关的开放获取论文或研究,提炼核心结论、方法与你的一个观察,写成一份结构化的 Research Note。",
      estMinutes: 90,
      acceptance: [
        "包含论文/研究来源链接",
        "至少 300 字,包含结论、方法、你的评论三部分",
        "使用中文或英文均可,逻辑清晰、非 AI 直接复制摘要",
      ],
      submissionHint: "粘贴你的 Research Note 全文链接(Notion / Mirror / GitHub 均可)",
    },
  },
  science: {
    id: "science",
    name: "Science",
    nameEn: "Science",
    tagline: "把一篇硬核内容翻译给更多人看懂",
    description:
      "DeSci 最大的门槛是语言与术语。用一次翻译,帮助更多华语读者跨进这个领域。",
    accent: "#3f6b45",
    participants: 96,
    avgHours: "1–2 小时",
    resources: [
      {
        title: "DeSci 术语速查表",
        desc: "IP-NFT、RetroPGF、QF 等高频词的准确译法",
        url: "https://example.org/desci-glossary",
      },
      {
        title: "科学写作的可读性原则",
        desc: "如何把硬核内容翻译得既准确又好读",
        url: "https://example.org/sci-writing",
      },
      {
        title: "DeSci 自学手册",
        desc: "一份华语 DeSci 入门公共财,适合作为翻译素材库",
        url: "https://desci-onboarding-hub.pages.dev",
      },
    ],
    projects: [
      { name: "VitaDAO", desc: "长寿研究领域的去中心化资助 DAO", url: "https://vitadao.com" },
      { name: "LabDAO", desc: "共享科研基础设施与协作工具", url: "https://labdao.xyz" },
      { name: "Bio.xyz", desc: "DeSci 生物科技孵化与加速平台", url: "https://bio.xyz" },
    ],
    task: {
      type: "翻译贡献",
      title: "翻译一段 300–500 字的 DeSci 英文内容",
      summary:
        "从推荐资源或你熟悉的 DeSci 项目文档中,挑选一段英文内容翻译成中文(或反向),保持术语准确、语句通顺。",
      estMinutes: 60,
      acceptance: [
        "标注原文来源链接",
        "术语翻译与术语表一致或有合理说明",
        "300–500 字,语句通顺、无机翻痕迹",
      ],
      submissionHint: "提交译文链接或文档,附上原文出处",
    },
  },
  builder: {
    id: "builder",
    name: "Builder",
    nameEn: "Builder",
    tagline: "提交一个真实的 GitHub Issue 或 PR",
    description:
      "最快建立信誉的方式就是直接动手。从一个 good-first-issue 开始你的开源贡献记录。",
    accent: "#c0532d",
    participants: 154,
    avgHours: "2–4 小时",
    resources: [
      {
        title: "如何找到适合新手的 Issue",
        desc: "识别 good-first-issue / help-wanted 标签的实用技巧",
        url: "https://example.org/find-good-first-issue",
      },
      {
        title: "写一份高质量 PR 描述",
        desc: "让 maintainer 一眼看懂你做了什么、为什么这么做",
        url: "https://example.org/pr-writing",
      },
      {
        title: "Solidity 与 EVM 开发入门",
        desc: "如果你想直接参与链上代码贡献,从这里开始",
        url: "https://example.org/solidity-101",
      },
    ],
    projects: [
      { name: "DeSci Labs", desc: "开源论文出版协议栈,长期招募贡献者", url: "https://github.com/desci-labs" },
      { name: "Molecule Protocol", desc: "IP-NFT 智能合约与前端均开源", url: "https://github.com/moleculeprotocol" },
      { name: "OpenAlex", desc: "开放学术图谱数据基础设施", url: "https://github.com/ourresearch" },
    ],
    task: {
      type: "GitHub Issue / PR",
      title: "在一个 DeSci 开源仓库提交一个 Issue 或 PR",
      summary:
        "选择一个 DeSci 相关开源仓库,提交一个有效的 bug report / 文档修正 / 小功能 PR,不需要很大,但要真实可验证。",
      estMinutes: 120,
      acceptance: [
        "Issue 或 PR 链接可公开访问",
        "内容具体、可被 maintainer 理解和处理",
        "非重复 / 非灌水内容",
      ],
      submissionHint: "粘贴你的 GitHub Issue 或 PR 链接",
    },
  },
  community: {
    id: "community",
    name: "Community",
    nameEn: "Community",
    tagline: "帮助下一个人更快地走完这条路",
    description:
      "写一篇引导帖、回答一个新人问题、组织一次线上分享,都是社区最稀缺的贡献。",
    accent: "#8a5a9e",
    participants: 73,
    avgHours: "1 小时",
    resources: [
      {
        title: "DeSci 社区地图",
        desc: "常见的 Discord / Telegram / 论坛,以及各自的活跃话题",
        url: "https://example.org/desci-community-map",
      },
      {
        title: "如何写一篇有价值的科普帖",
        desc: "面向零背景读者的内容结构建议",
        url: "https://example.org/community-writing",
      },
      {
        title: "线上分享活动组织清单",
        desc: "从选题到复盘的最小可行流程",
        url: "https://example.org/host-a-talk",
      },
    ],
    projects: [
      { name: "DeSci Asia", desc: "亚太地区 DeSci 社区枢纽", url: "https://example.org/desci-asia" },
      { name: "Artizen", desc: "面向公共物品的众筹与提案平台", url: "https://artizen.fund" },
      { name: "DeSci World", desc: "全球 DeSci 项目与活动聚合站", url: "https://example.org/desci-world" },
    ],
    task: {
      type: "内容贡献",
      title: "写一篇 200 字以上的 DeSci 新人引导帖",
      summary:
        "用你自己理解 DeSci 的方式,写一篇面向完全新人的引导帖,可以发在 X / 小红书 / 社区论坛,帮助下一个人更快上手。",
      estMinutes: 45,
      acceptance: [
        "公开可访问的发布链接",
        "至少 200 字,面向零背景读者",
        "包含至少一个可继续深入的资源链接",
      ],
      submissionHint: "粘贴你的帖子/文章公开链接",
    },
  },
};

export const TRACK_LIST = Object.values(TRACKS);
