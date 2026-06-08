import { PageContainer } from '@/components/ui/PageContainer';
import { LinkButton } from '@/components/ui/Button';
import { getDict, getLang } from '@/lib/getLang';

export default function NotFound() {
  const d = getDict(getLang());
  return (
    <PageContainer className="py-24 text-center">
      <p className="text-caption font-semibold uppercase tracking-wider text-accent">
        {d.notFound.code}
      </p>
      <h1 className="mt-2 text-h1 text-primary">{d.notFound.title}</h1>
      <p className="mt-2 text-ink-secondary">{d.notFound.body}</p>
      <div className="mt-6 flex justify-center">
        <LinkButton href="/" variant="primary">
          {d.notFound.home}
        </LinkButton>
      </div>
    </PageContainer>
  );
}
