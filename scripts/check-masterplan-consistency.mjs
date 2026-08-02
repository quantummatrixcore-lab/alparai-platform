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

for (const line of lines) {
  // Parse rows starting with "| <number> |"
  const match = line.match(/^\|\s*(\d+)\s*\|(?:.*?\|){3}\s*([^|]+?)\s*\|$/);
  if (match) {
    const id = match[1];
    const status = match[2].trim();
    
    if (idStatusMap.has(id)) {
      console.error(`Error: ID #${id} appears multiple times in the table.`);
      process.exit(1);
    }
    idStatusMap.set(id, status);
  }
}

// Removed prose scanning as per Task #95:
// check-masterplan-consistency.mjs should only validate the FOUNDER_BACKLOG_START/END table to allow historical prose claims.

console.log("Master plan consistency check passed.");
process.exit(0);
