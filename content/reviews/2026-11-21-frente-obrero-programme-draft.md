# Frente Obrero programme synthesis — approved partial batch

The maintainer approved this exact 41-point batch in all six languages for the Spanish general election of 29 November 2026 and authorised production publication. The source-research cutoff remains 21 November 2026. Every point is `approved`; all eight syntheses have revision 2, `reviewStatus: partial` and `reviewedAt: 2026-11-21T01:10:09Z`. Approval changes status and publication only; all previously reviewed titles, bodies, citations, IDs and editorial order are unchanged. Partial status preserves the documented selection and corpus limits.

## Evidence and identity

The source is **Recuperar España — Programa político del Frente Obrero**, preserved as `frente-obrero-2026-7b9f423f2c1a`: [original PDF](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf), [metadata](../sources/frente-obrero-2026-7b9f423f2c1a/metadata.json), [page extraction](../sources/frente-obrero-2026-7b9f423f2c1a/extracted.json), [official publication](https://frenteobrero.es/documentos/programa-frente-obrero.pdf).

- Original SHA-256: `7b9f423f2c1ada187b6f42ed8dbf4e025356254d7a6b81830e114b818ef2e282`.
- Extraction SHA-256: `63f128058e5a00fec776a787f2ae498284fa8e7aa2cd1349079252f7b5c5d8cd`.
- Capture time recorded by Builder: `2026-11-21T00:27:36Z`. This is not a publication date.
- 64 physical PDF pages, retained individually. PDF physical and printed numbers agree for the cited interior pages.
- Page 6 expressly says this is a political programme, rather than an electoral programme. Builder supplied the official current campaign adoption evidence and independent conditional eligibility pass. Eligibility rests on that current adoption, not an invented 2026 edition date or the hash alone. No Senate participation or candidature claim is made.
- Both supplied hashes were recomputed before reuse. All 45 proposed citation quotes were checked against a fresh parse of the preserved original PDF, allowing only whitespace differences. Pages 46 and 53 were also rendered and visually inspected. Research and independent QA own broader source comparison and provenance checks.
- The preserved extraction was not edited. Quotes below keep source spelling, punctuation and line-break hyphenation; whitespace is collapsed for readability. Such hyphenation is not editorial wording.

## Selection, interpretation and language review

These are principal selections, not an exhaustive inventory. The established classification is unchanged. All six language versions below were reviewed for semantic fidelity and are now approved by the maintainer as one batch. No translations are missing. The earlier review flagged Basque (`eu`) and Aranese (`oc`) idiom for particular care, including legal, pension and contractual terminology. Maintainer acceptance does not certify specialist or native fluency.

- **Housing:** «españoles autóctonos» is the source's undefined expression, retained literally in translated bodies rather than silently equated with all Spanish nationals or an eligibility test. «Inquiokupas» is also an undefined political term; the point keeps the source's fraud qualifier and makes no finding about particular tenants. The eviction point retains vulnerability, inability to pay, immediate suspension and the alternative-housing endpoint. Mortgage debt second chances and payment in kind are omitted from this selection, not rejected.
- **Education:** the placement of «para las rentas más bajas» after «incluidos los superiores» permits uncertainty over which levels it qualifies. This draft applies the income condition to the education offer conservatively and flags the interpretation for maintainer/QA review. It must not be presented as an unqualified promise of universal free higher education. Meals and paid placements retain their separate unconditional wording. Digital education restrictions, study-language rights, private firms in universities and disability education remain outside the selection.
- **Healthcare:** free dental, physiotherapy and eye care retains the proposed implementation structure; prescription medicines retain movement towards free provision only for special need, not an immediate universal entitlement. Mental-health resources, waiting lists, staff conditions, addiction care and residential places are not separately selected.
- **Economy and taxes:** nationalisation refers to strategic sectors, not all businesses. The inheritance point distinguishes abolition for low incomes from centralisation and relief removal. The land point preserves the large-landowner, unused-land and collective-use conditions and the separate ban on construction of solar farms on cultivable land. Corporation tax, enforcement/expropriation for tax fraud, debt relief and wider rural measures are omitted.
- **Employment:** representation begins at ten workers, without exceptions. The source's «bonificación total por baja» does not specify the kind of leave or administrative mechanism; no benefit amount or leave category has been invented. Review all translations of this ambiguity and `fijos-discontinuos`. Repeal of labour reforms, strike legislation, false self-employment and enforcement measures remain outside the selection.
- **Pensions and social protection:** no retirement age, contribution-window length or leave duration is invented. The childcare and parental-leave points preserve the respective maternity and childcare purposes. The explicit natality target of more than two children per woman, preferential support for larger families and restrictions on anti-family public messaging are omitted.
- **Environment and energy:** the nuclear point retains expansion, modernisation, plant operation, domestic uranium and complementary renewables; it does not reverse the hierarchy between nuclear and renewable energy. Ending the «transición ecológica» is a proposal with its rationale attributed to the programme, not a verified factual account of EU policy. Water infrastructure, hunting powers, stopping plant closures and energy oligopoly measures are omitted.
- **Institutions and rights:** immigration expulsions, nationality review and Islam-related restrictions all retain the source's express requirement for a new Constitution in every language. Immediate implementation is the programme's desired timing, not an assertion that present law permits it. The Islam point retains radicals, foreign-lobby structures, public schools, all Islamic-activity subsidies, the public-place/public-job hijab ban and support for threatened women wishing to stop wearing Islamic clothing. The source does not define the breadth of «lugares públicos» or «radicales»; no new legal definition is supplied. The constituent process and republic oriented towards socialism are distinguished from a future decision on the State's form. The repeal point preserves partial or total repeal, not an absolute promise to repeal every covered law in full. Law and ministry names remain original. Asylum restrictions, nationality removal for serious offences, detention/deportation centres, criminal-justice reforms, surrogacy, Gibraltar, Western Sahara and detailed military/security measures are omitted.

The programme's descriptions of social conditions, legal effects and opponents are not independently adopted as facts by these summaries. Builder is supplying separately dated primary legal context for disputed implications. Such context belongs in review, not in the programme points. Legal feasibility and the political desirability of the proposals are separate from faithful attribution.

## Pre-approval gates and draft validation (historical)

1. Independent QA must confirm source eligibility, extraction, semantic fidelity, selection and the final JSON; this author cannot approve its own work.
2. Resolve or explicitly accept the interpretation questions above, including income scope, undefined terms and the constitutional prerequisite.
3. The maintainer must review or delegate review of all six exact versions and accept the complete multilingual batch before any point is marked approved. Changed wording must be shown again; approval of Castilian alone is insufficient.
4. Builder alone may apply an exactly accepted batch to approved repository content, set genuine review dates, increment public revisions when appropriate and regenerate output. No approval or review timestamp has been invented here.

The following records the initial draft validation before the approval documented below. The existing generator completed successfully with `node scripts/generate-content.mjs --root <staging-root>` and then the same command with `--check`, on Node `v24.22.3`. Its checks cover hashes, references, exact quote occurrence, field/ID contracts and deterministic output. They do not establish semantic truth or human approval. All four files use schema version 3. The eight Frente Obrero public entries remain pending, have null revisions and contain no proposals or source IDs. Draft points are intentionally excluded from public JSON; pending areas produce the app's existing unavailable state. Existing source and synthesis files were byte-compared against the repository baseline and preserved.

The four generated files are `content/generated/parties.json`, `content/generated/topics.json`, `content/generated/sources.json` and `content/generated/syntheses.json`. Editable draft paths and all proposed wording follow. No application code, contract, approved point, remote state or publication was changed by Synthesis.

## Research execution and preserved adoption evidence

Builder directly invoked the native `prisma-research`, `prisma-synthesis` and `prisma-qa` profiles with fresh bounded task packets. Each role worked in its assigned directory outside the repository. The Research discovery used six queries and eleven source opens; no separate territorial annex was located in that bounded scope. No exhaustive territorial archive, candidature proclamation or Senate participation claim follows from that result. The programme's territorial-structure chapter is not a territorial annex.

The official election call, [Real Decreto 806/2026](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20742), article 2, establishes 29 November 2026 for both chambers. The [official homepage](https://frenteobrero.es/) identifies the 2026 campaign and describes programme priorities for Congress; the [official programme page](https://frenteobrero.es/quienes-somos/) labels its programme for 29 November. Both link the preserved PDF. This attribution chain supports current adoption while preserving the document's own page-6 political-programme disclaimer. It does not date the original edition or extend Congress campaign statements to Senate participation.

Read-only downloads preserved raw originals after one sandbox DNS failure. The remote PDF matches the maintainer-supplied PDF byte for byte (1,202,338 bytes). Full original captures, the corrected source ledger, task packets and QA diagnostics are archived outside Git at:

`/Users/napptilus/.codex/visualizations/2026/11/21/01a1fb7d-bb96-72c0-a491-3f2e86cc8a0f/frente-obrero-programme-2026-11-21`

| Capture                    | SHA-256                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| programa-frente-obrero.pdf | `7b9f423f2c1ada187b6f42ed8dbf4e025356254d7a6b81830e114b818ef2e282` |
| homepage.html              | `1e27313668e39aed643387dc5500e25608a0877704d09048a83fa33467e06f04` |
| quienes-somos.html         | `c8dd2b2d08a274569bfab624546ae0f769a981a9e30977685a1f91e918bd7e8e` |
| boe-call.html              | `1bd94d7c7b0c265e12e655906e8b9ccff1ffa5b88a2bd13d55b8b28a6d9f5e27` |

The archive and programme source are separate contracts: the adoption HTML and election call remain research evidence, while only the eligible PDF uses programme-source metadata. No publication or effective date for the PDF is established. Native per-agent token telemetry is unavailable; usage remains null and no savings are claimed.

The approved provincial Congress inventory uses separate Frente Obrero formation identifiers. This programme incorporation does not reconcile those identities or change the provincial programme-link mapping. No political-reference dataset, portal code or shared topic classification was modified.

## Current external context and editorial disagreements

Builder consulted the following primary consolidated legislation on 21 November 2026, between 00:29 and 00:31 UTC. These checks provide current context for the proposed summaries. They do not establish the legality or feasibility of an unimplemented policy, and their conclusions must not replace the programme's proposals in the app.

- [Spanish Constitution, article 16](https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a16), latest consolidated update displayed as 20 May 2026: protects individual and collective freedom of religion, subject to public order protected by law. The programme's restriction of Islam must be attributed as a proposal and must not imply that a religion's illegality is already established. An individualized constitutional analysis of a future bill is outside this review.
- [Organic Law 4/2000, article 57](https://www.boe.es/buscar/act.php?id=BOE-A-2000-544#a57), latest consolidated update displayed as 19 March 2025: provides for proportionality, an administrative procedure and a reasoned decision for the relevant expulsion sanctions; conviction-based expulsion also requires a procedure. The programme's immediate-expulsion language describes a requested policy change, not an existing automatic power. Full asylum, EU free movement, non-refoulement and judicial case-law analysis remains outside this bounded check.
- [Civil Code, article 25](https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763#a25), latest consolidated update displayed as 3 January 2025: regulates loss of nationality for non-origin Spanish citizens and invalidation for fraud. It does not make any serious criminal offence a general automatic ground for withdrawal of acquired nationality. The programme's broader withdrawal proposal must remain an attributed political proposal; no existing automatic power is asserted.
- [Organic Law 3/2007, article 11](https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115#a11), latest consolidated update displayed as 2 August 2024: authorizes reasonable, proportionate positive action to correct demonstrated inequality. The programme's characterization of all such laws as discrimination is its political judgment, not a fact established by this review. Summarize the requested repeal and removal of quotas faithfully without adopting its diagnosis as editorial fact.

The consolidated BOE pages state that consolidation is informative and has no legal force of its own; the underlying official enactments and judgments would be needed for a formal legal opinion. No claim about financial cost, implementation certainty, clinical effectiveness or factual truth of the programme's socioeconomic diagnoses has been established here. No formation is scored.

## Exact approved batch

### Vivienda

Synthesis `frente-obrero--housing`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/housing.json`.

#### 1. Vivienda pública

Point `frente-obrero-public-housing` — approved.

**es — Vivienda pública**

Construir vivienda pública de calidad para que los trabajadores accedan a una vivienda digna y asequible.

**ca — Habitatge públic**

Construir habitatge públic de qualitat perquè els treballadors accedeixin a un habitatge digne i assequible.

**gl — Vivenda pública**

Construír vivenda pública de calidade para que os traballadores accedan a unha vivenda digna e accesible economicamente.

**eu — Etxebizitza publikoa**

Kalitatezko etxebizitza publikoak eraikitzea, langileek etxebizitza duina eta ekonomikoki eskuragarria izan dezaten.

**oc — Abitatge public**

Bastir abitatge public de qualitat entà qu'es trabalhadors accedisquen a un abitatge digne e economicament accessible.

**en — Public housing**

Build quality public housing so workers can access decent, affordable homes.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 45](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=45), segment `page-45`. Exact quote: «Construir vivienda pública de calidad para aumentar el número de inmuebles existen- tes y lograr que los trabajadores puedan acceder a una vivienda digna y asequible económicamente.»

#### 2. Especulación y pisos turísticos

Point `frente-obrero-housing-speculation` — approved.

**es — Especulación y pisos turísticos**

Combatir la especulación de bancos, fondos buitre y grandes rentistas, y frenar la gentrificación y el auge de los pisos turísticos.

**ca — Especulació i pisos turístics**

Combatre l'especulació de bancs, fons voltor i grans rendistes, i frenar la gentrificació i l'auge dels pisos turístics.

**gl — Especulación e pisos turísticos**

Combater a especulación de bancos, fondos voitre e grandes rendistas, e frear a xentrificación e o auxe dos pisos turísticos.

**eu — Espekulazioa eta turismo etxebizitzak**

Bankuen, funts putreen eta errentadun handien espekulazioari aurre egitea, eta gentrifikazioa eta turismo etxebizitzen gorakada geldiaraztea.

**oc — Especulacion e apartaments toristics**

Combàter era especulacion de bancs, hons voltor e grani rendistes, e frenar era gentrificacion e er aument des apartaments toristics.

**en — Speculation and tourist rentals**

Combat speculation by banks, vulture funds and large rentiers, and curb gentrification and the growth of tourist rentals.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 46](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=46), segment `page-46`. Exact quote: «Luchar contra la especulación de bancos, fondos buitre y grandes rentistas; la vivien- da no es una mercancía con la que hacer negocio. Aplicar medidas que detengan la gentrificación, el auge de los pisos turísticos y las consecuencias negativas del turismo destructivo.»

#### 3. Desahucios y alternativa habitacional

Point `frente-obrero-eviction-suspension` — approved.

**es — Desahucios y alternativa habitacional**

Paralizar inmediatamente los desahucios de familias trabajadoras vulnerables que no puedan pagar alquiler o hipoteca hasta encontrar una alternativa habitacional.

**ca — Desnonaments i alternativa d'habitatge**

Aturar immediatament els desnonaments de famílies treballadores vulnerables que no puguin pagar el lloguer o la hipoteca fins a trobar una alternativa d'habitatge.

**gl — Desafiuzamentos e alternativa habitacional**

Paralizar inmediatamente os desafiuzamentos de familias traballadoras vulnerables que non poidan pagar o alugueiro ou a hipoteca ata atopar unha alternativa habitacional.

**eu — Etxegabetzeak eta bizitoki alternatiboa**

Alokairua edo hipoteka ordaindu ezin duten langile familia zaurgarrien etxegabetzeak berehala geldiaraztea, bizitoki alternatiboa aurkitu arte.

**oc — Deslotjaments e alternativa d'abitatge**

Arturar immediatament es deslotjaments de familhes trabalhadores vulnerables que non poguen pagar eth loguèr o era ipotèca enquia trobar ua alternativa d'abitatge.

**en — Evictions and alternative housing**

Immediately suspend evictions of vulnerable working families unable to pay rent or mortgages until alternative housing is found.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 46](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=46), segment `page-46`. Exact quote: «Paralizar inmediatamente todos los procesos de desahucio de las familias trabajado - ras en situación de vulnerabilidad que no pueden hacer frente al pago del alquiler/ hipoteca hasta encontrar una alternativa habitacional. Se deben conceder segundas oportunidades para deudas hipotecarias y garantizar la posibilidad de dación en pago en todas las situaciones.»

#### 4. Ocupación de viviendas particulares

Point `frente-obrero-private-home-occupation` — approved.

**es — Ocupación de viviendas particulares**

Actuar contra las mafias de la ocupación y los narcopisos, no permitir en ningún caso la ocupación de viviendas de particulares y actuar contra los «inquiokupas» que practican la estafa.

**ca — Ocupació d'habitatges particulars**

Actuar contra les màfies de l'ocupació i els narcopisos, no permetre en cap cas l'ocupació d'habitatges de particulars i actuar contra els «inquiokupas» que practiquen l'estafa.

**gl — Ocupación de vivendas particulares**

Actuar contra as mafias da ocupación e os narcopisos, non permitir en ningún caso a ocupación de vivendas de particulares e actuar contra os «inquiokupas» que practican a estafa.

**eu — Partikularren etxebizitzen okupazioa**

Okupazio mafien eta droga pisuen aurka jardutea, partikularren etxebizitzen okupazioa inolaz ere ez onartzea eta iruzurra egiten duten «inquiokupas» direlakoen aurka jardutea.

**oc — Ocupacion d'abitatges particulars**

Actuar contra es màfies dera ocupacion e es narcopisos, non perméter en cap cas era ocupacion d'abitatges de particulars e actuar contra es «inquiokupas» que practiquen era estafa.

**en — Occupation of privately owned homes**

Act against occupation mafias and drug flats, never permit occupation of individuals' homes, and act against «inquiokupas» who engage in fraud.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 46](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=46), segment `page-46`. Exact quote: «Luchar por terminar con las mafias de la ocupación y de la delincuencia relacionada con el uso indebido de inmuebles, acabando con la lacra de los narcopisos. Se actua- rá a su vez contra la ocupación de viviendas de particulares, que no debe ser permi - tida en ningún caso. También se actuará contra los inquiokupas, que han hecho de la estafa su modo de vida.»

#### 5. Acceso de españoles autóctonos

Point `frente-obrero-native-spaniards-housing` — approved.

**es — Acceso de españoles autóctonos**

Orientar el acceso a la vivienda pública hacia los «españoles autóctonos», según la expresión del programa.

**ca — Accés dels espanyols autòctons**

Orientar l'accés a l'habitatge públic cap als «españoles autóctonos», segons l'expressió del programa.

**gl — Acceso dos españois autóctonos**

Orientar o acceso á vivenda pública cara aos «españoles autóctonos», segundo a expresión do programa.

**eu — Espainiar autoktonoen sarbidea**

Etxebizitza publikorako sarbidea «españoles autóctonos» deitutakoengana bideratzea, programaren adierazpenaren arabera.

**oc — Accès des espanhòus autoctòns**

Orientar er accès ar abitatge public entàs «españoles autóctonos», segontes era expression deth programa.

**en — Access for native Spaniards**

Direct access to public housing towards people described as «españoles autóctonos» (native Spaniards), using the programme's wording.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 46](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=46), segment `page-46`. Exact quote: «Enfocar el acceso a la vivienda pública hacia los españoles autóctonos. No permitir que suceda como con las ayudas, que, como se ha visto en el programa, también de- ben cambiar, pues se suele priorizar al extranjero.»

### Educación

Synthesis `frente-obrero--education`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/education.json`.

#### 1. Gratuidad para rentas bajas

Point `frente-obrero-free-education` — approved.

**es — Gratuidad para rentas bajas**

Ofrecer educación gratuita en todos los niveles académicos, incluidos los superiores, para las rentas más bajas, y becas para compatibilizar formación y trabajo o atender necesidades especiales.

**ca — Gratuïtat per a rendes baixes**

Oferir educació gratuïta en tots els nivells acadèmics, inclosos els superiors, per a les rendes més baixes, i beques per compatibilitzar formació i feina o atendre necessitats especials.

**gl — Gratuidade para rendas baixas**

Ofrecer educación gratuíta en todos os niveis académicos, incluídos os superiores, para as rendas máis baixas, e bolsas para compatibilizar formación e traballo ou atender necesidades especiais.

**eu — Doakotasuna errenta baxuentzat**

Errenta baxuenentzat hezkuntza doan eskaintzea maila akademiko guztietan, goi mailak barne, eta bekak ematea ikasketak eta lana uztartzeko edo behar bereziei erantzuteko.

**oc — Gratuïtat entà rendes baishes**

Auferir educacion gratuïta en toti es nivèus academics, includidi es superiors, entàs rendes mès baishes, e borses entà compatibilizar formacion e trabalh o atier besonhs especiaus.

**en — Free education for low incomes**

Offer free education at all academic levels, including higher education, for the lowest incomes, with grants to combine study and work or address special needs.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 22](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=22), segment `page-22`. Exact quote: «1. Ofrecer una educación gratuita en todos los niveles académicos, incluidos los su - periores para las rentas más bajas. Implementación de un sistema de becas que sirva de apoyo para compaginar la formación con la vida laboral o condiciones de especial necesidad.»

#### 2. Comedor escolar gratuito

Point `frente-obrero-free-school-meals` — approved.

**es — Comedor escolar gratuito**

Ofrecer comedor escolar gratuito para facilitar la conciliación familiar y fomentar hábitos alimenticios saludables.

**ca — Menjador escolar gratuït**

Oferir menjador escolar gratuït per facilitar la conciliació familiar i fomentar hàbits alimentaris saludables.

**gl — Comedor escolar gratuíto**

Ofrecer comedor escolar gratuíto para facilitar a conciliación familiar e fomentar hábitos alimentarios saudables.

**eu — Doako eskola jantokia**

Doako eskola jantokia eskaintzea, familia eta lana uztartzea errazteko eta elikadura ohitura osasungarriak sustatzeko.

**oc — Minjador escolar gratuït**

Auferir minjador escolar gratuït entà facilitar era conciliacion familhau e fomentar abituds alimentaris saludables.

**en — Free school meals**

Offer free school meals to facilitate family life and promote healthy eating habits.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 22](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=22), segment `page-22`. Exact quote: «2. Ofrecer comedor escolar gratuito para facilitar la conciliación familiar y fomentar hábitos alimenticios saludables.»

#### 3. Financiación de la escuela pública

Point `frente-obrero-private-school-subsidies` — approved.

**es — Financiación de la escuela pública**

Eliminar las subvenciones a la escuela privada para fortalecer el sistema público de educación.

**ca — Finançament de l'escola pública**

Eliminar les subvencions a l'escola privada per enfortir el sistema públic d'educació.

**gl — Financiamento da escola pública**

Eliminar as subvencións á escola privada para fortalecer o sistema público de educación.

**eu — Eskola publikoaren finantzaketa**

Eskola pribatuentzako dirulaguntzak kentzea, hezkuntza sistema publikoa indartzeko.

**oc — Finançament dera escòla publica**

Eliminar es subvencions ara escòla privada entà enfortir eth sistèma public d'educacion.

**en — Public school funding**

End subsidies to private schools to strengthen the public education system.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 22](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=22), segment `page-22`. Exact quote: «4. Eliminar las subvenciones a la escuela privada con el fin de fortalecer el sistema público de educación.»

#### 4. Prácticas remuneradas

Point `frente-obrero-paid-placements` — approved.

**es — Prácticas remuneradas**

Remunerar las prácticas de formación profesional y universidad según el trabajo desarrollado, sin excepciones.

**ca — Pràctiques remunerades**

Remunerar les pràctiques de formació professional i universitat segons la feina desenvolupada, sense excepcions.

**gl — Prácticas remuneradas**

Remunerar as prácticas de formación profesional e universidade segundo o traballo desenvolvido, sen excepcións.

**eu — Ordaindutako praktikak**

Lanbide heziketako eta unibertsitateko praktikak egindako lanaren arabera ordaintzea, salbuespenik gabe.

**oc — Practiques remunerades**

Remunerar es practiques de formacion professionau e universitat segontes eth trabalh hèt, sense excepcions.

**en — Paid placements**

Pay for vocational and university placements according to work performed, without exceptions.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 22](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=22), segment `page-22`. Exact quote: «6. Ofrecer prácticas de formación profesional y universidad remuneradas en base al trabajo desarrollado, sin excepciones.»

### Sanidad

Synthesis `frente-obrero--healthcare`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/healthcare.json`.

#### 1. Sanidad pública unificada

Point `frente-obrero-unified-public-healthcare` — approved.

**es — Sanidad pública unificada**

Centralizar, unificar y homogeneizar el sistema nacional de salud, y acabar con su externalización y privatización.

**ca — Sanitat pública unificada**

Centralitzar, unificar i homogeneïtzar el sistema nacional de salut, i acabar amb la seva externalització i privatització.

**gl — Sanidade pública unificada**

Centralizar, unificar e homoxeneizar o sistema nacional de saúde, e acabar coa súa externalización e privatización.

**eu — Osasun publiko bateratua**

Osasun sistema nazionala zentralizatzea, bateratzea eta homogeneizatzea, eta haren kanporatzea eta pribatizazioa amaitzea.

**oc — Sanitat publica unificada**

Centralizar, unificar e omogeneïzar eth sistèma nacionau de salut, e acabar damb era sua externalizacion e privatizacion.

**en — Unified public healthcare**

Centralise, unify and standardise the national health system, and end its outsourcing and privatisation.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 42](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=42), segment `page-42`. Exact quote: «Centralizar, unificar y homogeneizar el sistema nacional de salud. Acabar con el proceso de externalización y privatización de la sanidad. Mayor control sobre la actuación de las mutuas y protección de los trabajadores frente a las reclamacio- nes contra estas.»

#### 2. Más atención primaria

Point `frente-obrero-primary-care` — approved.

**es — Más atención primaria**

Crear más centros de atención primaria con los medios necesarios, especialmente en zonas rurales y barrios obreros.

**ca — Més atenció primària**

Crear més centres d'atenció primària amb els mitjans necessaris, especialment en zones rurals i barris obrers.

**gl — Máis atención primaria**

Crear máis centros de atención primaria cos medios necesarios, especialmente en zonas rurais e barrios obreiros.

**eu — Lehen mailako arreta gehiago**

Lehen mailako arretako zentro gehiago sortzea beharrezko baliabideekin, bereziki landa eremuetan eta langile auzoetan.

**oc — Mès atencion primària**

Crear mès centres d'atencion primària damb es mejans de besonh, especiaument en zònes ruraus e barris obrèrs.

**en — More primary care**

Provide more primary care centres with the necessary resources, especially in rural areas and working-class neighbourhoods.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 42](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=42), segment `page-42`. Exact quote: «2. Dotar al sistema nacional de salud de más centros de atención primaria con los re- cursos y medios necesarios, en especial en las zonas rurales y barrios obreros.»

#### 3. Nuevas prestaciones gratuitas

Point `frente-obrero-free-dental-physio-eye-care` — approved.

**es — Nuevas prestaciones gratuitas**

Crear la estructura necesaria para garantizar cuidados y tratamientos bucodentales, fisioterapéuticos y oftalmológicos gratuitos.

**ca — Noves prestacions gratuïtes**

Crear l'estructura necessària per garantir cures i tractaments bucodentals, fisioterapèutics i oftalmològics gratuïts.

**gl — Novas prestacións gratuítas**

Crear a estrutura necesaria para garantir coidados e tratamentos bucodentais, fisioterapéuticos e oftalmolóxicos gratuítos.

**eu — Doako prestazio berriak**

Aho eta hortzetako, fisioterapiako eta oftalmologiako arreta eta tratamenduak doan bermatzeko beharrezko egitura sortzea.

**oc — Naues prestacions gratuïtes**

Crear era estructura de besonh entà garantir suenhs e tractaments bucodentaus, fisioterapeutics e oftalmologics gratuïts.

**en — New free services**

Create the necessary structure to ensure free dental, physiotherapy and ophthalmological care and treatment.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 42](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=42), segment `page-42`. Exact quote: «4. Implantar la estructura adecuada para asegurar el cuidado y tratamiento bucoden- tal, fisioterapéutico y oftalmológico gratuito.»

#### 4. Medicamentos e industria farmacéutica

Point `frente-obrero-prescription-medicines` — approved.

**es — Medicamentos e industria farmacéutica**

Abaratar los medicamentos con receta y tender a su gratuidad en casos de especial necesidad; desarrollar una industria farmacéutica nacional.

**ca — Medicaments i indústria farmacèutica**

Abaratir els medicaments amb recepta i tendir a la gratuïtat en casos d'especial necessitat; desenvolupar una indústria farmacèutica nacional.

**gl — Medicamentos e industria farmacéutica**

Abaratar os medicamentos con receita e tender á súa gratuidade en casos de especial necesidade; desenvolver unha industria farmacéutica nacional.

**eu — Sendagaiak eta industria farmazeutikoa**

Errezetadun sendagaiak merkatzea eta behar bereziko kasuetan doakotasunerantz jotzea; industria farmazeutiko nazionala garatzea.

**oc — Medicaments e indústria farmaceutica**

Abaishar eth prètz des medicaments damb recèpta e ténder ara gratuïtat en casi de besonh especiau; desvolopar ua indústria farmaceutica nacionau.

**en — Medicines and pharmaceutical industry**

Make prescription medicines cheaper and move towards free access in cases of special need; develop a national pharmaceutical industry.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 43](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=43), segment `page-43`. Exact quote: «8. Abaratar el acceso a medicamentos con receta y tender a su gratuidad en casos de especial necesidad. Desarrollar una industria farmacéutica nacional que permita romper con la dependencia de grandes corporaciones privadas.»

### Economía e impuestos

Synthesis `frente-obrero--economy-and-taxes`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/economy-and-taxes.json`.

#### 1. Industria y sectores estratégicos

Point `frente-obrero-strategic-industries` — approved.

**es — Industria y sectores estratégicos**

Reindustrializar España priorizando las industrias estratégicas y los recursos nacionales, con una estrategia independiente de Bruselas, y nacionalizar los sectores estratégicos de la economía.

**ca — Indústria i sectors estratègics**

Reindustrialitzar Espanya prioritzant les indústries estratègiques i els recursos nacionals, amb una estratègia independent de Brussel·les, i nacionalitzar els sectors estratègics de l'economia.

**gl — Industria e sectores estratéxicos**

Reindustrializar España priorizando as industrias estratéxicas e os recursos nacionais, cunha estratexia independente de Bruxelas, e nacionalizar os sectores estratéxicos da economía.

**eu — Industria eta sektore estrategikoak**

Espainia berrindustrializatzea, industria estrategikoak eta baliabide nazionalak lehenetsiz, Bruselarekiko estrategia independentearekin, eta ekonomiaren sektore estrategikoak nazionalizatzea.

**oc — Indústria e sectors estrategics**

Reindustrializar Espanha priorizant es indústries estrategiques e es recorsi nacionaus, damb ua estrategia independenta de Brussèlles, e nacionalizar es sectors estrategics dera economia.

**en — Industry and strategic sectors**

Reindustrialise Spain, prioritising strategic industries and national resources, with a strategy independent of Brussels, and nationalise strategic sectors of the economy.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 13](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=13), segment `page-13`. Exact quote: «1. Reindustrialización del país, priorizando el desarrollo de industrias estratégicas y que exploten los recursos con los que cuenta España. 2. Desarrollar una estrategia independiente de desarrollo industrial, que ponga fin a las imposiciones de Bruselas en beneficio de otras potencias. 3. Nacionalización de los sectores estratégicos de la economía. Fuerte intervención para priorizar los intereses de los españoles.»

#### 2. IRPF según renta

Point `frente-obrero-income-tax` — approved.

**es — IRPF según renta**

Reducir el impuesto sobre la renta a los trabajadores con menos recursos y aumentarlo para las rentas más altas, ampliando los tramos y elevando los tipos.

**ca — IRPF segons renda**

Reduir l'impost sobre la renda als treballadors amb menys recursos i augmentar-lo per a les rendes més altes, ampliant els trams i elevant els tipus.

**gl — IRPF segundo a renda**

Reducir o imposto sobre a renda aos traballadores con menos recursos e aumentalo para as rendas máis altas, ampliando os tramos e elevando os tipos.

**eu — Errentaren araberako zerga**

Baliabide gutxien dituzten langileen errenta zerga jaistea eta errenta altuenentzat igotzea, tarteak zabalduz eta zerga tasak handituz.

**oc — IRPF segontes era renda**

Redusir er impòst sus era renda as trabalhadors damb mens recorsi e aumentar-lo entàs rendes mès nautes, ampliant es trams e pujant es tipes.

**en — Income tax by income level**

Reduce income tax for workers with fewer resources and increase it for the highest incomes by expanding bands and raising rates.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 18](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=18), segment `page-18`. Exact quote: «1. Reducir el impuesto sobre la renta a los trabajadores con menos recursos, a la par que incrementarlo para las rentas más altas con la ampliación de los tramos de renta y aumento de los tipos impositivos.»

#### 3. IVA de productos básicos

Point `frente-obrero-essential-goods-vat` — approved.

**es — IVA de productos básicos**

Reducir la carga del IVA e incorporar progresivamente todas las mercancías de primera necesidad al tipo superreducido.

**ca — IVA de productes bàsics**

Reduir la càrrega de l'IVA i incorporar progressivament totes les mercaderies de primera necessitat al tipus superreduït.

**gl — IVE de produtos básicos**

Reducir a carga do IVE e incorporar progresivamente todas as mercadorías de primeira necesidade ao tipo superreducido.

**eu — Oinarrizko ondasunen BEZa**

BEZaren zama murriztea eta premiazko ondasun guztiak pixkanaka tasa oso murriztuan sartzea.

**oc — IVA de productes basics**

Redusir era carga der IVA e incorporar progressivament totes es mercaderies de prumèra necessitat ath tipe superredusit.

**en — VAT on essential goods**

Reduce the VAT burden and gradually include all essential goods in the super-reduced rate.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 18](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=18), segment `page-18`. Exact quote: «3. Disminuir la carga fiscal del IVA e incorporar de forma progresiva todas las mercan- cías de primera necesidad en el tipo superreducido.»

#### 4. Sucesiones y patrimonio

Point `frente-obrero-inheritance-wealth-tax` — approved.

**es — Sucesiones y patrimonio**

Centralizar los impuestos de sucesiones y patrimonio, suprimir las bonificaciones que benefician sobre todo a los más ricos y eliminar sucesiones para las rentas bajas.

**ca — Successions i patrimoni**

Centralitzar els impostos de successions i patrimoni, suprimir les bonificacions que beneficien sobretot els més rics i eliminar successions per a les rendes baixes.

**gl — Sucesións e patrimonio**

Centralizar os impostos de sucesións e patrimonio, suprimir as bonificacións que benefician sobre todo os máis ricos e eliminar sucesións para as rendas baixas.

**eu — Oinordetzak eta ondarea**

Oinordetza eta ondare zergak zentralizatzea, batez ere aberatsenei mesede egiten dieten hobariak kentzea eta errenta baxuentzako oinordetza zerga ezabatzea.

**oc — Successions e patrimòni**

Centralizar es impòsti de successions e patrimòni, suprimir es bonificacions que beneficien sustot es mès rics e eliminar successions entàs rendes baishes.

**en — Inheritance and wealth taxes**

Centralise inheritance and wealth taxes, remove reliefs mainly benefiting the richest, and abolish inheritance tax for low incomes.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 19](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=19), segment `page-19`. Exact quote: «6. El impuesto de sucesiones y de patrimonio se centralizará y se suprimirán las boni- ficaciones que benefician sobre todo a los más ricos. Eliminación del impuesto de sucesiones para las rentas bajas.»

#### 5. Tierras sin uso y parques solares

Point `frente-obrero-unused-large-estate-land` — approved.

**es — Tierras sin uso y parques solares**

Expropiar tierras sin usar de grandes terratenientes y repartirlas entre agricultores y cooperativas para su aprovechamiento colectivo; prohibir la construcción de parques solares en tierras aptas para el cultivo.

**ca — Terres sense ús i parcs solars**

Expropiar terres sense ús de grans terratinents i repartir-les entre agricultors i cooperatives per aprofitar-les col·lectivament; prohibir la construcció de parcs solars en terres aptes per al conreu.

**gl — Terras sen uso e parques solares**

Expropiar terras sen usar de grandes terratenentes e repartilas entre agricultores e cooperativas para o aproveitamento colectivo; prohibir a construción de parques solares en terras aptas para o cultivo.

**eu — Erabili gabeko lurrak eta eguzki parkeak**

Lurjabe handien erabili gabeko lurrak desjabetzea eta nekazari eta kooperatiben artean banatzea, kolektiboki ustiatzeko; laborantzarako lur egokietan eguzki parkeak eraikitzea debekatzea.

**oc — Tèrres sense usatge e parcs solars**

Expropriar tèrres sense usatge de grani terratinents e repartir-les entre agricultors e cooperatives entar aprofitament collectiu; proïbir era construccion de parcs solars en tèrres aptes entath cultiu.

**en — Unused land and solar farms**

Expropriate large landowners' unused land and distribute it among farmers and cooperatives for collective use; ban construction of solar farms on land suitable for cultivation.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 38](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=38), segment `page-38`. Exact quote: «2. Expropiar las tierras sin usar en propiedad de grandes terratenientes y reparto entre los agricultores y cooperativas para el aprovechamiento colectivo. Prohibición de la construcción de parques solares en tierras aptas para el cultivo.»

### Empleo

Synthesis `frente-obrero--employment`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/employment.json`.

#### 1. Salarios y coste de la vida

Point `frente-obrero-wages-living-costs` — approved.

**es — Salarios y coste de la vida**

Aumentar los salarios de forma general en relación con el coste de la vida.

**ca — Salaris i cost de la vida**

Augmentar els salaris de manera general en relació amb el cost de la vida.

**gl — Salarios e custo da vida**

Aumentar os salarios de forma xeral en relación co custo da vida.

**eu — Soldatak eta bizi kostua**

Soldatak oro har igotzea, bizi kostuaren arabera.

**oc — Salaris e còst dera vida**

Aumentar es salaris de forma generau en relacion damb eth còst dera vida.

**en — Wages and living costs**

Raise wages generally in relation to the cost of living.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 9](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=9), segment `page-9`. Exact quote: «1. Aumento general de los salarios en relación al coste de la vida.»

#### 2. Representación desde diez trabajadores

Point `frente-obrero-worker-representation` — approved.

**es — Representación desde diez trabajadores**

Implantar representación obligatoria de los trabajadores en todas las empresas con diez trabajadores o más, sin excepciones, para fortalecer la negociación colectiva.

**ca — Representació des de deu treballadors**

Implantar representació obligatòria dels treballadors en totes les empreses amb deu treballadors o més, sense excepcions, per enfortir la negociació col·lectiva.

**gl — Representación desde dez traballadores**

Implantar representación obrigatoria dos traballadores en todas as empresas con dez traballadores ou máis, sen excepcións, para fortalecer a negociación colectiva.

**eu — Ordezkaritza hamar langiletik aurrera**

Hamar langile edo gehiago dituzten enpresa guztietan langileen nahitaezko ordezkaritza ezartzea, salbuespenik gabe, negoziazio kolektiboa indartzeko.

**oc — Representacion a compdar de dètz trabalhadors**

Implantar representacion obligatòria des trabalhadors en totes es empreses damb dètz trabalhadors o mès, sense excepcions, entà enfortir era negociacion collectiva.

**en — Representation from ten workers**

Require worker representation in every company with ten or more workers, without exceptions, to strengthen collective bargaining.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 9](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=9), segment `page-9`. Exact quote: «2. Fortalecer la negociación colectiva a través de la implementación de un sistema obligatorio de representación de los trabajadores en todos las empresas con diez trabajadores o más, sin excepciones.»

#### 3. Temporalidad y ETT

Point `frente-obrero-temporary-work-agencies` — approved.

**es — Temporalidad y ETT**

Restringir las condiciones que permiten contratos temporales o fijos-discontinuos y prohibir las empresas de trabajo temporal.

**ca — Temporalitat i ETT**

Restringir les condicions que permeten contractes temporals o fixos discontinus i prohibir les empreses de treball temporal.

**gl — Temporalidade e ETT**

Restrinxir as condicións que permiten contratos temporais ou fixos descontinuos e prohibir as empresas de traballo temporal.

**eu — Aldi baterako lana eta lan enpresak**

Aldi baterako edo aldizkako kontratu finkoak erabiltzeko baldintzak murriztea eta aldi baterako laneko enpresak debekatzea.

**oc — Temporalitat e ETT**

Restrénher es condicions que permeten contractes temporaus o fixes discontinus e proïbir es empreses de trabalh temporau.

**en — Temporary work and agencies**

Restrict the conditions permitting temporary or permanent intermittent contracts and ban temporary employment agencies.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 9](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=9), segment `page-9`. Exact quote: «4. Fomentar la lucha contra la temporalidad. Restricción de las condiciones que per - miten a las empresas acogerse a contratos temporales o fijos-discontinuos. Prohibi- ción de las empresas de trabajo temporal (ETTS).»

#### 4. Cotizaciones de autónomos

Point `frente-obrero-self-employed-contributions` — approved.

**es — Cotizaciones de autónomos**

Eliminar la cuota de los autónomos que no lleguen al SMI, reducir las cuotas, establecer una bonificación total por baja y garantizar su jubilación.

**ca — Cotitzacions d'autònoms**

Eliminar la quota dels autònoms que no arribin al SMI, reduir les quotes, establir una bonificació total per baixa i garantir-ne la jubilació.

**gl — Cotizacións de autónomos**

Eliminar a cota dos autónomos que non cheguen ao SMI, reducir as cotas, establecer unha bonificación total por baixa e garantir a súa xubilación.

**eu — Autonomoen kotizazioak**

SMIra iristen ez diren autonomoen kuota kentzea, kuotak murriztea, bajagatik hobari osoa ezartzea eta erretiroa bermatzea.

**oc — Cotizacions d'autonòms**

Eliminar era quòta des autonòms que non arriben ath SMI, redusir es quòtes, establir ua bonificacion totau per baisha e garantir era sua jubilacion.

**en — Self-employed contributions**

Abolish contributions for self-employed people below the SMI minimum wage, reduce contributions, introduce full relief during leave and guarantee retirement.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 9](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=9), segment `page-9`. Exact quote: «5. Eliminación de la cuota para los autónomos que no llegan al SMI e implementación de una bonificación total por baja. Cuotas más reducidas para los autónomos. Ga - rantizar la jubilación a los autónomos.»

### Pensiones y protección social

Synthesis `frente-obrero--pensions-and-social-protection`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/pensions-and-social-protection.json`.

#### 1. Edad de jubilación

Point `frente-obrero-retirement-age` — approved.

**es — Edad de jubilación**

Revertir el incremento de la edad de jubilación y establecer una edad de retiro adecuada al puesto desempeñado.

**ca — Edat de jubilació**

Revertir l'increment de l'edat de jubilació i establir una edat de retir adequada al lloc exercit.

**gl — Idade de xubilación**

Reverter o incremento da idade de xubilación e establecer unha idade de retiro adecuada ao posto desempeñado.

**eu — Erretiro adina**

Erretiro adinaren igoera atzera botatzea eta egindako lanpostuari egokitutako erretiro adina ezartzea.

**oc — Edat de jubilacion**

Revertir er increment dera edat de jubilacion e establir ua edat de retirada adequada ath pòst exercit.

**en — Retirement age**

Reverse the increase in retirement age and set a retirement age appropriate to the job performed.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 48](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=48), segment `page-48`. Exact quote: «1. Revertir el incremento de la edad de jubilación y establecer una edad de retiro ade- cuada al puesto laboral desempeñado.»

#### 2. Pensiones mínimas y no contributivas

Point `frente-obrero-minimum-pensions` — approved.

**es — Pensiones mínimas y no contributivas**

Incrementar las pensiones mínimas y no contributivas para asegurar recursos suficientes a todos los pensionistas.

**ca — Pensions mínimes i no contributives**

Incrementar les pensions mínimes i no contributives per assegurar recursos suficients a tots els pensionistes.

**gl — Pensións mínimas e non contributivas**

Incrementar as pensións mínimas e non contributivas para asegurar recursos suficientes a todos os pensionistas.

**eu — Gutxieneko eta kotizazio gabeko pentsioak**

Gutxieneko eta kotizazio gabeko pentsioak handitzea, pentsiodun guztiei baliabide nahikoak bermatzeko.

**oc — Pensions minimes e non contributives**

Aumentar es pensions minimes e non contributives entà assegurar recorsi sufisents a toti es pensionistes.

**en — Minimum and non-contributory pensions**

Increase minimum and non-contributory pensions to ensure sufficient resources for all pensioners.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 49](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=49), segment `page-49`. Exact quote: «2. Incrementar las pensiones no contributivas y mínimas asegurando una correcta su - ficiencia de recursos de todos los pensionistas.»

#### 3. Cálculo con los mejores años

Point `frente-obrero-best-contribution-years` — approved.

**es — Cálculo con los mejores años**

Calcular la pensión mediante la media de los mejores años cotizados, evitando penalizar los despidos o menores salarios al final de la vida laboral.

**ca — Càlcul amb els millors anys**

Calcular la pensió amb la mitjana dels millors anys cotitzats, evitant penalitzar els acomiadaments o salaris més baixos al final de la vida laboral.

**gl — Cálculo cos mellores anos**

Calcular a pensión coa media dos mellores anos cotizados, evitando penalizar os despedimentos ou menores salarios ao final da vida laboral.

**eu — Urte onenekin kalkulatzea**

Pentsioa kotizatutako urte onenen batezbestekoarekin kalkulatzea, lan bizitzaren amaierako kaleratzeek edo soldata baxuagoek kalterik ez eragiteko.

**oc — Calcul damb es milhors ans**

Calcular era pension damb era mejana des milhors ans cotizats, evitant penalizar es acomiadaments o salaris mès baishi ara fin dera vida laborau.

**en — Calculation using the best years**

Calculate pensions using the average of the best contribution years, avoiding penalties for dismissal or lower wages towards the end of working life.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 49](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=49), segment `page-49`. Exact quote: «3. Introducir el cálculo de la pensión mediante la media de los mejores años cotizados, para evitar que los trabajadores que han sido despedidos o han obtenido un salario menor en los últimos años de su vida laboral obtengan una pensión menor.»

#### 4. Guarderías públicas gratuitas

Point `frente-obrero-free-public-nurseries` — approved.

**es — Guarderías públicas gratuitas**

Construir guarderías y jardines de infancia públicos y gratuitos para compatibilizar trabajo y maternidad.

**ca — Escoles bressol públiques gratuïtes**

Construir escoles bressol i jardins d'infància públics i gratuïts per compatibilitzar feina i maternitat.

**gl — Escolas infantís públicas gratuítas**

Construír gardarías e xardíns de infancia públicos e gratuítos para compatibilizar traballo e maternidade.

**eu — Doako haur eskola publikoak**

Haurtzaindegi eta haur eskola publiko eta doakoak eraikitzea, lana eta amatasuna uztartzeko.

**oc — Escòles mairaus publiques gratuïtes**

Bastir escòles mairaus e jardins d'enfància publics e gratuïts entà compatibilizar trabalh e maternitat.

**en — Free public nurseries**

Build free public nurseries and kindergartens to make work and motherhood compatible.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 34](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=34), segment `page-34`. Exact quote: «2. Se construirán guarderías y jardines de infancia públicos y gratuitos para facilitar la com- patibilidad del trabajo y la maternidad.»

#### 5. Permisos y conciliación

Point `frente-obrero-parental-leave-flexibility` — approved.

**es — Permisos y conciliación**

Alargar las bajas por paternidad y maternidad y obligar a las empresas a ofrecer flexibilidad parcial en teletrabajo, reducción de jornada y horarios para cuidar a los hijos.

**ca — Permisos i conciliació**

Allargar les baixes per paternitat i maternitat i obligar les empreses a oferir flexibilitat parcial en teletreball, reducció de jornada i horaris per cuidar els fills.

**gl — Permisos e conciliación**

Alongar as baixas por paternidade e maternidade e obrigar as empresas a ofrecer flexibilidade parcial en teletraballo, redución de xornada e horarios para coidar os fillos.

**eu — Baimenak eta kontziliazioa**

Aitatasun eta amatasun bajak luzatzea eta enpresak telelanean, lanaldi murrizketan eta ordutegietan malgutasun partziala eskaintzera behartzea, seme-alabak zaintzeko.

**oc — Permisi e conciliacion**

Alargar es baishes per paternitat e maternitat e obligar es empreses a auferir flexibilitat parciau en teletrabalh, reduccion de jornada e oraris entà suenhar es hilhs.

**en — Leave and work-family balance**

Extend paternity and maternity leave and require companies to offer partial flexibility in remote work, reduced hours and schedules for childcare.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 35](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=35), segment `page-35`. Exact quote: «3. Se alargarán las bajas por paternidad y maternidad y se obligará a las empresas a ser flexibles parcialmente en cuanto al teletrabajo, reducción de jornada y modificación de horarios, para poder conciliar trabajo y el cuidado de los hijos.»

### Medioambiente y energía

Synthesis `frente-obrero--environment-and-energy`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/environment-and-energy.json`.

#### 1. Fin de la «transición ecológica»

Point `frente-obrero-end-ecological-transition` — approved.

**es — Fin de la «transición ecológica»**

Poner fin a la llamada «transición ecológica», que el programa vincula al desmantelamiento productivo y a las restricciones de la Unión Europea.

**ca — Fi de la «transició ecològica»**

Posar fi a l'anomenada «transició ecològica», que el programa vincula al desmantellament productiu i a les restriccions de la Unió Europea.

**gl — Fin da «transición ecolóxica»**

Poñer fin á chamada «transición ecolóxica», que o programa vincula ao desmantelamento produtivo e ás restricións da Unión Europea.

**eu — «Trantsizio ekologikoa» amaitzea**

«Trantsizio ekologikoa» deitutakoa amaitzea; programak ekoizpen gaitasuna desegitearekin eta Europar Batasunaren murrizketekin lotzen du.

**oc — Fin dera «transicion ecologica»**

Meter fin ara nomentada «transicion ecologica», qu'eth programa restaque ath desmantelament productiu e as restriccions dera Union Europèa.

**en — End the «ecological transition»**

End the so-called «ecological transition», which the programme links to dismantling productive capacity and European Union restrictions.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 15](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=15), segment `page-15`. Exact quote: «1. Poner fin a la llamada “transición ecológica”, la cual permite el desmantelamiento de la capacidad productiva del país y el sometimiento a las políticas restrictivas de la Unión Europea.»

#### 2. Regulación de luz y combustibles

Point `frente-obrero-energy-price-regulation` — approved.

**es — Regulación de luz y combustibles**

Regular inmediatamente la factura de la luz y de los combustibles.

**ca — Regulació de llum i combustibles**

Regular immediatament la factura de la llum i dels combustibles.

**gl — Regulación de luz e combustibles**

Regular inmediatamente a factura da luz e dos combustibles.

**eu — Argindarraren eta erregaien erregulazioa**

Argindarraren eta erregaien fakturak berehala arautzea.

**oc — Regulacion dera lum e des combustibles**

Regular immediatament era factura dera lum e des combustibles.

**en — Electricity and fuel regulation**

Immediately regulate electricity and fuel bills.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 16](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=16), segment `page-16`. Exact quote: «2. La regulación inmediata de la factura de la luz y de los combustibles. Las familias españolas no pueden seguir pagando los precios abusivos impuestos por empresas que especulan con la energía, así como con el precio de los combustibles, inflados por los costosos impuestos que los regulan.»

#### 3. Nuclear con renovables complementarias

Point `frente-obrero-nuclear-and-renewables` — approved.

**es — Nuclear con renovables complementarias**

Ampliar y modernizar el parque nuclear, poner en marcha plantas y explotar el uranio nacional; apoyar las renovables como complemento e invertir en su investigación y desarrollo.

**ca — Nuclear amb renovables complementàries**

Ampliar i modernitzar el parc nuclear, posar en marxa plantes i explotar l'urani nacional; donar suport a les renovables com a complement i invertir en la seva recerca i desenvolupament.

**gl — Nuclear con renovables complementarias**

Ampliar e modernizar o parque nuclear, poñer en marcha plantas e explotar o uranio nacional; apoiar as renovables como complemento e investir na súa investigación e desenvolvemento.

**eu — Nuklearra eta berriztagarri osagarriak**

Parke nuklearra handitu eta modernizatzea, zentralak martxan jartzea eta uranio nazionala ustiatzea; berriztagarriak osagarri gisa babestea eta haien ikerketan eta garapenean inbertitzea.

**oc — Nucleara damb renovables complementàries**

Ampliar e modernizar eth parc nuclear, meter en marcha plantes e explotar er urani nacionau; sostier es renovables coma complement e invertir ena sua recèrca e desvolopament.

**en — Nuclear with complementary renewables**

Expand and modernise the nuclear fleet, bring plants into operation and exploit domestic uranium; support renewables as a complement and invest in their research and development.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 16](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=16), segment `page-16`. Exact quote: «5. Apuesta por la energía nuclear, como fuente de energía fiable, estable y controla - ble. Aumentar la inversión para la puesta en marcha y modernización de las plantas nucleares del país. Ampliación del parque nuclear e igualmente se explotarán los recursos nacionales de uranio. 6. Apoyar la producción basada en fuentes de energías renovables como complemen- to a la nuclear. Aumentar la inversión en la investigación y desarrollo de las nuevas y también existentes tecnologías para la producción con fuentes renovables.»

#### 4. Biodiversidad y especies amenazadas

Point `frente-obrero-biodiversity-recovery` — approved.

**es — Biodiversidad y especies amenazadas**

Elaborar planes para recuperar la biodiversidad y el patrimonio natural, proteger especies en peligro y prevenir y reducir el impacto de las invasoras.

**ca — Biodiversitat i espècies amenaçades**

Elaborar plans per recuperar la biodiversitat i el patrimoni natural, protegir espècies en perill i prevenir i reduir l'impacte de les invasores.

**gl — Biodiversidade e especies ameazadas**

Elaborar plans para recuperar a biodiversidade e o patrimonio natural, protexer especies en perigo e previr e reducir o impacto das invasoras.

**eu — Biodibertsitatea eta espezie mehatxatuak**

Biodibertsitatea eta natura ondarea berreskuratzeko planak egitea, arriskuan dauden espezieak babestea eta inbaditzaileen eragina prebenitzea eta murriztea.

**oc — Biodiversitat e espècies menaçades**

Elaborar plans entà recuperar era biodiversitat e eth patrimòni naturau, protegir espècies en perilh e previer e redusir er impacte des invasores.

**en — Biodiversity and threatened species**

Prepare plans to restore biodiversity and natural heritage, protect endangered species and prevent and reduce invasive species' impact.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 38](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=38), segment `page-38`. Exact quote: «9. Elaborar planes de recuperación de la biodiversidad y del patrimonio natural. Pro - teger incansablemente especies en peligro de extinción y luchar por prevenir y re - ducir el impacto de las especies invasoras.»

### Instituciones y derechos

Synthesis `frente-obrero--institutions-and-rights`, revision 2, partial. Editorial path: `content/editorial/syntheses/frente-obrero/institutions-and-rights.json`.

#### 1. Salida de la UE y la OTAN

Point `frente-obrero-eu-nato-withdrawal` — approved.

**es — Salida de la UE y la OTAN**

Salir de la Unión Europea y salir inmediatamente de la OTAN, reforzando el ejército español.

**ca — Sortida de la UE i l'OTAN**

Sortir de la Unió Europea i sortir immediatament de l'OTAN, reforçant l'exèrcit espanyol.

**gl — Saída da UE e da OTAN**

Saír da Unión Europea e saír inmediatamente da OTAN, reforzando o exército español.

**eu — EBtik eta NATOtik irtetea**

Europar Batasunetik irtetea eta NATOtik berehala irtetea, Espainiako armada indartuz.

**oc — Gessuda dera UE e dera OTAN**

Gésser dera Union Europèa e gésser immediatament dera OTAN, en tot refortir er exercit espanhòu.

**en — Withdrawal from the EU and NATO**

Leave the European Union and immediately leave NATO, strengthening the Spanish army.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 11](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=11), segment `page-11`. Exact quote: «1. Salida de la Unión Europea para recuperar nuestra soberanía nacional. 2. Salida inmediata de la OTAN y reforzamiento de nuestro ejército.»

#### 2. Discriminación positiva y cupos

Point `frente-obrero-positive-discrimination-quotas` — approved.

**es — Discriminación positiva y cupos**

Derogar parcial o totalmente todas las leyes basadas en la discriminación positiva y suprimir los cupos.

**ca — Discriminació positiva i quotes**

Derogar parcialment o totalment totes les lleis basades en la discriminació positiva i suprimir les quotes.

**gl — Discriminación positiva e cotas**

Derrogar parcial ou totalmente todas as leis baseadas na discriminación positiva e suprimir as cotas.

**eu — Diskriminazio positiboa eta kuotak**

Diskriminazio positiboan oinarritutako lege guztiak partzialki edo osorik indargabetzea eta kuotak ezabatzea.

**oc — Discriminacion positiva e quòtes**

Derogar parciaument o totaument totes es leis basades ena discriminacion positiva e suprimir es quòtes.

**en — Positive discrimination and quotas**

Partially or fully repeal all laws based on positive discrimination and abolish quotas.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 32](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=32), segment `page-32`. Exact quote: «1. Derogación parcial o total de todas las leyes basadas en la discriminación positiva. Supresión de los cupos.»

#### 3. Derogación de la Ley Trans

Point `frente-obrero-trans-law-repeal` — approved.

**es — Derogación de la Ley Trans**

Derogar la Ley Trans.

**ca — Derogació de la Ley Trans**

Derogar la Ley Trans.

**gl — Derrogación da Ley Trans**

Derrogar a Ley Trans.

**eu — Ley Trans indargabetzea**

Ley Trans indargabetzea.

**oc — Derogacion dera Ley Trans**

Derogar era Ley Trans.

**en — Repeal of the Ley Trans**

Repeal the Ley Trans.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 32](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=32), segment `page-32`. Exact quote: «2. Derogación de la Ley Trans. Es necesario proteger a los niños y adolescentes del adoctrinamiento queer, que solo crea y agrava problemas.»

#### 4. Supresión del Ministerio de Igualdad

Point `frente-obrero-equality-ministry` — approved.

**es — Supresión del Ministerio de Igualdad**

Suprimir el Ministerio de Igualdad y destinar íntegramente su presupuesto a cuestiones sociales.

**ca — Supressió del Ministerio de Igualdad**

Suprimir el Ministerio de Igualdad i destinar íntegrament el seu pressupost a qüestions socials.

**gl — Supresión do Ministerio de Igualdad**

Suprimir o Ministerio de Igualdad e destinar integramente o seu orzamento a cuestións sociais.

**eu — Ministerio de Igualdad ezabatzea**

Ministerio de Igualdad ezabatzea eta haren aurrekontu osoa gizarte gaietara bideratzea.

**oc — Supression deth Ministerio de Igualdad**

Suprimir eth Ministerio de Igualdad e destinar integraument eth sòn pressupòst a qüestions sociaus.

**en — Abolition of the Ministerio de Igualdad**

Abolish the Ministerio de Igualdad and allocate its entire budget to social matters.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 32](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=32), segment `page-32`. Exact quote: «3. Supresión del Ministerio de Igualdad. Es un gasto superfluo que, lejos de repercutir en el bienestar de la mujer, va en contra de la misma, llegando incluso a negar la existencia material, biológica, de la mujer. El presupuesto del ministerio será desti- nado en su totalidad a cuestiones sociales.»

#### 5. Expulsiones y regularización

Point `frente-obrero-immigration-expulsions` — approved.

**es — Expulsiones y regularización**

Expulsar inmediatamente a inmigrantes que delincan reiteradamente o estén en situación irregular; impedir su regularización si intentaron entrar ilegalmente y revisar los permisos obtenidos en los últimos años por quienes entraron ilegalmente. El programa señala que será necesaria una nueva Constitución para aplicar estas medidas.

**ca — Expulsions i regularització**

Expulsar immediatament els immigrants que delinqueixin reiteradament o estiguin en situació irregular; impedir-ne la regularització si van intentar entrar il·legalment i revisar els permisos obtinguts els darrers anys pels qui van entrar il·legalment. El programa assenyala que caldrà una nova Constitució per aplicar aquestes mesures.

**gl — Expulsións e regularización**

Expulsar inmediatamente os inmigrantes que delincan reiteradamente ou estean en situación irregular; impedir a súa regularización se intentaron entrar ilegalmente e revisar os permisos obtidos nos últimos anos por quen entrou ilegalmente. O programa sinala que será necesaria unha nova Constitución para aplicar estas medidas.

**eu — Kanporaketak eta erregularizazioa**

Behin eta berriz delituak egiten dituzten edo egoera irregularrean dauden etorkinak berehala kanporatzea; legez kanpo sartzen saiatu badira erregularizazioa eragoztea eta legez kanpo sartu zirenen azken urteetako baimenak berrikustea. Programak dio Konstituzio berri bat beharko dela neurri horiek aplikatzeko.

**oc — Expulsions e regularizacion**

Expulsar immediatament es immigrants que delinquisquen reiteradament o siguen en situacion irregulara; impedir era sua regularizacion s'ensagèren d'entrar illegaument e revisar es permisi obtengudi es darrèri ans pes que i entrèren illegaument. Eth programa indique que calerà ua naua Constitucion entà aplicar aguestes mesures.

**en — Expulsions and regularisation**

Immediately expel immigrants who repeatedly offend or are in an irregular situation; bar regularisation if they attempted illegal entry and review permits obtained in recent years by those who entered illegally. The programme states that a new Constitution will be required to implement these measures.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 53](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=53), segment `page-53`. Exact quote: «Por todo esto, proponemos una serie de medidas que deben ser de inmediato cumpli- miento. Siendo conscientes de que habrá que tener una nueva constitución para poder llevarlas a cabo:»
- [frente-obrero-2026-7b9f423f2c1a, physical page 53](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=53), segment `page-53`. Exact quote: «3. Expulsión inmediata de todos aquellos inmigrantes que delinquen de forma reite - rada o que están de forma irregular en el país. Imposibilidad de regularse si han intentado entrar de forma ilegal. Revisión de los permisos de residencia a aquellos que hayan entrado de forma ilegal y lo hayan conseguido en los últimos años.»

#### 6. Nacionalidad y revisión de concesiones

Point `frente-obrero-nationality-review` — approved.

**es — Nacionalidad y revisión de concesiones**

Suspender la concesión de nacionalidades hasta revisar exhaustivamente las otorgadas en los últimos veinte años y elevar los requisitos futuros, primando el Ius Sanguinis y limitando las excepciones a casos meritorios y anecdóticos. El programa señala que será necesaria una nueva Constitución para aplicar estas medidas.

**ca — Nacionalitat i revisió de concessions**

Suspendre la concessió de nacionalitats fins a revisar exhaustivament les atorgades els darrers vint anys i elevar els requisits futurs, prioritzant el Ius Sanguinis i limitant les excepcions a casos meritoris i anecdòtics. El programa assenyala que caldrà una nova Constitució per aplicar aquestes mesures.

**gl — Nacionalidade e revisión de concesións**

Suspender a concesión de nacionalidades ata revisar exhaustivamente as outorgadas nos últimos vinte anos e elevar os requisitos futuros, primando o Ius Sanguinis e limitando as excepcións a casos meritorios e anecdóticos. O programa sinala que será necesaria unha nova Constitución para aplicar estas medidas.

**eu — Nazionalitatea eta emakiden berrikuspena**

Nazionalitateen emakida etetea azken hogei urteetan emandakoak sakon berrikusi arte, eta etorkizuneko baldintzak zorroztea, Ius Sanguinis lehenetsiz eta salbuespenak merezimenduzko kasu bakanetara mugatuz. Programak dio Konstituzio berri bat beharko dela neurri horiek aplikatzeko.

**oc — Nacionalitat e revision de concessions**

Suspéner era concession de nacionalitats enquia revisar exaustivament es autrejades es darrèri vint ans e aumentar es requisits futurs, priorizant eth Ius Sanguinis e limitant es excepcions a casi meritoris e anecdòtics. Eth programa indique que calerà ua naua Constitucion entà aplicar aguestes mesures.

**en — Nationality grants and review**

Suspend nationality grants until an exhaustive review of those granted in the last twenty years, and raise future requirements, prioritising Ius Sanguinis and limiting exceptions to meritorious, exceptional cases. The programme states that a new Constitution will be required to implement these measures.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 53](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=53), segment `page-53`. Exact quote: «Por todo esto, proponemos una serie de medidas que deben ser de inmediato cumpli- miento. Siendo conscientes de que habrá que tener una nueva constitución para poder llevarlas a cabo:»
- [frente-obrero-2026-7b9f423f2c1a, physical page 53](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=53), segment `page-53`. Exact quote: «6. Cese de entrega de nacionalidades hasta que se pueda realizar una revisión ex - haustiva de las que se han entregado en los últimos veinte años. Elevación de las condiciones para la obtención futura de la nacionalidad, primando de verdad el Ius Sanguinis. La entrega de la nacionalidad a personas que no cumplan este requisito deben ser meritorias de ello, siendo algo anecdótico y no cientos de miles al año como pasa en la actualidad.»

#### 7. Competencias y régimen fiscal autonómicos

Point `frente-obrero-regional-powers` — approved.

**es — Competencias y régimen fiscal autonómicos**

Igualar las competencias y el régimen fiscal de todas las comunidades autónomas y centralizar sanidad, educación y servicios de emergencia.

**ca — Competències i règim fiscal autonòmics**

Igualar les competències i el règim fiscal de totes les comunitats autònomes i centralitzar sanitat, educació i serveis d'emergència.

**gl — Competencias e réxime fiscal autonómicos**

Igualar as competencias e o réxime fiscal de todas as comunidades autónomas e centralizar sanidade, educación e servizos de emerxencia.

**eu — Autonomien eskumenak eta zerga araubidea**

Autonomia erkidego guztien eskumenak eta zerga araubidea berdintzea, eta osasuna, hezkuntza eta larrialdi zerbitzuak zentralizatzea.

**oc — Competéncies e regim fiscau autonomics**

Igualar es competéncies e eth regim fiscau de totes es comunitats autonòmes e centralizar sanitat, educacion e servicis d'emergéncia.

**en — Regional powers and tax systems**

Equalise powers and tax systems across all autonomous communities and centralise healthcare, education and emergency services.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 56](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=56), segment `page-56`. Exact quote: «1. Implantar medidas para que todas las Comunidades Autónomas tengan las mismas competencias y el mismo régimen fiscal. Se acabaron las desigualdades entre regiones. 2. Centralizar determinadas competencias como sanidad, educación y los servicios de emergencia.»

#### 8. Plataformas y medios públicos

Point `frente-obrero-platforms-public-media` — approved.

**es — Plataformas y medios públicos**

Establecer control estatal sobre las grandes plataformas digitales para evitar privilegios entre discursos o sesgos informativos, y garantizar medios públicos objetivos, neutrales e independientes del gobierno.

**ca — Plataformes i mitjans públics**

Establir control estatal sobre les grans plataformes digitals per evitar privilegis entre discursos o biaixos informatius, i garantir mitjans públics objectius, neutrals i independents del govern.

**gl — Plataformas e medios públicos**

Establecer control estatal sobre as grandes plataformas dixitais para evitar privilexios entre discursos ou nesgos informativos, e garantir medios públicos obxectivos, neutrais e independentes do goberno.

**eu — Plataformak eta hedabide publikoak**

Plataforma digital handien gaineko estatu kontrola ezartzea, diskurtsoen arteko pribilegioak edo informazio joerak saihesteko, eta gobernuarekiko independenteak diren hedabide publiko objektibo eta neutralak bermatzea.

**oc — Plataformes e mejans publics**

Establir contròtle estatau sus es granes plataformes digitaus entà evitar privilègis entre discorsi o biaishi informatius, e garantir mejans publics objectius, neutraus e independents deth govèrn.

**en — Platforms and public media**

Establish state control over major digital platforms to prevent preferential treatment of viewpoints or information bias, and ensure objective, neutral public media independent of government.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 40](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=40), segment `page-40`. Exact quote: «2. Desarrollo de una política de control del Estado sobre las grandes plataformas digitales, que garanticen que no se privilegian unos discursos de opinión sobre otros, o un sesgo informativo determinado. 3. Garantizar la objetividad y la neutralidad en medios de comunicación públicos, que de- ben tener una independencia real respecto al gobierno de turno.»

#### 9. Medidas sobre el islam

Point `frente-obrero-islam-related-measures` — approved.

**es — Medidas sobre el islam**

Expulsar a radicales islámicos y estructuras religiosas que actúen como lobby de países extranjeros; sacar el islam de la escuela pública y suprimir las subvenciones a cualquier actividad islámica; prohibir el hiyab en lugares y puestos de trabajo públicos y ayudar a las mujeres amenazadas por querer dejar la vestimenta islámica. El programa señala que será necesaria una nueva Constitución para aplicar estas medidas.

**ca — Mesures sobre l'islam**

Expulsar radicals islàmics i estructures religioses que actuïn com a lobby de països estrangers; treure l'islam de l'escola pública i suprimir les subvencions a qualsevol activitat islàmica; prohibir el hijab en llocs i llocs de treball públics i ajudar les dones amenaçades per voler deixar la vestimenta islàmica. El programa assenyala que caldrà una nova Constitució per aplicar aquestes mesures.

**gl — Medidas sobre o islam**

Expulsar os radicais islámicos e as estruturas relixiosas que actúen como lobby de países estranxeiros; sacar o islam da escola pública e suprimir as subvencións a calquera actividade islámica; prohibir o hiyab en lugares e postos de traballo públicos e axudar as mulleres ameazadas por querer deixar a vestimenta islámica. O programa sinala que será necesaria unha nova Constitución para aplicar estas medidas.

**eu — Islamari buruzko neurriak**

Erradikal islamikoak eta atzerriko herrialdeen lobby gisa jarduten duten erlijio egiturak kanporatzea; islama eskola publikoetatik kentzea eta jarduera islamikoentzako dirulaguntza guztiak ezabatzea; hijaba toki eta lanpostu publikoetan debekatzea eta jantzi islamikoak utzi nahi izateagatik mehatxatutako emakumeei laguntzea. Programak dio Konstituzio berri bat beharko dela neurri horiek aplikatzeko.

**oc — Mesures sus er islam**

Expulsar es radicaus islamics e es estructures religioses que actuen coma lobby de païsi estrangèrs; trèir er islam dera escòla publica e suprimir es subvencions a quinsevolh activitat islamica; proïbir eth hijab en lòcs e pòsts de trabalh publics e ajudar es hemnes menaçades per voler deishar era vestimenta islamica. Eth programa indique que calerà ua naua Constitucion entà aplicar aguestes mesures.

**en — Measures concerning Islam**

Expel Islamic radicals and religious structures acting as lobbies for foreign countries; remove Islam from public schools and end subsidies for any Islamic activity; ban the hijab in public places and public jobs, and help women threatened for wanting to stop wearing Islamic clothing. The programme states that a new Constitution will be required to implement these measures.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 53](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=53), segment `page-53`. Exact quote: «Por todo esto, proponemos una serie de medidas que deben ser de inmediato cumpli- miento. Siendo conscientes de que habrá que tener una nueva constitución para poder llevarlas a cabo:»
- [frente-obrero-2026-7b9f423f2c1a, physical page 53](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=53), segment `page-53`. Exact quote: «4. Expulsión de los radicales islámicos y de las estructuras religiosas que actúan como lobby para países extranjeros. El islam debe ser sacado de las escuelas públicas y no se debe subvencionar ninguna actividad islámica. Prohibición del hijab en luga- res y puestos de trabajo públicos. Además, se ofrecerán ayudas a las mujeres que quieran dejar el uso de la vestimenta islámica y se vean amenazadas en el proceso.»

#### 10. Proceso constituyente y república

Point `frente-obrero-constituent-process-republic` — approved.

**es — Proceso constituyente y república**

Impulsar un proceso constituyente para acabar con el régimen actual. Defender una república encaminada al socialismo, dejando la nueva forma de Estado para una decisión futura.

**ca — Procés constituent i república**

Impulsar un procés constituent per acabar amb el règim actual. Defensar una república encaminada al socialisme, deixant la nova forma d'Estat per a una decisió futura.

**gl — Proceso constituínte e república**

Impulsar un proceso constituínte para acabar co réxime actual. Defender unha república encamiñada ao socialismo, deixando a nova forma de Estado para unha decisión futura.

**eu — Prozesu konstituziogilea eta errepublika**

Egungo erregimena amaitzeko prozesu konstituziogilea bultzatzea. Sozialismorantz bideratutako errepublika defendatzea, Estatuaren forma berria etorkizuneko erabaki baterako utziz.

**oc — Procès constituent e republica**

Impulsar un procès constituent entà acabar damb eth regim actuau. Deféner ua republica encaminada tath socialisme, deishant era naua forma d'Estat entà ua decision futura.

**en — Constituent process and republic**

Promote a constituent process to end the current regime. Advocate a republic oriented towards socialism, leaving the new form of State for a future decision.

Evidence:

- [frente-obrero-2026-7b9f423f2c1a, physical page 6](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=6), segment `page-6`. Exact quote: «Nuestro objetivo sigue siendo acabar con el régimen actual y dar solución a los gran - des problemas que afectan a nuestro país. Por ello apostamos por la realización de un proceso constituyente. No hay solución posible dentro de los marcos actuales.»
- [frente-obrero-2026-7b9f423f2c1a, physical page 56](../sources/frente-obrero-2026-7b9f423f2c1a/original.pdf#page=56), segment `page-56`. Exact quote: «Nosotros somos contrarios a la monarquía, somos partidarios de una República encaminada al socialismo, pero hasta que llegue el momento de decidir la nueva forma de Estado pensa- mos que es necesario igualar las competencias y regímenes fiscales de todas las autonomías.»

## Final independent QA and local verification

Independent QA completed on 21 November 2026 at 00:37:58 UTC. Source provenance passed with the political-programme/current-campaign-adoption limitation. QA verified all 41 draft points in all six languages (246 title/body pairs), all 45 quotations against a fresh parse of the original, and all 22 cited pages by independent rendering. The reviewed selection and source hashes are recorded in the archived QA report and hash manifests. No concrete fidelity or contract failure remains. The education income qualifier, undefined source terms and exact multilingual human agreement remain pending editorial gates; semantic review does not certify native or specialist fluency.

QA verified the existing generator and schema-v3 allowlists, eight empty pending entries and exclusion of the draft-only source. All 183 previously public proposals, ordering and existing synthesis records are unchanged against the initially clean Git HEAD baseline. Builder separately checked that the final repository draft JSON equals the reviewed staged JSON after formatting. The solar-land point expressly restricts construction in every language; it does not prohibit continued operation of existing parks.

Local checks passed with Node 24.22.3 and npm 10.8.2:

- `npm run content:generate` and `npm run content:check`: successful; existing provincial projection remained unchanged.
- `npm run check`: successful type, lint, formatting, documentation, content and bounded source-credential checks.
- `npm run test`: all 129 deterministic tests passed.
- `npm run build`: successful; the portal checker verified 390 prerendered catalogue pages, with Frente Obrero areas still pending and no draft proposals exposed. No application server was started.
- `git diff --check`: successful. No unrelated pre-existing edits were present.

The archived `qa/final-review.md` records the independent checks, the resolved physical-page locator correction, exact reviewed file/point hashes and remaining editorial questions. Each role's metrics retains unavailable runtime token values as null; no consumption or savings comparison is inferred.

Initial research outcome: 41 proposed points in six languages across eight pending syntheses, one preserved programme source, a draft catalogue addition and deterministic pending availability output. The research request authorised preparation; no proposal was marked approved and no Git publication was performed at that stage.

## Git publication authorisation

The first Git publication on 21 November 2026 retained the batch as drafts because Builder interpreted the commit-and-push request as research-only publication. The maintainer explicitly corrected that interpretation: requesting commit and push approves the presented synthesis. The maintainer then instructed Builder to mark it approved, prepare it for production, and commit and push the result. This clarification supersedes the earlier draft-only interpretation and authorises the unchanged complete six-language batch without further confirmation.

Approval recorded at `2026-11-21T01:10:09Z` covers all 41 points, their translations, the disclosed education-income interpretation and the retention of undefined source terms without invented definitions. The record preserves those evidential ambiguities and the political-programme/current-campaign-adoption caveat; acceptance does not establish factual truth, legal feasibility, exhaustive coverage or certified fluency.

The eight syntheses change from pending revision 1 to partial revision 2. All point statuses change from `draft` to `approved`. The deterministic public projection now exposes 41 Frente Obrero points and its preserved source, while retaining all 183 previously public points unchanged, for a total of 224. Programme prose, source bytes, extraction, citations, IDs and ordering remain unchanged. Production readiness here means approved content and a verified production build; a Git push does not prove remote CI or deployment.

Concurrent working-tree changes to provincial programme identity resolution and related documentation are outside this approval commit. They are preserved separately; this publication does not silently stage or publish them. Verification is performed against an isolated copy of the committed application plus this approval batch. The province-link limitation recorded during research remains outside this editorial change.

## Approval publication checks

Verification used an isolated export of the committed application at `9565d9b` plus only this approval batch, with Node 24.22.3 and npm 10.8.2. Dependencies were copied locally; no app server or deployment setting was started or changed. Initial environment selection and sandbox loader-port failures were corrected in the isolated copy; the final checks below passed under the required toolchain.

- Regenerated and checked all programme JSON with the existing deterministic generator. All 41 Frente Obrero points are public in six languages; the total public count is 224.
- Compared every point with the accepted draft: titles, bodies, citations, IDs and order are identical. Only point approval and synthesis revision/review metadata changed. All 183 other public points and existing syntheses are unchanged. Source originals and extraction hashes are unchanged.
- `npm run check` passed: tooling/app types, lint, formatting, documentation, generated content, provincial baseline and bounded source screening.
- All 129 deterministic tests passed.
- `npm run build` passed after clearing the isolated failed cache and allowing Turbopack's internal loader communication. The production HTML checker verified 390 portal pages.
- Final staging includes only this approval batch and the documented publication convention. The independent provincial identity work and its related files and documentation hunks remain outside the commit.

The approved batch is ready for production publication. Commit and push are authorised; no further editorial confirmation is needed for these unchanged six-language points. Remote CI and actual production deployment remain unverified.
