import { Badge } from '@/components/ui/Badge';
import type { Publication } from '@/lib/types';

export function PublicationCard({ publication }: { publication: Publication }) {
  const doiUrl = publication.doi ? `https://doi.org/${publication.doi}` : null;
  const pubmedUrl = publication.pubmed
    ? `https://pubmed.ncbi.nlm.nih.gov/${publication.pubmed}/`
    : null;

  return (
    <article className="rounded-card border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-primary">{publication.title}</h3>
        {publication.featured && <Badge tone="success">Featured</Badge>}
      </div>
      <p className="mt-2 text-sm text-ink-secondary">{publication.authors}</p>
      <p className="mt-1 text-sm italic text-ink-muted">
        {publication.journal}, {publication.year}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {publication.tags.map((t) => (
          <Badge key={t} tone="neutral">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-caption">
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
      </div>
    </article>
  );
}
