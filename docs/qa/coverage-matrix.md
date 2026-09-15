# Coverage Matrix — latest blackbox execution

Date: 2026-09-15. Run: confirmation-regression. Evidence: [JSON](evidence/blackbox-2026-09-15/confirmation-regression-results.json). Historical 2026-09-04 execution rows remain in FE/BE TSVs and bug registers.

| Case | Module / feature | Priority | Automation | Latest result | Finding |
|---|---|---|---|---|---|
| BB-001 | Cart / Persistence | P0 | Automated | Pass | - |
| BB-002 | Cart / Repeated add | P0 | Automated | Pass | - |
| BB-003 | Cart / Quantity | P0 | Automated | Pass | - |
| BB-004 | Cart / Remove | P0 | Automated | Pass | - |
| BB-005 | Cart / Selection and checkout | P0 | Automated | Pass | - |
| BB-006 | Product / Variant checkout | P0 | Automated | Pass | - |
| BB-007 | Cart / Multiple variants | P0 | Automated | Pass | - |
| BB-008 | Cart / Variant visibility | P1 | Automated | Fail | BUG-FE-005 |
| BB-009 | Product / Related product | P0 | Automated | Fail | BUG-FE-008 |
| BB-010 | Product / Deep link | P1 | Automated | Pass | - |
| BB-011 | Catalog / Search | P1 | Automated | Pass | - |
| BB-012 | Catalog / Search recovery | P1 | Automated | Pass | - |
| BB-013 | Catalog / Sort | P1 | Automated | Pass | - |
| BB-014 | Storefront / Navigation | P1 | Automated | Pass | - |
| BB-015 | Storefront / Footer About | P2 | Automated | Fail | BUG-FE-006 |
| BB-016 | Product / Not found | P1 | Automated | Pass | - |
| BB-017 | Auth / Required and format | P1 | Automated | Pass | - |
| BB-018 | Auth / Password visibility | P1 | Automated | Pass | - |
| BB-019 | Auth / Invalid login | P0 | Automated | Pass | - |
| BB-020 | Auth / Protected navigation | P0 | Automated | Pass | - |
| BB-021 | Product / Quantity and thumbnail | P1 | Automated | Pass | - |
| BB-022 | Product / Accessible quantity | P3 | Automated | Fail | BUG-FE-007 |
| BB-023 | Responsive / Desktop | P3 | Automated | Pass | - |
| BB-024 | Responsive / Laptop | P3 | Automated | Pass | - |
| BB-025 | Responsive / Mobile | P3 | Automated | Pass | - |
| BB-026 | Storefront / Home product add | P0 | Automated | Fail | BUG-FE-009 |
| BB-027 | Storefront / Mobile feature carousel | P2 | Automated | Pass | - |

## Coverage limits

- FE: 27 UI scenarios; public pages, cart, negative auth, navigation, responsive controls.
- BE: 2 supplementary observations from UI, not separate direct-API tests or proof of overall authorization.
- Blocked journeys (not executable test counts): valid login/logout/session; admin upload → AI review/edit → save/persistence. Credentials unavailable.
- Role comparisons, session expiry, admin mobile, AI failures, upload validation, production build and database persistence: not tested. No invented roles/widgets.
- Current catalog has 3 products and no observed pagination/filter controls.
- No storage injection, direct API calls, database reads/writes, application imports, or production fixes.

## NC-BB-004: intermittent runtime availability

CONFIRMED FROM RUNTIME: final-regression BB-010 remained at "Loading product details..." at the 5-second assertion deadline; BB-026 Home had no product cards at its deadline. NEEDS CONFIRMATION: data/network/server cause and acceptable loading SLA. No application internals were inspected and no wait/assertion was relaxed. Both failing attempts remain in FE execution and final-regression-results.json; prior pricing evidence remains valid.
