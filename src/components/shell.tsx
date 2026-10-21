import Link from 'next/link';
import Image from 'next/image';
import { dictionaries, localizedPath, type Locale } from '../lib/i18n';
import { HeaderNavigation } from './header-navigation';
import { HalftoneBackground } from './halftone-background';
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
      <HalftoneBackground />
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
        <HeaderNavigation locale={locale} section={section} />
      </header>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        {crumbs.length > 0 && (
          <nav aria-label={m.breadcrumbs} className={styles.breadcrumbs}>
            <ol>
              <li>
                <div className={styles.breadcrumbPiece}>
                  <Link href={path('/')}>{m.home}</Link>
                </div>
              </li>
              {crumbs.map((crumb, index) => (
                <li key={index}>
                  <div className={styles.breadcrumbPiece}>
                    {crumb.href ? (
                      <Link href={path(crumb.href)}>{crumb.label}</Link>
                    ) : (
                      <span aria-current="page">{crumb.label}</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© 2026 Carlos Pinedo Sánchez</p>
        <a
          className={styles.repositoryLink}
          href="https://github.com/carlosnumber9/prisma"
          aria-label={m.repositoryLink}
          title={m.repositoryLink}
        >
          <Image src="/github-mark.svg" alt="" width={49} height={48} />
        </a>
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
