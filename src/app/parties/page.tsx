import { Shell, PageHeader } from '../../components/shell';
import { Directory } from '../../components/directory';
import { content } from '../../lib/public-content';
import { pageSeo } from '../../lib/seo';
import { origin } from '../../lib/site';

export const metadata = pageSeo(
  'Partidos',
  'Consulta las áreas y resúmenes disponibles de cada formación de la selección inicial.',
  '/parties',
  origin,
);

export default function PartiesPage() {
  return (
    <Shell section="parties" crumbs={[{ label: 'Partidos' }]}>
      <PageHeader
        title="Partidos"
        description="Selección inicial de formaciones. Entra en un partido para consultar sus áreas y el estado de cada resumen."
      />
      <Directory
        entries={content.parties.map((party) => ({
          label: party.name,
          href: `/parties/${party.id}`,
        }))}
      />
    </Shell>
  );
}
