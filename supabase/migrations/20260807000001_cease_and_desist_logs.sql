-- Migration: 20260807000001_cease_and_desist_logs.sql
-- Description: Create cease_and_desist_logs table with public read & admin write RLS policies.

CREATE TABLE IF NOT EXISTS public.cease_and_desist_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.ai_providers(id) ON DELETE SET NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('low', 'medium', 'high', 'critical', 'existential')),
  legal_text TEXT NOT NULL,
  our_response TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cease_desist_provider ON public.cease_and_desist_logs(provider_id);
CREATE INDEX IF NOT EXISTS idx_cease_desist_published ON public.cease_and_desist_logs(published_at DESC);

-- Enable RLS
ALTER TABLE public.cease_and_desist_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public read policy
DROP POLICY IF EXISTS "Public read cease_and_desist_logs" ON public.cease_and_desist_logs;
CREATE POLICY "Public read cease_and_desist_logs"
  ON public.cease_and_desist_logs
  FOR SELECT
  USING (true);

-- 2. Admin write policy
DROP POLICY IF EXISTS "Admin write cease_and_desist_logs" ON public.cease_and_desist_logs;
CREATE POLICY "Admin write cease_and_desist_logs"
  ON public.cease_and_desist_logs
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Insert initial sample seed data if ai_providers exists
DO $$
DECLARE
  v_provider_id UUID;
BEGIN
  SELECT id INTO v_provider_id FROM public.ai_providers LIMIT 1;
  
  INSERT INTO public.cease_and_desist_logs (provider_id, threat_level, legal_text, our_response, published_at)
  VALUES (
    v_provider_id,
    'critical',
    'NOTICE OF INTENT TO SUE & CEASE AND DESIST: Immediate takedown of published Incident #INC-2026-0892 regarding model hallucination and corporate privacy leak required within 24 hours. Failure to comply will result in injunctive relief and civil damage claims under jurisdiction of California State Court.',
    'ALPAR AI STREISAND SHIELD RESPONSE: Request rejected in accordance with DSA Article 17 (Host Liability Exemption) and KVKK Public Interest Provisions. As a neutral trust infrastructure, ALPAR AI does not alter, redact, or suppress verified public-interest AI incidents. This demand letter is now permanently archived in our public Streisand Shield Transparency Register.',
    now() - INTERVAL '2 days'
  ),
  (
    v_provider_id,
    'high',
    'LEGAL DEMAND FOR CONTENT REMOVAL: Unauthorised trademark usage and defamatory benchmarking scores for model Grok-3. We demand immediate retraction of the K-BENCHMARK evaluation report and deletion of related user comments.',
    'ALPAR AI STREISAND SHIELD RESPONSE: Refused. K-BENCHMARK evaluation relies strictly on empirical, reproducible prompt tests and open science protocols. Trademark usage is fair-use for identification purposes under EU AI Act transparency rules.',
    now() - INTERVAL '7 days'
  );
END $$;

-- ROLLBACK:
-- DROP TABLE IF EXISTS public.cease_and_desist_logs CASCADE;
