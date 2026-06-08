import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PublicationCard } from '@/components/cards/PublicationCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublications } from '@/lib/data';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'Publications' };

export default function PublicationsPage() {
  const d = getDict(getLang());
  // getPublications() is year-sorted; pin featured entries to the top (stable sort).
  const publications = getPublications()
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <PageContainer className="py-14">
      <SectionHeader
        eyebrow={d.publications.eyebrow}
        title={d.publications.title}
        description={d.publications.description}
      />

      {publications.length === 0 ? (
        <EmptyState title={d.publications.empty} description={d.publications.emptyDesc} />
      ) : (
        <div className="space-y-2">
          {publications.map((p) => (
            <PublicationCard key={p.doi || p.title} publication={p} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
