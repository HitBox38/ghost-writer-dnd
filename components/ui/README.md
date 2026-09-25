# UI components

This project uses shadcn's **Base UI Vega** registry (`base-vega` in
`components.json`), Tailwind CSS 4, the existing stone theme, and Lucide icons.
Components are local source files, not a versioned shadcn runtime library.

The September 2026 refresh includes the complete available Base UI component
set: menus, dialogs, drawers, navigation, form fields, comboboxes, calendars,
charts, carousels, resizable panels, sidebars, empty states, input and button
groups, keyboard hints, attachments, bubbles, messages, message scrolling,
questionnaires, and Base UI toasts. The existing Sonner integration remains
available. Data tables and date pickers are composition recipes using the
installed table/calendar/popover primitives.

## Adding or updating components

```powershell
pnpm exec shadcn info
pnpm exec shadcn add <component> --dry-run
pnpm exec shadcn add <component> --diff
pnpm exec shadcn add <component>
```

Review diffs before overwriting. Keep these local adaptations:

- `carousel.tsx` subscribes to Embla with `useSyncExternalStore`, including
  cleanup for both selection and reinitialization events.
- `hooks/use-mobile.ts` subscribes to `matchMedia` with a server snapshot.
- `slider.tsx` preserves Base UI's generic value type so change callbacks match
  the scalar or array supplied by their caller.
- `8bit/button.tsx` retains the pixel decorations and accepts Base UI button
  props, including `render`.

## Composition conventions

- Use `render={<Button />}` on dialog/menu triggers instead of Radix `asChild`.
- Use `Link` with `buttonVariants()` for navigation to preserve link semantics.
- Put menu labels inside `DropdownMenuGroup`.
- Selects receive `items` for their displayed labels; guard nullable values in
  change handlers. Sliders accept scalar or array values and use
  `aria-labelledby` to label their thumbs.
- Base UI single accordions use `multiple={false}`. Assert accessible state
  such as `aria-selected` in tests rather than Radix-specific data attributes.
- `app/globals.css` imports `shadcn/tailwind.css` for component states,
  animations, scroll fades, and shimmer utilities. `TooltipProvider` is mounted
  in the root layout.
- `cn` comes from the `cn` package; `lib/utils.ts` re-exports it for existing
  callers.

The deprecated Radix React Hook Form wrapper is not installed. Compose forms
with `Field` and the appropriate validation/form library when needed. All app
primitives use Base UI; packages such as `cmdk` can still have transitive Radix
dependencies.
