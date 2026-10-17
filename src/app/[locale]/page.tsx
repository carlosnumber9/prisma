import { dictionaries, type Locale } from '../../lib/i18n';
import Image from 'next/image';
import { Shell } from '../../components/shell';
import { HomeNavigation } from '../../components/home-navigation';
import { PrismBackground } from '../../components/prism-background';
import styles from '../../components/portal.module.css';
import { content } from '../../lib/public-content';
import { pageSeo } from '../../lib/seo';
import { origin } from '../../lib/site';

type Props = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const m = dictionaries[locale];
  return pageSeo(m.programmes, m.homeMeta, '/', origin, true, locale);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const m = dictionaries[locale];
  return (
    <Shell
      locale={locale}
      background={<PrismBackground anchorId="prism-anchor" />}
    >
      <section className={styles.homeIntro} aria-labelledby="prism-title">
        <div className={styles.homeComposition}>
          <h1 id="prism-title">{m.hero}</h1>
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
          <p className={styles.homeSubtitle}>{m.intro}</p>
        </div>
      </section>
      <HomeNavigation
        locale={locale}
        parties={content.parties.map((party) => ({
          label: party.name,
          href: `/parties/${party.id}`,
        }))}
        topics={content.topics.map((topic) => ({
          label: topic.label[locale],
          href: topic.path,
        }))}
      />
    </Shell>
  );
}
