# Programme content contract

The offline generator validates reviewed summaries and supporting citation excerpts. The portal imports only the four generated programme envelopes; [provincial presence](provincial-data.md) has its own small contract. Builds never fetch originals, generate prose or translate text.

## Storage and ownership

```text
content/
  editorial/
    parties.json
    topics.json
    programme-identities.json
    provincial-presence.json
    syntheses/<partyId>/<topicId>.json
  sources/<sourceId>/
    metadata.json
    extracted.json
  generated/
    parties.json
    topics.json
    sources.json
    syntheses.json
```

Store only accepted programme/catalogue data and the minimum evidence needed to maintain it. New drafts, raw downloads, complete PDFs/HTML, full-page extractions, search results, task packets and review reports belong outside Git. `content/reviews` and `content/political-info` are rejected. Generated files are derived, never hand-edited. Do not expose the entire content tree.

## Catalogues and identifiers

`parties.json` is an array with required `id`, `name`, nullable `officialWebsite` and optional nullable `officialColor` and `officialFont`. Websites are credential-free HTTP(S) URLs, or `null` when not accepted. Do not assign a constituent party's website to its coalition. [Catalogue provenance](catalogue-provenance.md) records only evidence and limits relevant to displayed values.

Colours are evidenced six-digit hexadecimal values. Fonts have exactly `family`, local `src` under `/fonts/parties/` with a supported font extension, and integer `weight` from 1 to 1000. The regular local file and embedding licence must exist before inclusion. Missing branding uses the neutral theme and site font; do not research unused brand variants.

`topics.json` is the sole area catalogue, with exactly `id` and six-language `label`. All catalogue IDs are stable lowercase ASCII slugs separated by single hyphens. `programme-identities.json` contains the evidenced aliases described in [provincial programme identity](provincial-data.md#programme-identity-and-geography). Unknown fields and duplicate IDs fail validation.

Base paths are `/parties/<party>/<topic>` and `/topics/<topic>`, prefixed at presentation time with a supported locale. Preserve public IDs and anchors through wording/order changes.

## Source versions and citation excerpts

Each source directory has exactly `metadata.json` and `extracted.json`, without symlinks or extra captures. Metadata contains exactly:

- `id`, `partyId`, `electionDate`, `title`, official `url`, `format`, `capturedAt`;
- `evidenceKind: "citation-excerpts"`, `sha256`, `extractionSha256`;
- positive `pageCount` for PDF only.

The fixed election date is `2026-11-29`; format is `pdf`, `html` or `other`. `capturedAt` is the actual UTC consultation time, not a publication date. URLs must be credential-free HTTP(S). Both hashes are full lowercase SHA-256. Source IDs remain `<partyId>-2026-<first-12-original-hash-characters>`.

`sha256` identifies the original bytes consulted during authoring. That original is no longer stored or rehashed during builds. Do not claim the excerpt authenticates the original, and do not invent an original digest from a search result or edited derivative. A changed original gets a new source version. `extractionSha256` is checked against the exact retained `extracted.json` bytes, including whitespace.

Extraction contains exactly `sourceId`, `sourceSha256` and `segments`. Each segment contains `id`, `text` and either a positive physical `page` with optional `printedPage`, or nonempty `section` with optional real `anchor`. PDF pages are unique, increasing and no greater than `pageCount`; omitted uncited pages are expected. Section anchors must exist in the official source.

Retain only cited segments. Segment text is the sorted, unique set of normalized original quotations used for that segment, joined with blank lines. Normalize whitespace only; preserve wording, punctuation, hyphens, negations and conditions. All retained text must be accounted for by actual citations; surplus text and unused segments fail validation. A completed review with no points may retain source metadata and an empty segment array. Undeclared sources fail validation.

Verify quotations and their surrounding context against the full official original during authoring or correction, using an external temporary copy. The small repository evidence supports reference integrity and exact quote occurrence, not independent offline reinspection of the complete original. See [ADR 0005](adr/0005-minimal-citation-evidence.md).

## Editable syntheses

A synthesis has exactly `id`, `partyId`, `topicId`, positive `revision`, `reviewStatus`, `reviewedAt`, `sourceIds`, `points` and optional `internalNotes`. Its ID is `<party>--<topic>` and must match its path. Each point has exactly stable `id`, `title`, `text`, `status`, `citations` and optional `internalNotes`. Notes are only for a material interpretation limit needed to maintain that point; do not retain execution histories or duplicate wording.

Titles and texts of approved points are complete maps of `es`, `ca`, `gl`, `eu`, `oc` and `en`. Drafts in an external staging root require at least Castilian and may contain other supported locales. The actual repository commands use `--approved-only` and reject draft points. All point IDs are globally unique. Quotes and official names remain in their original language.

Each citation has exactly `sourceId`, `segmentId` and a nonempty original `quote`. It must resolve to a declared source of the same formation and occur in the retained segment after whitespace normalization. Preserve sufficient source context during review to avoid misleading excerpts.

- `pending`: no approved points, `reviewedAt: null`.
- `partial`: at least one approved point, reviewed sources and an actual UTC review timestamp.
- `complete`: all points approved, or no points after reviewing the relevant corpus; retain reviewed source references.

Missing formation/area files produce empty pending entries. Completion describes the reviewed synthesis, not an exhaustive programme catalogue. Preserve the approved version during debate. Any change to public wording, order, references or review state increments the shared revision and checks all six versions. Storage-only cleanup and removal of unused public evidence fields do not rewrite editorial history.

## Public projection

All four envelopes use `schemaVersion: 4`, `electionDate: "2026-11-29"` and an array named `parties`, `topics`, `sources` or `syntheses`. Schema 4 removes supporting literal `quote` from public citations; all consumers migrate together. Editorial evidence retains quotes. Older programme schemas are rejected by the reader. Provincial schema 1 is independent.

Public syntheses have `id`, `partyId`, `topicId`, `path`, `revision`, `reviewStatus`, `reviewedAt`, `sourceIds` and approved `points` in editorial order. Public points have `id`, six-language `title` and `text`, and citations with `sourceId`, `segmentId` and derived page/section locators. No literal quotes, internal notes, draft text, extraction text or local paths are exposed. State and revision remain necessary for availability, indexing and correction identity even when not displayed.

Pending entries expose no revision, points or sources. Partial entries expose only approved-point sources; complete entries retain reviewed sources. Public sources have exactly `id`, `partyId`, `electionDate`, `title`, `url`, `format`, `capturedAt`, the recorded original `sha256` and PDF `pageCount` when applicable. Their hashes identify consulted versions rather than a downloadable local archive.

## Accepted byte application

OpenCode authoring can use the [accepted-batch writer](opencode.md#accepted-batch-writer) to apply exact reviewed programme/catalogue/evidence JSON and regenerate both projections. It accepts existing contract data, not a competing editorial schema. Its manifest is an external handoff with baseline/proposed hashes, an independent QA files digest and an actual maintainer/delegated authorization reference. Those declarations do not establish semantic correctness or consent by themselves. Direct editorial work remains governed by the existing skills and publication agreement.

## Generation and verification

```sh
npm run content:generate
npm run content:check
npm run test
```

The content commands validate both programme and provincial pipelines. Invalid inputs preserve previous JSON. Generation writes each public file by rename; an interrupted set must be regenerated and checked together. `--check` compares expected bytes without writing and rejects unexpected output files. Identical inputs produce identical bytes and never rewrite review dates or editable prose.

For unapproved preparation use `node scripts/generate-content.mjs --root <external-staging-root> [--check]`. Omit `--approved-only` only in such an isolated root. Real/synthetic drafts and raw source artifacts must never be copied into the actual corpus for a rehearsal.
