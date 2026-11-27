# Deterministic application of accepted batches

Status: accepted on 27 November 2026.

Model workers prepare programme drafts and changed translations outside Git; independent QA checks originals, whole-programme coverage, all six languages and exact proposed byte hashes. After actual maintainer acceptance or scoped delegated acceptance, Builder uses a deterministic writer with baseline checks and the existing generators instead of another model recopying final JSON. This keeps the editorial contract and stable references while trading a general agent's write flexibility for explicit manifests, external staging and bounded recovery. Manifest approval fields record authorization; they cannot create it. Free model promotions affect task availability, never justify a paid fallback or a weaker editorial review.
