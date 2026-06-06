import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import type { ModelCard as ModelCardType, ModelStatus } from '@/lib/types';

const statusTone: Record<ModelStatus, 'neutral' | 'info' | 'success'> = {
  'Coming soon': 'neutral',
  Prototype: 'info',
  Available: 'success',
};

export function ModelCard({ model }: { model: ModelCardType }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 text-primary">{model.name}</h3>
        <Badge tone={statusTone[model.status]}>{model.status}</Badge>
      </div>

      <p className="mt-2 text-sm text-ink-secondary">{model.description}</p>
      <p className="mt-3 text-caption text-ink-muted">
        <span className="font-medium text-ink-secondary">Context: </span>
        {model.clinicalContext}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-caption text-ink-muted">Version {model.version}</span>
        <Link
          href={model.route}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          View details →
        </Link>
      </div>

      <p className="mt-3 text-caption text-ink-muted">{model.disclaimer}</p>
    </article>
  );
}
