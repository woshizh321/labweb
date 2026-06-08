/**
 * Single data-access layer. Pages import from here, never from raw JSON, so that
 * sorting/grouping rules live in one place and content stays decoupled from views.
 */
import membersJson from '@/data/members.json';
import alumniJson from '@/data/alumni.json';
import publicationsJson from '@/data/publications.json';
import modelsJson from '@/data/models.json';
import newsJson from '@/data/news.json';
import type {
  Member,
  MemberGroup,
  Alumni,
  Publication,
  ModelCard,
  NewsItem,
} from './types';

const MEMBER_GROUP_ORDER: MemberGroup[] = [
  'PI',
  'Faculty',
  'Technical Staff',
  'PhD Students',
  'Master Students',
  'Joint-Training PhD',
  'Visiting Students',
];

export function getMembers(): Member[] {
  return membersJson as Member[];
}

/** Members grouped and ordered by academic seniority for the /members page. */
export function getMembersByGroup(): { group: MemberGroup; members: Member[] }[] {
  const members = getMembers();
  return MEMBER_GROUP_ORDER.map((group) => ({
    group,
    members: members.filter((m) => m.group === group),
  })).filter((g) => g.members.length > 0);
}

export function getAlumni(): Alumni[] {
  return (alumniJson as Alumni[])
    .slice()
    .sort((a, b) => b.period.localeCompare(a.period));
}

export function getPublications(): Publication[] {
  return (publicationsJson as Publication[])
    .slice()
    .sort((a, b) => b.year - a.year);
}

export function getFeaturedPublications(): Publication[] {
  return getPublications().filter((p) => p.featured);
}

export function getModels(): ModelCard[] {
  return modelsJson as ModelCard[];
}

export function getModelById(id: string): ModelCard | undefined {
  return getModels().find((m) => m.id === id);
}

export function getNews(): NewsItem[] {
  return (newsJson as NewsItem[])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}
