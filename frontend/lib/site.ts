import type { ResearchArea } from './types';
import type { Lang } from './i18n';

/**
 * Central site constants. Replace these placeholders with the real lab identity;
 * every page and the layout metadata read from here, so there is no hardcoded
 * lab name scattered across components.
 */
export const site = {
  name: 'Zheng Laboratory',
  shortName: 'Zheng Lab',
  institution: '[Institution / Department placeholder]',
  tagline:
    'A biomedical research laboratory focused on pharmacovigilance, real-world evidence, immune-inflammation, and interpretable medical prediction models.',
  email: 'lab@example.edu',
  address: '[Building, Street, City, Postal Code — placeholder]',
  copyrightFrom: 2024,
  nav: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/research', label: 'Research' },
    { href: '/members', label: 'Members' },
    { href: '/alumni', label: 'Alumni' },
    { href: '/publications', label: 'Publications' },
    { href: '/models', label: 'Models' },
    { href: '/contact', label: 'Contact' },
  ],
} as const;

/** Research areas — consolidated to four themes for a small group. Bilingual:
 *  resolve to a ResearchArea[] for the active language via getResearchAreas(lang). */
type Bi = { zh: string; en: string };
interface ResearchAreaI18n {
  id: string;
  title: Bi;
  summary: Bi;
  highlights: { zh: string[]; en: string[] };
}

const researchAreasI18n: ResearchAreaI18n[] = [
  {
    id: 'alarmins',
    title: {
      en: 'Alarmins and inflammation',
      zh: '警报素与炎症',
    },
    summary: {
      en: 'We study how alarmins — HMGB1 and the IL-33/ST2 axis — are actively released and form autocrine circuits that drive inflammation. Relevance: identifies upstream triggers of immune-mediated tissue injury.',
      zh: '我们研究警报素——HMGB1 与 IL-33/ST2 轴——的主动释放及其驱动炎症的自分泌环路。临床意义：揭示免疫介导组织损伤的上游触发因素。',
    },
    highlights: {
      en: ['HMGB1', 'IL-33 / ST2', 'Autocrine circuits'],
      zh: ['HMGB1', 'IL-33 / ST2', '自分泌环路'],
    },
  },
  {
    id: 'autoimmunity-neuroinflammation',
    title: {
      en: 'Autoimmunity and neuroinflammation',
      zh: '自身免疫与神经炎症',
    },
    summary: {
      en: 'We investigate autoimmune and neuroinflammatory disease using models of experimental autoimmune encephalomyelitis, lupus-like autoimmunity, psoriasis, and IgG4-related disease. Relevance: clarifies how innate signals shape autoreactive responses.',
      zh: '我们借助实验性自身免疫性脑脊髓炎、狼疮样自身免疫、银屑病与 IgG4 相关疾病等模型，研究自身免疫与神经炎症。临床意义：阐明固有免疫信号如何塑造自身反应性应答。',
    },
    highlights: {
      en: ['EAE / MS', 'Lupus-like autoimmunity', 'IgG4-RD'],
      zh: ['EAE / 多发性硬化', '狼疮样自身免疫', 'IgG4 相关疾病'],
    },
  },
  {
    id: 'transplant',
    title: {
      en: 'Transplant immunology',
      zh: '移植免疫',
    },
    summary: {
      en: 'We study chronic cardiac allograft vasculopathy and fibrosis, focusing on HMGB1/TGF-β signaling, ST2, and dendritic cells in chronic rejection. Relevance: informs strategies to limit chronic allograft injury.',
      zh: '我们研究慢性心脏移植物血管病变与纤维化，关注慢性排斥中的 HMGB1/TGF-β 信号、ST2 与树突状细胞。临床意义：为减轻慢性移植物损伤提供策略依据。',
    },
    highlights: {
      en: ['Allograft vasculopathy', 'HMGB1 / TGF-β', 'Dendritic cells'],
      zh: ['移植物血管病变', 'HMGB1 / TGF-β', '树突状细胞'],
    },
  },
  {
    id: 'ai-prediction',
    title: {
      en: 'AI-based medical prediction models',
      zh: 'AI 医学预测模型',
    },
    summary: {
      en: 'We develop interpretable machine-learning models that link immune and clinical data to disease risk and outcome prediction. Relevance: turns mechanistic and real-world data into transparent decision-support tools.',
      zh: '我们开发可解释的机器学习模型，将免疫与临床数据关联到疾病风险与结局预测。临床意义：把机制与真实世界数据转化为透明的决策支持工具。',
    },
    highlights: {
      en: ['Interpretable ML', 'Risk prediction', 'Multi-omics integration'],
      zh: ['可解释机器学习', '风险预测', '多组学整合'],
    },
  },
];

/** Resolve research areas to a single language. */
export function getResearchAreas(lang: Lang): ResearchArea[] {
  return researchAreasI18n.map((a) => ({
    id: a.id,
    title: a.title[lang],
    summary: a.summary[lang],
    highlights: a.highlights[lang],
  }));
}
