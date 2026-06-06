'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { site } from '@/lib/site';
import { PageContainer } from '@/components/ui/PageContainer';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <PageContainer>
        <nav className="flex h-navbar items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-bold text-white">
              {site.shortName.slice(0, 2)}
            </span>
            <span className="text-base font-semibold text-primary">{site.shortName}</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-muted text-primary'
                      : 'text-ink-secondary hover:bg-muted hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

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
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'bg-muted text-primary'
                        : 'text-ink-secondary hover:bg-muted hover:text-primary'
                    }`}
                  >
                    {item.label}
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
