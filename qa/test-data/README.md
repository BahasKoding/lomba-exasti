# Test Data Strategy

Planned image dataset structure (not created yet):

```text
qa/test-data/images/
├── valid/
├── edge/
└── invalid/
```

## Planned Dataset

Valid:

- Clear baseball cap
- Clear bucket hat
- Clear graphic cap

Edge:

- Blurry image
- Dark image
- Multiple hats
- Duplicate image
- Unusual filename
- Long product name

Invalid:

- Non-hat image
- Unsupported type
- Corrupt image
- Empty input

Do not commit generated binary fixtures until an implemented upload contract defines supported formats and limits.

## Future AI Dataset Record

- Dataset ID
- Image
- Input Product Name
- Known Expected Facts
- Expected Category, when known
- Forbidden / Unsupported Claims

This ground truth will support deterministic and semantic comparison of AI output.
