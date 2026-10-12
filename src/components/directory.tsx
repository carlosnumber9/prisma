import Link from 'next/link';
import type { ReviewStatus } from '../lib/content';
import { reviewLabel } from '../lib/presentation';
import styles from './portal.module.css';

export type DirectoryEntry = {
  label: string;
  href: string;
  status?: ReviewStatus;
};

export function Directory({
  entries,
  columns = false,
}: {
  entries: DirectoryEntry[];
  columns?: boolean;
}) {
  if (!entries.length)
    return (
      <p className={styles.note}>Todavía no hay formaciones incorporadas.</p>
    );
  return (
    <ul className={columns ? styles.topicGrid : styles.directory}>
      {entries.map((entry) => (
        <li key={entry.href}>
          <Link href={entry.href}>
            <span className={styles.entryTitle}>{entry.label}</span>
            {entry.status && (
              <span className={styles.entryStatus}>
                {reviewLabel(entry.status)}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
