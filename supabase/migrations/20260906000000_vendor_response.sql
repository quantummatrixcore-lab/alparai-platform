-- =============================================================================
-- Migration: Vendor Defense Portal Response Schema
-- Table: incidents
-- Columns: vendor_response_text, vendor_response_at
-- Features: RLS Policies, Rollback Block
-- =============================================================================

ALTER TABLE public.incidents
    ADD COLUMN IF NOT EXISTS vendor_response_text TEXT,
    ADD COLUMN IF NOT EXISTS vendor_response_at TIMESTAMPTZ;

-- Index for querying vendor responses efficiently
CREATE INDEX IF NOT EXISTS idx_incidents_vendor_response ON public.incidents(vendor_response_at) WHERE vendor_response_at IS NOT NULL;

-- Enable RLS on incidents (idempotent)
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policy allowing moderators, admins, or vendor roles to update response fields
CREATE POLICY "Vendor defense response update policy"
    ON public.incidents FOR UPDATE
    TO authenticated
    USING (
        public.is_moderator(auth.uid()) OR public.is_admin(auth.uid()) OR (auth.jwt() ->> 'role' = 'vendor')
    )
    WITH CHECK (
        public.is_moderator(auth.uid()) OR public.is_admin(auth.uid()) OR (auth.jwt() ->> 'role' = 'vendor')
    );

-- -- ROLLBACK:
-- DROP POLICY IF EXISTS "Vendor defense response update policy" ON public.incidents;
-- DROP INDEX IF EXISTS idx_incidents_vendor_response;
-- ALTER TABLE public.incidents DROP COLUMN IF EXISTS vendor_response_at;
-- ALTER TABLE public.incidents DROP COLUMN IF EXISTS vendor_response_text;
