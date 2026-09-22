import { copyFile, mkdir, writeFile } from 'node:fs/promises';

// Expo's SPA entry is also served at the two interview routes.
for (const route of ['showcase', 'demo']) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}
await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');
