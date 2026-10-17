'use client';

import {
  languageNames,
  languageSelection,
  locales,
  isLocale,
  type Locale,
} from '../lib/i18n';
import styles from './portal.module.css';

export function LanguageSelect({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  return (
    <label className={styles.language}>
      <span>{label}</span>
      <select
        value={locale}
        onChange={(event) => {
          const next = event.currentTarget.value;
          if (!isLocale(next)) return;
          const selection = languageSelection(window.location.href, next);
          document.cookie = selection.cookie;
          // A full navigation also refreshes the document's language and root layout.
          window.location.assign(selection.href);
        }}
      >
        {locales.map((value) => (
          <option key={value} value={value} lang={value}>
            {languageNames[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
