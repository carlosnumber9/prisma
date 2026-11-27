# Research efficiency protocol

This protocol applies to the native [research team](research-factory.md). It reduces unnecessary context and repeated work without relaxing electoral evidence, independent QA or editorial approval. It adds an offline handoff/cache/metrics helper, not an orchestrator or a model API. There is no automatic scheduler or claimed savings percentage.

Efficiency must preserve the requested editorial scope. Whole-programme incorporation has no implicit number-of-points limit: read all eligible components, account for all actionable measures in the eight areas and pass the coverage inventory to independent QA. Source-discovery budgets and chunk sizes control operations and context, not the quantity of programme content retained. Reuse a live in-memory PDF reader across page chunks to avoid downloading the same original repeatedly; check that tool output was not truncated before counting a page as inspected.

## Models and rollout

| Responsibility   | Model        | Reasoning |
| ---------------- | ------------ | --------- |
| Parent / Builder | `gpt-6-luna` | `medium`  |
| Discovery        | `gpt-6-luna` | `medium`  |
| Research         | `gpt-6-luna` | `high`    |
| Synthesis        | `gpt-6-luna` | `medium`  |
| QA               | `gpt-6-luna` | `high`    |

Parent defaults live in [.codex/config.toml](../.codex/config.toml). They apply to new project sessions, including other chats in this repository, unless explicitly overridden in the session. They do not change global personal settings or retrospectively prove the model of an existing session. Child profiles pin both model and reasoning. Tools, permissions, connections and the three-thread cap remain unchanged. Native role descriptions must confirm availability before reporting that a profile's settings ran. The new [Discovery profile](../.codex/agents/prisma-discovery.toml) may not be available in the current session.

Discovery is limited to locating eligible official sources and checking authority, election identity, chronology, corrections and availability. It does not synthesise proposals, approve content or spawn children. At the maintainer's explicit request to use simpler models, coordination and synthesis now default to Luna/medium and independent QA to Luna/high. Research retains Luna/high. Stronger-model escalation remains restricted to a concrete unresolved item under the escalation rules below. These defaults apply to future sessions or newly loaded profiles, not already completed work. Standard speed is desired, but these profiles contain no supported speed control and do not establish that Standard is configured or enforced. There is no automatic weekly or token hard cap.

The model split is a reliability/cost hypothesis, not a measured improvement. Official configuration supports [per-agent model and reasoning settings](https://learn.chatgpt.com/docs/agent-configuration/subagents). Simpler models do not necessarily use fewer tokens. The maintainer authorised the cheaper defaults before a comparative benchmark; source fidelity, complete six-language review and independent QA remain required. Measure quality and available usage on the same frozen task before claiming savings or broadening escalation.

## Bounded handoffs

Builder creates one JSON task per bounded scope outside the repository, then validates it with:

```sh
node scripts/research-efficiency.mjs packet <task.json>
```

The input contains exactly `taskId`, `agent`, `formationId`, `scope`, `question`, `evidencePaths`, `sourceHashes` and `resultPath`; optional `maxSearchQueries` and `maxSourceOpens` override the defaults of eight queries and twelve original opens. Allowed roles are `prisma-discovery`, `prisma-research`, `prisma-synthesis` and `prisma-qa`. The five-formation discovery pilot must explicitly override the defaults with three queries and four original source opens per formation. Builder tracks aggregate Discovery limits of fifteen queries and twenty opens; the helper validates each packet but does not aggregate or enforce runtime budgets. QA receives a separately bounded packet, and its independent source checks do not consume the Discovery allowance. The fixed election is 29 November 2026. Paths identify evidence and reports; they must not contain document bodies, mail or conversation transcripts. The question and scope are bounded strings, with at most twelve evidence paths per packet. Split a large corpus by area or source group instead of injecting every file into every agent.

Explicit query/open budgets may be zero for offline synthesis or validation handoffs; negative, fractional and greater-than-fifty values fail validation. Zero records the instruction to perform no web work, not tool-level enforcement.

For explicitly authorised direct repository authoring, validate an in-memory object with the exported `prepareTask` helper and pass the bounded handoff inline rather than creating packet or report files. Raw originals may be inspected and hashed in memory without retaining a complete capture. Return findings and counters in messages; unavailable telemetry remains unavailable. Save only content covered by the maintainer's acceptance after independent QA, following the [direct authoring boundary](research-factory.md#synthesis-outputs-and-app-consumption). Query and open limits remain unchanged.

Example input, using deliberately synthetic benchmark evidence:

```json
{
  "taskId": "fixture-housing-1",
  "agent": "prisma-synthesis",
  "formationId": "fixture-party",
  "scope": "Synthetic housing benchmark",
  "question": "Preserve the conditions in the supplied synthetic proposal.",
  "evidencePaths": ["/tmp/factory-fixture/source/metadata.json"],
  "sourceHashes": [],
  "resultPath": "/tmp/factory-fixture/result"
}
```

Actual source-backed work supplies at most 24 verified SHA-256 values of both originals and extractions in `sourceHashes`; split larger evidence sets. The helper emits a workload fingerprint from fixed scope, question and source hashes, excluding the model, output location and task ID. For a comparative benchmark, freeze the full evidence corpus, cutoff and question; do not compare a live web search with a historical snapshot or let changed evidence masquerade as the same workload. An empty source set is acceptable for discovery but cannot prove equivalent live-search conditions.

Spawn each task with `fork_turns="none"`, the named `agent_type` and a short message containing the validated packet and procedure path. Do not fork the whole conversation or resume a long unrelated child history. Mandatory repository and skill instructions still apply; context reduction must not disable those rules. Agents open only the relevant source segments and locators needed for their work; QA must still consult originals independently. Return a concise result, artifact paths and unresolved issue IDs rather than pasted source text. A configured packet is not runtime enforcement: Builder tracks actual budgets and stops or splits over-budget tasks, recording incomplete coverage.

Keep only two levels: Builder coordinates workers directly; workers never coordinate grandchildren. Run at most two Discovery workers concurrently and reserve the third agent slot for independent QA. If the current session has not discovered `prisma-discovery`, spawn `agent_type="default"`, `fork_turns="none"`, `model="gpt-6-luna"` and `reasoning_effort="medium"`. Explicitly require the worker to read the Discovery profile's `developer_instructions` as policy, including its mandatory repository/skill reads and external evidence boundaries. Record this as a default-agent fallback, not execution of the native role. Record requested settings separately from observed model telemetry; unavailable actual telemetry remains unavailable. Report unsupported requested settings instead of silently substituting them.

## Reuse evidence and work

Maintain a local run directory outside Git with per-task subdirectories, an immutable source store and a source index. Reuse complete programme originals in that external cache by hash. Repository citation excerpts are not full snapshots and cannot satisfy original-byte checks. Each entry in the cache-check index is the relative path of an existing `metadata.json` under the assigned source root. External cache metadata supplies `id`, `sha256`, `extractionSha256` and `originalFile`; the sibling `extracted.json` identifies `sourceId` and `sourceSha256`. These temporary cache fields do not extend the programme or provincial content contracts.

```sh
node scripts/research-efficiency.mjs snapshots <metadata-paths.json> <source-root>
```

The helper checks regular files, root confinement, original bytes, extraction bytes and source/extraction identity. Changed or tampered bytes fail; symlinks and escaping paths fail. It does not fetch URLs, establish official authority, validate the provincial presence contract or prove semantic fidelity. It deliberately returns `currentStatusVerified: false` even when bytes are reusable.

For current claims, the assigned Discovery or Research worker checks the official publication/updates once per source per run and records actual `checkedAt`, the requested cutoff, URL, status and source hash in the run ledger. QA still independently checks originals. Frozen bytes can support historical claims; they do not prove present Congress presence or the continued absence of a programme. Reuse a prior negative search only within the same run/cutoff; a new date requires a new official availability check. A changed document creates a new immutable snapshot. Builder assigns one owner for shared source capture so parallel territorial tasks do not download or extract the same national original repeatedly.

Resume by source hash, scope and unresolved issue ID. Reuse prior extraction and unchanged draft work only after checking dependency hashes and recorded QA/approval state; new evidence invalidates affected conclusions and drafts. Do not regenerate translations for unchanged accepted text, overwrite review history or treat previous agreement as approval of substantive changes. Checksums are evidence identities, not cached political truth.

## Deterministic checks and escalation

Use the existing programme generator for retained-excerpt hashes, exact quotation occurrence, references, identifiers, field allowlists and public projection. It does not rehash complete originals; use the external snapshot cache helper for that purpose. It never calls a model. Use the offline snapshot check before reusing a source. These commands do not substitute for independent semantic QA. Use the separate provincial generator for the [Congress presence contract](provincial-data.md); snapshot byte checks do not validate that contract. Keep unresolved extraction/OCR verification pending. Senate research is outside scope.

Each issue receives at most two initial attempts, including the first attempt. Record attempts and the reason before retrying. Escalate early for conflicting official evidence, uncertain identity, difficult extraction, ambiguous proposal scope or failed semantic/translation QA. Builder permits at most one additional targeted stronger-model attempt per issue, passing only the packet, relevant evidence and exact failure. Network failures require an accessible official alternative or a permitted read-only capture; a stronger model is not a network permission workaround. Persistent gaps remain pending.

Research's pinned Luna profile cannot be upgraded by overriding its model at spawn time when the profile takes precedence. For an approved escalation, Builder spawns `agent_type="default"`, `fork_turns="none"`, `model="gpt-6.1-sol"`, `reasoning_effort="high"`, and explicitly instructs the agent to read Research's `developer_instructions` as policy, without treating its pinned Luna fields as settings. Record that fallback and its actual model separately. Do not silently rerun an entire national investigation, loop between QA and Research indefinitely or create grandchildren. Existing Synthesis/QA failures return only the affected item; their pinned profiles remain authoritative. Unavailable models are reported rather than silently substituted.

## Measure consumption and quality

Each task owns one metrics record outside the repository; Builder collects completed records into an array. Record `taskId`, the packet's `workloadSha256`, actual `model`, actual `reasoningEffort`, `usageSource`, and all counters below. Use `null` for unavailable measurements, including unreported token usage. Never estimate tokens from word counts, document size, account-wide usage windows or the configured model alone. If model telemetry is unavailable, use the explicit string `unavailable` and keep it outside model comparisons.

Counters are `inputTokens`, `outputTokens`, `cachedInputTokens`, `reasoningOutputTokens`, `searchQueries`, `sourceOpens`, `cacheHits`, `attempts` and `qualityErrors`. Query/open/attempt/cache counters come from the task ledger; `qualityErrors` comes from independent QA and remains null until reviewed. Token values require an identifiable runtime usage event/export in `usageSource`. Cached input is already included in input tokens, and reasoning output is already included in output tokens; do not add either subset a second time. The native collaboration interface may expose no per-agent token totals. In that case retain nulls and report that token savings cannot yet be quantified.

```sh
node scripts/research-efficiency.mjs metrics <metrics-array.json>
```

The read-only helper groups identical workload fingerprints by actual model and reasoning. It reports measured sums, missing counts and complete totals only where every record has a value. It never inserts a zero for unknown usage, looks up prices, changes files or infers savings. Compare completeness, fidelity errors, unresolved items and retries alongside tokens on the same frozen sample. A cheaper or shorter run that misses evidence is not an improvement. Keep results local unless an anonymised technical comparison is deliberately approved for Git.

## Verification

Run `node --test tests/research-efficiency.test.mjs` for allowed-role boundaries, task limits, changed-evidence fingerprints, cache tampering/path confinement and missing/double-counted usage. Existing content tests remain the source of truth for programme generation. No production political record or app contract is changed by this protocol. These offline tests demonstrate mechanics, not actual model savings or political research quality.
