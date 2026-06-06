import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AlumniCard } from '@/components/cards/AlumniCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getAlumni } from '@/lib/data';

export const metadata: Metadata = { title: 'Alumni' };

export default function AlumniPage() {
  const alumni = getAlumni();

  return (
    <PageContainer className="py-16">
      <SectionHeader
        eyebrow="Alumni"
        title="Where our members are now"
        description="Former lab members and their current positions. Content is driven by data/alumni.json."
      />

      {alumni.length === 0 ? (
        <EmptyState title="No alumni listed yet" description="Add entries to data/alumni.json." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {alumni.map((a) => (
            <AlumniCard key={`${a.name}-${a.period}`} alumni={a} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
