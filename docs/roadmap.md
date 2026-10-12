# Delivery roadmap

This roadmap records agreed direction, not permission to implement every item or publish unreviewed content. Update statuses as deliveries are verified. Do not mark deployments, complete electoral coverage or model quality as achieved from a Git push alone.

## Delivery 1 — Editorial foundation: implemented

- Repository skills for programme documentation and user-supplied suggestion triage, sharing policy and data contracts.
- Versioned originals, extraction references, editable synthesis JSON and deterministic approved-only public projection.
- Eight policy areas, stable formation/area/point IDs, explicit pending/partial/complete review states and partial publication.
- Synthetic generator tests and four read-only triage rehearsal cases. The real programme and formation catalogues remain empty.
- Agent guidance, glossary, versioning, Git publication conventions, local static checks and the Quality workflow definition. Remote CI success and deployment settings require separate verification.

## Delivery 2 — First verified 2026 corpus: pending

Incorporate the first official 2026 programme using `document-program`. Verify official provenance, visual/text extraction fidelity, citations and the review process with real documents. Publish agreed summaries by area, with visible incompleteness when review is partial. Use only official programmes for this election.

Choose a public coverage criterion once official candidatures provide enough information. Distinguish formations and coalitions from constituency candidatures and shared programmes. The choice between limited state-wide coverage, parliamentary representation and wider coverage remains open; do not silently equate the portal with all candidates.

## Delivery 3 — Accessible Next portal: pending

Build the smallest suitable Next.js application reading the approved JSON. Provide home, formation and topic indexes, formation pages, and shareable synthesis pages:

- `/`, `/parties`, `/parties/[party]`
- `/parties/[party]/[topic]`, such as `/parties/psoe/housing`
- `/topics`, `/topics/[topic]`, such as `/topics/housing`

The home should expose both browsing paths immediately. Use Spanish citizen-facing language, semantic navigation, keyboard access, readable typography, sufficient contrast, mobile layouts and explicit review/source states. Topic pages initially organise links or summaries; a dedicated multi-formation comparator is a later delivery. Pages can be statically generated; there is no need for a running content-generation server.

## Delivery 4 — Contextual correction form: pending

Add a client-side correction form for a selected point or fragment. Prepare a `mailto:` draft with route/anchor, formation, area, point ID, synthesis revision, quoted text and optional correction/source. The citizen completes and sends the message using their mail client. Offer a copy-message fallback and display the recipient address. Choose the destination email before implementation.

The maintainer supplies received suggestions to `triage-suggestion`. The skill debates their validity and can apply an agreed correction, prepare an agreed GitHub tracking issue or record a reasoned dismissal/already-resolved result. No automatic mailbox reading, citizen reply or public issue submission is planned for this delivery.

## Delivery 5 — Vercel hosting and publication checks: pending

Connect the intended repository and production branch `master`, configure domains/settings when authorised and verify build/deployment outcomes. Align the repository's remote default-branch setting with `master` through a separately authorised repository-settings action when needed; a local branch rename or push does not change that setting.

Enable Vercel Deployment Checks requiring Quality before production promotion when explicitly configured. Verify that the setting is actually enabled; do not claim enforcement from the workflow file. Continue preparing editorial changes before consent, then publish agreed batches by local Git over SSH. Do not add a database or model service merely to justify client/server separation.

## Delivery 6 — Topic comparator: future

Add comparison of multiple formations within `/topics/[topic]`, based on the same reviewed summaries and source references. Define selection/sharing behaviour and handle uneven or partial programme availability before implementation. Avoid presenting a missing programme as a party having no proposals.

## Delivery 7 — Grounded programme chat: exploratory

Evaluate a Hugging Face model or another suitable option for Spanish questions about the programme corpus. Compare factual/source fidelity, citation quality, latency, resource requirements and cost using real documents. No model, hosting arrangement or budget has been selected.

Introduce a server/API boundary only when this feature needs it. Ground answers in identified source versions, disclose unavailable evidence and evaluate unsupported claims before release. Do not let the chat rewrite approved summaries or turn political preferences into factual findings. Training, inference infrastructure and vector storage are not prerequisites for the first portal delivery.
