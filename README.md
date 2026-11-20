# Prisma

Prisma will help Spanish citizens read reviewed summaries of official programmes for the general election on 29 November 2026, by electoral formation and policy area.

The editorial foundation and statically prerendered Next.js portal are implemented. The public catalogue lists five formations with documented programmes. The approved batches give PP 24 proposals, PSOE 32, VOX 44, Frente Amplio 59 and Podemos 24, with eight partial summaries each. The correction form, comparator, chat and Vercel integration remain future deliveries.

Breadcrumbs now retain their common route prefix. New pieces slide out from behind the preceding piece over 160 milliseconds; removed pieces slide back before disappearing. Sibling navigation replaces only the differing suffix. Reduced motion, resizing and font changes settle immediately.

Source disclosures now expand their measured height over 140 milliseconds, then fade their contents in over 80 milliseconds. Closing reverses that sequence; reduced motion keeps native disclosure changes immediate.

Proposal source disclosures now show only source links and their page or section locations, without literal quotations.

Proposal titles now include an icon that copies their localized URL and stable anchor. It appears on hover or keyboard focus, stays visible on touch devices and confirms successful copying with an animated tick for two seconds. Clipboard errors expose a selectable URL for manual copying.

Route content now fades out over 100 milliseconds and in over 120 milliseconds during same-locale client navigation. A persistent layout retains the navbar, halftone background and breadcrumb. Native Web Animations is preferred, with GSAP as the compatibility fallback; reduced motion skips the transitions. Chromium and WebKit desktop/mobile interaction checks pass; physical-device and real clipboard permission checks remain pending.

All portal shells now share a halftone background. Travelling waves grow and shrink points on a fixed grid, so entire dotted regions appear, spread and disappear across the page. Dot colour and opacity retain the original muted grey-blue treatment. A viewport-sized Canvas 2D layer draws the moving field; the original local SVG remains the initial frame and the fallback for reduced motion or unavailable rendering. Browser verification remains pending. See [background tuning](docs/portal.md#shared-halftone-background).

The homepage now reveals its browsing ribbons at the same time as the opening prism shrinks after a prism click or downward scroll. The prism scales to 68% and gains a one-pixel blur over 850 milliseconds while the descriptive subtitle fades out. The enhanced home fits the dynamic viewport without document scrolling; navigation scales to fit the available height. Once both the prism transition and ribbon drawing finish, the footer slides vertically into the bottom of the screen over 450 milliseconds. Keyboard, reduced-motion and static fallback paths are retained. Local browser verification remains pending because the integrated browser host was unavailable and native Chrome access was not approved.

Home navigation uses compact folded ribbons attached to the viewport edges. A short shaded segment starts above the horizontal ribbon at each screen edge and slopes down to its fold, without a coloured crease or highlight, before continuing as the existing horizontal trapezoid; the right column mirrors the fold, and mobile padding keeps labels clear of it. Area labels align right and party labels align left towards their ribbons’ free inner ends, retaining 24 pixels of padding. Below 1024 pixels wide, areas are followed by one “Lista de partidos” button; wider screens replace it with a mirrored party list on the right. GSAP draws each home ribbon along its folded path: the raised lateral segment appears first, then the horizontal face and its label are revealed together, staggered in catalogue order. The horizontal reveal preserves its original fast curve until the final eight visible pixels, where a brief smooth brake softens the finish without changing the total duration. Text and background still move towards the centre on hover, with reduced-motion support. A local visual trial keeps home ribbon fills unchanged on pointer hover while retaining their stronger shadow and keyboard-focus treatment. A shared `NavigationLink` component gives area and party directories the same trapezoid, shadow, colour and focus treatment while keeping their existing containers and columns. Browser verification remains pending. See [portal implementation](docs/portal.md).

Breadcrumbs now use closely spaced parallelogram pieces with parallel slanted edges, upright labels and a section-accent current page. They retain localized navigation, keyboard focus and responsive wrapping, verified in Chromium and WebKit desktop/mobile layouts. See [portal presentation](docs/portal.md#presentation-and-seo).

A neutral translucent layer with gentle background blur softens the halftone field behind the navbar. The navbar now outlines the selected section with a transparent 1-pixel parallelogram, sliding between sections during desktop client navigation. At widths up to 768 pixels, a right-aligned burger button opens a full-width vertical panel with the existing section links and language selector. Its borderless lower edge forms a centred shallow oval with softly feathered edges; opening combines a fast downward slide and an eased fade, and closing reverses both; reduced motion disables these transitions. Escape restores button focus; navigation, outside presses and leaving the menu also close it. Home has no selection outline, and reduced motion switches immediately. Browser verification remains pending.

The homepage now has a local vgpu visual prototype: a glass prism splits white light into four slowly moving coloured beams, with browsing directories revealed around it after interaction. It preserves the light background and title, supports reduced motion, and provides a static fallback. Browser integration remains to be verified; Git publication does not establish deployment status. See [prototype details](docs/portal.md#local-prism-prototype).

The portal no longer displays editorial review status, revision numbers or review dates. Neutral availability messages and source links remain; editorial records and indexing rules retain their existing states.

The portal supports Castilian, Catalan/Valencian, Galician, Basque, Aranese and English through 336 prerendered catalogue pages. A custom navbar selector remembers manual choice for one year. It shows only the selected language, with a transparent background, a soft grey underline and a single chevron that rotates 180 degrees over 100 milliseconds when opening and reverses when closing; its six options unfold in a fast staggered card animation, completing in 100 milliseconds, and GSAP reverses the same timeline when closing. Locale URLs are authoritative; neutral entries negotiate saved choice, browser preferences and Castilian fallback before rendering. All political points require six reviewed versions together. See [internationalization](docs/portal.md#internationalization). Language review of the proposed interface translations and browser verification remain pending; no server was started for this delivery.

The language-picker visual trial shapes its options as progressively wider trapezoids. Their diagonal sides follow two shared lines across the existing vertical gaps, while labels remain upright. Responsive shape calculation and keyboard borders are implemented; browser visual review remains pending. Labels are centred, and the trigger fits the longest language name plus its chevron. Options size to their labels and trapezoid clearance, constrained by available width. Options share the trigger’s horizontal centre; the desktop navbar reserves extra space on its right for the wider dropdown. Mobile centres both controls and caps the option list at its desktop intrinsic width or the available parent width, whichever is smaller. The mobile menu background eases to the content height over 200 milliseconds when options expand or finish reversing, while content keeps its natural scrollable layout.

Party pages now place a full-width formation-coloured banner after the breadcrumb, with optional official typography and a compact official-website badge. The shared rally photograph is supplied at `public/images/party-rally.webp` and rendered at full opacity in black and white before applying a separate formation tint that preserves photo luminosity. Missing colours use light grey, and missing fonts use Mako. Empty areas are disabled without pending-summary captions. The political documentation skill now requests official colour and typeface evidence. Desktop and mobile checks against the existing local server verify photograph visibility; cross-browser verification remains pending. See [party banners](docs/portal.md#party-banners).

The homepage now selects Congress candidatures by province using the BOE-backed 52-constituency inventory. It requests browser location on first home, party-directory or area-page entry, resolves coordinates locally with IGN boundaries and falls back to Madrid when location is denied, unavailable or outside the covered provinces. A searchable navbar selector supports manual changes; a manual choice survives locale reloads for the current tab. The home, party directory and each policy-area page list the same provincial formations and react to navbar province changes. Links open existing reviewed programmes; area links require approved proposals in that specific area. No candidate names or new routes are exposed. See [province selection](docs/portal.md#province-selection-and-home-candidatures).

## Working in this repository

The portal pins Next.js and its ESLint configuration to 16.4.6 for the security update from 16.4.0. Its `experimental.agentUpgrade` policy is `security`; see [portal implementation](docs/portal.md).

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

`check` runs tooling/application type checking, lint, formatting, documentation checks, generated-content validation and bounded credential screening of source captures. It does not run tests or an application build. `build` validates existing generated JSON, compiles Next and checks the prerendered portal HTML without starting a server. Development tools are locked; the content generator uses only Node standard libraries at runtime.

`npm run dev` and `npm run start` are available for explicitly requested local runs; they are not incidental verification. Optional `SITE_URL` configures canonical URLs and the sitemap after a production domain is selected; see [.env.example](.env.example). See [portal implementation](docs/portal.md) for architecture, tests and the logical commit sequence.

## Electoral research team

The native Codex [research team](docs/research-factory.md) coordinates scoped official-source discovery, cited editorial JSON synthesis and independent QA using the existing editorial contracts. Candidate data stays outside the repository until reviewed; the provincial Congress presence dataset now has a scoped validator and a minimal homepage consumer. Other political-reference datasets remain research-only.

The [11 November PP editorial review](content/reviews/2026-11-11-pp-programme-draft.md) records the preserved national programme and 24 approved proposals in all six languages. Comparison with the second official PDF remains pending.

The [15 November PSOE editorial review](content/reviews/2026-11-15-psoe-programme-draft.md) records the preserved 114-page national programme and the 32 approved proposals in all six languages. The [14 November discovery review](content/reviews/2026-11-14-psoe-programme-discovery.md) preserves the earlier source search. Territorial supplements and a byte comparison with the official attachment remain pending.

The VOX national programme contains 115 numbered measures. The preserved PDF matches the official download byte for byte. The maintainer approved 44 proposals in six languages across all eight Prisma areas. [17 November VOX editorial review](content/reviews/2026-11-17-vox-programme-draft.md)

The [30 October PSOE list investigation](content/political-info/reviews/2026-10-30-psoe-lists-discovery.md) examines 52 Congress and 60 Senate candidatures, preserving 1,014 published candidate appearances and territorial announcement history. PSOE/PSC participation is established for 111 lists; the Ceuta Senate coalition's link to PSOE remains pending, including its six candidate appearances. These are submitted candidatures, not proclaimed lists or approved portal data. Senate substitute relationships remain in research evidence because the current public reference contract cannot represent them.

The election is permanently the Spanish general election of 29 November 2026. The [30 October PP candidature investigation](content/political-info/reviews/2026-10-30-pp-candidature-discovery.md) preserved 21 official source snapshots and independently audited 109 related submitted lists with 992 candidate entries. Full research previews remain outside the repository; no reference batch is approved. Coalition identities, personal identity reconciliation, Senate substitute associations and later proclamation remain explicit review boundaries.

## Editorial skills

- [`document-program`](.agents/skills/document-program/SKILL.md): preserve an official 2026 source, extract it, debate summaries and publish an agreed editorial batch. Example: `Use $document-program to incorporate this official 2026 programme: [URL]`.
- [`triage-suggestion`](.agents/skills/triage-suggestion/SKILL.md): review a user-supplied suggestion and agree on a correction, a tracking issue or a reasoned dismissal. Example: `Use $triage-suggestion to review this suggestion: [anonymised text]`.
- [`document-political-info`](.agents/skills/document-political-info/SKILL.md): verify supplied political reference material online or research official sources directly, then save an explicitly accepted JSON batch covering formations, politicians and constituency candidatures. Example: `Use $document-political-info to research the official candidatures of [formation] for the general election of 29 November 2026, [chamber], in [constituencies]`.

The programme and triage skills share the [editorial policy](docs/editorial-policy.md), [content contract](docs/content-contract.md) and [Git publication workflow](docs/git-workflow.md). Political reference research follows the same provenance and agreement principles with its own [data contract](.agents/skills/document-political-info/references/data-contract.md): evidence and reviews are separate from accepted files in `content/political-info/approved`. Political-reference sources and candidature reviews are preserved; the approved provincial Congress dataset is validated separately and projected for the homepage. This does not provide a general political-reference validator or public candidate directory. These skills do not read mail automatically or generate text during page loads.

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
