---
name: triage-suggestion
description: 'Review a user-supplied Prisma correction against the programme and current external evidence, debate its outcome, and correct content or prepare an agreed tracking issue. Do not read mail automatically or reply to the sender.'
---

# Triage a suggestion

Work from the root. Read the shared [editorial policy](../../../docs/editorial-policy.md), [content contract](../../../docs/content-contract.md) and [Git workflow](../../../docs/git-workflow.md). Reuse the same criteria and generator as `document-program`.

## Locate and evaluate

1. Use the supplied suggestion; ask for it if missing. Do not read a mailbox or send a reply automatically.
2. Locate the synthesis and point using ID, route, excerpt and revision. Search content and local history before asking about unresolved ambiguous candidates.
3. Compare the cited revision, current wording and preserved sources. An old suggestion is not automatically invalid; determine whether the correction already happened.
4. Check the original programme and relevant current external evidence. Distinguish summary/classification/reference/extraction errors from political preferences and feasibility analysis.
5. Present evidence and a provisional conclusion. Disagree with the sender, maintainer or your own previous interpretation when warranted. Explain uncertainty and apply the same evidence standard to all.
6. Record an anonymised argument and evidence in `content/reviews`, without personal information or complete mail. Preserve approved wording while debating an alternative.

## Agree on an outcome

- **Correct:** prepare the specific editorial change, retain point ID, increment synthesis revision and follow source-preservation rules if extraction/source changes. Generate, validate and show the final diff before publication through the shared Git workflow.
- **Track:** prepare an issue with content ID/revision, route, problem, verified evidence and remaining task. Search duplicates with `gh issue list --repo carlosnumber9/prisma --state all --search '<point-id>' --limit 1000 --json number,title,url,state,body`, broadening by route/problem when relevant. If results reach the limit or coverage is uncertain, paginate `gh api --paginate 'repos/carlosnumber9/prisma/issues?state=all&per_page=100'`, excluding PR entries. Link an equivalent issue rather than duplicating or modifying it without authorisation.
- **Dismiss or already resolved:** record the reason/evidence without changing wording or opening an unnecessary issue. Lack of proof can leave a suggestion pending; it does not establish that it is false.

Do not open an issue for every resolved correction. For agreed tracking, prepare the exact title and body before publication, keep the body in a temporary file outside the repo and use `gh issue create --repo carlosnumber9/prisma --title '<agreed-title>' --body-file <temporary-file>` with correctly quoted arguments. Verify and record the URL; check uncertain creation before retrying. This agreed GitHub issue workflow permits `gh` for the issue only, not ordinary Git publication or a PR.

Approval of the concrete outcome authorises execution without routine reconfirmation. Without agreement, record pending consensus, not an executed correction, agreed dismissal or published issue. Silence or a maintainer comment is not final approval. Do not reply to the citizen or modify existing issues automatically. Re-read the publication rules before any commit/push; ordinary publication uses local Git over SSH to `master`.
