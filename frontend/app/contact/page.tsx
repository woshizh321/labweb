import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <PageContainer className="py-16">
      <SectionHeader
        eyebrow="Contact"
        title="Get in touch"
        description="We welcome research collaborations and prospective students."
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-card border border-border bg-card p-6 shadow-card">
            <h3 className="font-semibold text-primary">Address</h3>
            <p className="mt-2 text-sm text-ink-secondary">{site.institution}</p>
            <p className="text-sm text-ink-secondary">{site.address}</p>
          </div>

          <div className="rounded-card border border-border bg-card p-6 shadow-card">
            <h3 className="font-semibold text-primary">Email</h3>
            <a href={`mailto:${site.email}`} className="link-quiet mt-2 inline-block text-sm">
              {site.email}
            </a>
          </div>

          <div className="rounded-card border border-border bg-card p-6 shadow-card">
            <h3 className="font-semibold text-primary">Collaboration</h3>
            <p className="mt-2 text-sm text-ink-secondary">
              For collaborations in pharmacovigilance, real-world evidence, or interpretable
              clinical AI, please reach out by email with a short description of your interest.
            </p>
          </div>

          <div className="rounded-card border border-border bg-card p-6 shadow-card">
            <h3 className="font-semibold text-primary">Prospective students</h3>
            <p className="mt-2 text-sm text-ink-secondary">
              We consider motivated PhD, Master, and visiting students with backgrounds in
              medicine, biostatistics, bioinformatics, or data science. Include your CV and a
              brief statement of research interest.
            </p>
          </div>
        </div>

        <div className="rounded-card border border-border bg-card p-2 shadow-card">
          <PlaceholderImage
            label="Map"
            className="h-full min-h-[320px] w-full"
            rounded="rounded-md"
          />
          <p className="p-3 text-center text-caption text-ink-muted">
            Map placeholder — embed an institutional map here later.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
