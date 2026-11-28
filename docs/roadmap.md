# Roadmap

## Implemented

- Reviewed six-language programme summaries, stable point IDs, source locators, deterministic generation and separate editorial/public data. Eighteen formations have 592 approved proposals across 57 complete, 52 partial and 35 pending area syntheses. EAJ-PNV, Partido Autónomos, Escaños en Blanco, Soria ¡YA!, Geroa Bai, Tercera Edad en Acción and Iustitia Europa have whole-corpus coverage, including eleven reviewed empty areas. Comuns–Front Ampli has 73 housing points in one complete area; its other seven remain pending. Other formations retain their documented selection or pending scope.
- Prerendered programme, party and topic routes; localized navigation, proposal links, source disclosures and responsive presentation. See [portal implementation](portal.md) for animation, accessibility and browser verification limits.
- Shared province selection, local IGN matching, Madrid fallback and 534 proclaimed Congress formation presences across 52 provinces. Existing national programme identities are reused across provincial variants. See [provincial data](provincial-data.md).
- Minimal citation evidence instead of full originals and extraction archives; schema 4 omits undisplayed public quotations. Offline validation checks retained excerpts, not original bytes. See [the contract](content-contract.md).
- Scope-limited authoring: displayed programme content, formation information and provincial presence. Politician profiles, individual candidate lists, substitutes and Senate research are excluded. Investigation ledgers and raw political archives stay outside Git.
- Bounded source discovery with a Luna/medium profile, separate Research/Synthesis/QA responsibilities and offline task, evidence-cache and metrics checks. The coordinator tracks search limits; no scheduler, automatic token cap or measured savings is implied. See the [efficiency protocol](research-efficiency.md).
- Direct repository authoring under explicit maintainer acceptance is supported by the Research, Synthesis and QA profiles. Originals and handoffs stay in memory; Builder retains independent QA, shared generation and publication. Previously loaded staging-only roles require a reported default-agent fallback with the same configured settings.
- Explicit whole-programme authoring requires full page/section review and measure-to-point coverage across all eight areas, without a point cap. Independent QA checks omissions; genuinely absent areas may be reviewed empty. This authoring rule does not assert that every existing synthesis is exhaustive.
- Local static checks, deterministic tests, generated-content validation, bounded credential screening and a separate production-build checker. These do not prove remote CI or deployment status.
- OpenCode Desktop profiles for ChatGPT subscription coordination, Research, Synthesis, Translation and QA; Discovery selects zero-priced OpenCode models and falls back to the cheapest current OpenAI model through existing ChatGPT OAuth. Shared worker rules, a live editorial target inventory, a V2 model-budget plugin, offline configuration checks and deterministic accepted-batch application remain. Lazy model/agent registry synchronization has regression coverage for startup ordering, refresh interleavings and cleanup; stale session selections remain rejected. Account setup, current model access and PDF extraction need session inspection. No provider benchmark or permanent free-access guarantee is established. See [OpenCode](opencode.md).

## Contextual correction form — pending

Prepare a citizen-controlled `mailto:` draft identifying route, anchor, formation, area, point, revision, quoted wording and an optional correction/source. Choose the destination address before implementation. Provide copy fallback. Received suggestions are supplied manually to `triage-suggestion`; do not read a mailbox, send replies or open issues automatically.

## Hosting verification — pending

When authorised, verify the intended Vercel repository/branch, domain and deployment outcomes. Deployment Checks and remote repository settings require explicit configuration; a local workflow or push is not evidence that they are enabled.

## Topic comparison — future

Compare selected formations using the same approved points and source references. Define selection/sharing and uneven-coverage behaviour before implementation. Missing content does not mean absence of proposals. Define accessible theme transitions and reduced-motion behaviour.

## Grounded programme chat — exploratory

Evaluate source fidelity, citation quality, latency, resources and cost against real programme questions before choosing a model or infrastructure. A runtime model, vector store and database are not prerequisites for the current portal. The chat must not rewrite approved summaries.

## Editorial maintenance

Add only concrete accepted content consumed by existing views, with necessary evidence. Reconcile formation identities with official support, preserve stable IDs and verify territorial supplements only when they affect the requested programme scope. Specialist language review remains useful, particularly for Basque and Aranese legal terminology. Keep current coverage limits in the [catalogue record](catalogue-provenance.md), not repeated investigation histories.

Further collection is deferred at the maintainer's request. Whole-programme incorporation remains unfinished for Comuns–Front Ampli's seven non-housing areas, BNG, Por un Mundo Más Justo, Falange Española de las JONS and Adelante Andalucía. The remaining requested new programmes are Compromís–Front Valencià, Coalición Canaria–Municipalistas Primero Canarias, Teruel Existe, Drago Canarias, Feministas al Congreso and PACMA. Unreviewed in-memory drafts are outside the approved corpus; resume only on a new maintainer instruction.
