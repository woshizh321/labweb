import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBox } from '@/components/ui/DisclaimerBox';
import { LinkButton } from '@/components/ui/Button';
import { getModels, getModelById } from '@/lib/data';
import type { ModelStatus } from '@/lib/types';

/** Pre-render every known model id at build time. */
export function generateStaticParams() {
  return getModels().map((m) => ({ modelId: m.id }));
}

export function generateMetadata({
  params,
}: {
  params: { modelId: string };
}): Metadata {
  const model = getModelById(params.modelId);
  return { title: model ? model.name : 'Model' };
}

const statusTone: Record<ModelStatus, 'neutral' | 'info' | 'success'> = {
  'Coming soon': 'neutral',
  Prototype: 'info',
  Available: 'success',
};

/**
 * Phase-1 model detail page = structured placeholder. The sections below are the
 * reserved skeleton for future model pages (overview / intended use / input form /
 * output / interpretation / performance / citation). Real inference is NOT wired
 * up yet — only the structure is in place.
 */
export default function ModelDetailPage({ params }: { params: { modelId: string } }) {
  const model = getModelById(params.modelId);
  if (!model) notFound();

  const sections = [
    { title: 'Model overview', body: model.description },
    { title: 'Intended use', body: model.clinicalContext },
    {
      title: 'Input variables',
      body: 'Placeholder — the input variable schema and a validated prediction form will be added here.',
    },
    {
      title: 'Prediction & risk output',
      body: 'Placeholder — model output, risk stratification, and confidence will appear here once inference is connected to the backend.',
    },
    {
      title: 'Interpretation',
      body: 'Placeholder — variable-level explanation (e.g., SHAP) and guidance on how to read the result.',
    },
    {
      title: 'Performance metrics',
      body: 'Placeholder — discrimination, calibration, and validation cohort details.',
    },
    {
      title: 'Not applicable to',
      body: 'Placeholder — populations and scenarios where this model should not be used.',
    },
    {
      title: 'Citation',
      body: 'Placeholder — how to cite this model and the underlying study.',
    },
  ];

  return (
    <PageContainer className="py-16">
      <Link href="/models" className="link-quiet text-sm">
        ← Back to models
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-h1 text-primary">{model.name}</h1>
        <Badge tone={statusTone[model.status]}>{model.status}</Badge>
        <Badge tone="neutral">Version {model.version}</Badge>
      </div>
      <p className="mt-3 max-w-2xl text-ink-secondary">{model.description}</p>

      <div className="mt-8">
        <DisclaimerBox custom={model.disclaimer} />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {sections.map((s) => (
          <section
            key={s.title}
            className="rounded-card border border-border bg-card p-6 shadow-card"
          >
            <h2 className="text-h3 text-primary">{s.title}</h2>
            <p className="mt-2 text-sm text-ink-secondary">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-card border border-dashed border-border bg-muted/50 p-6">
        <p className="text-sm text-ink-secondary">
          This is a structural placeholder. The interactive prediction form will call the
          backend API (<code className="text-ink">POST /api/predict/&lt;model&gt;</code>) and
          render results here. Until then, no inference is performed.
        </p>
        <div className="mt-4">
          <LinkButton href="/contact" variant="ghost">
            Ask about this model
          </LinkButton>
        </div>
      </div>
    </PageContainer>
  );
}
