import type { ReactNode } from 'react';

/** Consistent section heading with optional eyebrow label and description. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`}>
      <div className={`max-w-2xl ${alignment}`}>
        {eyebrow && (
          <p className="mb-2 text-caption font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="text-h2">{title}</h2>
        {description && <p className="mt-2 text-ink-secondary">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
