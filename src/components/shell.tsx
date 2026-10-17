import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { partyAccent } from '../lib/themes';
import styles from './portal.module.css';

export type Crumb = { label: string; href?: string };

export function Shell({
  children,
  background,
  partyId,
  section,
  crumbs = [],
}: {
  children: ReactNode;
  background?: ReactNode;
  partyId?: string;
  section?: 'parties' | 'topics';
  crumbs?: Crumb[];
}) {
  const theme = { '--accent': partyAccent(partyId) } as CSSProperties;
  return (
    <div className={styles.shell} style={theme}>
      {background}
      <a className={styles.skip} href="#main-content">
        Saltar al contenido
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Prisma, inicio">
          prisma<span aria-hidden="true">.</span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link
            href="/parties"
            aria-current={section === 'parties' ? 'true' : undefined}
          >
            Partidos
          </Link>
          <Link
            href="/topics"
            aria-current={section === 'topics' ? 'true' : undefined}
          >
            Áreas
          </Link>
        </nav>
      </header>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        {crumbs.length > 0 && (
          <nav aria-label="Ruta de navegación" className={styles.breadcrumbs}>
            <ol>
              <li>
                <Link href="/">Inicio</Link>
              </li>
              {crumbs.map((crumb, index) => (
                <li key={index}>
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
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
        <p>Prisma · Programas electorales, con fuentes y revisión.</p>
        <p>
          Selección inicial de cinco formaciones. No representa todas las
          candidaturas.
        </p>
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
