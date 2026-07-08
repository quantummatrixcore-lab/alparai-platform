import fs from "node:fs";
import path from "node:path";

function flattenKeys(obj, prefix = "") {
  let keys = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(flattenKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  return keys;
}

try {
  const enPath = path.resolve(process.cwd(), "messages/en.json");
  const trPath = path.resolve(process.cwd(), "messages/tr.json");

  if (!fs.existsSync(enPath) || !fs.existsSync(trPath)) {
    console.error("Error: en.json or tr.json file does not exist");
    process.exit(1);
  }

  const enContent = JSON.parse(fs.readFileSync(enPath, "utf-8"));
  const trContent = JSON.parse(fs.readFileSync(trPath, "utf-8"));

  const enKeys = flattenKeys(enContent);
  const trKeys = flattenKeys(trContent);

  const enSet = new Set(enKeys);
  const trSet = new Set(trKeys);

  const missingInTr = enKeys.filter(key => !trSet.has(key));
  const missingInEn = trKeys.filter(key => !enSet.has(key));

  let hasError = false;

  if (missingInTr.length > 0) {
    console.error(`\x1b[31mError: The following keys are in en.json but missing from tr.json:\x1b[0m`);
    missingInTr.forEach(key => console.error(`  - ${key}`));
    hasError = true;
  }

  if (missingInEn.length > 0) {
    console.error(`\x1b[31mError: The following keys are in tr.json but missing from en.json:\x1b[0m`);
    missingInEn.forEach(key => console.error(`  - ${key}`));
    hasError = true;
  }

  if (hasError) {
    console.error("\x1b[31mTranslation check failed. Please ensure key sets are synchronized.\x1b[0m");
    process.exit(1);
  }

  console.log("\x1b[32mSuccess: Translation keys match exactly!\x1b[0m");
  process.exit(0);
} catch (error) {
  console.error("Failed to check i18n keys:", error);
  process.exit(1);
}
