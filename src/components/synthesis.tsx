import { dictionaries, text, type Locale } from '../lib/i18n';
import type { ContentRepository, Synthesis } from '../lib/content';
import {
  citationLocation,
  citationUrl,
  formatDate,
  synthesisState,
} from '../lib/presentation';
import styles from './portal.module.css';
import { ProposalLink } from './proposal-link';

export function SynthesisReader({
  synthesis,
  locale = 'es',
  repository,
}: {
  synthesis: Synthesis;
  locale?: Locale;
  repository: ContentRepository;
}) {
  const m = dictionaries[locale];
  const state = synthesisState(synthesis);
  if (state === 'pending')
    return (
      <section className={styles.empty} aria-labelledby="availability-heading">
        <h2 id="availability-heading">{m.pending}</h2>
        <p>{m.pendingDescription}</p>
        <p className={styles.note}>{m.absenceNote}</p>
      </section>
    );
  return (
    <>
      {state === 'reviewed-empty' ? (
        <section
          className={styles.empty}
          aria-labelledby="reviewed-empty-heading"
        >
          <h2 id="reviewed-empty-heading">{m.noProposals}</h2>
          <p>{m.emptyDescription}</p>
        </section>
      ) : (
        <section aria-label={m.proposals} className={styles.points}>
          {synthesis.points.map((point) => (
            <article key={point.id} id={point.id} className={styles.point}>
              <h2>
                {point.title[locale]}{' '}
                <ProposalLink
                  id={point.id}
                  title={point.title[locale]}
                  locale={locale}
                />
              </h2>
              <p className={styles.pointText}>{point.text[locale]}</p>
              <details className={styles.evidence}>
                <summary>
                  {text(m.evidence, { count: point.citations.length })}
                </summary>
                {point.citations.map((citation, index) => {
                  const source = repository.getSource(citation.sourceId);
                  return (
                    <figure
                      key={`${citation.sourceId}/${citation.segmentId}/${index}`}
                    >
                      <blockquote lang="">
                        <p>{citation.quote}</p>
                      </blockquote>
                      <figcaption>
                        <a href={citationUrl(source, citation)} lang="">
                          {source.title}
                        </a>
                        <span>
                          {citation.page !== undefined ? (
                            citationLocation(citation, locale)
                          ) : (
                            <>
                              {m.section}{' '}
                              <span lang="">{citation.section}</span>
                            </>
                          )}
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </details>
            </article>
          ))}
        </section>
      )}
      <section className={styles.sources} aria-labelledby="sources-heading">
        <h2 id="sources-heading">{m.sources}</h2>
        <ul>
          {repository.getSources(synthesis).map((source) => (
            <li key={source.id}>
              <a href={source.url} lang="">
                {source.title}
              </a>
              <p>
                {source.format === 'pdf'
                  ? m.pdf
                  : source.format === 'html'
                    ? m.html
                    : m.other}{' '}
                · {m.consultedOn}{' '}
                <time dateTime={source.capturedAt}>
                  {formatDate(source.capturedAt, locale)}
                </time>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
