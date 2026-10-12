---
name: document-program
description: 'Incorporate or update official 2026 electoral programmes in Prisma: preserve sources, extract text, debate area syntheses and prepare agreed publication. Use for editorial incorporation, not portal UI implementation or read-only proposal questions.'
---

# Document a programme

Work from the repository root. Read the shared [editorial policy](../../../docs/editorial-policy.md), [content contract](../../../docs/content-contract.md) and [Git workflow](../../../docs/git-workflow.md). Do not maintain competing copies of these rules.

## Receive and preserve the source

- Use the URL or file supplied by the user. Ask for the specific source only if missing. For a local file, investigate official provenance before asking for information you can find.
- Verify the formation/coalition and the general election on 29 November 2026. Distinguish the full programme, sections and appendices from other political material; record corpus limitations.
- Check existing formation IDs before adding one. Do not confuse coalitions and constituent parties or claim exhaustive candidature coverage.
- Preserve original bytes and official URL. HTML and multi-page programmes are valid: capture each necessary document as a source of the same programme.
- Compute SHA-256 and use the contract's version directory. Do not overwrite an original with different bytes, even if its URL is unchanged.

## Extract and prepare the batch

- Use available extraction tools. Preserve every physical PDF page, including blank pages, and distinguish printed numbering. Preserve HTML sections and existing anchors while excluding navigation and unrelated material.
- Check columns, tables, figures, negations and conditions against the original. Use available OCR for scanned sources and verify it. If reliable extraction is unavailable, record the limitation rather than inventing text.
- Write extraction and metadata according to the contract. For other formats retain verifiable sections and record method/limits in review. The generator does not parse or summarise originals.
- Draft concise points with individual references for each formation/area. Preserve existing IDs and editorial order. Agree on changes to the shared topic classification before applying them.
- Record the batch in `content/reviews`. Every point needs a localisable supporting quote checked against the original. New unagreed points remain `draft`.

## Debate and publish

- Present proposed text, original evidence, ambiguity and fidelity questions by area. Consult relevant current external sources and express supported disagreement as required by the shared policy.
- While correcting published content, retain its approved version during debate and store alternatives in review. Do not withdraw existing points when generating another batch.
- Apply agreed wording to prepare the final batch; update revision, citations and explicit area state. Partial publication excludes pending points.
- Generate JSON, run the Git workflow's checks and show the final diff, evidence and verification before final publication agreement. Approved editorial text remains in the portal language; instructions and technical review records are English.
- If the same final batch and its publication are already approved, continue without routine reconfirmation. Otherwise leave reviewable changes prepared and explain outstanding disagreements.
- Re-read publication rules before every commit/push, use local Git over SSH on `master`, and report the commit, push and any actually verified deployment. A successful push does not prove deployment.

Do not generate prose in a build or page load, import another election's programme as 2026 content, or configure Next/Vercel as an incorporation side effect.
