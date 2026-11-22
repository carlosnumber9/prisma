# Scoped editorial research

The main Codex chat coordinates [Discovery](../.codex/agents/prisma-discovery.toml), [Research](../.codex/agents/prisma-research.toml), [Synthesis](../.codex/agents/prisma-synthesis.toml) and [QA](../.codex/agents/prisma-qa.toml) when a requested task calls for delegation. These are authoring tools, not a runtime model service or a scheduler. Follow the [efficiency protocol](research-efficiency.md) for bounded tasks and measured usage; configuration alone proves neither execution nor accuracy.

## Scope

The fixed election is 29 November 2026. Collect official programme proposals for the current policy areas, displayed formation identity/branding and proclaimed Congress presence by province. Do not investigate politicians, biographies, offices, individual affiliations, candidate names/order, substitutes or Senate lists. Broad background research without a concrete portal consumer stays outside the repository.

## Workflow

1. Inspect the approved baseline and assign temporary working paths outside Git. Freeze the requested formation, source version, area and cutoff. Reuse relevant evidence instead of downloading a national source for every province.
2. Discovery locates and checks official sources within explicit search/open budgets. Research handles targeted provenance, identity, chronology, availability, correction or extraction questions that need deeper investigation. Missing evidence remains a precise unresolved item. Keep raw captures, searches and ledgers outside Git.
3. Synthesis prepares a cited programme draft under the [programme contract](content-contract.md). New prose needs all six reviewed language versions before approval; existing approved content remains intact during debate. Formation/presence work follows its [separate scoped contract](../.agents/skills/document-political-info/references/data-contract.md), without programme drafting.
4. QA independently checks originals, proposal meaning, conditions, translations and locators, then runs deterministic validation. Valid JSON and hashes do not prove fidelity, human agreement or comprehensive coverage.
5. Present the exact changed content and evidence. Save only the accepted portal data and necessary supporting evidence; do not commit full task reports, candidate previews, repeated translations or historical execution narratives. Follow the [Git workflow](git-workflow.md) for authorised publication.

Use two levels only: the main chat is the sole coordinator, and workers do not spawn children. Run at most two Discovery workers concurrently, reserving the third agent slot for independent QA. Give each task a bounded packet, its own external directory and `fork_turns="none"`; use concise findings and paths for handoffs. Discovery uses Luna/medium, Research remains Luna/high, Synthesis remains Sol/medium and QA remains Sol/high. Discovery never drafts syntheses or grants approval.

For the five-formation discovery pilot, assign at most three queries and four original source opens per formation, with aggregate Discovery limits of fifteen queries and twenty opens. Independent QA receives a separate explicit budget and independently reopens official sources. The coordinator tracks both budgets and leaves gaps unresolved when limits are reached. This procedure does not implement a scheduler, automatic weekly/token cap or runtime search enforcement. Standard speed is desired, but no supported speed setting is configured or enforced here. If the current session has not discovered the new native role, use the explicit default-agent fallback in the efficiency protocol and report it honestly.

## Synthesis outputs and app consumption

Editorial syntheses use `content/editorial/syntheses/<party>/<topic>.json`; only approved points enter the four programme envelopes. Province presence has a separate small projection. Builds and visits never generate prose, translate content or perform research. No-source research cannot withdraw published proposals or manufacture an empty approved dataset.

Programme/suggestion reviews use external temporary records while agreement is pending. Retain only approved wording, cited excerpts and minimal source metadata in Git; raw originals and complete extractions stay external. Keep durable product constraints in current documentation and surprising trade-offs in ADRs, rather than appending run histories here.

An explicit maintainer request may instead authorise direct repository authoring and delegated acceptance for a bounded batch. In that mode, keep task handoffs and findings in memory, inspect and hash original bytes in memory, and create no temporary staging directories or research archives. Independent source and six-language QA still precede publication. Builder applies the authorised approval state and writes only accepted catalogue data, syntheses and minimal cited evidence to the repository; uncertain sources remain unresolved. Delegated acceptance is scoped to the maintainer's request, not a permanent default for future batches.
