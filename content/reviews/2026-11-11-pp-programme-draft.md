# PP national programme — source capture and editorial review

The scope is the Partido Popular national programme for the 29 November 2026 general election. This follows the [same-day discovery review](2026-11-11-pp-programme-discovery.md). The [election call](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20742) covers Congress and Senate. The [PP documents index](https://www.pp.es/actualidad/documentos/) and [10 November programme presentation](https://www.pp.es/actualidad/articulos/reparar-el-estado-regenerar-la-democracia-reunir-a-la-nacion-y-recuperar-la-ambicion-los-cuatro-pilares-de-la-reconstruccion-nacional-que-feijoo-cumplira-si-o-si/) identify the national programme. The Navarra coalition text and any separately adopted territorial supplement remain unresolved.

## Preserved source

The maintainer supplied the 12,279,932-byte PDF. The browser's download provenance on the available local copy records the exact official [PP URL](https://www.pp.es/wp-content/uploads/2026/11/LA-RECONSTRUCCION-NACIONAL.pdf). The file's byte size agrees with the supplied upload. The [original](../sources/pp-2026-cea8f2a05227/original.pdf), [source metadata](../sources/pp-2026-cea8f2a05227/metadata.json) and [extraction](../sources/pp-2026-cea8f2a05227/extracted.json) are preserved under `pp-2026-cea8f2a05227`. The [second official link](https://www.pp.es/wp-content/uploads/2026/11/PROGRAMA-ELECTORAL-PP-2026-RECONSTRUCCION-NACIONAL.pdf) remains uncaptured. Its relationship to the supplied snapshot remains unknown.

Apple PDFKit extracted the embedded text from all 82 physical pages. The extraction preserves cover pages, folio-only text and line breaks, including visual line-wrap hyphens. Citations use physical pages. The printed folios match the physical numbers on the visually sampled pages. PDFKit sometimes places marginal boxes and sidebars before their adjacent paragraph. Proposal boundaries were checked by measure number and page layout where relevant.

The captured edition has 249 distinct measure numbers. It includes proposal text for 241 and campaign placeholders for eight: 83 (p. 34), 109 (p. 43), 132 (p. 48), 164 (p. 57), 167 (p. 58), 173 (p. 59), 200 (p. 65) and 210 (p. 67). No wording was inferred for those numbers. The four programme pillars are shown in the index on p. 7. The app's topic catalogue is used for editorial selection.

## External and interpretation checks

- The [PP presentation speech summary](https://www.pp.es/actualidad/articulos/feijoo-presenta-el-programa-del-pp-como-la-cura-con-la-que-sanar-una-espana-herida-y-la-respuesta-para-reconstruir-el-pais/) announces a single activation income combining the minimum income and other subsidies. In this captured edition, normalized full-text searches did not find the relevant terms or a supporting numbered proposal. The speech announcement remains outside the approved batch.
- The [Spanish Constitution, article 134.4](https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a134), currently provides for automatic extension of the prior budget until a new one is approved. The programme's measure 65 proposes a rule for the second consecutive extension. It is described as a proposal, without conclusions about the legal instrument needed to enact it.
- The [General Social Security Act, article 58](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724#a58), already ties annual contributory pension adjustments to a twelve-month average of year-over-year consumer price inflation. The synthesis presents the programme's CPI pledge without characterising it as a new indexing system.
- The [Organic Law on the Judiciary, article 567](https://www.boe.es/buscar/act.php?id=BOE-A-1985-12666#a567), assigns the parliamentary chambers the selection of six judicial members each. Measure 72 addresses the judicial members of the General Council of the Judiciary. The synthesis preserves that scope.
- [Law 12/2023, article 18](https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203#a18), sets out the mechanism for declaring stressed residential-market areas. The synthesis attributes repeal and removal of those areas to the PP's proposal.

## Editorial state

The approved batch selects 24 principal measures, three per Prisma area. It favours proposals with a concrete action, condition or beneficiary. Each record contains the exact approved wording in Castilian, Catalan/Valencian, Galician, Basque, Aranese and English, alongside physical-page citations. The maintainer approved this exact batch and authorised commit and push on 11 November 2026. All eight syntheses moved from pending revision 1 to partial revision 2 with editorial review timestamp `2026-11-11T14:50:04Z`.

| Policy area                   | Approved record                                                                                 | Programme measures |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | ------------------ |
| Vivienda                      | [Housing](../editorial/syntheses/pp/housing.json)                                               | 144, 145, 156      |
| Educación                     | [Education](../editorial/syntheses/pp/education.json)                                           | 163, 209, 216      |
| Sanidad                       | [Healthcare](../editorial/syntheses/pp/healthcare.json)                                         | 219, 220, 223      |
| Economía e impuestos          | [Economy and taxes](../editorial/syntheses/pp/economy-and-taxes.json)                           | 177, 179, 180      |
| Empleo                        | [Employment](../editorial/syntheses/pp/employment.json)                                         | 169, 170, 174      |
| Pensiones y protección social | [Pensions and social protection](../editorial/syntheses/pp/pensions-and-social-protection.json) | 108, 112, 114      |
| Medioambiente y energía       | [Environment and energy](../editorial/syntheses/pp/environment-and-energy.json)                 | 228, 229, 232      |
| Instituciones y derechos      | [Institutions and rights](../editorial/syntheses/pp/institutions-and-rights.json)               | 65, 72, 90         |

Independent review checked the source hashes, the original page renders for the selected measure blocks, the meaning of each draft and the citation occurrences. It checked the continuation of measure 108 across pages 42–43 and measure 219 across pages 68–69. The review prompted an explicit main-residence condition on the landlord incentive in measure 156, retention of formal names and several language-fidelity corrections. Future language review can revisit idiom and statutory terms, particularly the Aranese and Basque equivalents for the permanent intermittent employment contract, subsidised places and care for dependent persons.

The portal projection includes the approved points and citations. Each synthesis remains partial while the second official link remains unresolved. Any later substantive amendment requires its own review.

## Verification

Independent draft review checked all 38 citations against their numbered measures and physical pages. After approval, deterministic generation exposes 24 proposals and one public source. The other 32 syntheses remain pending.

Static checks and all 103 deterministic tests passed on the scoped publication tree. Server-side rendering verified the actual reader and directory components for all 48 locale and area combinations and all six localized PP directories. The production build stopped when the execution environment denied a port bind used internally by Turbopack to process the existing WGSL loader. No app server was started.
