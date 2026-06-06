import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { researchAreas } from '@/lib/site';

export const metadata: Metadata = { title: 'Research' };

export default function ResearchPage() {
  return (
    <PageContainer className="py-16">
      <SectionHeader
        eyebrow="Research"
        title="Research directions"
        description="Our programs connect real-world evidence, biological mechanism, and interpretable prediction. Each direction has dedicated detail pages planned as projects mature."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {researchAreas.map((area) => (
          <ResearchCard key={area.id} area={area} />
        ))}
      </div>

      <p className="mt-8 text-caption text-ink-muted">
        Detailed project pages and figures will be added per direction. Structure is
        reserved for future expansion.
      </p>
    </PageContainer>
  );
}
