import type { CSSProperties } from 'react';
import type { Party } from '../lib/content';
import { dictionaries, text, type Locale } from '../lib/i18n';
import { contrastingText, NEUTRAL_BANNER, partyAccent } from '../lib/themes';
import styles from './party-banner.module.css';

export function PartyBanner({
  party,
  locale,
}: {
  party: Party;
  locale: Locale;
}) {
  const m = dictionaries[locale];
  const color = party.officialColor ?? NEUTRAL_BANNER;
  const accent = partyAccent(party);
  const foreground = contrastingText(color);
  const font = party.officialFont;
  // A stable alias avoids inserting the documented family name into CSS.
  const family = `party-${party.id}`;
  const theme = {
    '--party-color': color,
    '--party-foreground': foreground,
    '--party-scrim': foreground === '#000000' ? '#ffffff' : '#000000',
    '--party-badge-color': accent,
    '--party-badge-foreground': contrastingText(accent),
  } as CSSProperties;
  return (
    <section
      className={styles.banner}
      style={theme}
      aria-labelledby="party-name"
    >
      {font && (
        <style>{`@font-face{font-family:"${family}";src:url("${font.src}");font-weight:${font.weight};font-style:normal;font-display:swap}`}</style>
      )}
      <div className={styles.content}>
        <h1
          id="party-name"
          style={
            font
              ? {
                  fontFamily: `"${family}", var(--font-mako), Arial, sans-serif`,
                  fontWeight: font.weight,
                }
              : undefined
          }
        >
          {party.name}
        </h1>
        {party.officialWebsite && (
          <a
            className={styles.website}
            href={party.officialWebsite}
            aria-label={text(m.officialWebsite, { party: party.name })}
          >
            {m.officialWebsiteBadge}
          </a>
        )}
      </div>
    </section>
  );
}
