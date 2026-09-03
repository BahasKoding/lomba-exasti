# SmartCap QA

## Approach

- Gray-box
- Risk-based
- Automation-first
- AI-assisted

## Planned Scope

- Product Upload
- Bulk Upload
- AI Product Ingestion
- Review & Edit
- Data Persistence
- Public Catalog
- Product Detail
- WhatsApp Checkout

## Testing Layers

- Frontend
- API
- Integration
- Database/Data Integrity
- AI
- E2E
- Regression

## Current Status

The repository contains static upload, review, and catalog UI; a database-backed catalog GET route; and Drizzle/Turso configuration. The UI is not connected to the catalog API or a product-ingestion workflow. Product detail is not implemented. See `docs/current-scope.md` for evidence-based classifications.

## QA Rules

- Do not test features that are not implemented.
- Do not change application source to make tests pass.
- QA must verify a bug before reporting it as confirmed.
- QA must review AI-generated test cases and scripts.
- Expected results should be measurable and deterministic where possible.
