import { Shell, PageHeader } from '../components/shell';
import { HomeNavigation } from '../components/home-navigation';
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
      <HomeNavigation
        topics={content.topics.map((topic) => ({
          label: topic.label,
          href: topic.path,
        }))}
      />
    </Shell>
  );
}
