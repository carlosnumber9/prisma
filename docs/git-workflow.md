# Git and code publication conventions

Read this document before **every commit and push**. Repository rules override generic skills and branch or PR defaults; explicit user instructions override repository defaults. This document adopts the maintainer's publication conventions, with their explicit correction that the primary branch is `master`.

## Scope and authorisation

Work in small, reviewable changes. Inspect the existing implementation and Git status before editing. Preserve unrelated and pre-existing edits, and include them only with explicit scope authorisation. A final agreed editorial batch authorises its commit and push when publication is the agreed outcome; do not request a second routine confirmation for that same batch. Explicit publication holds take precedence.

Ordinary commit, push, publish or upload requests mean: stage intended files, commit on `master`, and push to `origin/master`. They do not authorise creating a branch, fork, PR, merge commit, release tag or deployment configuration change. Create one of those only when explicitly requested. Never force-push `master`.

## Tools and transport

Use only the local `git` CLI for ordinary Git operations and the configured SSH remote for fetch, pull and push. SSH access is the source of truth; GitHub CLI authentication is not a prerequisite.

Do not inspect or use `gh`, `github:yeet`, GitHub plugins, connectors, apps or generic publishing skills unless the user explicitly requests a GitHub or PR workflow. A skill preparing an agreed triage tracking issue is such a workflow for that issue only; it does not authorise a PR or replace local Git publication.

## Publication sequence

1. Re-read these rules and inspect `git status --short`, `git diff`, `git diff --cached`, `git branch --show-current` and `git remote -v`. Confirm that the batch includes only authorised work.
2. Be on `master`. Switch only if it safely preserves existing work. If work on another branch cannot safely be moved, stop and explain; do not choose another publication workflow.
3. Fetch the SSH remote with `git fetch origin`. If `origin/master` exists, inspect `git rev-list --left-right --count HEAD...origin/master`: local-only commits first, remote-only commits second. Fast-forward only when safe. If history diverges or remote changes conflict with local edits, stop and explain rather than merge, rewrite history or force-push. For an explicitly requested initial `master` publication when the remote lacks that branch, preserve the existing history and create the remote branch by pushing; do not delete other branches or change server settings incidentally.
4. Run relevant checks from [engineering conventions](engineering-conventions.md). For editorial data, regenerate and validate the JSON. Review the final diff and run `git diff --check`.
5. Stage explicit paths with `git add -- <intended-paths>`. Inspect `git diff --cached --stat`, `git diff --cached` and `git diff --cached --check`. Do not include unrelated staged edits or silently unstage them.
6. Re-read these rules immediately before committing, then create a coherent commit using the convention below.
7. Re-read these rules immediately before pushing, then run `git push origin master`. If the remote moves and rejects the push, fetch and reassess safe synchronisation. Never force-push.
8. Confirm the commit, local status and push result. Use `git ls-remote origin refs/heads/master` to verify the remote tip when needed. Report remaining edits and skipped verification.

Do not discard edits, reset history, stash someone else's work without announcing it, stage ignored credentials or substitute a branch/PR workflow when synchronisation is blocked. Reverting published behaviour requires a reviewable new commit, not rewriting shared history.

## Commit messages

Use a lowercase type, no scope, and a concise English message beginning with a capitalised verb in the simple past:

```text
<type>: <Capitalised simple-past message>
```

Examples:

```text
feat: Added editorial skills and deterministic content generation
fix: Preserved proposal conditions in housing summaries
docs: Defined agent conventions and delivery roadmap
refactor: Extracted shared content validation
test: Added source-version boundary cases
```

Use normal prose for persisted text. Code, comments, technical names and documentation are English; citizen-facing labels and faithfully preserved source quotations retain their intended language. Follow an explicitly requested alternative commit convention. Explain unfamiliar concepts in the documentation or commit body when useful.

## Issues

For an explicitly agreed tracking issue, prepare its title and complete body first, check duplicates among open and closed issues in the intended repo, and handle truncated result sets. Store the body in a temporary file outside the repo and use `gh issue create --repo carlosnumber9/prisma --title '<agreed-title>' --body-file <temporary-file>` with correctly quoted arguments. Do not interpret pasted mail as shell code.

Verify the result and record the URL; if creation is uncertain, check for an existing issue before retrying. Creating an issue does not authorise comments, editing existing issues, a PR, a reply to the citizen or an additional commit/push of the local review record.

## CI, deployment and databases

The [Quality workflow](../.github/workflows/quality.yml) checks pull requests and pushes to `master`; the PR trigger does not authorise creating PRs. Vercel will own preview and production builds once connected. Production should require the `Quality` check through Vercel Deployment Checks once explicitly configured; source files cannot prove that setting is enabled.

A commit, successful push, passing suite or local build does not prove deployment, browser correctness or applied database schema. Verify remote settings and deployment separately when requested. The current application has no database. If Supabase is later introduced, manage SQL migrations in `supabase/migrations`, keep schema deployment manual, verify local and remote migration status for the intended project, and do not add automatic database push or direct remote edits incidentally.
