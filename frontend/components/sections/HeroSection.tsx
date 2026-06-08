import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';
import { getDict, getLang } from '@/lib/getLang';

/**
 * Home banner. Full-bleed dark navy banner with the lab name + tagline overlaid —
 * an academic masthead rather than a marketing hero.
 *
 * No external/copyrighted image is shipped: the background is a brand navy gradient
 * plus a faint inline-SVG dot motif. To use a real photo later, drop it at
 * `public/banner.jpg` and set BANNER_IMAGE = '/banner.jpg' below; the photo then
 * renders under the same dark overlay (text stays legible).
 */
const BANNER_IMAGE: string | null = '/banner.jpg';

export function HeroSection() {
  const d = getDict(getLang());
  const entries = [
    { href: '/research', label: d.hero.sections.research },
    { href: '/members', label: d.hero.sections.people },
    { href: '/publications', label: d.hero.sections.publications },
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-primary">
      {/* Banner background */}
      <div className="absolute inset-0 -z-10">
        {BANNER_IMAGE ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full opacity-[0.14]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="hero-dots" width="26" height="26" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.4" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-dots)" />
            </svg>
          </>
        )}
        {/* Legibility overlay: darken the left (where the text sits) and the bottom,
            while keeping the bright artwork visible on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/45 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
      </div>

      <PageContainer className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-display text-white">{d.labName}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{d.tagline}</p>
          <p className="mt-4 text-sm text-white/70">{d.institution}</p>

          <nav aria-label="Primary sections" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {entries.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
              >
                {e.label} →
              </Link>
            ))}
          </nav>
        </div>
      </PageContainer>
    </section>
  );
}
