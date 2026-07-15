# ALPAR AI — MASTER PLAN v9.00 (Launch Readiness Sprint — 84 ✅ / 5 ⬜)

> **Bu dosya tek doğru operasyonel plandır.** `docs/ANTIGRAVITY_EXECUTION_PLAN.md` v7.16'da arşivlendi (tarihsel audit trail; talimat olarak okunmaz). Çelişkide bu dosya kazanır. Bu dosyayı yalnızca Architect düzenler (Rule #14/#25).

---

## §1 Kimlik & Misyon

ALPAR = **bağımsız kamu AI olay kaydı + bağımsız AI değerlendirici** ("Moody's-for-AI"). EU AI Act Art. 73 kamu olay-bildirim platformu; referee, vendor değil.

Üç bacak: **Veri** (incident registry) + **Yöntem** (K-BENCHMARK, TruthScore, cross-audit) + **İnsanlar** (advisory board, uzman ağı, akademik ortaklıklar).

Bottleneck sırası: **users (2026) → revenue (2027 H1) → regulatory moment (2027 H2)**. Her işin testi: bu sıradaki mevcut bottleneck'e hizmet ediyor mu?

**Dual-Executor Model:** Antigravity (Google Gemini — backend/DB/cron/security) + OpenCode (DeepSeek V4 Flash — frontend/UI/E2E/legal). İş bölümü `docs/PARALLEL_EXECUTION_ROSTER.md`'de kayıtlı. Her ikisi de §5 otopilot protokolüne tabidir.

## §2 İki Sabit Tarih

- **Aug 2 2026** — launch (kamu taahhüdü)
- **Dec 2 2027** — EU AI Act Art. 73 zorunlu bildirim başlar (yasal)

Başka takvim tarihi YOK (Rule #23). Tüm işler bağımlılık-tabanlı P0/P1/P2 sıralanır.

## §3 Standing Rules (28 — ihlal = otomatik review fail)

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
26. **DORA Elite++ hedefleri (ölçülür, ihlal = review fail):** deploy frequency ≥ günlük · lead time (commit → prod) ≤ 60 dk · MTTR ≤ 30 dk · change-failure-rate ≤ %10. Her PR'da `docs/OPS_DORA.md` güncellenmeli; regresyon → Architect bilgilendirilir. Progressive delivery: yeni feature'lar env-driven flag (`FEATURE_*`) arkasında ship edilir, doğrulama sonrası flag kaldırılır.
27. **Test piramidi zorunlu:** unit ≥ %70 line-coverage (vitest), integration ≥ %20 (DB-mocked), E2E ≥ %5 (Playwright critical paths). Her yeni `/api/v1/*` route için contract test. Business-logic modüllerinde (guardian, cross-audit-engine, model-router, cost-guard) mutation-testing skoru ≥ %60. CI: `pnpm test:unit` + `pnpm test:integration` + `pnpm test:e2e` + `pnpm test:mutation` + `semgrep` + `npm audit --production` sıfır hata.
28. **Observability zorunlu:** her yeni route/cron structured log (JSON, `correlationId`) + Sentry span + Plausible event üretir. SLI/SLO `docs/OPS_SLO.md`'de tanımlı: availability ≥ %99.9, p95 latency ≤ 300ms, error rate ≤ %0.5. Error budget < %0 → shipping donar (Rule #26 dahil), Architect'e alarm.

**Otopilot no-wait protokolü (Rule üstü):** Executor bir item'ı bitirir bitirmez rapor yazmadan sıradaki `⬜`'a geçer. Rapor yalnızca (a) 5 item batch'i tamamlandığında, (b) kuyruk boşaldığında, veya (c) blocker/founder-kapısı geldiğinde yazılır. Bekleme = review finding. Aynı dosyaya dokunan iki bağımsız item paralelde açılmaz; sıralı işlenir.

**Güvenlik sabitleri (kural üstü):** PII/ham kanıt `src/lib/pii/guardian.ts`'ten geçmeden DB/storage'a yazılmaz · RLS asla zayıflatılmaz · prod'a destructive DB op yok · `docs/EU_AI_ACT_TAXONOMY.md` dışında hukuki iddia yok.

## §4 Doğrulanmış Mevcut Durum

**Shipped (hash'lerle, doğrulanmış):**

| Seri                | İçerik                                                                                                                                                                                                                                     | Commit                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| V1+V2               | vercel.json cron'ları (daily — Hobby tavanı)                                                                                                                                                                                               | `f2107a5`, `a671fc1`                           |
| U1-U3               | HMAC unsubscribe API + template'ler                                                                                                                                                                                                        | `7f30125`                                      |
| M0-M3               | Mobile sprint (config, audit, overflow fix, CI lock)                                                                                                                                                                                       | `89a75ba`, `bb1fcca`, `de59706`, `aace3ba`     |
| C1a                 | api_keys sha256 hardening + auth path                                                                                                                                                                                                      | `20260715000000` + `20260720000001` migrations |
| H1+H2               | incident_source badge + copy                                                                                                                                                                                                               | `incident-card.tsx`                            |
| P1/P3/P4            | Countdown drafts, TR media pitches, LinkedIn/Reddit                                                                                                                                                                                        | `fa80867`, `4d47356`, `745b4fa`                |
| W-series            | RUNBOOK_LAUNCH_DAY v1.1 + dry run                                                                                                                                                                                                          | `cf4ecce`, `5bd8cd4`                           |
| X1-X5               | Crisis playbook'lar                                                                                                                                                                                                                        | `98936ab`                                      |
| Y1-Y3               | launch-signal dashboard + day-7/30 cron'lar                                                                                                                                                                                                | `fa80867`, `98936ab`                           |
| K2 (erken)          | retro-audit scheduler                                                                                                                                                                                                                      | shipped                                        |
| J3/state_support    | Devlet destekleri modülü                                                                                                                                                                                                                   | `76ddec4` (retro-approved)                     |
| Neutrality Charter  | `/neutrality` sayfası                                                                                                                                                                                                                      | `133af72` (retro-approved)                     |
| S1-S3               | Secrets scan, dep audit, security headers (HSTS doğrulandı)                                                                                                                                                                                | shipped                                        |
| v8.0 queue          | C1a-fix, H3, S4-drill, D-extra, C5-verify, K3/K4, I-series, C2, cost-alarm, L1 pipeline, N4 draft, J4a model-router, N1 OECD + cross-audit dashboard                                                                                       | `0e66a26`..`4fced12`                           |
| K-MVP+K-Full        | K5-K12 scaffold, `/ratings` page, `k_categories`/`k_model_scores` tables, L2 MOU template, outreach agent, expert network                                                                                                                  | `4aca97f`, `43436d9` ⚠️                        |
| SSRF-fix + types    | Evidence extraction domain allowlist + Supabase type updates                                                                                                                                                                               | `25b8acd`, `cc0b5dc`                           |
| v8.2–v8.4 Sprint    | W3-fix (cost-alarm cron) · Q1 gate log · S4-path drill · K-CORE verify · RLS hardening (`20260727000002_harden_rls_policies.sql`) · E1 user-zero + screenshots · S5 Lighthouse (home/incidents/submit) · Perf-baseline cwv · C3-SSRF audit | `34d06f6`..`c0470b0`                           |
| v8.5 Plan           | Pre-launch sprint items 1-9 ✅ — MASTER_PLAN güncelleme                                                                                                                                                                                    | `80861c4`                                      |
| v8.8 Dual-Exec      | A1-A3 ✅, items 27/29/31-35/37-38/46/58/63 ✅ (Antigravity+OpenCode parallel) — branch master'a merge edildi                                                                                                                               | `aca786d`..`6486020`                           |
| v8.9 Sprint         | Antigravity: E2(47)/E4(49) ✅. OpenCode: K14(28)/K16(30)/B1(39)/B2(40)/E3(48)/E5(50)/E6(51)/SL1(54)/SL4(57)/L11(61)/L12(62)/N5(67)/N6(68) ✅. R2 token rotasyon tamamlandı.                                                                | `0b912db`..`bc7d82e`                           |
| v8.10 Audit Sprint  | 16 item ✅ (ST1/CQ1/ZK1/DM1/RA1/E7/E8/SL2/SL3/G7/G8/K18-kod/F3/F4/DR1/DR2) — Antigravity+OpenCode kuyruğları boşaldı. 12 BF item açıldı (audit).                                                                                           | `c246214`..`9e09c1d`                           |
| v8.11 BF Sprint     | 12 BF item ✅ (BF1-BF12) — pnpm-lock ✅, middleware.ts ✅, Gemini fix ✅, i18n ✅, RSS retry ✅, fingerprint UUID ✅, DSAR select ✅, i18n CI ✅, cost-threshold env ✅. Vercel build kilidi kalktı.                                       | `52753f5`..`e492d7e`                           |
| v9.00 Launch Sprint | OG image API ✅, Pro tier pricing ✅, MRR/ARR widget ✅, Founding Reporter badge ✅, newsletter cron ✅, browser extension scaffold ✅, nav/SEO/i18n/academy fixes ✅. 14 commit retro-kabul (Rule #2 ihlalleri §4 notunda).               | `8e65a3f`..`054cbfe`                           |

**Architect v9.00 doğrulama taraması (2026-07-15):** İtem 1-82 tümü ✅ (36⏸O2, 64⏸K18-key). A1/A2/A3 ✅. BF1-BF12 ✅. v9.00 batch retro-kabul (14 commit). **TOPLAM: 84 ✅ / 5 ⬜ (83-87) + O2⏸.** HEAD `054cbfe`. P0: 83 (data sync) + 84 (impressum) launch-kritik.

**⚠️ Rule ihlalleri (`4aca97f`, `43436d9`) — kapatıldı:** Founder revert kararı vermedi → kabul edilmiş sayılır. Audit trail için ⚠️ notu korunur. Retro-approve kotası hâlâ DOLU.

**⚠️ Rule #14/#15 ihlal tespiti (2026-07-12) — kapatıldı:** Antigravity items 10-26 kodunu `origin/claude/strategy-brief-review-i93xcv` branch'ine push etti. Doğru branch: `master` (Rule #15). MASTER_PLAN.md'ye ✅ yazdı — bu Architect-only (Rule #14). Kod commits kanıtlanmış (`c740e81`..`88760d6`) → items 10-26 ✅ olarak işaretlendi. **Founder kararı tamamlandı:** Branch commits `7d9d0da` merge commit'i ile `origin/master`'a merge edildi. Items 10-26 artık master'da.

**⚠️ Rule #14 tekrar (2026-07-12) — kapatıldı:** Executor commit `7baf88b`'de MASTER_PLAN.md'yi düzenledi (F1/F2/O3/O4 ✅ işareti). Aynı pattern; founder yönetiminde kabul edilmiş.

**⚠️ Rule #2 ihlal tespiti (2026-07-12) — karar bekliyor:** `360_ANALIZ_VE_AKSIYON_PLANI.md` dosyası (repo root) commit `d9181dc` veya sonrasında executor tarafından oluşturuldu — kuyrukta olmayan bir plan/analiz dokümanı. Doğru konum: `docs/PROPOSALS/NNN-name.md`. Founder kararı: kalıcı mı arşivleniyor mu?

**⚠️ Rule #2 notu — `3196bed` "v9.0 security hardening" (2026-07-12) — founder kararı bekliyor:** Queue dışı security commit (Cross-Audit quorum, FingerprintJS, GDPR hard delete cron). Güvenlik-kritik içerik — revert edilmedi. BF9 (FingerprintJS) bu commitin tamamlanmamış kısmını kapatıyor.

**⚠️ Rule #2 ihlal tespiti (2026-07-13/15) — retro-kabul:** `0d41728`·`810d03f`·`1127d28`·`c376a55` ve `c94e97a`..`054cbfe` commit'leri kuyrukta olmayan iş içeriyor (OG image, Pro tier, revenue widget, browser extension, nav/SEO/i18n). Founder revert yapmadı → retro-kabul (emsal: state_support + Neutrality Charter). Retro-approve kotası DOLU.

**⚠️ DR1/DR2 çift tamamlama (2026-07-12) — bilgi:** `33f719e` (OpenCode) + `9e09c1d` (Antigravity) aynı item'ları paralelde tamamladı. HEAD `9e09c1d` (Antigravity versiyonu) canonical. Çakışma yok.

**Kayıtlı API Sağlayıcılar:** OpenRouter · Google (Vertex) · Hugging Face · Blackbox · Cohere · **NVIDIA NGC** (`integrate.api.nvidia.com` — env: `NVIDIA_NGC_API_KEY`, item A3)

**Traction baseline:** 4 organik rapor (Grok pasaport vakası dahil) + ~405 seed. UI'da bu ayrım daima görünür (Rule #19).

## §5 OTOPILOT İŞ KUYRUĞU

**Otopilot protokolü:**

1. Kuyruğun en üstündeki ⬜ item'ı al.
2. Uygula → Rule #10/#27 test gate → commit → push (branch `master` — Rule #15).
3. **Rapor yazmadan sıradaki ⬜'a geç.** Rapor yalnızca (a) 5 tamamlanmış item birikince, (b) kuyruk tamamen boşalınca, (c) blocker/founder-kapısı (⏸) çıkınca, (d) Rule #26 DORA regresyonu tetiklenince yazılır. Bekleme = review finding.
4. ⏸ item'a gelince atla, sıradaki bağımsız ⬜'a geç. Founder onayı bekleyen item Architect'in tekrar dokunması gerektirmez — kuyrukta kalır.
5. Kuyruk boşaldıysa: tüm repo'ya Rule #10/#27 gate + `docs/OPS_DORA.md` metrik snapshot al, bulguları `docs/PROPOSALS/` altına yaz. Kuyruk yeni item almadan yeniden çalışılmaz.
6. Plan-dışı fikir → `docs/PROPOSALS/NNN-name.md`, kod YOK (Rule #2 kotası dolu).
7. Aynı dosyalara dokunan iki onaysız item üst üste bindirilmez; ikinci item bekletilir, üçüncü bağımsız item alınır.
8. Progressive delivery (Rule #26): user-facing yeni davranış env-flag arkasında ship edilir; flag açma commit'i ayrı, doğrulama sonrası flag kaldırma commit'i ayrı.

### Executor Yetkinlik Matrisi

| Yetkinlik        | Antigravity (Gemini)                                                                              | OpenCode (DeepSeek V4 Flash)                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Güçlü alan       | Backend, DB migration, RLS, cron, AI routing, security scanning, API logic, complex cross-cutting | Frontend, React/Tailwind, UI pages, next-intl, Playwright E2E, legal copy, accessibility, docs |
| Bağlam penceresi | 1M+ token — büyük refaktöring, çok dosyalı değişiklikler                                          | Hızlı iterasyon — küçük-orta scope, tekrarlayan pattern'ler                                    |
| En iyi kullanım  | Güvenlik-kritik (guardian, SSRF, RLS), telemetri, karmaşık iş mantığı, API tasarımı, DB şema      | UI scaffold, sayfa oluşturma, i18n, test yazımı, dokümantasyon, yasal metin                    |
| Roster referansı | `docs/PARALLEL_EXECUTION_ROSTER.md` — Backend & Data Tier                                         | `docs/PARALLEL_EXECUTION_ROSTER.md` — Frontend & Presentation Tier                             |

**Kalan ⬜ item atamaları (roster'dan):**

**Antigravity (1 ⬜):** 85(cross-audit cache) — v9.00 sprint.

**OpenCode (4 ⬜):** 83(data sync) · 84(impressum) · 86(Stripe UI) · 87(extension) — v9.00 sprint.

**Paylaşımlı / Founder kapısı:** 36(O2 — ⏸ Sentry-panel) · 64(K18 — ⏸ regülatör-key)

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

### Acil — Freeze Öncesi (Aug 1)

| #   | P   | İş                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Accept kriteri                                                                                                                                 | Kapı         |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| A1  | P0  | **Kopya/hukuki fix** — `messages/en.json` + `messages/tr.json` hero copy'den "No login required. No account needed." kaldır; yerine "Submit anonymously — login optional, identity protected." `src/actions/incidents.ts` submit action'a email-hash capture ekle: anonim göndericiden opsiyonel email al, `sha256(email)` → `anonymous_email_hash` kolonuna yaz (display yok). Migration `anonymous_email_hash text` + `-- ROLLBACK:`. `docs/METHODOLOGY_AUDITS/a1-anon-legal.md` (hukuki gerekçe + DSA Madde 14 + 5651 referansı) | `grep "No login required" messages/en.json` = 0; migration ship; `a1-anon-legal.md` mevcut                                                     | ✅ `9b10758` |
| A2  | P0  | **Harici oto-yayın** — `src/app/api/cron/fetch-external/route.ts`: `source_domain IN trusted_allowlist` ise `status = 'published'` olarak insert et (mevcut `'pending'` yerine). `trusted_allowlist` (kod sabiti): `technologyreview.mit.edu`, `404media.co`, `lastweekinai.substack.com`, `theregister.com`. PII guardian check hâlâ çalışır. Mevcut 97 `pending` kaydı için tek seferlik `UPDATE` cron çalıştır. `docs/METHODOLOGY_AUDITS/a2-external-autopublish.md`                                                             | `SELECT count(*) FROM external_incidents_queue WHERE status = 'published'` ≥ 50; `a2-external-autopublish.md` mevcut; SSRF allowlist değişmedi | ✅ `aca786d` |
| A3  | P1  | **NVIDIA NGC adapter** — `src/lib/ai/adapters/nvidia-ngc.ts` oluştur (OpenAI-uyumlu, base URL `https://integrate.api.nvidia.com/v1`, env `NVIDIA_NGC_API_KEY`). SSRF allowlist'e `integrate.api.nvidia.com` ekle. Admin panel model listesine "NVIDIA NGC" sağlayıcısı ekle. `docs/HANDOVER.md`'ye env var + rotation linki ekle (`org.ngc.nvidia.com/account/api-keys`)                                                                                                                                                            | Adapter vitest; admin panel NVIDIA NGC gösteriyor; SSRF allowlist'te `integrate.api.nvidia.com` = 1 eşleşme                                    | ✅ `7a029ac` |

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
| 19  | P1  | **L5** — Instructor tier: `role = 'instructor'` + küratörlü olay paketi (20-30 olay + PDF export)                                                                                          | Migration (RLS+ROLLBACK) + `/academy/instructor` sayfası                                  | ✅                           |
| 20  | P1  | **L6** — Faculty fellowship sayfası + başvuru formu + admin review kuyruğu                                                                                                                 | `/academy/fellowship` sayfası + `fellowship_applications` tablo (RLS+ROLLBACK)            | ✅                           |
| 21  | P2  | **L7** — Student ambassador programı sayfası + `student_ambassadors` tablo + admin CRUD                                                                                                    | Sayfa + migration (RLS+ROLLBACK)                                                          | ✅                           |
| 22  | P2  | **N3** — ISO/IEC + CEN-CENELEC katkı taslağı: ALPAR taksonomisi working-draft formatında                                                                                                   | `docs/N3_STANDARDS_CONTRIBUTION.md`                                                       | ✅ taslak / ⏸ gönderim       |
| 23  | P2  | **Art.73 tracker scaffold** — `art73_obligation_status` tablosu (provider bazlı) + `/transparency/art-73-tracker` sayfası, veri boş, UI hazır                                              | Migration (RLS+ROLLBACK) + sayfa                                                          | ✅                           |

**Kural:** Bu kuyruk önceden onaylıdır (Rule #2 kapsamında plan-dışı değil) — Antigravity + OpenCode üstten alta işler, ⏸ item'a gelince atlar. Yeni istisna/genişleme yine Architect onayı gerektirir.

### Post-Launch Trust/Ops/Governance Katmanı (item 24-40)

**Amaç:** "Moody's-for-AI" iddiasının hukuki + operasyonel + fraud-defence altyapısını sıralı olarak inşa etmek. Item 10-23 ile paralel değil, ardıl. Bağımlılık: G1-G3 (yasal audit) K13-16'dan önce çalışır çünkü provider preview + methodology sayfa yasal metinlere referans verir.

| #   | P   | İş                                                                                                                                                                                                                         | Accept kriteri                                                                                                       | Kapı                            |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 24  | P0  | **G1 — Terms of Service gap audit** — `/legal/terms` (80L mevcut) EN+TR next-intl mü? İçerik: no-liability for incident scores, "Ready aligned" ifadesi (Rule #5), K-BENCHMARK score disclaimer                            | `docs/METHODOLOGY_AUDITS/g1-terms-audit.md` + gap fill commit                                                        | ✅                              |
| 25  | P0  | **G2 — Privacy Policy gap audit** — `/legal/privacy` (90L) KVKK + GDPR alignment; üçüncü taraf listesi tam (Supabase, Vercel, Resend, Sentry, Plausible, OpenRouter, Turnstile); DPO iletişim; veri saklama süreleri       | `docs/METHODOLOGY_AUDITS/g2-privacy-audit.md` + gap fill; KVKK bölümü eksikse ayrı `/legal/kvkk` sayfası (EN+TR)     | ✅                              |
| 26  | P0  | **G3 — Responsible Disclosure + security.txt** — RFC 9116 uyumlu `public/.well-known/security.txt` (contact, expires, preferred-languages, canonical); `/security` sayfası (126L mevcut) ile çapraz referans               | `curl https://alparai.com/.well-known/security.txt` → 200 + geçerli format; sayfada Contact/Expires alanları         | ✅                              |
| 27  | P0  | **K13 — Provider 60-day preview queue** — Model provider'ları K-BENCHMARK skor yayınlanmadan 60 gün önce email ile önizler. `k_provider_previews` migration (RLS+ROLLBACK) + cron; email şablonu (EN)                      | Migration + `/api/cron/k-provider-preview` route + vitest; kuyruğa test kaydı düşer, cron 60d önceki kayıtları çeker | ✅ (`77919b7`) kod / ⏸ gönderim |
| 28  | P0  | **K14 — Methodology public page** — `/methodology/k-benchmark` sayfası (EN+TR): kategoriler, Wilson score açıklaması, cross-audit pipeline diyagramı, veri kaynakları, "not verified compliance rating" disclaimer         | Sayfa canlı; `docs/K_BENCHMARK_METHODOLOGY.md` içerik referansı; footer'dan link                                     | ✅ (`3876335`)                  |
| 29  | P0  | **K15 — Haftalık K-BENCHMARK re-audit cron** — Retro-audit günlük çalışıyor; K-BENCHMARK için ayrı `weekly-rating-refresh` cron (Pazar 08:00 UTC). Yeni model çıkışlarını yakalar                                          | `vercel.json`'a kayıt; route + vitest; `k_model_scores.last_audited_at` güncellenir                                  | ✅ (`ef11925`)                  |
| 30  | P1  | **K16 — Model score history** — `k_model_scores_history` MAT view veya tablo (RLS+ROLLBACK); `/ratings/[modelSlug]/history` sayfası (dynamic segment eksik — önce onu ekle); zaman-serisi grafiği (LCP-friendly SSR chart) | Migration + sayfa; ≥1 model için tarih×skor grafiği canlı                                                            | ✅ (`83d1de5`)                  |
| 31  | P1  | **G4 — Data retention schedule** — `docs/DATA_RETENTION.md` (tablo bazlı: raw evidence 24 ay, audit_logs 5 yıl, PII 12 ay, deleted_users 30g grace); `data_retention_policies` reference tablo (RLS+ROLLBACK)              | Doc + migration; policy tablosunda ≥1 kayıt her `public.*` tablosu için                                              | ✅ (`6aa349c`)                  |
| 32  | P1  | **G5 — Provider name redaction workflow** — Named incident'ta provider isim redaction talebi geldiğinde admin queue. `redaction_requests` migration (RLS+ROLLBACK) + admin sayfa; `process-deletions` cron'a hook          | Migration + `/admin/redaction-queue` sayfa; test: talep → onay → provider adı asterisk'e döner                       | ✅ (`6aa349c`)                  |
| 33  | P1  | **F1 — Duplicate incident detection** — Submit path'te `pg_trgm` fuzzy match; skor >0.7 ise "possible duplicate" flag review queue'ya. Migration `CREATE EXTENSION pg_trgm` (RLS-safe) + submit action patch               | Migration + submit test: aynı başlık yakın varyantı flag üretir; false-positive %<5 (10 örnek)                       | ✅ (`5511305`)                  |
| 34  | P1  | **F2 — IP + device throttle** — Upstash rate limit'in üstüne submit için `submission_attempts` counter (24h/IP). >10 → admin review. `submission_attempts` migration (RLS+ROLLBACK)                                        | Migration + submit path patch + vitest                                                                               | ✅ (`5511305`)                  |
| 35  | P1  | **O1 — Public status page** — `/status` sayfası: Vercel deployment status + Supabase health + Upstash + son 90 gün uptime (statik veya Instatus embed). Self-hosted route, third-party embed CSP allow                     | Sayfa canlı; 4 servis kartı (yeşil/sarı/kırmızı); Rule #9 SSRF-safe                                                  | ✅ (`6d59ded`)                  |
| 36  | P1  | **O2 — Sentry alerting rules** — Kritik hata eşikleri: `error_rate >2%` 5dk → email; `cron.failed` → email. `docs/OPS_RUNBOOK.md` altında alerting matrix                                                                  | Sentry proje ayarları kanıtı screenshot; runbook doc                                                                 | ⬜ kod / ⏸ Sentry-panel         |
| 37  | P0  | **O3 — Cost telemetry migration** — Her cross-audit çalıştırma için `cross_audit_runs` (model, tokens_in, tokens_out, cost_usd, latency_ms) — RLS+ROLLBACK. Rule #20 alarm bu tablodan besleniyor                          | Migration + gateway/cross-audit-engine patch; ≥1 satır test ortamında; cost-alarm cron artık gerçek veri okur        | ✅ (`62091e7`)                  |
| 38  | P1  | **O4 — PITR restore test** — Supabase Point-in-Time Recovery: 10 dk önceki state'e scratch project'te restore, 1 sanity query; `docs/METHODOLOGY_AUDITS/o4-pitr-drill.log`                                                 | Log + RTO ölçümü                                                                                                     | ✅ (`a6ff2c5`)                  |
| 39  | P0  | **B1 — CLAUDE.md init** — Repo root'ta `CLAUDE.md`: mimari özet (stack, klasör yapısı), key file'lar (guardian, cross-audit-engine, openrouter-gateway), test/lint komutları, kritik Standing Rules özet                   | Dosya mevcut; yeni oturum açan model üzerinden test: "bu proje nedir?" doğru cevap                                   | ✅ (`3b5b54b`)                  |
| 40  | P0  | **B2 — Founder handover doc** — `docs/HANDOVER.md`: vendor accounts (Supabase, Vercel, Resend, OpenRouter, Vertex, Upstash, Cloudflare, Sentry, Plausible, Stripe stub), her biri için recovery path + rotation cadence    | Dosya mevcut; ≥10 vendor satırı; hiçbir plain-text secret yok (yalnızca "where to rotate" linkleri)                  | ✅ (`217e1b7`)                  |

**Bağımlılık grafiği (item 24-40):** G1/G2/G3 → K13/K14 (yasal metinlere ref) → K15/K16 (methodology şeffaflığı) · G4 → G5 → F1/F2 (retention policy fraud tanımını çerçeveler) · O3 → Rule #20 gerçek veri (öncelik yükseltilmiştir) · B1/B2 (bus factor) her aşamada güvenlik ağı.

**Ranking mantığı (Opus pass):** O3 ve K13 revenue+trust için P0'a çekildi — cost telemetry olmadan Rule #20 alarm sadece placeholder; provider preview olmadan K-BENCHMARK yayını yasal itiraza açık. G1-G3 ve B1/B2 bus-factor P0'ı: bir gecede tüm tıp değişirse platform hayatta kalmalı.

### İnovasyon Katmanı (item 41-45) — Qwen 360° Analizi + Founder Girdisi

| #   | P   | İş                                                                                                                                                                                                                                                                                             | Accept kriteri                                                                                         | Kapı           |
| --- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------- |
| 41  | P1  | **ST1 — Streisand Şeffaflık Raporu** — `transparency_reports` migration (RLS+ROLLBACK): talep tarihi, talep eden kategori (AI firm / PR firm / legal), alınan aksiyon. `/transparency/legal-threats` public sayfası. Gelen her C&D/DMCA → otomatik kayıt. İsim/detay founder onayına kadar boş | Migration + sayfa; test kayıt → sayfa görünür; `docs/METHODOLOGY_AUDITS/st1-design.md`                 | ✅ (`8e88c2b`) |
| 42  | P1  | **CQ1 — Topluluk Soru Bankası** — `challenge_submissions` + `challenge_votes` tabloları (RLS+ROLLBACK). `/challenges` sayfası: kullanıcı AI test senaryosu gönderir → cross-audit engine çalıştırır → skor yayınlanır. `reputation_score` = doğrulanan geçmiş katkılar × ağırlık               | Migration + 2 sayfa (liste + detay) + cross-audit entegrasyon; `docs/METHODOLOGY_AUDITS/cq1-design.md` | ✅ (`15ed21a`) |
| 43  | P2  | **ZK1 — Zero-Knowledge Gönderim** — Submit form'da opsiyonel client-side AES-256-GCM şifreleme (SubtleCrypto API). Hassas kanıt metni sunucuya şifreli gider; key yalnızca göndericide. `encrypted_evidence boolean` flag + `evidence_ciphertext text` kolon migration (RLS+ROLLBACK)          | Vitest (şifreleme/çözme round-trip); `docs/METHODOLOGY_AUDITS/zk1-design.md`                           | ✅ (`37b829e`) |
| 44  | P1  | **DM1 — Dinamik Model Routing v2** — `src/lib/audit/model-router.ts` genişlet: `severity_score < 0.4` → "basic" tier (NVIDIA NGC + Cohere); ≥ 0.4 → "deep" tier (mevcut 5-model debate). `cross_audit_runs` maliyet telemetrisi kaydeder (O3 önkoşul)                                          | Vitest (routing kararları); basic incident'larda ≥%30 cost savings; O3 tamamlanmış olmalı              | ✅ (`d04cf71`) |
| 45  | P2  | **RA1 — B2B AI Risk API v1** — `/api/v1/risk-score/{company_slug}` endpoint: Wilson-score + K-BENCHMARK + incident_count agregasyonu. OpenAPI şema (`public/api-spec/risk-score.yaml`) + `docs/API_RISK_SCORE.md`. Rate-limit: 100 req/gün anonim, API-key ile sınırsız (K-Product önkoşul)    | Endpoint vitest; OpenAPI şema dosyası; `docs/API_RISK_SCORE.md`; K-Product tamamlanmış olmalı          | ✅ (`922a256`) |

### DORA Elite++ Katmanı (item 46-57) — Testing / Reliability / Observability

**Amaç:** Rule #26/#27/#28 uygulaması. Deploy freq günlük, MTTR ≤ 30dk, change-failure-rate ≤ %10, error budget disiplini. Test piramidi + SLI/SLO + progressive delivery + otomatik rollback. Sıra: E-series (test) → SL-series (reliability/obs) → DR-series (disaster recovery). Bağımsız item'lar paralel değil, sıralı.

| #   | P   | İş                                                                                                                                                                                                             | Accept kriteri                                                                   | Kapı           |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------- |
| 46  | P0  | **E1 — E2E test suite expansion** — Playwright critical paths: submit-flow (anonim + auth), ratings görüntüleme, incident detay + share, admin queue triage. `test:e2e` ≥ 12 senaryo. CI'da gate.              | `pnpm test:e2e` yeşil; her senaryo `docs/METHODOLOGY_AUDITS/e1-e2e-report.md`'de | ✅ (`447996f`) |
| 47  | P0  | **E2 — Contract testler** — Her `/api/v1/*` route için Pact veya Zod-schema-based contract test. Response schema değişikliği CI'da kırar. Şemalar `src/contracts/*.ts` altında.                                | Tüm v1 route'lar kapsanmış; yeni route eklendiğinde CI contract yokluğunu kırar  | ✅ (`0b912db`) |
| 48  | P1  | **E3 — Load testing baseline** — k6 script (`ops/load/`) `/`, `/incidents`, `/ratings` için 100 rps 5dk sustained. p95 < 300ms hedefi. `docs/METHODOLOGY_AUDITS/e3-load-baseline.md`                           | Rapor mevcut; p95 < 300ms; regresyon eşiği doc'ta                                | ✅ (`930801f`) |
| 49  | P1  | **E4 — Mutation testing** — Stryker.js `src/lib/pii/guardian.ts`, `src/lib/ai/cross-audit-engine.ts`, `src/lib/audit/model-router.ts`, `src/lib/ai/cost-guard.ts` üzerinde. Skor ≥ %60.                        | Rapor `docs/METHODOLOGY_AUDITS/e4-mutation.md`; skor tabloda                     | ✅ (`0b912db`) |
| 50  | P1  | **E5 — Accessibility CI gate** — `@axe-core/playwright` entegrasyonu; kritik sayfalar WCAG 2.2 AA (0 kritik, 0 ciddi bulgu). CI'da gate.                                                                       | `docs/METHODOLOGY_AUDITS/e5-a11y.md`; violations = 0                             | ✅ (`930801f`) |
| 51  | P2  | **E6 — Visual regression** — Playwright screenshot diff, 8 anahtar sayfa. `test:visual` script. Baseline `ops/visual-baseline/`.                                                                               | Diff tolerance ≤ %0.1; CI gate                                                   | ✅ (`930801f`) |
| 52  | P0  | **E7 — Security scanning CI** — GitHub Actions: `semgrep --config auto` + `trivy fs .` + `npm audit --production --audit-level=high` + `gitleaks`. Kritik bulgu → CI kırar.                                    | `.github/workflows/security.yml` mevcut; 4 tool yeşil                            | ✅ (`37b829e`) |
| 53  | P1  | **E8 — SBOM + supply chain** — CycloneDX SBOM (`ops/sbom/latest.json`) + Sigstore (cosign) commit imzalama policy. `docs/OPS_SUPPLY_CHAIN.md`.                                                                 | SBOM üretim CI'da; her release imzalı                                            | ✅ (`37b829e`) |
| 54  | P0  | **SL1 — SLI/SLO tanımı + dashboard** — `docs/OPS_SLO.md`: availability, latency p50/p95/p99, error rate, cross-audit success rate. Plausible + Sentry query'leri. `/admin/slo-dashboard` sayfası.              | Doc + sayfa; her SLI için 30 günlük veri okuyor                                  | ✅ (`b68596e`) |
| 55  | P0  | **SL2 — Otomatik rollback wire** — Vercel deployment 5xx spike > %2 5dk → önceki deployment'a revert (`api/webhooks/sentry-alert` route). Runbook `docs/OPS_ROLLBACK.md`.                                      | Simüle test: fake 5xx spike → rollback tetiklendi kanıtı; runbook mevcut         | ✅ (`37b829e`) |
| 56  | P1  | **SL3 — Chaos day playbook** — Fault injection senaryoları: Supabase 500, Upstash timeout, Vertex 429, OpenRouter down. Her senaryo için beklenen graceful degradation. `docs/OPS_CHAOS.md` + quarterly drill. | 4 senaryo doc'ta; 1 drill logged                                                 | ✅ (`37b829e`) |
| 57  | P1  | **SL4 — Golden signals dashboard** — `/admin/signals`: latency, traffic (RPS), errors, saturation (DB conn, memory). Her 60s refresh. Sentry + Vercel Analytics data.                                          | Sayfa canlı; 4 kart görünür                                                      | ✅ (`b68596e`) |

### Governance / Regulator / Recovery (item 58-70)

| #   | P   | İş                                                                                                                                                                                                                      | Accept kriteri                                                            | Kapı                                 |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------ |
| 58  | P1  | **G6 — Cookie consent banner** — ePrivacy + KVKK uyumlu granular consent (necessary / analytics / marketing). Plausible cookie-free zaten, ancak kullanıcı seçimi kaydı. `cookie_consent_log` migration (RLS+ROLLBACK). | Banner canlı; consent kaydı; opt-out %100 çalışıyor                       | ✅ (`5dbff06`)                       |
| 59  | P0  | **G7 — DSAR automation** — GDPR Art. 15 + KVKK madde 11: kullanıcı verilerini machine-readable export. `/api/v1/dsar/export` (auth zorunlu) + admin queue. 30 gün SLA counter.                                          | Endpoint + admin sayfa + vitest; test export JSON valid                   | ✅ (`922a256`)                       |
| 60  | P1  | **G8 — Yaş kapısı (age gate)** — COPPA (US <13) + UK Online Safety Act (<18 için ek koruma). Submit path'te self-declaration checkbox + audit log.                                                                      | Checkbox + `age_declarations` migration; submit path patch                | ✅ (`184db3b`)                       |
| 61  | P1  | **L11 — Advisory rotation cadence** — 2 yıl term limit, %50 rotasyon her yıl. `advisory_board_terms` migration; `docs/L11_ROTATION_POLICY.md`.                                                                          | Migration + doc                                                           | ✅ (`db7e5bd`)                       |
| 62  | P1  | **L12 — Peer-review journal** — `/methodology/corrections` public sayfa: metodoloji güncellemeleri, retraction'lar, versiyon geçmişi. `methodology_versions` migration.                                                 | Sayfa + migration; test kayıt görünür                                     | ✅ (`db7e5bd`)                       |
| 63  | P1  | **K17 — Model retirement policy** — Cron: OpenRouter/NVIDIA/HF listesinde 60 gün deprecated model → `k_model_scores.status = 'retired'` + UI etiketi.                                                                   | Cron + vitest; retired badge UI'da                                        | ✅ (`22ce2c2`)                       |
| 64  | P1  | **K18 — External auditor API** — Read-only `auditor_role` (Supabase role), `/api/v1/auditor/*` endpoint'ler (K-BENCHMARK raw + methodology + audit_logs). API key gate.                                                 | Migration + endpoint + doc `docs/API_AUDITOR.md`; regülatör-uyumlu erişim | ✅ (`98c160c`) kod / ⏸ regülatör-key |
| 65  | P1  | **F3 — Sybil detection** — Submit path'te FingerprintJS + graph analysis (aynı fingerprint N gönderim → review queue). `submission_fingerprints` migration.                                                             | Migration + vitest; false-positive < %5 (10 örnek)                        | ✅ (`922a256`)                       |
| 66  | P1  | **F4 — Moderation SLA** — Review queue: p95 triage < 4h. Cron alarm eşik aşımında. `moderation_sla` view.                                                                                                               | Alarm çalışıyor; dashboard'da SLA metrik                                  | ✅ (`922a256`)                       |
| 67  | P2  | **N5 — TR AISI dialogue channel** — Sanayi Bakanlığı + TÜBİTAK ile iletişim taslağı; `docs/N5_TR_AISI_DRAFT.md`.                                                                                                        | Doc mevcut                                                                | ✅ (`5c3e586`)                       |
| 68  | P2  | **N6 — KVKK Kurulu engagement** — Kurul'la resmi iletişim taslağı + veri işleme envanteri (VERBIS).                                                                                                                     | `docs/N6_KVKK_ENGAGEMENT.md` + VERBIS envanter taslağı                    | ✅ (`5c3e586`)                       |
| 69  | P0  | **DR1 — Multi-region DR drill** — Vercel fra1 → iad1 failover senaryosu; Supabase read-replica; RTO ≤ 15dk, RPO ≤ 5dk. Log `docs/METHODOLOGY_AUDITS/dr1-drill.log`.                                                     | Drill log; RTO/RPO ölçüm                                                  | ✅ (`9e09c1d`)                       |
| 70  | P1  | **DR2 — Data portability** — GDPR Art. 20: kullanıcının tüm verisini `.zip` (JSON + evidence PDF'ler) olarak `/api/v1/dsar/portable` üzerinden indir. G7'nin genişlemesi.                                               | Endpoint + vitest + test download                                         | ✅ (`9e09c1d`)                       |

### Bug Fix Sprint (item 71-82) — Antigravity 360° Denetim Bulguları

**Amaç:** 2026-07-12 denetim raporundan tespit edilen production hataları. P0: deployment kilit. P1: aktif error group'ları. P2: güvenlik + kalite. Sıra: P0 → P1 → P2 (paralel değil).

#### P0 — Deployment Blocker

| #   | P   | İş                                                                                                                                                                                                                            | Accept kriteri                                                                                     | Kapı           |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------- |
| 71  | P0  | **BF1 — pnpm-lock.yaml + jszip sync** — `pnpm install` → lockfile güncelle → commit. VEYA `jszip`'i `package.json`'dan kaldır, `src/lib/utils/zip.ts` özel impl koru. Founder kararı: replace (daha sağlam) vs kaldır (acil). | `pnpm install --frozen-lockfile` başarılı; Vercel build yeşil                                      | ✅ (`52753f5`) |
| 72  | P0  | **BF2 — `src/middleware.ts` oluştur** — next-intl `createMiddleware` + Supabase SSR `updateSession` birleşik. Locale redirect, session refresh, `/admin/**` auth guard, rate-limit poke.                                      | `pnpm typecheck` ✓; anonim `/` → `/{locale}/`; `/admin` unauth → `/login`; i18n locale detection ✓ | ✅ (`b7719ad`) |

#### P1 — Production Error Elimination

| #   | P   | İş                                                                                                                                                                                                                                                                                               | Accept kriteri                                             | Kapı           |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | -------------- |
| 73  | P1  | **BF3 — Footer i18n missing keys** — `messages/en.json` + `messages/tr.json`: `footer.links.methodology` + `footer.links.challenges` ekle.                                                                                                                                                       | MISSING_MESSAGE hata sayısı 0; footer EN+TR hatasız render | ✅ (`e1516e8`) |
| 74  | P1  | **BF4 — Admin panel TR translation** — Eksik key'ler: `admin.activity_target_entity`, `admin.delete`, `admin.recent_activities`, `admin.tabQueue`, `admin.finance_alert_limit`, `admin.total_score`, `admin.nvidia_desc`, `admin.google_vertex_desc`, `admin.blackbox_desc`, `admin.save` (10+). | Admin panel TR'de runtime MISSING_MESSAGE 0                | ✅ (`e1516e8`) |
| 75  | P1  | **BF5 — Gemini API 400 fix** — 78 hata / 8 kullanıcı. `GOOGLE_API_KEY` / `GEMINI_API_KEY` env doğrula; model endpoint değişikliği kontrol. Key rotation gerekiyorsa `docs/PROPOSALS/` ile founder bilgilendirme.                                                                                 | Hata count 0; key rotated veya endpoint fixed              | ✅ (`e1516e8`) |
| 76  | P1  | **BF6 — RSS feed retry mekanizması** — `src/app/api/cron/fetch-external/route.ts`: exponential backoff (2s/4s/8s, max 3 retry). Vercel function timeout < 60s toplam.                                                                                                                            | Timeout'ta retry; vitest mock ile doğrulanmış              | ✅ (`e1516e8`) |

#### P2 — Code Quality / Security

| #   | P   | İş                                                                                                                                                                    | Accept kriteri                                       | Kapı            |
| --- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------- |
| 77  | P2  | **BF7 — `vercel.json` pnpm uyum** — `buildCommand: "npm run build"` → `pnpm build`; `installCommand: "npm install"` → `pnpm install --frozen-lockfile` (veya kaldır). | Vercel log'da `pnpm` kullanıyor; `npm` kalmamış      | ✅ (pre-sprint) |
| 78  | P2  | **BF8 — `moderation-sla-alarm` cron vercel.json** — `vercel.json` crons bölümüne `/api/cron/moderation-sla-alarm` ekle (günlük veya saatlik).                         | Vercel cron dashboard'da görünüyor; test trigger ✓   | ✅ (`e492d7e`)  |
| 79  | P2  | **BF9 — FingerprintJS fallback → `crypto.randomUUID()`** — `src/lib/utils/fingerprint.ts`: `Math.random().toString(36)...` → `crypto.randomUUID()`.                   | vitest mock; fallback her çağrıda UUID formatında    | ✅ (`e1516e8`)  |
| 80  | P2  | **BF10 — DSAR explicit column select** — `src/app/api/v1/dsar/portable/route.ts`: `select("*")` → `select("id,email,created_at,...")`.                                | vitest: internal flag field export'ta görünmüyor     | ✅ (`e1516e8`)  |
| 81  | P2  | **BF11 — i18n delta CI check** — `.github/workflows/ci.yml`'e veya `i18n-check.yml`'e EN+TR key simetri kontrolü; eksik TR key → CI fail.                             | Eksik key CI'ı kırıyor; `pnpm run i18n:check` mevcut | ✅ (`e1516e8`)  |
| 82  | P2  | **BF12 — Cost threshold'ları env'e taşı** — `src/app/api/cron/cost-alarm/route.ts`: `const dailyWarningThreshold = 50` → `process.env.COST_WARNING_DAILY ?? 50`.      | Env var set edilince threshold değişiyor; vitest ✓   | ✅ (`e1516e8`)  |

### Launch Blocker Sprint (item 83-87) — KİMİAİ 360° Canlı Analiz Bulguları (2026-07-13)

**Amaç:** Lansmanı engelleyecek kritik hata + yasal risk. Önce 83 (P0), ardından 84 (P0), paralel değil.

#### P0 — Launch Blocker

| #   | P   | İş                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Accept kriteri                                                                              | Kapı |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ---- |
| 83  | P0  | **UI/API data sync fix** — `/incidents` sayfası "0 Documented AI failures" gösteriyor; API `142` döndürüyor. `src/app/[locale]/incidents/page.tsx` (veya ilgili component): veriyi `/api/v1/incidents` endpoint'inden doğru çekiyor mu doğrula; `/leaderboard` sayfasını aynı şekilde denetle.                                                                                                                                                                                                               | `/incidents` ve `/leaderboard` sayfaları gerçek sayıyı (≥60) gösteriyor; `pnpm typecheck` ✓ | ⬜   |
| 84  | P0  | **Legal: Impressum + GDPR "permanent record" fix** — Hukuki risk: (a) Şirket jurisdiction bilgisi eksik; (b) "permanent record" dili GDPR Art. 17 ile çelişiyor. `/legal/impressum` (EN+TR) sayfası oluştur: şirket adı, adres, jurisdiction, iletişim. `messages/{en,tr}.json` → `legal.impressum.*` namespace. Terms/Privacy'den "permanent record" ifadesini GDPR-uyumlu dile çevir ("AI system records are preserved for public accountability; personal data is subject to GDPR/KVKK deletion rights"). | `/legal/impressum` 200; Terms/Privacy'de "permanent record" 0 eşleşme; `pnpm typecheck` ✓   | ⬜   |

#### P1 — Post-Launch Readiness

| #   | P   | İş                                                                                                                                                                                                                                                                                                                                                           | Accept kriteri                                                                                          | Kapı |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ---- |
| 85  | P1  | **Cross-audit Redis caching** — Her cross-audit çağrısı 5 LLM API isteği atıyor; aynı prompt tekrar edilince maliyeti ikiye katlıyor. `src/lib/ai/cross-audit-engine.ts`: SHA-256(prompt) → Upstash Redis key; TTL 1 saat; cache miss → 5 model çağrısı; hit → Redis'ten dön. `cross_audit_runs`'a `cache_hit boolean` kolon ekle (migration, RLS+ROLLBACK). | Vitest: aynı prompt ikinci çağrıda Redis'ten döner; `cost_usd` ikinci çağrıda 0; migration ship         | ⬜   |
| 86  | P1  | **Stripe/Pro tier ödeme akışı** — `c376a55`'te Pro tier pricing scaffolded ama checkout yok. `@stripe/stripe-js` + `stripe` package entegrasyonu; `/api/webhooks/stripe` route (RLS-safe); `subscriptions` migration (RLS+ROLLBACK); pricing page "Upgrade" → Stripe Checkout. Test: Stripe test-mode checkout → webhook → `subscriptions` tablosuna kayıt.  | Stripe test-mode checkout başarılı; webhook `200`; `subscriptions` tablosunda kayıt; `pnpm typecheck` ✓ | ⬜   |
| 87  | P2  | **Browser extension MVP** — `apps/extension/` scaffolded ama MV3 manifest + content script eksik. Chrome MV3 manifest; content script: ziyaret edilen URL'yi `/api/v1/incidents?domain=` ile sorgula; bulgu varsa badge + popup.                                                                                                                             | Extension yüklenebilir; `chrome.tabs` domain sorgusu çalışıyor; popup incident count gösteriyor         | ⬜   |

**DORA metrikleri şu an (v8.8 baseline):**

- Deploy frequency: günlük (dual-executor paralel çalışma — 20+ commit/gün) ✅
- Lead time: ölçülmüyor — item 54 (SL1) sonrası ölçülür
- MTTR: ölçülmüyor — item 55 (SL2) sonrası otomatik
- Change failure rate: ölçülmüyor — item 54 sonrası

## §6 Launch Freeze

**Aug 1–9:** yalnızca D/W-series işleri + hotfix. Otopilot bu pencerede kuyruğu bırakır, `docs/RUNBOOK_LAUNCH_DAY.md`'yi izler. Aug 10'da §5'teki Post-Launch Kuyruğu (item 10+) otomatik devreye girer — Architect'ten yeni onay beklenmez.

## §7 Founder Bekleyenler (otopilotu bloke etmez)

1. 🔴 **R1** — GitHub repo → private (Settings → Danger Zone). Hâlâ doğrulanmadı.
2. ✅ **R2** — 6 token rotasyonu tamamlandı (Supabase service-role, Vercel, Resend, OpenRouter, Vertex, Upstash). Antigravity `d9181dc` öncesi tamamladı.
3. ✅ **R3** — NVIDIA NGC API key env'e eklendi (A3 `7a029ac` tamamlandı).
4. L1 danışma kurulu aday seçimi (7 koltuk; advisory-board sayfası + davet şablonu shipped — isimler founder onayına kadar boş).
5. Maliyet tavanı onayı ($50/$100/$500 default'ları geçerli).
6. ✅ **BF1 çözüldü** — `jszip` `package.json`'dan kaldırıldı (`52753f5`); `pnpm install --frozen-lockfile` geçiyor; Vercel build kilidi kalktı.
7. ✅ **Gemini API fix (BF5)** — `src/lib/ai/adapters/vertex-gemini.ts` düzeltildi (`e1516e8`). Hata count 0 bekleniyor.
8. ⏸ **K18 regülatör-key** — Supabase `auditor_role` API key için regülatör ilişkisi kurulana kadar beklemede.
9. **GPG commit signing** — Mevcut commit'ler unverified. Etkinleştirme founder kararı.
10. 🔴 **UI data sync (item 83)** — `/incidents` + `/leaderboard` sayfaları prod'da boş görünüyor ama API 142 kayıt döndürüyor. OpenCode kuyruğuna atandı; lansmanı engelleyebilir.

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

8. **İnovasyon katmanı** (item 41-45): ST1 (Streisand şeffaflık raporlama), CQ1 (topluluk soru bankası + itibar ağırlıklı oylama), ZK1 (zero-knowledge gönderim), DM1 (dinamik routing v2 — NVIDIA NGC dahil), RA1 (B2B AI Risk API v1)

9. **DORA Elite++ katmanı** (item 46-57): E1-E8 (E2E + contract + load + mutation + a11y + visual + security + SBOM), SL1-SL4 (SLI/SLO + otomatik rollback + chaos + golden signals) — Rule #26/#27/#28'in kod karşılığı

10. **Governance / Regulator / Recovery** (item 58-70): G6-G8 (cookie/DSAR/age gate), L11-L12 (advisory rotation + peer-review journal), K17-K18 (model retirement + auditor API), F3-F4 (Sybil + moderation SLA), N5-N6 (TR AISI + KVKK Kurulu), DR1-DR2 (multi-region failover + data portability)

11. **Dual-Executor capability routing** aktif: Antigravity (backend/security/API) + OpenCode (frontend/UI/E2E). Roster: `docs/PARALLEL_EXECUTION_ROSTER.md`. Atama matrisi §5'te.

12. ✅ **Audit-driven stability sprint** (BF1-BF12): 2026-07-13 tamamlandı. pnpm lock ✅, middleware.ts ✅, Gemini fix ✅, i18n ✅, RSS retry ✅, fingerprint UUID ✅, DSAR select ✅, i18n CI ✅, cost-threshold env ✅. HEAD `e492d7e`.

13. **Launch Readiness Sprint** (item 83-87): KİMİAİ 360° canlı analiz (2026-07-13) tespit etti. P0: data sync (83) + impressum (84). P1: cross-audit cache (85) + Stripe (86). P2: browser extension (87).

item 88+ için yeni iş: Architect §5'e ekler, bu özeti günceller. Executor Horizon'dan kendi başına iş türetmez.

## §10 Executor Tetikleme Prompt'ları (copy-paste)

> Bu prompt'lar ilgili executor agent'a yapıştırılarak kullanılır. Yeni bir oturum açıldığında prompt aynen kopyalanır. Prompt içindeki item listesi Architect tarafından güncellenir — executor kendi prompt'unu düzenlemez.

### Antigravity Tetikleme Prompt'u

```
SEN: ALPAR AI projesinin Antigravity (Backend & Data Tier) executor agent'ısın.

PROJE: ALPAR AI — bağımsız kamu AI olay kaydı + AI değerlendirici ("Moody's-for-AI"). EU AI Act Art. 73 platformu. Stack: Next.js 16 (App Router), Supabase (Postgres/RLS/Storage), TypeScript strict, Vercel (fra1).

GÖREV: docs/MASTER_PLAN.md v9.00 §5 kuyruğundaki sana atanmış ⬜ item'ları otopilot protokolüyle uygula.

ATANMIŞ İTEM'LAR: v9.00 sprint — sana atanan 2 ⬜ item:
85(P1 cross-audit Redis cache) — `src/lib/ai/cross-audit-engine.ts`: SHA-256(prompt) → Upstash Redis key TTL 1h; cache miss → 5 model çağrısı; hit → Redis'ten dön. `cross_audit_runs` migration: `cache_hit boolean` (RLS+ROLLBACK).
86-backend(P1 Stripe backend) — `@stripe/stripe-js` + `stripe` package; `/api/webhooks/stripe` route (RLS-safe); `subscriptions` migration (RLS+ROLLBACK). OpenCode 86 UI'ını koordineli yapar.
83/84/87 OpenCode'a atanmış — paralel çalışabilirsiniz.

KRİTİK KURALLAR:
1. Push before report. Rapor origin/master commit hash'i ile biter.
2. Plan-dışı commit YASAK. Fikir → docs/PROPOSALS/NNN-name.md + DUR.
3. Her yeni tablo aynı migration'da RLS + -- ROLLBACK: bloğu ile gelir.
4. Tüm dış fetch SSRF-safe: host allowlist, private-IP redirect yok.
5. PII/ham kanıt src/lib/pii/guardian.ts'ten geçmeden DB/storage'a yazılmaz.
6. Test gate: pnpm typecheck + vitest + eslint 0 warning; dokunulan akışlara Playwright.
7. DORA hedefleri: deploy freq ≥ günlük, lead time ≤ 60dk, test piramidi (unit ≥%70, integration ≥%20, E2E ≥%5).
8. Progressive delivery: yeni feature env-flag arkasında ship edilir.
9. MASTER_PLAN.md'yi düzenleme YASAK — bu Architect-only (Rule #14).
10. sha256 + crypto.timingSafeEqual — plaintext karşılaştırma review fail.

OTOPİLOT PROTOKOLÜ:
- Item bitir → rapor yazmadan sıradaki ⬜'a geç.
- Rapor yalnızca: (a) 5 item batch tamamlandığında, (b) kuyruk boşaldığında, (c) blocker geldiğinde.
- ⏸ item'a gelince atla, sıradaki bağımsız ⬜'a geç.
- Aynı dosyalara dokunan iki item sıralı işlenir.

RAPOR FORMAT:
## Antigravity Batch Raporu [tarih]
| Item | Durum | Commit | Accept doğrulama |
Sapmalar/blocker'lar: ...
Verified-Against: origin/master HEAD = <hash>

BRANCH: master (Rule #15). Feature branch YOK.
```

### OpenCode Tetikleme Prompt'u

```
SEN: ALPAR AI projesinin OpenCode (Frontend & Presentation Tier) executor agent'ısın. Model: DeepSeek V4 Flash.

PROJE: ALPAR AI — bağımsız kamu AI olay kaydı + AI değerlendirici ("Moody's-for-AI"). EU AI Act Art. 73 platformu. Stack: Next.js 16 (App Router), Supabase, Tailwind v4, TypeScript strict, next-intl (EN+TR), Vercel (fra1).

GÖREV: docs/MASTER_PLAN.md v9.00 §5 kuyruğundaki sana atanmış ⬜ item'ları otopilot protokolüyle uygula.

ATANMIŞ İTEM'LAR: v9.00 sprint — sana atanan 4 ⬜ item:
83(P0 UI/API data sync) — `/incidents` + `/leaderboard` sayfalarını doğrula; "0 Documented AI failures" yerine gerçek sayıyı göster.
84(P0 Impressum + GDPR fix) — `/legal/impressum` (EN+TR) oluştur; Terms/Privacy "permanent record" dilini GDPR-uyumlu hale getir.
86(P1 Stripe UI) — pricing page "Upgrade" butonu → Stripe Checkout (Antigravity backend'i yazıyor, sen UI + checkout callback).
87(P2 browser extension) — `apps/extension/` MV3 manifest + content script tamamla; Chrome extension pack edilebilir hale getir.
Önce 83, ardından 84 (paralel değil, P0'lar); 86+87 Antigravity 86-backend hazır olunca.

KRİTİK KURALLAR:
1. Push before report. Rapor origin/master commit hash'i ile biter.
2. Plan-dışı commit YASAK. Fikir → docs/PROPOSALS/NNN-name.md + DUR.
3. Her user-facing string: next-intl, EN+TR birlikte.
4. Her yeni tablo aynı migration'da RLS + -- ROLLBACK: bloğu ile gelir.
5. Brand: dark slate #0A1622 + emerald #00FF88. Founder onayı olmadan değişmez.
6. Wording: "AI Act Ready/aligned", asla "compliant".
7. Test gate: pnpm typecheck + vitest + eslint 0 warning; dokunulan akışlara Playwright.
8. DORA hedefleri: deploy freq ≥ günlük, test piramidi (unit ≥%70, E2E ≥%5).
9. MASTER_PLAN.md'yi düzenleme YASAK — bu Architect-only (Rule #14).
10. Numeric-claim honesty: UI'daki her sayı DB'den canlı + source-split.

OTOPİLOT PROTOKOLÜ:
- Item bitir → rapor yazmadan sıradaki ⬜'a geç.
- Rapor yalnızca: (a) 5 item batch tamamlandığında, (b) kuyruk boşaldığında, (c) blocker geldiğinde.
- ⏸ item'a gelince atla, sıradaki bağımsız ⬜'a geç.
- Aynı dosyalara dokunan iki item sıralı işlenir.

RAPOR FORMAT:
## OpenCode Batch Raporu [tarih]
| Item | Durum | Commit | Accept doğrulama |
Sapmalar/blocker'lar: ...
Verified-Against: origin/master HEAD = <hash>

BRANCH: master (Rule #15). Feature branch YOK.
```
