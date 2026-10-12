# Editorial validation

## Automated generator checks

`npm run test` uses synthetic snapshots and proposals in temporary directories, removed after execution. It does not parse real PDF programmes or verify official provenance. The tests cover:

- Approved-only projection, draft/review exclusion, pending/partial state and reviewed sources for a completed area with no identified proposals.
- Repeatable bytes, unchanged editorial inputs and non-mutating `--check`.
- Prior-output preservation on validation failure and rejection of unexpected public output files.
- Duplicate IDs, missing references, cross-formation sources, altered quotes and incompatible review states.
- Invalid dates, other election editions, original/extraction hash changes, wrong extraction versions and omitted pages.
- Physical/printed PDF page references, HTML section/anchor references and whitespace-only quote differences.
- Offline CLI use with a temporary root, invalid arguments, symlink rejection and harmless Finder metadata.

The actual corpus is empty with eight areas; fixtures under `tests` are not projected. Human agreement and semantic fidelity cannot be established by the generator. Coverage measures the generator and is diagnostic, without a global threshold.

## Read-only triage rehearsal

An independent read-only rehearsal applied the triage skill and shared references to the four independent synthetic packets in `tests/triage-scenarios.json`. No GitHub publication, external fact lookup or citizen messaging was performed. The synthetic originals and histories were supplied as checked evidence for this rehearsal only.

| Case | Observed result                                                                                                                                                             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A    | Detects that a conditional pilot for Beta became a promise for everyone. Disagrees with the maintainer, proposes faithful wording and leaves publication pending consensus. |
| B    | Distinguishes a political preference from an editorial correction. Retains the faithful summary and proposes reasoned dismissal without an issue.                           |
| C    | Identifies the error and equivalent existing issue. Proposes linking it without duplication or modification and explains that the textual error already has evidence.       |
| D    | Compares revisions and recognises an already-applied correction. Proposes closure without another editorial revision or issue.                                              |

The rehearsal led to explicit repository-scoped duplicate searches with truncation handling and an explicit pending-consensus phase. Maintainer comments were not treated as automatic final approval. English technical wording retains these behaviours.

The first real programme incorporation still needs original-capture and visual extraction validation. Application builds, browser checks, remote CI results and Vercel deployment must be verified when those capabilities exist; this record does not claim them.
