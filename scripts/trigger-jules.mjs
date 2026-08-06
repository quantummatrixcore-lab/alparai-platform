/**
 * Jules Autonomous Agent Trigger Script (Task #210)
 *
 * Triggers a Jules session via Jules API (https://jules.googleapis.com/v1alpha/sessions)
 * or outputs a webhook trigger payload for automated PR generation.
 */

import https from "node:https";

const JULES_API_BASE = process.env.JULES_API_BASE || "https://jules.googleapis.com/v1alpha";
const JULES_API_KEY = process.env.JULES_API_KEY;
const REPO = process.env.JULES_REPO || "quantummatrixcore-lab/Alparai.com";
const TARGET_BRANCH = process.env.JULES_BRANCH || "master";

async function triggerJules() {
  console.log("⚡ [Jules Trigger] Initializing Jules autonomous session trigger...");
  console.log(`📌 Target Repo: ${REPO} (Branch: ${TARGET_BRANCH})`);
  console.log(`📌 Target File: src/lib/dummy-jules-bait.ts`);

  if (!JULES_API_KEY) {
    console.log("⚠️  JULES_API_KEY not set in process.env.");
    console.log("💡 Trigger Payload Ready for Jules Webhook / CI Event:");
    const mockPayload = {
      event: "jules_trigger",
      repository: REPO,
      branch: TARGET_BRANCH,
      prompt:
        "Inspect src/lib/dummy-jules-bait.ts for doc, typo, or type improvements and create a Pull Request.",
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(mockPayload, null, 2));
    console.log("✅ Simulated Jules trigger executed cleanly.");
    return;
  }

  try {
    const [owner, name] = REPO.split("/");
    const body = JSON.stringify({
      prompt:
        "Inspect src/lib/dummy-jules-bait.ts and recent code changes for doc or type improvements and open a Pull Request.",
      sourceContext: {
        repository: {
          owner: owner || "quantummatrixcore-lab",
          name: name || "Alparai.com",
          branch: TARGET_BRANCH,
        },
      },
    });

    const url = new URL(`${JULES_API_BASE}/sessions`);
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "X-Goog-Api-Key": JULES_API_KEY,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let resData = "";
        res.on("data", (chunk) => {
          resData += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("✅ Jules session created successfully!");
            console.log(resData);
          } else {
            console.error(`❌ Jules API returned status ${res.statusCode}: ${resData}`);
          }
        });
      }
    );

    req.on("error", (err) => {
      console.error("❌ Failed to reach Jules API:", err.message);
    });

    req.write(body);
    req.end();
  } catch (err) {
    console.error("❌ Exception triggering Jules:", err);
  }
}

triggerJules();
