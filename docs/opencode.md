# OpenCode programme acquisition

The repository supplies a desktop research workflow with OpenAI subscription coordination/QA, temporary free DeepSeek draft workers and deterministic accepted-content application. These tools run during authoring, never during portal builds or visits. No programme has been added by configuring this workflow.

## One-time desktop setup

1. Install or update OpenCode Desktop to a release supporting the current V2 configuration schema (`agents`, `permissions`, `policies` and `providers`). Open this repository folder and start a new session; existing sessions retain their selected model.
2. Connect OpenAI using **Sign in with ChatGPT**, not an OpenAI API key. Select `openai/gpt-6.1-sol` and the `prisma-builder` agent. The subscription's existing limits apply; no separate OpenAI API credit is provided by this repository.
3. Make `opencode/deepseek-v4.1-flash-free` available in the model selector. Connect the OpenCode Console provider if requested. Select the exact **Free** entry, not the similarly named paid model or OpenCode Go. Do not add paid API credentials, credits or auto-recharge to make this workflow run. If the free entry is unavailable, stop that work.
4. Run `npm run research:config` through Builder, then inspect active session authentication and model availability. This offline command checks maintained configuration, not account state. Confirm that OpenAI uses ChatGPT, the `prisma.model-budget` plugin is active and no paid OpenCode models are available for selection. Do not begin acquisition if the app ignores or rejects the configuration.

Node 24.x and npm 10.8.2 are the existing repository prerequisites; install locked dependencies with `npm ci` if needed. PDF extraction also needs a local reader/OCR tool. Builder must detect available tooling before assigning PDF work; it must report missing/failed extraction and cannot count unread pages as reviewed. The repository does not install a desktop app, authenticate accounts, provide OCR or bypass network limits.

As checked on 27 November 2026, [OpenCode lists DeepSeek V4.1 Flash Free](https://opencode.ai/docs/console/models/#free-models) as a limited-time offer. Free access is not a permanent quota, unlimited service or a guarantee that an account can use it. [ChatGPT authentication](https://opencode.ai/docs/providers/#chatgpt) consumes the subscribed plan. Actual savings and multilingual quality have not been benchmarked.

## Configuration and cost boundaries

[opencode.jsonc](../opencode.jsonc) uses the current [OpenCode schema](https://opencode.ai/config.json). Provider policies allow only `openai` and `opencode`. The local [model-budget plugin](../scripts/opencode-budget/index.js) uses the documented V2 model transform to remove every candidate except Sol and the exact DeepSeek Free model; it also removes Free when its catalog input/output/cache prices are missing or nonzero. A model-resolution hook rejects explicit substitutions, including auxiliary calls. Catalog refreshes replay the filter. No price is rewritten to zero.

OpenCode V2 explicitly ignores legacy provider `whitelist`/`blacklist`; this workflow does not use them. The plugin needs to load successfully in the Desktop server. Inspect plugin status before starting; offline checks do not prove host execution. Other plugins, managed settings and provider billing changes remain outside a universal monetary firewall. See [V2 plugin model transforms](https://opencode.ai/docs/build/plugins/server/#models) and [migration limits](https://opencode.ai/docs/migrate-v1/#accepted-but-unsupported-fields).

OpenAI's account must use subscription OAuth; the model ID alone does not distinguish OAuth from paid API authentication. Do not connect a paid OpenAI API key for this workflow. Workers and the hidden title/summary/compaction roles pin the exact free model. Warming, schedules, sharing and paid search are disabled. Unavailability, quota failures or a reported nonzero price stop the affected task; do not automatically substitute models. Do not map paid models to a zero price in local metadata. The configuration never establishes a hard token cap or a future provider price guarantee.

Native web search is disabled because it has separate provider credentials/billing. Discovery uses webfetch on official sites and public search result pages (for example a normal public search URL with the formation, programme and election terms), then verifies original official documents. Such pages may block automated reads; that is an explicit unresolved search limitation. There is no paid search fallback. If the maintainer later opts into a search service, verify its free tier and billing separately before changing the configuration.

## Roles and shared instructions

| Role                  | Model                                                  | Ownership                                                                |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `prisma-builder`      | `openai/gpt-6.1-sol`, medium                           | Coordinate, run deterministic tools, accept authorised batches, publish  |
| `prisma-discovery`    | `opencode/deepseek-v4.1-flash-free`, thinking disabled | Find official sources; return links and evidence                         |
| `prisma-research`     | `openai/gpt-6.1-sol#high`                              | Resolve one specific issue when needed                                   |
| `prisma-synthesis`    | DeepSeek Free                                          | Draft cited Castilian points in assigned external staging                |
| `prisma-translation`  | DeepSeek Free                                          | Prepare only changed ca/gl/eu/oc/en versions in external staging         |
| `prisma-qa`           | `openai/gpt-6.1-sol#high`                              | Independently inspect originals, coverage, six languages and final bytes |
| Accepted-batch writer | No model                                               | Validate and apply exact accepted bytes                                  |

Profiles live in [.opencode/agents](../.opencode/agents). [Shared worker policy](research-worker-policy.md) is injected once through OpenCode's `instructions` and referenced by the native Codex profiles. Existing `.agents/skills` are automatically discovered by OpenCode; do not duplicate their content into new skills. Native Codex roles retain their Luna settings and their existing staging/direct-authoring rules; OpenCode does not load those TOML files.

Only Builder launches children. Worker shell access is denied; Synthesis and Translation can edit only external `/private/tmp` or `/tmp` drafts. QA is read-only. Builder performs source download, hashing, extraction and deterministic validation on request, and applies accepted files with the writer. Tool permissions are not an OS sandbox. Limit simultaneous draft/discovery workers to two and total active workers to three by coordinator tracking; step limits and maximum depth do not implement a global concurrency scheduler.

## Target inventory and acquisition

Run:

```sh
npm run research:config
npm run research:targets
```

The inventory rebuilds programme and provincial projections in memory from editorial inputs. It includes catalogue parties with no cited programme (`missingProgrammes`), unique provincial formations without a reviewed programme association (`unlinkedFormations`) and existing programmes with pending/partial areas (`incompleteProgrammes`). An unlinked formation is not proof of source absence. Use its full displayed name and official identity evidence to group aliases; do not merge coalitions merely because names resemble one another. Existing programme expansion is a separate scope, not an automatic consequence of searching for missing programmes.

For each authorised target:

1. Freeze scope/cutoff and create a run directory outside Git. Assign an external per-task directory and validate a bounded packet with `node scripts/research-efficiency.mjs packet <task.json>`. The five-formation pilot's stricter limits apply only to an explicitly requested pilot; default task limits are eight queries, twelve source opens, two attempts and one targeted escalation per issue. Split a discovered whole programme into source/page batches before reaching those limits; never truncate editorial coverage to satisfy an operational budget.
2. Discovery verifies official authority and 2026 election/adoption evidence. Builder owns one original download/extraction per version; cache originals and full extraction outside Git by original/extraction hash and check them with the existing snapshot helper. Reopen publication/update evidence for the current cutoff. Extractions must retain page/section boundaries and output truncation must be resolved.
3. Synthesis reads every assigned source section, accounts for every actionable measure across all eight areas and drafts Castilian with exact citations. Stabilize each point before translating only new/changed wording. Keep manifest files, drafts and coverage inventories external. Use the programme contract; no implicit point cap and no invented empty areas.
4. Independent QA reopens originals and checks every source page/measure, proposal condition, locator and all six versions. Return failures only for affected items; bounded retry/escalation prevents full-corpus loops. QA checks the exact final file hashes, including any approval state assigned under the maintainer's delegation. Edits after QA invalidate its digest.
5. Builder accepts only within explicit maintainer authorization or delegated acceptance. Apply the exact accepted batch using the command below. Keep only accepted data and minimal citation evidence in Git, then update relevant catalogue/current-state/roadmap docs. Follow the Git workflow if publication was authorised.

Only unresolved targets need final status summaries; do not retain raw search reports in the repository. An unattended request is not a background scheduler: work continues only while the active session can execute. Stop and report exhausted quotas, blocked sources, unread pages or uncertain translations rather than claiming completion.

## Accepted-batch writer

`npm run content:batch -- <command> <manifest>` uses an external JSON manifest with exactly:

- `schemaVersion: 1`, `electionDate: "2026-11-29"`, `batchId` (a lowercase slug).
- `acceptance`: `{ "authority": "maintainer" | "delegated", "reference": "Actual instruction or approval reference" }`.
- `qa`: `{ "agent": "prisma-qa", "result": "passed", "reviewedFilesSha256": "Digest returned by the digest command and independently checked by QA" }`.
- `files`: an array of `{ "path": "Repository-relative allowed JSON path", "expectedSha256": "Current byte hash, or null for a new file", "sha256": "Proposed UTF-8 byte hash", "content": "Exact final JSON file bytes as a string" }`.

Builder assembles the manifest from staged files with `JSON.stringify`; never ask another model to reproduce all the JSON. `digest` validates file selection, JSON and hashes without requiring completed acceptance/QA fields (use null while preparing them). Give QA the digest and staged files, then fill acceptance and the passing QA record from actual review/authorization, not invented timestamps or consent. Approval and QA fields are declarations, not cryptographic proof that independent review occurred.

```sh
npm run content:batch -- digest /private/tmp/prisma-run/batch.json
npm run content:batch -- check /private/tmp/prisma-run/batch.json
npm run content:batch -- apply /private/tmp/prisma-run/batch.json --sha256 <manifestSha256>
```

After filling acceptance/QA, run `digest` again to obtain the complete manifest's byte hash for `apply`. Both `check` and `apply` require the QA files digest to match. The file-list digest binds sorted paths, expected baseline hashes and proposed byte hashes; changing content requires a new QA review. The CLI never generates prose, translations or approval.

Allowed inputs are programme syntheses, `parties.json`, `programme-identities.json` and minimal source `metadata.json`/`extracted.json`. Deletion, arbitrary paths, symlink traversal, changed baseline hashes, removed catalogue/point IDs and changed existing syntheses without the next revision are rejected. The writer clones content and required fonts into temporary external staging, runs credential-signature screening and both existing generators, then checks the entire baseline again. It applies exact inputs plus generated envelopes using per-file atomic rename. It does not write province presence facts, docs, fonts or application code.

A temporary lock excludes other instances of this writer. Exceptions trigger best-effort rollback while preserving detected concurrent edits; there is no cross-file filesystem transaction or protection from every arbitrary external editor. Process termination can leave a partial batch or stale lock. Inspect Git status, reconcile from the external accepted manifest, regenerate/check all output and remove a stale lock only after confirming no writer is active. Temporary staging contains approved baseline content and is removed on normal exit.

Before publication run `npm run check`, relevant deterministic tests unless explicitly waived, and `git diff --check`. No app build is required for tooling-only changes. A successful push does not prove CI or deployment.
