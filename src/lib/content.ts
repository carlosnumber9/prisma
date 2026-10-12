export type Party = {
  id: string;
  name: string;
  officialWebsite: string | null;
};

export type Topic = { id: string; label: string; path: string };
export type ReviewStatus = 'pending' | 'partial' | 'complete';
export type Citation = {
  sourceId: string;
  segmentId: string;
  quote: string;
} & (
  | { page: number; printedPage?: string; section?: never; anchor?: never }
  | { section: string; anchor?: string; page?: never; printedPage?: never }
);
export type Point = {
  id: string;
  title: string;
  text: string;
  citations: Citation[];
};
export type Synthesis = {
  id: string;
  partyId: string;
  topicId: string;
  path: string;
  revision: number | null;
  reviewStatus: ReviewStatus;
  reviewedAt: string | null;
  sourceIds: string[];
  points: Point[];
};
export type Source = {
  id: string;
  partyId: string;
  electionDate: string;
  title: string;
  url: string;
  format: 'pdf' | 'html' | 'other';
  capturedAt: string;
  sha256: string;
  pageCount?: number;
};
export type Envelope<K extends string, T> = {
  schemaVersion: 2;
  electionDate: string;
} & Record<K, T[]>;
export type PublicContent = {
  parties: Envelope<'parties', Party>;
  topics: Envelope<'topics', Topic>;
  sources: Envelope<'sources', Source>;
  syntheses: Envelope<'syntheses', Synthesis>;
};

// The generator validates every field before build. Check the envelope boundary
// here so a mixed or obsolete projection cannot be consumed accidentally.
export function readPublicContent(input: unknown): PublicContent {
  if (!input || typeof input !== 'object')
    throw new Error('Expected public content envelopes');
  const records = input as Record<string, unknown>;
  let electionDate: string | undefined;
  for (const key of ['parties', 'topics', 'sources', 'syntheses']) {
    const envelope = records[key];
    if (!envelope || typeof envelope !== 'object')
      throw new Error(`Missing public envelope: ${key}`);
    const value = envelope as Record<string, unknown>;
    if (value.schemaVersion !== 2)
      throw new Error(`Unsupported public schema: ${key}`);
    if (typeof value.electionDate !== 'string' || !Array.isArray(value[key]))
      throw new Error(`Invalid public envelope: ${key}`);
    electionDate ??= value.electionDate;
    if (value.electionDate !== electionDate)
      throw new Error('Public envelopes refer to different elections');
  }
  return input as PublicContent;
}

export function createContentRepository(data: PublicContent) {
  const parties = new Map(data.parties.parties.map((item) => [item.id, item]));
  const topics = new Map(data.topics.topics.map((item) => [item.id, item]));
  const sources = new Map(data.sources.sources.map((item) => [item.id, item]));
  const syntheses = new Map(
    data.syntheses.syntheses.map((item) => [
      `${item.partyId}/${item.topicId}`,
      item,
    ]),
  );
  const getSource = (id: string) => {
    const source = sources.get(id);
    if (!source) throw new Error(`Missing public source: ${id}`);
    return source;
  };
  for (const party of parties.values()) {
    for (const topic of topics.values()) {
      if (!syntheses.has(`${party.id}/${topic.id}`))
        throw new Error(`Missing public synthesis: ${party.id}/${topic.id}`);
    }
  }
  for (const synthesis of syntheses.values()) {
    synthesis.sourceIds.forEach(getSource);
    synthesis.points.forEach((point) =>
      point.citations.forEach((citation) => getSource(citation.sourceId)),
    );
  }
  return {
    electionDate: data.parties.electionDate,
    parties: data.parties.parties,
    topics: data.topics.topics,
    syntheses: data.syntheses.syntheses,
    getParty: (id: string) => parties.get(id),
    getTopic: (id: string) => topics.get(id),
    getSynthesis: (partyId: string, topicId: string) =>
      syntheses.get(`${partyId}/${topicId}`),
    getSource,
    getSources: (synthesis: Synthesis) => synthesis.sourceIds.map(getSource),
  };
}

export type ContentRepository = ReturnType<typeof createContentRepository>;
