import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBox } from '@/components/ui/DisclaimerBox';
import { LinkButton } from '@/components/ui/Button';
import { getModels, getModelById } from '@/lib/data';
import type { ModelStatus } from '@/lib/types';
import { getDict, getLang } from '@/lib/getLang';
import { KawasakiPredictForm } from '@/components/models/KawasakiPredictForm';

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

// Models whose interactive tool is deployed as a static bundle under
// frontend/public/apps/<id>/. Kept here (not in models.json) to avoid changing
// the data-structure fields. The page embeds the tool below the disclaimer.
const MODEL_EMBEDS: Record<string, string> = {
  'plan-c': '/apps/plan-c/index.html',
};

// Models whose interactive tool is a native bilingual form posting to the FastAPI
// backend (path B: server-side inference). Kept in code, not in models.json.
const MODEL_NATIVE_FORMS = new Set<string>(['kawasaki-ivig']);

/**
 * Phase-1 model detail page = structured placeholder. The sections below are the
 * reserved skeleton for future model pages (overview / intended use / input form /
 * output / interpretation / performance / citation). Real inference is NOT wired
 * up yet — only the structure is in place.
 */
export default function ModelDetailPage({ params }: { params: { modelId: string } }) {
  const model = getModelById(params.modelId);
  if (!model) notFound();

  const lang = getLang();
  const d = getDict(lang);
  const md = d.models.detail;
  const embedUrl = MODEL_EMBEDS[model.id];
  const hasNativeForm = MODEL_NATIVE_FORMS.has(model.id);
  // Section bodies: first two come from model data; the rest are translated placeholders.
  const sections = md.sections.map((s, i) => ({
    title: s.title,
    body: i === 0 ? model.description : i === 1 ? model.clinicalContext : s.body,
  }));

  return (
    <PageContainer className="py-14">
      <Link href="/models" className="link-quiet text-sm">
        {md.back}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-h1 text-primary">{model.name}</h1>
        <Badge tone={statusTone[model.status]}>{d.models.status[model.status] ?? model.status}</Badge>
        <Badge tone="neutral">{d.models.version} {model.version}</Badge>
      </div>
      <p className="mt-3 max-w-2xl text-ink-secondary">{model.description}</p>

      <div className="mt-8">
        <DisclaimerBox custom={model.disclaimer} />
      </div>

      {embedUrl ? (
        /* Live interactive tool (static bundle under /apps/<id>/). */
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-h3 text-primary">{md.toolHeading}</h2>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet text-sm font-medium"
            >
              {md.openNewTab}
            </a>
          </div>
          <div className="overflow-hidden border border-border bg-card">
            <iframe
              src={embedUrl}
              title={model.name}
              loading="lazy"
              className="h-[1600px] w-full"
            />
          </div>
        </section>
      ) : hasNativeForm ? (
        /* Native bilingual form -> FastAPI inference (path B). */
        <section className="mt-10">
          <h2 className="mb-3 text-h3 text-primary">{md.toolHeading}</h2>
          <KawasakiPredictForm lang={lang} />
        </section>
      ) : (
        <>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {sections.map((s) => (
              <section key={s.title} className="border border-border bg-card p-6">
                <h2 className="text-h3 text-primary">{s.title}</h2>
                <p className="mt-2 text-sm text-ink-secondary">{s.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 border border-dashed border-border bg-muted/50 p-6">
            <p className="text-sm text-ink-secondary">{md.placeholderNote}</p>
            <div className="mt-4">
              <LinkButton href="/contact" variant="ghost">
                {md.ask}
              </LinkButton>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
