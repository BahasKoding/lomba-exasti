# BLACKBOX AUTOMATION TEST SUMMARY

Environment: existing local Next.js 16.3.3 development server

Application URL: http://localhost:3000

Browser: Microsoft Edge 153.0.4234.32 (Chromium engine; inherited project label chromium)

Playwright Version: 1.63.0

Execution Date: 2026-09-15 (Asia/Jakarta)

Branch / Commit: qa/setup-testing / 95d549bebf29b3cafc11174b8a741d0d87a1a60c

Run: confirmation-regression

## Coverage

27 automated: 22 passed, 5 failed, 0 skipped. Product failures 5; automation failures 0; unclassified 0.

Automated blocked: 0. Two additional business journeys are BLOCKED before automation (valid auth lifecycle; admin upload/review/save). They are not counted as executed tests. Browser-only BE observations: 2, both Pass; do not add them to the automated total.

Modules tested: Home/About, Catalog, Product, Cart, Login, public responsive navigation. [Application and flow mapping](blackbox-plan-2026-09-15.md). [27 case definitions](test-cases.tsv). [Exact per-case results](coverage-matrix.md).

## Findings from this run

- Critical: 0 newly confirmed.
- Major Business Flow: 2 — BUG-FE-009: Home topi 4 Rp65.000 becomes Rp150.000 in Cart/composer;  BUG-FE-008: related-product price differs from Catalog, Cart and WhatsApp order use Rp149.000 instead of Rp45.000.
- Major Layout: 0 confirmed.
- Minor Business Flow: 2 — cart color is hidden (BUG-FE-005); footer About opens Home anchor (BUG-FE-006).
- Minor Layout/UI: 1 — unnamed quantity controls (BUG-FE-007).
- New Backend defects: 0.

Findings are kept by root-cause layer: [Frontend report](bug-report-fe.md), [Backend report](bug-report-be.md). No combined bug register. Historical BUG-FE-002/004 and BUG-BE-001..004 retain Open; not reproduced in this session. BUG-FE-001/003 are Closed after successful UI retest.

## Critical business flow status

| Flow | Status | Evidence |
|---|---|---|
| Catalog → add → cart edit/select/remove → refresh | PASS | BB-001..005 |
| Detail → Navy + quantity → cart → WhatsApp composer | PASS | BB-006 |
| Two colors of the same product | PASS | BB-007 |
| Related product → cart → matching order price | FAIL | BB-009 |
| Home Collection / Best Selling → cart → order price | FAIL | BB-026; inspect evidence for each section |
| Mobile Home Feature 1/2 → visible slide | PASS | BB-027 |
| Invalid login → error → retry | PASS | BB-019 |
| Valid login → admin → logout/session | BLOCKED | Test credentials unavailable |
| Admin upload → AI → review/save → persisted catalog | BLOCKED | Valid session and admin UI discovery unavailable |

## Major Findings

### Business Flow

- BUG-FE-008: related-product ordering uses Rp149.000 for topi 3 instead of catalog Rp45.000. Incorrect price persists after refresh and appears in the WhatsApp composer.

- BUG-FE-009: Home Collection displays topi 4 at Rp65.000, but Add places it in Cart and WhatsApp composer at Rp150.000; wrong price persists after refresh.

### Layout / UI

- None confirmed.

## Minor Findings

### Business Flow

- BUG-FE-005: selected color is absent from the cart summary; composer retains it.
- BUG-FE-006: footer About opens a Home anchor instead of the About content.

### Layout / UI

- BUG-FE-007: quantity plus/minus controls lack accessible names.

## Need Confirmation

- NC-BB-001: Which color choices shown on detail are actually supported for each product? UI exposes defaults; catalog-specific variant requirements unavailable.
- NC-BB-002: Should search/sort and cart selection survive navigation/refresh? Item persistence is verified; persistence rules for these filters/selections are unspecified.
- NC-BB-003: Which admin QA account and test dataset can complete authorized UI creation/save checks? No credentials supplied.

These are requirement/test-data questions, not product bugs. Historical candidates retain their prior evidence; current unknown-slug check BB-016 passes Product Not Found.

## Automation Issues

- Missing Browser connection, bundled Chromium and ffmpeg handled with installed Edge and suite-local video disabled. Screenshots/traces retained. No dependency/config changes.
- Initial capitalization locator failure fixed using DOM textContent.
- Primary CTA, heading name and mobile dialog locators corrected. No failures are hidden or skipped; see JSON evidence.
- Raw earlier reports are retained as diagnostic evidence and are superseded by this run.

## Blockers and regression risk

- Two admin journeys blocked by unavailable valid credentials; no auth bypass attempted.
- Full release quality is unproven: admin mutations, actual authorization, AI and production build are outside executed coverage.
- Historical security bugs remain Open and require separate authorized retest; do not treat this session as confirmation they still reproduce.
- Cart colors cannot be reviewed directly. Related-product pricing is a confirmed order-data defect.

## Final QA Assessment

NOT READY for QA sign-off: related-product ordering has incorrect pricing and the admin P0 journeys remain blocked. Fix the recorded product defects separately, provide QA credentials, then retest affected cases and repeat the core regression.

Retest lifecycle: developer marks a fix Ready to Retest → QA runs linked cases with evidence → Closed only after Pass. No product fix performed by QA.


## Regression comparison

resumed: 22 Pass, 5 Fail. confirmation-regression: 22 Pass, 5 Fail; failed IDs BB-008, BB-009, BB-015, BB-022, BB-026. Skipped 0; flaky 0. These are repeated executions of 27 scenarios, not additional distinct coverage.

## Files and safety

Created: qa/automation/blackbox/ (4 TypeScript specs, helpers, cases, report utility, README); docs/qa/blackbox-plan-2026-09-15.md; five blackbox exploratory scripts; current evidence folder.

Modified: test-cases.tsv, FE/BE execution TSVs, FE/BE bug reports, coverage-matrix.md, qa-progress.md, qa-summary.md. Legacy records preserved; current handoff reflects this run.

Deleted: none. Production source, frontend/backend implementation, schema/database and application configuration were not edited. Existing developer changes were not overwritten. Final git/hash audit passed: production changes by QA = 0; baseline lockfile SHA256 unchanged; no deletion or staged changes.

Evidence: [JSON report](evidence/blackbox-2026-09-15/confirmation-regression-results.json); screenshots/traces under the adjacent confirmation-regression-run folder.

## Intervening regression evidence

The final-regression attempt recorded 21 Pass / 6 Fail: BB-010 lacked the topi 3 detail heading and BB-026 showed Home without product cards before any price assertion. These two runtime availability failures remain NEEDS CONFIRMATION; no internal cause was inferred. See final-regression-results.json and retained traces. The suite was rerun unchanged as confirmation-regression. A matching rerun does not erase the intermittent failure or prove environment stability.

## NC-BB-004: intermittent runtime availability

CONFIRMED FROM RUNTIME: final-regression BB-010 remained at "Loading product details..." at the 5-second assertion deadline; BB-026 Home had no product cards at its deadline. NEEDS CONFIRMATION: data/network/server cause and acceptable loading SLA. No application internals were inspected and no wait/assertion was relaxed. Both failing attempts remain in FE execution and final-regression-results.json; prior pricing evidence remains valid.

Execution note: the earlier continuation run was interrupted at the user’s pause request and has no completed JSON report. Its partial output is diagnostic only. The resumed and final-regression reports supersede it.

## Final verification

Targeted TypeScript check and git diff --check: Pass. FE register: 9 total, 7 Open, 2 Closed (5 reproduced now; 2 historical Open untested). BE register: 4 historical Open, 0 newly confirmed. [Safety, exact file inventory and coverage limits](evidence/blackbox-2026-09-15/safety-audit.md).
