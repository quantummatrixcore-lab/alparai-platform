# ALPAR AI — MASTER PLAN v8.0 (Antigravity Otopilot Sürümü)

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

| Seri | İçerik | Commit |
|------|--------|--------|
| V1+V2 | vercel.json cron'ları (daily — Hobby tavanı) | `f2107a5`, `a671fc1` |
| U1-U3 | HMAC unsubscribe API + template'ler | `7f30125` |
| M0-M3 | Mobile sprint (config, audit, overflow fix, CI lock) | `89a75ba`, `bb1fcca`, `de59706`, `aace3ba` |
| C1a | api_keys sha256 hardening + auth path | `20260715000000` + `20260720000001` migrations |
| H1+H2 | incident_source badge + copy | `incident-card.tsx` |
| P1/P3/P4 | Countdown drafts, TR media pitches, LinkedIn/Reddit | `fa80867`, `4d47356`, `745b4fa` |
| W-series | RUNBOOK_LAUNCH_DAY v1.1 + dry run | `cf4ecce`, `5bd8cd4` |
| X1-X5 | Crisis playbook'lar | `98936ab` |
| Y1-Y3 | launch-signal dashboard + day-7/30 cron'lar | `fa80867`, `98936ab` |
| K2 (erken) | retro-audit scheduler | shipped, sınır kanıtı bekliyor (kuyruk #7) |
| J3/state_support | Devlet destekleri modülü | `76ddec4` (retro-approved) |
| Neutrality Charter | `/neutrality` sayfası | `133af72` (retro-approved) |
| S1-S3 | Secrets scan, dep audit, security headers (HSTS doğrulandı) | shipped |

**Architect doğrulama taraması (v7.16):** v1 API sha256+timingSafeEqual ✅ · HSTS ✅ · H1 badge ✅ · C1a ROLLBACK bloğu ❌ (kuyruk #1).

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

| # | P | İş | Accept kriteri | Kapı |
|---|---|-----|----------------|------|
| 1 | P0 | **C1a-fix** — `supabase/migrations/20260715000000_api_keys_hardening.sql` sonuna `-- ROLLBACK:` bloğu | `grep -c ROLLBACK <dosya>` ≥ 1 | ⬜ |
| 2 | P0 | **H3** — hardcoded incident count temizliği | `grep -rn "40[89]" src/` çıktısı raporda; kalan her eşleşme dinamik/DB-canlı kullanım | ⬜ |
| 3 | P0 | **S4-drill** — gerçek backup restore drill (dump → scratch project → 5 smoke query) | Log: `docs/METHODOLOGY_AUDITS/S4-restore-drill-<tarih>.log`; RTO ölçümü RUNBOOK'a işlenir | ⬜ |
| 4 | P1 | **S5** — Lighthouse mobile ≥85 (home/incidents/submit) | 3 skor raporda; <85 sayfa için fix commit'i | ⬜ |
| 5 | P1 | **D-extra screenshots** — PH/LinkedIn/Reddit görselleri (`docs/launch-assets/screenshots-guide.md` mevcut) | Görsel dosyalar `docs/launch-assets/` altında | ⬜ |
| 6 | P1 | **C5-verify** — embed widget dış doğrulama | OG validator çıktısı + 1 harici embed ekran görüntüsü raporda | ⬜ |
| 7 | P1 | **K3/K4-verify** — retro-audit cron sınır kanıtı | Test: cron `user_submitted` satırına dokunmuyor (vitest); `audit_tier` kolonu migration'ı (RLS + ROLLBACK) | ⬜ |
| 8 | P1 | **I-series seed** — `supabase/migrations/*_seed_i_series_innovations.sql` (8 kayıt; idempotent `WHERE NOT EXISTS`) | `/admin/innovations`'da 8 satır; anon göremez; ROLLBACK bloğu | ⬜ |
| 9 | P1 | **C2** — `docs/API.md` REST v1 bölümü | "No REST endpoints" satırı silinmiş; v1 endpoint'ler belgelenmiş | ⬜ |
| 10 | P1 | **Rule #20 cost alarm** — günlük/aylık eşik cron + `COST_KILL_SWITCH` | Cron kayıtlı (Hobby daily OK); eşikler $50/$100/$500 default | ⬜ |
| 11 | P1 | **L1 pipeline (kod kısmı)** — `advisory_board_members` migration (RLS: herkes okur, admin yazar) + `/about/advisory-board` sayfası (EN+TR, isimler boş) + davet email şablonu | Sayfa canlı ama isimsiz; Rule #21 gereği isim yayını ⏸ founder onayı | ⬜ kod / ⏸ isimler |
| 12 | P2 | **N4 taslak** — TR AI Safety Institute white paper iskeleti + veri grafikleri | `docs/WHITEPAPER_TR_AISI/draft.md`; yayın ⏸ founder | ⬜ taslak / ⏸ yayın |
| 13 | P2 | **J4a model router** — `src/lib/audit/model-router.ts` `selectModelTier()` | Unit test + cross-audit engine entegrasyonu; freeze döneminde başlama | ⬜ |
| 14 | P2 | **N1 OECD feed** — `/api/v1/oecd/feed` + `docs/OECD_TAXONOMY_MAP.md` | SSRF-safe, RLS-safe, sadece yayınlanmış olaylar | ⬜ |
| 15+ | ⏸ | K-MVP kategorileri (K5-K8), L2 MOU şablonu, J2a outreach agent, L3 expert network, K9-K12, K-Product | Arşiv doc ilgili bölümleri spec'tir; sıra Architect onayıyla açılır | ⏸ |

## §6 Launch Freeze

**Aug 1–9:** yalnızca D/W-series işleri + hotfix. Otopilot bu pencerede kuyruğu bırakır, `docs/RUNBOOK_LAUNCH_DAY.md`'yi izler. Aug 10'da kuyruk kaldığı yerden devam eder.

## §7 Founder Bekleyenler (otopilotu bloke etmez)

1. 🔴 **R1** — GitHub repo → private (Settings → Danger Zone). Hâlâ doğrulanmadı; en büyük açık risk.
2. 🔴 **R2** — 6 token rotasyonu (Supabase service-role, Vercel, Resend, OpenRouter, Vertex, Upstash).
3. L1 danışma kurulu aday seçimi (7 koltuk; Executor aday listesi + davet şablonu hazırlayacak — kuyruk #11).
4. Maliyet tavanı onayı ($50/$100/$500 default'ları geçerli).

## §8 Rapor Sözleşmesi

Her Executor raporu:
1. `origin/master` commit hash
2. Accept pass/fail tablosu + doğrulama yöntemi
3. Sapmalar/blocker'lar; öneriler `docs/PROPOSALS/` referansıyla
4. Son satır: `Verified-Against: origin/master HEAD = <hash>`
5. Push başarısızsa: "unpushed — retry pending" (sessiz başarı iddiası yasak)

## §9 Post-Launch Ufuk (tarihsiz, sıralı)

1. **K-Full** (K9-K12 kategorileri) → `/ratings` 8 kategori
2. **K-Product + CRD** — paid tier (ilk gelir yüzeyi)
3. **L2-L10** — üniversite MOU'ları, uzman ağı, fellowship, methodology committee, FAccT/NeurIPS yayınları
4. **N2/N3** — UK/US AISI diyaloğu, ISO/IEC + CEN-CENELEC standards katkısı
5. **Art. 73 anı (Dec 2 2027)** — live obligation tracker; ALPAR skor tablosu olur

Detaylı spec'ler arşiv doc'ta (`ANTIGRAVITY_EXECUTION_PLAN.md`); her çeyrek Architect bu ufku aktif kuyruk item'larına çevirir. Executor Horizon'dan kendi başına iş türetmez.
