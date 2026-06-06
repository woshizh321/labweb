import type { Config } from 'tailwindcss';

/**
 * Design system for a medical / biomedical research lab.
 * Visual direction: 70% research-lab, 20% biotech institute, 10% clinical dashboard.
 * Restrained palette — white background, deep navy primary, medical green accent,
 * cool gray neutrals. Tokens are referenced as CSS variables (see globals.css) so
 * a future Figma hand-off can re-skin the site by editing variables only.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: '#13315c', // deep navy — headers, nav, primary actions
          dark: '#0d2240',
          light: '#1d4e89',
        },
        secondary: {
          DEFAULT: '#3a6ea5', // supporting blue — links, secondary accents
        },
        accent: {
          DEFAULT: '#1f9d6b', // medical green — highlights, CTAs, status "available"
          dark: '#178055',
          light: '#e6f4ee',
        },
        // Surfaces
        background: '#ffffff',
        muted: '#f5f7fa',       // muted section background
        card: '#ffffff',
        border: '#e2e8f0',
        // Text
        ink: {
          DEFAULT: '#1a2433',   // text primary
          secondary: '#5b6776', // text secondary
          muted: '#8a94a3',     // small captions
        },
        // Status (used on model pages — kept calm, not alarming)
        info: '#2563eb',
        success: '#1f9d6b',
        warning: '#b7791f',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1200px', // global page max width
      },
      spacing: {
        navbar: '4rem', // 64px navbar height
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 1px 3px 0 rgba(16, 24, 40, 0.06)',
        'card-hover': '0 4px 12px -2px rgba(16, 24, 40, 0.10)',
      },
      fontSize: {
        // Semantic type scale
        'display': ['2.75rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.175rem', { lineHeight: '1.4', fontWeight: '600' }],
        'caption': ['0.8125rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};

export default config;
