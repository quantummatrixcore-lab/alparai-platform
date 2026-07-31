-- Migration: Cleanup fabricated finance_monthly_costs data
-- Replaces fake/placeholder cost figures with verified or unmeasured state.
-- Vercel runs on the Hobby plan ($0). The other 6 services cannot be
-- cross-verified against invoices/dashboards, so amount_usd is set to NULL.

-- 1. Allow amount_usd to be NULL (unmeasured/unverified)
ALTER TABLE public.finance_monthly_costs ALTER COLUMN amount_usd DROP NOT NULL;

-- 2. Track cost source ('api' | 'manual')
ALTER TABLE public.finance_monthly_costs
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual';

-- 3. Vercel is on the Hobby plan: $0.00 actual cost, $0.00 budget
UPDATE public.finance_monthly_costs
SET amount_usd = 0,
    budget_usd = 0,
    metadata = COALESCE(metadata, '{}'::jsonb) || '{"plan_name":"Hobby"}'::jsonb
WHERE service = 'vercel';

-- 4. Remaining services cannot be cross-verified -> unmeasured
UPDATE public.finance_monthly_costs
SET amount_usd = NULL
WHERE service IN ('gemini', 'anthropic', 'upstash', 'buffer', 'supabase', 'resend');

-- ROLLBACK:
-- ALTER TABLE public.finance_monthly_costs ALTER COLUMN amount_usd SET NOT NULL;
-- ALTER TABLE public.finance_monthly_costs DROP COLUMN IF EXISTS source;
-- UPDATE public.finance_monthly_costs SET amount_usd = 12.50, budget_usd = 20.00, metadata = NULL WHERE service = 'vercel' AND month = '2026-06-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 14.20, budget_usd = 20.00, metadata = NULL WHERE service = 'vercel' AND month = '2026-07-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 8.50 WHERE service = 'gemini' AND month = '2026-06-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 10.10 WHERE service = 'gemini' AND month = '2026-07-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 3.00 WHERE service = 'anthropic' AND month = '2026-06-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 4.50 WHERE service = 'anthropic' AND month = '2026-07-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 1.00 WHERE service = 'upstash' AND month = '2026-06-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 1.20 WHERE service = 'upstash' AND month = '2026-07-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 6.00 WHERE service = 'buffer' AND month = '2026-06-01';
-- UPDATE public.finance_monthly_costs SET amount_usd = 6.00 WHERE service = 'buffer' AND month = '2026-07-01';
