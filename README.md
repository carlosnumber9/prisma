# Prisma

Prisma will help Spanish citizens read reviewed summaries of official programmes for the general election on 29 November 2026, by electoral formation and policy area.

The editorial foundation and statically prerendered Next.js portal are implemented. The initial limited catalogue contains PP, PSOE, VOX, ERC and Frente Amplio, with eight policy areas and 40 pending summaries. No programme points have been incorporated; test fixtures are never published as political content. The correction form, comparator, chat and Vercel integration remain future deliveries.

All portal shells now share a halftone background. Travelling waves grow and shrink points on a fixed grid, so entire dotted regions appear, spread and disappear across the page. Dot colour and opacity retain the original muted grey-blue treatment. A viewport-sized Canvas 2D layer draws the moving field; the original local SVG remains the initial frame and the fallback for reduced motion or unavailable rendering. Browser verification remains pending. See [background tuning](docs/portal.md#shared-halftone-background).

Home navigation uses compact folded ribbons attached to the viewport edges. A short shaded segment starts above the horizontal ribbon at each screen edge and slopes down to its fold, without a coloured crease or highlight, before continuing as the existing horizontal trapezoid; the right column mirrors the fold, and mobile padding keeps labels clear of it. Area labels align right and party labels align left towards their ribbons’ free inner ends, retaining 24 pixels of padding. Below 1024 pixels wide, areas are followed by one “Lista de partidos” button; wider screens replace it with a mirrored party list on the right. GSAP draws each home ribbon along its folded path: the raised lateral segment appears first, then the horizontal face and its label are revealed together, staggered in catalogue order. The horizontal reveal preserves its original fast curve until the final eight visible pixels, where a brief smooth brake softens the finish without changing the total duration. Text and background still move towards the centre on hover, with reduced-motion support. A local visual trial keeps home ribbon fills unchanged on pointer hover while retaining their stronger shadow and keyboard-focus treatment. A shared `NavigationLink` component gives area and party directories the same trapezoid, shadow, colour and focus treatment while keeping their existing containers and columns. Browser verification remains pending. See [portal implementation](docs/portal.md).

Breadcrumbs now use closely spaced parallelogram pieces with parallel slanted edges, upright labels and a section-accent current page. They retain localized navigation, keyboard focus and responsive wrapping. Browser verification remains pending. See [portal presentation](docs/portal.md#presentation-and-seo).

A neutral translucent layer with gentle background blur softens the halftone field behind the navbar. The navbar now outlines the selected section with a transparent 1-pixel parallelogram, sliding between sections during desktop client navigation. At widths up to 768 pixels, a right-aligned burger button opens a full-width vertical panel with the existing section links and language selector. Its borderless lower edge forms a centred shallow oval with softly feathered edges; opening combines a fast downward slide and an eased fade, and closing reverses both; reduced motion disables these transitions. Escape restores button focus; navigation, outside presses and leaving the menu also close it. Home has no selection outline, and reduced motion switches immediately. Browser verification remains pending.

The homepage now has a local vgpu visual prototype: a glass prism splits white light into four slowly moving coloured beams, with the existing browsing directories below. It preserves the light background and title, supports reduced motion, and provides a static fallback. Browser integration remains to be verified; Git publication does not establish deployment status. See [prototype details](docs/portal.md#local-prism-prototype).

The portal supports Castilian, Catalan/Valencian, Galician, Basque, Aranese and English through 336 prerendered catalogue pages. A custom navbar selector remembers manual choice for one year. It shows only the selected language, with a transparent background, a soft grey underline and a single chevron that rotates 180 degrees over 100 milliseconds when opening and reverses when closing; its six options unfold in a fast staggered card animation, completing in 100 milliseconds, and GSAP reverses the same timeline when closing. Locale URLs are authoritative; neutral entries negotiate saved choice, browser preferences and Castilian fallback before rendering. All political points require six reviewed versions together; the real corpus still has no incorporated points. See [internationalization](docs/portal.md#internationalization). Language review of the proposed interface translations and browser verification remain pending; no server was started for this delivery.

The language-picker visual trial shapes its options as progressively wider trapezoids. Their diagonal sides follow two shared lines across the existing vertical gaps, while labels remain upright. Responsive shape calculation and keyboard borders are implemented; browser visual review remains pending. Labels are centred, and the trigger fits the longest language name plus its chevron. Options size to their labels and trapezoid clearance, constrained by available width. Options share the trigger’s horizontal centre; the desktop navbar reserves extra space on its right for the wider dropdown. Mobile centres both controls and caps the option list at its desktop intrinsic width or the available parent width, whichever is smaller. The mobile menu background eases to the content height over 200 milliseconds when options expand or finish reversing, while content keeps its natural scrollable layout.

Party pages now place a full-width formation-coloured banner after the breadcrumb, with optional official typography and a compact official-website badge. The shared rally photograph is supplied at `public/images/party-rally.webp` and rendered at full opacity in black and white before applying a separate formation tint that preserves photo luminosity. Missing colours use light grey, and missing fonts use Mako. Empty areas are disabled without pending-summary captions. The political documentation skill now requests official colour and typeface evidence. Desktop and mobile checks against the existing local server verify photograph visibility; cross-browser verification remains pending. See [party banners](docs/portal.md#party-banners).

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

## Electoral research team

The native Codex [research team](docs/research-factory.md) coordinates scoped official-source discovery and independent QA using the existing editorial contracts. Candidate data stays outside the repository until reviewed; political-reference data still has no dedicated validator or portal consumer.

## Editorial skills

- [`document-program`](.agents/skills/document-program/SKILL.md): preserve an official 2026 source, extract it, debate summaries and publish an agreed editorial batch. Example: `Use $document-program to incorporate this official 2026 programme: [URL]`.
- [`triage-suggestion`](.agents/skills/triage-suggestion/SKILL.md): review a user-supplied suggestion and agree on a correction, a tracking issue or a reasoned dismissal. Example: `Use $triage-suggestion to review this suggestion: [anonymised text]`.
- [`document-political-info`](.agents/skills/document-political-info/SKILL.md): verify supplied political reference material online or research official sources directly, then save an explicitly accepted JSON batch covering formations, politicians and constituency candidatures. Example: `Use $document-political-info to research the official candidatures of [formation] for [election and chamber] in [constituencies]`.

The programme and triage skills share the [editorial policy](docs/editorial-policy.md), [content contract](docs/content-contract.md) and [Git publication workflow](docs/git-workflow.md). Political reference research follows the same provenance and agreement principles with its own [data contract](.agents/skills/document-political-info/references/data-contract.md): evidence and reviews are separate from accepted files in `content/political-info/approved`. No political-reference records, dedicated validator/generator or portal consumer are implemented yet. These skills do not read mail automatically or generate text during page loads.

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
