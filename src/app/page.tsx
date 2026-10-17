import Image from 'next/image';
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
    <Shell background={<PrismBackground anchorId="prism-anchor" />}>
      <section className={styles.homeIntro} aria-labelledby="prism-title">
        <div className={styles.homeComposition}>
          <h1 id="prism-title">Qué propone cada partido.</h1>
          <div
            id="prism-anchor"
            className={styles.prismAnchor}
            aria-hidden="true"
          >
            <Image
              className={styles.prismPoster}
              src="/prism-poster.png"
              alt=""
              width={1440}
              height={720}
              priority
              unoptimized
            />
          </div>
          <p className={styles.homeSubtitle}>
            Prisma es un portal donde se sintetizan los programas políticos de
            las principales candidaturas a las elecciones generales de España
            del próximo 29 de noviembre.
          </p>
        </div>
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
