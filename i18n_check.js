const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) Object.assign(acc, getKeys(obj[k], pre + k));
    else acc[pre + k] = true;
    return acc;
  }, {});
}
const validKeys = getKeys(en);

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

// We also look for hardcoded Turkish characters or texts.
const turkishChars = /[ğüşıöçĞÜŞİÖÇ]/;
let hardcodedTurkish = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // Exclude comments and console.logs
    if (line.trim().startsWith('//') || line.includes('console.')) return;
    
    // Look for JSX text containing Turkish characters (a heuristic for hardcoded text)
    if (turkishChars.test(line)) {
      hardcodedTurkish.push(`${file}:${i + 1} -> ${line.trim()}`);
    }
  });
});

console.log('--- HARDCODED TURKISH TEXT IN SOURCE CODE ---');
if (hardcodedTurkish.length === 0) {
    console.log('No hardcoded Turkish characters found.');
} else {
    hardcodedTurkish.slice(0, 30).forEach(x => console.log(x));
}
