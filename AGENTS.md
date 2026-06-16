# Agent Instructions

## Test Guidelines

When adding or modifying tests, follow these rules:

- Do not use `skip`, `todo`, or `only` in tests.
- Do not swallow exceptions. If an error is expected, assert it explicitly.
- Include at least one meaningful `expect` in every test.
- Cover not only happy paths, but also error cases and boundary values.
- Use the specification as the expected value, not the implementation's current behavior.
- Do not delete or weaken existing tests just to make the test suite pass.
- Limit mocks to external I/O only.
