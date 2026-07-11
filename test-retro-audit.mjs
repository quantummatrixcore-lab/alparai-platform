import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRetroAuditQuery() {
  console.log("Testing retro-audit cron query...");
  const { data: pendingIncidents, error: fetchError } = await supabase
    .from("incidents")
    .select("id, title_masked, source_badge")
    .is("cross_audit_truth_score", null)
    .eq("status", "published")
    .neq("source_badge", "community")
    .limit(10);

  if (fetchError) {
    console.error("Error fetching:", fetchError.message);
  } else {
    console.log("Query Results (Should not contain 'community' source_badge):");
    console.log(pendingIncidents);
  }
}

testRetroAuditQuery();
