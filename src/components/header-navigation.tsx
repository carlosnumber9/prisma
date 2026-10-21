'use client';

import Link from 'next/link';
import { gsap } from 'gsap';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
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

function subscribeToMobileNavigation(listener: () => void) {
  const query = window.matchMedia('(max-width: 768px)');
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

function isMobileNavigation() {
  return window.matchMedia('(max-width: 768px)').matches;
}

export function HeaderNavigation({
  locale,
  section,
}: {
  locale: Locale;
  section?: Section;
}) {
  const m = dictionaries[locale];
  const mobile = useSyncExternalStore(
    subscribeToMobileNavigation,
    isMobileNavigation,
    () => false,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelSurfaceRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<{
    locale: Locale;
    section?: Section;
    previous?: Selection;
  } | null>(null);

  useLayoutEffect(() => {
    const surface = panelSurfaceRef.current;
    const content = panelContentRef.current;
    if (!mobile || !surface || !content) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let tween: gsap.core.Tween | undefined;
    let targetHeight: number | undefined;
    const fitHeight = (animate = true) => {
      const next = content.getBoundingClientRect().height;
      if (next <= 0) return;
      if (next === targetHeight && animate) return;
      targetHeight = next;
      tween?.kill();
      tween = gsap.to(surface, {
        height: next,
        duration: animate && !reducedMotion.matches ? 0.2 : 0,
        ease: 'power1.inOut',
        overwrite: true,
      });
    };
    const resize = () => fitHeight();
    const settle = () => fitHeight(false);
    fitHeight(false);
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(resize);
    observer?.observe(content);
    window.addEventListener('resize', resize);
    document.fonts.addEventListener('loadingdone', resize);
    reducedMotion.addEventListener('change', settle);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      document.fonts.removeEventListener('loadingdone', resize);
      reducedMotion.removeEventListener('change', settle);
      tween?.kill();
      surface.style.removeProperty('height');
    };
  }, [mobile]);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)');
    const resetMenu = () => {
      setMenuOpen(false);
      if (mobile.matches && rootRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus();
      } else if (
        !mobile.matches &&
        document.activeElement === toggleRef.current
      ) {
        navigationRef.current?.querySelector('a')?.focus();
      }
    };
    mobile.addEventListener('change', resetMenu);
    return () => mobile.removeEventListener('change', resetMenu);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const dismissOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissOnEscape);
    };
  }, [menuOpen]);

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
    if (
      !navigation ||
      !indicator ||
      window.matchMedia('(max-width: 768px)').matches
    )
      return;

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
      lastSelection = {
        locale,
        section,
        bounds: width > 0 ? { left, width } : undefined,
      };
      settle();
      window.removeEventListener('resize', settle);
      reducedMotion.removeEventListener('change', settle);
      document.fonts.removeEventListener('loadingdone', settle);
    };
  }, [locale, section]);

  return (
    <nav
      aria-label={m.nav}
      className={styles.navigation}
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setMenuOpen(false);
        }
      }}
    >
      <button
        type="button"
        ref={toggleRef}
        className={styles.toggle}
        aria-label={m.nav}
        aria-expanded={menuOpen}
        aria-controls={panelId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={styles.burger} aria-hidden="true" />
      </button>
      <div
        id={panelId}
        className={styles.panel}
        data-open={menuOpen}
        inert={mobile && !menuOpen}
      >
        <div
          ref={panelSurfaceRef}
          className={styles.panelSurface}
          aria-hidden="true"
        />
        <div className={styles.panelContent} ref={panelContentRef}>
          <ul className={styles.sections} ref={navigationRef}>
            {(['parties', 'topics'] as const).map((item) => (
              <li className={styles.item} key={item} data-section={item}>
                <Link
                  href={localizedPath(`/${item}`, locale)}
                  aria-current={section === item ? 'true' : undefined}
                  onClick={() => setMenuOpen(false)}
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
              </li>
            ))}
          </ul>
          <LanguageSelect locale={locale} label={m.language} />
        </div>
      </div>
    </nav>
  );
}
