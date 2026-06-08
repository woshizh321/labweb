import { Badge } from '@/components/ui/Badge';
import type { Publication } from '@/lib/types';
import { getDict, getLang } from '@/lib/getLang';

export function PublicationCard({ publication }: { publication: Publication }) {
  const d = getDict(getLang());
  const doiUrl = publication.doi ? `https://doi.org/${publication.doi}` : null;
  const pubmedUrl = publication.pubmed
    ? `https://pubmed.ncbi.nlm.nih.gov/${publication.pubmed}/`
    : null;

  return (
    <article className="border-l-2 border-l-border bg-card py-4 pl-5 pr-2 hover:border-l-primary/40">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold leading-snug text-primary">{publication.title}</h3>
        {publication.featured && <Badge tone="neutral">{d.publications.selected}</Badge>}
      </div>
      <p className="mt-1.5 text-sm text-ink-secondary">{publication.authors}</p>
      <p className="mt-0.5 text-sm text-ink-muted">
        <span className="italic">{publication.journal}</span>. {publication.year}.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption">
        {doiUrl && (
          <a href={doiUrl} target="_blank" rel="noopener noreferrer" className="link-quiet">
            DOI: {publication.doi}
          </a>
        )}
        {pubmedUrl && (
          <a href={pubmedUrl} target="_blank" rel="noopener noreferrer" className="link-quiet">
            PubMed: {publication.pubmed}
          </a>
        )}
        {publication.tags.length > 0 && (
          <span className="text-ink-muted">{publication.tags.join(' · ')}</span>
        )}
      </div>
    </article>
  );
}
