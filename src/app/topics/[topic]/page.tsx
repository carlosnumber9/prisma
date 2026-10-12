import { notFound } from 'next/navigation';
import { Shell, PageHeader } from '../../../components/shell';
import { Directory } from '../../../components/directory';
import { content } from '../../../lib/public-content';
import { pageSeo } from '../../../lib/seo';
import { origin } from '../../../lib/site';

type Props = { params: Promise<{ topic: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return content.topics.map((topic) => ({ topic: topic.id }));
}
export async function generateMetadata({ params }: Props) {
  const { topic: id } = await params;
  const topic = content.getTopic(id);
  if (!topic) notFound();
  return pageSeo(
    topic.label,
    `Consulta disponibilidad de resúmenes sobre ${topic.label.toLocaleLowerCase('es-ES')} por formación.`,
    topic.path,
    origin,
  );
}
export default async function TopicPage({ params }: Props) {
  const { topic: id } = await params;
  const topic = content.getTopic(id);
  if (!topic) notFound();
  return (
    <Shell
      section="topics"
      crumbs={[{ label: 'Áreas', href: '/topics' }, { label: topic.label }]}
    >
      <PageHeader
        title={topic.label}
        description="Consulta la disponibilidad por formación. Cada enlace abre el resumen de este tema para ese partido."
      />
      <Directory
        entries={content.parties.map((party) => {
          const synthesis = content.getSynthesis(party.id, topic.id)!;
          return {
            label: party.name,
            href: synthesis.path,
            status: synthesis.reviewStatus,
          };
        })}
      />
    </Shell>
  );
}
