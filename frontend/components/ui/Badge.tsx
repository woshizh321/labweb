import type { ReactNode } from 'react';

type Tone = 'neutral' | 'accent' | 'info' | 'success' | 'warning';

// Quiet, mostly gray-blue chips. Green appears only as a faint status tint (success/accent).
const tones: Record<Tone, string> = {
  neutral: 'bg-muted text-ink-secondary border-border',
  accent: 'bg-muted text-secondary border-border',          // keyword/method chip (slate-blue)
  info: 'bg-muted text-info border-border',                  // status: prototype
  success: 'bg-accent-light text-accent-dark border-accent-light', // status: available (faint green)
  warning: 'bg-muted text-warning border-border',
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
      className={`inline-flex items-center rounded-[0.25rem] border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
