import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  const d = getDict(getLang());
  const a = d.about;

  return (
    <PageContainer className="py-14">
      <SectionHeader eyebrow={a.eyebrow} title={d.labName} description={d.tagline} />

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="text-h3 text-primary">{a.overviewTitle}</h3>
          <p className="mt-3 text-ink-secondary">{a.overviewBody}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border border-border bg-card p-6">
              <h4 className="font-semibold text-primary">{a.missionTitle}</h4>
              <p className="mt-2 text-sm text-ink-secondary">{a.missionBody}</p>
            </div>
            <div className="border border-border bg-card p-6">
              <h4 className="font-semibold text-primary">{a.visionTitle}</h4>
              <p className="mt-2 text-sm text-ink-secondary">{a.visionBody}</p>
            </div>
          </div>

          <h3 className="mt-10 text-h3 text-primary">{a.strengthsTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
            {a.strengths.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>

        <aside>
          <div className="border border-border bg-card p-6">
            <PlaceholderImage label="P I" className="aspect-square w-full" />
            <h4 className="mt-4 font-semibold text-primary">{a.piTitle}</h4>
            <p className="text-sm text-ink-secondary">{a.piName}</p>
            <p className="mt-2 text-caption text-ink-muted">{a.piBio}</p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
