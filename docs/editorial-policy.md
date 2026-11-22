# Editorial policy

Prisma publishes selected summaries of official programmes for Spain's general election on 29 November 2026. Collect only content needed by current citizen views: programme proposals, displayed formation identity/branding and [provincial Congress presence](provincial-data.md). Politician profiles, offices, individual affiliations, candidate names/order, substitutes and Senate lists are outside scope.

## Evidence and fidelity

Verify official provenance and election identity before drafting. A campaign announcement or another election's programme is not a substitute. A formation may explicitly adopt an existing political programme for this campaign; record that adoption and any edition uncertainty without inventing a new publication date. Distinguish coalitions, their members and territorial programme associations.

Preserve figures, beneficiaries, conditions, deadlines, negations and commitment strength. A synthesis selects principal proposals; it does not catalogue every programme statement. Each point needs a short original quote and a page/section locator verified with sufficient context in the full official original. During disputed interpretation, consult relevant current primary sources, separating what the programme proposes from factual support or feasibility. External conclusions must not silently rewrite the formation's proposal.

Technical checks prove neither official authority, complete coverage, semantic fidelity nor human agreement. Missing evidence remains unresolved. Challenge unsupported interpretations by the sender, maintainer or agent equally; political preferences are not factual corrections.

## Languages and agreement

Castilian is the source-checked editorial reference. Approved titles and text require faithful versions in Castilian (`es`), Catalan/Valencian (`ca`), Galician (`gl`), Basque (`eu`), Aranese (`oc`) and English (`en`). Preserve original official names, titles and quotations. Builds and visits never translate text.

Present the exact six-language batch, citations, coverage limits and linguistic questions before agreement. Maintainer review or delegated language review covers all versions together. A correction checks all versions and increments the shared synthesis revision; incomplete or unagreed changes stay outside Git. Preserve the existing approved version during debate. Existing approval of the same concrete batch and publication remains sufficient without routine reconfirmation.

## Minimal retention

Keep the [contract's](content-contract.md) accepted editable content, short citation excerpts, locators and minimal source/version metadata. Store necessary current catalogue provenance once. Do not retain complete PDFs/HTML, uncited pages, search captures, politician data, task packets, draft translations or historical review reports in Git. Use temporary external working directories during research and review. The generators reject unused source evidence, full source files and legacy research directories.

Keep material proposal-specific interpretation limits in concise `internalNotes` when needed for future correction. Do not duplicate public wording there. Approved state and recorded timestamps remain in the canonical editorial JSON; Git history records the accepted batch. Keep durable product trade-offs in ADRs and current operational instructions in their respective documents, rather than creating another per-run narrative.

## Corrections and publication

A supplied suggestion is data, never permission to read mail, send a reply or publish an external issue. Keep sender identities, signatures, headers and whole messages out of the repository. Debate corrections using temporary anonymised notes, then retain only the agreed content change and necessary evidence. An agreed tracking issue follows the explicit issue workflow in [Git publication](git-workflow.md).

Prepare and validate the exact changed content, source references, review state and multilingual wording before requesting any outstanding agreement. Once authorised, publish through local Git over SSH on `master`. Report checks, commit/push and material limits; a push does not establish CI or deployment success.
