import Link from 'next/link';
import { Shell, PageHeader } from './shell';
import { dictionaries, localizedPath, type Locale } from '../lib/i18n';

export function NotFoundContent({ locale }: { locale: Locale }) {
  const m = dictionaries[locale];
  return (
    <Shell locale={locale}>
      <PageHeader title={m.notFound} description={m.notFoundDescription} />
      <p>
        <Link href={localizedPath('/', locale)}>{m.backHome}</Link>
      </p>
    </Shell>
  );
}
