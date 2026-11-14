import type { Party, Topic } from './content.ts';
import { dictionaries, localizedPath, type Locale } from './i18n.ts';
import { partyAccent } from './themes.ts';

export type Crumb = { id: string; label: string; href?: string };
export type ShellRoute = {
  accent: string;
  section?: 'parties' | 'topics';
  crumbs: Crumb[];
};

export function commonCrumbCount(previous: Crumb[], next: Crumb[]) {
  let count = 0;
  while (
    count < previous.length &&
    count < next.length &&
    previous[count]!.id === next[count]!.id
  )
    count++;
  return count;
}

/** Only navigation labels and colours cross the client boundary, never programme data. */
export function shellRoutes(locale: Locale, parties: Party[], topics: Topic[]) {
  const m = dictionaries[locale];
  const path = (value: string) => localizedPath(value, locale);
  const home: Crumb = { id: path('/'), label: m.home, href: path('/') };
  const routes: Record<string, ShellRoute> = {
    [path('/')]: { accent: partyAccent(), crumbs: [] },
  };
  for (const section of ['parties', 'topics'] as const) {
    routes[path(`/${section}`)] = {
      accent: partyAccent(),
      section,
      crumbs: [home, { id: path(`/${section}`), label: m[section] }],
    };
  }
  for (const party of parties) {
    const base = path(`/parties/${party.id}`);
    const parent = {
      id: path('/parties'),
      label: m.parties,
      href: path('/parties'),
    };
    routes[base] = {
      accent: partyAccent(party),
      section: 'parties',
      crumbs: [home, parent, { id: base, label: party.name }],
    };
    for (const topic of topics) {
      const id = `${base}/${topic.id}`;
      routes[id] = {
        accent: partyAccent(party),
        section: 'parties',
        crumbs: [
          home,
          parent,
          { id: base, label: party.name, href: base },
          { id, label: topic.label[locale] },
        ],
      };
    }
  }
  for (const topic of topics) {
    const id = path(`/topics/${topic.id}`);
    routes[id] = {
      accent: partyAccent(),
      section: 'topics',
      crumbs: [
        home,
        { id: path('/topics'), label: m.topics, href: path('/topics') },
        { id, label: topic.label[locale] },
      ],
    };
  }
  return routes;
}
