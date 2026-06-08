import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { getResearchAreas } from '@/lib/site';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'Research' };

export default function ResearchPage() {
  const lang = getLang();
  const d = getDict(lang);
  const researchAreas = getResearchAreas(lang);

  return (
    <PageContainer className="py-14">
      <SectionHeader
        eyebrow={d.research.eyebrow}
        title={d.research.title}
        description={d.research.description}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {researchAreas.map((area) => (
          <ResearchCard key={area.id} area={area} />
        ))}
      </div>
    </PageContainer>
  );
}
