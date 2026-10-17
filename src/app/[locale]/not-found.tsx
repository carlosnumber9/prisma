import { locale as rootLocale } from 'next/root-params';
import { isLocale } from '../../lib/i18n';
import { NotFoundContent } from '../../components/not-found-content';

export default async function NotFoundPage() {
  const value = await rootLocale();
  return <NotFoundContent locale={isLocale(value) ? value : 'es'} />;
}
