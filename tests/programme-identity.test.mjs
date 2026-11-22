import assert from 'node:assert/strict';
import test from 'node:test';
import { programmeForFormation } from '../scripts/programme-identity.mjs';

const programme = { id: 'fixture-party', name: 'Fixture Party' };

test('one programme matches all electoral IDs with the same complete formation name', () => {
  for (const formation of [
    { id: 'formation-fixture-party-fp', name: 'FIXTURE PARTY (FP)' },
    { id: 'formation-fixture-party', name: 'Fixture Party' },
    { id: 'another-electoral-id', name: ' Fíxture   Party (F.P.) ' },
  ])
    assert.equal(programmeForFormation(formation, [programme]), programme);
});

test('adding a programme later links existing formations without changing the electoral dataset', () => {
  const formation = {
    id: 'formation-fixture-party-fp',
    name: 'FIXTURE PARTY (FP)',
  };
  assert.equal(programmeForFormation(formation, []), undefined);
  assert.equal(programmeForFormation(formation, [programme]), programme);
});

test('stable programme IDs take precedence and complete acronyms support official name variations', () => {
  assert.equal(
    programmeForFormation({ id: programme.id, name: 'Renamed formation' }, [
      programme,
    ]),
    programme,
  );
  const short = { id: 'fp', name: 'FP' };
  assert.equal(
    programmeForFormation(
      { id: 'electoral-variant', name: 'Official regional name (F.P.)' },
      [short],
    ),
    short,
  );
  assert.equal(
    programmeForFormation(
      { id: 'electoral-variant', name: 'Fixture Party (FP)' },
      [programme, short],
    ),
    programme,
  );
});

test('coalition members, partial names and token fragments never inherit a programme', () => {
  for (const name of [
    'Other Fixture Party',
    'Fixture Party Coalition',
    'Partner Alliance (FP-OTHER)',
    'Partner Alliance (OTHER, FP)',
    'Fixture Party / Other Party',
  ]) {
    assert.equal(
      programmeForFormation({ id: 'coalition-fixture', name }, [
        programme,
        { id: 'fp', name: 'FP' },
      ]),
      undefined,
    );
  }
});

test('ambiguous matching fails instead of choosing a programme arbitrarily', () => {
  assert.throws(
    () =>
      programmeForFormation(
        { id: 'electoral-fixture', name: 'Fixture Party (FP)' },
        [programme, { id: 'other-fixture', name: 'Fíxture Party' }],
      ),
    /Ambiguous programme identity/,
  );
});

test('explicit national identity aliases are reused without splitting coalition acronyms into members', () => {
  const party = { id: 'fixture-party', name: 'Fixture Party' };
  const aliases = { 'fixture-party': ['FP-REGION', 'FPR'] };
  assert.equal(
    programmeForFormation(
      { id: 'regional-identity', name: 'Regional Label (FP-REGION)' },
      [party],
      aliases,
    ),
    party,
  );
  assert.equal(
    programmeForFormation(
      { id: 'coalition-identity', name: 'Coalition (FPR-OTHER)' },
      [party],
      aliases,
    ),
    undefined,
  );
  assert.throws(
    () =>
      programmeForFormation({ id: 'fixture', name: 'Fixture' }, [party], {
        unknown: ['X'],
      }),
    /Unknown programme identity/,
  );
});
