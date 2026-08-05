-- Migration for funnel events tracking
CREATE TABLE IF NOT EXISTS public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  session_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to funnel_events" ON public.funnel_events FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin read funnel_events" ON public.funnel_events FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = true
  )
);

-- Indices
CREATE INDEX idx_funnel_events_event_name ON public.funnel_events(event_name);
CREATE INDEX idx_funnel_events_created_at ON public.funnel_events(created_at);

-- ROLLBACK:
-- DROP TABLE IF EXISTS public.funnel_events CASCADE;
