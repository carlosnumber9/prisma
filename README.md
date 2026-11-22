# Prisma

Prisma helps citizens read reviewed summaries of official programmes for Spain's general election on 29 November 2026, by electoral formation and policy area.

## Current portal

Fourteen formations have 232 approved proposals in six languages: PP 24, PSOE 32, VOX 44, Frente Amplio 59, Podemos 24, Frente Obrero 41, and one each for EAJ-PNV, Comuns–Front Ampli, BNG, Partido Autónomos, Por un Mundo Más Justo, Escaños en Blanco, Falange Española de las JONS and Adelante Andalucía. The 56 reviewed area syntheses remain partial; 56 other areas are pending. The public catalogue is an editorial selection, not exhaustive electoral or programme coverage.

The portal provides programme/source links, stable proposal anchors, language selection and a shared province selector. Home, party directories and topic directories use 534 proclaimed Congress formation presences across 52 provinces, linking only matching programmes and approved topic content. It has no politician profiles, individual candidate directory or Senate dataset. See [portal behaviour](docs/portal.md) and [provincial data](docs/provincial-data.md).

The correction form, topic comparator, grounded chat and hosting verification remain [roadmap](docs/roadmap.md) work. Local checks and a push do not prove CI or deployment success.

## Development

Read [AGENTS.md](AGENTS.md), [domain terms](CONTEXT.md), [engineering conventions](docs/engineering-conventions.md) and the [Git workflow](docs/git-workflow.md). Use Node 24.x and npm 10.8.2; authorised ordinary publication uses local Git over SSH to `master`.

```sh
npm ci
npm run check
npm run test
npm run test:coverage
npm run build
```

`check` covers types, lint, formatting, documentation, generated content and bounded source credential checks. Tests and builds are separate; none requires an app server. Optional `SITE_URL` sets canonical URLs after a production domain is chosen.

## Content authoring

- [document-program](.agents/skills/document-program/SKILL.md): incorporate and review an official programme.
- [document-political-info](.agents/skills/document-political-info/SKILL.md): verify only displayed formation information and provincial Congress presence.
- [triage-suggestion](.agents/skills/triage-suggestion/SKILL.md): evaluate a supplied correction; never read mail or reply automatically.

Follow the [editorial policy](docs/editorial-policy.md), [programme contract](docs/content-contract.md), [catalogue provenance](docs/catalogue-provenance.md) and [scoped research workflow](docs/research-factory.md). Keep unapproved work, complete originals and investigation reports outside Git. Retain only cited programme excerpts and the minimal provenance needed to maintain displayed content; schema 4 omits literal quotes from the app projection. No person records, full candidate lists or historical political research archives belong in the repository.

The research workflow includes bounded Luna/medium source discovery, separate Research, Synthesis and independent QA profiles, and offline task/cache/metrics helpers. Query limits require coordinator tracking; token savings and Standard speed are not established by these profiles. See the [efficiency protocol](docs/research-efficiency.md).

```sh
npm run content:generate
npm run content:check
```

Next imports the four programme JSON envelopes and one provincial projection explicitly. It never exposes the whole content tree or generates editorial prose during visits. See [versioning](docs/versioning.md), [decisions](docs/decisions.md) and [validation](docs/editorial-validation.md).
