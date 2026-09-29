# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Create D&D combat quips and catchphrases informed by a character profile, then save and retrieve favorite lines.

## Users and Operating Context

The user confirmed on 2026-09-26 that preparing dialogue between sessions and finding or generating a line during live D&D sessions deserve equal priority. The interface supports both writing and fast retrieval.

## Capabilities and Constraints

The repository uses Next.js/React, Tailwind and shadcn with Base UI. Characters, saved lines and preferences persist locally; AI generation uses configured provider credentials. The implemented replacement includes:

- Character profiles with dedicated create/edit pages, a shared form, optional uploaded portraits and PDF character sheets. Character deletion is a direct icon action that opens confirmation.
- Combat quips and catchphrases, a scene prompt, advanced provider/model controls and a 1–25 result count.
- A fully collapsible scene composer, Grid/List preferences and stable Original order / Saved first / Unsaved first sorting. Sorting does not filter results.
- Saved lines with search and random selection, with visible save/copy actions.
- Dedicated Settings sections for AI connections, Appearance, and Data & backups; light/dark/system theme choices.
- Provider keys saved separately, explicit connection tests and explicit provider selection. A saved key alone is not represented as a verified connection.
- Backup import/export; exported data excludes provider keys, and restored data preserves credentials already on the device.

PDF attachments show noninteractive filename, B/KB/MB size and a locally formatted “Added” timestamp. A separate icon removes the PDF, and “Reading PDF…” reports processing. Optional `characterSheetMetadata` stores the original filename, byte size and upload timestamp and survives backup export/import. Older attachments remain supported with “Original file details unavailable” rather than inferred metadata. Shared selectors use the installed shadcn/Base UI component through `FolioSelect`.

Per-character writing sessions and character drafts survive in-app navigation in memory; do not promise persistence of those transient drafts or generated results after a full reload. Layout preference is saved in settings. Failed character saves leave the draft available. Confirmation flows protect explicit discards, character deletion and replacement imports. Implementation presence is not a claim that every error path or real provider has been independently verified.

## Brand Commitments

The user approved implementing the Dense Folio replacement: neutral paper, charcoal and restrained oxblood. Dark mode uses clearly red fills and markers with off-white labels, never pale pink labels. The user-confirmed public product name is Ghost Writer; Dense Folio names the visual direction.

Identity comes from literary typography, compact layout and restrained color. Decorative illustrations, generated portraits and scenic artwork are excluded. An optional portrait is supplied by user upload, and the interface looks complete without one. Literata and Source Sans 3 are implemented.

## Evidence on Hand

Current application source, existing tests and review captures under `.impeccable/review/`. Generated images under `.impeccable/mocks/decision/` contain synthetic examples and serve as critique references. They are not runtime evidence or a comp approval record. Verification outcomes belong in the implementation's verification report, not inferred from this document. No customer, adoption or performance claims have been supplied.

## Open Decisions

No visual direction or product name remains awaiting selection for this implementation. Additional product capabilities are outside the agreed redesign scope. Future changes should preserve the confirmed direction and Ghost Writer name unless the user explicitly replaces them.

## Implementation Status and Authority

The Dense Folio replacement is implemented in the current working tree. This supersedes earlier proposal-only status. Source-derived visual tokens are in [DESIGN.md](DESIGN.md); [the direction contract](docs/design/direction-contract.md) records final commitments and evidence limitations. [The revision brief](docs/design/dense-folio-revision.md) preserves detailed interaction requirements. The earlier seven-system exploration remains historical, including its comic assignment; the user's Folio choice and subsequent density, neutral palette and dark-red corrections govern the current system.
