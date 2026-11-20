# Provincial Congress candidature presence

## Request and agreement

The maintainer reviewed the complete 52-constituency grouping in chat, chose the BOE over the supplied secondary table and requested its integration into the homepage. The final clarification limits delivery to province detection, Madrid fallback, a navbar province search and the provincial formation list. It excludes public candidate names, candidature detail screens, new routes and new programme content. Only existing programme routes may be linked. Git commit and push were not requested.

The accepted dataset is [congress-2026-provinces.json](../approved/congress-2026-provinces.json), revision 1. The review concerns formation presence in Congress constituencies for 29 November 2026, not Senate lists or candidate membership. Accordingly `listCoverage` remains `partial`, candidate arrays are empty and the envelope explicitly states its limited scope in all six locales. The programme catalogue and its existing IDs are unchanged.

## Official evidence and extraction

- [BOE-A-2026-23103, 3 November](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-23103): preserved existing immutable original `source-a8f0ada0b76e`, including its original capture date and both existing extraction segment IDs. Added localisable heading and status segments; updated only the extraction hash. Consulted again on 20 November 2026.
- [BOE-A-2026-23383, 7 November](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-23383): preserved `source-7f2c05abb419`, consulted on 20 November. Applied the corrected EH Bildu Congress denomination in Navarra. Other corrections concern people or Senate and do not change this province-to-formation projection.

Extraction reads each electoral-board heading, then the Congress section and formation headings; it ends each block at the next heading or chamber. It examined 555 Congress headings, excluded 21 expressly non-proclaimed blocks and retained 534 candidatures across 52 constituencies. Names and ordering of candidates are not extracted into the accepted batch. Immutable BOE originals are research evidence only and are not imported by the app.

Against the secondary table, official evidence adds Junts in Tarragona and PCTE in Navarra, excludes Falange in Alicante and Sevilla, PACMA in Murcia and PUM+J in Pontevedra, and establishes the subsequently proclaimed PCTE list in Burgos. A repeated first position in Toledo was a substitute misclassification in the secondary table, not another formation. The app does not consume that table.

There are 75 distinct original formation denominations after reusing matching programme IDs. Territorial names and coalitions are retained separately. Matching a label or finding a programme for a coalition member does not establish that coalition's programme: only existing identical formation IDs link to programme routes. No constituent-party relationship, branding, biography or programme assertion is added.

## Verification and publication boundaries

The scoped offline validator checks field allowlists, identifiers, references, dates, immutable source and extraction hashes, citation occurrence, empty candidate arrays, province coverage and unique formation/constituency pairs. It projects only province IDs, formation IDs, labels and optional existing programme IDs. The generated file contains no candidate names, source extractions, review notes or invented paths. This validator does not cover arbitrary political-reference batches or establish semantic fidelity by itself.

Tests cover the 52-constituency/534-candidature inventory, known secondary-source discrepancies and the existing-route-only boundary. Full portal checks, build results and browser limitations are reported with the implementation delivery. Programme data remains separately reviewed and generated; geographic detection never changes editorial approval.

Final local verification on 20 November 2026: `npm run check`, 125 deterministic tests and the production build passed with Node 24.22.3 and npm 10.8.2. The emitted portal retained its 336 existing pages. The standalone DOM harness passed province-combobox interaction checks. Real browser permission prompts, visual layout and physical-device behaviour remain unverified. All implementation changes remain local and uncommitted.

On 21 November the maintainer explicitly extended the same provincial formation list to the existing `/parties` directory. This changes only the presentation scope and shared selection behaviour, not the accepted electoral facts, source versions or dataset revision. No additional routes or proposals were introduced. Static checks, all 127 tests, the 336-page build and a temporary direct-entry/navigation DOM harness passed. All changes remain uncommitted.

A further 21 November request extended the same list to every policy-area directory. The political dataset and revision remain unchanged. Area links now require approved synthesis points for that exact area; other provincial formations are visible without a destination. Verification passed static checks, 129 tests, all 336 prerendered pages and a temporary DOM test of shared selection, area changes and reviewed-link gating. No publication was requested or performed.

## Git publication agreement

On 21 November 2026 the maintainer accepted the completed delivery and explicitly requested splitting all changes into commits and pushing them. The planned units are the verified provincial data/geography foundation and its shared portal integration. This authorizes local commits on `master` and SSH publication to `origin/master`, without a pull request or deployment changes. Final verification is performed on the complete batch and the first commit's staged snapshot before publication; remote CI and deployment are not established by local checks.

Pre-publication checks passed for both units. The data foundation's isolated staged snapshot passed static validation, 124 tests and the existing 336-page build. The complete integration passed 129 tests, all static/source checks, the same page inventory and the province/directory/area DOM harnesses. Tests were separated by responsibility without changing their assertions. The programme corpus and approved electoral dataset were not substantively changed during publication preparation. The original BOE bytes retain their upstream whitespace and hashes. CI and deployment are not claimed from these local results.
