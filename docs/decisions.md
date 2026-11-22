# Architectural decisions

Accepted decisions explain durable trade-offs. They are not a substitute for the roadmap or permission to implement future features.

| Decision                                                                                                    | Status                 | Rationale                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| [0001: Reviewed editorial content before delivery](adr/0001-reviewed-content-before-delivery.md)            | Accepted               | Separate human review from runtime delivery and deterministic generation.    |
| [0002: Preserved sources and stable public references](adr/0002-preserved-sources-and-stable-references.md) | Superseded by ADR 0005 | Stable public references remain; full local snapshot retention was replaced. |
| [0003: One reviewed multilingual editorial batch](adr/0003-multilingual-editorial-batches.md)               | Accepted               | Publish six translations with shared identifiers, evidence and approval.     |

[0004: Portal-scoped content](adr/0004-portal-scoped-content.md) narrows collection to the current citizen views and excludes individual political records and research archives.

[0005: Minimal citation evidence](adr/0005-minimal-citation-evidence.md) replaces full source snapshots and removes undisplayed public quotations while preserving editorial references.

Add an ADR only when a real trade-off is durable and surprising without context. Number new files sequentially. When superseding a decision, retain its original text/history, label its status and link its replacement. Routine library choices belong in engineering documentation, not automatically in ADRs.

Publication defaults are maintained in `git-workflow.md`, not duplicated as architectural records. The maintainer's English unscoped commit convention supersedes the initial scoped prefixes, Node 24/npm 10.8.2 supersede Node 20, and `master` supersedes the earlier `main` default. The Next portal now implements the approved-content delivery boundary; its routine library choices are recorded in [portal implementation](portal.md). Comparator, chat and hosting remain roadmap work. The original ADR wording is retained as historical context.
