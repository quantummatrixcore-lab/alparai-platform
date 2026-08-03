import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.join(process.cwd(), 'docs/MASTER_PLAN.md');
if (!fs.existsSync(mdPath)) {
  console.error(`File not found: ${mdPath}`);
  process.exit(1);
}

const content = fs.readFileSync(mdPath, 'utf8');

const tableStartMarker = '<!-- FOUNDER_BACKLOG_START -->';
const tableEndMarker = '<!-- FOUNDER_BACKLOG_END -->';

const tableStartIndex = content.indexOf(tableStartMarker);
const tableEndIndex = content.indexOf(tableEndMarker);

if (tableStartIndex === -1 || tableEndIndex === -1) {
  console.error("Table markers not found in MASTER_PLAN.md.");
  process.exit(1);
}

const tableContent = content.substring(tableStartIndex + tableStartMarker.length, tableEndIndex);
const proseContent = content.substring(0, tableStartIndex) + content.substring(tableEndIndex + tableEndMarker.length);

const lines = tableContent.split('\n');
const idStatusMap = new Map();
const allRows = [];

for (const line of lines) {
  if (!line.trim().startsWith('|') || line.includes('---') || line.includes('Item ID')) {
    continue;
  }
  const parts = line.split('|').map((p) => p.trim());
  if (parts.length < 6) continue;

  const id = parts[1];
  const description = parts[4] || "";
  const status = parts[5] || "";
  
  if (!id || !/^\d+$/.test(id)) continue;
  
  if (idStatusMap.has(id)) {
    console.error(`Error: ID #${id} appears multiple times in the table.`);
    process.exit(1);
  }
  idStatusMap.set(id, status);
  allRows.push({ id, description, status });
}

let hasErrors = false;

for (const row of allRows) {
  // Check dependsOn
  const dependsMatch = [...row.description.matchAll(/depends:#(\d+)/g)];
  for (const match of dependsMatch) {
    if (!idStatusMap.has(match[1])) {
      console.error(`Error: Item #${row.id} has an invalid dependency (depends:#${match[1]}). Item #${match[1]} does not exist.`);
      hasErrors = true;
    }
  }

  // Check blocks
  const blocksMatch = [...row.description.matchAll(/blocks:#(\d+)/g)];
  for (const match of blocksMatch) {
    if (!idStatusMap.has(match[1])) {
      console.error(`Error: Item #${row.id} has an invalid dependency (blocks:#${match[1]}). Item #${match[1]} does not exist.`);
      hasErrors = true;
    }
  }

  // Check closed-by on completed items
  const sLower = row.status.toLowerCase();
  const isCompleted = row.status.includes('✅') || row.status.includes('✓') || sLower.includes('completed') || sLower.includes('tamamlandı') || sLower.includes('closed');

  if (isCompleted) {
    const closedMatch = row.description.match(/closed-by:([a-f0-9]+|legacy)@([a-zA-Z0-9_\-\/]+)/i);
    if (!closedMatch) {
      console.error(`Error: Completed Item #${row.id} is missing 'closed-by:<sha>@<branch>' notation in its description.`);
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  console.error("Master plan consistency check failed.");
  process.exit(1);
}

// Removed prose scanning as per Task #95:
// check-masterplan-consistency.mjs should only validate the FOUNDER_BACKLOG_START/END table to allow historical prose claims.

console.log("Master plan consistency check passed.");
process.exit(0);
