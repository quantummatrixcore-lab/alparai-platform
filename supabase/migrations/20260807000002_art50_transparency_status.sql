-- Migration: Create art50_transparency_status table
-- Description: EU AI Act Article 50 Compliance Toolkit table for AI watermark, C2PA provenance and disclosure status.

create table if not exists public.art50_transparency_status (
    id uuid primary key default gen_random_uuid(),
    provider_id uuid references public.ai_providers(id) on delete cascade,
    c2pa_provenance_enabled boolean not null default false,
    watermarking_technology text not null default 'none',
    ai_disclosure_compliant boolean not null default false,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Index for lookup performance
create index if not exists idx_art50_transparency_status_provider_id on public.art50_transparency_status(provider_id);

-- Enable RLS
alter table public.art50_transparency_status enable row level security;

-- Policies
create policy "Anyone can read Art 50 transparency status"
on public.art50_transparency_status
for select
using (true);

create policy "Only admins can insert Art 50 transparency status"
on public.art50_transparency_status
for insert
with check (public.is_admin(auth.uid()));

create policy "Only admins can update Art 50 transparency status"
on public.art50_transparency_status
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Only admins can delete Art 50 transparency status"
on public.art50_transparency_status
for delete
using (public.is_admin(auth.uid()));

-- Realtime publication
alter publication supabase_realtime add table public.art50_transparency_status;

-- ROLLBACK:
-- DROP TABLE IF EXISTS public.art50_transparency_status CASCADE;
