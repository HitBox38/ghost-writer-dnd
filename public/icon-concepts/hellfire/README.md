# Ghost Writer / Hellfire collection

Five hand-authored SVG concepts inspired by the Ghost Writer / Ghost Rider wordplay:

1. **Revenant nib** — flaming skull tapering into a fountain pen nib. Recommended direction.
2. **Pyre quill** — a feather turning into a flame.
3. **Soul ink** — a ghost rising from an inkwell.
4. **Infernal G** — a G lettermark with a flame crossbar.
5. **Burning words** — two quotation marks wrapped in fire.

All five use a transparent 128 × 128 viewBox. They contain vector paths, no embedded raster artwork, fonts, scripts, or external assets. The first collection remains in the parent directory.

## Theme variants

Each concept has three files:

- `01-revenant-nib.svg`: adaptive, using `prefers-color-scheme` inside the SVG. Tracks the system preference when loaded as an image.
- `01-revenant-nib-light.svg`: fixed charcoal (`#242326`) and oxblood (`#762f3a`).
- `01-revenant-nib-dark.svg`: fixed bone (`#fff9f2`) and ember (`#e86b49`).

For an app with a manual light/dark override, choose the explicit variant based on the app's **resolved** theme. An external SVG cannot read the host page's `.dark` class. An inline SVG can instead receive `--ink` and `--fire` custom properties on its root element.

The HTML gallery and vector comparison sheet display both palettes at full size and at 16, 24, 32, and 48 px. These marks are designed for the project's neutral paper and charcoal surfaces; other backgrounds may require different palette values.

## Files and reproduction

Open `preview.html` to compare and download the variants. Open `comparison.svg` for the single-sheet overview.

Run `node public/icon-concepts/hellfire/build.mjs` from the repository root to reproduce the 15 icon files, gallery, and comparison SVG. SVG output is deterministic. No image-generation service is used.
