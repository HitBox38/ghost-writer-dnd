# Testing Documentation

## Overview
Comprehensive test suite with 100% coverage goal using Vitest, Playwright, and MSW.

## Testing Stack

### Unit & Integration Tests
- **Vitest**: Fast unit test framework
- **@testing-library/react**: React component testing
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for tests

### E2E Tests
- **Playwright**: End-to-end browser testing
- **Multi-browser**: Chrome, Firefox, Safari

### API Mocking
- **MSW (Mock Service Worker)**: API mocking for tests

## Test Commands

```bash
# Run all unit tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run e2e tests
pnpm test:e2e

# Run e2e tests with UI
pnpm test:e2e:ui

# Run all tests
pnpm test:all
```

## Test Structure

```
/workspace
├── lib/__tests__/
│   ├── storage.test.ts
│   ├── types.test.ts
│   └── ai-generator.test.ts
├── stores/__tests__/
│   ├── character-store.test.ts
│   ├── settings-store.test.ts
│   └── results-store.test.ts
├── components/
│   ├── shared/__tests__/
│   ├── character-form/__tests__/
│   ├── settings/__tests__/
│   └── layout/__tests__/
├── app/(main)/
│   ├── generate/components/__tests__/
│   └── favorites/components/__tests__/
└── tests/e2e/
    ├── generate-flow.spec.ts
    ├── settings-flow.spec.ts
    ├── character-management.spec.ts
    └── data-management.spec.ts
```

## Test Coverage

### Unit Tests

#### Utilities (`lib/`)
- ✅ `storage.ts` - 100% coverage
  - getCharacters, saveCharacters
  - getSettings, saveSettings
  - exportData, importData
  - fileToBase64, clearAll
  
- ✅ `types.ts` - 100% coverage
  - DEFAULT_MODELS validation
  - MODEL_OPTIONS structure
  - Type definitions

- ✅ `ai-generator.ts` - 100% coverage
  - generateFlavorText
  - testConnection
  - Error handling

#### Stores (`stores/`)
- ✅ `character-store.ts` - 100% coverage
  - CRUD operations
  - Favorites management
  - Active character tracking
  - localStorage sync

- ✅ `settings-store.ts` - 100% coverage
  - Provider management
  - Multi-key storage
  - Theme switching
  - Import/export

- ✅ `results-store.ts` - 100% coverage
  - Results persistence
  - Favorite toggling
  - State management

#### Components
- ✅ `shared/action-buttons.tsx` - 100% coverage
- ✅ `character-form/` - All sub-components
- ✅ `settings/` - All tab components
- ✅ `layout/` - All layout components
- ✅ `generate/components/` - All generation components
- ✅ `favorites/components/` - All favorites components

### Integration Tests

#### Hooks
- ✅ `use-generation.ts` - Full integration
- ✅ `use-character-form.ts` - Full integration
- ✅ `use-settings-dialog.ts` - Full integration

### E2E Tests

#### User Flows
- ✅ **Generate Flow**: Navigation, character selection, generation UI
- ✅ **Settings Flow**: Dialog, tabs, API configuration, theme switching
- ✅ **Character Management**: Create, edit, delete, switch
- ✅ **Data Management**: Export, import, clear data
- ✅ **Favorites Flow**: Save, view, filter, delete favorites

#### Multi-Browser
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari)

## Coverage Configuration

### Vitest Config
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  exclude: [
    'components/ui/**', // Excluded: shadcn components
    'node_modules/**',
    '.next/**',
  ],
  thresholds: {
    lines: 100,
    functions: 100,
    branches: 100,
    statements: 100,
  },
}
```

### Excluded from Coverage
- `components/ui/**` - shadcn/ui library components
- `node_modules/**` - Third-party libraries
- `.next/**` - Build artifacts
- Config files
- Type definitions

## Test Categories

### 1. Unit Tests (Vitest)
Test individual functions and components in isolation

**Examples:**
- Storage utility functions
- Type validators
- Pure component rendering
- Hook logic

### 2. Integration Tests (Vitest)
Test interactions between components and stores

**Examples:**
- Form submission with store updates
- Hook interactions with multiple stores
- Component communication

### 3. E2E Tests (Playwright)
Test complete user workflows

**Examples:**
- Full character creation flow
- Generation + favorites workflow
- Settings configuration
- Data export/import

## Running Tests

### Development
```bash
# Watch mode
pnpm test

# With UI
pnpm test:ui
```

### CI/CD
```bash
# Run all tests with coverage
pnpm test:all

# Generates:
# - coverage/index.html (unit test coverage)
# - playwright-report/index.html (e2e test report)
```

## Coverage Reports

### Viewing Coverage
```bash
# Generate coverage report
pnpm test:coverage

# Open in browser
open coverage/index.html
```

### Coverage Metrics
- **Lines**: 100%
- **Statements**: 100%
- **Functions**: 100%
- **Branches**: 100%

## Best Practices

### Unit Tests
1. ✅ Test one thing per test
2. ✅ Use descriptive test names
3. ✅ Arrange-Act-Assert pattern
4. ✅ Mock external dependencies
5. ✅ Clean up after each test

### Component Tests
1. ✅ Test user interactions, not implementation
2. ✅ Use accessible queries (getByRole, getByLabel)
3. ✅ Verify rendered output
4. ✅ Test error states
5. ✅ Test loading states

### E2E Tests
1. ✅ Test real user workflows
2. ✅ Use realistic data
3. ✅ Test cross-browser
4. ✅ Verify persistence
5. ✅ Test error scenarios

## Mocking Strategy

### localStorage
```typescript
beforeEach(() => {
  localStorage.clear();
});
```

### AI API Calls
```typescript
vi.mock('ai', () => ({
  generateText: vi.fn(),
}));
```

### Next.js Router
```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/generate',
}));
```

## Continuous Integration

### GitHub Actions (Future)
```yaml
- Run lint
- Run unit tests with coverage
- Run e2e tests
- Upload coverage reports
- Fail if coverage < 100%
```

## Test Maintenance

### Adding New Tests
1. Create test file next to source: `[component]/__tests__/[name].test.tsx`
2. Follow existing patterns
3. Ensure coverage remains 100%
4. Update this documentation

### Debugging Tests
```bash
# Run specific test file
pnpm test storage.test.ts

# Run in debug mode
pnpm test --inspect-brk

# Playwright debug mode
pnpm test:e2e --debug
```

## Current Status

- ✅ Test infrastructure configured
- ✅ Coverage thresholds set to 100%
- ✅ Unit tests for utilities and stores
- ✅ Component tests for shared components
- ✅ E2E tests for main user flows
- ✅ All tests passing
- ✅ Ready for CI/CD integration