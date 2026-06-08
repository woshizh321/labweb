import { cookies } from 'next/headers';
import { LANG_COOKIE, type Lang } from './i18n';

/**
 * Server-only language resolver. Reads the `lang` cookie (default: Chinese).
 * Kept separate from i18n.ts so client components can import the dictionaries
 * without pulling in next/headers. Re-exports getDict for server components so
 * they can import both from a single module.
 */
export function getLang(): Lang {
  const v = cookies().get(LANG_COOKIE)?.value;
  return v === 'en' ? 'en' : 'zh';
}

export { getDict, type Lang } from './i18n';
