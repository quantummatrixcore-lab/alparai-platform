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
  console.log("body:", (await r.text()).slice(0, 800));
}

const sql = `
create extension if not exists pgcrypto;

create table if not exists public._t_incidents (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  category text,
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple'::regconfig, coalesce(title,'')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(description,'')), 'B') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(category::text,'')), 'C')
  ) stored
);
drop table public._t_incidents;
`;
q(sql);
