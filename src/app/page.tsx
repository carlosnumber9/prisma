import { Shell } from '../components/shell';
import { HomeNavigation } from '../components/home-navigation';
import { PrismBackground } from '../components/prism-background';
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
  return (
    <Shell background={<PrismBackground />}>
      <section className={styles.homeIntro} aria-labelledby="prism-title">
        <h1 id="prism-title">Qué propone cada partido.</h1>
      </section>
      <HomeNavigation
        parties={content.parties.map((party) => ({
          label: party.name,
          href: `/parties/${party.id}`,
        }))}
        topics={content.topics.map((topic) => ({
          label: topic.label,
          href: topic.path,
        }))}
      />
    </Shell>
  );
}
