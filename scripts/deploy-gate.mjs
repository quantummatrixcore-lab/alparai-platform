import { execSync } from "child_process";

// Vercel Ignore Build Step Script
// Proceeds with build ONLY for master branch AND when actual code files are modified

let commitMsg = process.env.VERCEL_GIT_COMMIT_MESSAGE || "";

if (!commitMsg) {
  try {
    commitMsg = execSync("git log -1 --pretty=%B").toString().trim();
  } catch (err) {
    console.error("Failed to get commit message from git:", err instanceof Error ? err.message : String(err));
  }
}

console.log("Deploy Gate: Inspecting commit message, branch, and changed files...");
console.log(`Commit message: "${commitMsg}"`);
console.log(`Commit ref: "${process.env.VERCEL_GIT_COMMIT_REF || ""}"`);

const isMaster = (process.env.VERCEL_GIT_COMMIT_REF || "").includes("master");
const hasDeployTag = commitMsg.includes("[deploy]");
const isForceDeploy = commitMsg.includes("[force-deploy]");

// If explicit [force-deploy] is present, always build
if (isForceDeploy) {
  console.log("✓ Explicit [force-deploy] tag detected. Proceeding with build.");
  process.exit(1);
}

// Check changed files in the last commit
let codeFilesChanged = true;
try {
  const changedFiles = execSync("git diff-tree --no-commit-id --name-only -r HEAD").toString().trim().split("\n");
  console.log("Changed files in commit:", changedFiles);

  // Define patterns for application code that requires Vercel build
  const codePatterns = [
    "src/",
    "messages/",
    "public/",
    "package.json",
    "pnpm-lock.yaml",
    "next.config.mjs",
    "vercel.json",
    "tsconfig.json",
    "tailwind.config",
  ];

  codeFilesChanged = changedFiles.some((file) =>
    codePatterns.some((pattern) => file.startsWith(pattern) || file.includes(pattern))
  );
  console.log(`Code files changed check: ${codeFilesChanged}`);
} catch (e) {
  console.log("Could not determine changed files, defaulting to build.", e instanceof Error ? e.message : String(e));
}

if ((isMaster || hasDeployTag || !process.env.VERCEL_ENV) && codeFilesChanged) {
  console.log("✓ Code changes detected on master branch. Proceeding with Vercel build.");
  process.exit(1); // Exit 1 = Proceed with build
} else {
  console.log("✕ Skipping Vercel build (no core application code changed or non-master branch).");
  process.exit(0); // Exit 0 = Skip build (saves Build CPU Minutes)
}
