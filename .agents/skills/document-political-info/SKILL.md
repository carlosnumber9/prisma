---
name: document-political-info
description: Verify formation identity, displayed branding and provincial Congress presence for Prisma's 29 November 2026 portal. Use for accepted catalogue/presence updates, not politician profiles, individual candidate lists or programme synthesis.
---

# Document formation information

Read the [contract](references/data-contract.md), [editorial policy](../../../docs/editorial-policy.md) and [Git workflow](../../../docs/git-workflow.md).

Research only information used by the current portal: formation identity, an official website, displayed branding, a verified programme association or Congress presence in the 52 provinces. The fixed election is 29 November 2026. People, biographies, offices, individual affiliations, candidate names/order, substitutes and Senate lists are outside scope. Do not expand a formation request into those subjects.

Verify claims online using official electoral publications and corrections or authenticated formation/brand sources. A source establishes only the claim within its authority. Distinguish parties, regional labels and coalitions; do not infer a coalition programme from one member. Check actual publication dates and cutoff. Missing evidence remains unresolved, not a negative fact.

Keep raw downloads, searches, unapproved JSON and investigation notes outside the repository. Present the concrete proposed changes with official links, dates, coverage and unresolved points. Do not duplicate approved content in a review document. Retain only the minimal provenance required by the contract; do not create a separate political research tree.

After acceptance, update only `content/editorial/provincial-presence.json`, evidenced programme aliases or displayed catalogue fields as applicable. Preserve stable IDs and approved content. Run `npm run content:generate` and `npm run content:check`; the provincial validator verifies structure and references, not political truth. Compare saved facts and the public projection with the accepted batch.

Follow existing publication authorisation and the Git workflow without routine reconfirmation. Route programme incorporation to `document-program` and programme corrections to `triage-suggestion`. Report changes, coverage, checks and material limits.
