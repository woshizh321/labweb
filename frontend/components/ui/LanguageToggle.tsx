'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Lang } from '@/lib/i18n';

/**
 * Language switch (top-right of the navbar). Writes the `lang` cookie and
 * refreshes server components so the new language renders without a full reload.
 * Receives the current language + the label to show for the *other* language.
 */
export function LanguageToggle({ lang, label, aria }: { lang: Lang; label: string; aria: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next: Lang = lang === 'zh' ? 'en' : 'zh';
    // 1 year, site-wide cookie.
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      disabled={pending}
      className="rounded-[0.25rem] border border-border px-2 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
    >
      {label}
    </button>
  );
}
