'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { commonCrumbCount, type Crumb } from '../lib/shell-routes';
import { animateElement, reducedMotion, type Motion } from '../lib/motion';
import styles from './portal.module.css';

type Running = { motion: Motion; piece: HTMLElement; slot: HTMLElement };

function stop(running: Running[], preserve = false) {
  for (const { motion, piece, slot } of running) {
    const transform = getComputedStyle(piece).transform;
    motion.cancel();
    if (preserve) piece.style.transform = transform;
    else {
      piece.style.removeProperty('transform');
      slot.style.removeProperty('overflow');
    }
  }
  running.length = 0;
}

function slide(slot: HTMLElement, entering: boolean): Running {
  const piece = slot.firstElementChild as HTMLElement;
  const from = entering
    ? 'translateX(-100%)'
    : getComputedStyle(piece).transform;
  slot.style.overflow = 'hidden';
  const motion = animateElement(
    piece,
    { transform: from },
    { transform: entering ? 'translateX(0%)' : 'translateX(-100%)' },
    160,
  );
  return { motion, piece, slot };
}

export function Breadcrumbs({
  crumbs,
  label,
}: {
  crumbs: Crumb[];
  label: string;
}) {
  const [items, setItems] = useState(crumbs);
  const displayed = useRef(crumbs);
  const latest = useRef(crumbs);
  const root = useRef<HTMLElement>(null);
  const generation = useRef(0);
  const running = useRef<Running[]>([]);
  const pending = useRef<{ ticket: number; common: number } | null>(null);

  useLayoutEffect(() => {
    latest.current = crumbs;
    if (displayed.current === crumbs) {
      generation.current++;
      stop(running.current);
      pending.current = null;
      return;
    }
    const ticket = ++generation.current;
    stop(running.current, true);
    const common = commonCrumbCount(displayed.current, crumbs);
    const slots = Array.from(
      root.current?.querySelectorAll<HTMLElement>('[data-crumb]') ?? [],
    );
    for (const slot of slots.slice(0, common)) {
      slot.style.removeProperty('overflow');
      (slot.firstElementChild as HTMLElement).style.removeProperty('transform');
    }
    const exiting = reducedMotion()
      ? []
      : slots.slice(common).map((slot) => slide(slot, false));
    running.current = exiting;
    void Promise.all(exiting.map(({ motion }) => motion.finished)).then(() => {
      if (ticket !== generation.current) return;
      stop(running.current);
      pending.current = { ticket, common };
      displayed.current = crumbs;
      setItems(crumbs);
    });
  }, [crumbs]);

  useLayoutEffect(() => {
    const entry = pending.current;
    if (!entry || entry.ticket !== generation.current || reducedMotion())
      return;
    pending.current = null;
    const slots = Array.from(
      root.current?.querySelectorAll<HTMLElement>('[data-crumb]') ?? [],
    );
    const entering = slots.slice(entry.common).map((slot) => slide(slot, true));
    running.current = entering;
    void Promise.all(entering.map(({ motion }) => motion.finished)).then(() => {
      if (entry.ticket === generation.current) stop(running.current);
    });
  }, [items]);

  useLayoutEffect(() => {
    const invalidate = () => {
      generation.current++;
    };
    const settle = () => {
      invalidate();
      stop(running.current);
      pending.current = null;
      displayed.current = latest.current;
      setItems(latest.current);
    };
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    preference.addEventListener('change', settle);
    window.addEventListener('resize', settle);
    document.fonts.addEventListener('loadingdone', settle);
    return () => {
      invalidate();
      stop(running.current);
      preference.removeEventListener('change', settle);
      window.removeEventListener('resize', settle);
      document.fonts.removeEventListener('loadingdone', settle);
    };
  }, []);

  return (
    <nav
      ref={root}
      aria-label={label}
      className={styles.breadcrumbs}
      hidden={!items.length}
    >
      <ol>
        {items.map((item) => {
          const live = crumbs.find((crumb) => crumb.id === item.id);
          const crumb = live ?? item;
          return (
            <li
              key={item.id}
              data-crumb={item.id}
              inert={!live}
              aria-hidden={!live || undefined}
            >
              <div className={styles.breadcrumbPiece}>
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current={live ? 'page' : undefined}>
                    {crumb.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
