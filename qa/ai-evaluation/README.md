# AI Evaluation Strategy

## Deterministic Evaluation

- Valid JSON
- Expected schema
- Required fields
- Correct data types
- Supported category
- Correct image/product mapping
- Empty and error response handling

## Semantic Evaluation

- Hallucination
- Unsupported factual claims
- Visual misclassification
- Overconfidence
- Inconsistent output

AI must not be the sole judge of AI output. Future evaluation should combine ground truth, deterministic assertions, schema validation, semantic evaluation, and human QA sampling.

No evaluation runner is implemented at this stage.
