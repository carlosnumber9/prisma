'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { dictionaries, localizedPath, type Locale } from '../lib/i18n';
import { contrastingText, partyAccent } from '../lib/themes';
import type { ShellRoute } from '../lib/shell-routes';
import { installRouteFades } from '../lib/route-fades';
import { HeaderNavigation } from './header-navigation';
import { HalftoneBackground } from './halftone-background';
import { Breadcrumbs } from './breadcrumbs';
import styles from './portal.module.css';

export function ShellFrame({
  children,
  locale,
  routes,
}: {
  children: ReactNode;
  locale: Locale;
  routes: Record<string, ShellRoute>;
}) {
  const pathname = usePathname();
  const route = routes[pathname] ?? { accent: partyAccent(), crumbs: [] };
  const m = dictionaries[locale];
  const root = useRef<HTMLDivElement>(null);
  const fades = useRef<ReturnType<typeof installRouteFades> | null>(null);
  const previousPath = useRef(pathname);
  useLayoutEffect(() => {
    if (!root.current) return;
    const controller = installRouteFades(root.current);
    fades.current = controller;
    return () => {
      controller.dispose();
      fades.current = null;
    };
  }, []);
  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    void fades.current?.enter();
  }, [pathname]);
  const theme = {
    '--accent': route.accent,
    '--accent-foreground': contrastingText(route.accent),
  } as CSSProperties;
  return (
    <div ref={root} className={styles.shell} style={theme}>
      <HalftoneBackground />
      <a className={styles.skip} href="#main-content">
        {m.skip}
      </a>
      <header className={styles.header}>
        <Link
          href={localizedPath('/', locale)}
          className={styles.brand}
          aria-label={`Prisma, ${m.home}`}
        >
          prisma<span aria-hidden="true">.</span>
        </Link>
        <HeaderNavigation
          locale={locale}
          section={route.section}
          routePath={pathname}
        />
      </header>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Breadcrumbs crumbs={route.crumbs} label={m.breadcrumbs} />
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
