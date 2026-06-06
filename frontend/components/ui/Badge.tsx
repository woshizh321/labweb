import type { ReactNode } from 'react';

type Tone = 'neutral' | 'accent' | 'info' | 'success' | 'warning';

const tones: Record<Tone, string> = {
  neutral: 'bg-muted text-ink-secondary border-border',
  accent: 'bg-accent-light text-accent-dark border-accent-light',
  info: 'bg-blue-50 text-info border-blue-100',
  success: 'bg-accent-light text-success border-accent-light',
  warning: 'bg-amber-50 text-warning border-amber-100',
};

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
