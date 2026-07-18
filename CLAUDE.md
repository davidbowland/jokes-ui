# jokes-ui

## General

**Always commit changes** after completing work unless explicitly told not to.

Use functional programming style where practical, including dependency injection, avoiding mutating objects or values, etc.

## Testing Standards

**Page tests must live under `test/`, mirroring the source path** (e.g. `src/pages/j/[id].tsx` → `test/pages/j/[id].test.tsx`), not next to the source file — colocating `*.test.tsx` inside `src/pages` breaks the production build, since `next.config.js`'s `pageExtensions` causes Next to treat them as real routes. Component and hook tests are colocated next to their source file (`src/components/**/index.test.tsx`, `src/hooks/*.test.tsx`) — this repo's existing convention.

**Jest clears all mocks automatically** (`clearMocks: true` in jest.config.ts). Never manually clear mocks.

**Mock state:** Set shared defaults in `beforeAll`. Override per-test with `mockReturnValueOnce` / `mockResolvedValueOnce` / `mockRejectedValueOnce`. Never use `beforeEach` — write a named `setup()` function if repeated arrangement is needed and call it explicitly.

**Typing mocks:** Use `jest.mocked(fn)` to get a typed mock, not `fn as jest.Mock`. Call it inline at each use site — it doesn't need to be hoisted into its own variable:

```ts
// avoid
;(getIdToken as jest.Mock).mockReturnValue('token')

// prefer
jest.mocked(getIdToken).mockReturnValue('token')
```

**Non-determinism:** Any function that uses `Date.now()`, `Math.random()`, or `crypto.randomUUID()` to produce a value that affects test outcomes MUST accept it as an injectable parameter with a default:

```ts
// source
export const createThing = (input: Input, now = Date.now): Thing => ({ ...input, createdAt: now() })

// test
it('sets createdAt', () => {
  expect(createThing(input, () => 1_000_000).createdAt).toBe(1_000_000)
})
```

**Fake timers:** Use `jest.useFakeTimers()` in `beforeAll` (and `jest.useRealTimers()` in `afterAll`) when the code under test calls `setTimeout`, `setInterval`, or `Date` internally without injection.

**No CSS or style assertions.** Test observable behavior: return values, thrown errors, calls to collaborators.

**No `if` statements in tests.** No live `Date.now()` or `Math.random()` calls in test bodies. No date arithmetic that depends on the current wall-clock time.

**Deterministic above all.** A test that passes today and fails tomorrow is broken.

## Accessibility

**All designs must meet WCAG AA.** This includes: sufficient color contrast (4.5:1 for normal text, 3:1 for large text), full keyboard navigability, visible focus indicators, appropriate ARIA roles/labels, and no content that relies on color alone. Run an accessibility audit before marking UI work complete.

## Copy and UX Writing

**All user-facing copy, CTAs, labels, and error messages must be reviewed by a UX expert and by Steven Pinker's principles** (plain language, active voice, concrete nouns, no jargon, no weasel words). Apply the suggested changes unless they conflict with technical constraints.

## Module Aliases

| Alias           | Path               |
| --------------- | ------------------ |
| `@assets/*`     | `src/assets/*`     |
| `@components/*` | `src/components/*` |
| `@config/*`     | `src/config/*`     |
| `@hooks/*`      | `src/hooks/*`      |
| `@pages/*`      | `src/pages/*`      |
| `@services/*`   | `src/services/*`   |
| `@test/*`       | `test/*`           |
| `@types`        | `src/types`        |

## Commands

- `npm test` — run tests with coverage
- `npm run typecheck` — TypeScript check
- `npm run lint` — format + lint
- `npm start` — run locally via Next.js dev server
