import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildContent } from './generate-content.mjs';
import { projectProvincialContent } from './generate-provincial-content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const json = (path) => JSON.parse(readFileSync(path, 'utf8'));

// Recompute from editorial inputs, not a potentially stale generated projection.
export function researchTargets(directory) {
  const content = buildContent(directory, { approvedOnly: true });
  const partyBytes = content.get('parties.json');
  const synthesisBytes = content.get('syntheses.json');
  assert.ok(partyBytes && synthesisBytes, 'Missing programme projections');
  const { parties } = JSON.parse(partyBytes);
  const { syntheses } = JSON.parse(synthesisBytes);
  const dataset = json(
    resolve(directory, 'content/editorial/provincial-presence.json'),
  );
  const projection = projectProvincialContent(
    dataset,
    json(resolve(directory, 'content/geography/provinces.json')),
    parties,
    json(resolve(directory, 'content/editorial/programme-identities.json')),
  );
  const unlinked = new Map();
  for (const province of projection.provinces)
    for (const formation of province.parties)
      if (formation.programmeId === null) {
        const item = unlinked.get(formation.id) ?? {
          formationId: formation.id,
          name: dataset.formations.find((row) => row.id === formation.id).name,
          provinceIds: [],
        };
        item.provinceIds.push(province.id);
        unlinked.set(formation.id, item);
      }
  const missingProgrammes = [];
  const incompleteProgrammes = [];
  for (const party of parties) {
    const areas = syntheses.filter((row) => row.partyId === party.id);
    const item = {
      partyId: party.id,
      name: party.name,
      officialWebsite: party.officialWebsite,
      pendingAreas: areas
        .filter((row) => row.reviewStatus === 'pending')
        .map((row) => row.topicId),
      partialAreas: areas
        .filter((row) => row.reviewStatus === 'partial')
        .map((row) => row.topicId),
    };
    if (!areas.some((row) => row.sourceIds.length > 0))
      missingProgrammes.push(item);
    else if (item.pendingAreas.length || item.partialAreas.length)
      incompleteProgrammes.push(item);
  }
  return {
    electionDate: '2026-11-29',
    missingProgrammes,
    unlinkedFormations: [...unlinked.values()].sort((a, b) =>
      a.formationId < b.formationId
        ? -1
        : a.formationId > b.formationId
          ? 1
          : 0,
    ),
    incompleteProgrammes,
    note: 'Unlinked means no reviewed programme association, not proven source absence. Resolve duplicates and aliases using official evidence. Incomplete existing programmes are a separate opt-in expansion scope.',
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    if (process.argv.length !== 2)
      throw new Error('Usage: node scripts/research-targets.mjs');
    process.stdout.write(`${JSON.stringify(researchTargets(root), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
