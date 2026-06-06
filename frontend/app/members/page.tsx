import type { Metadata } from 'next';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MemberCard } from '@/components/cards/MemberCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getMembersByGroup } from '@/lib/data';

export const metadata: Metadata = { title: 'Members' };

export default function MembersPage() {
  const groups = getMembersByGroup();

  return (
    <PageContainer className="py-16">
      <SectionHeader
        eyebrow="Team"
        title="Lab members"
        description="Our current team across faculty, staff, and students. Content is driven by data/members.json."
      />

      {groups.length === 0 ? (
        <EmptyState title="No members listed yet" description="Add entries to data/members.json." />
      ) : (
        <div className="space-y-12">
          {groups.map(({ group, members }) => (
            <section key={group}>
              <h3 className="mb-5 text-h3 text-primary">{group}</h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {members.map((m) => (
                  <MemberCard key={m.email || m.name} member={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
