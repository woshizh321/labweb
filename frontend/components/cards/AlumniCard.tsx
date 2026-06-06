import type { Alumni } from '@/lib/types';

export function AlumniCard({ alumni }: { alumni: Alumni }) {
  return (
    <article className="flex items-start justify-between gap-4 rounded-card border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="text-base font-semibold text-primary">{alumni.name}</h3>
        <p className="text-sm text-ink-secondary">
          {alumni.currentPosition} · {alumni.currentInstitution}
        </p>
        <p className="mt-1 text-caption text-ink-muted">{alumni.researchFocus}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-caption font-medium text-ink-secondary">{alumni.degree}</p>
        <p className="text-caption text-ink-muted">{alumni.period}</p>
      </div>
    </article>
  );
}
