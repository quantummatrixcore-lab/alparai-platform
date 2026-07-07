import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function test() {
  const env = fs.readFileSync('.env.local', 'utf-8');
  let url = '', key = '';
  for (const line of env.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim().replace(/^"|"$/g, '');
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) key = line.split('=')[1].trim().replace(/^"|"$/g, '');
  }
  
  const supabase = createClient(url, key);
  const { data: incidents, error: err } = await supabase
    .from('incidents')
    .select('id, title, status, processing_stage, ai_moderation_score, cross_audit_truth_score, moderator_notes, created_at')
    .order('created_at', { ascending: false })
    .limit(3);
    
  if (err) {
      console.error(err);
      return;
  }
  console.log(incidents);
}

test();
