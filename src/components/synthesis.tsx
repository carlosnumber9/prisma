import type { ContentRepository, Synthesis } from '../lib/content';
import {
  citationLocation,
  citationUrl,
  formatDate,
  reviewLabel,
  synthesisState,
  UNAVAILABLE_LABEL,
} from '../lib/presentation';
import styles from './portal.module.css';

export function SynthesisReader({
  synthesis,
  repository,
}: {
  synthesis: Synthesis;
  repository: ContentRepository;
}) {
  const state = synthesisState(synthesis);
  if (state === 'pending')
    return (
      <section className={styles.empty} aria-labelledby="availability-heading">
        <h2 id="availability-heading">{UNAVAILABLE_LABEL}</h2>
        <p>
          Este apartado aún no tiene un resumen revisado. Lo incorporaremos
          cuando termine su revisión editorial.
        </p>
        <p className={styles.note}>
          La ausencia de resumen no significa que el partido no tenga
          propuestas.
        </p>
      </section>
    );
  return (
    <>
      <div className={styles.review}>
        <p>
          <strong>{reviewLabel(synthesis.reviewStatus)}</strong> · Revisión{' '}
          {synthesis.revision}
        </p>
        {synthesis.reviewedAt && (
          <p>
            Revisado el{' '}
            <time dateTime={synthesis.reviewedAt}>
              {formatDate(synthesis.reviewedAt)}
            </time>
          </p>
        )}
        {state === 'partial' && (
          <p>
            Estos puntos ya están revisados. La revisión del resto del área
            sigue pendiente.
          </p>
        )}
      </div>
      {state === 'reviewed-empty' ? (
        <section
          className={styles.empty}
          aria-labelledby="reviewed-empty-heading"
        >
          <h2 id="reviewed-empty-heading">
            Sin propuestas identificadas en el corpus revisado
          </h2>
          <p>
            La revisión de las fuentes consultadas no identificó propuestas para
            esta área. Puedes consultar esas fuentes abajo.
          </p>
        </section>
      ) : (
        <section aria-label="Propuestas revisadas" className={styles.points}>
          {synthesis.points.map((point) => (
            <article key={point.id} id={point.id} className={styles.point}>
              <h2>{point.title}</h2>
              <p className={styles.pointText}>{point.text}</p>
              <a
                className={styles.permalink}
                href={`#${point.id}`}
                aria-label={`Enlace a ${point.title}`}
              >
                Enlace a esta propuesta
              </a>
              <details className={styles.evidence}>
                <summary>
                  Ver fuentes y citas ({point.citations.length})
                </summary>
                {point.citations.map((citation, index) => {
                  const source = repository.getSource(citation.sourceId);
                  return (
                    <figure
                      key={`${citation.sourceId}/${citation.segmentId}/${index}`}
                    >
                      <blockquote>
                        <p>{citation.quote}</p>
                      </blockquote>
                      <figcaption>
                        <a href={citationUrl(source, citation)}>
                          {source.title}
                        </a>
                        <span>{citationLocation(citation)}</span>
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
        <h2 id="sources-heading">Fuentes consultadas</h2>
        <ul>
          {repository.getSources(synthesis).map((source) => (
            <li key={source.id}>
              <a href={source.url}>{source.title}</a>
              <p>
                {source.format === 'pdf'
                  ? 'Documento PDF'
                  : source.format === 'html'
                    ? 'Página web'
                    : 'Documento'}{' '}
                · Consultado el{' '}
                <time dateTime={source.capturedAt}>
                  {formatDate(source.capturedAt)}
                </time>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
