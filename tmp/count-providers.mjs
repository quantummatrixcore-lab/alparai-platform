/* eslint-disable no-console */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("d:\\Alparai\\.env.local") });

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error, count } = await supabase
    .from("ai_providers")
    .select("*", { count: "exact" });
    
  if (error) {
    console.error("Error fetching providers:", error);
  } else {
    console.log(`Total ai_providers in DB: ${count}`);
    console.log("Providers:", data.map(p => ({ id: p.id, name: p.name })));
  }
  
  const { count: incidentCount } = await supabase
    .from("incidents")
    .select("*", { count: "exact", head: true });
  console.log(`Total incidents in DB: ${incidentCount}`);
}

check();
