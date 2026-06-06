import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import type { Member } from '@/lib/types';

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="flex flex-col rounded-card border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <PlaceholderImage label={member.name} className="aspect-square w-full" />
      <div className="mt-4">
        <h3 className="text-base font-semibold text-primary">{member.name}</h3>
        <p className="text-sm text-ink-secondary">{member.role}</p>
        <p className="text-caption text-ink-muted">{member.degree}</p>
        <p className="mt-3 text-sm text-ink-secondary">{member.researchFocus}</p>
        {member.bio && <p className="mt-2 text-caption text-ink-muted">{member.bio}</p>}
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
