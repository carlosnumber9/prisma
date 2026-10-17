import { dictionaries, localizedPath, type Locale } from '../lib/i18n';
import { NavigationLink } from './navigation-link';
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
  locale = 'es',
  columns = false,
}: {
  entries: DirectoryEntry[];
  locale?: Locale;
  columns?: boolean;
}) {
  if (!entries.length)
    return <p className={styles.note}>{dictionaries[locale].emptyCatalogue}</p>;
  return (
    <ul className={columns ? styles.topicGrid : styles.directory}>
      {entries.map((entry) => (
        <li key={entry.href}>
          <NavigationLink href={localizedPath(entry.href, locale)}>
            <span className={styles.entryTitle}>{entry.label}</span>
            {entry.status && (
              <span className={styles.entryStatus}>
                {reviewLabel(entry.status, locale)}
              </span>
            )}
          </NavigationLink>
        </li>
      ))}
    </ul>
  );
}
