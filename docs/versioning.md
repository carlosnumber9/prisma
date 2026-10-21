# Versioning

Prisma tracks several independent kinds of version. Do not substitute one for another.

| Version              | Meaning                                           | Change policy                                                                                                                       |
| -------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Git commit           | Exact repository state                            | New coherent commits; never rewrite shared `master` history.                                                                        |
| Package version      | Development-tooling milestone                     | Private package starts at `0.1.0`; change only for an agreed delivery/release, not every content edit.                              |
| `schemaVersion`      | Public JSON contract                              | Current version is 3. Breaking wire changes require a new schema version, updated consumers and an explicit compatibility decision. |
| Source version       | Preserved original snapshot                       | Source ID includes the first 12 SHA-256 characters; retain the full hash and create another snapshot when bytes change.             |
| Synthesis `revision` | Public editorial version for a formation and area | Increment when published text, order, references or review state changes; keep synthesis and point IDs stable.                      |

The separate [political reference contract](../.agents/skills/document-political-info/references/data-contract.md) starts at `schemaVersion: 1`, independently of programme schema 3. Its accepted dataset has its own positive `revision`, incremented for changes to public facts, references, coverage or review. This does not change the package version or integrate those records into the app.

Use semantic package versioning. Before 1.0, incompatible tooling changes increment the minor version; compatible fixes increment the patch. After 1.0, incompatible changes increment major, capabilities minor and fixes patch. A private package version is not evidence of an npm publication or a GitHub release.

Creating a commit or pushing does not authorise a release, tag, npm publication or changelog automation. Do not run `npm version` or push tags unless the user explicitly requests the corresponding release action. Record delivery state in the roadmap and maintain historical decisions instead of creating an unsolicited release process.

Changing localized labels does not change IDs. A public translation correction increments the shared synthesis revision and requires multilingual consistency review. Routes and correction links depend on stable identifiers. Source capture time describes consultation; `reviewedAt` describes editorial review. Neither should be rewritten merely because the generator ran. Improvements to an extraction of the same original update its hash and review record without breaking referenced segment IDs.

The earlier Node 20 baseline and scoped commit prefixes were superseded by the maintainer's Node 24/npm 10.8.2 and unscoped English simple-past convention. The previous `main` publication default was superseded by the explicit instruction to use `master`.
