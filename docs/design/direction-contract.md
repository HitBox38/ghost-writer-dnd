# Dense Folio direction contract

Status: consolidated after implementation on 2026-09-26 from the user's confirmed decisions and current source. This is a record of the final direction, not a reconstructed pre-build approval artifact.

## THESIS

A compact character dialogue folio that supports preparation and live play equally. Literary passages are the main content; controls remain plain, visible and efficient. Use the user-confirmed product name, Ghost Writer; Dense Folio remains the visual direction.

## OWN-WORLD

Neutral paper, charcoal ink and restrained oxblood anchor light mode. Charcoal surfaces, warm off-white text, deep red saved/primary fills and a brick-red navigation marker anchor dark mode. The user explicitly rejected pink. Literata supplies the literary voice; Source Sans 3 makes the interface readable. Flat surfaces and fine separators carry the material character. No decorative art, faux parchment, gradients, ornamental logos, oversized quotation marks or nested dialogue cards. A user-uploaded portrait is optional; absence creates no placeholder or reserved art panel.

## STORY

Choose or create a character, describe the scene, generate 1–25 lines, read and save useful passages, and retrieve them during play. Write and Saved lines are equally important. Per-character scenes and generated results survive in-app navigation. Saved-status sorting is stable and never filters; Original order restores the generated sequence. Dedicated create/edit pages share one character form. Dedicated Settings supports AI connections, Appearance, and Data & backups and can grow by section. Save, test and choose-provider actions remain distinct. Failed saves preserve edits; discard, delete and replacement import actions are confirmed. Backups exclude provider keys.

## FIRST VIEWPORT

The populated desktop writing screen begins with a compact product/character/navigation header, then a 320px scene sidebar beside the results. Two content-sized columns expose varied-length dialogue with visible Save/Copy actions; the toolbar provides result count, stable sorting and Grid/List. Hiding the composer animates its column closed over 220ms; one anchored toggle changes its accessible label between Hide scene and Show scene. The mounted, hidden form is inert and retains its inputs and scroll position. It does not discard the session or automatically collapse during editing.

Narrow writing layouts use one full-height reading column. Show scene opens the shadcn Sidebar’s mobile Sheet drawer, with scrollable fields and a fixed Generate footer. Closing retains inputs and restores focus; successful generation closes the drawer to reveal results. Other routes retain ordinary document scrolling. The phone header keeps character context; Write/Saved lines navigation sits above the safe area. Controls may wrap without shrinking their targets. The composer remains explicitly reachable and keyboard focus follows its visible toggle. The no-character viewport instead provides a concise create-character entry point; it does not fabricate a populated session.

## FORM

The implementation uses a 1680px maximum main container, 320px sidebar, 19px dialogue and 23px section headings. Dedicated Settings and editor pages cap at 1120px. At 980px results become one column; below 768px the scene uses a Sheet drawer; at 700px mobile navigation appears. Inputs inherit 16px type; principal controls have 44px minimum height. Forms have persistent labels, helper text, inline errors and visible focus. Natural content height, overflow wrapping and safe-area padding take precedence over resemblance to a raster reference. Brief feedback, overlays, the explicit sidebar collapse transition and AI generation feedback (pending sweep, draft placeholders, one-time line arrival) may animate; result reordering does not. Reduced motion is respected.

## Selection and evidence ledger

The subsequent browser corrections preserve this world: use shared shadcn/Base UI selectors; align toolbar Select and Grid/List shells at 44px with 42px inner segments; use a 32px desktop Hide scene icon that becomes 44px on mobile/coarse pointers; extend the divider through the workspace. Align portrait upload with the name input, use a 44px preview, and align desktop description textarea bottoms. Character deletion directly opens confirmation. PDF attachments expose noninteractive filename, formatted size and local Added timestamp, a separate removal icon and Reading PDF status. Optional attachment metadata survives backups; legacy missing details remain explicitly unavailable. These are implemented corrections, with review captures under `.impeccable/review/comments/`; verification is reported separately.

1. [The historical proposal](redesign-proposal.md) records seven explored systems: character folio, stage promptbook, tavern noticeboard, heraldic banners, spell-card deck, tabletop zine and fantasy comic panels. It records that the Impeccable exploration surfaced comic panels, while Folio was the product-fit recommendation.
2. The user selected the recommended Folio direction, requested less artwork, then pinned compact neutral-paper/charcoal/oxblood styling. Later corrections explicitly rejected pink and added composer collapse, stable sorting, Grid/List, dedicated Settings and dedicated character pages. These decisions supersede conflicting details in earlier images and exploration.
3. The [desktop reference](../../.impeccable/mocks/decision/folio-dense-desktop.png) and [dark mobile reference](../../.impeccable/mocks/decision/folio-dense-mobile-red.png) show the same direction. They are critique references. Their approximate sizes and incomplete later interactions do not override the user's requirements or the implemented CSS.
4. No persisted seed key, formal comp-led build-state/spec/diff record or QUALITY BAR card was found in the available task artifacts. Do not invent them or claim retrospective comp approval. This consolidated contract cannot substitute for missing historical evidence.
5. The source-derived current system lives in [DESIGN.md](../../DESIGN.md) and `.impeccable/design.json`. Current implementation screenshots are under `.impeccable/review/`. Test results and remaining limitations must be reported separately; this document does not certify provider calls, complete accessibility conformance or production deployment.
