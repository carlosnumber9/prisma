---
name: document-program
description: Incorporate or update reviewed official 2026 programme summaries in Prisma, retaining only approved portal content and cited evidence. Use for editorial incorporation, not portal implementation or read-only proposal questions.
---

# Document a programme

Read the [editorial policy](../../../docs/editorial-policy.md), [content contract](../../../docs/content-contract.md), [catalogue provenance](../../../docs/catalogue-provenance.md) and [Git workflow](../../../docs/git-workflow.md).

Verify the official source and its adoption for the 29 November 2026 election. Reuse stable formation IDs and distinguish parties, coalitions and territorial programme associations. Do not substitute another election's programme or campaign announcements for an eligible source. Record edition and corpus limits without inventing dates.

Download and inspect full originals in an external working directory. Verify each quotation, page/section and surrounding context. Prepare a cited selection for the current policy areas, preserving figures, beneficiaries, conditions, deadlines, negations and commitment strength. Investigate disputed interpretations with relevant current primary sources; keep external conclusions separate from the programme's wording.

Draft Castilian against the original, then prepare faithful `ca`, `gl`, `eu`, `oc` and `en` versions. Present the exact six-language batch, citations, changes and unresolved questions for maintainer review or delegated language review. Unagreed points and alternative translations remain in an external staging root. Preserve existing approved content throughout debate.

After agreement, keep only accepted catalogue fields, approved synthesis points and the contract's minimal source metadata and cited excerpts. Retain stable segment/point IDs and page/section locators. Hash the actually consulted original for version identity and the retained excerpt bytes for build validation; do not claim the original is locally reverified. Do not commit PDFs, complete HTML, uncited pages, draft prose, search results, repeated translations or review reports. Add a concise current limitation only when needed to maintain displayed content.

Increment revisions only for changed public editorial wording, ordering, references or review state, checking all six versions together. Use `npm run content:generate`, `npm run content:check` and relevant tests. Repository commands reject drafts and surplus evidence; isolated draft preparation may use the generator with `--root` without `--approved-only`. Show the exact changed batch and verification before any outstanding publication agreement.

Existing acceptance of the unchanged final batch and its publication is sufficient; do not request routine reconfirmation. Follow local Git over SSH on `master`, and report checks, commits, push and material limits. Do not generate prose during builds or visits, collect politician profiles or candidate lists, start an app server, or change deployment settings as an incorporation side effect.
