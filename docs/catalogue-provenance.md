# Catalogue provenance

The maintainer selected PP, PSOE, VOX, ERC and Frente Amplio for the first portal. Since 18 November 2026 the public catalogue lists formations with documented programmes. The maintainer added Podemos with its first approved batch and removed ERC, which had no approved synthesis in Prisma. The catalogue is a limited editorial selection with stable formation IDs.

## Initial identity and official website evidence

Evidence consulted on 12 October 2026:

| ID              | Display name  | Official website          | Identity evidence                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pp`            | PP            | https://www.pp.es/        | [PP legal notice](https://www.pp.es/aviso-legal/)                                                                                                                                                                                                                                                                                                            |
| `psoe`          | PSOE          | https://www.psoe.es/      | [PSOE legal notice](https://www.psoe.es/aviso-legal/)                                                                                                                                                                                                                                                                                                        |
| `vox`           | VOX           | https://www.voxespana.es/ | [VOX legal notice](https://www.voxespana.es/espana/aviso-legal)                                                                                                                                                                                                                                                                                              |
| `erc`           | ERC           | https://www.esquerra.cat/ | [ERC legal notice](https://www.esquerra.cat/avis-legal/)                                                                                                                                                                                                                                                                                                     |
| `frente-amplio` | Frente Amplio | Not verified; `null`      | [IU statement of 11 October 2026](https://izquierdaunida.org/2026/10/11/izquierda-unida-reafirma-su-compromiso-con-un-frente-amplio-que-reuna-a-todas-las-fuerzas-de-la-izquierda-y-a-la-sociedad-movilizada/) identifies the Spanish project. It does not establish a separate official website, complete coalition membership or a proclaimed candidature. |

Frente Amplio retains the catalogue's initial nullable website value. Its separate editorial review verifies the coalition's programme domain. [Frente Amplio editorial review](../content/reviews/2026-11-17-frente-amplio-programme-draft.md)

## Podemos addition

The stable identifier is `podemos`, with display name Podemos and official website `https://podemos.info/`, as listed in the Centro de Estudios Políticos y Constitucionales directory. The programme is hosted on the separate campaign website. The catalogue omits colour and font metadata for Podemos. [Institutional directory](https://www.cepc.gob.es/documentacion/enlaces-de-interes/partidos-sindicatos-organizaciones-empresariales) · [Podemos editorial review](../content/reviews/2026-11-18-podemos-programme-draft.md)

## Frente Obrero draft addition

The programme incorporation uses the new stable ID `frente-obrero`, display name Frente Obrero and official website `https://frenteobrero.es/`. The official homepage and its linked programme page explicitly associate the preserved political programme with the 29 November 2026 campaign. This addition prepares an editorial draft; it does not approve proposals or assert exhaustive Congress or Senate candidature coverage. No official colour or licensed official font is added. See the [21 November programme review](../content/reviews/2026-11-21-frente-obrero-programme-draft.md).

## Interface colour evidence

Only primary brand evidence is used. The interface applies subtle tints of the base colour while keeping text and focus indicators legible. These tints are interface treatments, not claims about an official complete palette.

- PP: `#21599E`, the fill in the [official logo SVG used by its website](https://www.pp.es/wp-content/uploads/2022/08/logo-short.svg).
- PSOE: `#E20025`, RGB 226/0/37 on page 6 of the [PSOE–CEF 2020 identity manual published by its Jaén federation](https://psoedejaen.com/wp-content/uploads/2020/12/MANUAL-IDENTIDAD-CORPORATIVA-PSOE-2020.pdf). No later manual was verified.
- VOX, ERC and Frente Amplio: no current primary colour asset was verified in this review. Use the neutral theme, including for any newly added formation, until evidence is reviewed.

The existing evidenced PP and PSOE colours are stored as `officialColor` in `content/editorial/parties.json` and projected to public JSON. Other formations omit the field: their banners use light grey and their breadcrumb/badge accents remain neutral. No official formation font has been verified or bundled; the party names retain the site font. Future official colour and typeface research follows the political documentation skill and requires evidence before catalogue incorporation.

The [18 November colour review](../content/political-info/reviews/2026-11-18-formation-brand-colours.md) verifies the digital green in the official VOX wordmark, the digital purple in the official Podemos wordmark, and the two Frente Amplio web branding colours. It records their source and scope for a future catalogue change.
