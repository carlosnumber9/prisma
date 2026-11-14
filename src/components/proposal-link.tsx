'use client';

import { useEffect, useRef, useState } from 'react';
import { dictionaries, text, type Locale } from '../lib/i18n';
import styles from './proposal-link.module.css';

export function ProposalLink({
  id,
  title,
  locale,
}: {
  id: string;
  title: string;
  locale: Locale;
}) {
  const m = dictionaries[locale];
  const [phase, setPhase] = useState<'idle' | 'copied' | 'resetting' | 'error'>(
    'idle',
  );
  const [manualUrl, setManualUrl] = useState('');
  const version = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      version.current++;
      clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    const attempt = ++version.current;
    clearTimeout(timer.current);
    const url = new URL(window.location.href);
    url.hash = id;
    try {
      await navigator.clipboard.writeText(url.href);
      if (version.current !== attempt) return;
      setPhase('copied');
      setManualUrl('');
      timer.current = setTimeout(() => {
        setPhase('resetting');
        timer.current = setTimeout(() => setPhase('idle'), 100);
      }, 2000);
    } catch {
      if (version.current !== attempt) return;
      setManualUrl(url.href);
      setPhase('error');
    }
  }

  return (
    <span className={styles.control} data-phase={phase}>
      <button
        type="button"
        className={styles.button}
        aria-label={text(m.copyLink, { title })}
        onClick={() => void copy()}
      >
        <svg
          className={styles.link}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"
            transform="translate(1 0)"
          />
        </svg>
        <svg
          className={styles.tick}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </button>
      <span className={styles.status} role="status">
        {phase === 'copied'
          ? m.linkCopied
          : phase === 'error'
            ? m.copyError
            : ''}
      </span>
      {manualUrl && (
        <input
          className={styles.manualUrl}
          readOnly
          value={manualUrl}
          aria-label={text(m.copyLink, { title })}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </span>
  );
}
