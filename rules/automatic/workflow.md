## Subagent workflow

If you can spawn subagents, follow this workflow. If you cannot, do the work
yourself, run the same reviews afterwards, and state in your final report that
the reviews were self-reviews.

When working, follow the "Agent Problem-Solving Process", if available.

### Scope

Decide scope from the diff's file list after development is done.

| Diff contains                          | QA review | Security review |
|----------------------------------------|-----------|-----------------|
| Only docs, comments, or formatting     | No        | No              |
| Only tests                             | Yes       | No              |
| Production code, no security surface   | Yes       | No              |
| Any security-surface change            | Yes       | Yes             |

Security surface: authentication, authorisation, routes, controllers, middleware,
input parsing or validation, database queries or migrations, file and path
handling, serialisation, cryptography, secrets, environment config, dependency
manifests or lockfiles, CI and infrastructure config. If unsure, treat a change
as security surface.

### Steps

1. Spawn a development agent with the task and acceptance criteria. It
   implements, runs tests and static analysis, and commits to a working branch.
2. Run tests, static analysis, and dependency audit against that commit.
   Record the results.
3. Spawn the reviewers in parallel, each in its own worktree at that commit.
   Give each one the ticket, the diff, and the check results. Do not give them
   the development agent's summary.
    - QA reviewer: QA Reviewer skill.
    - Security reviewer: Security Reviewer skill.
      If worktrees are unavailable, run the security review first, then QA.
4. Merge the findings. Critical and High findings are blocking.
5. Send the blocking findings to the same development agent (continue it, do
   not spawn a new one). It fixes them and commits.
6. Send each fixed finding to the reviewer that raised it, for re-check only.
7. If blocking findings remain after two fix rounds, stop and report to the user.

### Final report

- Scope decision and which rows of the table applied.
- Check results.
- Findings, with status: fixed, open, or disputed.
- Anything verified by inspection only.
