import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PublicationCard } from '@/components/cards/PublicationCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublications } from '@/lib/data';

export const metadata: Metadata = { title: 'Publications' };

export default function PublicationsPage() {
  const publications = getPublications();

  return (
    <PageContainer className="py-16">
      <SectionHeader
        eyebrow="Publications"
        title="Representative publications"
        description="Selected work from the lab. Content is driven by data/publications.json."
      />

      {publications.length === 0 ? (
        <EmptyState
          title="No publications listed yet"
          description="Add entries to data/publications.json."
        />
      ) : (
        <div className="grid gap-5">
          {publications.map((p) => (
            <PublicationCard key={p.doi || p.title} publication={p} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
