import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { afterEach, expect } from 'vitest';

// Enables `expect(await axe(container)).toHaveNoViolations()` in any component
// test. Matcher types live in types/vitest.d.ts.
expect.extend(toHaveNoViolations);

// Testing Library only auto-cleans when vitest runs with `globals: true`, which
// this config does not set — without this, rendered DOM accumulates across tests
// and queries start matching elements from earlier cases.
afterEach(cleanup);
