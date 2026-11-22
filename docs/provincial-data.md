# Provincial electoral data

The editable [formation presence inventory](../content/editorial/provincial-presence.json) preserves 534 proclaimed Congress presences in the 52 provinces for 29 November 2026. It contains only the original formation denominations, stable IDs, province membership, revision, electoral cutoff and official source URLs. Its factual inventory was accepted on 20 November; the storage cleanup of 22 November changes neither that cutoff nor its revision.

## Contract

The envelope has exactly `schemaVersion: 1`, `electionDate`, positive `revision`, `asOf`, `sources`, `formations` and `provinces`. `electionDate` is `2026-11-29`. `asOf` is the verified electoral cutoff, never a build timestamp.

Each source has exactly `id`, `title`, `url` and `publishedAt`. Source URLs are credential-free HTTPS BOE URLs, with valid publication dates no later than the cutoff. Each formation has exactly `id` and its original `name`. Each province has exactly `id` and a nonempty `formationIds` array. All 52 IDs must match the geographic inventory, every formation reference must resolve, formation/province pairs must be unique and every stored formation must be used.

Do not add people, offices, biographies, individual affiliations, candidate names, candidate order, substitutes, Senate lists, generic facts, full captures or research reviews. Unknown fields are rejected. Draft changes and investigation artifacts stay outside the repository until a concrete portal batch is accepted.

## Provenance and verification

The accepted inventory used [BOE proclamation of 3 November](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-23103) and [correction of 7 November](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-23383). The proclamation contains 555 Congress headings, including 21 explicitly unproclaimed blocks; only 534 proclaimed presences are retained. The correction changes the EH Bildu Congress denomination in Navarra. Personal corrections and Senate material are outside this dataset.

`npm run provincial:generate` validates this scoped contract and writes `content/generated-provincial/congress.json`; `provincial:check` compares expected bytes without writing. Both are included in the content commands. Validation rejects legacy `content/political-info` research storage. It does not fetch or authenticate current BOE contents, prove semantic correctness or establish that no subsequent change exists. Consult official publications and corrections again before changing current electoral facts. Full source captures and historical investigation reports are deliberately absent.

## Programme identity and geography

The public projection retains province IDs, formation IDs, display labels and optional programme IDs. One national programme is reused for all matching provincial identities through `scripts/programme-identity.mjs`. [Programme aliases](../content/editorial/programme-identities.json) declare accepted national presentation associations such as PSOE/PSC and regional labels. Complete names/acronyms may match; coalition members are never split out and ambiguous matches fail. New aliases require evidence and agreement. The cleanup preserves all existing labels, links and IDs.

[Province names and aliases](../content/geography/provinces.json), [IGN provenance](../content/geography/metadata.json) and the local polygon derivative support browser location matching and manual selection. Attribution: Obra derivada de BDDAE CC-BY 4.0 ign.es. Simplification has a tolerance of a few tens of metres; manual province selection remains authoritative. Geolocation denial, unavailable geometry and outside positions retain Madrid. Location coordinates are never added to electoral content.
