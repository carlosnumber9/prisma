# Electoral research team

The primary Codex chat acts as Builder. Two project agents, [Research](../.codex/agents/prisma-research.toml) and [QA](../.codex/agents/prisma-qa.toml), reuse the existing editorial skills. There is no model API, scheduler or custom orchestration service. The project [configuration](../.codex/config.toml) caps spawned threads at three; the host may impose a lower limit. Models, tools, connections and permissions inherit from the parent session. Instructions limiting writes do not create isolated sandboxes.

## Run a scoped investigation

Ask Codex to act as Builder and explicitly delegate to Research and independent QA. Specify formation, election, chambers, territories and the date being checked. Start a trusted session with web research available. New project configuration may require a new session. When the host does not expose named custom-agent selection, the Builder must read the two agent files and pass their instructions to real subagents; report this fallback rather than claiming the named configuration was loaded.

1. Read repository instructions, inspect current edits and assign a temporary run directory outside the repository. Record the actual UTC capture time separately from the requested electoral cutoff. Future material relative to that cutoff cannot establish historical availability.
2. Verify the election call and enumerate the actual chamber/constituency universe from official sources. Resolve coalitions separately from their constituent parties. Never infer the election from the programme generator's configured date.
3. Delegate source discovery to Research. Search national electoral publications first, then territorial official announcements. Discover shared programmes once and inventory genuine territorial supplements separately. Partition independent territorial tasks only after fixing the scope and avoid simultaneous edits to shared files.
4. Maintain a run ledger: task, chamber/territory, queries, official URLs opened, source capture, proposed record IDs, evidence, status, unresolved issues and next action. Distinguish unsearched, inaccessible, not located, announced, submitted and proclaimed information. A query returning no result does not establish non-participation.
5. Preserve original source bytes, full hashes, metadata and localisable extraction under the applicable contract. A rendered web result or search snippet alone is not an immutable source snapshot. Do not retain private identifiers. Keep candidate JSON and temporary reports outside the repository; publish only reusable configuration and deliberate, anonymised evidence/review records.
6. Give QA the scope, originals, extraction, ledger and candidate output. QA independently opens the relevant official sources and checks corrections, identity, chronology, meaning and technical integrity. Return failures to Research through Builder. Limit each unresolved item to two targeted correction attempts per run; then record the precise missing evidence and leave it pending.
7. Present exact verified subsets, coverage and unresolved issues. The maintainer accepts concrete political content separately from technical configuration. Never mark records approved merely to demonstrate JSON generation. Preserve existing approved content throughout review.

## Two output contracts

Use [document-program](../.agents/skills/document-program/SKILL.md) and the [programme contract](content-contract.md) for eligible official programmes. Draft points remain private; publication requires the agreed six-language batch. Use the existing deterministic generator with `--root <temporary-directory>` for isolated rehearsals; do not edit generated files directly. A valid draft omitted from public output is an expected result.

Use [document-political-info](../.agents/skills/document-political-info/SKILL.md) and its [separate contract](../.agents/skills/document-political-info/references/data-contract.md) for formations, people and candidatures. Pre-approval JSON remains outside the repository. There is no dedicated reference-data validator or portal consumer yet: parse checks and programme `content:check` must not be described as reference-data validation. Do not invent an approval timestamp or change the approved envelope to represent discovery status. When no evidence supports a valid record, return a discovery ledger rather than an empty approved dataset.

Technical validation does not prove extraction fidelity, factual truth, complete research or human approval. A separate future delivery may add a deterministic reference validator and explicit portal integration without changing these contracts silently.

## Verification and publication

Validate TOML syntax, required agent fields, documentation links and formatting. Check that the installed client accepts project configuration; distinguish this from observed custom-agent discovery and actual delegation. Record which mechanism ran. Read [Git workflow](git-workflow.md) before every commit/push and stage only the authorised technical batch. Do not publish unrelated working-tree changes.

Current official configuration reference: [OpenAI subagents documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents). The initial pilot uses inherited models to measure reliability before introducing model-specific cost optimisation. No automatic recurring research is configured.

## Initial PP pilot

The first run investigates PP across Spain for the next general election, both chambers, national programme and territorial supplements. It uses real Research and QA subagents with instructions supplied by Builder in this existing chat; named TOML selection is not demonstrated by this run. The initial host provides four active-agent slots including Builder. Availability and source coverage are reported separately from configuration readiness. No political batch is approved by configuring the team.
