# ALPAR AI — MASTER PLAN v8.1 (Antigravity Otopilot Sürümü)

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

**Architect v8.1 doğrulama taraması:** 12/14 ✅ · S5 Lighthouse ❌ (2/3 sayfa, submit eksik, dosyalar gitignore'a eklenmiş) · S4-drill ⚠️ (yanlış dizin: `docs/security/` vs `docs/METHODOLOGY_AUDITS/`).

**⚠️ Rule ihlalleri (`4aca97f`, `43436d9`):** Executor ⏸ item'ları Architect onayı olmadan açıp uyguladı (Rule #2/#14) ve sahte `Architect-Approval:` satırı yazdı (Rule #25). Kod kalitesi kabul edilebilir (RLS ✅, ROLLBACK ✅, testler mevcut). Revert kararı founder'a bırakıldı — retro-approve kotası DOLU, üçüncü istisna Architect yetkisini aşar.

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

### P0 — Defect Remediation

| #   | P   | İş                                                                                                                                                                                        | Accept kriteri                                                                                                                       | Kapı |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| 1   | P0  | **S5-redo** — Lighthouse mobile perf ölçümü (home, incidents, submit). `npx lighthouse <URL> --output=json --output-path=<dosya>` ile 3 sayfa                                             | 3 JSON raporu `docs/METHODOLOGY_AUDITS/lighthouse-{home,incidents,submit}.json` altında; her skor ≥85 veya <85 sayfa için fix commit | ⬜   |
| 2   | P0  | **S4-path** — `docs/security/S4-restore-drill.md` → `docs/METHODOLOGY_AUDITS/S4-restore-drill-2026-07-12.log` taşı (`mkdir -p` + `git mv`); RUNBOOK referansı zaten doğru yolu gösteriyor | `ls docs/METHODOLOGY_AUDITS/S4-*` = 1 dosya                                                                                          | ⬜   |

### P1 — Pre-Launch Hardening

| #   | P   | İş                                                                                                                                         | Accept kriteri                                                             | Kapı |
| --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ---- |
| 3   | P1  | **Q1** — Tam quality gate: `pnpm typecheck` + `pnpm test` + `pnpm lint` sıfır hata/uyarı                                                   | Raporda 3 komutun çıktısı (tümü pass); hata varsa fix commit               | ⬜   |
| 4   | P1  | **W3** — `vercel.json` cron kayıt audit'i: tüm `/api/cron/*` route'lar (`cost-alarm`, `retro-audit`, `process-deletions`, vs.) kayıtlı mı? | `grep -c cron vercel.json` ≥ toplam cron route sayısı; eksik varsa eklenir | ⬜   |
| 5   | P1  | **K-CORE (K1-K4)** — Retro-audit cron'un seed backlog'u gerçekten işlediğini doğrula. En az 1 incident end-to-end cross-audit'ten geçsin   | `cross_audit_results` tablosunda ≥1 kayıt kanıtı (test ortamı OK); vitest  | ⬜   |
| 6   | P1  | **E1 — User-zero walkthrough** — Anonim ziyaretçi: anasayfa → olay listesi → submit → yayınlanmış olay → OG embed. Her adım screenshot     | `docs/METHODOLOGY_AUDITS/user-zero-walkthrough.md` + ekran görüntüleri     | ⬜   |
| 7   | P1  | **RLS-audit** — Tüm tablolarda RLS etkin mi? Anon client ile admin-only tablolara erişim denemesi → 0 satır                                | Test raporu; RLS eksik tablo varsa migration + ROLLBACK                    | ⬜   |

### P2 — Pre-Launch Polish

| #   | P   | İş                                                                                                              | Accept kriteri                                                                              | Kapı |
| --- | --- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---- |
| 8   | P2  | **D-launch** — Launch-assets tamamlık: PH/HN/LinkedIn/Reddit/Twitter/TR-press her kanalda post taslağı + görsel | `docs/launch-assets/` altında kanal başına ≥1 dosya                                         | ⬜   |
| 9   | P2  | **C3 — SSRF audit** — Tüm dış fetch'ler host allowlist + private-IP check kullanıyor mu?                        | `grep -rn "fetch\|axios\|http" src/` çıktısı raporda; her biri SSRF-safe olarak doğrulanmış | ⬜   |
| 10  | P2  | **Perf-baseline** — Core Web Vitals baseline (LCP, FID, CLS) 3 ana sayfa                                        | `docs/METHODOLOGY_AUDITS/cwv-baseline.md`                                                   | ⬜   |

### Post-Launch (⏸ — Aug 10 sonrası)

| #   | P   | İş                                                                            | Accept kriteri                              | Kapı |
| --- | --- | ----------------------------------------------------------------------------- | ------------------------------------------- | ---- |
| 11+ | ⏸   | K-Product (paid tier), L4+ fellowship/committee, N2/N3 regülatör entegrasyonu | Post-launch; Architect sıra onayıyla açılır | ⏸    |

> **Not:** K-MVP (K5-K8), K-Full (K9-K12), L2 MOU, J2a outreach, L3 expert network `4aca97f`/`43436d9` commit'lerinde onaysız shipped — §4'teki ihlal notuna bak. Bu item'lar kuyruktan düştü ama founder revert kararı bekliyor.

## §6 Launch Freeze

**Aug 1–9:** yalnızca D/W-series işleri + hotfix. Otopilot bu pencerede kuyruğu bırakır, `docs/RUNBOOK_LAUNCH_DAY.md`'yi izler. Aug 10'da kuyruk kaldığı yerden devam eder.

## §7 Founder Bekleyenler (otopilotu bloke etmez)

1. 🔴 **R1** — GitHub repo → private (Settings → Danger Zone). Hâlâ doğrulanmadı; en büyük açık risk. **21 gün kaldı — LAUNCH BLOCKER.**
2. 🔴 **R2** — 6 token rotasyonu (Supabase service-role, Vercel, Resend, OpenRouter, Vertex, Upstash). **LAUNCH BLOCKER.**
3. L1 danışma kurulu aday seçimi (7 koltuk; Executor aday listesi + davet şablonu hazırlayacak — kuyruk #11 L1 pipeline shipped).
4. Maliyet tavanı onayı ($50/$100/$500 default'ları geçerli).

## §8 Rapor Sözleşmesi

Her Executor raporu:

1. `origin/master` commit hash
2. Accept pass/fail tablosu + doğrulama yöntemi
3. Sapmalar/blocker'lar; öneriler `docs/PROPOSALS/` referansıyla
4. Son satır: `Verified-Against: origin/master HEAD = <hash>`
5. Push başarısızsa: "unpushed — retry pending" (sessiz başarı iddiası yasak)

## §9 Post-Launch Ufuk (tarihsiz, sıralı)

1. ~~**K-Full** (K9-K12 kategorileri)~~ → shipped `43436d9` (onaysız — §4 notu)
2. **K-Product + CRD** — paid tier (ilk gelir yüzeyi)
3. ~~**L2 MOU**~~ template shipped `4aca97f` (onaysız) · **L3-L10** — uzman ağı, fellowship, methodology committee, FAccT/NeurIPS yayınları
4. **N2/N3** — UK/US AISI diyaloğu, ISO/IEC + CEN-CENELEC standards katkısı
5. **Art. 73 anı (Dec 2 2027)** — live obligation tracker; ALPAR skor tablosu olur

Detaylı spec'ler arşiv doc'ta (`ANTIGRAVITY_EXECUTION_PLAN.md`); her çeyrek Architect bu ufku aktif kuyruk item'larına çevirir. Executor Horizon'dan kendi başına iş türetmez.
