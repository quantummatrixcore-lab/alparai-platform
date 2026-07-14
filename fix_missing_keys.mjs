import fs from 'fs';
import path from 'path';

const enPath = path.join(process.cwd(), 'messages/en.json');
const trPath = path.join(process.cwd(), 'messages/tr.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));

if (!en.methodology) en.methodology = {};
if (!tr.methodology) tr.methodology = {};

for (let i = 5; i <= 12; i++) {
  if (!en.methodology[`k${i}_title`]) en.methodology[`k${i}_title`] = `K${i} Metric Title`;
  if (!en.methodology[`k${i}_desc`]) en.methodology[`k${i}_desc`] = `K${i} Metric Description`;
  
  if (!tr.methodology[`k${i}_title`]) tr.methodology[`k${i}_title`] = `K${i} Metrik Başlığı`;
  if (!tr.methodology[`k${i}_desc`]) tr.methodology[`k${i}_desc`] = `K${i} Metrik Açıklaması`;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync(trPath, JSON.stringify(tr, null, 2) + '\n');

console.log('Missing methodology keys added.');
