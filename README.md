# Prisma

Prisma will help Spanish citizens read reviewed summaries of official programmes for the general election on 29 November 2026, by electoral formation and policy area.

The editorial foundation and statically prerendered Next.js portal are implemented. The initial limited catalogue contains PP, PSOE, VOX, ERC and Frente Amplio, with eight policy areas and 40 pending summaries. No programme points have been incorporated; test fixtures are never published as political content. The correction form, comparator, chat and Vercel integration remain future deliveries.

All portal shells now share a static halftone background: three broad folds vary the size of muted grey-blue dots, leaving the centre quieter for reading. A locally generated SVG overlays the homepage prism and its fallback, below content, without browser JavaScript or animation. Browser verification remains pending. See [background tuning](docs/portal.md#shared-halftone-background).

Home navigation uses compact trapezoid links attached to the viewport edges. Below 1024 pixels wide, areas are followed by one “Lista de partidos” button; wider screens replace it with a mirrored party list on the right. GSAP reveals each home list from its outer edge and moves text and background towards the centre on hover, with reduced-motion support. A shared `NavigationLink` component gives area and party directories the same trapezoid, shadow, colour and focus treatment while keeping their existing containers and columns. Browser verification remains pending. See [portal implementation](docs/portal.md).

Breadcrumbs now use closely spaced parallelogram pieces with parallel slanted edges, upright labels and a section-accent current page. They retain localized navigation, keyboard focus and responsive wrapping. Browser verification remains pending. See [portal presentation](docs/portal.md#presentation-and-seo).

The navbar now outlines the selected section with a transparent 1-pixel parallelogram, sliding between sections during client navigation. Home has no selection outline, and reduced motion switches immediately. Browser verification remains pending.

The homepage now has a local vgpu visual prototype: a glass prism splits white light into four slowly moving coloured beams, with the existing browsing directories below. It preserves the light background and title, supports reduced motion, and provides a static fallback. Browser integration remains to be verified; Git publication does not establish deployment status. See [prototype details](docs/portal.md#local-prism-prototype).

The portal supports Castilian, Catalan/Valencian, Galician, Basque, Aranese and English through 336 prerendered catalogue pages. A native navbar selector remembers manual choice for one year. Locale URLs are authoritative; neutral entries negotiate saved choice, browser preferences and Castilian fallback before rendering. All political points require six reviewed versions together; the real corpus still has no incorporated points. See [internationalization](docs/portal.md#internationalization). Language review of the proposed interface translations and browser verification remain pending; no server was started for this delivery.

## Working in this repository

The shared footer credits Carlos Pinedo Sánchez and links to the GitHub repository with a locally bundled official SVG. Browser verification remains pending.

The portal uses Mako throughout, bundled locally with its SIL Open Font License and loaded through `next/font/local`. Browser verification of this typography trial remains pending. See [portal typography](docs/portal.md#presentation-and-seo).

Read [AGENTS.md](AGENTS.md) for agent instructions, [the glossary](CONTEXT.md) for domain terms, and the relevant documents below. The primary working and publication branch is `master`.

Use Node.js 24.x and npm 10.8.2:

```sh
npm ci
npm run check
npm run test
npm run test:coverage
npm run build
```

`check` runs tooling/application type checking, lint, formatting, documentation checks and generated-content validation. It does not run tests or an application build. `build` validates existing generated JSON, compiles Next and checks the prerendered portal HTML without starting a server. Development tools are locked; the content generator uses only Node standard libraries at runtime.

`npm run dev` and `npm run start` are available for explicitly requested local runs; they are not incidental verification. Optional `SITE_URL` configures canonical URLs and the sitemap after a production domain is selected; see [.env.example](.env.example). See [portal implementation](docs/portal.md) for architecture, tests and the logical commit sequence.

## Editorial skills

- [`document-program`](.agents/skills/document-program/SKILL.md): preserve an official 2026 source, extract it, debate summaries and publish an agreed editorial batch. Example: `Use $document-program to incorporate this official 2026 programme: [URL]`.
- [`triage-suggestion`](.agents/skills/triage-suggestion/SKILL.md): review a user-supplied suggestion and agree on a correction, a tracking issue or a reasoned dismissal. Example: `Use $triage-suggestion to review this suggestion: [anonymised text]`.

Both skills share the [editorial policy](docs/editorial-policy.md), [content contract](docs/content-contract.md) and [Git publication workflow](docs/git-workflow.md). They do not read mail automatically or generate text during page loads.

```sh
npm run content:generate
npm run content:check
```

Editable content lives in `content/editorial`, snapshots and extractions in `content/sources`, and review records in `content/reviews`. Only the four schema-v3 JSON files in `content/generated` are imported by Next. Routes include `/[locale]/parties/[party]/[topic]` and `/[locale]/topics/[topic]`. New approved editorial batches require regeneration and a new build; page loads never generate prose.

## Documentation

- [Engineering conventions](docs/engineering-conventions.md): implementation, verification, CI and security boundaries.
- [Git workflow](docs/git-workflow.md): scope, SSH publication to `master`, commit messages and issue exceptions.
- [Versioning](docs/versioning.md): package versions, schema versions, source hashes and editorial revisions.
- [Decisions](docs/decisions.md): accepted architectural decisions and superseded history.
- [Roadmap](docs/roadmap.md): implemented foundation and future deliveries discussed with the maintainer.
- [Editorial validation](docs/editorial-validation.md): generator tests and synthetic triage rehearsal.

The local `Quality` workflow definition checks pushes to `master` and pull requests, including application tests and a build. Passing local checks or pushing a commit does not confirm a remote CI run, browser behaviour or deployment. Repository and deployment settings must be verified separately.
