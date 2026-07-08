# ALPAR AI — Launch Day Runbook

_Version 1.0 (Effective July 2026)_

This document serves as the operational guide for the ALPAR AI founder to manage launch day monitoring, alarms, escalations, and emergency procedures.

---

## 🚨 Monitoring & Alarm Thresholds

On launch day, actively monitor Sentry, Supabase, and Vercel dashboards. If any of the following thresholds are breached, execute the corresponding actions:

### 1. Sentry Errors (P0 Alert)

- **Threshold:** `> 5` unresolved errors per hour.
- **Why it matters:** Indicates a widespread application crash, client-side break, or Server Action failure.
- **Action:**
  1. Check Sentry issue list for the stack trace.
  2. Identify if the error is related to Supabase connections or API-key issues.
  3. If unresolved within 15 minutes, prepare for Rollback.

### 2. Submission Funnel Conversion (P1 Alert)

- **Threshold:** `submit_start` to `submit_complete` conversion rate falls below `50%`.
- **Why it matters:** Users are starting to submit reports but are dropping out or facing form errors (validation, Turnstile site-key mismatches).
- **Action:**
  1. Go to the Submit page locally or in browser, submit a test report.
  2. Check browser console for Turnstile or next-intl missing key errors.
  3. Verify if RLS policies are blocking the inserts in the `incidents` table.

### 3. Cross-Audit Autopilot Failures (P0 Kill Switch)

- **Threshold:** Autopilot/moderation failure rate `> 20%` in the last hour.
- **Why it matters:** Indicates LLM api credentials (OpenRouter, Vertex) are exhausted or rate-limited, causing autopilot runs to stall.
- **Action:**
  1. Trigger the Autopilot Kill Switch by setting the Vercel environment variable `AUTOPILOT_KILL_SWITCH=true` to suspend automated AI moderation.
  2. All incoming incidents will revert to the manual moderation queue (`pending_review` status).

### 4. Database Connection Limits (P1 Warning)

- **Threshold:** Database active connections `> 15` (on Supabase Free Plan).
- **Why it matters:** Supabase free plan connection limits can be easily exhausted by high concurrent traffic.
- **Action:**
  1. Check Supabase Dashboard → Database → Roles.
  2. Verify that connection pooling (Port 6543) is used instead of direct connection (Port 5432) in `DATABASE_URL`.
  3. Enable read-only caching globally on Next.js to reduce direct query hits.

---

## 🔄 Emergency Rollback Procedure

If a critical bug is introduced or the server experiences a complete outage due to a bad release:

1. **Revert the last commit locally:**
   ```bash
   git revert HEAD -m "revert: bad deployment"
   ```
2. **Push the revert to origin/master:**
   ```bash
   git push origin master
   ```
3. **Verify Vercel Promotion:**
   Vercel will automatically build the pushed commit and deploy it. Since master is the production target, the reverted build will go live instantly (deploy in ~2 minutes).

---

## 📞 Escalation Contacts & Support

- **Database / Infrastructure (Supabase):**
  - Portal: https://supabase.com/dashboard/project/azszpzyvxjduhemkjsdh
  - Support: support@supabase.io
- **Hosting / Deployments (Vercel):**
  - Portal: https://vercel.com/quantummatrixcore-lab/alparai-com
- **OAuth / Google Cloud API:**
  - Account: `quantum.matrix.core@gmail.com`
  - Portal: https://console.cloud.google.com/apis/credentials
- **Lead Architect / Emergency Escalation:**
  - AI Team: `antigravity@quantummatrixcore-lab.users.noreply.github.com`
