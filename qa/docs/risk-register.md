# Initial Risk Register

These are candidate risks, not confirmed bugs.

| Risk ID | Area | Risk | Impact | Priority | Testable Now | Notes |
|---|---|---|---|---|---|---|
| RISK-001 | Bulk Upload | Image and product-name mapping is swapped during batch processing. | Incorrect products are published or ordered. | P0 | No | Requires implemented batch processing. |
| RISK-002 | AI Product Ingestion | AI invents material or product details unsupported by the image/input. | Misleading catalog information. | P0 | No | Compare with curated ground truth and human QA sampling. |
| RISK-003 | AI Product Ingestion | AI returns malformed JSON or an incompatible schema. | Ingestion cannot be reviewed or saved reliably. | P0 | No | Requires an ingestion response contract. |
| RISK-004 | AI Product Ingestion | AI assigns an unsupported or incorrect category. | Products become difficult to find or are misrepresented. | P1 | No | Supported categories are not yet defined in code. |
| RISK-005 | Bulk Upload | A partial batch failure loses successful items or hides failed items. | Data loss and difficult recovery. | P0 | No | Requires batch result/error behavior. |
| RISK-006 | Review & Edit | Duplicate submission creates duplicate products. | Catalog and inventory integrity issues. | P0 | No | No save action is implemented. |
| RISK-007 | Review & Edit | A manual edit is overwritten by a later AI result. | Approved product data is lost. | P0 | No | No editing workflow is implemented. |
| RISK-008 | Data Persistence | Frontend values differ from persisted database values. | Published product information is incorrect. | P0 | No | FE write integration is absent. |
| RISK-009 | Public Catalog | Catalog displays incorrect or stale database data. | Customers act on outdated information. | P1 | No | Current catalog is hardcoded and disconnected from the API. |
| RISK-010 | Product Detail | A dynamic route resolves to the wrong product. | Customer orders the wrong item. | P0 | No | Product detail route is not implemented. |
| RISK-011 | WhatsApp Checkout | Checkout message identifies a different product than the selected card. | Wrong-item orders. | P0 | Partially | Static link composition can be inspected; integrated product identity cannot. |
