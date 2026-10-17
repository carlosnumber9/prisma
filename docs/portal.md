# Prisma portal implementation

## Architecture and delivery

The first portal uses Next 16.4.0, React 19.3.0 and App Router, with statically prerendered pages and CSS Modules. It keeps the normal Next output compatible with future Vercel hosting; it is not an HTML export. There is no content API, database, model service, comparator or correction form.

Node 24.x and npm 10.8.2 remain required. TypeScript 7.0.2 supplies `tsc`; the `typescript` npm alias points to the official TypeScript 6 API compatibility package needed by ESLint. [Microsoft documents this coexistence](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/). Application code has a strict configuration separate from checked JavaScript tooling. Dependencies are pinned and installed without forced peer resolution.

The content adapter explicitly imports only the four files under `content/generated`. The reader accepts schema v2, checks envelope consistency and resolves stable IDs. The generator remains the authority for full input validation. Build runs `content:check` first and fails on invalid or stale content without regenerating it. Incorporating approved content later requires an editorial generation and a new build.

## Routes and editorial states

The catalogue initially has five formations and eight areas: 56 pages across `/`, `/parties`, `/parties/[party]`, `/parties/[party]/[topic]`, `/topics` and `/topics/[topic]`. Dynamic routes enumerate the generated catalogue with `generateStaticParams` and disallow unknown IDs. A dedicated 404 provides a return path.

Home provides area browsing. Below 1024 pixels wide, one “Lista de partidos” link to `/parties` follows the areas; wider screens replace it with a mirrored “Por partidos” list on the right. List subtitles are omitted; summary pages retain explicit availability. Area pages list formation links and review states; they do not implement comparison. Formation pages omit the official website link when it is null. The catalogue's limits and [provenance](catalogue-provenance.md) are explicit.

- `pending`: “Resumen todavía no disponible”, without inferring that a formation lacks proposals or has not published a programme.
- `partial`: approved points, citations and the explicit partial-review notice.
- `complete`: reviewed points, revision and review date. An empty complete review says no proposals were identified in the reviewed corpus and retains its reviewed sources.

Points preserve their IDs as shareable anchors. Native disclosure controls expose source quotations without client-side state. PDF references retain physical and optional printed page numbers; HTML references use only actual source anchors. Dates are formatted in Spanish with UTC. Sources link to official URLs; local originals, extraction and review records are never copied into web assets.

## Presentation and SEO

The light interface uses system fonts, semantic navigation, breadcrumbs, a skip link, visible focus, readable contrast and explicit mobile layouts. Party sections apply page-wide CSS variables; colour configuration remains outside the editorial contract. PP and PSOE use evidenced accents, while other or new formations remain neutral. See [colour evidence](catalogue-provenance.md#interface-colour-evidence).

The isolated `HomeNavigation` client component receives only labels and routes for areas and formations from the server page. Below 1024 pixels wide, a single vertical list shows areas followed by the party-index button. From 1024 pixels, two equal layout columns separate areas on the left from formations on the right, hiding the compact party-index button. CSS hides the inactive navigation variant from display and keyboard navigation. Both headings link to their corresponding indexes.

Each list uses an intrinsic width fitting its longest label plus the existing outer gutter and 24 pixels of inner padding. Area trapezoids attach to the left viewport edge; party trapezoids mirror their geometry and attach to the right edge. Their top edges are 10 pixels shorter than their bottom edges, leaving at least 14 pixels of clearance after the longest label. Available column or viewport space limits each list's width, reserving 8 pixels for hover. A 2.75-rem minimum height, 0.3-rem vertical padding and larger labels give text a greater share of each button’s height; wrapped labels can increase the height on narrow screens. Other directories retain their existing presentation.

GSAP and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) reveal each visible column once it reaches 85% of the viewport: its heading fades in over 0.18 seconds, while links slide from fully outside their respective viewport edge over 0.45 seconds each, staggered by 0.07 seconds in catalogue order. Pointer hover moves each whole link, including its label and trapezoid background, 8 pixels towards the centre over 0.16 seconds with GSAP. Backgrounds extend past the outer edge to preserve their viewport attachment. Hover never underlines headings or list links. Background colours transition in both directions over 0.5 seconds with CSS `ease-in-out`, unless reduced motion is requested. Touch input does not trigger the lateral hover motion. Scrolling remains native. [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/) scopes cleanup, live reduced-motion handling and responsive animation setup, reverting old animations and listeners when the breakpoint changes. Reduced motion and server-rendered HTML show the active links immediately; keyboard focus completes its column's reveal so navigation never waits for animation. Browser verification of timing, focus, breakpoint changes and responsive geometry remains pending.

`SITE_URL` is an optional public HTTP(S) origin without credentials, paths, queries or fragments. Empty configuration omits canonical links and produces a sitemap with no URLs; robots does not advertise it. Invalid values fail checks that load the site configuration or the build. Once configured, canonical and sitemap URLs use that origin. Pending synthesis pages remain `noindex, follow` and excluded from the sitemap; partial and complete pages, including complete empty reviews, become indexable automatically. Catalogue pages remain indexable. Sitemap modification dates come from editorial review, never build time.

## Verification and remaining limits

`npm run test` runs generator and application tests. `test:app` runs content, presentation and static reader markup tests; fixtures remain synthetic and outside the political corpus. Node's synchronous module hooks and the existing TypeScript 6 API transpile TSX for markup tests, replacing CSS imports with class names. These tests verify reviewed reader states without pretending to verify styles. Generator coverage is still diagnostic and has no global threshold. `npm run build` additionally inspects the emitted HTML and prerender manifest, covering every generated route, Spanish language, headings, skip links, pending metadata, accents, missing website links, stable point anchors, sitemap and 404 fallback. Quality CI includes these checks.

The artifact reader uses the completed build's `required-server-files.json` configuration, not a hosting environment flag. Normal builds read `.next/server/app`; Next 16.4 adapter builds (including Vercel) read `.next/server/route-cache`, scoped by route kind and the SHA-256 hash of the source module path. The App Router manifest resolves dynamic instances to their original source module; sitemap bodies and the 404 use the same resolver. Checks remain mandatory in both layouts, and missing artifacts fail rather than falling back to stale output. Regression fixtures use the pinned Next cache-key implementation to verify the layout convention.

No app server or browser is started for this delivery. Interactive accessibility, rendered mobile layout and visual quality remain unverified in a browser. Local checks do not prove remote CI or deployment. The initial implementation was reviewed locally before the maintainer authorised its commit and push. No tag or deployment is authorised; the package remains at 0.1.0.

Local verification on 13 October 2026 used Node 24.18.0 and npm 10.8.2: locked `npm ci`, `npm run check`, all 50 tests, generator coverage and `npm run build` passed. The offline HTML check verified all 56 portal pages with no production domain configured. Generator coverage was 99.10% lines, 96.85% branches and 100% functions; these numbers describe this run only.

The adapter-layout fix was verified on 13 October 2026 with the same toolchain: static checks, all 54 tests and two full portal builds passed. The second build set `NEXT_ADAPTER_PATH` to a temporary no-op adapter, exercising Next's actual scoped output and the full checker without deploying. Both builds verified all 56 portal pages, sitemap and 404. This verifies artifact resolution, not Vercel's packaging or a remote deployment.

## Logical implementation units

The delivery follows the ordered reviewable units below. Related tests, generated files and current-state documentation belong to the same commit as their behaviour. Before publication, the original seven-unit plan was reduced to five commits: Next tooling, content queries and the portal belong together because package scripts and CI depend on their combined files. This avoids commits with missing test commands, missing route dependencies or artificial temporary scaffolding. The feature scope is unchanged.

| Order | Proposed message                                                 | Purpose and scope                                                                      | Verification                                                                |
| ----- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1     | `docs: Defined atomic implementation commit plans`               | Require ordered atomic plans and link Git authorisation.                               | Formatting and documentation links.                                         |
| 2     | `feat: Added nullable formation websites to the public contract` | Migrate all public envelopes to v2, nullable required website, generator and contract. | Null/invalid website tests, schema assertions and deterministic generation. |
| 3     | `feat: Added the initial electoral formation catalogue`          | Add five real formations, evidence and generated pending entries.                      | Content validation and catalogue combinations.                              |
| 4     | `feat: Added the static programme browsing portal`               | Next tooling, public queries, all routes, reader, CSS themes, SEO and build CI.        | Locked installation, content/markup tests, static checks and full build.    |
| 5     | `docs: Recorded comparator and theme transition follow-ups`      | Record future comparison and accessible theme motion.                                  | Roadmap consistency and local links.                                        |
