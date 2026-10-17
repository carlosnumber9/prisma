'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { DirectoryEntry } from './directory';
import styles from './home-navigation.module.css';

export function HomeNavigation({ topics }: { topics: DirectoryEntry[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const heading = section.querySelector('h2');
      const items = section.querySelectorAll('li');
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'clamp(top 85%)',
          once: true,
        },
      });

      timeline
        .from(heading, { opacity: 0, duration: 0.18, clearProps: 'opacity' })
        .from(
          items,
          {
            xPercent: -100,
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
            if (event.pointerType !== 'touch') move(8);
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
      return () => {
        section.removeEventListener('focusin', revealOnFocus);
        hoverCleanups.forEach((cleanup) => cleanup());
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.navigation}
      aria-labelledby="topics-heading"
    >
      <h2 id="topics-heading" className={styles.heading}>
        <Link href="/topics">Por área</Link>
      </h2>
      <ul className={styles.links}>
        {topics.map((topic) => (
          <li key={topic.href}>
            <Link href={topic.href} className={styles.link}>
              <span className={styles.background} aria-hidden="true" />
              {topic.label}
            </Link>
          </li>
        ))}
        <li className={styles.parties}>
          <Link href="/parties" className={styles.link}>
            <span className={styles.background} aria-hidden="true" />
            Lista de partidos
          </Link>
        </li>
      </ul>
    </section>
  );
}
