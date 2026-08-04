import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

const fileLines = content.split('\n');
const idStatusMap = new Map();
const allRows = [];

let grandfatheredSHAs = new Set();
try {
  grandfatheredSHAs = new Set(execSync('git log --format="%H" 5b03aace').toString().trim().split('\n'));
} catch (e) {
  console.warn("Could not fetch git history for 5b03aace. Defaulting to empty set.");
}

let blameLines = [];
try {
  blameLines = execSync('git blame -l docs/MASTER_PLAN.md').toString().split('\n');
} catch (e) {
  console.warn("Could not run git blame.");
}

let inTable = false;
for (let i = 0; i < fileLines.length; i++) {
  const line = fileLines[i];
  if (line.includes(tableStartMarker)) inTable = true;
  if (line.includes(tableEndMarker)) inTable = false;

  if (!inTable) continue;
  if (!line.trim().startsWith('|') || line.includes('---') || line.includes('Item ID')) continue;

  const parts = line.split('|').map((p) => p.trim());
  if (parts.length < 6) continue;

  const id = parts[1];
  const description = parts[4] || "";
  const status = parts[parts.length - 2] || "";
  
  if (!id || !/^\d+$/.test(id)) continue;
  
  if (idStatusMap.has(id)) {
    console.error(`Error: ID #${id} appears multiple times in the table.`);
    process.exit(1);
  }
  idStatusMap.set(id, status);

  const blameMatch = blameLines[i] ? blameLines[i].match(/^[a-f0-9]+/) : null;
  const blameCommit = blameMatch ? blameMatch[0] : null;
  const isGrandfathered = grandfatheredSHAs.has(blameCommit);

  allRows.push({ id, description, status, isGrandfathered });
}

function getDependencies(fullText) {
  const deps = new Set();

  // 1. Matches "Depends: #56, #75" or "Depends: #56" or "depends:#56"
  const dependsMatchNew = [...fullText.matchAll(/depends:\s*#?(\d+(?:\s*,\s*#?\d+)*)/gi)];
  for (const match of dependsMatchNew) {
    if (match[1]) {
      const nums = match[1].match(/\d+/g);
      if (nums) {
        for (const n of nums) {
          deps.add(n);
        }
      }
    }
  }

  return Array.from(deps);
}

let hasErrors = false;

// 1. Missing dependency reference check
for (const row of allRows) {
  const fullText = `${row.description} ${row.status}`;
  const deps = getDependencies(fullText);
  for (const depId of deps) {
    if (!idStatusMap.has(depId)) {
      console.error(`Error: Item #${row.id} has an invalid dependency reference (Depends: #${depId}). Item #${depId} does not exist.`);
      hasErrors = true;
    }
  }

  // Check blocks
  const blocksMatch = [...fullText.matchAll(/blocks:\s*#?(\d+(?:\s*,\s*#?\d+)*)/gi)];
  for (const match of blocksMatch) {
    if (match[1]) {
      const nums = match[1].match(/\d+/g);
      if (nums) {
        for (const depId of nums) {
          if (!idStatusMap.has(depId)) {
            console.error(`Error: Item #${row.id} has an invalid block reference (blocks:#${depId}). Item #${depId} does not exist.`);
            hasErrors = true;
          }
        }
      }
    }
  }

  // Check closed-by on completed items
  const sLower = row.status.toLowerCase();
  const isCompleted = row.status.includes('✅') || row.status.includes('✓') || sLower.includes('completed') || sLower.includes('tamamlandı') || sLower.includes('closed');

  if (isCompleted) {
    const closedMatch = fullText.match(
      /(?:closed-by:\s*([a-f0-9]+|legacy|founder@\d{4}-\d{2}-\d{2}|origin\/master|[a-zA-Z0-9_\-\.\/]+)(?:@([a-zA-Z0-9_\-\/]+|\d{4}-\d{2}-\d{2}))?|commit\s*[:\s]\s*([a-f0-9]{7,40})|evidence:|closed-by:|\b(?:src|docs|supabase|messages|\.github)\/[a-zA-Z0-9_\-\.\/]+\b|\b[a-zA-Z0-9_\-]+\.(?:md|sql|tsx?|json)\b)/i
    );
    const GRANDFATHER_THRESHOLD = 107;
    const itemIdNum = parseInt(row.id, 10);
    const isNumericGrandfathered = !isNaN(itemIdNum) && itemIdNum <= GRANDFATHER_THRESHOLD;

    if (!closedMatch && !row.isGrandfathered && !isNumericGrandfathered) {
      console.error(`Error: Completed Item #${row.id} is missing closure evidence / 'closed-by:<sha|legacy|founder@YYYY-MM-DD|branch>@<branch|date>' notation in its description or status.`);
      hasErrors = true;
    }
  }
}

// 2. Dependency cycle check (Cycle Detection via DFS)
const depGraph = new Map();
for (const row of allRows) {
  const fullText = `${row.description} ${row.status}`;
  const deps = getDependencies(fullText);
  depGraph.set(row.id, deps);
}

const visited = new Map(); // 0: unvisited, 1: visiting, 2: visited
const pathStack = [];

function checkCycles(id) {
  visited.set(id, 1);
  pathStack.push(id);

  const deps = depGraph.get(id) || [];
  for (const depId of deps) {
    if (!idStatusMap.has(depId)) continue; // Missing dependency reported above
    const state = visited.get(depId) || 0;
    if (state === 1) {
      const cycleStartIdx = pathStack.indexOf(depId);
      const cyclePath = pathStack.slice(cycleStartIdx).concat(depId).map(x => `#${x}`).join(' -> ');
      console.error(`Error: Dependency cycle detected: ${cyclePath}`);
      hasErrors = true;
    } else if (state === 0) {
      checkCycles(depId);
    }
  }

  pathStack.pop();
  visited.set(id, 2);
}

for (const row of allRows) {
  if ((visited.get(row.id) || 0) === 0) {
    checkCycles(row.id);
  }
}

if (hasErrors) {
  console.error("Master plan consistency check failed.");
  process.exit(1);
}

console.log("Master plan consistency check passed.");
process.exit(0);
