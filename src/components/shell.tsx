import Link from 'next/link';
import { dictionaries, localizedPath, type Locale } from '../lib/i18n';
import { LanguageSelect } from './language-select';
import type { CSSProperties, ReactNode } from 'react';
import { partyAccent } from '../lib/themes';
import styles from './portal.module.css';

export type Crumb = { label: string; href?: string };

export function Shell({
  children,
  locale = 'es',
  background,
  partyId,
  section,
  crumbs = [],
}: {
  children: ReactNode;
  locale?: Locale;
  background?: ReactNode;
  partyId?: string;
  section?: 'parties' | 'topics';
  crumbs?: Crumb[];
}) {
  const m = dictionaries[locale];
  const path = (value: string) => localizedPath(value, locale);
  const theme = { '--accent': partyAccent(partyId) } as CSSProperties;
  return (
    <div className={styles.shell} style={theme}>
      {background}
      <a className={styles.skip} href="#main-content">
        {m.skip}
      </a>
      <header className={styles.header}>
        <Link
          href={path('/')}
          className={styles.brand}
          aria-label={`Prisma, ${m.home}`}
        >
          prisma<span aria-hidden="true">.</span>
        </Link>
        <nav aria-label={m.nav}>
          <Link
            href={path('/parties')}
            aria-current={section === 'parties' ? 'true' : undefined}
          >
            {m.parties}
          </Link>
          <Link
            href={path('/topics')}
            aria-current={section === 'topics' ? 'true' : undefined}
          >
            {m.topics}
          </Link>
          <LanguageSelect locale={locale} label={m.language} />
        </nav>
      </header>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        {crumbs.length > 0 && (
          <nav aria-label={m.breadcrumbs} className={styles.breadcrumbs}>
            <ol>
              <li>
                <Link href={path('/')}>{m.home}</Link>
              </li>
              {crumbs.map((crumb, index) => (
                <li key={index}>
                  {crumb.href ? (
                    <Link href={path(crumb.href)}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>
      <footer className={styles.footer}>
        <p>{m.footer}</p>
        <p>{m.catalogueNote}</p>
      </footer>
    </div>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={styles.pageHeader}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
