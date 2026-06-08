import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AlumniCard } from '@/components/cards/AlumniCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getAlumni } from '@/lib/data';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'Alumni' };

export default function AlumniPage() {
  const d = getDict(getLang());
  const alumni = getAlumni();

  return (
    <PageContainer className="py-14">
      <SectionHeader
        eyebrow={d.alumni.eyebrow}
        title={d.alumni.title}
        description={d.alumni.description}
      />

      {alumni.length === 0 ? (
        <EmptyState title={d.alumni.empty} description={d.alumni.emptyDesc} />
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
