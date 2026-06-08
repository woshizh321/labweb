import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ModelCard } from '@/components/cards/ModelCard';
import { DisclaimerBox } from '@/components/ui/DisclaimerBox';
import { EmptyState } from '@/components/ui/EmptyState';
import { getModels } from '@/lib/data';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'Models' };

export default function ModelsPage() {
  const d = getDict(getLang());
  const models = getModels();

  return (
    <PageContainer className="py-14">
      <SectionHeader
        eyebrow={d.models.eyebrow}
        title={d.models.title}
        description={d.models.description}
      />

      <div className="mb-8">
        <DisclaimerBox />
      </div>

      {models.length === 0 ? (
        <EmptyState title={d.models.empty} description={d.models.emptyDesc} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
