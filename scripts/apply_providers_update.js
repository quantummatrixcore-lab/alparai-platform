const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env.backup
const envPath = path.join(__dirname, "..", ".env.backup");
const envContent = fs.readFileSync(envPath, "utf8");
const supabaseUrl = envContent
  .match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1]
  .trim()
  .replace(/^"|"$|^'|'$/g, "");
const supabaseKey = envContent
  .match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1]
  .trim()
  .replace(/^"|"$|^'|'$/g, "");

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Starting Supabase updates...");

  // 1. Insert Qwen and DeepSeek
  console.log("Inserting Qwen and DeepSeek...");
  const { error: insertErr } = await supabase.from("ai_providers").upsert(
    [
      {
        slug: "qwen",
        name: "Qwen",
        description: "Alibaba Cloud Qwen Models",
        website_url: "https://qwenlm.github.io/",
        is_verified: true,
        logo_url: "/logos/providers/qwen.svg",
      },
      {
        slug: "deepseek",
        name: "DeepSeek",
        description: "DeepSeek AI Models",
        website_url: "https://deepseek.com",
        is_verified: true,
        logo_url: "/logos/providers/deepseek.svg",
      },
    ],
    { onConflict: "slug" }
  );
  if (insertErr) console.error("Insert error:", insertErr);

  // 2. Update names
  console.log("Updating names...");
  await supabase
    .from("ai_providers")
    .update({ name: "Anthropic (Claude)" })
    .eq("slug", "anthropic");
  await supabase.from("ai_providers").update({ name: "Google (Gemini)" }).eq("slug", "google");

  // 3. Update logos
  console.log("Updating logo URLs...");
  const logos = [
    "openai",
    "anthropic",
    "google",
    "meta",
    "mistral",
    "cohere",
    "perplexity",
    "xai",
    "qwen",
    "deepseek",
  ];
  for (const slug of logos) {
    const { error } = await supabase
      .from("ai_providers")
      .update({ logo_url: `/logos/providers/${slug}.svg` })
      .eq("slug", slug);
    if (error) console.error(`Error updating ${slug} logo:`, error);
  }

  // 4. Delete IBM (if it exists and has no incidents)
  console.log("Deleting IBM...");
  // We don't check for incidents here because if it has incidents, the foreign key constraint will block the deletion, which is what we want!
  const { error: deleteErr } = await supabase.from("ai_providers").delete().eq("slug", "ibm");
  if (deleteErr)
    console.log(
      "IBM deletion skipped/failed (possibly has incidents or does not exist):",
      deleteErr.message
    );
  else console.log("IBM deleted if it existed.");

  console.log("Updates complete!");
}

main().catch(console.error);
