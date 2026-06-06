import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <PageContainer className="py-16">
      <SectionHeader
        eyebrow="About"
        title={site.name}
        description={site.tagline}
      />

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="text-h3 text-primary">Overview</h3>
          <p className="mt-3 text-ink-secondary">
            We are a medical and biomedical research lab working at the intersection of
            real-world clinical evidence, multi-omics mechanism, and interpretable machine
            learning. Our work spans pharmacovigilance signal detection, drug-safety risk
            modeling, immune-inflammatory mechanisms of aging, and tumor immunology — with a
            consistent emphasis on transparency, reproducibility, and clinical relevance.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-card border border-border bg-card p-6 shadow-card">
              <h4 className="font-semibold text-primary">Mission</h4>
              <p className="mt-2 text-sm text-ink-secondary">
                To turn large-scale real-world and multi-omics data into trustworthy,
                interpretable evidence that supports safer medical decisions.
              </p>
            </div>
            <div className="rounded-card border border-border bg-card p-6 shadow-card">
              <h4 className="font-semibold text-primary">Vision</h4>
              <p className="mt-2 text-sm text-ink-secondary">
                A research environment where every predictive model is transparent,
                version-tracked, and explicitly scoped — never a black box.
              </p>
            </div>
          </div>

          <h3 className="mt-10 text-h3 text-primary">Platform & technical strengths</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
            <li>• Large-scale spontaneous reporting system analysis (FAERS / JADER)</li>
            <li>• Disproportionality analysis and time-to-onset kinetics</li>
            <li>• Penalized regression and interpretable machine learning (with calibration)</li>
            <li>• Multi-omics integration and pathway-level mechanism discovery</li>
            <li>• Reproducible, containerized analysis pipelines</li>
          </ul>
        </div>

        <aside>
          <div className="rounded-card border border-border bg-card p-6 shadow-card">
            <PlaceholderImage label="P I" className="aspect-square w-full" />
            <h4 className="mt-4 font-semibold text-primary">Principal Investigator</h4>
            <p className="text-sm text-ink-secondary">[PI Name placeholder], MD, PhD</p>
            <p className="mt-2 text-caption text-ink-muted">
              Brief PI biography placeholder — research background, training, and current
              focus. Replace this with the real PI introduction.
            </p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
