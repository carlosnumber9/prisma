import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { dictionaries, isLocale, locales } from '../../lib/i18n';
import { origin } from '../../lib/site';
import { mako } from '../font';
import '../globals.css';

type Props = { params: Promise<{ locale: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = dictionaries[locale];
  return {
    title: { default: `Prisma · ${m.programmes}`, template: '%s · Prisma' },
    description: m.siteDescription,
    ...(origin ? { metadataBase: new URL(origin) } : {}),
  };
}
export default async function RootLayout({
  children,
  params,
}: Props & { children: ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} className={mako.variable}>
      <body>{children}</body>
    </html>
  );
}
