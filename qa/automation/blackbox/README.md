# SmartCap pure blackbox suite

Prerequisites: current app running using `npm run dev`, existing `@playwright/test`, installed Microsoft Edge, and at least two published products visible in Catalog.

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://localhost:3000'
npx --no-install playwright test qa/automation/blackbox --workers=1
```

Uses the existing root Playwright configuration; `test.use` selects Edge within this suite because bundled Chromium is absent in the execution environment. No packages, app settings or root test configuration are changed.

- Setup and assertions use UI/DOM only; no direct API, DB, storage injection, forged session, app imports or internal mocks.
- New browser context per test isolates cart data. Existing catalog products are read and added to the isolated browser cart only.
- Product identity and price are derived from rendered cards; no fixed database IDs.
- Tests BB-005/006/007/009/026 open the WhatsApp composer, capture its browser navigation request, and close the popup. No message is sent.
- Negative login uses obviously invalid QA data. No real credentials in traces.
- Missing admin credentials block the documented admin journeys; no placeholder passing tests or auth bypass.
- Quantity icon selectors are an explicit fallback for live controls with no accessible name. BB-022 exposes that usability issue.
- BB-023..025 cover three viewports with screenshots and actionable-control assertions. Cosmetic preferences are not asserted.
- Failure evidence retains screenshots and traces. Video is disabled only in this suite because the installed environment lacks Playwright ffmpeg; no dependency install is needed. JSON reports can be added with `--reporter=list,json` and `PLAYWRIGHT_JSON_OUTPUT_NAME`.
- Known defects remain failing assertions. See `docs/qa/qa-summary.md` for the latest executed results.

The intervening `final-regression` run had two unresolved data-loading failures (BB-010/026). Its evidence is retained. `confirmation-regression` reruns the unchanged suite; matching results do not establish that intermittent loading is resolved.
