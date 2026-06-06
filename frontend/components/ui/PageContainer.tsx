import type { ReactNode } from 'react';

/** Centers content at the global page max-width with consistent horizontal padding. */
export function PageContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-page px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
