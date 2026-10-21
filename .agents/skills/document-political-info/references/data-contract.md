# Political reference data contract

This contract belongs to `document-political-info`. It defines approved reference JSON for future app consumption, separate from the [programme content contract](../../../../docs/content-contract.md). It does not change the four schema-v3 programme files or their consumers. No political reference data, dedicated generator, schema validator or portal integration is supplied by creating the skill.

## Storage and approval

```text
content/political-info/
  sources/<sourceId>/
    metadata.json
    original.<ext> | redacted.<ext>
    extracted.json
  reviews/YYYY-MM-DD-<datasetId>.md
  approved/<datasetId>.json
```

Create directories only when incorporating real material. Do not add synthetic political facts to the real corpus. Keep pre-approval JSON previews outside the repository; sources and review records may be prepared before acceptance. Approved files are authored after acceptance, not outputs of the existing programme generator. The app must explicitly import approved files when integration is implemented; never expose the whole tree.

Review records are English technical documents. Record the request/scope, material consumed and extraction limitations, proposed entity IDs, each claim's verification outcome, dated official evidence, contradictory or unavailable evidence, coverage, exact accepted/pending changes, verification and separate Git publication authorisation. Continue an existing record or choose a distinct filename rather than overwriting history. The repository may be public: keep sender identities and messages out of it. Public politicians' names are legitimate reference data, not sender metadata.

## Sources and citations

Preserve consulted official source bytes. Use `source-<first-12-SHA-256-characters>` as the source ID and retain the full hash. Identical bytes may reuse a snapshot; retain any additional provenance URLs in review. If a shortened ID collides with different bytes, extend the hash prefix consistently. Different bytes require another immutable snapshot even when the URL is unchanged.

Metadata contains exactly `id`, `title`, `url`, `authority`, `publishedAt`, `capturedAt`, `originalFile`, `sha256`, `extractionSha256` and `redacted`. `url` is a credential-free HTTP(S) URL, or `null` for supplied offline material. `authority` is `electoral`, `institutional`, `formation` or `user-supplied`; it records verified provenance, not a self-declared label. `publishedAt` is a verified ISO calendar date or `null`; `capturedAt` is an actual UTC ISO timestamp. `originalFile` is the local snapshot basename, never a path outside its source directory. Both hashes are full lowercase SHA-256 values. No symlinks are allowed.

If preserving original bytes would retain private identifiers or sender information, do not commit them. Preserve only the relevant public evidence in a redacted derivative named `redacted.<ext>`, set `redacted: true`, and hash that derivative. Explain the redaction and capture method in review; do not claim its hash authenticates the unavailable original. Preserve relevant public politician/candidate names and order.

`extracted.json` contains exactly `sourceId`, `sourceSha256` and `segments`. Each segment has `id`, `text` and either `page` (positive physical page number, optional `printedPage`) or `section` (nonempty string, optional real `anchor`). PDF extractions preserve physical pages, including blanks. Other formats use verifiable sections, rows, slides or time ranges as appropriate. Correcting extraction preserves referenced segment IDs, updates its hash and requires checking affected quotations. Source bytes remain immutable.

A citation contains exactly `sourceId`, `segmentId` and `quote`. The source and segment must exist; the nonempty quotation must occur in extraction allowing only whitespace normalization. Check it against the original too. Cite enough context to verify identity and meaning. Every entity, fact, candidature and candidate entry needs at least one citation. Only corroborating official sources belong in approved citations; user material remains review evidence. Public citations retain short supporting quotes, so use the minimum necessary and respect source quotation limits; do not publish complete source text.

## Approved envelope

An approved file contains exactly these keys:

```json
{
  "schemaVersion": 1,
  "datasetId": "<stable-dataset-slug>",
  "revision": 1,
  "reviewedAt": "<actual-UTC-review-timestamp>",
  "coverage": {
    "entityIds": ["<requested-scope-entity-id>"],
    "asOf": "<YYYY-MM-DD>",
    "status": "partial",
    "limitations": {
      "es": "<límites de cobertura>",
      "ca": "<límits de cobertura>",
      "gl": "<límites de cobertura>",
      "eu": "<coverage limitations in Basque>",
      "oc": "<coverage limitations in Aranese>",
      "en": "<coverage limitations>"
    }
  },
  "entities": [],
  "facts": [],
  "candidatures": [],
  "sources": []
}
```

This is a shape template, not valid publishable data. Use real verified records, not its placeholders. `schemaVersion: 1` versions only this political-reference contract; the programme schema remains 3. `revision` is a positive integer shared by the accepted batch. Increment for changed public content, references, coverage or review, retaining dataset and record IDs. `reviewedAt` is the last actual agreement/review time, not execution time.

IDs are nonempty lowercase ASCII slugs separated by single hyphens. Preserve existing IDs through name changes; resolve identities across existing datasets before assigning new ones. Formation IDs reuse `content/editorial/parties.json` when the identity matches. Other entity IDs should have clear prefixes such as `person-`, `election-`, `territory-` or `institution-`; names alone are not identity evidence. Record IDs are unique within their collection; entity identity is shared across datasets. An approved file is self-contained: referenced entities and sources must be included, even when shared with another dataset, and must remain consistent with existing approved data.

All object fields described here are allowlists; reject extras. Arrays may be empty when irrelevant, but an approved batch must contain verified entities and evidence. Deterministically sort entities, facts, candidatures and sources by ID; preserve candidate order. Do not insert runtime timestamps or transform approved prose during builds.

`coverage.entityIds` is a nonempty list identifying the requested scope, not a claim to all Spanish formations or people. `asOf` is the date for which that scope was checked. `status` is `partial` or `complete`; complete means only that the explicit requested scope is covered. `limitations` is a complete six-language map for partial coverage and may be `null` only for complete coverage without known limitations. A missing list does not mean there are no candidates. Source capture, review and historical validity are different dates.

## Entities and extensible facts

An entity contains exactly:

```json
{
  "id": "<stable-id>",
  "kind": "person",
  "name": "<verified-original-public-name>",
  "citations": [
    {
      "sourceId": "<source-id>",
      "segmentId": "<segment-id>",
      "quote": "<short-original-evidence>"
    }
  ]
}
```

`kind` is `formation`, `person`, `election`, `territory` or `institution`. A formation includes a party or coalition; distinguish their legal/organisational kind using an evidenced fact. Preserve original names and spellings. Do not translate a person's name or manufacture a translated legal name.

Other verified information is represented as facts with exactly `id`, `subjectId`, `predicate`, `value`, `scopeIds`, `validFrom`, `validUntil`, `asOf` and `citations`:

- `subjectId` references an entity. `predicate` is a stable English slug describing a specific factual property or relationship. Reuse the existing dataset vocabulary; explain a new predicate and its meaning in review before agreement. Examples: `official-website`, `formation-kind`, `constituent-formation`, `party-membership`, `office-held`, `election-date`, `territory-kind`, `parent-territory`.
- `value` has exactly one of these shapes: `{ "text": "<nonempty original factual value>" }`, `{ "entityId": "<referenced entity>" }`, `{ "date": "<YYYY-MM-DD>" }`, `{ "number": 1, "unit": "<explicit unit>" }`, `{ "boolean": true }`, or `{ "localized": { "es": "...", "ca": "...", "gl": "...", "eu": "...", "oc": "...", "en": "..." } }`. Text is for original names, source terminology, codes and URLs; authored descriptions use the complete localized map. Do not disguise editorial prose as untranslated source text.
- `scopeIds` is a list of related entity IDs contextualising the fact, such as the institution and territory for a role. A role need not imply membership, and a coalition relationship need not imply identity. Do not combine unrelated appointments into an ambiguous fact; agree a contract extension if the relationship needs additional structure.
- `validFrom` and `validUntil` are verified inclusive calendar dates or `null` for unknown boundaries, never guesses. `asOf` is the date checked. A null end date does not prove an ongoing role. Do not overwrite a historical fact with an incompatible current one; preserve dated versions and explain corrections.
- `citations` supports the complete assertion, including qualifiers. Absence from a source does not establish a negative boolean. Values are factual, attributed evidence rather than political judgments.

For common predicates use: `official-website` with credential-free HTTP(S) text; `formation-kind` with source terminology for party/coalition/other; `constituent-formation`, `party-membership` and `parent-territory` with entity references; `election-date` with a verified date; `office-held` with the original role title and institution/territory scope. Formation membership, candidature and office are separate relationships. A disputed allegation is not a verified personal fact; record the dispute in review rather than approving it as true.

Future verified political information can use another precisely defined predicate within these shapes. New entity kinds, value shapes or structural fields require an agreed contract/version change; never silently add arbitrary JSON keys.

## Candidatures and territorial coverage

A candidature contains exactly `id`, `formationId`, `electionId`, `institutionId`, `constituencyId`, `status`, `asOf`, `listCoverage`, `candidates` and `citations`:

- References must resolve to the corresponding `formation`, `election`, `institution` and `territory` entities. The same formation can have different lists by election, chamber and constituency. A province alone is not a sufficient list key. Election dates and territory kinds/relationships need verified facts when relevant to interpreting the list.
- `status` is `announced`, `submitted`, `proclaimed`, `withdrawn` or `replaced`, supported by dated evidence. Status reflects the stage actually verified, not an inferred legal conclusion. Subsequent official corrections take precedence for the same effective date; keep earlier source/review history. A replaced list is not silently relabelled current.
- `asOf` is a calendar date checked. `listCoverage` is `partial` or `complete` for that list, independent of dataset-wide coverage. Complete requires checking the full official list, including substitutes where applicable.
- `candidates` contains objects with exactly `personId`, `position`, `category` and `citations`. `personId` references a person; `position` is a positive integer preserving the published order; `category` is `regular` or `substitute`. Positions are unique within a category, which is ordered independently. Do not alphabetize candidates or renumber an extracted partial list to close gaps.
- Each person can appear only once in a candidature unless the actual electoral structure requires a reviewed contract extension. An empty candidate array is allowed only for a partial record whose evidence establishes the candidature but not its members. It never proves an officially empty list.

Use territory entities and `territory-kind`/`parent-territory` facts to represent provinces, islands, municipalities, autonomous cities and other actual constituencies. Do not store citizen addresses or infer a person's constituency from residence. Geographic matching and user-location features are future app work; this skill preserves the official constituency identity needed by them.

## Public sources and final verification

Each public source contains exactly `id`, `title`, `url`, `authority`, `publishedAt`, `capturedAt`, `sha256` and `redacted`, projected from preserved metadata. Only official sources actually cited by the accepted batch appear here. Exclude local filenames, extraction hashes/text, original files, personal data and review notes. Derive page or section locators for future UI from citations and preserved extraction during a separately implemented projection; do not claim an existing public source endpoint.

Before presenting the batch, parse its JSON and check all shapes/allowlists, unique IDs and positions, entity kinds/references, citations, source hashes and actual quotation occurrence. Check real calendar/UTC dates, effective-date ordering, source authority, partial-coverage limitations and six-language prose completeness. Verify the same facts in existing approved datasets have compatible IDs and wording; update affected datasets together only if those changes are also accepted. Source hash correctness is not factual verification.

After acceptance, save the exact allowed projection and recheck it against the accepted preview. Record checks and their limits. `npm run docs:check` validates skill metadata and documentation links; `npm run content:check` validates only the programme pipeline. Neither is a political-reference schema or semantic validator. Do not present a successfully parsed JSON file as proof of factual accuracy, human agreement or app integration.
