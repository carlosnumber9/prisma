import { dictionaries, text, type Locale } from './i18n.ts';
import type { Citation, Source, Synthesis } from './content.ts';

export function synthesisState(synthesis: Synthesis) {
  if (synthesis.reviewStatus === 'pending') return 'pending';
  if (synthesis.reviewStatus === 'complete' && !synthesis.points.length)
    return 'reviewed-empty';
  return synthesis.reviewStatus;
}

export function formatDate(value: string, locale: Locale = 'es') {
  const date = new Date(value);
  const m = dictionaries[locale];
  // Explicit month names also cover Aranese on runtimes without Occitan ICU data.
  return text(m.date, {
    day: date.getUTCDate(),
    month: m.months.split('|')[date.getUTCMonth()]!,
    year: date.getUTCFullYear(),
  });
}

export function citationLocation(citation: Citation, locale: Locale = 'es') {
  const m = dictionaries[locale];
  if (citation.page !== undefined)
    return `${m.page} ${citation.page}${citation.printedPage ? ` (${m.printedPage} ${citation.printedPage})` : ''}`;
  return `${m.section} ${citation.section}`;
}

export function citationUrl(source: Source, citation: Citation) {
  const url = new URL(source.url);
  if (citation.page !== undefined) url.hash = `page=${citation.page}`;
  else if (citation.anchor) url.hash = citation.anchor;
  return url.href;
}
