# Prisma portal implementation

## Architecture and delivery

The first portal uses Next 16.4.0, React 19.3.0 and App Router, with statically prerendered pages and CSS Modules. It keeps the normal Next output compatible with future Vercel hosting; it is not an HTML export. There is no content API, database, model service, comparator or correction form.

Node 24.x and npm 10.8.2 remain required. TypeScript 7.0.2 supplies `tsc`; the `typescript` npm alias points to the official TypeScript 6 API compatibility package needed by ESLint. [Microsoft documents this coexistence](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/). Application code has a strict configuration separate from checked JavaScript tooling. Dependencies are pinned and installed without forced peer resolution.

The content adapter explicitly imports only the four files under `content/generated`. The reader accepts schema v2, checks envelope consistency and resolves stable IDs. The generator remains the authority for full input validation. Build runs `content:check` first and fails on invalid or stale content without regenerating it. Incorporating approved content later requires an editorial generation and a new build.

## Routes and editorial states

The catalogue initially has five formations and eight areas: 56 pages across `/`, `/parties`, `/parties/[party]`, `/parties/[party]/[topic]`, `/topics` and `/topics/[topic]`. Dynamic routes enumerate the generated catalogue with `generateStaticParams` and disallow unknown IDs. A dedicated 404 provides a return path.

Home provides area browsing followed by one “Lista de partidos” link to `/parties`. The former formation column and list subtitles are removed; summary pages retain explicit availability. Area pages list formation links and review states; they do not implement comparison. Formation pages omit the official website link when it is null. The catalogue's limits and [provenance](catalogue-provenance.md) are explicit.

- `pending`: “Resumen todavía no disponible”, without inferring that a formation lacks proposals or has not published a programme.
- `partial`: approved points, citations and the explicit partial-review notice.
- `complete`: reviewed points, revision and review date. An empty complete review says no proposals were identified in the reviewed corpus and retains its reviewed sources.

Points preserve their IDs as shareable anchors. Native disclosure controls expose source quotations without client-side state. PDF references retain physical and optional printed page numbers; HTML references use only actual source anchors. Dates are formatted in Spanish with UTC. Sources link to official URLs; local originals, extraction and review records are never copied into web assets.

## Presentation and SEO

The light interface uses system fonts, semantic navigation, breadcrumbs, a skip link, visible focus, readable contrast and explicit mobile layouts. Party sections apply page-wide CSS variables; colour configuration remains outside the editorial contract. PP and PSOE use evidenced accents, while other or new formations remain neutral. See [colour evidence](catalogue-provenance.md#interface-colour-evidence).

The isolated `HomeNavigation` client component receives only area labels and routes from the server page. Its intrinsic grid width fits the longest label plus the existing left gutter and 24 pixels of trailing padding. Available viewport space limits the width, reserving 8 pixels for hover. Trapezoid top edges are 10 pixels shorter than their bottom edges, leaving at least 14 pixels of clearance after the longest label. A 2.75-rem minimum height, 0.3-rem vertical padding and larger labels keep buttons compact; labels can wrap on narrow screens. Other directories retain their existing presentation.

GSAP 3.15.0 and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) reveal the section once it reaches 85% of the viewport. “Por área” fades in over 0.18 seconds, while links slide from fully outside the left edge over 0.45 seconds each, staggered by 0.07 seconds in catalogue order. Pointer hover moves each whole link 8 pixels right over 0.16 seconds. Backgrounds extend past the outer edge to preserve their viewport attachment. Hover does not underline headings or links. Background colours transition in both directions over 0.5 seconds with CSS `ease-in-out`. Touch input does not trigger lateral hover motion. Scrolling remains native. GSAP matchMedia scopes cleanup and live reduced-motion handling. Reduced motion and server-rendered HTML show all links immediately; keyboard focus completes the reveal. Browser verification of timing, focus and responsive geometry remains pending.

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
