'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { site } from '@/lib/site';
import { PageContainer } from '@/components/ui/PageContainer';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { getDict, type Lang } from '@/lib/i18n';

export function Navbar({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const d = getDict(lang);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <PageContainer>
        <nav className="flex h-navbar items-center justify-between">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-primary"
            onClick={() => setOpen(false)}
          >
            {d.brand}
          </Link>

          <div className="flex items-center gap-6">
            {/* Desktop nav */}
            <ul className="hidden items-center gap-6 md:flex">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`border-b-2 pb-0.5 text-sm transition-colors ${
                      isActive(item.href)
                        ? 'border-primary font-medium text-primary'
                        : 'border-transparent text-ink-secondary hover:text-primary'
                    }`}
                  >
                    {d.nav[item.href] ?? item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language switch (top-right) */}
            <LanguageToggle lang={lang} label={d.langToggle.label} aria={d.langToggle.aria} />

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-primary md:hidden"
            >
              <span className="text-lg leading-none">{open ? '✕' : '☰'}</span>
            </button>
          </div>
        </nav>
      </PageContainer>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <PageContainer>
            <ul className="flex flex-col py-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block border-l-2 px-3 py-2 text-sm ${
                      isActive(item.href)
                        ? 'border-primary font-medium text-primary'
                        : 'border-transparent text-ink-secondary hover:text-primary'
                    }`}
                  >
                    {d.nav[item.href] ?? item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </PageContainer>
        </div>
      )}
    </header>
  );
}
