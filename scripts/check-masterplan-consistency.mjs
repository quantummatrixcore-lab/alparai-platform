import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const content = fs.readFileSync(path.join(__dirname, '../docs/MASTER_PLAN.md'), 'utf-8');

const tableRows = content.split('\n').filter(l => l.trim().startsWith('|'));
const tableTasks = new Map();
let duplicateIdError = false;

tableRows.forEach(row => {
  const cols = row.split('|').map(c => c.trim());
  if (cols.length > 3 && /^\d+$/.test(cols[1])) {
    const id = parseInt(cols[1], 10);
    const isCompleted = cols.some(c => c.toLowerCase() === 'tamamlandı' || c.toLowerCase() === 'done' || c.includes('✅') || c.includes('tamamlandı'));
    
    // Ignore small IDs (1-5) as they might be from the "Uygulayıcı, Teşhisçi" table at the bottom
    // The main backlog IDs go up to 90+. If we see the same ID twice, it's an error.
    if (tableTasks.has(id)) {
      if (id > 10) { // Only log error for actual backlog items
        console.error(`ERROR: Task ID ${id} appears multiple times in the MASTER_PLAN.md table.`);
        duplicateIdError = true;
      }
    }
    tableTasks.set(id, isCompleted);
  }
});

let consistencyError = false;
const proseLines = content.split('\n').filter(l => !l.trim().startsWith('|'));
proseLines.forEach((line, index) => {
  // Only strictly match "#N ✅ completed"
  const match = line.match(/#(\d+)\s*✅\s*completed/i);
  if (match) {
    const id = parseInt(match[1], 10);
    if (tableTasks.has(id)) {
      const isTableCompleted = tableTasks.get(id);
      if (!isTableCompleted) {
        console.error(`ERROR: Prose on line ${index + 1} claims task #${id} ✅ completed, but the table says it is pending.`);
        consistencyError = true;
      }
    }
  }
});

if (duplicateIdError || consistencyError) {
  process.exit(1);
}

console.log("MASTER_PLAN.md consistency check passed.");
