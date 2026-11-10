export const profile = {
  name: "洪光熠",
  role: "游戏 UI 动效设计师",
  classYear: "2027 届",
  school: "西安美术学院",
  major: "环境设计 · 本科",
  educationYears: "2023—2027",
  rank: "专业排名 1 / 60",
  rankNote: "简历注明：年级前 1%",
  contacts: {
    wechat: "Gyyy915",
    email: "3198878429@qq.com",
    phone: "13384971253"
  },
  skills: ["After Effects", "Spine", "Unity", "Premiere", "Photoshop", "Illustrator", "InDesign"]
};

export const categories = [
  { id: "all", label: "全部作品" },
  { id: "event", label: "活动运营" },
  { id: "system", label: "系统交互" },
  { id: "combat", label: "副本战斗" }
];

export const projects = [
  {
    id: "001",
    category: "event",
    categoryLabel: "活动界面",
    title: "常驻活动 · 控制台入场",
    duration: "13.4 秒",
    poster: "media/poster/001.webp",
    previewUrl: "media/preview/001.mp4",
    videoUrl: "media/video/001.mp4",
    focus: ["暗场显影", "模块入场", "信息落位"],
    summary: "从暗场与扫描线进入活动控制台，随后显出成组的任务模块与状态信息。",
    role: "游戏 UI 动效作品"
  },
  {
    id: "002",
    category: "system",
    categoryLabel: "抽取流程",
    title: "卡池抽取 · 召唤与揭示",
    duration: "20.4 秒",
    poster: "media/poster/002.webp",
    previewUrl: "media/preview/002.mp4",
    videoUrl: "media/video/002.mp4",
    focus: ["卡池选择", "抽取反馈", "结果揭示"],
    summary: "片段覆盖卡池选择、抽取操作、召唤光效与结果展示，信息反馈跟随流程推进。",
    role: "游戏 UI 动效作品"
  },
  {
    id: "003",
    category: "combat",
    categoryLabel: "副本入口",
    title: "副本入场 · 主题关卡",
    duration: "10.9 秒",
    poster: "media/poster/003.webp",
    previewUrl: "media/preview/003.mp4",
    videoUrl: "media/video/003.mp4",
    focus: ["关卡信息", "角色聚焦", "操作层级"],
    summary: "以角色主视觉建立入口焦点，同时保留关卡列表、活动信息与进入操作。",
    role: "游戏 UI 动效作品"
  },
  {
    id: "004",
    category: "event",
    categoryLabel: "主题活动",
    title: "特别活动 · 主题界面",
    duration: "15.2 秒",
    poster: "media/poster/004.webp",
    previewUrl: "media/preview/004.mp4",
    videoUrl: "media/video/004.mp4",
    focus: ["粒子转场", "主界面显现", "活动入口"],
    summary: "从红黑粒子转场进入活动主界面，让主题视觉与任务入口依次成为阅读重点。",
    role: "游戏 UI 动效作品"
  },
  {
    id: "005",
    category: "event",
    categoryLabel: "周年活动",
    title: "周年庆 · 奖励浏览",
    duration: "21.0 秒",
    poster: "media/poster/005.webp",
    previewUrl: "media/preview/005.mp4",
    videoUrl: "media/video/005.mp4",
    focus: ["周年主视觉", "奖励节点", "领取反馈"],
    summary: "周年视觉、奖励信息与角色展示共同构成活动浏览路径，呈现从浏览到领取的界面状态。",
    role: "游戏 UI 动效作品"
  },
  {
    id: "006",
    category: "system",
    categoryLabel: "角色成长",
    title: "等级提升 · 成长反馈",
    duration: "10 秒",
    poster: "media/poster/006.png",
    previewUrl: "media/video/006.mp4",
    videoUrl: "media/video/006.mp4",
    focus: ["等级跃迁", "角色成长", "数值反馈"],
    summary: "呈现等级跃迁与角色信息更新，让成长结果一眼可读。",
    role: "游戏 UI 动效作品"
  }
];

export const experience = [
  {
    period: "2026.06—2026.08",
    type: "训练营项目",
    title: "叠纸游戏《恋与深空》NOVA 训练营",
    lead: "完成 8 套游戏 UI 交互动效输出",
    detail: "包含弹窗弹出与收起、页面切换、按钮状态、模块展开和反馈动效；输出 DEMO 与交付资源，并参与评审、UE 对接和动效迭代。",
    tags: ["8 套动效", "交互状态", "输出与落地"]
  },
  {
    period: "2025.11—至今",
    type: "专业实践",
    title: "天津关键帧科技有限公司 · UI 动效",
    lead: "系统研习游戏 UI 动效制作全流程",
    detail: "结合环境设计专业训练，持续练习游戏美术风格适配、动效设计与标准化制作流程。",
    tags: ["游戏 UI", "动效流程", "美术适配"]
  },
  {
    period: "2024.12—2025.12",
    type: "视觉传播实践",
    title: "新浪微博校园 · 全国设计实习生",
    lead: "日常海报、节气内容与大型活动视觉动效",
    detail: "独立完成 300 张日常签到及节气海报；公益活动覆盖 2594 所高校、形成 21 个热搜话题，活动总阅读增量 6.2 亿。",
    tags: ["300 张设计", "3W+ 浏览", "6.2 亿阅读增量"]
  }
];

export const principles = [
  { no: "01", title: "先讲清状态", text: "用出现、切换与反馈的先后关系，让玩家知道界面刚刚发生了什么。" },
  { no: "02", title: "再建立节奏", text: "把停顿、速度与层级放在一起考虑，让重点动作有起势、有落点。" },
  { no: "03", title: "最后落到交付", text: "对齐视觉细节与实现需求，输出演示、资源和说明，跟进落地效果。" }
];
