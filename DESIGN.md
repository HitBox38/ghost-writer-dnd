---
name: Dense Folio
description: A compact character dialogue workspace for preparation and live play.
colors:
  paper: "#f3f1eb"
  ink: "#242326"
  surface: "#f9f8f4"
  popover: "#faf9f5"
  primary: "#762f3a"
  primary-label: "#fff9f2"
  muted: "#e9e6df"
  muted-text: "#656166"
  hover: "#e5e1d9"
  destructive: "#8c2628"
  border: "#d4cfc7"
  input-border: "#9c9694"
  control: "#fbfaf7"
  dark-paper: "#232225"
  dark-ink: "#f1eee7"
  dark-surface: "#2d2b2e"
  dark-popover: "#302e32"
  dark-primary: "#942d29"
  dark-muted: "#343237"
  dark-muted-text: "#bdb7b9"
  dark-hover: "#3d393f"
  dark-border: "#48444b"
  dark-input-border: "#827c85"
  dark-ring: "#e5d4cc"
  dark-active-marker: "#c4483c"
  dark-primary-border: "#b67871"
typography:
  headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "23px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  dialogue:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  supporting:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "14px"
    lineHeight: 1.45
rounded:
  segment: "3px"
  field: "5px"
  button: "6px"
  base: "8px"
  dialog: "12px"
spacing:
  tight: "8px"
  control-gap: "12px"
  compact: "16px"
  group: "24px"
  section: "28px"
  column: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-label}"
    rounded: "{rounded.button}"
    padding: "9px 13px"
  button-primary-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.primary-label}"
    rounded: "{rounded.button}"
    padding: "9px 13px"
  button-saved:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-label}"
    rounded: "{rounded.button}"
    padding: "9px 13px"
  input:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "9px 11px"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.segment}"
    padding: "6px 10px"
  toolbar-segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "4px"
    padding: "6px 10px"
    height: "42px"
  select-trigger:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "8px 11px"
    height: "44px"
  dialogue-entry:
    typography: "{typography.dialogue}"
    padding: "23px 0 13px"
---

# Design System: Dense Folio

## Overview

**Creative North Star: "Dense Folio"**

Ghost Writer uses a character's working folio: literary dialogue on neutral paper or charcoal, with restrained oxblood and red actions. Preparation and live retrieval have equal importance. The interface earns its identity through readable passages, compact controls and useful character context. Dense Folio names the visual direction; Ghost Writer is the user-confirmed product name.

This records the implemented replacement system, extracted from `app/folio.css`, `app/layout.tsx` and the current workspace, settings and character components. The user selected Folio and subsequently pinned its density and palette; the decision images are critique references, not pixel specifications. [The direction contract](docs/design/direction-contract.md) records that authority and missing process artifacts without claiming retrospective approval.

**Key Characteristics:**

- Literary passages with compact sans-serif controls.
- Flat neutral surfaces and restrained red states.
- Content-sized entries with visible Save and Copy actions.
- Optional uploaded portraits; a complete interface without artwork.

## Colors

Neutral paper and charcoal carry the page; oxblood and deep red make actions and saved state legible.

Frontmatter records shipped color values. The sidecar's eight-step tonal ramps are synthesized OKLCH preview aids, not additional application tokens.

### Primary

- **Oxblood** (`primary`): light-mode primary actions, saved fills, focus and active navigation.
- **Deep red** (`dark-primary`): dark-mode primary actions and saved fills, paired with `primary-label` text.
- **Brick marker** (`dark-active-marker`): dark-mode active navigation underline. Navigation labels remain off-white.
- **Destructive**: restrained dark red on light surfaces; dark-mode destructive text uses `dark-ink` rather than pink.

### Neutral

- **Paper / charcoal** (`paper`, `dark-paper`): page backgrounds; `ink` / `dark-ink` supply body text.
- **Control and surface**: slightly differentiated neutral fills; popovers have their own neutral layer.
- **Muted and hover**: supporting regions and interaction feedback; muted text stays distinct from primary text.
- **Border / input border**: quiet separators versus more visible interactive boundaries. Dark primary buttons add a lighter boundary.
- **Focus**: light mode uses oxblood; dark mode uses the pale neutral `dark-ring`.

**The Red State Rule.** Use deep red fills and off-white labels in dark mode; do not replace them with pink text.

## Typography

**Display and dialogue font:** Literata, with Georgia and serif fallbacks. **Interface font:** Source Sans 3, with sans-serif fallback. Both are loaded in the root layout.

Literata gives spoken lines a literary voice without ornamental lettering. Source Sans 3 carries fields, navigation, metadata and actions.

- **Headline:** page headings use the headline token. The workspace heading is deliberately smaller at the title scale.
- **Title:** section headings use the title token; tertiary headings use 20px, weight 500.
- **Dialogue:** the dialogue token remains 19px on mobile, with a maximum measure of 75ch, preserved line breaks and long-word wrapping.
- **Body:** fields inherit the 16px body size, including on mobile.
- **Labels and support:** field labels use the label token; helper text uses the supporting token. Compact metadata may use 13px; the keyboard hint uses 12px.
- **First-use heading:** onboarding uses `clamp(32px, 4vw, 44px)`; this is an empty-state treatment, not the operating workspace scale.

**The Dialogue First Rule.** Reduce surrounding chrome before reducing the size or clipping the content of a spoken line.

## Layout

The main container caps at 1680px, with 32px desktop side padding. A 320px shadcn Sidebar composer sits beside the flexible reading area, separated by a quiet rule and 28px gap. The divider stretches through the desktop workspace, including below the finite composer controls. Hiding the composer removes its whole column. Results use two row-major columns or one List column; entries grow with content. The writing workspace fills the available viewport with independent, keyboard-focusable scroll areas for the sidebar fields and results list. SidebarHeader and SidebarFooter keep the heading, Generate action and status messages visible around SidebarContent. On phones, the scene opens in the Sidebar’s accessible Sheet drawer, with focus restoration and retained inputs; successful generation closes it to reveal the full-height results. Preserve support for 1–25 results and avoid masonry.

At 1200px, gaps compact and secondary character detail hides. At 980px, results become one column and the redundant layout switch hides while retaining the selected desktop preference. At 700px, the workspace stacks, side padding becomes 16px, and Write/Saved lines navigation moves to the bottom. Bottom navigation, page padding, editor actions and toast placement account for safe areas. Count labels stay on one line while toolbars can wrap.

Settings and character editing are dedicated pages capped at 1120px. Settings uses a 210px section rail (180px at the intermediate breakpoint), then a labeled section selector on mobile. The editor groups identity, basic attributes, descriptions and attachments; descriptions stack on mobile. Short related basic fields may remain paired. Preserve the scalable Settings sections: AI connections, Appearance, Data & backups.

The spacing vocabulary is compact but not a strict mathematical scale: source-defined field gaps include 7px, 17px and 22px. Do not round every measurement merely to impose a new grid.

## Elevation & Depth

The operating pages are flat: separators, neutral fills and typography establish hierarchy. Do not give dialogue passages raised-card shadows. Shared outline buttons retain their small utility shadow, and overlays use a thin ring with a lightly blurred backdrop. These limited utility treatments do not turn the folio into a stack of cards.

**The Flat Passage Rule.** Dialogue sits directly on the page with a bottom separator; reserved or nested card shells must not replace that reading surface.

Motion is limited to brief interaction and overlay feedback, the scene sidebar collapse and AI generation feedback (user request, 2026-09-27). The scene sidebar collapse uses a reversible 220ms transition, with the toggle anchored at the same position in both states. While lines are being written, a 2px oxblood sweep runs along the results rule; an empty results area shows one shimmering draft placeholder per requested line, and existing lines dim to 50% but stay usable. Lines from a finished generation rise 8px and fade in over 280ms with a 60ms stagger capped at eight steps, then write themselves out word by word behind an oxblood caret, paced at up to 16ms per character and at most 1.4s per line. The unwritten remainder stays in the layout as transparent text, so heights, wrapping, copy and screen-reader text never change. The arrival plays only when a generation finishes in view — not on sorting, remounting or character switches. Inline errors and the connection-verified mark enter via `@starting-style`. Curves use the `--ease-out` and `--ease-in-out` tokens in `folio.css`. Keyboard-triggered changes are instant and reduced motion uses the existing near-zero duration with delays removed; the progress sweep becomes a static rule and lines appear fully written. Result reordering does not animate. Reduced-motion CSS shortens animations and transitions and restores automatic scroll behavior.

## Shapes

Fields and text links have small corners; buttons and segmented shells are slightly rounder. Segmented selections use the smallest radius. Dialogs use the larger dialog radius. The optional identity portrait is a small rectangle with soft corners, not a decorative medallion. Thin rules divide passages and settings rows; the system has no ornamental logo, simulated texture, gradient or oversized quotation marks.

## Components

### Buttons

Primary buttons use the primary fill and off-white label; shared buttons normally have a 44px minimum height, compact padding and visible focus. The compact Hide scene icon is 32px on desktop and 44px on mobile or coarse pointers, with an accessible label and tooltip. Delete-character and remove-PDF icons use 44px targets. Default buttons soften their fill on hover; outline and ghost variants use neutral hover fills. Disabled primary buttons use muted surface and text. Saved actions use the saved red fill and a visible label. Do not hide actions until hover.

### Inputs / Fields

Neutral control surfaces have a distinct input border, field radius and 44px minimum height. Textareas resize vertically. Keep persistent labels, helper text and inline errors. Global keyboard focus uses a 2px outline with 3px offset; shared buttons also retain their primitive focus ring. Range inputs currently use a 32px minimum track box; this is not a new minimum target standard.

Selectors use the installed shadcn/Base UI Select through `components/folio-select.tsx`, preserving its keyboard and popup behavior. Triggers use a 44px height, neutral control surface and no shadow; toolbar sort and the Grid/List shell align at the same outer height. Select menus use highlighted neutral rows, 36px on desktop and 44px on mobile. Do not replace this shared selector with a browser-native select.

### Navigation

Write and Saved lines have equal prominence and a thin active underline. Settings retains its own link. Desktop settings navigation marks the selected section with a neutral fill and stronger weight; mobile uses a labeled shared FolioSelect. Navigation and primary controls remain reachable above safe-area insets.

### Segmented choices

Generation type, layout and theme use labeled choices in a compact neutral shell. The selected segment inverts foreground and page colors and exposes its pressed state; unselected choices receive a neutral hover fill. The results-toolbar Grid/List shell is 44px high with no inset padding or gap; its buttons are 42px high with 4px corners. Other segmented controls retain their existing inset styling. Do not turn these controls into decorative category chips.

### Dialogue entries and composer

Passages use an open, content-sized reading surface with visible Save and Copy actions. Stable saved-status sorting changes order without filtering; Original order restores generation sequence. Hiding the composer preserves the writing session and gives the reading area its width; Show scene exposes a compact context summary and restores editing. Focus returns to the visible disclosure control.

### Dedicated forms

Settings separates saving a provider key, testing a connection and choosing a provider. Character create/edit share one form, with optional portrait upload/replace/remove and no empty image placeholder. Keep drafts available after failed saves; use confirmations for discards, deletes and replacement imports. Backups exclude provider credentials. These commitments are detailed in [PRODUCT.md](PRODUCT.md).

The portrait field has its own label and aligns its 44px upload/replace control with the name input; an uploaded preview is 44px square. Desktop description textareas align at their lower edge, with supporting backstory copy below the shared row. Delete character is a direct icon action opening confirmation, without an intermediate one-item menu. A PDF attachment appears as noninteractive filename, formatted size and local “Added” timestamp, with a separate removal icon. Show “Reading PDF…” while processing and “Original file details unavailable” for legacy attachments without metadata; never invent their original details.

## Do's and Don'ts

### Do:

- **Do** keep preparation and live retrieval equally accessible.
- **Do** preserve content-sized dialogue and visible Save/Copy actions.
- **Do** use labeled controls, visible focus, readable mobile inputs and safe-area padding.
- **Do** use optional uploaded portraits only; the page must be complete without one.

### Don't:

- **Don't** substitute pink labels for dark-mode red fills and off-white text.
- **Don't** add decorative art, faux parchment, gradients, ornamental logos or nested dialogue cards.
- **Don't** animate result reordering or add motion beyond the sidebar collapse and the documented generation feedback.
- **Don't** treat generated reference images as approved CSS measurements or proof of runtime verification.
