'use client';

import type { Locale } from '../lib/i18n';
import { Directory, type DirectoryEntry } from './directory';
import { useProvincialParties } from './province-state';

export function ProvincialPartyDirectory({
  locale,
  parties,
  topicId,
}: {
  locale: Locale;
  parties: DirectoryEntry[];
  topicId?: string;
}) {
  const entries = useProvincialParties(parties, topicId);
  return <Directory locale={locale} entries={entries} />;
}
