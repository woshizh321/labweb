/**
 * Shared content types. Every JSON file under /data is validated against these
 * at the data-access layer (lib/data.ts) so pages stay strongly typed.
 */

export type MemberGroup =
  | 'PI'
  | 'Faculty'
  | 'Technical Staff'
  | 'PhD Students'
  | 'Master Students'
  | 'Joint-Training PhD'
  | 'Visiting Students';

export interface Member {
  name: string;
  role: string;
  degree: string;
  group: MemberGroup;
  researchFocus: string;
  email: string;
  avatar: string; // path under /public, or "" to render a PlaceholderImage
  bio: string;
}

export interface Alumni {
  name: string;
  degree: string;
  period: string;
  currentPosition: string;
  currentInstitution: string;
  researchFocus: string;
}

export interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  pubmed: string;
  tags: string[];
  featured: boolean;
}

export type ModelStatus = 'Coming soon' | 'Prototype' | 'Available';

export interface ModelCard {
  id: string;
  name: string;
  description: string;
  clinicalContext: string;
  status: ModelStatus;
  route: string;
  version: string;
  disclaimer: string;
}

export interface NewsItem {
  title: string;
  date: string; // ISO yyyy-mm-dd
  summary: string;
  category: string;
}

export interface ResearchArea {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
}
