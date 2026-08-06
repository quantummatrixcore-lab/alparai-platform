-- 20260806_ai_velocity.sql
-- Table public.ai_velocity_metrics & public.financial_velocity_projections for AI Velocity Engine

create table if not exists public.ai_velocity_metrics (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model_name text not null,
  benchmark_elo integer not null,
  release_date date not null default current_date,
  capability_jump_pct numeric(5, 2) not null default 0.00,
  created_at timestamptz not null default now()
);

create table if not exists public.financial_velocity_projections (
  id uuid primary key default gen_random_uuid(),
  velocity_factor numeric(5, 2) not null,
  projected_arr_usd numeric(12, 2) not null,
  enterprise_b2b_demand_multiplier numeric(5, 2) not null,
  calculated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.ai_velocity_metrics enable row level security;
alter table public.financial_velocity_projections enable row level security;

-- Policies for public.ai_velocity_metrics
create policy "Allow read access to ai_velocity_metrics for authenticated admins"
  on public.ai_velocity_metrics
  for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'ceo', 'moderator')
    )
  );

create policy "Allow write access to ai_velocity_metrics for authenticated admins"
  on public.ai_velocity_metrics
  for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'ceo', 'moderator')
    )
  );

-- Policies for public.financial_velocity_projections
create policy "Allow read access to financial_velocity_projections for authenticated admins"
  on public.financial_velocity_projections
  for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'ceo', 'moderator')
    )
  );

create policy "Allow write access to financial_velocity_projections for authenticated admins"
  on public.financial_velocity_projections
  for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'ceo', 'moderator')
    )
  );

-- ROLLBACK:
-- drop table if exists public.financial_velocity_projections;
-- drop table if exists public.ai_velocity_metrics;
