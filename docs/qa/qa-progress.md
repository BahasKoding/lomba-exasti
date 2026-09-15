# QA Progress

## Current baseline

- Date: 2026-09-15 Asia/Jakarta; branch qa/setup-testing; commit 95d549bebf29b3cafc11174b8a741d0d87a1a60c.
- Environment: existing local Next.js dev server localhost:3000; installed Edge; Playwright 1.63.0.
- Scope: user-authorized pure blackbox supersedes source-driven QA steps for this engagement.
- Pre-existing package-lock modification and three legacy traces preserved.

## Latest execution: confirmation-regression

27 automated: 22 passed, 5 failed, 0 skipped. Product failures 5; automation failures 0; unclassified 0.

- Analyzed: run mechanism and QA infrastructure only; browser-observed features mapped in blackbox-plan-2026-09-15.md.
- Automated: BB-001..027 in qa/automation/blackbox, no app imports or UI bypass.
- Supplementary BE evidence: invalid login and anonymous protected navigation only.
- Current FE bugs reproduced: BUG-FE-005, BUG-FE-008, BUG-FE-006, BUG-FE-007, BUG-FE-009.
- Closed after runtime retest: BUG-FE-001/003. Historical FE Open untested: BUG-FE-002/004.
- Historical BE Open untested: BUG-BE-001..004; new BE bugs: 0.
- Blocked: valid login/logout/session and admin ingestion/review/save journey. Credential question remains unanswered.
- Remaining: admin UI discovery, permissions with real accounts, live AI, save/publication consistency, database persistence through UI; no destructive actions performed.

## Infrastructure and automation issues

- Browser plugin discovery returned []; installed Edge used. Bundled Chromium and ffmpeg absent; scoped Edge/video-off settings, screenshots/traces retained.
- Two early runs stopped during setup/locator diagnosis; not a completed product QA verdict.
- Text capitalization/line-break normalization, mobile dialog scope, and primary-vs-related Add locator were corrected in QA files.
- See exact current results; valid product assertions remain failing.

Current handoff: qa-summary.md.

## NC-BB-004: intermittent runtime availability

CONFIRMED FROM RUNTIME: final-regression BB-010 remained at "Loading product details..." at the 5-second assertion deadline; BB-026 Home had no product cards at its deadline. NEEDS CONFIRMATION: data/network/server cause and acceptable loading SLA. No application internals were inspected and no wait/assertion was relaxed. Both failing attempts remain in FE execution and final-regression-results.json; prior pricing evidence remains valid.

## Final audit

Regression matches verification: 22 Pass / 5 Fail. FE register 9 total (7 Open, 2 Closed); BE register 4 historical Open, 0 newly reproduced. Targeted TypeScript and git diff checks pass. Lockfile baseline hash unchanged. See evidence/blackbox-2026-09-15/safety-audit.md.
