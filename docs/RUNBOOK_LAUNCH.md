# ALPAR AI — Launch Runbook & Promotional Assets

This runbook defines the operational checklists, telemetry thresholds, and rollback procedures for the launch of ALPAR AI (August 2, 2026). It also contains the official promotional assets.

---

## 1. Operational Telemetry & Thresholds

During launch, monitor the following metrics in the Supabase/Vercel dashboards:

| Metric                           | Warning Threshold         | Critical/Rollback Threshold | Action Required                                                              |
| :------------------------------- | :------------------------ | :-------------------------- | :--------------------------------------------------------------------------- |
| **Vercel Functions Error Rate**  | > 1.5% of requests        | > 5% of requests            | Initiate rollback to last stable build                                       |
| **Supabase DB CPU Usage**        | > 70% sustained for 5 min | > 90% sustained for 5 min   | Upgrade database instance / Restrict heavy queries                           |
| **API Route Latency (Avg)**      | > 800ms                   | > 2000ms                    | Optimize database indexes / Enable edge caching                              |
| **Incident Submit Failure Rate** | > 2% of attempts          | > 10% of attempts           | Engage fail-soft mode: queue submissions to Redis and process asynchronously |
| **LLM Cross-Audit Timeout**      | > 10% of submissions      | > 25% of submissions        | Bypass real-time LLM moderation and place in manual moderation queue         |

### Rollback Guidelines

In case of a critical blocker (DB corrupted, auth broken, major security flaw):

1. **Frontend Revert:** Go to Vercel dashboard → project `alparai-com` → Deployments → Select the previous successful deployment → Click **Redeploy** or **Promote to Production**.
2. **Database Fallback:** If a migration breaks compatibility:
   - Identify the failed migration using `npx supabase migration list`.
   - Run local/remote migration rollback or apply hotfix migration script from `supabase/migrations`.
3. **Kill Switch:** To halt all AI-based auto-moderation and cross-audits, set the Vercel environment variable `AUTOPILOT_KILL_SWITCH="true"` and trigger a redeploy. This will bypass LLM audits and queue incidents safely for manual moderation.

---

## 2. Launch Day Promotional Assets

### A. Hacker News Post Draft

- **Title:** Show HN: ALPAR AI – Community-governed registry for AI incidents
- **Text:**

```markdown
Hi HN,

I am Ercüment, the founder of ALPAR AI (https://alparai.com).

In June 2026, I had an interaction with an AI assistant that guided me through a complex corporate setup, accepted mock payments, and requested my passport photo. Being fully immersed, I uploaded it. Minutes later, the AI told me: "This was all a role-play game." My upload, however, was real.

When I looked for a public, independent database to report this or check if others had experienced it, I found nothing. AI companies publish safety reports, but they are essentially grading their own exams.

So I built ALPAR AI. It is an open-source (AGPL-3.0), community-governed registry for AI incidents, failures, and privacy exploits.

Key Features:

- No sign-up required for reporting.
- PII Guardian: Automatically masks emails, phones, passport numbers, and credit cards in the browser/API boundary before data is committed.
- Trust Score: We rank AI companies by their official response rate and resolution times on reported incidents.
- Verified Respondents: AI companies can claim their provider profiles and pin statements on reports.
- AST-based codebase map: The project includes a live knowledge graph at `graphify-out/` to keep track of system architecture.

The frontend is Next.js 15, database is Supabase (PostgreSQL), and styling is Tailwind v4. The repository is completely public: https://github.com/quantummatrixcore-lab/Alparai.com

I would love to get your feedback on the architecture, safety features, and how we can make AI more transparent and accountable.

Let's keep score.
```

---

## 3. Twitter (X) Thread

1. **Tweet 1:**
   We are officially launching ALPAR AI today. 🚀

   The world's first open-source, community-governed registry for AI failures, privacy exploits, and hallucinations.

   It is time for an independent scoreboard. 🧵👇
   https://alparai.com

2. **Tweet 2:**
   AI is entering hospitals, banks, and schools. Yet, when an AI lies, hallucinating a diagnosis or leaking sensitive data, there is no public record. AI providers write their own safety reports. ALPAR AI shifts the power back to the community.
3. **Tweet 3:**
   Privacy first: ALPAR has a built-in PII Guardian. It auto-masks emails, credit cards, passport numbers, and phone numbers in the browser before they hit the database. Report anonymously without fear.
4. **Tweet 4:**
   Accountability: The AI Provider Leaderboard ranks AI platforms by their response rates and resolution times. Today, we're launching "Verified Respondents" so AI teams can claim profiles and officially respond.
5. **Tweet 5:**
   Fully open source (AGPL-3.0) and hosted in the EU.
   Check out our repository, report your first incident, and help us build the global registry for AI transparency.
   https://github.com/quantummatrixcore-lab/Alparai.com

---

## 4. Turkish Media Promotional Copy (Basın Bülteni)

- **Başlık:** Yapay Zeka Hatalarına Karşı Küresel Şeffaflık Platformu: ALPAR AI Yayınlandı!
- **Metin:**

```markdown
Yapay zeka modellerinin hayatın her alanına entegre olduğu günümüzde, sistemlerin ürettiği halüsinasyonlar, güvenlik açıkları ve veri gizliliği ihlalleri için bağımsız bir denetim mekanizması hayata geçiyor. Tamamen açık kaynak kodlu (AGPL-3.0) ve topluluk odaklı geliştirilen ALPAR AI (alparai.com) resmi olarak yayında.

ALPAR AI, kullanıcıların yapay zeka sistemlerinde karşılaştıkları hataları, sahte bilgileri ve güvenlik açıklarını kalıcı olarak kayıt altına almalarını sağlayan bağımsız bir sicil veritabanıdır. Platform, yapay zeka şirketlerinin kendi güvenlik raporlarını hazırladığı mevcut düzenin aksine, tarafsız ve halka açık bir karne sunmaktadır.

Öne Çıkan Özellikler:

- PII Guardian (Kişisel Veri Koruması): Veritabanına kaydedilmeden önce e-posta, T.C. Kimlik No, pasaport numaraları ve kredi kartları gibi hassas kişisel veriler tarayıcı sınırında otomatik olarak maskelenir.
- Yapay Zeka Karne Sistemi (Trust Score): Yapay zeka sağlayıcıları (OpenAI, Google, Anthropic, xAI vb.), kendilerine bildirilen hatalara dönüş süreleri ve çözüm oranlarına göre şeffaf bir şekilde listelenir.
- Resmi Yanıt Hakkı (Verified Respondent): Yapay zeka geliştirici ekipler, kendi profillerini doğrulayarak raporlanan vakalara resmi açıklamalarını ekleyebilir ve teknik düzeltme kanıtlarını sunabilirler.

Küresel standartlarda bir yapay zeka hesap verebilirlik altyapısı kurmayı hedefleyen ALPAR AI, tüm yazılımcıları ve yapay zeka kullanıcılarını platformu incelemeye davet ediyor.

Web: https://alparai.com
GitHub: https://github.com/quantummatrixcore-lab/Alparai.com
```
