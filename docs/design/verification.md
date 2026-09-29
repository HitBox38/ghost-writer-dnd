# Redesign verification

The Dense Folio redesign is implemented in the current working tree. This report covers local production verification; it does not claim deployment or live provider acceptance.

## Requirement evidence

| Requirement                                | Implementation and evidence                                                                                                                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Approved literary, artwork-light direction | `app/folio.css`, `app/layout.tsx`; production desktop/mobile captures and independent finish review. Paper/charcoal grounds, Literata/Source Sans 3, oxblood/deep red, no decorative assets.           |
| Compact header and collapsible composer    | `components/layout`, `generate/page.tsx`, `scene-composer.tsx`; browser test confirms whole-panel removal, focus transfer and retained scene/count.                                                    |
| More than three lines, up to 25            | Results use ordinary document flow; browser tests render 12 and 25 passages. Final mobile test confirms the last Copy action is reachable.                                                             |
| Stable saved-status sorting and Grid/List  | Results-display unit tests exercise all 25 entries and stable sorting; browser tests verify sorting without filtering and layout preservation through collapse.                                        |
| Saved lines for live play                  | Favorites search/type filtering, save/unsave synchronization, random selection and clipboard behavior covered by unit/browser tests.                                                                   |
| Scalable dedicated Settings                | `/settings/[section]`; direct routes, mobile section selector, provider save/test/use separation, masked keys and system-theme updates verified.                                                       |
| Dedicated character create/edit            | Shared `CharacterEditor`; name-only creation, homebrew fields, long voice fields, portrait/PDF upload/removal, failed-save draft retention, discard/delete confirmation tested.                        |
| Mobile actions remain reachable            | Narrow editor and 25-result tests use Playwright hit-testing for Attach PDF, Save changes and the final Copy action in all three browsers.                                                             |
| Protected local data and backups           | Schema validation, credential exclusion, local-key preservation, import rollback and clear confirmation covered. Imported List preference is checked on return to writing.                             |
| Per-character writing sessions             | Hook tests cover navigation, character switching during requests, captured generation metadata and stale success/failure after reset. Duplicate generation before rendering starts one request.        |
| Accessibility and motion                   | Labeled native/Base UI controls, focus indicators, 44px primary targets, reduced-motion CSS; keyboard generation and collapse focus tested. This is not a complete assistive-technology certification. |
| Design record                              | `DESIGN.md`, `PRODUCT.md`, `docs/design/direction-contract.md`, `.impeccable/design.json`; final selection/evidence gaps are stated without reconstructed approval history.                            |

## Checks

- Production build passed: `pnpm run build` (includes TypeScript and all eight routes).
- Lint passed: `pnpm run lint`. Formatting and Git whitespace checks also passed.
- Unit coverage passed: `pnpm run test:coverage --maxWorkers=2`: 155 tests across 20 files; 97.27% statements, 90.30% branches, 97.80% functions, 98.26% lines. Existing thresholds are unchanged.
- Final full browser run: 81 passed, three failures from one newly added assertion looking for the layout selector on the wrong route. The assertion was corrected to the writing route. The corrected import test plus mobile editor/result-action checks then passed all nine executions across Chromium, Firefox and WebKit. Together these cover all 84 workflow cases on the final production build.
- Production capture test passed and generated ten valid desktop/mobile screenshots in `.impeccable/review/`.
- Impeccable detector ran once on changed UI targets: no findings (`review/detector.json`).
- React Doctor's changed-source review scored 87/100 with no errors; four advisory warnings concern component complexity/size and client-only date formatting. The subsequent pending-response guard is covered by the current unit/build checks.

AI generation and connection responses were mocked in browser tests. No real provider credentials, paid generation requests, or personal character data were used. Synthetic fixtures are labeled in the product record.

The first finish review found faithful type/material/ground/layout and requested two corrections: keep the mobile saved count on one line and consolidate current design authority. The verdict pass scored both corrections resolved and returned `ship` at fix-list scope. The initial review and verdict are recorded in `.impeccable/review/finish-review.md`.

## Browser-comment corrections — September 26, 2026

All 13 browser comments are addressed: Ghost Writer branding; Base UI-backed shadcn selects for sorting, provider, model and mobile Settings; matching 44px toolbar controls; compact scene collapse control and full-height divider; aligned character identity and description fields; direct delete icon with confirmation; and a noninteractive PDF attachment summary with loading, filename, size, timestamp, replacement and icon removal. Original file details remain explicitly unavailable for legacy attachments, which are preserved.

Final production build, lint, formatting and Git whitespace checks passed. The final unit run passed 157 tests across 20 files. The browser-comment scenario passed at 1085px and mobile widths, including keyboard Select use, control measurements, attachment persistence and mobile action reachability. Captures are under `.impeccable/review/comments/`.

The workflow suite passed all 84 cases across Chromium, Firefox and WebKit. Repeated mobile testing then exposed a header hydration shift: the character selector added a row between pointer-down and pointer-up, moving the Settings selector 45px and canceling its opening click. Loading and empty character states now reserve the same row. On the final build, all nine repeated mobile navigation executions passed, the browser-comment scenario passed, and all 157 unit tests passed again. Temporary diagnostic logging and the nonmodal Select experiment were removed; ordinary Base UI modal behavior remains.

React Doctor scored 87/100 with four existing advisory warnings and no errors before the narrow header stabilization. Independent finish review returned `ship` for the 13-comment correction scope and separately cleared the header stabilization. See `.impeccable/review/comments/finish-review.md`. No deployment, push, paid provider request, or modification of personal browser data was performed.

## Independent writing scroll areas — September 26, 2026

The user's subsequent request supersedes the earlier document-scrolling direction for the writing workspace. The scene form and lines list now scroll independently inside a viewport-sized layout, with their headings and toolbar controls remaining visible. Mobile stacks the panes; collapsing the scene expands the list. Other routes retain document scrolling.

Production build, lint and scoped formatting passed. Six browser checks passed across Chromium, Firefox and WebKit at 1085×800 and 390×844. They verify keyboard scrolling without moving the other pane or page, reaching Generate and the final Copy control in 25 results, collapse/reopen, no document overflow, and restoring ordinary scrolling after navigation to Settings. Desktop and mobile captures were visually inspected. Native PageDown animation must finish before comparing scroll positions; the regression check waits for the list's final End position rather than sampling mid-animation.

## shadcn Sidebar scene composer — September 26, 2026

The subsequent request replaces the split mobile form/list layout with the installed Base UI-backed shadcn Sidebar. Desktop embeds a 320px collapsible sidebar below the app header. SidebarHeader and SidebarFooter remain visible while SidebarContent scrolls; Generate stays available. The results list remains independently scrollable. Mobile uses the Sidebar’s Sheet with an accessible scene title, focus containment/restoration, preserved inputs, and automatic dismissal after successful generation. Provider selection works inside the drawer.

Production build and lint passed. All 27 generation/sidebar browser checks passed across Chromium, Firefox and WebKit. They include desktop independent scrolling, fixed Generate position, full-column collapse and focus restoration, mobile Escape/reopen, retained inputs, nested provider selection, successful generation dismissal and access to the final one of 25 lines. Desktop/mobile captures in `.impeccable/review/sidebar-*.png` were visually inspected. React Doctor remained at 87/100 with the same four existing warnings and no new diagnostics. Unit tests mock the desktop breakpoint because jsdom lacks matchMedia; mobile behavior is exercised in actual browser engines.

Final unit verification passed all 157 tests across 20 files with two workers; one prior 5-second test timeout during concurrent browser/Doctor work did not recur in this run.

## Anchored collapse toggle and motion — September 26, 2026

The requested collapse animation now keeps the desktop panel mounted, preserves its fields/scroll state, and makes it inert immediately on collapse. A persistent toggle remains at the same coordinates in both states. The sidebar slides/fades as its space closes over 220ms; transitions reverse from their current position. Keyboard interactions skip desktop transitions, while the existing reduced-motion override makes them effectively instant. The mobile trigger and drawer close control also have matching viewport coordinates.

Production build, lint, formatting and all 157 unit tests passed. The generation/sidebar run passed 30 checks; three additional reduced-motion assertions initially expected an exact zero string rather than the app’s existing 0.01ms duration. With the assertion checking effective duration, all six dedicated motion/position checks passed across Chromium, Firefox and WebKit, covering rapid reversal, inert state, focus, reduced motion and desktop/mobile coordinate equality.
