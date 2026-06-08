import { Badge } from '@/components/ui/Badge';
import type { ResearchArea } from '@/lib/types';
import { getDict, getLang } from '@/lib/getLang';

export function ResearchCard({ area }: { area: ResearchArea }) {
  const d = getDict(getLang());
  return (
    <article className="flex h-full flex-col border-l-2 border-l-primary/30 border-y border-r border-border bg-card p-6">
      <h3 className="text-h3 text-primary">{area.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">{area.summary}</p>
      <div className="mt-4">
        <p className="eyebrow mb-2">{d.research.methodsLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          {area.highlights.map((h) => (
            <Badge key={h} tone="accent">
              {h}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
