import type { Config } from 'tailwindcss';

/**
 * Design system for a medical / biomedical research lab.
 * Academic-restraint direction: white / cool-gray surfaces, deep navy primary,
 * gray-blue neutrals dominant; the medical green is desaturated and used sparingly
 * (small status/keyword accents only — never as a filled button). Borders are
 * preferred over shadows. Tokens are mirrored as CSS variables (see globals.css)
 * so a future Figma hand-off can re-skin the site by editing variables only.
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
          DEFAULT: '#1b3a5b', // deep navy — headings, nav, the rare filled action
          dark: '#142c45',
          light: '#27567f',
        },
        secondary: {
          DEFAULT: '#3a6188', // muted slate-blue — links, quiet accents
        },
        accent: {
          DEFAULT: '#3f6f5e', // desaturated medical green — used sparingly
          dark: '#335a4c',
          light: '#eef3f0', // very subtle tint
        },
        // Surfaces
        background: '#ffffff',
        muted: '#f8fafc',       // cool, very light section background
        card: '#ffffff',
        border: '#dbe2ea',      // light gray-blue hairline
        // Text
        ink: {
          DEFAULT: '#1f2a37',   // text primary (slate)
          secondary: '#566476', // text secondary
          muted: '#8a94a3',     // small captions
        },
        // Status (kept calm — informational, never alarming)
        info: '#2f5d8a',
        success: '#3f6f5e',
        warning: '#9a6b1f',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1080px', // global page max width — narrower for a small-group feel
      },
      spacing: {
        navbar: '4rem', // 64px navbar height
      },
      borderRadius: {
        card: '0.375rem', // moderate, not SaaS-rounded
      },
      boxShadow: {
        // Near-flat: borders carry structure. Kept for the rare deliberate lift.
        card: 'none',
        'card-hover': '0 1px 2px 0 rgba(16, 24, 40, 0.06)',
      },
      fontSize: {
        // Semantic type scale — restrained, academic (not oversized).
        'display': ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h1': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.075rem', { lineHeight: '1.4', fontWeight: '600' }],
        'caption': ['0.8125rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};

export default config;
