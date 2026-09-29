# Dense Folio: implementation revision

Status: implemented in the current working tree. The user chose the neutral-paper/charcoal/oxblood recommendation and requested all density changes. This document preserves the detailed requirements and supersedes the earlier green Folio proposal wherever they differ. Current source-derived tokens are in [DESIGN.md](../../DESIGN.md); final commitments and selection history are in [the direction contract](direction-contract.md). Verification outcomes are reported separately.

## References

- [Desktop: twelve varied-length quips](../../.impeccable/mocks/decision/folio-dense-desktop.png)
- [Dark mobile: corrected red accents](../../.impeccable/mocks/decision/folio-dense-mobile-red.png)

Both depict the same design direction, not competing options. Each image has a JSON sidecar containing the generation and correction prompts. Built-in image generation produced these critique references before implementation. Current app captures are under `.impeccable/review/`; the images do not constitute comp approval or runtime verification.

## Layout contract

### Latest interaction refinement

The user requested a collapsible scene composer plus saved-status sorting and a layout selector. These are implemented in the current application, although the earlier generated references omit them. The attempted image revision failed authentication; later implementation followed the user's requirements directly. Do not infer a replacement image or comp approval from the implemented controls.

- **Collapse the entire scene composer.** Place a Hide scene icon with an accessible label and tooltip beside its heading: 32px on desktop, 44px on mobile/coarse pointers. Collapsing removes the whole column and lets results occupy the available width; do not leave an empty sidebar or just collapse the fields inside it. A persistent Show scene button in the results toolbar restores it. Keep the scene text, result count, generation type and AI settings intact. Initially open when there are no results; do not collapse automatically while someone is editing. Return focus to the visible toggle when hiding a panel containing focus.
- **Keep context accessible when collapsed.** Show a compact summary of generation type and scene beside Show scene where space permits. Reopen the composer to change settings or generate again. No new floating action or duplicate controls are needed.
- **Sort menu in the results header.** Options: Original order (default), Saved first, Unsaved first. Sorting never filters or changes the result count. Keep original generation order within each saved-status group. All quips stay available, and Original order restores the generated sequence.
- **Grid/List selector beside Sort.** Two labeled controls with small icons and a clear selected state. Grid is the existing responsive two-column arrangement; List is one continuous column with compact actions. Preserve selected layout and sorting when opening/closing the composer. On narrow screens use a single column and omit a redundant layout switch while retaining the desktop preference.
- **Toolbar hierarchy.** Heading and result count at the left; Show scene when applicable, Sort and Grid/List on the same compact toolbar. At narrow widths allow controls to wrap without shrinking touch targets. Collapsing the scene must increase useful reading space in either layout.
- **Interaction/accessibility.** Use installed shadcn/Base UI selectors through `FolioSelect`, alongside the existing disclosure/toggle controls; preserve keyboard operation, visible focus, expanded/pressed state and clear accessible labels. Toolbar Select and Grid/List outer heights match at 44px; Grid/List inner buttons are 42px high. No animated column-width transition or decorative reordering animation. Verify focus remains usable when saving under a saved-status sort.

The state pair for comparison remains composer expanded with Grid selected and Original order, versus composer collapsed with List selected and Saved first, using the same 12-result set.

- One compact desktop header groups the product name, character selector/details, Edit, Write, Saved lines and Settings. No separate oversized profile heading or permanent artwork sidebar.
- Desktop composer targets 280–320px, with generation type, scene, line count, advanced AI settings and Generate grouped tightly.
- Results use the remaining width. Two columns on wide screens, one when there is insufficient width for two readable passages. Row-major reading order; no masonry or separate column scrolling.
- Show twelve realistic quips in the example. Keep the existing 1–25 result range. Longer content and additional results extend the document; do not shrink text or clip passages to force a fit.
- Entries grow with their text. Within a two-column grid, each row follows its taller entry. Use compact separators rather than large fixed-height cards.
- Dialogue targets 18–20px with comfortable line height, headings 22–24px, controls 14–16px on desktop and at least 16px for mobile inputs. Save/Copy remain visible. Mobile targets remain at least44px despite compact visual styling.
- Use ordinary page scrolling. The divider extends through the desktop workspace, while composer controls retain their natural height; empty space below them is preferable to invented filler.

## Palette and typography

| Role                  | Light                                   | Dark                                                                                                |
| --------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Page                  | `#F3F1EB` neutral paper                 | `#232225` charcoal                                                                                  |
| Primary text          | `#242326` charcoal                      | `#F1EEE7` warm off-white                                                                            |
| Supporting text       | `#656166`                               | `#BDB7B9`                                                                                           |
| Input surface         | Flat neutral slightly lighter than page | `#2D2B2E`                                                                                           |
| Primary action        | `#762F3A` oxblood with off-white text   | `#942D29` deep red with off-white text                                                              |
| Saved/selected marker | `#762F3A`                               | Deep red `#942D29` saved-button fill with off-white label; brick red `#C4483C` navigation underline |

The user rejected the previous dark-mode rose as too pink. Use red fills/markers with off-white text instead of tinting red labels toward pink. Keep neutral outlines where needed for control visibility. The wordmark and active navigation labels remain off-white. Validate all token pairs, focus rings and control boundaries during implementation. The images are not an accessibility certification.

Literata is the implemented literary face for dialogue and small headings; Source Sans 3 is the interface face. The user-confirmed product name is Ghost Writer. Use flat surfaces, no simulated parchment or cloth, scenic illustration, ornamental logo or generated portrait.

## Optional portrait

Only show an image when the user uploads one. Keep it small beside the character identity. The default shown in these references is complete without any portrait or image placeholder. Upload/replace/remove is implemented in the shared character form, with portrait validation and backup handling. Create/edit uses dedicated pages.

The labeled portrait field and its upload/replace button align with the name input; the editor preview is 44px square. Desktop description textarea bottoms align, with helper text below their shared row. Delete character directly opens confirmation from an icon button. PDF attachments show noninteractive filename, formatted B/KB/MB size and local Added timestamp with a separate removal icon and Reading PDF loading state. Optional metadata survives backups; legacy file details remain unavailable. Review captures for these browser corrections are under `.impeccable/review/comments/`; they do not alter the historical generated images.

## Mobile and dark mode

The dark mobile reference shows the post-generation state. A compact Scene and settings disclosure makes the composer reachable while leaving the reading area useful. It should stay expanded while composing; the user can expand it again to revise the scene. Preserve text and focus when collapsing it.

Twelve results exist in the example, but only a readable subset is shown on a phone; the rest follow on ordinary scrolling. Fixed bottom Write/Saved lines navigation requires safe-area padding and content padding so it never covers actions. This is a static composition, not verified responsive behavior.

## Image review and translation notes

Desktop: all twelve distinct quotes are present in two columns and six logical rows, the line-count input is12, two entries show Saved, and every entry has visible actions. Header context shares one row. The composer is narrower after a targeted correction. Generated measurements remain approximate: the implementation must enforce the 280–320px target and actual CSS font sizes rather than treating raster pixels as verified CSS dimensions.

Mobile: the current color correction supersedes the pale-rose version. It preserves the layout and dialogue, uses a deep red fill for Saved, off-white labels/icons, and a red active underline. The top area can be tightened at a real390px viewport; do not scale the entire raster to claim the layout fits. Flat colors and pixel-sharp live text are implementation requirements.

No real provider calls, real character data, or runtime behavior are represented by these synthetic examples. The current application implements this direction; tests and browser verification are separate evidence. The user's later interaction and dedicated-page decisions override raster details. No persisted seed key, formal comp-led build-state/spec/diff or QUALITY BAR card was found; this revision does not fabricate those records.
