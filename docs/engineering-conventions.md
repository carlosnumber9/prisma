# Engineering conventions

## Implementation and scope

Inspect the existing implementation and Git status before editing. Make small changes within the request, preserve unrelated work and avoid speculative infrastructure or unrelated refactors. Use the [domain glossary](../CONTEXT.md), [content contract](content-contract.md) and accepted [decisions](decisions.md) consistently.

Use English for code, comments, test descriptions and technical documentation. Preserve Spanish citizen-facing labels and source text in its original language. Explain intent when a comment prevents a likely misunderstanding; do not narrate obvious code. Follow the user's current conversation style rather than applying compressed prose to persisted files.

Keep the generator deterministic and offline. Do not regenerate prose, consult a model or rewrite approved editorial inputs during a build. Public output uses explicit field allowlists. Original snapshots remain immutable by source version; review evidence and personal data must not leak into public JSON. Never copy the entire content tree into a public web directory.

Use checked JavaScript for existing Node tooling and strict TypeScript for new application code when Next is introduced. Validate untrusted inputs at their boundary; static checks do not replace content validation or human editorial agreement. Add dependencies only for a concrete capability. Lock development tools exactly in `package-lock.json`; the generator itself has no runtime dependencies.

## Atomic implementation plans

Before implementing a delivery, present a numbered list of intended commits in logical dependency order. For each commit, state its proposed message, purpose, scope and verification. Use the message convention and publication authorisation in [Git workflow](git-workflow.md); planning commits does not authorise creating or pushing them.

Each commit must be coherent and independently verifiable, without relying on a later commit to repair a failure. Include the tests, documentation and generated files belonging to its change in the same commit. Separate independent changes and keep unrelated refactoring out of the delivery. If the scope changes, update the sequence and explain why before continuing.

## Toolchain and checks

Use Node.js 24.x (`.nvmrc`) and npm 10.8.2 (`packageManager`). Use `npm ci` for locked installation when dependencies are needed. Do not change a developer's global npm settings or registry as an incidental fix; an explicit per-command public registry override can be used for public dependencies.

| Command                    | Purpose                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run typecheck`        | Check Node tooling and the strict Next application; generate route types without starting a server. |
| `npm run lint`             | Check tooling, tests and application code with ESLint and the Next presets.                         |
| `npm run format:check`     | Check maintained files with Prettier; exclude source snapshots, generated output and reports.       |
| `npm run docs:check`       | Validate local documentation links and skill metadata.                                              |
| `npm run content:generate` | Validate inputs and generate approved public JSON.                                                  |
| `npm run content:check`    | Validate and compare generated JSON without writing.                                                |
| `npm run check`            | Run static checks and content validation, without tests or a build.                                 |
| `npm run test`             | Run deterministic Node tests.                                                                       |
| `npm run test:app`         | Run application content and presentation tests without a server.                                    |
| `npm run test:coverage`    | Run tests and write diagnostic generator coverage to `coverage/lcov.info`.                          |
| `npm run build`            | Check generated JSON, compile Next and verify prerendered HTML, SEO and routes without a server.    |

Use targeted tests while iterating, then relevant static checks and tests before publication. Add tests that reduce risk or clarify behaviour; do not write application tests that merely repeat documentation. Mock network, database and provider boundaries. Fixtures must remain synthetic and outside the real content corpus. Coverage has no global percentage threshold.

Format only intended files with explicit paths, not the whole working tree. Do not run `npm run dev`, `npm run start` or any app server unless the user explicitly requests a local run or browser testing. `npm run build` is a separate non-server check, required for portal changes before publication. Report skipped browser or build checks where relevant. Do not run migrations, linked database checks, production-provider calls or real synchronisation incidentally.

For documentation changes, verify formatting, local links, paths, commands and consistency with source. A command listed as available must exist in `package.json`; future commands must be labelled as future work.

## Quality CI

`.github/workflows/quality.yml` runs on pull requests and pushes to `master`, on Ubuntu with Node.js 24 and npm 10.8.2. It installs locked dependencies, runs `npm run check`, generator coverage, application tests and `npm run build`, grants read-only contents permissions, cancels older runs for the same Git ref and has a 10-minute timeout. It attempts to upload `coverage/` even after a preceding failure, ignores missing files and retains the artifact for 14 days. It does not start an app server or apply migrations.

A workflow definition is executable evidence of configured triggers, not proof of a successful remote run. Do not enable deployment settings or assume Vercel Deployment Checks are active merely because this file exists.

## Secrets and future integrations

Never commit credentials, tokens, private keys, private environment files, sensitive generated reports or model assets. Use ignored local environment files and examples without real secret values. Preserve ignore rules for dependencies, build output, coverage, logs and temporary database files; ignoring a file does not make its contents safe.

There is no database, provider synchronisation, model service or deployment configuration in this delivery. If Supabase is introduced, schema changes belong in migrations, deployment remains manual until explicitly authorised, and remote migration state must be verified before application. Do not use production credentials in tests or edit remote schema outside the documented migration workflow.

## Documentation and completion

Update feature documentation, current-state descriptions and [roadmap](roadmap.md) when behaviour or limits change. Record durable trade-offs in accepted ADRs and preserve superseded decisions with a link to their replacement. Keep the glossary free of implementation detail.

Treat source, package scripts, workflow definitions and migrations as evidence. Report discrepancies rather than presenting intended behaviour as implemented. Finish with a concise summary of changes, checks, commit/push result and material limitations, including remaining local edits.
