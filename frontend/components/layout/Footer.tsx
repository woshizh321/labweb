import Link from 'next/link';
import { site } from '@/lib/site';
import { PageContainer } from '@/components/ui/PageContainer';

export function Footer() {
  const year = new Date().getFullYear();
  const range =
    year > site.copyrightFrom ? `${site.copyrightFrom}–${year}` : `${site.copyrightFrom}`;

  return (
    <footer className="mt-20 border-t border-border bg-muted">
      <PageContainer className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-base font-semibold text-primary">{site.name}</p>
            <p className="mt-2 max-w-sm text-sm text-ink-secondary">{site.tagline}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Navigate</p>
            <ul className="mt-3 grid grid-cols-2 gap-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-quiet text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Contact</p>
            <ul className="mt-3 space-y-1 text-sm text-ink-secondary">
              <li>{site.institution}</li>
              <li>{site.address}</li>
              <li>
                <a href={`mailto:${site.email}`} className="link-quiet">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-caption text-ink-muted">
          © {range} {site.name}. All rights reserved. · This site does not process real
          patient-level or personally identifiable data.
        </div>
      </PageContainer>
    </footer>
  );
}
