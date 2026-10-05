import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const themes = {
  light: { ink: '#242326', fire: '#762f3a', paper: '#f3f1eb', muted: '#656166' },
  dark: { ink: '#fff9f2', fire: '#e86b49', paper: '#232225', muted: '#bdb7b9' },
};
const concepts = [
  {
    id: '01-revenant-nib', name: 'Revenant nib',
    detail: 'A flaming skull forged into a fountain pen. The clearest Ghost Rider / Ghost Writer connection.',
    glyph: `<path fill="var(--fire)" fill-rule="evenodd" d="M64 7c1 21 24 27 18 42 9-5 13-13 12-22 22 24 25 47 11 65-5 7-12 11-20 14H43C26 101 16 86 18 69c1-15 11-20 11-35 7 6 11 13 11 22 4-14 2-23 14-31 6-4 9-10 10-18Zm-21 58 16-3-3 11c-8 3-13-1-13-8Zm42 0-16-3 3 11c8 3 13-1 13-8ZM64 81l-5 9h3v17l2 3 2-3V90h3Z"/>
      <path fill="var(--ink)" fill-rule="evenodd" d="M64 40c18 0 30 12 30 29 0 10-6 17-14 20l-1 9-15 20-15-20-1-9c-8-3-14-10-14-20 0-17 12-29 30-29Zm-21 25 16-3-3 11c-8 3-13-1-13-8Zm42 0-16-3 3 11c8 3 13-1 13-8ZM64 81l-5 9h3v17l2 3 2-3V90h3Z"/>`,
  },
  {
    id: '02-pyre-quill', name: 'Pyre quill',
    detail: 'A feather turning to flame. Fast, slanted, and closer to a writer’s signature.',
    glyph: `<path fill="var(--fire)" fill-rule="evenodd" d="M41 77c-6-21-1-31 13-43-1 10 2 15 5 17 4-19 20-24 23-41 11 13 10 25 7 34 10-4 18-11 21-21 6 27-4 48-28 64l-21 14Zm2-1 24-33-4-2-24 33Z"/>
      <path fill="var(--ink)" fill-rule="evenodd" d="M30 94c-5-26 6-47 29-60 7-4 15-7 25-9-1 9-3 17-6 24l-18 4 14 4c-4 7-10 13-16 17l-15-1 8 6c-7 5-14 9-21 15Zm13-18 24-33-4-2-24 33Z"/>
      <path fill="var(--ink)" d="m18 108 33-45 5 4-32 46-8 3Z"/>`,
  },
  {
    id: '03-soul-ink', name: 'Soul ink',
    detail: 'A ghost rising from an inkwell. More supernatural scribe than superhero.',
    glyph: `<path fill="var(--fire)" fill-rule="evenodd" d="M51 70C27 59 22 43 37 25c-2 14 8 14 13 10C66 24 73 19 69 8c20 11 26 24 19 39 8-3 12-9 13-16 13 22 2 38-22 43ZM52 52v9h8v-9Zm16 0v9h8v-9Z"/>
      <path fill="var(--ink)" fill-rule="evenodd" d="M64 34c13 0 22 9 22 22v19l-10-6-12 7-12-7-10 6V56c0-13 9-22 22-22Zm-12 18v9h8v-9Zm16 0v9h8v-9Z"/>
      <path fill="var(--ink)" fill-rule="evenodd" d="M42 83h44l12 14v15H30V97Zm10 14v6h24v-6Z"/>
      <path fill="var(--fire)" d="M45 77h38v7H45Z"/>`,
  },
  {
    id: '04-infernal-g', name: 'Infernal G',
    detail: 'A compact lettermark with a flame for a crossbar. The most restrained option.',
    glyph: `<path fill="var(--ink)" d="M102 33 89 44C82 33 72 27 60 27c-20 0-34 15-34 35 0 21 15 36 36 36 10 0 19-4 25-10V74H61V58h44v38c-11 13-25 19-44 19-30 0-51-22-51-53S32 10 61 10c17 0 31 8 41 23Z"/>
      <path fill="var(--fire)" d="M50 75c-8-8-7-16 1-23 0 6 4 7 7 4 6-5 9-12 7-20 12 8 16 17 12 25 13 2 27-4 36-18-1 21-17 37-36 38H52l8-10Z"/>
      <path fill="var(--fire)" d="m22 101 12-12 12 12-12 12Z"/>`,
  },
  {
    id: '05-burning-words', name: 'Burning words',
    detail: 'Two quotation marks in a shared flame. Combative dialogue, reduced to a symbol.',
    glyph: `<path fill="var(--fire)" d="M27 88C9 75 14 53 30 37c-2 11 2 17 8 18 5-12 15-20 18-32 8 8 8 17 7 22 16-7 21-24 18-36 20 18 25 34 18 50 8-4 13-10 15-17 10 24-1 42-19 48Z"/>
      <path fill="var(--ink)" d="M27 61h30v28l-20 23H20l18-24H27Zm47 0h30v28l-20 23H67l18-24H74Z"/>`,
  },
];

function svg(concept, mode) {
  const t = themes[mode === 'dark' ? 'dark' : 'light'];
  const adaptive = mode === 'adaptive'
    ? `@media(prefers-color-scheme:dark){svg{--ink:${themes.dark.ink};--fire:${themes.dark.fire}}}` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-labelledby="title desc">
  <title id="title">Ghost Writer — ${concept.name}</title>
  <desc id="desc">${concept.detail} Transparent ${mode} SVG.</desc>
  <style>svg{--ink:${t.ink};--fire:${t.fire}}${adaptive}</style>
  ${concept.glyph}
</svg>\n`;
}

for (const concept of concepts) {
  for (const mode of ['light', 'dark', 'adaptive']) {
    const suffix = mode === 'adaptive' ? '' : `-${mode}`;
    await fs.writeFile(path.join(root, `${concept.id}${suffix}.svg`), svg(concept, mode));
  }
}

const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="840" viewBox="0 0 1440 840" role="img" aria-labelledby="board-title"><title id="board-title">Ghost Writer — Hellfire icon concepts in light and dark</title>
  <rect width="1440" height="420" fill="${themes.light.paper}"/>
  <rect y="420" width="1440" height="420" fill="${themes.dark.paper}"/>`];
for (const [row, mode] of ['light', 'dark'].entries()) {
  const t = themes[mode];
  const y = row * 420;
  parts.push(`<text x="44" y="${y + 52}" font-family="Georgia,serif" font-size="28" fill="${t.ink}">Ghost Writer / Hellfire collection</text>
    <text x="1396" y="${y + 50}" text-anchor="end" font-family="sans-serif" font-size="16" fill="${t.muted}">${mode === 'light' ? 'Light' : 'Dark'} mode</text>`);
  concepts.forEach((concept, index) => {
    const x = 44 + index * 280;
    const geometry = concept.glyph.replaceAll('var(--ink)', t.ink).replaceAll('var(--fire)', t.fire);
    parts.push(`<g transform="translate(${x + 34} ${y + 83}) scale(1.35)">${geometry}</g>
      <text x="${x}" y="${y + 287}" font-family="Georgia,serif" font-size="23" fill="${t.ink}">${index + 1}. ${concept.name}</text>`);
    [16, 24, 32, 48].forEach((size, sizeIndex) => {
      parts.push(`<g transform="translate(${x + sizeIndex * 55} ${y + 311 + (48 - size) / 2}) scale(${size / 128})">${geometry}</g>
        <text x="${x + sizeIndex * 55 + size / 2}" y="${y + 384}" text-anchor="middle" font-family="sans-serif" font-size="12" fill="${t.muted}">${size}</text>`);
    });
  });
}
parts.push('</svg>');
await fs.writeFile(path.join(root, 'comparison.svg'), parts.join('\n'));

const articles = concepts.map((concept, index) => `<article>
  <div class="duo">
    <div class="swatch light"><img src="${concept.id}-light.svg" alt="${concept.name}, light mode"><span>Light</span></div>
    <div class="swatch dark"><img src="${concept.id}-dark.svg" alt="${concept.name}, dark mode"><span>Dark</span></div>
  </div>
  <h2>${index + 1}. ${concept.name}</h2><p>${concept.detail}</p>
  <div class="toolbar light" aria-label="Light mode toolbar size samples">${[16,24,32,48].map(size => `<img src="${concept.id}-light.svg" width="${size}" height="${size}" alt="${size} pixels">`).join('')}</div>
  <div class="toolbar dark" aria-label="Dark mode toolbar size samples">${[16,24,32,48].map(size => `<img src="${concept.id}-dark.svg" width="${size}" height="${size}" alt="${size} pixels">`).join('')}</div>
  <nav aria-label="Download ${concept.name}"><a href="${concept.id}.svg" download>Adaptive SVG</a><a href="${concept.id}-light.svg" download>Light</a><a href="${concept.id}-dark.svg" download>Dark</a></nav>
</article>`).join('\n');

await fs.writeFile(path.join(root, 'preview.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ghost Writer / Hellfire collection</title><style>
*{box-sizing:border-box}body{margin:0;background:#f3f1eb;color:#242326;font-family:system-ui,sans-serif}main{max-width:1500px;margin:auto;padding:40px 32px}h1{font:400 40px/1.2 Georgia,serif;letter-spacing:-.025em;margin:0 0 14px}.intro{max-width:720px;font-size:16px;line-height:1.6;color:#656166}.grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px;margin-top:36px}article{min-width:0}.duo{display:grid;grid-template-columns:1fr 1fr;overflow:hidden;border-radius:10px;border:1px solid #d4cfc7}.swatch{display:flex;min-height:200px;flex-direction:column;align-items:center;justify-content:center;gap:20px}.swatch img{width:min(100%,112px);height:112px}.swatch span{font-size:12px}.light{background:#f3f1eb;color:#656166}.dark{background:#232225;color:#bdb7b9}h2{font:400 24px/1.25 Georgia,serif;margin:20px 0 10px}article p{font-size:14px;line-height:1.55;color:#656166;min-height:88px;margin:0 0 16px}.toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px;height:76px;border:1px solid #d4cfc7;border-radius:6px;margin-top:8px}.toolbar.dark{border-color:#48444b}nav{display:flex;gap:12px;flex-wrap:wrap;margin:18px 0 28px}a{color:#762f3a;text-underline-offset:4px;font-size:13px}a:focus-visible{outline:2px solid #762f3a;outline-offset:4px}footer{font-size:14px;line-height:1.6;color:#656166;margin-top:24px;border-top:1px solid #d4cfc7;padding-top:24px}code{font-size:13px}@media(max-width:1150px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}main{padding:28px 18px}h1{font-size:32px}}@media(max-width:470px){.grid{grid-template-columns:1fr}.swatch img{width:144px;height:144px}.swatch{min-height:230px}article p{min-height:0}}
</style></head><body><main><h1>Ghost Writer / Hellfire collection</h1><p class="intro">A supernatural scribe with a little Ghost Rider attitude. Five original vector marks, each drawn for light and dark backgrounds. No tile, no glow, no raster artwork.</p><div class="grid">${articles}</div><footer>Toolbar samples: 16, 24, 32, and 48 px. Adaptive SVGs follow the system color preference via <code>prefers-color-scheme</code>. For an app with a manual theme override, use the explicit Light and Dark assets.<br><a href="../preview.html">View the first collection</a> · <a href="comparison.svg">Open comparison sheet</a></footer></main></body></html>\n`);

console.log('Created 15 icon SVGs, a vector comparison sheet, and an HTML gallery.');
