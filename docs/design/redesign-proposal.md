# D&D dialogue app: redesign proposal

> **Superseded exploration:** the current user-directed design is [the dense charcoal/oxblood Folio revision](dense-folio-revision.md). The green palettes, artwork-led concepts and spacious layouts below record earlier iterations; they are not the current implementation brief.

Status: concept review, 26 September 2026. No production UI changes. The user confirmed equal priority for preparation between sessions and use during a live game.

## Recommendation

**The Adventurer’s Folio, revised**: a character’s dialogue notebook whose identity comes from literary typography, deliberate spacing and restrained green ink. Writing and saved lines have equal prominence. A small bookmark ribbon marks saved dialogue.

**Latest user preference:** less artwork. No decorative illustration or generated character art. An optional user-uploaded portrait can sit beside the character name; when absent, the layout is text-only with no empty image frame or reserved portrait space. The former full-height character spine becomes a compact character header, giving the dialogue more room. Portrait upload is a proposed new capability, not an existing feature or an implementation completed in this task.

This is a proposal, not an approved design system. Keep the existing product name until naming is discussed separately. Sample character Mira Thorn and all dialogue in the images are fictional demonstration content.

| Direction              | My assessment         | Strength                                                         | Cost                                                                                                    |
| ---------------------- | --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| The Adventurer’s Folio | 9/10                  | Strong tabletop identity through type and readable dialogue      | Typography and proportion must carry the identity without decorative artwork                            |
| Adventure Panels       | 8/10                  | Most expressive; makes speaking in character immediately visible | More artwork, less room for text, and scene-specific images could imply a feature the app does not have |
| Quiet utility          | 6.5/10 for this brief | Clear, fast, modest implementation effort                        | Too little distinctive D&D identity for the requested overhaul                                          |

These are subjective fit ratings, not measured usability scores.

The comparison above records the initial exploration. The artwork-heavy Adventure Panels direction no longer matches the user's preference and is not the current recommendation.

## Visual references

- [Current revised Folio desktop, no portrait uploaded](../../.impeccable/mocks/decision/folio-minimal.png)
- [Earlier Folio desktop, superseded](../../.impeccable/mocks/decision/adventurers-folio.png)
- [Earlier Folio mobile saved lines, artwork superseded](../../.impeccable/mocks/decision/folio-mobile.png)
- [Adventure Panels desktop](../../.impeccable/mocks/decision/adventure-panels.png)
- [Quiet utility desktop](../../.impeccable/mocks/decision/quiet-utility.png)

Generated with the built-in image tool. Exact prompts, edit instructions and approval status are in matching JSON sidecars. The review page runs locally at http://127.0.0.1:32819/ while its process remains active. Images and this document remain available independently.

## What the current app needs

Inspected the populated Generate screen at desktop and 390px mobile width in an isolated browser. Created only a fictional character; no live AI request or API key was used. Also reviewed generation, favorites, profile, settings, shared actions, primitives and theme source.

| Before                                                       | Proposed after                                                           | Why                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| Provider, model and temperature precede the scene prompt     | Scene first; AI settings under a labeled disclosure                      | The player is thinking about the encounter             |
| Generic sparkle branding and neutral rounded containers      | Deliberate typography, compact character identity, open dialogue surface | Identity comes from the character and the writing task |
| Results are small text inside a card inside a card           | Open dialogue entries, 20–24px text on desktop                           | Lines should be easy to read aloud                     |
| Result actions use `opacity-0 group-hover:opacity-100`       | Visible Save/Copy actions, with visible focus                            | Touch users should not have to discover hover behavior |
| Shared action targets are 28px square                        | At least 44px touch targets                                              | Better precision during play                           |
| Mobile composer places generation below many settings        | Compact scene composer, optional advanced settings, document scrolling   | Reduces travel to the primary action                   |
| Results/favorites use viewport-derived nested scroll heights | Normal page scrolling on mobile                                          | More predictable with keyboard and browser chrome      |

Evidence: `generation-controls.tsx`, `results-display.tsx:53–60`, `components/shared/action-buttons.tsx`, and `favorites/page.tsx`. These are proposed changes, not completed fixes.

## Product world and signature

Domain: character sheets, speaking in character, marginal notes, campaign journals, treasured quotations, spell reference cards, the transition from preparation to performance.

Natural color/material references: green cloth binding, pale page stock, dark green ink, silver sage, pencil gray, muted red correction marks. Green is an art-direction choice, not an established brand requirement.

Signature: a saved line becomes a bookmarked passage. Keep a small saved-line margin ribbon and the Saved navigation icon. Use a typographic wordmark and restrained navigation indicator; do not manufacture decorative motifs to replace the removed artwork. Only saved entries receive the ribbon.

Avoid generic sparkle identity, ornate medieval control chrome, fake distressed parchment, cinematic backgrounds behind text, and box-in-box layouts. Keep familiar native control behavior and plain-language labels.

Exploration included seven systems: character folio, stage promptbook, tavern noticeboard, heraldic banners, spell-card deck, tabletop zine, and fantasy comic panels. The Impeccable exploration surfaced the comic direction; the folio is my product-fit recommendation. Its additional tape, cloud, folded-paper, instrument and arcade challengers were rejected for weaker audience identification and product clarity. Their useful disciplines—clear controls, equal primary navigation, restrained color, structural mobile adaptation, persistent context and consistent artwork—inform both main proposals, without importing those unrelated visual themes.

## Proposed visual system

| Token/role               | Light                                               | Dark                                                      |
| ------------------------ | --------------------------------------------------- | --------------------------------------------------------- |
| Main page                | `#EDF0E5`                                           | `#14261F`                                                 |
| Primary text             | `#172C26`                                           | `#EDF0E5`                                                 |
| Secondary text           | `#52645B`                                           | `#9AAF9F`                                                 |
| Binding / primary button | `#203A34`                                           | `#9AAF9F` with dark text                                  |
| Raised surface           | `#F6F8F0`                                           | `#203A34`                                                 |
| Error text               | Muted red, contrast validated during implementation | Light muted red, contrast validated during implementation |

Calculated contrast for flat token pairs: primary text/page **12.77:1**; secondary text/page **5.46:1**; light text/green button **10.60:1**; sage/green **5.25:1**. These calculations do not certify the generated images or every future state. Focus, control boundaries, errors and disabled states require separate checks.

Typography: [Literata](https://fonts.google.com/specimen/Literata) for character names and dialogue; [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) for navigation, labels, fields, buttons and metadata. Proposed sizes: 14px metadata, 16px controls, 20–24px dialogue, 28–32px page headings. Keep prose roughly 45–65 characters wide. Use real semantic text, never flattened UI images.

Use a 4px spacing unit: 8px within small controls, 16px within form groups, 24px between groups, 32px between dialogue entries. Controls use 4–6px corners; dialogs may use 12px. Avoid a universal radius. Use flat surfaces without simulated paper or cloth textures. Preserve the installed Lucide set for utility icons and use a typographic product wordmark.

## Layout and behavior

Desktop: a compact top navigation and character identity row replace the artwork-led sidebar. An optional uploaded portrait sits beside the name at approximately 48–64px; no portrait means no image slot. Write has a compact composer around 300–340px and a wider dialogue reading area. At 1280px wide, the scene, Generate button and first results should remain visible without a promotional hero.

Write order: character context → generation type → scene → number of lines → Generate. AI settings remain reachable below the scene, with provider/model summary and a truthful configured/missing-key state. Preserve optional context, the full 1–25 result range, model selection and temperature. The mockups’ three lines are an example, not a reduced capability.

Saved lines: search and existing type filters above open quote entries; preserve original context and random selection. Copy is prominent. Removal remains explicit and confirmed, with the Base UI alert dialog replacing the browser confirm if implemented. Keep the existing character-specific storage behavior.

Character editing: group existing fields into identity, character description and campaign context. Keep character-sheet upload. Add an optional portrait upload with replace/remove controls in a future implementation; do not generate artwork or assign stock portraits. Store and export/import portrait data consistently with the character, with file type/size validation and clear storage errors. Exact image processing/storage limits need to be set during implementation. On desktop use a spacious dialog; on mobile use a full-height accessible sheet with a visible title and close action.

Settings: retain provider credentials and connection tests, appearance, and data import/export. Keep destructive data operations separate from routine actions. Use plain language for credentials: source confirms generation passes a supplied key through a server action to the selected provider. Do not repeat the current misleading claim that credentials never leave the browser.

Mobile: compact character strip, one reading column, Write/Saved lines bottom navigation with safe-area padding. On Write, present the compact form and flow into results; do not force a miniature desktop split. Keep 16px inputs, selectable dialogue, pinch zoom, visible labels, ordinary page scrolling and accessible tap alternatives. No swipe-only save/delete. Verify software keyboard, landscape and safe areas on a real phone; browser emulation alone is insufficient.

## States to design before implementation

| State                                 | Treatment                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| No character                          | A short typographic explanation and Create character action, without illustration               |
| Missing provider key                  | Inline setup explanation and Open settings action; no unexplained disabled button               |
| Ready, no results                     | Brief example of a useful scene prompt, clearly labeled example dialogue if shown               |
| Generating                            | Stable existing reading area, visible “Generating lines…” status, duplicate submission disabled |
| Success                               | Announce completion once; leave focus predictable; visible Save/Copy actions                    |
| Error                                 | Preserve input and previous results; specific inline message and Retry action                   |
| Saved confirmation                    | Bookmark state and “Saved” label, polite announcement                                           |
| Copy failure                          | Inline/toast feedback with a manual selection fallback                                          |
| Empty favorites / no search match     | Separate explanations and relevant next action                                                  |
| Long names, long dialogue, 25 results | Wrapping, growing entries, no fixed-height clipping                                             |

Current generation returns a completed response. Do not fake token streaming or a percentage progress bar. Streaming/cancellation would be a separate behavior change.

## Motion proposal and review

| Location                             | Today                                                  | Purpose / frequency             | Proposed motion                                                                             |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------- |
| Save state in shared actions/results | Heart state changes, no dedicated saved-line treatment | Feedback; frequent              | Instant state and label change; optional 120ms opacity transition on pointer input only     |
| Settings/character overlays          | Stock 100ms fade/zoom classes                          | Spatial consistency; occasional | Pointer-open 200ms opacity and scale `.97 → 1`, `cubic-bezier(.23,1,.32,1)`; 150ms close    |
| Mobile editor sheet                  | Proposed surface                                       | Spatial consistency; occasional | 240ms translate from bottom, `cubic-bezier(.32,.72,0,1)`; 180ms exit; visible close control |

Reduced motion keeps the content stationary and can use a short opacity change. Keyboard navigation and keyboard-opened controls respond immediately. Hover styling is gated to devices that support hover.

Rejected: page-turn animations on navigation (frequency); typewriter text (delays reading); flying bookmarks (moves functional content); looping sparks/parallax (no task purpose); stagger across 25 results (delays access). The app needs little motion. Clear state feedback is the highest-value opportunity.

| Before                                                                        | After required in a later implementation              | Why                                                                     |
| ----------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `components/ui/button.tsx:6` uses `transition-all`                            | Name the affected properties                          | Avoid accidental layout animations                                      |
| Dialog/select source has motion classes without local reduced-motion variants | Explicit reduced-motion and keyboard-trigger behavior | The motion contract should be verifiable, not assumed from a dependency |
| Results actions fade in only on hover                                         | Keep actions visible; focus never depends on hover    | Essential controls must remain discoverable                             |

Motion verdict: **Block copying these patterns unchanged into the redesign.** This is a scoped source review and proposed contract, not a claim that production motion was fixed or fully tested.

## How the skills informed this proposal

| Skill                               | Contribution at this stage                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| brandkit                            | A coherent typographic identity and restrained palette; artwork-led branding superseded by user preference                              |
| redesign-existing-projects          | Audit of current visual defaults while preserving features and stack                                                                    |
| image-to-code                       | Full-size generated desktop concepts and a separate mobile reference before code                                                        |
| frontend-design                     | Product-specific typography, restraint, rejection of generic visual treatments                                                          |
| Impeccable                          | Confirmed live/preparation priority, product record, direction exploration and review page                                              |
| Interface Design                    | Domain exploration, focal hierarchy, palette, density, signature and component roles                                                    |
| UI/UX Pro Max                       | Cross-check of writing-app and interaction guidance; rejected its first generic landing-page match                                      |
| emil-design-eng                     | Before/after review, quick feedback, restrained and interruptible motion                                                                |
| prototype                           | Compare genuinely different presentation strategies in isolation; interactive component prototypes deferred until a direction is chosen |
| mobile-native                       | Safe areas, touch targets, input sizing, viewport and real-device verification requirements                                             |
| find-animation-opportunities        | Three bounded motion opportunities and explicit rejections                                                                              |
| animate                             | Precise motion recipes; no production animation code in a proposal-only task                                                            |
| review-animations                   | Scoped review of existing transition patterns and a clear implementation gate                                                           |
| fixing-accessibility                | Persistent actions, semantic text, keyboard focus, contrast and feedback states                                                         |
| web-design-guidelines               | Current official guidelines checked for focus, labels, responsive content and touch behavior                                            |
| vercel-react-best-practices         | Keep typing responsive, load nonessential artwork sensibly, avoid unnecessary client work                                               |
| vercel-composition-patterns         | Reuse composer/quote/actions across routes; explicit variants instead of many booleans                                                  |
| react-doctor                        | Retain as implementation check; no new scan represented as run for this image-only proposal                                             |
| shadcn guidance                     | Style the existing Base UI primitives; do not add components simply because they exist                                                  |
| Next.js guidance                    | Keep existing routes and server/client boundaries; use appropriate font/image loading                                                   |
| AI SDK guidance                     | Respect actual non-streaming behavior and provider setup; do not imply fake progress                                                    |
| Browser and end-to-end verification | Current desktop/mobile browser inspection; future flow checks specified below                                                           |

Conflicting defaults were resolved in favor of this task: a working app over marketing layout rules, sparse motion over blanket animation, existing Base UI over stale Radix-oriented examples, and a proposal over build-only skill steps.

## Mockup analysis and corrections to carry forward

**Current revised mockup:** no portrait, illustration, or empty image slot. A compact character row replaces the left spine; typography and a functional saved-line ribbon carry the character. Sans-serif controls are now distinct from literary headings/dialogue. The image still has slight tonal shading from generation; actual surfaces should be flat semantic colors. Exact font sizes will be normalized for the target viewport. This is the current reference; the artwork-specific details in the earlier analyses below are historical and superseded.

Folio: left character spine, distinct top tabs, two working columns, quotes as focal content, minimal radius and no result cards. Dark green and pale page contrast works structurally. The generated desktop image exaggerates the portrait and uses serif text for controls; build references must reduce the portrait and specify Source Sans 3 controls. The large product name should wrap compactly on phones. Remove double quotation decoration if it competes with the prose. The ribbon must supplement the Saved text label.

Adventure Panels: recognizably fantasy and legible, but the scene art occupies more space than requested and the generator added slogan copy and a wand. Those are not approved product copy or assets. A real implementation would use a small static branded illustration, not promise generated scenes or character likenesses.

Mobile: the revised image removes the first draft’s blotchy background. The 2:3 composition is an art-direction reference, not proof that all three entries fit a real 390×844 viewport. At real size, move the random action below the filter row, reduce the heading, allow scrolling, and retain 44px targets. Do not shrink all contents to match the image.

Quiet utility: clear controls and open results; a useful baseline, but too generic to satisfy the identity goal as strongly as the folio.

The images are conceptual references. Exact responsive dimensions, every interaction state, artwork selection and final font rendering remain design/implementation work after selection.

## Implementation sequence after selection

1. Confirm the revised visual direction; record optional user-uploaded portraits and a complete text-only default. Refine desktop/mobile first-view references.
2. Establish tokens, typography and application navigation; style existing primitives.
3. Rework Write and Saved lines with shared quote/action patterns, preserving storage and AI behavior.
4. Apply the same system to character editing, settings and all loading/empty/error states.
5. Verify create/edit/switch character → configure provider → generate → save → search/copy/remove → export/import. Use mocked generation for routine browser checks; a live provider check needs configured credentials.
6. Run typecheck, lint, build, relevant unit/E2E checks, React Doctor, keyboard/focus and reduced-motion checks; inspect 390px, 768px, 1280px and 1440px. Confirm mobile behavior on hardware before claiming native-quality completion.

No test suite was rerun for unchanged app code. This turn verified the incumbent UI and the concept-review page, not an implemented redesign.

## Sources

- [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): current interaction/accessibility cross-check.
- [Literata](https://fonts.google.com/specimen/Literata) and [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3): proposed font families.
- Installed skill files under `.agents/skills` and Vercel plugin guidance; current repository source and browser inspection.
