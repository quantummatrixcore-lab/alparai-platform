# ALPAR AI — MASTER PLAN v8.5 (Pre-Launch Sprint Tamamlandı — Post-Launch Otopilot Aktif)

> **Bu dosya tek doğru operasyonel plandır.** `docs/ANTIGRAVITY_EXECUTION_PLAN.md` v7.16'da arşivlendi (tarihsel audit trail; talimat olarak okunmaz). Çelişkide bu dosya kazanır. Bu dosyayı yalnızca Architect düzenler (Rule #14/#25).

---

## §1 Kimlik & Misyon

ALPAR = **bağımsız kamu AI olay kaydı + bağımsız AI değerlendirici** ("Moody's-for-AI"). EU AI Act Art. 73 kamu olay-bildirim platformu; referee, vendor değil.

Üç bacak: **Veri** (incident registry) + **Yöntem** (K-BENCHMARK, TruthScore, cross-audit) + **İnsanlar** (advisory board, uzman ağı, akademik ortaklıklar).

Bottleneck sırası: **users (2026) → revenue (2027 H1) → regulatory moment (2027 H2)**. Her işin testi: bu sıradaki mevcut bottleneck'e hizmet ediyor mu?

## §2 İki Sabit Tarih

- **Aug 2 2026** — launch (kamu taahhüdü)
- **Dec 2 2027** — EU AI Act Art. 73 zorunlu bildirim başlar (yasal)

Başka takvim tarihi YOK (Rule #23). Tüm işler bağımlılık-tabanlı P0/P1/P2 sıralanır.

## §3 Standing Rules (25 — ihlal = otomatik review fail)

1. **Push before report.** Rapor `origin/master` commit hash'i ile biter. Push edilmemiş iş yoktur.
2. **Plan-dışı commit YASAK.** Fikir → `docs/PROPOSALS/NNN-name.md` + DUR. **Retro-approve kotası DOLU** (state_support `76ddec4` + Neutrality Charter `133af72`) — üçüncü istisna yok; plan-dışı commit revert edilir.
3. Auth path'te hardcoded credential fallback (`|| "..."`) yasak.
4. Brand: dark slate `#0A1622` + emerald `#00FF88`. Founder onayı olmadan değişmez.
5. Wording: "AI Act **Ready/aligned**", asla "compliant". High-risk etiketleri informational-only disclaimer taşır.
6. **Hiçbir şey onaylı queue item olmadan dışarı post/email edilmez.** Auto-post flag'leri tık'ı atlar, kuyruğu atlamaz.
7. Her user-facing string: next-intl, **EN+TR** birlikte.
8. **Her yeni tablo aynı migration'da RLS ile gelir.** Public sayfalar anon client kullanır; `createAdminClient()` public path'te yasak.
9. Tüm dış fetch SSRF-safe: host allowlist, private-IP redirect yok, size/time limit.
10. Quality gate: `pnpm typecheck` + vitest + eslint 0 warning; dokunulan akışlara Playwright; raporda Accept doğrulama yöntemi.
11. Haftalık DB snapshot (Pazartesi, PII-masked) + `process-deletions` cron çalışma kanıtı.
12. **Her migration `-- ROLLBACK:` bloğu içerir.**
13. "User-zero" test: her user-facing özellik prod'da anonim ilk-ziyaretçi olarak test edilir.
14. **Plan doc'ları Executor için read-only.** Yalnızca Architect düzenler. Executor önerisi → `docs/PROPOSALS/`.
15. Single-branch: `master`, küçük commit'ler. Feature branch yok.
16. Stage tamamlama Architect onay satırı gerektirir: `Architect-Approval: <hash> <YYYY-MM-DD>`. Executor kendini onaylayamaz.
17. **API kimlik doğrulama: sha256 hash karşılaştırma + `crypto.timingSafeEqual`.** Plaintext karşılaştırma review fail.
18. İşe başlamadan kod-gerçeklik mutabakatı: plan iddialarını koda karşı grep'le; uyumsuzluk → proposal, kod değil.
19. **Numeric-claim honesty:** UI'daki her sayı DB'den canlı + source-split. "Verified" kelimesi yalnızca `expert_verified = true` için.
20. Maliyet alarmı: günlük >$50 uyarı / >$100 otomatik kısma / aylık $500 tavan / `COST_KILL_SWITCH` env.
21. **L1 danışma kurulu ismi yayınlanmadan yazılı onay** `docs/L1_APPROVALS/` altında arşivlenir.
22. `expert_verified` yalnızca L3 ağı üyesince işaretlenir; UI'da "uzman/expert" yalnızca L3 için ("advisor" ayrı kavram).
23. **Post-launch işlerde takvim tarihi kullanılmaz** — yalnızca §2'deki iki tarih. P0/P1/P2 bağımlılık sıralaması.
24. **Rapor son satırı:** `Verified-Against: origin/master HEAD = <hash>` (komut: `git fetch origin && git log origin/master -1 --format=%H`). Push başarısızsa "unpushed — retry pending" yazılır; hayali hash = bir uyarı sonrası devre dışı bırakma.
25. **Executor "Architect" imzası atamaz.** Plan doc'larına Architect-Approval satırı yalnızca Architect yazar.

**Güvenlik sabitleri (kural üstü):** PII/ham kanıt `src/lib/pii/guardian.ts`'ten geçmeden DB/storage'a yazılmaz · RLS asla zayıflatılmaz · prod'a destructive DB op yok · `docs/EU_AI_ACT_TAXONOMY.md` dışında hukuki iddia yok.

## §4 Doğrulanmış Mevcut Durum

**Shipped (hash'lerle, doğrulanmış):**

| Seri               | İçerik                                                                                                                                                                                                                                     | Commit                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| V1+V2              | vercel.json cron'ları (daily — Hobby tavanı)                                                                                                                                                                                               | `f2107a5`, `a671fc1`                           |
| U1-U3              | HMAC unsubscribe API + template'ler                                                                                                                                                                                                        | `7f30125`                                      |
| M0-M3              | Mobile sprint (config, audit, overflow fix, CI lock)                                                                                                                                                                                       | `89a75ba`, `bb1fcca`, `de59706`, `aace3ba`     |
| C1a                | api_keys sha256 hardening + auth path                                                                                                                                                                                                      | `20260715000000` + `20260720000001` migrations |
| H1+H2              | incident_source badge + copy                                                                                                                                                                                                               | `incident-card.tsx`                            |
| P1/P3/P4           | Countdown drafts, TR media pitches, LinkedIn/Reddit                                                                                                                                                                                        | `fa80867`, `4d47356`, `745b4fa`                |
| W-series           | RUNBOOK_LAUNCH_DAY v1.1 + dry run                                                                                                                                                                                                          | `cf4ecce`, `5bd8cd4`                           |
| X1-X5              | Crisis playbook'lar                                                                                                                                                                                                                        | `98936ab`                                      |
| Y1-Y3              | launch-signal dashboard + day-7/30 cron'lar                                                                                                                                                                                                | `fa80867`, `98936ab`                           |
| K2 (erken)         | retro-audit scheduler                                                                                                                                                                                                                      | shipped                                        |
| J3/state_support   | Devlet destekleri modülü                                                                                                                                                                                                                   | `76ddec4` (retro-approved)                     |
| Neutrality Charter | `/neutrality` sayfası                                                                                                                                                                                                                      | `133af72` (retro-approved)                     |
| S1-S3              | Secrets scan, dep audit, security headers (HSTS doğrulandı)                                                                                                                                                                                | shipped                                        |
| v8.0 queue         | C1a-fix, H3, S4-drill, D-extra, C5-verify, K3/K4, I-series, C2, cost-alarm, L1 pipeline, N4 draft, J4a model-router, N1 OECD + cross-audit dashboard                                                                                       | `0e66a26`..`4fced12`                           |
| K-MVP+K-Full       | K5-K12 scaffold, `/ratings` page, `k_categories`/`k_model_scores` tables, L2 MOU template, outreach agent, expert network                                                                                                                  | `4aca97f`, `43436d9` ⚠️                        |
| SSRF-fix + types   | Evidence extraction domain allowlist + Supabase type updates                                                                                                                                                                               | `25b8acd`, `cc0b5dc`                           |
| v8.2–v8.4 Sprint   | W3-fix (cost-alarm cron) · Q1 gate log · S4-path drill · K-CORE verify · RLS hardening (`20260727000002_harden_rls_policies.sql`) · E1 user-zero + screenshots · S5 Lighthouse (home/incidents/submit) · Perf-baseline cwv · C3-SSRF audit | `34d06f6`..`c0470b0`                           |

**Architect v8.5 doğrulama taraması (2026-07-12):** Pre-launch sprint items 1-9 tümü ✅ · `cost-alarm` cron vercel.json'da kayıtlı ✅ · `docs/METHODOLOGY_AUDITS/` 9 artifact ✅ · Q1 gate pass ✅ · RLS hardening migration ✅ · E1 + S5 + Perf + SSRF kanıtı ✅ · origin/master HEAD = `c0470b0`.

**⚠️ Rule ihlalleri (`4aca97f`, `43436d9`) — kapatıldı:** Founder revert kararı vermedi → kabul edilmiş sayılır. Audit trail için ⚠️ notu korunur. Retro-approve kotası hâlâ DOLU.

**Traction baseline:** 4 organik rapor (Grok pasaport vakası dahil) + ~405 seed. UI'da bu ayrım daima görünür (Rule #19).

## §5 OTOPILOT İŞ KUYRUĞU

**Otopilot protokolü:**

1. Kuyruğun en üstündeki ⬜ item'ı al.
2. Uygula → Rule #10 gate → commit → push → rapor (`Verified-Against:` son satır).
3. ⏸ item'ı ATLA (founder/Architect kapısı), sıradakine geç. Onay beklerken bağımsız sıradaki item'a başla — bekleme = review finding.
4. Kuyruk boşaldıysa: tüm repo'ya Rule #10 gate çalıştır, bulguları `docs/PROPOSALS/` altına yaz, DUR.
5. Plan-dışı fikir → `docs/PROPOSALS/NNN-name.md`, kod YOK (Rule #2 kotası dolu).
6. Aynı dosyalara dokunan iki onaysız item üst üste bindirilmez.

**Kuyruk (üstten alta):**

### P0 — Launch Blocker (Aug 1 freeze öncesi zorunlu)

| #   | P   | İş                                                                                                                                                   | Accept kriteri                                                                               | Kapı         |
| --- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------ |
| 1   | P0  | **W3-fix** — `vercel.json`'a `cost-alarm` cron kaydı ekle: `"path": "/api/cron/cost-alarm", "schedule": "0 6 * * *"`                                 | `grep cost-alarm vercel.json` = 1 eşleşme; toplam cron path sayısı = 9                       | ✅ `34d06f6` |
| 2   | P0  | **Q1** — `pnpm typecheck && pnpm test && pnpm lint` sıfır hata/uyarı. Hata varsa fix commit                                                          | 3 komutun çıktısı raporda (tümü pass); `docs/METHODOLOGY_AUDITS/quality-gate-2026-07-12.log` | ✅ `8c9c904` |
| 3   | P0  | **S4-path** — `mkdir -p docs/METHODOLOGY_AUDITS && git mv docs/security/S4-restore-drill.md docs/METHODOLOGY_AUDITS/S4-restore-drill-2026-07-12.log` | `ls docs/METHODOLOGY_AUDITS/S4-*` = 1                                                        | ✅ `f8ca0fc` |

### P1 — Pre-Launch Hardening (Aug 1 öncesi)

| #   | P   | İş                                                                                                                 | Accept kriteri                                                               | Kapı         |
| --- | --- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------ |
| 4   | P1  | **K-CORE verify** — Retro-audit cron en az 1 incident'ı `cross_audit_results`'a işliyor. Kanıt: `count(*)` çıktısı | `docs/METHODOLOGY_AUDITS/k-core-verify.md`                                   | ✅ `ac4cca9` |
| 5   | P1  | **RLS-audit** — Tüm tablolarda RLS etkin. Anon client → admin tablo → 0 satır                                      | `docs/METHODOLOGY_AUDITS/rls-audit.md`; eksik RLS → migration + ROLLBACK     | ✅ `cd58d2b` |
| 6   | P1  | **E1 user-zero** — Anonim: anasayfa → incidents → submit → OG embed. Her adım screenshot                           | `docs/METHODOLOGY_AUDITS/user-zero-walkthrough.md` + ekranlar                | ✅ `d4109b3` |
| 7   | P1  | **S5-redo** — Lighthouse mobile (home/incidents/submit); 3 JSON raporu                                             | Her sayfa ≥85 veya <85 için fix; `docs/METHODOLOGY_AUDITS/lighthouse-*.json` | ✅ `671795d` |

### P2 — Polish (Aug 1 öncesi, blocker değil)

| #   | P   | İş                                                                                                                | Accept kriteri                            | Kapı         |
| --- | --- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------ |
| 8   | P2  | **Perf-baseline** — LCP/FID/CLS ölçümü 3 ana sayfa                                                                | `docs/METHODOLOGY_AUDITS/cwv-baseline.md` | ✅ `c0470b0` |
| 9   | P2  | **C3-complete** — `openrouter-gateway`, OECD feed, import-incidents, fetch-external için SSRF allowlist doğrulama | `docs/METHODOLOGY_AUDITS/ssrf-audit.md`   | ✅ `c0470b0` |

### Launch Freeze (Aug 1–9) — bu pencerede otopilot durur, `docs/RUNBOOK_LAUNCH_DAY.md` izlenir

### Post-Launch Kuyruğu (Aug 10 sonrası aktif — önceden onaylı, tekrar Architect izni gerekmez)

Bağımlılık sırası korunur: L1 isimleri → L3/L4 kapı açar; L2 MOU → L5/L6/L7 kapı açar; K-Full veri → L9/L10 tetiklenir; revenue path (K-Product+L8) her zaman en yüksek öncelik.

| #   | P   | İş                                                                                                                                                                                         | Accept kriteri                                                                            | Kapı                         |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------- |
| 10  | P0  | **L9** — Methodology Advisory Committee sayfası (`/about/methodology-committee`, EN+TR) + `methodology_committee_members` migration (RLS+ROLLBACK) + davet şablonu. L1 üyeleriyle çakışmaz | Sayfa canlı, isimler boş; Rule #21 benzeri — yazılı onay olmadan isim yayınlanmaz         | ✅ `c740e81` kod / ⏸ isimler |
| 11  | P0  | **L10** — Peer-review pipeline taslağı: `docs/PAPERS/faact-draft.md` (ACM FAccT hedefi) — K-BENCHMARK metodolojisini özetleyen veri tablosu + taslak metin                                 | Taslak dosya + K-BENCHMARK sample-size/Wilson-score tablosu gömülü                        | ✅ taslak / ⏸ gönderim       |
| 12  | P0  | **L3-verify** — `expert_network` tablosu + `/experts` rep leaderboard uçtan uca çalışıyor mu? ≥1 test-uzman doğrulama akışı simüle edilir                                                  | Vitest + `docs/METHODOLOGY_AUDITS/l3-verify.md`                                           | ✅                           |
| 13  | P0  | **N1-verify** — `/api/v1/oecd/feed` cron gerçekten published incident döndürüyor mu?                                                                                                       | `docs/METHODOLOGY_AUDITS/n1-oecd-verify.md`; ≥1 kayıt kanıtı                              | ✅                           |
| 14  | P0  | **L2 outreach list** — TR+EU üniversite MOU hedef listesi (15-20 kurum) — şablon zaten shipped (`docs/L2_MOU_TEMPLATE.md`)                                                                 | `docs/L2_OUTREACH_LIST.md`                                                                | ✅ liste / ⏸ gönderim        |
| 15  | P0  | **L8** — Role-based dashboard scaffold: `role_view` kolonu (`profiles` tablosu) + 4 boş görünüm (compliance/journalist/legal/safety), veri yok, UI iskelet                                 | Migration (RLS+ROLLBACK) + 4 route; mevcut RLS zayıflatılmaz                              | ✅                           |
| 16  | P0  | **K-Product scaffold** — `private_benchmarks` + `rating_alerts` tabloları (RLS+ROLLBACK) + billing sayfası iskeleti (Stripe key YOK, placeholder ENV)                                      | Migration + `/pricing/enterprise` sayfası; gerçek ödeme akışı founder onayına kadar pasif | ✅ kod / ⏸ stripe-keys       |
| 17  | P1  | **N2 outreach** — UK AISI + US AISI iletişim taslağı (LinkedIn + email metni)                                                                                                              | `docs/N2_OUTREACH_DRAFT.md`                                                               | ✅ taslak / ⏸ gönderim       |
| 18  | P1  | **L4** — Profesyonel dernek listesi (TÜBA, İstanbul Barosu AI Komitesi, IEEE/ACM TR, EU AI Alliance) + davet şablonu                                                                       | `docs/L4_PARTNERSHIPS.md`                                                                 | ✅ liste / ⏸ gönderim        |
| 19  | P1  | **L5** — Instructor tier: `role = 'instructor'` + küratörlü olay paketi (20-30 olay + PDF export)                                                                                          | Migration (RLS+ROLLBACK) + `/academy/instructor` sayfası                                  | ⬜                           |
| 20  | P1  | **L6** — Faculty fellowship sayfası + başvuru formu + admin review kuyruğu                                                                                                                 | `/academy/fellowship` sayfası + `fellowship_applications` tablo (RLS+ROLLBACK)            | ⬜                           |
| 21  | P2  | **L7** — Student ambassador programı sayfası + `student_ambassadors` tablo + admin CRUD                                                                                                    | Sayfa + migration (RLS+ROLLBACK)                                                          | ⬜                           |
| 22  | P2  | **N3** — ISO/IEC + CEN-CENELEC katkı taslağı: ALPAR taksonomisi working-draft formatında                                                                                                   | `docs/N3_STANDARDS_CONTRIBUTION.md`                                                       | ⬜ taslak / ⏸ gönderim       |
| 23  | P2  | **Art.73 tracker scaffold** — `art73_obligation_status` tablosu (provider bazlı) + `/transparency/art-73-tracker` sayfası, veri boş, UI hazır                                              | Migration (RLS+ROLLBACK) + sayfa                                                          | ⬜                           |

**Kural:** Bu kuyruk önceden onaylıdır (Rule #2 kapsamında plan-dışı değil) — Antigravity Aug 10'dan itibaren üstten alta işler, ⏸ item'a gelince atlar. Yeni istisna/genişleme yine Architect onayı gerektirir.

### Post-Launch Trust/Ops/Governance Katmanı (item 24-40)

**Amaç:** "Moody's-for-AI" iddiasının hukuki + operasyonel + fraud-defence altyapısını sıralı olarak inşa etmek. Item 10-23 ile paralel değil, ardıl. Bağımlılık: G1-G3 (yasal audit) K13-16'dan önce çalışır çünkü provider preview + methodology sayfa yasal metinlere referans verir.

| #   | P   | İş                                                                                                                                                                                                                         | Accept kriteri                                                                                                       | Kapı                    |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 24  | P0  | **G1 — Terms of Service gap audit** — `/legal/terms` (80L mevcut) EN+TR next-intl mü? İçerik: no-liability for incident scores, "Ready aligned" ifadesi (Rule #5), K-BENCHMARK score disclaimer                            | `docs/METHODOLOGY_AUDITS/g1-terms-audit.md` + gap fill commit                                                        | ⬜                      |
| 25  | P0  | **G2 — Privacy Policy gap audit** — `/legal/privacy` (90L) KVKK + GDPR alignment; üçüncü taraf listesi tam (Supabase, Vercel, Resend, Sentry, Plausible, OpenRouter, Turnstile); DPO iletişim; veri saklama sürleri        | `docs/METHODOLOGY_AUDITS/g2-privacy-audit.md` + gap fill; KVKK bölümü eksikse ayrı `/legal/kvkk` sayfası (EN+TR)     | ⬜                      |
| 26  | P0  | **G3 — Responsible Disclosure + security.txt** — RFC 9116 uyumlu `public/.well-known/security.txt` (contact, expires, preferred-languages, canonical); `/security` sayfası (126L mevcut) ile çapraz referans               | `curl https://alparai.com/.well-known/security.txt` → 200 + geçerli format; sayfada Contact/Expires alanları         | ⬜                      |
| 27  | P0  | **K13 — Provider 60-day preview queue** — Model provider'ları K-BENCHMARK skor yayınlanmadan 60 gün önce email ile önizler. `k_provider_previews` migration (RLS+ROLLBACK) + cron; email şablonu (EN)                      | Migration + `/api/cron/k-provider-preview` route + vitest; kuyruğa test kaydı düşer, cron 60d önceki kayıtları çeker | ⬜ kod / ⏸ gönderim     |
| 28  | P0  | **K14 — Methodology public page** — `/methodology/k-benchmark` sayfası (EN+TR): kategoriler, Wilson score açıklaması, cross-audit pipeline diyagramı, veri kaynakları, "not verified compliance rating" disclaimer         | Sayfa canlı; `docs/K_BENCHMARK_METHODOLOGY.md` içerik referansı; footer'dan link                                     | ⬜                      |
| 29  | P0  | **K15 — Haftalık K-BENCHMARK re-audit cron** — Retro-audit günlük çalışıyor; K-BENCHMARK için ayrı `weekly-rating-refresh` cron (Pazar 08:00 UTC). Yeni model çıkışlarını yakalar                                          | `vercel.json`'a kayıt; route + vitest; `k_model_scores.last_audited_at` güncellenir                                  | ⬜                      |
| 30  | P1  | **K16 — Model score history** — `k_model_scores_history` MAT view veya tablo (RLS+ROLLBACK); `/ratings/[modelSlug]/history` sayfası (dynamic segment eksik — önce onu ekle); zaman-serisi grafiği (LCP-friendly SSR chart) | Migration + sayfa; ≥1 model için tarih×skor grafiği canlı                                                            | ⬜                      |
| 31  | P1  | **G4 — Data retention schedule** — `docs/DATA_RETENTION.md` (tablo bazlı: raw evidence 24 ay, audit_logs 5 yıl, PII 12 ay, deleted_users 30g grace); `data_retention_policies` reference tablo (RLS+ROLLBACK)              | Doc + migration; policy tablosunda ≥1 kayıt her `public.*` tablosu için                                              | ⬜                      |
| 32  | P1  | **G5 — Provider name redaction workflow** — Named incident'ta provider isim redaction talebi geldiğinde admin queue. `redaction_requests` migration (RLS+ROLLBACK) + admin sayfa; `process-deletions` cron'a hook          | Migration + `/admin/redaction-queue` sayfa; test: talep → onay → provider adı asterisk'e döner                       | ⬜                      |
| 33  | P1  | **F1 — Duplicate incident detection** — Submit path'te `pg_trgm` fuzzy match; skor >0.7 ise "possible duplicate" flag review queue'ya. Migration `CREATE EXTENSION pg_trgm` (RLS-safe) + submit action patch               | Migration + submit test: aynı başlık yakın varyantı flag üretir; false-positive %<5 (10 örnek)                       | ⬜                      |
| 34  | P1  | **F2 — IP + device throttle** — Upstash rate limit'in üstüne submit için `submission_attempts` counter (24h/IP). >10 → admin review. `submission_attempts` migration (RLS+ROLLBACK)                                        | Migration + submit path patch + vitest                                                                               | ⬜                      |
| 35  | P1  | **O1 — Public status page** — `/status` sayfası: Vercel deployment status + Supabase health + Upstash + son 90 gün uptime (statik veya Instatus embed). Self-hosted route, third-party embed CSP allow                     | Sayfa canlı; 4 servis kartı (yeşil/sarı/kırmızı); Rule #9 SSRF-safe                                                  | ⬜                      |
| 36  | P1  | **O2 — Sentry alerting rules** — Kritik hata eşikleri: `error_rate >2%` 5dk → email; `cron.failed` → email. `docs/OPS_RUNBOOK.md` altında alerting matrix                                                                  | Sentry proje ayarları kanıtı screenshot; runbook doc                                                                 | ⬜ kod / ⏸ Sentry-panel |
| 37  | P0  | **O3 — Cost telemetry migration** — Her cross-audit çalıştırma için `cross_audit_runs` (model, tokens_in, tokens_out, cost_usd, latency_ms) — RLS+ROLLBACK. Rule #20 alarm bu tablodan besleniyor                          | Migration + gateway/cross-audit-engine patch; ≥1 satır test ortamında; cost-alarm cron artık gerçek veri okur        | ⬜                      |
| 38  | P1  | **O4 — PITR restore test** — Supabase Point-in-Time Recovery: 10 dk önceki state'e scratch project'te restore, 1 sanity query; `docs/METHODOLOGY_AUDITS/o4-pitr-drill.log`                                                 | Log + RTO ölçümü                                                                                                     | ⬜                      |
| 39  | P0  | **B1 — CLAUDE.md init** — Repo root'ta `CLAUDE.md`: mimari özet (stack, klasör yapısı), key file'lar (guardian, cross-audit-engine, openrouter-gateway), test/lint komutları, kritik Standing Rules özet                   | Dosya mevcut; yeni oturum açan model üzerinden test: "bu proje nedir?" doğru cevap                                   | ⬜                      |
| 40  | P0  | **B2 — Founder handover doc** — `docs/HANDOVER.md`: vendor accounts (Supabase, Vercel, Resend, OpenRouter, Vertex, Upstash, Cloudflare, Sentry, Plausible, Stripe stub), her biri için recovery path + rotation cadence    | Dosya mevcut; ≥10 vendor satırı; hiçbir plain-text secret yok (yalnızca "where to rotate" linkleri)                  | ⬜                      |

**Bağımlılık grafiği (item 24-40):** G1/G2/G3 → K13/K14 (yasal metinlere ref) → K15/K16 (methodology şeffaflığı) · G4 → G5 → F1/F2 (retention policy fraud tanımını çerçeveler) · O3 → Rule #20 gerçek veri (öncelik yükseltilmiştir) · B1/B2 (bus factor) her aşamada güvenlik ağı.

**Ranking mantığı (Opus pass):** O3 ve K13 revenue+trust için P0'a çekildi — cost telemetry olmadan Rule #20 alarm sadece placeholder; provider preview olmadan K-BENCHMARK yayını yasal itiraza açık. G1-G3 ve B1/B2 bus-factor P0'ı: bir gecede tüm tıp değişirse platform hayatta kalmalı.

## §6 Launch Freeze

**Aug 1–9:** yalnızca D/W-series işleri + hotfix. Otopilot bu pencerede kuyruğu bırakır, `docs/RUNBOOK_LAUNCH_DAY.md`'yi izler. Aug 10'da §5'teki Post-Launch Kuyruğu (item 10+) otomatik devreye girer — Architect'ten yeni onay beklenmez.

## §7 Founder Bekleyenler (otopilotu bloke etmez)

1. 🔴 **R1** — GitHub repo → private (Settings → Danger Zone). Hâlâ doğrulanmadı; en büyük açık risk. **20 gün kaldı (Aug 1 freeze) — BUGÜN YAP.**
2. 🔴 **R2** — 6 token rotasyonu (Supabase service-role, Vercel, Resend, OpenRouter, Vertex, Upstash). **20 gün kaldı — freeze öncesi zorunlu.**
3. L1 danışma kurulu aday seçimi (7 koltuk; advisory-board sayfası + davet şablonu shipped — isimler founder onayına kadar boş).
4. Maliyet tavanı onayı ($50/$100/$500 default'ları geçerli).

## §8 Rapor Sözleşmesi

Her Executor raporu:

1. `origin/master` commit hash
2. Accept pass/fail tablosu + doğrulama yöntemi
3. Sapmalar/blocker'lar; öneriler `docs/PROPOSALS/` referansıyla
4. Son satır: `Verified-Against: origin/master HEAD = <hash>`
5. Push başarısızsa: "unpushed — retry pending" (sessiz başarı iddiası yasak)

## §9 Post-Launch Ufuk (tarihsiz, sıralı)

Detaylı, accept-kriterli backlog artık §5'te (item 10-23) — bu bölüm sadece üst-seviye özet. Executor iş için §5'i kullanır, bu listeyi değil.

1. ~~**K-Full** (K9-K12)~~ shipped `43436d9` (onaysız — §4 notu) · ~~**L2 MOU template**~~ shipped `4aca97f`
2. **L9 + L10** — methodology committee + peer-review pipeline (item 10-11) — K-Full verisi eldeyken en erken başlar
3. **K-Product + CRD + L8** — paid tier + role-based dashboards (item 15-16) — ilk gelir yüzeyi, en yüksek öncelik
4. **L4-L7** — dernek ortaklıkları, instructor tier, faculty fellowship, student ambassador (item 18-21) — L1/L2 isimleri kapı açtıkça sırayla
5. **N2/N3** — UK/US AISI diyaloğu, ISO/IEC + CEN-CENELEC standards katkısı (item 17, 22)
6. **Art. 73 anı (Dec 2 2027)** — tracker scaffold item 23'te başlar; canlı veri Aug 10 sonrası akış eder

7. **Trust/Ops/Governance katmanı** (item 24-40): G-series (yasal audit + KVKK + security.txt), K13-K16 (provider preview + methodology sayfa + weekly re-audit + score history), G4/G5 (data retention + redaction workflow), F1/F2 (fraud), O1-O4 (status page + Sentry alerting + cost telemetry + PITR drill), B1/B2 (CLAUDE.md + HANDOVER.md bus factor)

item 41+ için yeni iş: Architect §5'e ekler, bu özeti günceller. Executor Horizon'dan kendi başına iş türetmez.
