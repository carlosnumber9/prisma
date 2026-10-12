import type { Citation, ReviewStatus, Source, Synthesis } from './content.ts';

export const UNAVAILABLE_LABEL = 'Resumen todavía no disponible';

export function reviewLabel(status: ReviewStatus) {
  switch (status) {
    case 'pending':
      return UNAVAILABLE_LABEL;
    case 'partial':
      return 'Revisión parcial';
    case 'complete':
      return 'Revisión completa';
  }
}

export function synthesisState(synthesis: Synthesis) {
  if (synthesis.reviewStatus === 'pending') return 'pending';
  if (synthesis.reviewStatus === 'complete' && !synthesis.points.length)
    return 'reviewed-empty';
  return synthesis.reviewStatus;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function citationLocation(citation: Citation) {
  if (citation.page !== undefined)
    return `Página ${citation.page}${citation.printedPage ? ` (numeración impresa: ${citation.printedPage})` : ''}`;
  return `Sección: ${citation.section}`;
}

export function citationUrl(source: Source, citation: Citation) {
  const url = new URL(source.url);
  if (citation.page !== undefined) url.hash = `page=${citation.page}`;
  else if (citation.anchor) url.hash = citation.anchor;
  return url.href;
}
