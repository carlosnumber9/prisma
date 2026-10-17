import { dictionaries, text, type Locale } from '../../../../../lib/i18n';
import { notFound } from 'next/navigation';
import { Shell, PageHeader } from '../../../../../components/shell';
import { SynthesisReader } from '../../../../../components/synthesis';
import { content } from '../../../../../lib/public-content';
import { isIndexable, pageSeo } from '../../../../../lib/seo';
import { origin } from '../../../../../lib/site';

type Props = {
  params: Promise<{ locale: Locale; party: string; topic: string }>;
};
export const dynamicParams = false;
export function generateStaticParams() {
  return content.syntheses.map((synthesis) => ({
    party: synthesis.partyId,
    topic: synthesis.topicId,
  }));
}
function findPage(partyId: string, topicId: string) {
  const party = content.getParty(partyId);
  const topic = content.getTopic(topicId);
  const synthesis = content.getSynthesis(partyId, topicId);
  if (!party || !topic || !synthesis) notFound();
  return { party, topic, synthesis };
}
export async function generateMetadata({ params }: Props) {
  const ids = await params;
  const locale = ids.locale;
  const m = dictionaries[locale];
  const { party, topic, synthesis } = findPage(ids.party, ids.topic);
  return pageSeo(
    `${topic.label[locale]} · ${party.name}`,
    text(m.synthesisMeta, { party: party.name, topic: topic.label[locale] }),
    synthesis.path,
    origin,
    isIndexable(synthesis),
    locale,
  );
}
export default async function SynthesisPage({ params }: Props) {
  const ids = await params;
  const locale = ids.locale;
  const m = dictionaries[locale];
  const { party, topic, synthesis } = findPage(ids.party, ids.topic);
  return (
    <Shell
      locale={locale}
      partyId={party.id}
      section="parties"
      crumbs={[
        { label: m.parties, href: '/parties' },
        { label: party.name, href: `/parties/${party.id}` },
        { label: topic.label[locale] },
      ]}
    >
      <PageHeader
        title={topic.label[locale]}
        description={`${party.name} · ${m.areaSummary}`}
      />
      <SynthesisReader
        locale={locale}
        synthesis={synthesis}
        repository={content}
      />
    </Shell>
  );
}
