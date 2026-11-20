import { dictionaries, type Locale } from '../../../lib/i18n';
import { Shell, PageHeader } from '../../../components/shell';
import { ProvincialPartyDirectory } from '../../../components/provincial-party-directory';
import { content } from '../../../lib/public-content';
import { pageSeo } from '../../../lib/seo';
import { origin } from '../../../lib/site';

type Props = { params: Promise<{ locale: Locale }> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const m = dictionaries[locale];
  return pageSeo(m.parties, m.partiesMeta, '/parties', origin, true, locale);
}

export default async function PartiesPage({ params }: Props) {
  const { locale } = await params;
  const m = dictionaries[locale];
  return (
    <Shell>
      <PageHeader title={m.parties} description={m.partiesDescription} />
      <ProvincialPartyDirectory
        locale={locale}
        parties={content.parties.map((party) => ({
          label: party.name,
          href: `/parties/${party.id}`,
        }))}
      />
    </Shell>
  );
}
