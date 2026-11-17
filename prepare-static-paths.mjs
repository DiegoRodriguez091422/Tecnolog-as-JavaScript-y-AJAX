import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const htmlPath = resolve('dist/index.html');
let html = await readFile(htmlPath, 'utf8');

// Mantiene los recursos relativos: sirven al abrir dist/index.html y bajo la subruta de GitHub Pages.
html = html
  .replaceAll('href="/laboratorio-js-ajax/_astro/', 'href="_astro/')
  .replaceAll('href="/laboratorio-js-ajax/favicon.svg"', 'href="favicon.svg"');

await writeFile(htmlPath, html, 'utf8');
