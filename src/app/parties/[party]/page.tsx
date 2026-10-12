import { notFound } from 'next/navigation';
import { Shell, PageHeader } from '../../../components/shell';
import { Directory } from '../../../components/directory';
import styles from '../../../components/portal.module.css';
import { content } from '../../../lib/public-content';
import { pageSeo } from '../../../lib/seo';
import { origin } from '../../../lib/site';

type Props = { params: Promise<{ party: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return content.parties.map((party) => ({ party: party.id }));
}
export async function generateMetadata({ params }: Props) {
  const { party: id } = await params;
  const party = content.getParty(id);
  if (!party) notFound();
  return pageSeo(
    party.name,
    `Consulta resúmenes y estado de revisión de ${party.name} por área.`,
    `/parties/${party.id}`,
    origin,
  );
}
export default async function PartyPage({ params }: Props) {
  const { party: id } = await params;
  const party = content.getParty(id);
  if (!party) notFound();
  return (
    <Shell
      partyId={party.id}
      section="parties"
      crumbs={[{ label: 'Partidos', href: '/parties' }, { label: party.name }]}
    >
      <PageHeader
        title={party.name}
        description="Consulta los resúmenes por área y el estado de su revisión editorial."
      />
      {party.officialWebsite && (
        <p className={styles.officialWebsite}>
          <a href={party.officialWebsite}>Web oficial de {party.name}</a>
        </p>
      )}
      <h2>Áreas del programa</h2>
      <Directory
        columns
        entries={content.topics.map((topic) => {
          const synthesis = content.getSynthesis(party.id, topic.id)!;
          return {
            label: topic.label,
            href: synthesis.path,
            status: synthesis.reviewStatus,
          };
        })}
      />
    </Shell>
  );
}
