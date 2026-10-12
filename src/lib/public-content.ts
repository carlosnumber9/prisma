import parties from '../../content/generated/parties.json';
import topics from '../../content/generated/topics.json';
import sources from '../../content/generated/sources.json';
import syntheses from '../../content/generated/syntheses.json';
import { createContentRepository, readPublicContent } from './content';

export const content = createContentRepository(
  readPublicContent({ parties, topics, sources, syntheses }),
);
