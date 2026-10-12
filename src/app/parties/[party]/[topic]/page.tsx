import { notFound } from 'next/navigation';
import { Shell, PageHeader } from '../../../../components/shell';
import { SynthesisReader } from '../../../../components/synthesis';
import { content } from '../../../../lib/public-content';
import { isIndexable, pageSeo } from '../../../../lib/seo';
import { origin } from '../../../../lib/site';

type Props = { params: Promise<{ party: string; topic: string }> };
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
  const { party, topic, synthesis } = findPage(ids.party, ids.topic);
  return pageSeo(
    `${topic.label} · ${party.name}`,
    `Resumen de ${party.name} sobre ${topic.label.toLocaleLowerCase('es-ES')}, con fuentes y estado de revisión.`,
    synthesis.path,
    origin,
    isIndexable(synthesis),
  );
}
export default async function SynthesisPage({ params }: Props) {
  const ids = await params;
  const { party, topic, synthesis } = findPage(ids.party, ids.topic);
  return (
    <Shell
      partyId={party.id}
      section="parties"
      crumbs={[
        { label: 'Partidos', href: '/parties' },
        { label: party.name, href: `/parties/${party.id}` },
        { label: topic.label },
      ]}
    >
      <PageHeader
        title={topic.label}
        description={`${party.name} · Resumen del área`}
      />
      <SynthesisReader synthesis={synthesis} repository={content} />
    </Shell>
  );
}
