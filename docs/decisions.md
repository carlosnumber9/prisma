# Architectural decisions

Accepted decisions explain durable trade-offs. They are not a substitute for the roadmap or permission to implement future features.

| Decision                                                                                                    | Status   | Rationale                                                                    |
| ----------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| [0001: Reviewed editorial content before delivery](adr/0001-reviewed-content-before-delivery.md)            | Accepted | Separate human review from runtime delivery and deterministic generation.    |
| [0002: Preserved sources and stable public references](adr/0002-preserved-sources-and-stable-references.md) | Accepted | Keep evidence auditable when URLs change and correction links survive edits. |

Add an ADR only when a real trade-off is durable and surprising without context. Number new files sequentially. When superseding a decision, retain its original text/history, label its status and link its replacement. Routine library choices belong in engineering documentation, not automatically in ADRs.

Publication defaults are maintained in `git-workflow.md`, not duplicated as architectural records. The maintainer's English unscoped commit convention supersedes the initial scoped prefixes, Node 24/npm 10.8.2 supersede Node 20, and `master` supersedes the earlier `main` default. The Next portal now implements the approved-content delivery boundary; its routine library choices are recorded in [portal implementation](portal.md). Comparator, chat and hosting remain roadmap work. The original ADR wording is retained as historical context.
