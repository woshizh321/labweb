import { PageContainer } from '@/components/ui/PageContainer';
import { LinkButton } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <PageContainer className="py-24 text-center">
      <p className="text-caption font-semibold uppercase tracking-wider text-accent">404</p>
      <h1 className="mt-2 text-h1 text-primary">Page not found</h1>
      <p className="mt-2 text-ink-secondary">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-6 flex justify-center">
        <LinkButton href="/" variant="primary">
          Back to home
        </LinkButton>
      </div>
    </PageContainer>
  );
}
