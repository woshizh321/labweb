import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'Alumni' };

export default function AlumniPage() {
  const d = getDict(getLang());

  return (
    <PageContainer className="py-14">
      <SectionHeader
        eyebrow={d.alumni.eyebrow}
        title={d.alumni.title}
        description={d.alumni.description}
      />

      {/* Lab family photo (names + cohorts are embedded in the image itself, so no
          per-person cards). A structured alumni roster can be added later. */}
      <figure className="mx-auto max-w-3xl">
        <div className="overflow-hidden border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/alumni-group.jpg"
            alt={d.alumni.title}
            className="h-auto w-full"
            loading="lazy"
          />
        </div>
        <figcaption className="mt-3 text-center text-sm text-ink-secondary">
          {d.alumni.caption}
        </figcaption>
      </figure>
    </PageContainer>
  );
}
