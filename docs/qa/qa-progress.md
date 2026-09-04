# QA Progress

## Baseline

- Date: 2026-09-04 (Asia/Jakarta)
- Branch: `main`
- Commit: `ba2bdf88f3dbe650bb98158628cec708534eaacb`
- Worktree awal: `package-lock.json` modified; seluruh tracked `qa/` tree deleted. Perubahan tersebut pre-existing dan tidak disentuh.

## Selesai

- Analyzed: repository instructions, app/pages, components storefront, middleware, seluruh API route, DB schema/connection, AI helper, scripts, environment key names, package/test config.
- Mapped: architecture, modules, routes, APIs, entities, auth/session, authorization gaps, validation, integrations, state transitions, critical flows.
- Planned: 47 focused test cases; P0/P1/P2 automation strategy; FE/BE/UI execution records.
- Persistent setup: root `AGENTS.md` QA agreement dan repository skill `.agents/skills/qa-engineer/SKILL.md`.
- Browser tested: homepage/navigation, catalog search/sort/error fallback, detail/options/order, cart state transitions, login validation/negative auth, forged authorization, product directory, upload preparation/validation, review filters/selection, settings persistence, dan public mobile navigation.
- Evidence captured: 3 Playwright trace ZIP dan 9 screenshot di `docs/qa/evidence/ui-2026-09-04/`.

## Status execution

- Manual Tested: HTTP/API plus browser headless execution untuk safe critical flows dan negative/edge paths.
- Automated: belum ada permanent regression suite; script `docs/qa/exploratory/*.mjs` hanya harness execution/evidence.
- Runtime: local app, safe HTTP/API, Playwright 1.62.1, dan installed Microsoft Edge headless terverifikasi. Valid login, destructive DB mutation journey, live AI, dan satu isolated mobile-admin drawer check masih blocked secara spesifik.
- Packages/config: unchanged by this QA setup.

## Frontend Bugs

- Total: 4
- Open: 4
- Fixed: 0
- Retest: 0
- In Progress: 0
- Ready to Retest: 0
- Closed: 0
- Rejected: 0
- Duplicate: 0
- IDs: BUG-FE-001 cart kosong terisi sample; BUG-FE-002 review selected-index mapping; BUG-FE-003 duplicate cart rows/React keys; BUG-FE-004 non-image mengaktifkan Generate.
- Register: `docs/qa/bug-report-fe.md`.

## Backend Bugs

- Total: 4
- Open: 4
- Fixed: 0
- Retest: 0
- In Progress: 0
- Ready to Retest: 0
- Closed: 0
- Rejected: 0
- Duplicate: 0
- IDs: BUG-BE-001 forged cookie melewati middleware; BUG-BE-002 API admin tanpa access control; BUG-BE-003 malformed login JSON menghasilkan 500; BUG-BE-004 invalid product menghasilkan 500 dan exception leak.
- Register: `docs/qa/bug-report-be.md`.

## Overall Summary

- Total confirmed application bugs: 8.
- Frontend: 4; Backend: 4.
- Open: 8; Fixed: 0; Retest: 0; In Progress: 0; Ready to Retest: 0; Closed: 0; Rejected: 0; Duplicate: 0.
- Combined bug report sudah dihentikan; FE dan BE tidak boleh digabung pada sesi QA berikutnya.
- Developer handoff terbaru: `docs/qa/qa-summary.md`; navigation entry point: `docs/qa/README.md`.
- Current release recommendation: `NOT READY` karena BUG-BE-001/002 Critical/P0 masih Open, beberapa P0 frontend gagal, dan valid admin mutation journey masih blocked.

## Needs Confirmation dan risiko

- CANDIDATE-004 unknown slug fallback behavior.
- CANDIDATE-006 detail menampilkan fallback product sementara sebelum fetch selesai.
- CANDIDATE-007 catalog API failure disamarkan oleh fallback data.
- Candidate register: `docs/qa/finding-candidates.md`; item ini tidak dihitung sebagai bug.
- Product POST and upload/ingest item validation are incomplete.
- UI fallbacks can hide API/database failures.
- Settings and cart are local-only and may diverge per browser/device.
- Live AI tests can incur cost and be nondeterministic.

## Unresolved questions

1. Which Turso database/URL is approved for destructive QA cases?
2. Which admin test account may be used, supplied via environment only?
3. Are `/api/products`, `/api/ingest`, and `/api/admin/*` intended to be admin-only?
4. Should an empty database/cart show empty state or demo fallback data?
5. Should an unknown product slug return 404?
6. Is review save allowed for Pending items, or only Approved items?
7. May regression tests stub Gemini, and what budget applies to live AI checks?
8. Was deletion of the tracked `qa/` structure intentional, and should future tests use `tests/` or restore that convention?

## Next action

Confirm QA database, admin credential, Gemini stub/live policy, dan intended permanent test directory. Setelah itu jalankan P0 mutation journey dengan cleanup terisolasi dan implementasikan regression berurutan untuk BUG-BE-001/002, BUG-FE-001/002/003/004, lalu BUG-BE-003/004.

## Execution 2026-09-04

- App start check: existing repo server ready on port 3000; second start correctly reported the active PID.
- Passed: 14 recorded FE/BE checks.
- Failed: 5 recorded checks tied to four backend defects (BUG-BE-001..004).
- Browser fallback check: in-app browser unavailable; Playwright package present; bundled Chromium missing; installed Edge headless launch succeeded.
- Browser execution: 22 recorded UI checks — 12 Pass, 5 Fail, 3 Needs Confirmation, 2 Blocked (valid-auth lifecycle dan isolated mobile-admin verification).
- Confirmed defects: BUG-FE-001..004 dan BUG-BE-001..004. Browser execution promoted cart-empty and review-index candidates, plus found duplicate cart state and missing upload validation.
- Not executed: valid credential login lifecycle, ingest AI success, save/publish/delete mutation, DB persistence journey, live Gemini.
- Evidence: `docs/qa/evidence/2026-09-04-runtime.md`, `docs/qa/ui-exploratory-execution.tsv`, FE/BE TSVs, screenshots, dan traces.
