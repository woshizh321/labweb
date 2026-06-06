import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ModelCard } from '@/components/cards/ModelCard';
import { DisclaimerBox } from '@/components/ui/DisclaimerBox';
import { EmptyState } from '@/components/ui/EmptyState';
import { getModels } from '@/lib/data';

export const metadata: Metadata = { title: 'Models' };

export default function ModelsPage() {
  const models = getModels();

  return (
    <PageContainer className="py-16">
      <SectionHeader
        eyebrow="Prediction platform"
        title="Research prediction models"
        description="A growing set of interpretable, version-tracked research tools. Each model declares its intended use, scope, and limitations. For research and education only."
      />

      <div className="mb-8">
        <DisclaimerBox />
      </div>

      {models.length === 0 ? (
        <EmptyState title="No models listed yet" description="Add entries to data/models.json." />
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
