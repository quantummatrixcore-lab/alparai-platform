const fs = require("fs");
const path = require("path");

function getAdminPageFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file === "cockpit") return; // Skip cockpit directory
      results = results.concat(getAdminPageFiles(filePath));
    } else if (file === "page.tsx") {
      results.push(filePath);
    }
  });
  return results;
}

const adminDir = path.join(__dirname, "../src/app/[locale]/admin");
const pageFiles = getAdminPageFiles(adminDir);

console.log(`Found ${pageFiles.length} admin page.tsx files to process.`);

let modifiedCount = 0;

pageFiles.forEach((filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  // 1. Upgrade background / border / glassmorphism card utility classes
  content = content.replace(
    /bg-bg-secondary\/40/g,
    "bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10",
  );
  content = content.replace(
    /bg-bg-secondary\b(?!\/)/g,
    "bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10",
  );

  // 2. Wrap or augment top-level return in spatial-bento glassmorphism wrapper
  // Check if spatial glassmorphism ring/bg is already present on the page outer container
  if (!content.includes("bg-zinc-900/40") && !content.includes("SpatialBentoCard")) {
    // Check for return statement
    // Pattern A: return ( <div className="..."; or return <div className="...
    const divReturnRegex = /(return\s*\(\s*<div\s+className=")([^"]*)(")/;
    const directDivReturnRegex = /(return\s+<div\s+className=")([^"]*)(")/;

    if (divReturnRegex.test(content)) {
      content = content.replace(divReturnRegex, (match, prefix, classes, suffix) => {
        if (classes.includes("bg-zinc-900") || classes.includes("spatial")) return match;
        const updatedClasses =
          `${classes} bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-6 md:p-8 shadow-2xl`.trim();
        return `${prefix}${updatedClasses}${suffix}`;
      });
    } else if (directDivReturnRegex.test(content)) {
      content = content.replace(directDivReturnRegex, (match, prefix, classes, suffix) => {
        if (classes.includes("bg-zinc-900") || classes.includes("spatial")) return match;
        const updatedClasses =
          `${classes} bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-6 md:p-8 shadow-2xl`.trim();
        return `${prefix}${updatedClasses}${suffix}`;
      });
    } else {
      // Pattern B: return ( <AdminContainer... or return ( <Container... or return <ClientComponent...
      // Wrap top level JSX return inside Spatial Bento Card container
      const returnJSXRegex = /(return\s*\(\s*)(<[A-Z][a-zA-Z0-9]*[\s\S]*?)(\s*\);\s*\})/;
      const returnDirectJSXRegex = /(return\s+)(<[A-Z][a-zA-Z0-9]*[^;]*?)(;\s*\})/;

      if (returnJSXRegex.test(content)) {
        content = content.replace(returnJSXRegex, (match, retPrefix, jsxBody, retSuffix) => {
          return `${retPrefix}<div className="bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">\n${jsxBody}\n</div>${retSuffix}`;
        });
      } else if (returnDirectJSXRegex.test(content)) {
        content = content.replace(returnDirectJSXRegex, (match, retPrefix, jsxBody, retSuffix) => {
          return `${retPrefix}(\n<div className="bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">\n${jsxBody}\n</div>\n)${retSuffix}`;
        });
      }
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    modifiedCount++;
    console.log(`Updated: ${path.relative(adminDir, filePath)}`);
  } else {
    console.log(`Skipped (already spatial): ${path.relative(adminDir, filePath)}`);
  }
});

console.log(`\nFinished refactoring ${modifiedCount} of ${pageFiles.length} admin pages.`);
