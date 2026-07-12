# ALPAR AI — MASTER PLAN v8.3 (Antigravity Otopilot Sürümü — Uzun Kuyruk)

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

| Seri               | İçerik                                                                                                                                               | Commit                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| V1+V2              | vercel.json cron'ları (daily — Hobby tavanı)                                                                                                         | `f2107a5`, `a671fc1`                           |
| U1-U3              | HMAC unsubscribe API + template'ler                                                                                                                  | `7f30125`                                      |
| M0-M3              | Mobile sprint (config, audit, overflow fix, CI lock)                                                                                                 | `89a75ba`, `bb1fcca`, `de59706`, `aace3ba`     |
| C1a                | api_keys sha256 hardening + auth path                                                                                                                | `20260715000000` + `20260720000001` migrations |
| H1+H2              | incident_source badge + copy                                                                                                                         | `incident-card.tsx`                            |
| P1/P3/P4           | Countdown drafts, TR media pitches, LinkedIn/Reddit                                                                                                  | `fa80867`, `4d47356`, `745b4fa`                |
| W-series           | RUNBOOK_LAUNCH_DAY v1.1 + dry run                                                                                                                    | `cf4ecce`, `5bd8cd4`                           |
| X1-X5              | Crisis playbook'lar                                                                                                                                  | `98936ab`                                      |
| Y1-Y3              | launch-signal dashboard + day-7/30 cron'lar                                                                                                          | `fa80867`, `98936ab`                           |
| K2 (erken)         | retro-audit scheduler                                                                                                                                | shipped                                        |
| J3/state_support   | Devlet destekleri modülü                                                                                                                             | `76ddec4` (retro-approved)                     |
| Neutrality Charter | `/neutrality` sayfası                                                                                                                                | `133af72` (retro-approved)                     |
| S1-S3              | Secrets scan, dep audit, security headers (HSTS doğrulandı)                                                                                          | shipped                                        |
| v8.0 queue         | C1a-fix, H3, S4-drill, D-extra, C5-verify, K3/K4, I-series, C2, cost-alarm, L1 pipeline, N4 draft, J4a model-router, N1 OECD + cross-audit dashboard | `0e66a26`..`4fced12`                           |
| K-MVP+K-Full       | K5-K12 scaffold, `/ratings` page, `k_categories`/`k_model_scores` tables, L2 MOU template, outreach agent, expert network                            | `4aca97f`, `43436d9` ⚠️                        |
| SSRF-fix + types   | Evidence extraction domain allowlist + Supabase type updates                                                                                         | `25b8acd`, `cc0b5dc`                           |

**Architect v8.2 doğrulama taraması:** Kod durumu ✅ · `cost-alarm` cron vercel.json'da yok ❌ (Rule #20 prod'da asla tetiklenmez) · `docs/METHODOLOGY_AUDITS/` dizini yok ❌ · Q1/K-CORE/RLS/E1 kanıtı yok ⚠️.

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

| #   | P   | İş                                                                                                                                                   | Accept kriteri                                                                               | Kapı |
| --- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---- |
| 1   | P0  | **W3-fix** — `vercel.json`'a `cost-alarm` cron kaydı ekle: `"path": "/api/cron/cost-alarm", "schedule": "0 6 * * *"`                                 | `grep cost-alarm vercel.json` = 1 eşleşme; toplam cron path sayısı = 9                       | ⬜   |
| 2   | P0  | **Q1** — `pnpm typecheck && pnpm test && pnpm lint` sıfır hata/uyarı. Hata varsa fix commit                                                          | 3 komutun çıktısı raporda (tümü pass); `docs/METHODOLOGY_AUDITS/quality-gate-2026-07-12.log` | ⬜   |
| 3   | P0  | **S4-path** — `mkdir -p docs/METHODOLOGY_AUDITS && git mv docs/security/S4-restore-drill.md docs/METHODOLOGY_AUDITS/S4-restore-drill-2026-07-12.log` | `ls docs/METHODOLOGY_AUDITS/S4-*` = 1                                                        | ⬜   |

### P1 — Pre-Launch Hardening (Aug 1 öncesi)

| #   | P   | İş                                                                                                                 | Accept kriteri                                                               | Kapı |
| --- | --- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---- |
| 4   | P1  | **K-CORE verify** — Retro-audit cron en az 1 incident'ı `cross_audit_results`'a işliyor. Kanıt: `count(*)` çıktısı | `docs/METHODOLOGY_AUDITS/k-core-verify.md`                                   | ⬜   |
| 5   | P1  | **RLS-audit** — Tüm tablolarda RLS etkin. Anon client → admin tablo → 0 satır                                      | `docs/METHODOLOGY_AUDITS/rls-audit.md`; eksik RLS → migration + ROLLBACK     | ⬜   |
| 6   | P1  | **E1 user-zero** — Anonim: anasayfa → incidents → submit → OG embed. Her adım screenshot                           | `docs/METHODOLOGY_AUDITS/user-zero-walkthrough.md` + ekranlar                | ⬜   |
| 7   | P1  | **S5-redo** — Lighthouse mobile (home/incidents/submit); 3 JSON raporu                                             | Her sayfa ≥85 veya <85 için fix; `docs/METHODOLOGY_AUDITS/lighthouse-*.json` | ⬜   |

### P2 — Polish (Aug 1 öncesi, blocker değil)

| #   | P   | İş                                                                                                                | Accept kriteri                            | Kapı |
| --- | --- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---- |
| 8   | P2  | **Perf-baseline** — LCP/FID/CLS ölçümü 3 ana sayfa                                                                | `docs/METHODOLOGY_AUDITS/cwv-baseline.md` | ⬜   |
| 9   | P2  | **C3-complete** — `openrouter-gateway`, OECD feed, import-incidents, fetch-external için SSRF allowlist doğrulama | `docs/METHODOLOGY_AUDITS/ssrf-audit.md`   | ⬜   |

### Launch Freeze (Aug 1–9) — bu pencerede otopilot durur, `docs/RUNBOOK_LAUNCH_DAY.md` izlenir

### Post-Launch Kuyruğu (Aug 10 sonrası aktif — önceden onaylı, tekrar Architect izni gerekmez)

Bağımlılık sırası korunur: L1 isimleri → L3/L4 kapı açar; L2 MOU → L5/L6/L7 kapı açar; K-Full veri → L9/L10 tetiklenir; revenue path (K-Product+L8) her zaman en yüksek öncelik.

| #   | P   | İş                                                                                                                                                                                         | Accept kriteri                                                                            | Kapı                   |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------- |
| 10  | P0  | **L9** — Methodology Advisory Committee sayfası (`/about/methodology-committee`, EN+TR) + `methodology_committee_members` migration (RLS+ROLLBACK) + davet şablonu. L1 üyeleriyle çakışmaz | Sayfa canlı, isimler boş; Rule #21 benzeri — yazılı onay olmadan isim yayınlanmaz         | ⬜ kod / ⏸ isimler     |
| 11  | P0  | **L10** — Peer-review pipeline taslağı: `docs/PAPERS/faact-draft.md` (ACM FAccT hedefi) — K-BENCHMARK metodolojisini özetleyen veri tablosu + taslak metin                                 | Taslak dosya + K-BENCHMARK sample-size/Wilson-score tablosu gömülü                        | ⬜ taslak / ⏸ gönderim |
| 12  | P0  | **L3-verify** — `expert_network` tablosu + `/experts` rep leaderboard uçtan uca çalışıyor mu? ≥1 test-uzman doğrulama akışı simüle edilir                                                  | Vitest + `docs/METHODOLOGY_AUDITS/l3-verify.md`                                           | ⬜                     |
| 13  | P0  | **N1-verify** — `/api/v1/oecd/feed` cron gerçekten published incident döndürüyor mu?                                                                                                       | `docs/METHODOLOGY_AUDITS/n1-oecd-verify.md`; ≥1 kayıt kanıtı                              | ⬜                     |
| 14  | P0  | **L2 outreach list** — TR+EU üniversite MOU hedef listesi (15-20 kurum) — şablon zaten shipped (`docs/L2_MOU_TEMPLATE.md`)                                                                 | `docs/L2_OUTREACH_LIST.md`                                                                | ⬜ liste / ⏸ gönderim  |
| 15  | P0  | **L8** — Role-based dashboard scaffold: `role_view` kolonu (`profiles` tablosu) + 4 boş görünüm (compliance/journalist/legal/safety), veri yok, UI iskelet                                 | Migration (RLS+ROLLBACK) + 4 route; mevcut RLS zayıflatılmaz                              | ⬜                     |
| 16  | P0  | **K-Product scaffold** — `private_benchmarks` + `rating_alerts` tabloları (RLS+ROLLBACK) + billing sayfası iskeleti (Stripe key YOK, placeholder ENV)                                      | Migration + `/pricing/enterprise` sayfası; gerçek ödeme akışı founder onayına kadar pasif | ⬜ kod / ⏸ stripe-keys |
| 17  | P1  | **N2 outreach** — UK AISI + US AISI iletişim taslağı (LinkedIn + email metni)                                                                                                              | `docs/N2_OUTREACH_DRAFT.md`                                                               | ⬜ taslak / ⏸ gönderim |
| 18  | P1  | **L4** — Profesyonel dernek listesi (TÜBA, İstanbul Barosu AI Komitesi, IEEE/ACM TR, EU AI Alliance) + davet şablonu                                                                       | `docs/L4_PARTNERSHIPS.md`                                                                 | ⬜ liste / ⏸ gönderim  |
| 19  | P1  | **L5** — Instructor tier: `role = 'instructor'` + küratörlü olay paketi (20-30 olay + PDF export)                                                                                          | Migration (RLS+ROLLBACK) + `/academy/instructor` sayfası                                  | ⬜                     |
| 20  | P1  | **L6** — Faculty fellowship sayfası + başvuru formu + admin review kuyruğu                                                                                                                 | `/academy/fellowship` sayfası + `fellowship_applications` tablo (RLS+ROLLBACK)            | ⬜                     |
| 21  | P2  | **L7** — Student ambassador programı sayfası + `student_ambassadors` tablo + admin CRUD                                                                                                    | Sayfa + migration (RLS+ROLLBACK)                                                          | ⬜                     |
| 22  | P2  | **N3** — ISO/IEC + CEN-CENELEC katkı taslağı: ALPAR taksonomisi working-draft formatında                                                                                                   | `docs/N3_STANDARDS_CONTRIBUTION.md`                                                       | ⬜ taslak / ⏸ gönderim |
| 23  | P2  | **Art.73 tracker scaffold** — `art73_obligation_status` tablosu (provider bazlı) + `/transparency/art-73-tracker` sayfası, veri boş, UI hazır                                              | Migration (RLS+ROLLBACK) + sayfa                                                          | ⬜                     |

**Kural:** Bu kuyruk önceden onaylıdır (Rule #2 kapsamında plan-dışı değil) — Antigravity Aug 10'dan itibaren üstten alta işler, ⏸ item'a gelince atlar. Yeni istisna/genişleme yine Architect onayı gerektirir.

## §6 Launch Freeze

**Aug 1–9:** yalnızca D/W-series işleri + hotfix. Otopilot bu pencerede kuyruğu bırakır, `docs/RUNBOOK_LAUNCH_DAY.md`'yi izler. Aug 10'da §5'teki Post-Launch Kuyruğu (item 10+) otomatik devreye girer — Architect'ten yeni onay beklenmez.

## §7 Founder Bekleyenler (otopilotu bloke etmez)

1. 🔴 **R1** — GitHub repo → private (Settings → Danger Zone). Hâlâ doğrulanmadı; en büyük açık risk. **19 gün kaldı — freeze öncesi zorunlu.**
2. 🔴 **R2** — 6 token rotasyonu (Supabase service-role, Vercel, Resend, OpenRouter, Vertex, Upstash). **freeze öncesi zorunlu.**
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

item 24+ için yeni iş: Architect §5'e ekler, bu özeti günceller. Executor Horizon'dan kendi başına iş türetmez.
