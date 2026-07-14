import fs from 'fs';
import path from 'path';

const enPath = path.join(process.cwd(), 'messages/en.json');
const trPath = path.join(process.cwd(), 'messages/tr.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));

// Function to recursively add missing keys from source to target
function syncKeys(source, target) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      syncKeys(source[key], target[key]);
    } else {
      if (target[key] === undefined) {
        // If it's missing in target, just copy it from source as a fallback
        target[key] = source[key];
      }
    }
  }
}

// Sync TR to EN and EN to TR so both have exact same keys
syncKeys(tr, en);
syncKeys(en, tr);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync(trPath, JSON.stringify(tr, null, 2) + '\n');

console.log('i18n files synchronized successfully.');
