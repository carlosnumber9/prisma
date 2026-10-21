'use client';

import Link from 'next/link';
import { dictionaries, localizedPath, type Locale } from '../lib/i18n';
import { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { DirectoryEntry } from './directory';
import { NavigationLink } from './navigation-link';
import { createRibbonReveal } from './ribbon-reveal';
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
  const definitionsRef = useRef<SVGSVGElement>(null);
  const revealId = useId();

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    const definitions = definitionsRef.current;
    if (!navigation || !definitions) return;

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
        let maskIndex = 0;
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

            timeline.from(heading, {
              opacity: 0,
              duration: 0.18,
              clearProps: 'opacity',
            });

            const reveals = items.map((item, index) => {
              const link = item.querySelector<HTMLAnchorElement>('a');
              if (!link) return null;
              const id = `${revealId}-ribbon-${maskIndex++}`;
              const reveal = createRibbonReveal(
                definitions,
                link,
                id,
                mirrored,
              );
              const masking = {
                maskImage: `url("#${id}")`,
                pointerEvents: 'none',
              };
              const start = 0.06 + index * 0.07;
              timeline
                .fromTo(
                  item,
                  masking,
                  {
                    ...masking,
                    duration: start + 0.65,
                    clearProps: 'maskImage,pointerEvents',
                    ease: 'none',
                  },
                  0,
                )
                .to(
                  reveal.progress,
                  {
                    lateral: 1,
                    duration: 0.2,
                    ease: 'power1.in',
                    onUpdate: reveal.draw,
                  },
                  start,
                )
                .to(
                  reveal.progress,
                  {
                    horizontal: 1,
                    duration: 0.45,
                    ease: 'power2.out',
                    onUpdate: reveal.draw,
                  },
                  start + 0.2,
                );
              cleanups.push(reveal.remove);
              return { link, refresh: reveal.refresh };
            });

            // Keep the same draw progress when resizing or font loading changes the path.
            const observer = new ResizeObserver(() => {
              if (timeline.progress() === 1) return;
              reveals.forEach((reveal) => reveal?.refresh());
            });
            reveals.forEach((reveal) => {
              if (reveal) observer.observe(reveal.link);
            });
            observer.observe(definitions);
            cleanups.push(() => observer.disconnect());

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
  }, [revealId]);

  return (
    <div ref={navigationRef} className={styles.navigation}>
      <svg
        ref={definitionsRef}
        className={styles.revealDefinitions}
        aria-hidden="true"
        focusable="false"
      />
      <section aria-labelledby="topics-heading" data-navigation-column="left">
        <h2 id="topics-heading" className={styles.heading}>
          <Link href={localizedPath('/topics', locale)}>{m.byTopic}</Link>
        </h2>
        <ul className={styles.links}>
          {topics.map((topic) => (
            <li key={topic.href}>
              <NavigationLink
                href={localizedPath(topic.href, locale)}
                className={styles.link}
              >
                {topic.label}
              </NavigationLink>
            </li>
          ))}
          <li className={styles.parties} data-compact-link>
            <NavigationLink
              href={localizedPath('/parties', locale)}
              className={styles.link}
              tone="accent"
            >
              {m.partyList}
            </NavigationLink>
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
              <NavigationLink
                href={localizedPath(party.href, locale)}
                className={styles.link}
              >
                {party.label}
              </NavigationLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
