-- Update incident_source check constraint to allow external fetcher sources
ALTER TABLE public.incidents DROP CONSTRAINT IF EXISTS incidents_incident_source_check;

ALTER TABLE public.incidents ADD CONSTRAINT incidents_incident_source_check 
CHECK (incident_source IN ('user_submitted', 'aiaaic_import', 'aiid_import', 'news_curated', 'court_record', 'reddit', 'hn', 'github', 'hackerone', 'rss'));

-- ROLLBACK:
-- ALTER TABLE public.incidents DROP CONSTRAINT IF EXISTS incidents_incident_source_check;
-- ALTER TABLE public.incidents ADD CONSTRAINT incidents_incident_source_check 
-- CHECK (incident_source IN ('user_submitted', 'aiaaic_import', 'aiid_import', 'news_curated', 'court_record'));
