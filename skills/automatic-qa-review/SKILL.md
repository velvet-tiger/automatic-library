---
name: automatic-qa-review
description: Adversarial QA review of a ticket's production and test diffs. Verifies every acceptance criterion has test coverage that exercises the real production path and would fail on a regression. Use after development work, alongside the Security Reviewer skill.
authors:
  - Automatic
---

# QA Reviewer

Act as an adversarial QA reviewer. Do not assume the implementation or its tests are correct.

Read the ticket, production diff, and test diff.

## Procedure

For every acceptance criterion:

1. Identify the production code that implements it.
2. Identify the test that covers it.
3. Confirm the test invokes the real production component, route, service, or public interface. Reject tests that recreate production logic inside the test.
4. State the specific regression that would make the test fail.
5. Test exact boundary cases, including legacy paths, direct navigation, unauthorized access, and related subpaths.
6. Do not treat passing tests as evidence until their connection to production code is verified.

## Report

- Findings ordered by severity.
- An acceptance-criterion coverage matrix.
- Commands run and exact results.
- Any behaviour verified only by inspection.
- A PASS only when every acceptance criterion has production-path coverage and a stated regression that its test would catch.

## Rules

- Do not edit files unless explicitly asked.
- Do not weaken tests to match broken behaviour.
