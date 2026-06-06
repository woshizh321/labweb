import { Badge } from '@/components/ui/Badge';
import type { NewsItem } from '@/lib/types';

export function NewsCard({ news }: { news: NewsItem }) {
  const date = new Date(news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return (
    <article className="rounded-card border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <Badge tone="accent">{news.category}</Badge>
        <time className="text-caption text-ink-muted" dateTime={news.date}>
          {date}
        </time>
      </div>
      <h3 className="mt-3 text-base font-semibold text-primary">{news.title}</h3>
      <p className="mt-1 text-sm text-ink-secondary">{news.summary}</p>
    </article>
  );
}
