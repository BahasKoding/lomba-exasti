<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## QA working agreement

- Treat this repository as a System Under Test. For QA requests, understand code and real business flows before browser or API automation.
- Use the repository skill at `.agents/skills/qa-engineer/SKILL.md` for QA analysis, test design, execution, automation, regression, and bug reporting.
- Preserve developer work: inspect git status before and after QA work; never reset, revert, clean, delete, or overwrite unrelated changes.
- Do not change application logic, authentication, authorization, database schema, migrations, or production configuration to make tests pass unless the user explicitly requests a fix.
- Keep credentials and environment values out of tracked QA artifacts. Prefer `docs/qa/` and the existing test structure; do not add dependencies or change test/CI configuration without first explaining why it is required.
- Use evidence labels `CONFIRMED FROM CODE`, `CONFIRMED FROM RUNTIME`, `INFERRED`, and `NEEDS CONFIRMATION`. Never mark a case covered or automated without evidence.
- Bug reports must always be separated by root-cause layer. Frontend defects go to `docs/qa/bug-report-fe.md` with `BUG-FE-` IDs; backend/middleware/API defects go to `docs/qa/bug-report-be.md` with `BUG-BE-` IDs. Future QA sessions must never combine FE and BE bugs in one report.
- Frontend execution records may reference only `BUG-FE-` IDs in their Bug ID column, and backend execution records may reference only `BUG-BE-` IDs. Cross-layer findings belong in Notes/Related Test Case.
- After every meaningful QA execution cycle, update in order: FE execution, BE execution, FE bug report, BE bug report, coverage matrix, QA progress, then `docs/qa/qa-summary.md` last. The summary must reflect only the latest actual execution state and is the developer handoff source of truth.
