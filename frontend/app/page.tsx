import Link from 'next/link';
import { HeroSection } from '@/components/sections/HeroSection';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ResearchCard } from '@/components/cards/ResearchCard';
import { PublicationCard } from '@/components/cards/PublicationCard';
import { NewsCard } from '@/components/cards/NewsCard';
import { getResearchAreas, site } from '@/lib/site';
import { getFeaturedPublications, getNews } from '@/lib/data';
import { getDict, getLang } from '@/lib/getLang';

export default function HomePage() {
  const lang = getLang();
  const d = getDict(lang);
  const researchAreas = getResearchAreas(lang);
  const featured = getFeaturedPublications().slice(0, 3);
  const news = getNews().slice(0, 2);

  return (
    <>
      <HeroSection />

      {/* 1. About the lab — one short paragraph */}
      <PageContainer className="py-12">
        <div className="max-w-3xl">
          <p className="eyebrow mb-2">{d.home.aboutEyebrow}</p>
          <p className="text-lg leading-relaxed text-ink-secondary">{d.home.aboutBody}</p>
          <Link href="/about" className="link-quiet mt-3 inline-block text-sm font-medium">
            {d.home.aboutMore}
          </Link>
        </div>
      </PageContainer>

      {/* 2. Research focus — four themes */}
      <div className="border-y border-border bg-muted">
        <PageContainer className="py-12">
          <SectionHeader
            eyebrow={d.home.researchEyebrow}
            title={d.home.researchTitle}
            action={
              <Link href="/research" className="link-quiet text-sm font-medium">
                {d.home.more}
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {researchAreas.map((area) => (
              <ResearchCard key={area.id} area={area} />
            ))}
          </div>
        </PageContainer>
      </div>

      {/* 3. People preview — a single summary sentence, not a team wall */}
      <PageContainer className="py-12">
        <div className="max-w-3xl">
          <p className="eyebrow mb-2">{d.home.peopleEyebrow}</p>
          <p className="text-ink-secondary">{d.home.peopleSummary}</p>
          <Link href="/members" className="link-quiet mt-3 inline-block text-sm font-medium">
            {d.home.peopleMore}
          </Link>
        </div>
      </PageContainer>

      {/* 4. Selected publications */}
      <div className="border-y border-border bg-muted">
        <PageContainer className="py-12">
          <SectionHeader
            eyebrow={d.home.pubEyebrow}
            title={d.home.pubTitle}
            action={
              <Link href="/publications" className="link-quiet text-sm font-medium">
                {d.home.pubAll}
              </Link>
            }
          />
          <div className="space-y-2">
            {featured.map((p) => (
              <PublicationCard key={p.doi} publication={p} />
            ))}
          </div>
        </PageContainer>
      </div>

      {/* 5. Research tools / models — kept low-key, after the main content */}
      <PageContainer className="py-12">
        <div className="max-w-3xl">
          <p className="eyebrow mb-2">{d.home.toolsEyebrow}</p>
          <p className="text-ink-secondary">{d.home.toolsBody}</p>
          <Link href="/models" className="link-quiet mt-3 inline-block text-sm font-medium">
            {d.home.toolsMore}
          </Link>
        </div>
      </PageContainer>

      {/* 6. News — slim single-column list */}
      <div className="border-y border-border bg-muted">
        <PageContainer className="py-12">
          <SectionHeader eyebrow={d.home.newsEyebrow} title={d.home.newsTitle} />
          <div className="max-w-3xl space-y-4">
            {news.map((n) => (
              <NewsCard key={n.title} news={n} />
            ))}
          </div>
        </PageContainer>
      </div>

      {/* 7. Contact — compact block (full details live in the footer / Contact page) */}
      <PageContainer className="py-12">
        <div className="max-w-3xl">
          <p className="eyebrow mb-2">{d.home.contactEyebrow}</p>
          <p className="text-ink-secondary">{d.home.contactBody}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/contact" className="link-quiet font-medium">
              {d.home.contactMore}
            </Link>
            <a href={`mailto:${site.email}`} className="link-quiet font-medium">
              {site.email}
            </a>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
