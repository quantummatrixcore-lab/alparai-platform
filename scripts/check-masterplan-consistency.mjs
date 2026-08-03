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

function getDependencies(description) {
  const deps = new Set();

  // 1. Matches "Depends: #56, #75" or "Depends: #56"
  const dependsMatchNew = [...description.matchAll(/Depends:\s*#(\d+(?:\s*,\s*#\d+)*)/gi)];
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

  // 2. Matches "depends:#56"
  const dependsMatchOld = [...description.matchAll(/depends:#(\d+)/gi)];
  for (const match of dependsMatchOld) {
    if (match[1]) {
      deps.add(match[1]);
    }
  }

  return Array.from(deps);
}

let hasErrors = false;

// 1. Missing dependency reference check
for (const row of allRows) {
  const deps = getDependencies(row.description);
  for (const depId of deps) {
    if (!idStatusMap.has(depId)) {
      console.error(`Error: Item #${row.id} has an invalid dependency reference (Depends: #${depId}). Item #${depId} does not exist.`);
      hasErrors = true;
    }
  }

  // Check blocks
  const blocksMatch = [...row.description.matchAll(/blocks:#(\d+)/gi)];
  for (const match of blocksMatch) {
    if (!idStatusMap.has(match[1])) {
      console.error(`Error: Item #${row.id} has an invalid block reference (blocks:#${match[1]}). Item #${match[1]} does not exist.`);
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

// 2. Dependency cycle check (Cycle Detection via DFS)
const depGraph = new Map();
for (const row of allRows) {
  const deps = getDependencies(row.description);
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
