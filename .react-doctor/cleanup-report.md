# React Doctor cleanup — 2026-10-05

React Doctor 0.9.14, Next.js 16.3.6, React 19.3.0, pnpm 10.34.5.

| Check                                              | Score | Errors | Warnings | Files scanned | Skipped checks |
| -------------------------------------------------- | ----- | ------ | -------- | ------------- | -------------- |
| Starting full scan                                 | 75    | 1      | 17       | 583           | None           |
| Final uncached full scan                           | 100   | 0      | 0        | 597           | None           |
| Changed-code regression, including untracked files | 100   | 0      | 0        | 589           | None           |
| Full audit ignoring inline exceptions              | 85    | 0      | 3        | 597           | None           |

All scans completed successfully. The three audit warnings apply to the same
Embla API publication call. Its exception is scoped to that line, preserves the
public API, and is covered by a lifecycle test. See [false-positives.md](false-positives.md)
for the justification and conditions. No React Doctor rule was disabled globally.

## Changes

- Read PDF pixel density through an external store with a stable server snapshot.
- Own PDF object URLs through committed subscriptions and revoke the last owner's URL.
- Format saved-line dates after hydration; use stable calendar-date identifiers.
- Use React form actions for generation while retaining controlled scene input.
- Use native list semantics and remove misleading or redundant ARIA roles.
- Separate polymorphic component implementations from public reexports.
- Load Recharts primitives dynamically and skip inactive tooltip formatting.
- Add pnpm's seven-day release-age minimum and no-downgrade trust policy.
- Remove unused-variable suppressions while still excluding credentials from backups.

## Validation

Architecture, lint, formatting, TypeScript, and production build pass. Component
files remain at most 100 lines and functions use arrow syntax.

All 242 unit tests pass across 31 test files. The final credential-discard cleanup
also passes the 30 existing storage and backup tests. Coverage: 90.18% statements,
87.27% branches, 88.85% functions, 91.69% lines.

Twelve production-browser checks pass across Chromium, Firefox, and WebKit:
lazy chart loading and rendering, tooltip and legend output, mobile dimensions,
RTL, dark mode, reduced motion, native lists, form actions, and favorites search.
Temporary verification routes and fixtures were removed.

PDF page rendering succeeds, but pointer interactions with viewer controls fail
because a Base UI inert overlay intercepts clicks. The saved pre-cleanup PDF
implementation reproduces the same failure in all three browsers. Those existing
browser failures remain unresolved; the full browser suite is not claimed to pass.

## Reproduce

```sh
npx --yes react-doctor@0.9.14 . --scope full --verbose --no-cache --yes
npx --yes react-doctor@0.9.14 . --scope changed --base HEAD --include-untracked --verbose --yes
npx --yes react-doctor@0.9.14 . --scope full --verbose --no-cache --yes --no-respect-inline-disables
```
