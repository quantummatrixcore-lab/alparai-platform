-- Migration: 20260805174500_sync_real_infrastructure_plans.sql
-- Description: Sync real production infrastructure plans and costs into finance_monthly_costs and vendor_quotas

-- Update or insert Vercel ($20/mo Pro) & Supabase ($35/mo Pro + Addon) into finance_monthly_costs for current and past months
INSERT INTO public.finance_monthly_costs (service, month, amount_usd, budget_usd, currency)
VALUES
  ('vercel', '2026-08-01', 20.00, 20.00, 'USD'),
  ('supabase', '2026-08-01', 35.00, 35.00, 'USD'),
  ('claude_pro', '2026-08-01', 20.00, 20.00, 'USD'),
  ('google_ultra', '2026-08-01', 19.99, 19.99, 'USD'),
  ('resend', '2026-08-01', 0.00, 0.00, 'USD'),
  ('upstash', '2026-08-01', 0.00, 5.00, 'USD'),
  ('github', '2026-08-01', 4.00, 4.00, 'USD'),
  ('openrouter', '2026-08-01', 10.00, 10.00, 'USD')
ON CONFLICT (service, month) DO UPDATE
SET amount_usd = EXCLUDED.amount_usd, budget_usd = EXCLUDED.budget_usd, updated_at = now();

-- Update vendor_quotas entries with real Pro plan names & limits
UPDATE public.vendor_quotas
SET plan_name = 'Pro', limit_value = 1000, updated_at = now()
WHERE vendor = 'vercel';

UPDATE public.vendor_quotas
SET plan_name = 'Pro + Custom Domain Addon', limit_value = 8, updated_at = now()
WHERE vendor = 'supabase';

-- Ensure vendor_quotas has up-to-date manual seed rows
INSERT INTO public.vendor_quotas 
    (vendor, metric, limit_value, used_value, unit, period_start, period_end, plan_name, source)
VALUES 
    ('vercel', 'bandwidth_gb', 1000, 15, 'GB', '2026-08-01', '2026-08-31', 'Pro', 'manual'),
    ('supabase', 'db_size_gb', 8, 0.5, 'GB', '2026-08-01', '2026-08-31', 'Pro + Custom Domain Addon', 'manual')
ON CONFLICT DO NOTHING;

-- ROLLBACK:
-- UPDATE public.finance_monthly_costs SET amount_usd = 0.00 WHERE service = 'supabase' AND month = '2026-08-01';
