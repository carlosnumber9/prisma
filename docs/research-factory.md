# Electoral research team

The primary Codex chat acts as Builder. Three project agents, [Research](../.codex/agents/prisma-research.toml), [Synthesis](../.codex/agents/prisma-synthesis.toml) and [QA](../.codex/agents/prisma-qa.toml), reuse the existing editorial skills. There is no model API, scheduler or custom orchestration service. The project [configuration](../.codex/config.toml) caps spawned threads at three; the host may impose a lower limit. Models and reasoning are pinned by role; tools, connections and permissions inherit from the parent session. Instructions limiting writes do not create isolated sandboxes.

## Consumption controls

Follow the [research efficiency protocol](research-efficiency.md) for every factory run: Builder uses the project Sol/medium default, Research uses Luna/high, Synthesis uses Sol/medium and QA uses Sol/high. Spawn fresh children without the parent conversation, pass bounded source references, verify reusable evidence offline, record current-source checks and escalate only the failed issue. Local task/cache/metrics tools avoid model work for deterministic checks. Per-task usage remains unknown when native telemetry is unavailable; no savings percentage is assumed. These parent defaults also apply to other new chats in this project unless explicitly overridden.

## Run a scoped investigation

The standing election is the Spanish general election of 29 November 2026. Do not request election selection again or open an investigation into another electoral process. Lists and candidatures cover Congress and Senate nationwide unless the maintainer narrows the chamber or territory. Verify each source against that fixed election and the actual consultation cutoff; configuration alone does not establish source eligibility or candidature status.

Ask Codex to act as Builder and explicitly delegate source discovery to Research, programme editorial JSON drafting to Synthesis when applicable, and independent review to QA. Specify formation, any narrower chamber/territory scope and the date being checked; the election is fixed above. A candidature-only investigation uses Research and QA with the political-reference contract, without programme synthesis or four-file programme generation. Start a trusted session with web research available. New project configuration may require a new session. When the host does not expose named custom-agent selection, the Builder must read the relevant agent files and pass their instructions to real subagents; report this fallback rather than claiming the named configuration was loaded.

1. Read repository instructions, inspect current edits and assign a temporary run directory outside the repository. Record the actual UTC capture time separately from the requested electoral cutoff. Future material relative to that cutoff cannot establish historical availability.
2. Verify the election call and enumerate the actual chamber/constituency universe from official sources. Resolve coalitions separately from their constituent parties. Never infer the election from the programme generator's configured date.
3. Delegate source discovery to Research. Search national electoral publications first, then territorial official announcements. Discover shared programmes once and inventory genuine territorial supplements separately. Partition independent territorial tasks only after fixing the scope and avoid simultaneous edits to shared files.
4. Maintain a run ledger: task, chamber/territory, queries, official URLs opened, source capture, proposed record IDs, evidence, status, unresolved issues and next action. Distinguish unsearched, inaccessible, not located, announced, submitted and proclaimed information. A query returning no result does not establish non-participation.
5. Preserve original source bytes, full hashes, metadata and localisable extraction under the applicable contract. A rendered web result or search snippet alone is not an immutable source snapshot. Do not retain private identifiers. Keep candidate JSON and temporary reports outside the repository; publish only reusable configuration and deliberate, anonymised evidence/review records.
6. Give Synthesis the verified scope, eligible preserved sources/extractions, catalogues and approved editorial baseline. It prepares cited draft JSON in the existing editorial layout and runs the existing generator against the isolated root. Then give QA the scope, originals, extraction, ledger, editorial drafts and all four generated files. QA independently opens the relevant official sources and checks corrections, identity, chronology, meaning and technical integrity. Return source failures to Research and synthesis, translation or JSON failures to Synthesis through Builder. Limit each unresolved item to two targeted correction attempts per run; then record the precise missing evidence and leave it pending.
7. Present exact verified subsets, coverage and unresolved issues. The maintainer accepts concrete political content separately from technical configuration. Never mark records approved merely to demonstrate JSON generation. Preserve existing approved content throughout review.

## Synthesis outputs and app consumption

`prisma-synthesis` owns programme synthesis and JSON preparation, rather than leaving this step implicit in Builder. Research discovers and preserves evidence; Synthesis selects and structures the proposals; QA independently checks fidelity and validation. The three subagents fit the existing concurrent-thread cap, but dependent phases run in order. No extra orchestrator, runtime model call or parallel JSON builder is needed.

Synthesis receives the formation/election scope, source eligibility and preserved originals, source metadata/extraction, current catalogues and any approved editorial baseline. It returns:

- `content/editorial/syntheses/<partyId>/<topicId>.json` with cited new points marked `draft`, stable identifiers and review state under the existing contract.
- `content/generated/parties.json`, `topics.json`, `sources.json` and `syntheses.json` produced by the deterministic generator in the assigned isolated root.
- A review report covering evidence, missing coverage, translation uncertainties, generator/check results and exact approval gates.

The app consumes only the four generated schema-v3 files. Draft proposals remain in editorial JSON and are intentionally absent from that public projection. After the maintainer accepts the exact six-language batch, Builder applies the agreed editorial changes and regenerates the app files; Synthesis never approves its own work. Do not fabricate `approved` status to make a draft visible or edit generated output manually.

Without an eligible source, Synthesis can produce eight empty pending records for a new PP corpus and generate the app's existing unavailable state. This is valid app JSON, not a programme summary. Existing approved content must survive missing evidence unchanged. Do not add discovery fields, fabricated proposals or completed-review claims to these records. Political-reference/candidature conversion remains a separate contract and future portal integration.

## Two output contracts

Use [document-program](../.agents/skills/document-program/SKILL.md) and the [programme contract](content-contract.md) for eligible official programmes. Draft points remain private; publication requires the agreed six-language batch. Use the existing deterministic generator with `--root <temporary-directory>` for isolated rehearsals; do not edit generated files directly. A valid draft omitted from public output is an expected result.

Use [document-political-info](../.agents/skills/document-political-info/SKILL.md) and its [separate contract](../.agents/skills/document-political-info/references/data-contract.md) for formations, people and candidatures. Pre-approval JSON remains outside the repository. There is no dedicated reference-data validator or portal consumer yet: parse checks and programme `content:check` must not be described as reference-data validation. Do not invent an approval timestamp or change the approved envelope to represent discovery status. When no evidence supports a valid record, return a discovery ledger rather than an empty approved dataset.

Technical validation does not prove extraction fidelity, factual truth, complete research or human approval. A separate future delivery may add a deterministic reference validator and explicit portal integration without changing these contracts silently.

## Verification and publication

Validate TOML syntax, required agent fields, documentation links and formatting. Check that the installed client accepts project configuration; distinguish this from observed custom-agent discovery and actual delegation. Record which mechanism ran. Read [Git workflow](git-workflow.md) before every commit/push and stage only the authorised technical batch. Do not publish unrelated working-tree changes.

Current official configuration reference: [OpenAI subagents documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents). The initial pilot uses inherited models to measure reliability before introducing model-specific cost optimisation. No automatic recurring research is configured.

## Initial PP pilot

The first run investigates PP across Spain for the next general election, both chambers, national programme and territorial supplements. It uses real Research and QA subagents with instructions supplied by Builder in this existing chat; named TOML selection is not demonstrated by this run. The initial host provides four active-agent slots including Builder. Availability and source coverage are reported separately from configuration readiness. No political batch is approved by configuring the team.

## Named-profile programme run — 23 October 2026

The [PP programme discovery review](../content/reviews/2026-10-23-pp-programme-discovery.md) records a successful direct invocation of `prisma-research` and `prisma-qa` through native named-agent selection. Research succeeded after one capacity-related retry. Four originals and two PDF extractions were preserved and independently checked; no eligible programme or annex was located in the bounded scope. No synthesis was invented or published. This confirms named-profile execution for this host, while the initial pilot above retains its historical fallback description.

## Synthesis rehearsal — 23 October 2026

The newly added Synthesis profile was executed by a real subagent reading its complete instructions after this existing session rejected `prisma-synthesis` as an unknown named type. The new file is configured, but native named-profile selection for this role remains to be checked in a session that discovers it. This is separate from the previously verified Research/QA named selection.

With the actual PP discovery corpus, Synthesis produced eight pending editorial records and the four generated app files in an isolated root. There are no eligible programme sources or proposal drafts; the generated availability state matches the current app data. Independent QA checked the output through the actual app reader. This does not demonstrate preservation against a nonempty approved baseline, because this corpus has none.

A separate synthetic rehearsal used a fictitious formation and clearly labelled HTML evidence, outside the repository and real political corpus. Synthesis preserved a conditional, limited proposal in a cited Castilian draft. Generation and check succeeded, retaining the draft privately and producing zero public points. No real PP proposal, translation approval or public content was invented. The synthetic rehearsal is a structural and drafting check, not evidence of political accuracy or multilingual completeness.

## PSOE candidature investigation — 30 October 2026

Builder invoked two native `prisma-research` agents for national electoral publications and territorial formation announcements, followed by independent `prisma-qa` review. The [political reference review](../content/political-info/reviews/2026-10-30-psoe-lists-discovery.md) records the source corpus, chronology, exact inventory, validation and unresolved publication gates. The programme Synthesis profile was not used because candidatures follow the separate political reference contract.

The expanded national inventory examines 112 submitted candidatures and 1,014 candidate appearances, covering 52 Congress and 60 Senate constituencies. PSOE/PSC participation is established for 111 lists; the Ceuta Senate coalition's link to PSOE remains pending, with six appearances retained as unresolved attribution evidence. Official sources establish separate Ibiza and Formentera constituencies for this election; historical constituency totals were not reused. PSOE, PSC and Senate coalitions retain their published identities. Full substitute relationships are preserved in research observations outside the repository; these observations are not an alternative public contract. The existing reference contract cannot express which Senate titular a substitute replaces, so complete Senate conversion remains pending an agreed contract change. No political dataset, programme output or portal content was approved or published.

## Nationwide PP candidature run — 30 October 2026

The [candidate-list review](../content/political-info/reviews/2026-10-30-pp-candidature-discovery.md) records direct native Research and QA execution against the fixed 29 November election. The submitted-candidature publication was enumerated across 52 Congress and 60 Senate constituencies. Research extracted 109 related lists and 992 entries; QA independently compared every row against HTML/XML originals, checked 2,093 citations and audited 21 preserved source snapshots. PDF layout review was sampled and is reported separately from complete machine extraction.

The result distinguishes 106 PP lists, two UPN–PP lists and one Sa Unió list. The three Senate omissions are supported by the published inventory and a separate official party announcement. Identity reconciliation and later corrections/proclamation remain pending. Senate evidence retains each regular candidate's own substitutes outside the repository because the existing approved contract cannot preserve that relationship. No contract extension, approved-envelope JSON, programme synthesis, app projection or Git publication was performed. Programme Synthesis was outside this reference-only run; technical checks do not approve political facts.

## PP programme discovery — 11 November 2026

Builder delegated Research, Synthesis and independent QA to real subagents using the project profiles' instructions and model settings as the fallback for this session's unavailable named selector. The [review](../content/reviews/2026-11-11-pp-programme-discovery.md) records the programme announcement, two PDF links, the territorial search and the original-byte capture blocker. Synthesis validated the existing projection in an isolated root and prepared a research map for the eight areas. Initial drafting was blocked while the originals were unavailable.

The maintainer subsequently supplied the first official PDF. The resumed Synthesis and QA roles used the same fallback and worked from the preserved snapshot. The [editorial review](../content/reviews/2026-11-11-pp-programme-draft.md) records the extraction, numbered coverage, the approved multilingual batch and publication scope. The second official PDF remains pending comparison.
