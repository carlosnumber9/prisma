'use client';

import Link from 'next/link';
import { dictionaries, localizedPath, type Locale } from '../lib/i18n';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { DirectoryEntry } from './directory';
import styles from './home-navigation.module.css';

export function HomeNavigation({
  topics,
  locale,
  parties,
}: {
  topics: DirectoryEntry[];
  locale: Locale;
  parties: DirectoryEntry[];
}) {
  const m = dictionaries[locale];
  const navigationRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        wide: '(min-width: 1024px)',
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const wide = context.conditions.wide;
        const cleanups: (() => void)[] = [];
        navigation
          .querySelectorAll<HTMLElement>('[data-navigation-column]')
          .forEach((section) => {
            const mirrored = section.dataset.navigationColumn === 'right';
            if (mirrored && !wide) return;
            const heading = section.querySelector('h2');
            const items = Array.from(section.querySelectorAll('li')).filter(
              (item) => !(wide && item.hasAttribute('data-compact-link')),
            );
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: 'clamp(top 85%)',
                once: true,
              },
            });

            timeline
              .from(heading, {
                opacity: 0,
                duration: 0.18,
                clearProps: 'opacity',
              })
              .from(
                items,
                {
                  xPercent: mirrored ? 100 : -100,
                  opacity: 0,
                  duration: 0.45,
                  stagger: 0.07,
                  ease: 'power3.out',
                  clearProps: 'transform,opacity',
                },
                0.06,
              );

            // Keyboard navigation must never wait for the scroll reveal.
            const revealOnFocus = () => timeline.progress(1);
            section.addEventListener('focusin', revealOnFocus);
            const hoverCleanups = Array.from(
              section.querySelectorAll<HTMLAnchorElement>('li a'),
              (link) => {
                const move = gsap.quickTo(link, 'x', {
                  duration: 0.16,
                  ease: 'power2.out',
                });
                const enter = (event: PointerEvent) => {
                  if (event.pointerType !== 'touch') move(mirrored ? -8 : 8);
                };
                const leave = () => move(0);
                link.addEventListener('pointerenter', enter);
                link.addEventListener('pointerleave', leave);
                link.addEventListener('pointercancel', leave);
                return () => {
                  link.removeEventListener('pointerenter', enter);
                  link.removeEventListener('pointerleave', leave);
                  link.removeEventListener('pointercancel', leave);
                };
              },
            );
            cleanups.push(() => {
              section.removeEventListener('focusin', revealOnFocus);
              hoverCleanups.forEach((cleanup) => cleanup());
            });
          });
        return () => cleanups.forEach((cleanup) => cleanup());
      },
    );

    return () => media.revert();
  }, []);

  return (
    <div ref={navigationRef} className={styles.navigation}>
      <section aria-labelledby="topics-heading" data-navigation-column="left">
        <h2 id="topics-heading" className={styles.heading}>
          <Link href={localizedPath('/topics', locale)}>{m.byTopic}</Link>
        </h2>
        <ul className={styles.links}>
          {topics.map((topic) => (
            <li key={topic.href}>
              <Link
                href={localizedPath(topic.href, locale)}
                className={styles.link}
              >
                <span className={styles.background} aria-hidden="true" />
                {topic.label}
              </Link>
            </li>
          ))}
          <li className={styles.parties} data-compact-link>
            <Link
              href={localizedPath('/parties', locale)}
              className={styles.link}
            >
              <span className={styles.background} aria-hidden="true" />
              {m.partyList}
            </Link>
          </li>
        </ul>
      </section>
      <section
        className={styles.partyColumn}
        aria-labelledby="parties-heading"
        data-navigation-column="right"
      >
        <h2 id="parties-heading" className={styles.heading}>
          <Link href={localizedPath('/parties', locale)}>{m.byParty}</Link>
        </h2>
        <ul className={styles.links}>
          {parties.map((party) => (
            <li key={party.href}>
              <Link
                href={localizedPath(party.href, locale)}
                className={styles.link}
              >
                <span className={styles.background} aria-hidden="true" />
                {party.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
