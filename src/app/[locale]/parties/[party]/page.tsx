import { dictionaries, text, type Locale } from '../../../../lib/i18n';
import { notFound } from 'next/navigation';
import { Shell, PageHeader } from '../../../../components/shell';
import { Directory } from '../../../../components/directory';
import styles from '../../../../components/portal.module.css';
import { content } from '../../../../lib/public-content';
import { pageSeo } from '../../../../lib/seo';
import { origin } from '../../../../lib/site';

type Props = { params: Promise<{ locale: Locale; party: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return content.parties.map((party) => ({ party: party.id }));
}
export async function generateMetadata({ params }: Props) {
  const { party: id, locale } = await params;
  const m = dictionaries[locale];
  const party = content.getParty(id);
  if (!party) notFound();
  return pageSeo(
    party.name,
    text(m.partyMeta, { party: party.name }),
    `/parties/${party.id}`,
    origin,
    true,
    locale,
  );
}
export default async function PartyPage({ params }: Props) {
  const { party: id, locale } = await params;
  const m = dictionaries[locale];
  const party = content.getParty(id);
  if (!party) notFound();
  return (
    <Shell
      locale={locale}
      partyId={party.id}
      section="parties"
      crumbs={[{ label: m.parties, href: '/parties' }, { label: party.name }]}
    >
      <PageHeader title={party.name} description={m.partyDescription} />
      {party.officialWebsite && (
        <p className={styles.officialWebsite}>
          <a href={party.officialWebsite}>
            {text(m.officialWebsite, { party: party.name })}
          </a>
        </p>
      )}
      <h2>{m.programmeTopics}</h2>
      <Directory
        locale={locale}
        columns
        entries={content.topics.map((topic) => {
          const synthesis = content.getSynthesis(party.id, topic.id)!;
          return {
            label: topic.label[locale],
            href: synthesis.path,
            status: synthesis.reviewStatus,
          };
        })}
      />
    </Shell>
  );
}
