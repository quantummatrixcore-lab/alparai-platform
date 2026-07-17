import { execSync } from "child_process";

// Vercel Ignore Build Step Script
// Proceeds with the build ONLY if the commit message contains "[deploy]"

let commitMsg = process.env.VERCEL_GIT_COMMIT_MESSAGE || "";

if (!commitMsg) {
  try {
    commitMsg = execSync("git log -1 --pretty=%B").toString().trim();
  } catch (err) {
    console.error("Failed to get commit message from git:", err.message);
  }
}

console.log("Deploy Gate: Inspecting commit message...");
console.log(`Commit message: "${commitMsg}"`);

if (commitMsg.includes("[deploy]")) {
  console.log("✓ Commit message contains '[deploy]'. Proceeding with build.");
  process.exit(1); // Exit with 1 to proceed with build
} else {
  console.log("✕ Commit message does not contain '[deploy]'. Ignoring build.");
  process.exit(0); // Exit with 0 to skip build
}
