/**
 * Deterministic avatar/image placeholder — renders initials on a muted tint.
 * Avoids shipping any copyrighted imagery; real photos drop into /public later.
 */
export function PlaceholderImage({
  label,
  className = '',
  rounded = 'rounded-card',
}: {
  label: string;
  className?: string;
  rounded?: string;
}) {
  const initials = label
    .replace(/[\[\]]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center border border-border bg-muted text-ink-secondary ${rounded} ${className}`}
    >
      <span className="text-lg font-semibold tracking-wide">{initials || '—'}</span>
    </div>
  );
}
