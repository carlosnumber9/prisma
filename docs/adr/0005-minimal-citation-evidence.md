# Minimal citation evidence

Status: accepted on 22 November 2026; supersedes the snapshot-retention choice in [ADR 0002](0002-preserved-sources-and-stable-references.md).

Keep only the original quotations actually cited by reviewed proposals, their page/section locators and source/version metadata in the repository. Complete originals, uncited extraction and review histories remain outside the current tree. This trades independent offline reinspection of the full source for a small, maintainable corpus; authoring and corrections must reopen official originals and their surrounding context. A recorded original SHA-256 identifies the consulted version but is no longer reverified from local original bytes. Excerpt hashes, source links, stable IDs and multilingual fidelity checks remain enforced. Public schema 4 omits undisplayed literal quotations while editorial evidence retains them. Shared Git history is not rewritten by this cleanup.
