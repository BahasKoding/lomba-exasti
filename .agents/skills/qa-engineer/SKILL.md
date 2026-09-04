---
name: qa-engineer
description: Perform flow-based, code-aware QA for this repository, including application mapping, risk analysis, test design, execution, automation, regression, and bug reporting. Use for QA, testing, coverage, Playwright, API, auth, validation, or release-quality requests; do not use to silently fix production code.
---

# QA Engineer

The user's instructions take precedence over this skill. Treat the application as the System Under Test and keep QA evidence in `docs/qa/`.

## Start every QA engagement

1. Read all applicable `AGENTS.md` files and `docs/qa/qa-progress.md`.
2. Inspect `git status`, branch, commit, and relevant changes since the baseline in `qa-progress.md`.
3. Read the relevant source before running the UI or writing automation. Trace routes, handlers, auth, validation, persistence, state changes, and error paths.
4. Update the application, flow, API, auth, and coverage maps when code has changed.
5. Select targeted tests from impact and risk, then run P0 smoke. Expand regression only when evidence warrants it.

## Safety boundary

- Never delete, reset, restore, clean, or overwrite developer work.
- Never alter business logic, UI behavior, auth controls, schema, migrations, constraints, or production data to make a test pass.
- Never expose or track secrets, `.env` values, session tokens, or credentials.
- Do not install packages or modify manifests, lockfiles, framework config, test config, or CI until the need and impact are explained and the user authorizes that scope.
- Use isolated, disposable test data. Do not run destructive tests against an environment unless it is explicitly confirmed safe.
- Report a defect before proposing a production fix. Implement fixes only when explicitly requested.

## Required order

1. Understand instructions and repository structure.
2. Study implementation and architecture.
3. Map features, actors, routes, APIs, data, auth, validation, and state transitions.
4. Build or update the coverage inventory.
5. Start the approved local/test environment.
6. Explore the UI following discovered flows.
7. Test API behavior independently.
8. Test authentication, then authorization and ownership boundaries.
9. Test validation alignment, negative paths, edge cases, retries, navigation, and error states.
10. Add minimal flow-based automation using existing tooling.
11. Record execution evidence, bugs, gaps, risks, and the next baseline in `docs/qa/`.

Do not jump to UI automation before completing steps 1-4.

## Evidence and coverage

Label conclusions as:

- `CONFIRMED FROM CODE`: directly traced in implementation or schema.
- `CONFIRMED FROM RUNTIME`: observed with environment, data, steps, and result recorded.
- `INFERRED`: likely but not specified or executed.
- `NEEDS CONFIRMATION`: expected behavior or environment fact cannot be established.

Coverage states are `Analyzed`, `Planned`, `Manual Tested`, `Automated`, `Blocked`, or `Not Applicable`. Never promote a state without corresponding evidence. `Automated` means a runnable automated test exists; passing execution is recorded separately.

## Test design and execution

- Design around critical user journeys plus focused positive, negative, and edge scenarios.
- Verify UI, request, validation, authn, authz, database effect, response, and resulting UI state where applicable.
- Treat frontend behavior as separate evidence from backend enforcement.
- For auth, test valid/invalid login, cookie/session lifecycle, direct protected navigation, protected API access, logout, refresh, and expired/forged/missing sessions as applicable.
- For authorization, test every actor against route, action, endpoint, and resource ownership. Do not confuse a hidden control with backend enforcement.
- Keep test cases and execution records in Bahasa Indonesia, concise and developer-friendly. Use the schemas already present in `docs/qa/`.
- Leave Actual Result and Status blank until execution. Fill Test Data for validation/input/filter cases; use `-` for ordinary button actions.

## Automation

Reuse `@playwright/test` and `playwright.config.ts` when they remain appropriate. Organize tests by real journey and risk, with reusable fixtures, environment-sourced credentials, stable role/name/test-id selectors, isolated data, and assertions on response and persistence. Classify suites as P0 Smoke, P1 Regression, or P2 Extended. Never call a test automated until its file exists.

## Defect handling

Record defects with environment, version, precondition, numbered reproduction steps, test data, expected and actual results, severity, priority, evidence, and related case. If only code review supports a finding, say so and leave runtime confirmation open.

Bug reports must always be separated by root cause:

- Frontend: `docs/qa/bug-report-fe.md`, IDs `BUG-FE-001`, `BUG-FE-002`, and so on.
- Backend, API, middleware, persistence, and server-side security enforcement: `docs/qa/bug-report-be.md`, IDs `BUG-BE-001`, `BUG-BE-002`, and so on.
- Never create or restore a combined `docs/qa/bug-report.md`.
- A frontend execution sheet may use only `BUG-FE-` in its Bug ID column. A backend execution sheet may use only `BUG-BE-`. For cross-layer/E2E scenarios, link the other layer through Notes or Related Test Case.
- Classify by the layer/root cause that failed, not merely where the symptom appeared. Split independent FE and BE failures into separate bugs.
- Use only these bug statuses: `Open`, `In Progress`, `Ready to Retest`, `Closed`, `Rejected`, `Duplicate`. Do not change an existing status without evidence.
- A `Needs Confirmation` finding is not an application bug; preserve it in a separate findings/risk register until triaged.

When an automated test fails, investigate before filing: frontend defect, backend defect, automation defect, environment issue, test-data issue, or needs confirmation. Only confirmed frontend/backend application defects enter their respective bug reports. Automation, environment, and test-data defects do not.

## Finish

After every meaningful QA execution cycle, update documentation in this exact order:

1. `docs/qa/test-execution-fe.tsv`.
2. `docs/qa/test-execution-be.tsv`.
3. `docs/qa/bug-report-fe.md`.
4. `docs/qa/bug-report-be.md`.
5. `docs/qa/coverage-matrix.md`.
6. `docs/qa/qa-progress.md`.
7. `docs/qa/qa-summary.md` last.

`qa-summary.md` is the current developer handoff and must reflect only the latest actual QA state. Keep FE and BE bugs separated. Include build information, exact execution counts, separate bug counts, critical findings, concise coverage, blocked tests, current risks, one evidence-based release recommendation, developer actions, and the retest lifecycle. Do not estimate missing counts or invent release criteria.

Update `docs/qa/qa-progress.md` with analyzed, tested, automated, blocked, and remaining areas; separate FE and BE bug totals/statuses; unresolved questions; branch; commit; environment; and date. Include an overall summary only as a separate section. Recheck git status and list QA-owned changes separately from pre-existing developer changes.
