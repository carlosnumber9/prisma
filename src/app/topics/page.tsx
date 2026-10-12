import { Shell, PageHeader } from '../../components/shell';
import { Directory } from '../../components/directory';
import { content } from '../../lib/public-content';
import { pageSeo } from '../../lib/seo';
import { origin } from '../../lib/site';

export const metadata = pageSeo(
  'Áreas',
  'Explora las ocho áreas de los programas y consulta los resúmenes disponibles por formación.',
  '/topics',
  origin,
);

export default function TopicsPage() {
  return (
    <Shell section="topics" crumbs={[{ label: 'Áreas' }]}>
      <PageHeader
        title="Áreas"
        description="Elige un tema para consultar qué resúmenes están disponibles en cada formación."
      />
      <Directory
        columns
        entries={content.topics.map((topic) => ({
          label: topic.label,
          href: topic.path,
        }))}
      />
    </Shell>
  );
}
