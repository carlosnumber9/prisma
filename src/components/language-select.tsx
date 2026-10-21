'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  languageNames,
  languageSelection,
  locales,
  type Locale,
} from '../lib/i18n';
import type { KeyboardEvent } from 'react';
import styles from './language-select.module.css';

export function LanguageSelect({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(locales.indexOf(locale));
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const searchRef = useRef({ value: '', time: 0 });

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    const arrow = arrowRef.current;
    if (!list || !arrow) return;

    const context = gsap.context(() => {
      timelineRef.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            list.hidden = true;
          },
        })
        .fromTo(
          optionRefs.current,
          { y: '-0.75rem', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.05,
            stagger: 0.01,
            ease: 'power1.inOut',
          },
        )
        .fromTo(
          arrow,
          { rotation: 45 },
          {
            rotation: 225,
            duration: 0.05 + (locales.length - 1) * 0.01,
            ease: 'power1.inOut',
          },
          0,
        );
    }, rootRef);
    return () => {
      timelineRef.current = null;
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    const list = listRef.current;
    if (!timeline || !list) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => {
      if (reducedMotion.matches) {
        timeline.pause().progress(open ? 1 : 0);
        list.hidden = !open;
      } else if (open) {
        list.hidden = false;
        timeline.play();
      } else if (timeline.progress() > 0) {
        list.hidden = true;
        timeline.reverse();
      } else {
        list.hidden = true;
        timeline.pause(0);
      }
    };
    updatePlayback();
    reducedMotion.addEventListener('change', updatePlayback);
    return () => reducedMotion.removeEventListener('change', updatePlayback);
  }, [open]);

  useLayoutEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
        if (rootRef.current?.contains(document.activeElement)) {
          triggerRef.current?.focus();
        }
      }
    };
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === 'Tab' && open) {
      close(true);
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      let index = activeIndex;
      if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = locales.length - 1;
      else if (open) {
        index =
          (index + (event.key === 'ArrowDown' ? 1 : -1) + locales.length) %
          locales.length;
      } else index = locales.indexOf(locale);
      setActiveIndex(index);
      setOpen(true);
      return;
    }
    if (
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const now = event.timeStamp;
      const key = event.key.toLocaleLowerCase();
      const previous =
        now - searchRef.current.time < 600 ? searchRef.current.value : '';
      const query = previous === key ? key : previous + key;
      searchRef.current = { value: query, time: now };
      const start = open ? activeIndex + 1 : 0;
      for (let offset = 0; offset < locales.length; offset++) {
        const index = (start + offset) % locales.length;
        const value = locales[index];
        if (
          value &&
          languageNames[value].toLocaleLowerCase().startsWith(query)
        ) {
          event.preventDefault();
          setActiveIndex(index);
          setOpen(true);
          break;
        }
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className={styles.language}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={`${label}: ${languageNames[locale]}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setActiveIndex(locales.indexOf(locale));
          setOpen((value) => !value);
        }}
      >
        <span lang={locale}>{languageNames[locale]}</span>
        <span ref={arrowRef} className={styles.arrow} aria-hidden="true" />
      </button>
      <ul
        id={listId}
        ref={listRef}
        className={styles.options}
        role="listbox"
        aria-label={label}
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        // The timeline owns visibility so reverse playback can finish first.
        hidden
      >
        {locales.map((value, index) => (
          <li key={value} role="presentation">
            <button
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              className={styles.option}
              lang={value}
              aria-selected={locale === value}
              tabIndex={open && activeIndex === index ? 0 : -1}
              onClick={() => {
                const selection = languageSelection(
                  window.location.href,
                  value,
                );
                document.cookie = selection.cookie;
                close(true);
                // A full navigation also refreshes the document's language and root layout.
                if (value !== locale) window.location.assign(selection.href);
              }}
            >
              {languageNames[value]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
