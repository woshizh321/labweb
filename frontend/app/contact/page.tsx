import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { site } from '@/lib/site';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  const d = getDict(getLang());
  const c = d.contact;

  return (
    <PageContainer className="py-14">
      <SectionHeader eyebrow={c.eyebrow} title={c.title} description={c.description} />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="border border-border bg-card p-6">
            <h3 className="font-semibold text-primary">{c.address}</h3>
            <p className="mt-2 text-sm text-ink-secondary">{d.institution}</p>
            <p className="text-sm text-ink-secondary">{site.address}</p>
          </div>

          <div className="border border-border bg-card p-6">
            <h3 className="font-semibold text-primary">{c.email}</h3>
            <a href={`mailto:${site.email}`} className="link-quiet mt-2 inline-block text-sm">
              {site.email}
            </a>
          </div>

          <div className="border border-border bg-card p-6">
            <h3 className="font-semibold text-primary">{c.collab}</h3>
            <p className="mt-2 text-sm text-ink-secondary">{c.collabBody}</p>
          </div>

          <div className="border border-border bg-card p-6">
            <h3 className="font-semibold text-primary">{c.students}</h3>
            <p className="mt-2 text-sm text-ink-secondary">{c.studentsBody}</p>
          </div>
        </div>

        <div className="border border-border bg-card p-2">
          <PlaceholderImage
            label="Map"
            className="h-full min-h-[320px] w-full"
            rounded="rounded-md"
          />
          <p className="p-3 text-center text-caption text-ink-muted">{c.mapNote}</p>
        </div>
      </div>
    </PageContainer>
  );
}
