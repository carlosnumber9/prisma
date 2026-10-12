# Content contract

Use Node.js 24.x. The generator uses standard libraries only: it does not fetch sources, parse originals, call models or redact prose.

## Layout and ownership

```text
content/
  editorial/
    parties.json
    topics.json
    syntheses/<partyId>/<topicId>.json
  sources/<sourceId>/
    metadata.json
    original.pdf | original.html | original.<ext>
    extracted.json
  reviews/<date>-<identifier>.md
  generated/
    parties.json
    topics.json
    sources.json
    syntheses.json
```

Originals, extractions, editorial records and reviews are versioned in Git. `.gitattributes` prevents source/extraction line-ending conversion, because hashes refer to bytes. `generated` files are derived and must not be hand-edited. Next must import these four files explicitly, never expose the entire content tree.

Examples below are templates: replace markers with verified values. They are not publishable programme data. Automated fixtures live in temporary directories, never in the real content corpus.

## Catalogues and identifiers

`parties.json` is an array of objects with exactly `id`, `name` and `officialWebsite`. It starts empty. IDs are stable slugs; the visible formation name retains its intended language. Website URLs must be HTTP(S) without credentials.

`topics.json` is an array with exactly `id` and `label` and is the sole definition of the eight initial areas. Catalogue IDs are unique lowercase ASCII letters/numbers separated by single hyphens, without leading or trailing hyphens. Unknown fields are rejected.

Synthesis routes are `/parties/<partyId>/<topicId>`; topic routes are `/topics/<topicId>`. Changing labels does not change slugs. Do not silently rename published IDs or renumber points when reordering them. See [versioning](versioning.md) for compatibility rules.

## Source snapshots

Hash the original bytes with SHA-256. The source ID is `<partyId>-2026-<first-12-hash-characters>`; retain and verify the full hash. Different original bytes create another directory, even if the URL is unchanged.

Each source directory contains the original, `metadata.json` and `extracted.json`. Name PDF originals `original.pdf`, HTML `original.html` or `original.htm`, and other formats `original.<ext>`. Symlinks are rejected. Keep extraction methods and limitations in the review record, not extra source-directory files. `.gitkeep` and Finder metadata are ignored.

Metadata fields are:

```json
{
  "id": "<sourceId>",
  "partyId": "<partyId>",
  "electionDate": "2026-11-29",
  "title": "<official document title and edition>",
  "url": "<official HTTP(S) URL>",
  "format": "pdf",
  "capturedAt": "<UTC ISO 8601 timestamp>",
  "originalFile": "original.pdf",
  "sha256": "<full original SHA-256>",
  "extractionSha256": "<full extracted.json SHA-256>",
  "pageCount": 1
}
```

`format` is `pdf`, `html` or `other`. A positive `pageCount` is required for PDF and prohibited for other formats. UTC timestamps accept seconds and optional three-digit milliseconds, such as `2026-10-12T10:00:00Z`. `capturedAt` is consultation time, not an invented publication date.

Use `shasum -a 256 <file>` to obtain hashes. Compute the extraction hash after writing its final bytes; whitespace changes also affect the hash.

## Extracted segments

```json
{
  "sourceId": "<sourceId>",
  "sourceSha256": "<full original SHA-256>",
  "segments": [
    {
      "id": "page-1",
      "page": 1,
      "printedPage": "i",
      "text": "<extracted text>"
    }
  ]
}
```

For PDF, preserve exactly one segment for each physical page, in order from 1 to `pageCount`, including covers and blank pages. `printedPage` is an optional string allowing numbers, Roman numerals or labels. Physical page numbers must not be replaced by printed numbers.

For HTML and other formats, each segment has `id`, `section`, `text` and an optional real `anchor`, such as `#housing`, with no page fields. Do not invent anchors absent from the site. Capture each necessary URL separately for a multi-page programme. For a rendered page, retain a snapshot containing the verified visible programme text and explain the capture method in review.

Segment IDs are unique within a source. Blank-page text can be empty, but the full extraction needs verifiable text. Correcting extraction of the same original updates its hash and review record without breaking existing segment references.

## Editable syntheses

Each `syntheses/<partyId>/<topicId>.json` has this structure:

```json
{
  "id": "<partyId>--<topicId>",
  "partyId": "<partyId>",
  "topicId": "<topicId>",
  "revision": 1,
  "reviewStatus": "partial",
  "reviewedAt": "<UTC review timestamp>",
  "sourceIds": ["<sourceId>"],
  "internalNotes": "<optional anonymised review note>",
  "points": [
    {
      "id": "<globally-stable-point-id>",
      "title": "<short heading>",
      "text": "<reviewed summary in the portal language>",
      "status": "approved",
      "citations": [
        {
          "sourceId": "<sourceId>",
          "segmentId": "page-1",
          "quote": "<supporting original quotation>"
        }
      ]
    }
  ]
}
```

Point IDs are globally unique, including drafts. Every point needs a title, text, `draft` or `approved` status and at least one verifiable citation. Optional point and synthesis `internalNotes` never enter public JSON.

A citation must reference an existing segment in a declared source belonging to the same formation. The quote must occur in extraction allowing only whitespace differences; do not change words, hyphens, punctuation or conditions. Public page/section/anchor fields are derived from the segment rather than entered twice.

`revision` is a positive integer, incremented on public wording, order, citation or review-state changes. Preserve synthesis and point IDs. `reviewedAt` describes the last editorial review of the public batch, not generator execution.

| `reviewStatus` | Points                                                     | `reviewedAt`  | Sources                       |
| -------------- | ---------------------------------------------------------- | ------------- | ----------------------------- |
| `pending`      | No approved points; drafts permitted                       | `null`        | Sources supporting any drafts |
| `partial`      | At least one approved point; drafts permitted              | UTC timestamp | At least one                  |
| `complete`     | All approved, or empty after reviewing the relevant corpus | UTC timestamp | At least one                  |

Missing formation/area files generate empty pending entries, not placeholder prose. While debating changes to a published point, retain its approved editorial version and keep alternatives in review records. The approved state cannot itself prove human consensus or semantic fidelity; skills must verify both before publication.

## Public projection

Every generated file contains `schemaVersion: 1`, `electionDate: "2026-11-29"` and an array named `parties`, `topics`, `sources` or `syntheses`.

- Catalogues are sorted by ID; topics include their public path.
- Syntheses contain `id`, `partyId`, `topicId`, `path`, `revision`, `reviewStatus`, `reviewedAt`, `sourceIds` and approved `points` in editorial order.
- Public points contain only `id`, `title`, `text` and `citations`. IDs can be used as page anchors.
- Pending entries expose a null revision, no points and no sources. Partial entries expose only approved-point sources. Complete entries retain all reviewed sources, including when no proposals were identified.
- Public sources contain only `id`, `partyId`, `electionDate`, `title`, `url`, `format`, `capturedAt`, `sha256` and, for PDF, `pageCount`. Extraction text and local paths are excluded.

## Generation and verification

```sh
npm run content:generate
npm run content:check
npm run test
```

Generation validates all catalogues, snapshots, hashes, extraction and syntheses before writing public output. Invalid input preserves prior JSON. Valid output replaces each file by rename; an I/O failure may interrupt the set, so regenerate and validate the whole set before publication.

`content:check` compares expected bytes without writing. Unexpected output files are rejected rather than deleted. The generator neither inserts current timestamps nor rewrites editable records. Identical inputs produce identical bytes.

For isolated rehearsals use `node scripts/generate-content.mjs --root <temporary-directory> [--check]`; keep synthetic content outside the real corpus.
