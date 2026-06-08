import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'link';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[0.375rem] text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:opacity-50';

// Restrained, academic actions: navy outline-first, no filled green CTAs.
const variants: Record<Variant, string> = {
  // The single "filled" action, used rarely (e.g. 404 → home). Navy, not green.
  primary: 'px-4 py-2 bg-primary text-white hover:bg-primary-dark',
  // Default academic action: hairline outline that fills navy-quiet on hover.
  secondary: 'px-4 py-2 border border-border text-primary hover:border-primary/40 hover:bg-muted',
  // Quiet bordered button.
  ghost: 'px-4 py-2 border border-border bg-white text-ink-secondary hover:text-primary hover:bg-muted',
  // Pure text link with arrow affordance — no box.
  link: 'px-0 py-0 text-secondary hover:text-primary underline-offset-4 hover:underline',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/** Anchor styled as a button (internal or external links). */
export function LinkButton({
  href,
  variant = 'primary',
  className = '',
  external = false,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  external?: boolean;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
