'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { installSourceDisclosure } from '../lib/source-disclosure';
import styles from './portal.module.css';

export function SourceDisclosure({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const body = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (details.current && body.current)
      return installSourceDisclosure(details.current, body.current);
  }, []);
  return (
    <details ref={details} className={styles.evidence}>
      <summary>{label}</summary>
      <div ref={body} className={styles.disclosureBody}>
        {children}
      </div>
    </details>
  );
}
