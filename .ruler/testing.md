# Testing

Vitest with jsdom environment. Setup in `vitest.setup.ts` (ResizeObserver polyfill, visualViewport mock).

## Vuetify in Tests

```typescript
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({ components, directives });
mount(Component, { global: { plugins: [vuetify] } });
```

## Conventions

- Co-locate tests in `__tests__/` next to the source file
- Name test files `*.spec.ts`
- Use `afterEach` to unmount wrappers and reset timers/mocks
- Mock `vue-router` composables with `vi.mock('vue-router')` when testing pages
- Query elements via `data-testid` when asserting on specific UI parts

## Test Planning Workflow

When asked to create a test plan for TODO comments (e.g., "create a test plan for TODOs in @file"):

1. Search for `TODO:` comments in the specified file(s)
2. Analyze surrounding test structure (describe blocks, related cases, setup/teardown, mocks)
3. Find reference patterns in the same file for similar functionality
4. Examine source components for events, props, conditional rendering, data flow
5. Determine implementation status (feature exists vs TDD)
6. Create `PLAN.md` in the same directory as the test file — do not modify code

### PLAN.md Structure

For each TODO test case: test location, context (scenario, workflow, implementation status), setup steps, test actions, assertions, pattern references (similar tests by line number), and key implementation notes.

Clearly mark each test as **TDD** (feature missing; failing is expected) or **Existing functionality** (should pass immediately).

### Implementation Workflow

1. Create PLAN.md only (no test implementation yet)
2. User reviews and may edit PLAN.md
3. Implement tests only when instructed — always read the current PLAN.md first

For TDD tests: implement failing tests as written and note what code changes are needed to pass.
For existing functionality: tests should pass; investigate failures as potential bugs.
