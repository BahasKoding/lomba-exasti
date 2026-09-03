# Current Testing Scope

| Area | Status | Repo Evidence | QA Action |
|---|---|---|---|
| Upload UI | PARTIAL | `app/admin/page.tsx` renders a multiple image file input, but no upload handler is present. | Limit checks to the rendered control until behavior is implemented. |
| Bulk Upload | PARTIAL | The admin page labels the flow as bulk upload, but selection, processing, and submission logic are absent. | Define integration tests after the workflow exists. |
| AI Product Ingestion | NOT READY | No product-ingestion API route or client call exists. `app/api/chat/route.ts` is a customer-service chat endpoint. | Wait for an explicit ingestion contract and implementation. |
| Review & Edit | PARTIAL | `app/admin/review/page.tsx` renders `mockReviewData`; Edit, Delete, and Save buttons have no handlers. | Test only static rendering; defer behavior tests. |
| Database | PARTIAL | `db/schema.ts`, `db/index.ts`, and `drizzle.config.ts` configure products with Turso/Drizzle; no reviewed-product write flow is present. | Add API/data-integrity tests when a controlled test database and write path exist. |
| Catalog API | PARTIAL | `GET app/api/catalog/route.ts` selects products through Drizzle and returns JSON or a 500 response, but no controlled test database is available in the repository. | Add isolated API coverage once test credentials/fixtures are available. |
| Public Catalog | PARTIAL | `app/page.tsx` renders a hardcoded `publicProducts` array and does not call the catalog API. | Keep one rendering smoke check; defer FE-to-BE assertions. |
| Product Detail | NOT READY | No product dynamic route exists under `app/`. | Add coverage only after a route and expected behavior exist. |
| WhatsApp Checkout | PARTIAL | Product cards build `wa.me` links from static product names and a placeholder admin number. | Validate deterministic link mapping after production configuration is defined. |

Statuses describe repository implementation only; they do not infer behavior from the PRD.
