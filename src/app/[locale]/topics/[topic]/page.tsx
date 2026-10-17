import { dictionaries, text, type Locale } from '../../../../lib/i18n';
import { notFound } from 'next/navigation';
import { Shell, PageHeader } from '../../../../components/shell';
import { Directory } from '../../../../components/directory';
import { content } from '../../../../lib/public-content';
import { pageSeo } from '../../../../lib/seo';
import { origin } from '../../../../lib/site';

type Props = { params: Promise<{ locale: Locale; topic: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return content.topics.map((topic) => ({ topic: topic.id }));
}
export async function generateMetadata({ params }: Props) {
  const { topic: id, locale } = await params;
  const m = dictionaries[locale];
  const topic = content.getTopic(id);
  if (!topic) notFound();
  return pageSeo(
    topic.label[locale],
    text(m.topicMeta, { topic: topic.label[locale] }),
    topic.path,
    origin,
    true,
    locale,
  );
}
export default async function TopicPage({ params }: Props) {
  const { topic: id, locale } = await params;
  const m = dictionaries[locale];
  const topic = content.getTopic(id);
  if (!topic) notFound();
  return (
    <Shell
      locale={locale}
      section="topics"
      crumbs={[
        { label: m.topics, href: '/topics' },
        { label: topic.label[locale] },
      ]}
    >
      <PageHeader
        title={topic.label[locale]}
        description={m.topicDescription}
      />
      <Directory
        locale={locale}
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
