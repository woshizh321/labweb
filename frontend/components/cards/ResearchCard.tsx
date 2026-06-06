import { Badge } from '@/components/ui/Badge';
import type { ResearchArea } from '@/lib/types';

export function ResearchCard({ area }: { area: ResearchArea }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover">
      <h3 className="text-h3 text-primary">{area.title}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-secondary">{area.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {area.highlights.map((h) => (
          <Badge key={h} tone="accent">
            {h}
          </Badge>
        ))}
      </div>
    </article>
  );
}
