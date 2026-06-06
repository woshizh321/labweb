import { site } from '@/lib/site';
import { PageContainer } from '@/components/ui/PageContainer';
import { LinkButton } from '@/components/ui/Button';

/** Home hero — brand-forward but restrained; no heavy gradients or animation. */
export function HeroSection() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted to-white">
      <PageContainer className="py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-3 text-caption font-semibold uppercase tracking-wider text-accent">
            {site.institution}
          </p>
          <h1 className="text-display text-primary">{site.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-secondary">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/research" variant="primary">
              Explore research
            </LinkButton>
            <LinkButton href="/models" variant="secondary">
              Prediction models
            </LinkButton>
            <LinkButton href="/members" variant="ghost">
              Meet the team
            </LinkButton>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
