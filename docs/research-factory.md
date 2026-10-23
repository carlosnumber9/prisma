# Electoral research team

The primary Codex chat acts as Builder. Three project agents, [Research](../.codex/agents/prisma-research.toml), [Synthesis](../.codex/agents/prisma-synthesis.toml) and [QA](../.codex/agents/prisma-qa.toml), reuse the existing editorial skills. There is no model API, scheduler or custom orchestration service. The project [configuration](../.codex/config.toml) caps spawned threads at three; the host may impose a lower limit. Models, tools, connections and permissions inherit from the parent session. Instructions limiting writes do not create isolated sandboxes.

## Run a scoped investigation

Ask Codex to act as Builder and explicitly delegate source discovery to Research, editorial JSON drafting to Synthesis, and independent review to QA. Specify formation, election, chambers, territories and the date being checked. Start a trusted session with web research available. New project configuration may require a new session. When the host does not expose named custom-agent selection, the Builder must read the relevant agent files and pass their instructions to real subagents; report this fallback rather than claiming the named configuration was loaded.

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
