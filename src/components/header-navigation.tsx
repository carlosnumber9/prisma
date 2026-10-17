'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { dictionaries, localizedPath, type Locale } from '../lib/i18n';
import { LanguageSelect } from './language-select';
import styles from './header-navigation.module.css';

type Section = 'parties' | 'topics';
type Selection = {
  locale: Locale;
  section?: Section;
  bounds?: { left: number; width: number };
};

// Page-owned shells remount during navigation; retain only the last visible
// selection in this browser session so its outline can continue moving.
let lastSelection: Selection | undefined;

export function HeaderNavigation({
  locale,
  section,
}: {
  locale: Locale;
  section?: Section;
}) {
  const m = dictionaries[locale];
  const navigationRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<{
    locale: Locale;
    section?: Section;
    previous?: Selection;
  } | null>(null);

  useLayoutEffect(() => {
    const transition = transitionRef.current;
    const previous =
      transition?.locale === locale && transition.section === section
        ? transition.previous
        : lastSelection;
    transitionRef.current = { locale, section, previous };
    lastSelection = { locale, section };

    const navigation = navigationRef.current;
    const indicator = indicatorRef.current;
    if (!navigation || !indicator) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    if (
      previous?.locale === locale &&
      previous.section &&
      previous.section !== section &&
      !reducedMotion.matches
    ) {
      const origin =
        previous.bounds ??
        navigation
          .querySelector(`[data-section="${previous.section}"]`)
          ?.getBoundingClientRect();
      const destination = indicator.getBoundingClientRect();
      if (origin) {
        animation = indicator.animate(
          [
            {
              transform: `translateX(${origin.left - destination.left}px)`,
              width: `${origin.width}px`,
            },
            { transform: 'translateX(0px)', width: `${destination.width}px` },
          ],
          { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        );
      }
    }

    const settle = () => animation?.cancel();
    window.addEventListener('resize', settle);
    reducedMotion.addEventListener('change', settle);
    document.fonts.addEventListener('loadingdone', settle);
    return () => {
      const { left, width } = indicator.getBoundingClientRect();
      lastSelection = { locale, section, bounds: { left, width } };
      settle();
      window.removeEventListener('resize', settle);
      reducedMotion.removeEventListener('change', settle);
      document.fonts.removeEventListener('loadingdone', settle);
    };
  }, [locale, section]);

  return (
    <nav aria-label={m.nav} className={styles.navigation}>
      <div className={styles.sections} ref={navigationRef}>
        {(['parties', 'topics'] as const).map((item) => (
          <div className={styles.item} key={item} data-section={item}>
            <Link
              href={localizedPath(`/${item}`, locale)}
              aria-current={section === item ? 'true' : undefined}
            >
              {m[item]}
            </Link>
            {section === item && (
              <div
                ref={indicatorRef}
                className={styles.indicator}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
      <LanguageSelect locale={locale} label={m.language} />
    </nav>
  );
}
