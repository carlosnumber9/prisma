'use client';

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { HomeNavigation } from './home-navigation';
import type { DirectoryEntry } from './directory';
import { dictionaries, type Locale } from '../lib/i18n';
import styles from './portal.module.css';

export function HomeExperience({
  children,
  locale,
  topics,
  parties,
}: {
  children: ReactNode;
  locale: Locale;
  topics: DirectoryEntry[];
  parties: DirectoryEntry[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [prismFinished, setPrismFinished] = useState(false);
  const [ribbonsFinished, setRibbonsFinished] = useState(false);
  const phase = !active
    ? 'intro'
    : prismFinished && ribbonsFinished
      ? 'complete'
      : 'revealing';
  const finishRibbons = useCallback(() => setRibbonsFinished(true), []);
  const activate = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    element.dataset.homeEnhanced = 'true';
    const anchor = element.querySelector<HTMLElement>('#prism-anchor');
    const options = element.querySelector<HTMLElement>('[data-home-options]');
    const heading = element.querySelector('h1');
    const measure = () => {
      if (!anchor || !options) return;
      const bounds = element.getBoundingClientRect();
      const center =
        anchor.getBoundingClientRect().top +
        anchor.offsetHeight / 2 -
        bounds.top;
      const headingBottom =
        (heading?.getBoundingClientRect().bottom ?? bounds.top) - bounds.top;
      const naturalHeight =
        options.firstElementChild?.getBoundingClientRect().height ?? 1;
      const currentScale =
        Number(element.style.getPropertyValue('--home-options-scale')) || 1;
      const unscaledHeight = naturalHeight / currentScale;
      const availableHeight = Math.max(
        1,
        element.clientHeight - headingBottom - 24,
      );
      const scale = Math.min(1, availableHeight / unscaledHeight);
      const height = unscaledHeight * scale;
      const top = Math.max(
        headingBottom + 12,
        Math.min(center - height / 2, element.clientHeight - height - 12),
      );
      element.style.setProperty('--home-prism-center', `${center}px`);
      element.style.setProperty('--home-options-scale', `${scale}`);
      element.style.setProperty('--home-options-top', `${top}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (anchor) observer.observe(anchor);
    if (options) observer.observe(options);
    if (heading) observer.observe(heading);
    measure();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let started = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let touchY = 0;
    let previousScrollY = Math.max(0, window.scrollY);
    const reveal = () => {
      if (started) return;
      started = true;
      setActive(true);
      timer = setTimeout(
        () => setPrismFinished(true),
        motion.matches ? 0 : 850,
      );
    };
    activate.current = reveal;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY <= 0) return;
      if (event.target instanceof Element && event.target.closest('header'))
        return;
      if (started) return;
      event.preventDefault();
      reveal();
    };
    const touchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const touchMove = (event: TouchEvent) => {
      if (touchY - (event.touches[0]?.clientY ?? touchY) < 12) return;
      if (started) return;
      event.preventDefault();
      reveal();
    };
    const scroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      if (currentScrollY > previousScrollY) reveal();
      previousScrollY = currentScrollY;
    };
    const keyboard = (event: KeyboardEvent) => {
      if (
        started ||
        event.target !== document.body ||
        !['ArrowDown', 'PageDown', ' '].includes(event.key)
      )
        return;
      event.preventDefault();
      reveal();
    };
    const settle = () => {
      if (started && motion.matches) {
        clearTimeout(timer);
        setPrismFinished(true);
      }
    };
    window.addEventListener('wheel', wheel, { passive: false });
    element.addEventListener('touchstart', touchStart, { passive: true });
    element.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('keydown', keyboard);
    motion.addEventListener('change', settle);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      delete element.dataset.homeEnhanced;
      window.removeEventListener('wheel', wheel);
      element.removeEventListener('touchstart', touchStart);
      element.removeEventListener('touchmove', touchMove);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('keydown', keyboard);
      motion.removeEventListener('change', settle);
    };
  }, []);

  return (
    <div ref={root} className={styles.homeExperience} data-home-phase={phase}>
      {children}
      <button
        type="button"
        className={styles.prismTrigger}
        aria-label={`${dictionaries[locale].byTopic} · ${dictionaries[locale].byParty}`}
        aria-expanded={phase !== 'intro'}
        aria-controls="home-navigation"
        onClick={() => activate.current()}
      />
      <div className={styles.homeOptions} data-home-options>
        <HomeNavigation
          locale={locale}
          topics={topics}
          parties={parties}
          revealed={active}
          onRevealComplete={finishRibbons}
        />
      </div>
    </div>
  );
}
