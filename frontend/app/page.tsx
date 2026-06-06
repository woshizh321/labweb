import Link from 'next/link';
import { HeroSection } from '@/components/sections/HeroSection';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LinkButton } from '@/components/ui/Button';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { ModelCard } from '@/components/cards/ModelCard';
import { PublicationCard } from '@/components/cards/PublicationCard';
import { NewsCard } from '@/components/cards/NewsCard';
import { researchAreas, site } from '@/lib/site';
import { getModels, getFeaturedPublications, getNews } from '@/lib/data';

export default function HomePage() {
  const models = getModels();
  const featured = getFeaturedPublications().slice(0, 2);
  const news = getNews().slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* Research overview */}
      <PageContainer className="py-16">
        <SectionHeader
          eyebrow="What we study"
          title="Research directions"
          description="Five interconnected programs spanning real-world evidence, mechanism, and interpretable prediction."
          action={
            <LinkButton href="/research" variant="ghost">
              All research →
            </LinkButton>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {researchAreas.slice(0, 3).map((area) => (
            <ResearchCard key={area.id} area={area} />
          ))}
        </div>
      </PageContainer>

      {/* Quick entries */}
      <div className="bg-muted">
        <PageContainer className="py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/members', label: 'Members', desc: 'Meet the team' },
              { href: '/models', label: 'Prediction models', desc: 'Research tools' },
              { href: '/publications', label: 'Publications', desc: 'Representative work' },
              { href: '/contact', label: 'Contact', desc: 'Collaborate & join' },
            ].map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="rounded-card border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <p className="text-base font-semibold text-primary">{e.label}</p>
                <p className="mt-1 text-sm text-ink-secondary">{e.desc} →</p>
              </Link>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Models */}
      <PageContainer className="py-16">
        <SectionHeader
          eyebrow="Prediction platform"
          title="Research prediction models"
          description="Interpretable, version-tracked tools for research and education only — never for diagnosis."
          action={
            <LinkButton href="/models" variant="ghost">
              All models →
            </LinkButton>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </PageContainer>

      {/* Featured publications + news */}
      <div className="bg-muted">
        <PageContainer className="py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Selected work"
                title="Featured publications"
                action={
                  <LinkButton href="/publications" variant="ghost">
                    All →
                  </LinkButton>
                }
              />
              <div className="grid gap-4">
                {featured.map((p) => (
                  <PublicationCard key={p.doi} publication={p} />
                ))}
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="Updates" title="Latest news" />
              <div className="grid gap-4">
                {news.map((n) => (
                  <NewsCard key={n.title} news={n} />
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Contact strip */}
      <PageContainer className="py-16">
        <div className="rounded-card border border-border bg-primary p-8 text-white sm:p-10">
          <h2 className="text-h2 text-white">Interested in collaborating or joining?</h2>
          <p className="mt-2 max-w-2xl text-white/80">
            We welcome collaborations and prospective students across pharmacovigilance,
            real-world evidence, and interpretable clinical AI.
          </p>
          <div className="mt-6">
            <LinkButton href="/contact" variant="secondary">
              Get in touch
            </LinkButton>
          </div>
          <p className="mt-4 text-caption text-white/60">{site.email}</p>
        </div>
      </PageContainer>
    </>
  );
}
