const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const REF = process.env.SUPABASE_PROJECT_REF;
const PASS = process.env.SUPABASE_DB_PASSWORD;

async function q(sql) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, dbPassword: PASS, "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql }),
  });
  console.log("status:", r.status);
  console.log("body:", (await r.text()).slice(0, 500));
}

async function main() {
  console.log("\n--- Test 1: to_tsvector(regconfig, text) ---");
  await q("SELECT to_tsvector('simple'::regconfig, 'hello world') IS NOT NULL AS test;");
  console.log("\n--- Test 2: generate_always check ---");
  await q(`
    CREATE TABLE _test_gen (t text, v tsvector GENERATED ALWAYS AS (to_tsvector('simple'::regconfig, t)) STORED);
    INSERT INTO _test_gen (t) VALUES ('hi') RETURNING v;
    DROP TABLE _test_gen;
  `);
  console.log("\n--- Test 3: setweight variant ---");
  await q(`
    CREATE TABLE _test_gen2 (t text, v tsvector GENERATED ALWAYS AS (setweight(to_tsvector('simple'::regconfig, t), 'A')) STORED);
    INSERT INTO _test_gen2 (t) VALUES ('hi') RETURNING v;
    DROP TABLE _test_gen2;
  `);
}
main();
