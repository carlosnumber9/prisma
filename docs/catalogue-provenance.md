# Initial catalogue provenance

The maintainer selected PP, PSOE, VOX, ERC and Frente Amplio for the first portal. This is a limited editorial selection, not the complete party registry or a claim about confirmed 2026 candidatures. IDs are stable internal slugs. The catalogue can change later without renaming existing IDs.

## Identity and official websites

Evidence consulted on 12 October 2026:

| ID              | Display name  | Official website          | Identity evidence                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pp`            | PP            | https://www.pp.es/        | [PP legal notice](https://www.pp.es/aviso-legal/)                                                                                                                                                                                                                                                                                                            |
| `psoe`          | PSOE          | https://www.psoe.es/      | [PSOE legal notice](https://www.psoe.es/aviso-legal/)                                                                                                                                                                                                                                                                                                        |
| `vox`           | VOX           | https://www.voxespana.es/ | [VOX legal notice](https://www.voxespana.es/espana/aviso-legal)                                                                                                                                                                                                                                                                                              |
| `erc`           | ERC           | https://www.esquerra.cat/ | [ERC legal notice](https://www.esquerra.cat/avis-legal/)                                                                                                                                                                                                                                                                                                     |
| `frente-amplio` | Frente Amplio | Not verified; `null`      | [IU statement of 11 October 2026](https://izquierdaunida.org/2026/10/11/izquierda-unida-reafirma-su-compromiso-con-un-frente-amplio-que-reuna-a-todas-las-fuerzas-de-la-izquierda-y-a-la-sociedad-movilizada/) identifies the Spanish project. It does not establish a separate official website, complete coalition membership or a proclaimed candidature. |

Never substitute IU's or Sumar's website for Frente Amplio's website. This record is catalogue evidence, not a programme source or reviewed synthesis. No programmes have been incorporated into the public corpus; this does not establish that programmes have not been published.

## Interface colour evidence

Only primary brand evidence is used. The interface applies subtle tints of the base colour while keeping text and focus indicators legible. These tints are interface treatments, not claims about an official complete palette.

- PP: `#21599E`, the fill in the [official logo SVG used by its website](https://www.pp.es/wp-content/uploads/2022/08/logo-short.svg).
- PSOE: `#E20025`, RGB 226/0/37 on page 6 of the [PSOE–CEF 2020 identity manual published by its Jaén federation](https://psoedejaen.com/wp-content/uploads/2020/12/MANUAL-IDENTIDAD-CORPORATIVA-PSOE-2020.pdf). No later manual was verified.
- VOX, ERC and Frente Amplio: no current primary colour asset was verified in this review. Use the neutral theme, including for any newly added formation, until evidence is reviewed.

The existing evidenced PP and PSOE colours are stored as `officialColor` in `content/editorial/parties.json` and projected to public JSON. Other formations omit the field: their banners use light grey and their breadcrumb/badge accents remain neutral. No official formation font has been verified or bundled; the party names retain the site font. Future official colour and typeface research follows the political documentation skill and requires evidence before catalogue incorporation.
