import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import type { ModelCard as ModelCardType, ModelStatus } from '@/lib/types';
import { getDict, getLang } from '@/lib/getLang';

const statusTone: Record<ModelStatus, 'neutral' | 'info' | 'success'> = {
  'Coming soon': 'neutral',
  Prototype: 'info',
  Available: 'success',
};

export function ModelCard({ model }: { model: ModelCardType }) {
  const d = getDict(getLang());
  return (
    <article className="flex h-full flex-col border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 text-primary">{model.name}</h3>
        <Badge tone={statusTone[model.status]}>{d.models.status[model.status] ?? model.status}</Badge>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{model.description}</p>

      <dl className="mt-4 space-y-1.5 text-caption">
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-ink-secondary">{d.models.intendedUse}</dt>
          <dd className="text-ink-muted">{model.clinicalContext}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-ink-secondary">{d.models.version}</dt>
          <dd className="text-ink-muted">{model.version}</dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-border pt-3 text-caption leading-relaxed text-ink-muted">
        {model.disclaimer}
      </p>

      <div className="mt-4">
        <Link
          href={model.route}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          {d.models.viewDetails}
        </Link>
      </div>
    </article>
  );
}
