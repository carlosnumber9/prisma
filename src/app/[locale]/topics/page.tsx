import { dictionaries, type Locale } from '../../../lib/i18n';
import { Shell, PageHeader } from '../../../components/shell';
import { Directory } from '../../../components/directory';
import { content } from '../../../lib/public-content';
import { pageSeo } from '../../../lib/seo';
import { origin } from '../../../lib/site';

type Props = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const m = dictionaries[locale];
  return pageSeo(m.topics, m.topicsMeta, '/topics', origin, true, locale);
}

export default async function TopicsPage({ params }: Props) {
  const { locale } = await params;
  const m = dictionaries[locale];
  return (
    <Shell locale={locale} section="topics" crumbs={[{ label: m.topics }]}>
      <PageHeader title={m.topics} description={m.topicsDescription} />
      <Directory
        locale={locale}
        columns
        entries={content.topics.map((topic) => ({
          label: topic.label[locale],
          href: topic.path,
        }))}
      />
    </Shell>
  );
}
