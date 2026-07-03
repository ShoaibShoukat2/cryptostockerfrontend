import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets');
const required = [
  'depositIcon.png',
  'withdrawalIcon.png',
  'referralicon.png',
  'logo.jpeg',
  'navbarlogo.png',
];

const missing = required.filter((f) => !existsSync(join(root, f)));

if (missing.length) {
  console.error('\nBuild aborted — missing asset files in frontend/src/assets/:');
  missing.forEach((f) => console.error(`  - ${f}`));
  console.error('\nAdd these files and commit them to git before deploying.\n');
  process.exit(1);
}
