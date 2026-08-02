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

let hasError = false;
const proseLines = proseContent.split('\n');
let isHistoricalSection = false;

for (let i = 0; i < proseLines.length; i++) {
  const line = proseLines[i];
  
  // Stop checking if we hit historical/archive sections
  if (line.startsWith('## Öneri #030') || line.startsWith('## ÖNCEKİ DURUMLAR') || line.startsWith('## ARCHIVE') || line.startsWith('## v12.')) {
    isHistoricalSection = true;
  }
  
  if (isHistoricalSection) continue;
  
  // Check for exact "✅ completed" or "completed" mentions in active prose
  if (line.includes('✅ completed')) {
    const idMatches = [...line.matchAll(/#(\d+)/g)];
    for (const match of idMatches) {
      const id = match[1];
      if (idStatusMap.has(id)) {
        const statusInTable = idStatusMap.get(id);
        if (!statusInTable.includes('✅ completed')) {
          console.error(`Error: ID #${id} is mentioned with '✅ completed' in prose, but status in table is '${statusInTable}'.`);
          hasError = true;
        }
      }
    }
  }
}

if (hasError) {
  console.error("Consistency check failed.");
  process.exit(1);
}

console.log("Master plan consistency check passed.");
process.exit(0);
