import { Badge } from '@/components/ui/Badge';
import type { NewsItem } from '@/lib/types';
import { getDict, getLang } from '@/lib/getLang';

export function NewsCard({ news }: { news: NewsItem }) {
  const lang = getLang();
  const d = getDict(lang);
  const date = new Date(news.date).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return (
    <article className="border-b border-border bg-card pb-4">
      <div className="flex items-center justify-between gap-3">
        <Badge tone="neutral">{d.news.categories[news.category] ?? news.category}</Badge>
        <time className="text-caption text-ink-muted" dateTime={news.date}>
          {date}
        </time>
      </div>
      <h3 className="mt-2.5 text-base font-semibold leading-snug text-primary">{news.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{news.summary}</p>
    </article>
  );
}
