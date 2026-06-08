import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MemberCard } from '@/components/cards/MemberCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getMembersByGroup } from '@/lib/data';
import type { MemberGroup } from '@/lib/types';
import { getDict, getLang } from '@/lib/getLang';

export const metadata: Metadata = { title: 'Members' };

// Per-group rendering density for a small group.
const studentGrid = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3';
const layout: Record<MemberGroup, { variant: 'featured' | 'default' | 'compact'; grid: string }> = {
  PI: { variant: 'featured', grid: 'max-w-3xl' },
  Faculty: { variant: 'default', grid: 'grid gap-4 sm:grid-cols-2' },
  'Technical Staff': { variant: 'default', grid: 'grid gap-4 sm:grid-cols-2' },
  'PhD Students': { variant: 'compact', grid: studentGrid },
  'Master Students': { variant: 'compact', grid: studentGrid },
  'Joint-Training PhD': { variant: 'compact', grid: studentGrid },
  'Visiting Students': { variant: 'compact', grid: studentGrid },
};

export default function MembersPage() {
  const d = getDict(getLang());
  const groups = getMembersByGroup();

  return (
    <PageContainer className="py-14">
      <SectionHeader
        eyebrow={d.members.eyebrow}
        title={d.members.title}
        description={d.members.description}
      />

      {groups.length === 0 ? (
        <EmptyState title={d.members.empty} description={d.members.emptyDesc} />
      ) : (
        <div className="space-y-10">
          {groups.map(({ group, members }) => {
            const { variant, grid } = layout[group];
            return (
              <section key={group}>
                <h2 className="mb-4 text-h3 text-primary">{d.members.groups[group] ?? group}</h2>
                <div className={grid}>
                  {members.map((m) => (
                    <MemberCard key={m.email || m.name} member={m} variant={variant} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
