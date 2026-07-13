-- Create finance_revenue_metrics table
create table if not exists public.finance_revenue_metrics (
  id uuid primary key default gen_random_uuid(),
  month date not null unique,
  mrr_usd numeric(12, 2) not null default 0.00,
  arr_usd numeric(12, 2) not null default 0.00,
  active_subs integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.finance_revenue_metrics enable row level security;

-- Policies: only admins/ceo can read and write
create policy "Allow read for admins/ceo" on public.finance_revenue_metrics
  for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'ceo')
    )
  );

create policy "Allow write for admins/ceo" on public.finance_revenue_metrics
  for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'ceo')
    )
  );

-- Seed some mock data for the last 6 months (historical trend)
insert into public.finance_revenue_metrics (month, mrr_usd, arr_usd, active_subs) values
  ('2026-02-01', 12000.00, 144000.00, 52),
  ('2026-03-01', 15000.00, 180000.00, 68),
  ('2026-04-01', 18000.00, 216000.00, 81),
  ('2026-05-01', 22000.00, 264000.00, 95),
  ('2026-06-01', 26000.00, 312000.00, 112),
  ('2026-07-01', 34000.00, 408000.00, 142)
on conflict (month) do update set
  mrr_usd = excluded.mrr_usd,
  arr_usd = excluded.arr_usd,
  active_subs = excluded.active_subs;
