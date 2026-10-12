# Prisma

Prisma will help Spanish citizens read reviewed summaries of official programmes for the general election on 29 November 2026, by electoral formation and policy area.

The editorial foundation is implemented. The initial limited catalogue contains PP, PSOE, VOX, ERC and Frente Amplio, with eight policy areas and 40 pending summaries. No programme points have been incorporated; test fixtures are never published as political content. The Next.js portal, correction form, comparator, chat and Vercel integration remain future deliveries.

## Working in this repository

Read [AGENTS.md](AGENTS.md) for agent instructions, [the glossary](CONTEXT.md) for domain terms, and the relevant documents below. The primary working and publication branch is `master`.

Use Node.js 24.x and npm 10.8.2:

```sh
npm ci
npm run check
npm run test
npm run test:coverage
```

`check` runs type checking, lint, formatting, documentation checks and generated-content validation. It does not run tests or an application build. There is no app server or build command yet. Development tools are locked; the content generator uses only Node standard libraries at runtime.

## Editorial skills

- [`document-program`](.agents/skills/document-program/SKILL.md): preserve an official 2026 source, extract it, debate summaries and publish an agreed editorial batch. Example: `Use $document-program to incorporate this official 2026 programme: [URL]`.
- [`triage-suggestion`](.agents/skills/triage-suggestion/SKILL.md): review a user-supplied suggestion and agree on a correction, a tracking issue or a reasoned dismissal. Example: `Use $triage-suggestion to review this suggestion: [anonymised text]`.

Both skills share the [editorial policy](docs/editorial-policy.md), [content contract](docs/content-contract.md) and [Git publication workflow](docs/git-workflow.md). They do not read mail automatically or generate text during page loads.

```sh
npm run content:generate
npm run content:check
```

Editable content lives in `content/editorial`, snapshots and extractions in `content/sources`, and review records in `content/reviews`. Only the four JSON files in `content/generated` are intended for Next. Planned routes include `/parties/[party]/[topic]` and `/topics/[topic]`.

## Documentation

- [Engineering conventions](docs/engineering-conventions.md): implementation, verification, CI and security boundaries.
- [Git workflow](docs/git-workflow.md): scope, SSH publication to `master`, commit messages and issue exceptions.
- [Versioning](docs/versioning.md): package versions, schema versions, source hashes and editorial revisions.
- [Decisions](docs/decisions.md): accepted architectural decisions and superseded history.
- [Roadmap](docs/roadmap.md): implemented foundation and future deliveries discussed with the maintainer.
- [Editorial validation](docs/editorial-validation.md): generator tests and synthetic triage rehearsal.

The local `Quality` workflow definition checks pushes to `master` and pull requests. Passing local checks or pushing a commit does not confirm a remote CI run, browser behaviour or deployment. Repository and deployment settings must be verified separately.
