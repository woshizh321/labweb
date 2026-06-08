import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import type { Member } from '@/lib/types';
import { getDict, getLang } from '@/lib/getLang';

type Variant = 'default' | 'featured' | 'compact';

/**
 * Member card with three densities for a small group:
 *  - featured: PI profile (larger, horizontal, with bio)
 *  - compact:  students (tight, small avatar) — avoids a big team wall
 *  - default:  single staff card
 */
export function MemberCard({
  member,
  variant = 'default',
}: {
  member: Member;
  variant?: Variant;
}) {
  const d = getDict(getLang());
  const role = d.members.roles[member.role] ?? member.role;

  if (variant === 'featured') {
    return (
      <article className="flex flex-col gap-5 border border-border bg-card p-6 sm:flex-row sm:items-start">
        <PlaceholderImage
          label={member.name}
          className="h-28 w-28 shrink-0"
          rounded="rounded-full"
        />
        <div>
          <h3 className="text-h3 text-primary">{member.name}</h3>
          <p className="text-sm font-medium text-ink-secondary">{role}</p>
          <p className="text-caption text-ink-muted">{member.degree}</p>
          <p className="mt-3 text-sm text-ink-secondary">
            <span className="font-medium text-ink">{d.members.interests} </span>
            {member.researchFocus}
          </p>
          {member.bio && (
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{member.bio}</p>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="link-quiet mt-3 inline-block text-caption"
            >
              {member.email}
            </a>
          )}
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="flex items-start gap-3 border border-border bg-card p-4">
        <PlaceholderImage
          label={member.name}
          className="h-11 w-11 shrink-0"
          rounded="rounded-full"
        />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-primary">{member.name}</h3>
          <p className="text-caption text-ink-muted">{role}</p>
          <p className="mt-1 text-caption text-ink-secondary">{member.researchFocus}</p>
        </div>
      </article>
    );
  }

  // default
  return (
    <article className="flex items-start gap-4 border border-border bg-card p-5">
      <PlaceholderImage label={member.name} className="h-16 w-16 shrink-0" rounded="rounded-full" />
      <div>
        <h3 className="text-base font-semibold text-primary">{member.name}</h3>
        <p className="text-sm text-ink-secondary">{role}</p>
        <p className="text-caption text-ink-muted">{member.degree}</p>
        <p className="mt-2 text-sm text-ink-secondary">{member.researchFocus}</p>
        {member.email && (
          <a href={`mailto:${member.email}`} className="link-quiet mt-2 inline-block text-caption">
            {member.email}
          </a>
        )}
      </div>
    </article>
  );
}
