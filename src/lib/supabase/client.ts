import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://ojwtxkwsglbxdkqoliaq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qd3R4a3dzZ2xieGRrcW9saWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjMzNzgsImV4cCI6MjA4NzYzOTM3OH0.zzi9JmZGASUGAgKKbcbye8yMke-m08UrSC850MFYxC8'
  )
}
