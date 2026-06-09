/**
 * Lightweight, dependency-free i18n dictionaries. This module is client-safe
 * (no next/headers). The active language is read server-side via getLang() in
 * `lib/getLang.ts`; the default is Chinese ('zh'). Free-text placeholder content
 * in /data JSON is intentionally left as-is (data-structure lock); only UI chrome
 * and enumerable labels are translated here.
 */
export type Lang = 'zh' | 'en';

export const LANG_COOKIE = 'lang';
export const DEFAULT_LANG: Lang = 'zh';

type Dict = {
  brand: string;
  labName: string;
  institution: string;
  tagline: string;
  nav: Record<string, string>;
  langToggle: { label: string; aria: string };
  hero: { sections: { research: string; people: string; publications: string } };
  home: {
    aboutEyebrow: string;
    aboutBody: string;
    aboutMore: string;
    researchEyebrow: string;
    researchTitle: string;
    more: string;
    peopleEyebrow: string;
    peopleSummary: string;
    peopleMore: string;
    pubEyebrow: string;
    pubTitle: string;
    pubAll: string;
    toolsEyebrow: string;
    toolsBody: string;
    toolsMore: string;
    newsEyebrow: string;
    newsTitle: string;
    contactEyebrow: string;
    contactBody: string;
    contactMore: string;
  };
  about: {
    eyebrow: string;
    overviewTitle: string;
    overviewBody: string;
    missionTitle: string;
    missionBody: string;
    visionTitle: string;
    visionBody: string;
    strengthsTitle: string;
    strengths: string[];
    piTitle: string;
    piName: string;
    piBio: string;
  };
  research: { eyebrow: string; title: string; description: string; methodsLabel: string };
  members: {
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    emptyDesc: string;
    interests: string;
    groups: Record<string, string>;
    roles: Record<string, string>;
  };
  alumni: {
    eyebrow: string;
    title: string;
    description: string;
    caption: string;
    empty: string;
    emptyDesc: string;
  };
  publications: { eyebrow: string; title: string; description: string; selected: string; empty: string; emptyDesc: string };
  models: {
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    emptyDesc: string;
    intendedUse: string;
    version: string;
    viewDetails: string;
    status: Record<string, string>;
    detail: {
      back: string;
      sections: { title: string; body: string }[];
      placeholderNote: string;
      ask: string;
      toolHeading: string;
      openNewTab: string;
    };
  };
  news: { categories: Record<string, string> };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    address: string;
    email: string;
    collab: string;
    collabBody: string;
    students: string;
    studentsBody: string;
    mapNote: string;
  };
  footer: { navigate: string; contact: string; rights: string; privacy: string };
  notFound: { code: string; title: string; body: string; home: string };
  disclaimer: { heading: string; en: string; zh: string };
};

const en: Dict = {
  brand: 'Zheng Lab',
  labName: 'Zheng Laboratory',
  institution:
    'Department of Immunology, Tongji Medical College, Huazhong University of Science and Technology · Wuhan',
  tagline:
    'An immunology laboratory studying alarmin-driven inflammation, autoimmunity, transplant immunology, and interpretable medical prediction models.',
  nav: {
    '/': 'Home',
    '/about': 'About',
    '/research': 'Research',
    '/members': 'Members',
    '/alumni': 'Alumni',
    '/publications': 'Publications',
    '/models': 'Models',
    '/contact': 'Contact',
  },
  langToggle: { label: '中文', aria: 'Switch to Chinese' },
  hero: { sections: { research: 'Research', people: 'People', publications: 'Publications' } },
  home: {
    aboutEyebrow: 'About the lab',
    aboutBody:
      'The laboratory studies how alarmins such as HMGB1 and the IL-33/ST2 axis drive inflammation and shape immune responses in autoimmunity, neuroinflammation, and transplantation. We combine immunological models, cellular and molecular analysis, and interpretable machine learning.',
    aboutMore: 'More about the lab →',
    researchEyebrow: 'Research',
    researchTitle: 'Research focus',
    more: 'More →',
    peopleEyebrow: 'People',
    peopleSummary:
      'The group includes the principal investigator and two professors, one technician, four PhD students, three master’s students, and joint-training and visiting students.',
    peopleMore: 'Meet the people →',
    pubEyebrow: 'Publications',
    pubTitle: 'Selected publications',
    pubAll: 'All publications →',
    toolsEyebrow: 'Research tools',
    toolsBody:
      'Selected research tools and prediction model prototypes are under development and provided for methodological demonstration; research and educational use only.',
    toolsMore: 'View research tools →',
    newsEyebrow: 'Updates',
    newsTitle: 'Recent news',
    contactEyebrow: 'Contact',
    contactBody: 'The laboratory welcomes research collaborations and prospective students.',
    contactMore: 'Contact details →',
  },
  about: {
    eyebrow: 'About',
    overviewTitle: 'Overview',
    overviewBody:
      'We are an immunology laboratory in the Department of Immunology, Tongji Medical College, Huazhong University of Science and Technology. Our work centers on alarmins — HMGB1 and the IL-33/ST2 axis — and how they drive inflammation and shape immune responses in autoimmunity, neuroinflammation, and transplantation, complemented by interpretable machine-learning models that connect immune and clinical data.',
    missionTitle: 'Mission',
    missionBody:
      'To clarify how alarmins and innate immune signals drive inflammation and autoimmunity, and to translate these mechanisms into a better understanding of immune-mediated disease.',
    visionTitle: 'Vision',
    visionBody:
      'A research environment that combines rigorous immunology with transparent, reproducible data analysis and interpretable models.',
    strengthsTitle: 'Platform & technical strengths',
    strengths: [
      'Autoimmune and neuroinflammation models (experimental autoimmune encephalomyelitis)',
      'Transplant immunology models (cardiac allograft vasculopathy)',
      'Immune cell function: NK cells, dendritic cells, basophils',
      'Alarmin biology: HMGB1 and IL-33/ST2 signaling',
      'Multi-omics (proteomic / transcriptomic) and interpretable machine learning',
    ],
    piTitle: 'Principal Investigator',
    piName: 'Prof. Zheng Fang — Professor & Principal Investigator',
    piBio:
      'Professor in the Department of Immunology, Tongji Medical College, Huazhong University of Science and Technology. PhD in Immunology (Tongji Medical College); former visiting scholar in Dr. Ferid Murad’s laboratory at the University of Texas. Her research focuses on alarmins (HMGB1, IL-33) in inflammation, autoimmunity, and transplant immunology.',
  },
  research: {
    eyebrow: 'Research',
    title: 'Research focus',
    description:
      'Our work connects alarmin biology, autoimmunity and neuroinflammation, transplant immunology, and interpretable prediction across four themes.',
    methodsLabel: 'Methods & keywords',
  },
  members: {
    eyebrow: 'People',
    title: 'Members',
    description:
      'The group includes the principal investigator and two professors, one technician, four PhD students, three master’s students, and joint-training and visiting students.',
    empty: 'No members listed yet',
    emptyDesc: 'Add entries to data/members.json.',
    interests: 'Research interests:',
    groups: {
      PI: 'Principal Investigator',
      Faculty: 'Faculty',
      'Technical Staff': 'Technical Staff',
      'PhD Students': 'PhD Students',
      'Master Students': 'Master Students',
      'Joint-Training PhD': 'Joint-Training PhD Students',
      'Visiting Students': 'Visiting Students',
    },
    roles: {
      'Professor & Principal Investigator': 'Professor & Principal Investigator',
      Professor: 'Professor',
      'Research Technician': 'Research Technician',
      'PhD Student': 'PhD Student',
      'Master Student': 'Master Student',
      'Joint-Training PhD Student': 'Joint-Training PhD Student',
      'Visiting Student': 'Visiting Student',
    },
  },
  alumni: {
    eyebrow: 'Alumni',
    title: 'Alumni',
    description: 'Former lab members across the years. A detailed alumni roster will be added later.',
    caption: 'Lab family photo · taken September 10, 2024 (to be continued)',
    empty: 'Alumni information will be updated as the laboratory grows.',
    emptyDesc: '',
  },
  publications: {
    eyebrow: 'Publications',
    title: 'Selected publications',
    description: 'Representative work from the laboratory (corresponding author marked with *).',
    selected: 'Selected',
    empty: 'No publications listed yet',
    emptyDesc: 'Add entries to data/publications.json.',
  },
  models: {
    eyebrow: 'Research tools',
    title: 'Research tools and model prototypes',
    description:
      'Interpretable, version-tracked model prototypes provided for methodological demonstration. Each declares its research context, status, and limitations. Research and educational use only.',
    empty: 'No models listed yet',
    emptyDesc: 'Add entries to data/models.json.',
    intendedUse: 'Intended use',
    version: 'Version',
    viewDetails: 'View model details →',
    status: { 'Coming soon': 'Coming soon', Prototype: 'Prototype', Available: 'Available' },
    detail: {
      back: '← Back to models',
      sections: [
        { title: 'Model overview', body: '' },
        { title: 'Intended use', body: '' },
        {
          title: 'Input variables',
          body: 'Placeholder — the input variable schema and a validated prediction form will be added here.',
        },
        {
          title: 'Prediction & risk output',
          body: 'Placeholder — model output, risk stratification, and confidence will appear here once inference is connected to the backend.',
        },
        {
          title: 'Interpretation',
          body: 'Placeholder — variable-level explanation (e.g., SHAP) and guidance on how to read the result.',
        },
        {
          title: 'Performance metrics',
          body: 'Placeholder — discrimination, calibration, and validation cohort details.',
        },
        {
          title: 'Not applicable to',
          body: 'Placeholder — populations and scenarios where this model should not be used.',
        },
        { title: 'Citation', body: 'Placeholder — how to cite this model and the underlying study.' },
      ],
      placeholderNote:
        'This is a structural placeholder. The interactive prediction form will call the backend API (POST /api/predict/<model>) and render results here. Until then, no inference is performed.',
      ask: 'Ask about this model',
      toolHeading: 'Interactive tool',
      openNewTab: 'Open in a new tab ↗',
    },
  },
  news: { categories: { Project: 'Project', Publication: 'Publication', People: 'People' } },
  contact: {
    eyebrow: 'Contact',
    title: 'Contact and collaboration',
    description: 'The laboratory welcomes research collaborations and prospective students.',
    address: 'Address',
    email: 'Email',
    collab: 'Collaboration',
    collabBody:
      'For collaborations in immunology, inflammation, transplant immunology, or interpretable clinical prediction, please reach out by email with a short description of your interest.',
    students: 'Prospective students',
    studentsBody:
      'We consider motivated PhD and master’s students with backgrounds in immunology, basic medicine, or related fields. Include your CV and a brief statement of research interest.',
    mapNote: 'Map placeholder — embed an institutional map here later.',
  },
  footer: {
    navigate: 'Navigate',
    contact: 'Contact',
    rights: 'All rights reserved.',
    privacy: 'This site does not process real patient-level or personally identifiable data.',
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has moved.',
    home: 'Back to home',
  },
  disclaimer: {
    heading: 'Research-use disclaimer / 研究用途声明',
    en: 'This tool is intended for research and educational use only. It is not a substitute for professional medical judgment, diagnosis, or treatment.',
    zh: '本工具仅用于科研和教学展示，不构成临床诊断、治疗建议或个体化医疗决策依据。',
  },
};

const zh: Dict = {
  brand: 'Zheng Lab',
  labName: '郑芳课题组',
  institution: '华中科技大学同济医学院基础医学院免疫学系 · 武汉',
  tagline:
    '一个免疫学课题组，研究警报素驱动的炎症、自身免疫、移植免疫与可解释医学预测模型。',
  nav: {
    '/': '首页',
    '/about': '关于',
    '/research': '研究',
    '/members': '成员',
    '/alumni': '校友',
    '/publications': '论文',
    '/models': '模型',
    '/contact': '联系',
  },
  langToggle: { label: 'EN', aria: '切换到英文' },
  hero: { sections: { research: '研究方向', people: '团队成员', publications: '代表论文' } },
  home: {
    aboutEyebrow: '实验室简介',
    aboutBody:
      '本课题组研究 HMGB1、IL-33/ST2 轴等警报素如何驱动炎症，并塑造自身免疫、神经炎症与移植等疾病中的免疫应答，结合免疫学模型、细胞与分子分析以及可解释机器学习。',
    aboutMore: '了解更多 →',
    researchEyebrow: '研究',
    researchTitle: '研究方向',
    more: '更多 →',
    peopleEyebrow: '团队',
    peopleSummary:
      '课题组由负责人与两位教授、1 位技术员、4 位博士研究生、3 位硕士研究生，以及联合培养与交流学生组成。',
    peopleMore: '查看团队成员 →',
    pubEyebrow: '论文',
    pubTitle: '代表性论文',
    pubAll: '全部论文 →',
    toolsEyebrow: '研究工具',
    toolsBody:
      '部分研究工具与预测模型原型正在开发中，仅用于方法学演示；限科研与教学用途。',
    toolsMore: '查看研究工具 →',
    newsEyebrow: '动态',
    newsTitle: '近期动态',
    contactEyebrow: '联系',
    contactBody: '实验室欢迎科研合作与有意向的学生。',
    contactMore: '联系方式 →',
  },
  about: {
    eyebrow: '关于',
    overviewTitle: '概述',
    overviewBody:
      '本课题组隶属于华中科技大学同济医学院基础医学院免疫学系。研究围绕警报素——HMGB1 与 IL-33/ST2 轴——展开，探讨其如何驱动炎症并塑造自身免疫、神经炎症与移植中的免疫应答，并结合可解释机器学习模型关联免疫与临床数据。',
    missionTitle: '使命',
    missionBody:
      '阐明警报素与固有免疫信号如何驱动炎症与自身免疫，并将这些机制转化为对免疫相关疾病的更深理解。',
    visionTitle: '愿景',
    visionBody:
      '营造一个将严谨免疫学研究与透明、可重复的数据分析及可解释模型相结合的研究环境。',
    strengthsTitle: '平台与技术特色',
    strengths: [
      '自身免疫与神经炎症模型（实验性自身免疫性脑脊髓炎）',
      '移植免疫模型（心脏移植物血管病变）',
      '免疫细胞功能：NK 细胞、树突状细胞、嗜碱性粒细胞',
      '警报素生物学：HMGB1 与 IL-33/ST2 信号',
      '多组学（蛋白/转录组）与可解释机器学习',
    ],
    piTitle: '课题组负责人',
    piName: '郑芳 教授 — 课题组负责人',
    piBio:
      '华中科技大学同济医学院免疫学系教授，免疫学博士；曾于美国德州大学 Ferid Murad 实验室访学。主要研究警报素（HMGB1、IL-33）在炎症、自身免疫与移植免疫中的作用。',
  },
  research: {
    eyebrow: '研究',
    title: '研究方向',
    description: '我们的工作围绕四个方向，贯通警报素生物学、自身免疫与神经炎症、移植免疫与可解释预测。',
    methodsLabel: '方法与关键词',
  },
  members: {
    eyebrow: '团队',
    title: '团队成员',
    description:
      '课题组由负责人与两位教授、1 位技术员、4 位博士研究生、3 位硕士研究生，以及联合培养与交流学生组成。',
    empty: '暂无成员',
    emptyDesc: '请在 data/members.json 中添加条目。',
    interests: '研究兴趣：',
    groups: {
      PI: '课题组负责人',
      Faculty: '教授',
      'Technical Staff': '技术人员',
      'PhD Students': '博士研究生',
      'Master Students': '硕士研究生',
      'Joint-Training PhD': '联合培养博士生',
      'Visiting Students': '交流学生',
    },
    roles: {
      'Professor & Principal Investigator': '教授 / 课题组负责人',
      Professor: '教授',
      'Research Technician': '研究技术员',
      'PhD Student': '博士研究生',
      'Master Student': '硕士研究生',
      'Joint-Training PhD Student': '联合培养博士研究生',
      'Visiting Student': '交流学生',
    },
  },
  alumni: {
    eyebrow: '校友',
    title: '历届成员',
    description: '实验室历届成员合影。详细校友名录后续补充。',
    caption: '师门合影 · 2024 年 9 月 10 日留念（未完待续）',
    empty: '校友信息将随实验室发展逐步更新。',
    emptyDesc: '',
  },
  publications: {
    eyebrow: '论文',
    title: '代表性论文',
    description: '实验室的代表性研究工作（通讯作者以 * 标注）。',
    selected: '代表作',
    empty: '暂无论文',
    emptyDesc: '请在 data/publications.json 中添加条目。',
  },
  models: {
    eyebrow: '研究工具',
    title: '研究工具与模型原型',
    description:
      '可解释、可追溯版本的模型原型，仅用于方法学演示。每个原型均说明其研究背景、状态与局限。限科研与教学用途。',
    empty: '暂无模型',
    emptyDesc: '请在 data/models.json 中添加条目。',
    intendedUse: '适用场景',
    version: '版本',
    viewDetails: '查看模型详情 →',
    status: { 'Coming soon': '即将推出', Prototype: '原型', Available: '可用' },
    detail: {
      back: '← 返回模型列表',
      sections: [
        { title: '模型概述', body: '' },
        { title: '适用研究场景', body: '' },
        { title: '输入变量', body: '占位——输入变量结构与经校验的预测表单将在此添加。' },
        {
          title: '预测与风险输出',
          body: '占位——模型输出、风险分层与置信度将在接入后端推理后在此显示。',
        },
        { title: '结果解释', body: '占位——变量层面的解释（如 SHAP）及结果解读指引。' },
        { title: '性能指标', body: '占位——区分度、校准度与验证队列信息。' },
        { title: '不适用情形', body: '占位——本模型不应使用的人群与场景。' },
        { title: '引用方式', body: '占位——本模型及相关研究的引用方式。' },
      ],
      placeholderNote:
        '此为结构占位。交互式预测表单将调用后端接口（POST /api/predict/<model>）并在此渲染结果；在此之前不执行任何推理。',
      ask: '咨询此模型',
      toolHeading: '交互式工具',
      openNewTab: '在新标签页打开 ↗',
    },
  },
  news: { categories: { Project: '项目', Publication: '论文', People: '人员' } },
  contact: {
    eyebrow: '联系',
    title: '联系与合作',
    description: '实验室欢迎科研合作与有意向的学生。',
    address: '地址',
    email: '邮箱',
    collab: '合作',
    collabBody:
      '如希望在免疫学、炎症、移植免疫或可解释临床预测方向开展合作，请邮件联系并简要说明您的兴趣。',
    students: '招生',
    studentsBody:
      '我们欢迎具有免疫学、基础医学或相关背景，且有志于研究的博士、硕士研究生。请附上简历与简短的研究兴趣陈述。',
    mapNote: '地图占位——后续可在此嵌入机构地图。',
  },
  footer: {
    navigate: '导航',
    contact: '联系',
    rights: '版权所有。',
    privacy: '本网站不处理真实的患者级或可识别个人身份的数据。',
  },
  notFound: {
    code: '404',
    title: '页面未找到',
    body: '您访问的页面不存在或已移动。',
    home: '返回首页',
  },
  disclaimer: {
    heading: '研究用途声明 / Research-use disclaimer',
    en: 'This tool is intended for research and educational use only. It is not a substitute for professional medical judgment, diagnosis, or treatment.',
    zh: '本工具仅用于科研和教学展示，不构成临床诊断、治疗建议或个体化医疗决策依据。',
  },
};

const dicts: Record<Lang, Dict> = { en, zh };

/** Get the dictionary for a language (defaults to Chinese). */
export function getDict(lang: Lang): Dict {
  return dicts[lang] ?? dicts.zh;
}
