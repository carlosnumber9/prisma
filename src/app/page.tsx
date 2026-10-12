import Link from 'next/link';
import { Shell, PageHeader } from '../components/shell';
import { Directory } from '../components/directory';
import styles from '../components/portal.module.css';
import { content } from '../lib/public-content';
import { pageSeo } from '../lib/seo';
import { origin } from '../lib/site';

export const metadata = pageSeo(
  'Programas electorales',
  'Explora resúmenes revisados por partido o área. Consulta disponibilidad y fuentes.',
  '/',
  origin,
);

export default function HomePage() {
  const available = content.syntheses.some(
    (synthesis) => synthesis.reviewStatus !== 'pending',
  );
  return (
    <Shell>
      <PageHeader
        title="Qué propone cada partido."
        description="Consulta resúmenes revisados por partido o por área."
      />
      {!available && (
        <aside
          className={styles.notice}
          aria-label="Disponibilidad de los resúmenes"
        >
          <p>
            <strong>Todavía no hay resúmenes disponibles.</strong> Puedes
            recorrer los apartados; el contenido se incorporará tras su
            revisión.
          </p>
        </aside>
      )}
      <div className={styles.browse}>
        <section aria-labelledby="parties-heading">
          <h2 id="parties-heading">
            <Link href="/parties">Por partido</Link>
          </h2>
          <p className={styles.sectionDescription}>
            Explora las áreas de cada formación.
          </p>
          <Directory
            entries={content.parties.map((party) => ({
              label: party.name,
              href: `/parties/${party.id}`,
            }))}
          />
        </section>
        <section aria-labelledby="topics-heading">
          <h2 id="topics-heading">
            <Link href="/topics">Por área</Link>
          </h2>
          <p className={styles.sectionDescription}>
            Elige un tema y consulta su disponibilidad.
          </p>
          <Directory
            columns
            entries={content.topics.map((topic) => ({
              label: topic.label,
              href: topic.path,
            }))}
          />
        </section>
      </div>
    </Shell>
  );
}
