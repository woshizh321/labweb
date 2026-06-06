import type { ResearchArea } from './types';

/**
 * Central site constants. Replace these placeholders with the real lab identity;
 * every page and the layout metadata read from here, so there is no hardcoded
 * lab name scattered across components.
 */
export const site = {
  name: 'Biomedical Data Science Lab',
  shortName: 'BDS Lab',
  institution: '[Institution / Department placeholder]',
  tagline:
    'Bridging real-world clinical evidence, multi-omics mechanisms, and interpretable AI prediction.',
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

/** Research areas are stable structure, not editorial content → kept in code. */
export const researchAreas: ResearchArea[] = [
  {
    id: 'pharmacovigilance',
    title: 'Pharmacovigilance & Real-World Research',
    summary:
      'Signal detection and disproportionality analysis across spontaneous reporting systems (FAERS / JADER) and real-world cohorts.',
    highlights: ['Disproportionality analysis', 'Time-to-onset kinetics', 'Drug safety signals'],
  },
  {
    id: 'ai-prediction',
    title: 'AI Medical Prediction Models',
    summary:
      'Interpretable, version-tracked risk models for clinical decision support — built for transparency, not black-box scoring.',
    highlights: ['Penalized regression', 'Calibration & validation', 'Explainability (SHAP)'],
  },
  {
    id: 'immuno-aging',
    title: 'Immunity, Inflammation & Aging',
    summary:
      'Mechanisms linking chronic inflammation and immune dysregulation to age-related disease trajectories.',
    highlights: ['Inflammaging', 'Immune profiling', 'Longitudinal cohorts'],
  },
  {
    id: 'tumor-immunology',
    title: 'Tumor Immunology & Hepatobiliary Toxicity',
    summary:
      'Immune checkpoint inhibitor response and immune-related hepatobiliary adverse events.',
    highlights: ['ICI toxicity', 'Hepatobiliary injury', 'Immune-related AEs'],
  },
  {
    id: 'multi-omics',
    title: 'Multi-Omics Mechanistic Research',
    summary:
      'Integrating transcriptomic, genomic, and clinical layers to move from association to mechanism.',
    highlights: ['Multi-omics integration', 'Pathway analysis', 'Mechanism discovery'],
  },
];
