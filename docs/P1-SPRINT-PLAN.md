# P1 Sprint Planı — ALPAR AI 360° Konsolide Analiz Sonuçları

**Tarih:** 2026-06-08
**Sprint Süresi:** ~6-8 saat (otopilot)
**Kaynak:** `ALPARAI-360-ALL-REPORTS.md` (5 AI modeli konsolide)
**Kalite Eşiği:** 0 P0 ✅ + %80 P1 ✅ + `pnpm validate` ✅ + site canlı ✅

---

## Çapraz Analiz (5 Modelin Ortak Bulgusu)

| Bulgu | Kaynak | Şiddet | Durum |
|:---|:---|:---:|:---|
| `setUserRole` admin escalation | Tüm modeller | 🔴 P0 | AÇIK |
| Open Redirect (auth callback) | Tüm modeller | 🔴 P0 | AÇIK |
| IP_SALT fallback | 4 model | 🔴 P0 | AÇIK |
| Magic link rate limit yok | 4 model | 🔴 P0 | AÇIK |
| `consent_log.granted` eksik | M3 + mimo | 🔴 P0 | AÇIK |
| `database.ts` manuel, 27 `as never` | 3 model | 🔴 P0 | AÇIK |
| Husky hook'ları boş | 3 model | 🟡 P1 | AÇIK |
| Prettier config çakışması | 3 model | 🟡 P1 | AÇIK |
| `contact-form.tsx` i18n dışı | 4 model | 🟡 P1 | AÇIK |
| `hashIp()` 3 kopya | M3 + mimo | 🟡 P1 | AÇIK |
| `IncidentListItem` mapping 8 kopya | mimo | 🟡 P1 | AÇIK |
| `REASONS` array 2 kopya | mimo + V2 | 🟡 P1 | AÇIK |
| `language: "en"` hardcoded | mimo | 🟡 P1 | AÇIK |
| 4 Server Action rate limit yok | V2 + M3 | 🟡 P1 | AÇIK |
| Health endpoint bilgi sızıntısı | mimo + M3 | 🟡 P1 | AÇIK |
| A11y: tablo `<caption>` yok | M3 | 🟡 P1 | AÇIK |
| Cookie banner Escape yok | mimo + M3 | 🟢 P2 | AÇIK |
| Boş route group'lar | V2 | 🟢 P2 | AÇIK |

**Not:** V2 raporunun "35+ TypeScript hatası" iddiası **yanlış** — gerçekte `pnpm typecheck` 0 hata döndürüyor. V2 raporu `incident_votes`/`contains_pii` migration'larının 08.06'da uygulanmasından **önce** yazılmış.

---

## P0 Sprint (90 dk) — Güvenlik Açıkları

### P0-1: setUserRole — Moderatör→Admin Escalation [15 dk]
- **Dosya:** `src/actions/admin.ts:168-188`
- **Fix:** Schema'dan `"admin"` çıkar (`z.enum(["user", "moderator"])`); `requireAdmin()` kullan
- **Test:** `tests/admin.test.ts` — moderator can't escalate, admin can demote

### P0-2: Open Redirect — Auth Callback [15 dk]
- **Dosya:** `src/app/[locale]/auth/callback/route.ts:9,14`
- **Fix:** Whitelist `^/[a-zA-Z0-9_\-/]*$` (tek `/` ile başla, `//`, `/\`, `:` içermesin); default `/profile`
- **Test:** `tests/auth-callback.test.ts` — yeni (route handler testi)

### P0-3: IP_SALT — Boot-Fatal Fallback [30 dk]
- **Dosyalar:** 5 yerde — `incidents.ts:134,191`, `contact.ts:98`, `takedown.ts:78,166`
- **Fix:** `lib/utils/hash.ts`'e `requireSalt()` helper; boot'ta yoksa `throw new Error("IP_SALT must be set")`; fallback kaldır
- **Test:** `tests/hash.test.ts` (yeni) — salt missing → throw

### P0-4: Magic Link Rate Limit [15 dk]
- **Dosya:** `src/actions/auth.ts:42-50`
- **Fix:** `RATE_LIMIT_KEYS.auth_magiclink` (5/15m) ekle, IP'ye göre rate limit
- **Test:** `tests/auth.test.ts` — magic link rate limit aşımı

### P0-5: consent_log.granted Eksik [10 dk]
- **Dosya:** `src/actions/incidents.ts:129-137`
- **Fix:** `granted: true` ekle
- **Test:** `tests/incidents.test.ts` — submit creates consent_log row with granted=true

### P0-6: database.ts — Supabase Gen Types [5 dk]
- **Şu an:** `src/types/database.ts` manuel, 283 satır
- **Fix:** `npx supabase gen types typescript --local > src/types/database.ts`
- **Etki:** 27 `as never` cast'inin çoğu otomatik düşer

---

## P1 Sprint (4-6 saat) — Kod Kalitesi + i18n + CI/CD

### P1-7: as never Temizliği (~27 adet) [60 dk]
- **Strateji:** P0-6 sonrası kalan 5-10 cast'i manuel düzelt
- **Dosyalar:** `incidents.ts`, `admin.ts`, `takedown.ts`, `suggestions.ts`, `export.ts`, `audit-service.ts`, `persistence.ts`, `lib/autopilot/`
- **Tooling:** `grep -r "as never" src/` ile listele, tipli hale getir

### P1-8: hashIp() Deduplikasyonu [20 dk]
- **Yeni:** `src/lib/utils/hash.ts` — `hashIp(ip, salt)`, `requireIpSalt()`
- **Kaldır:** 3 kopya (contact, incidents, takedown)
- **Test:** `tests/hash.test.ts`

### P1-9: IncidentListItem Mapping → lib/mappers.ts [30 dk]
- **Yeni:** `src/lib/mappers.ts` — `mapIncidentRow(row)`, `mapIncidentList(rows)`
- **8 dosyada** 15 alanlı mapping'i tekilleştir

### P1-10: REASONS → lib/constants + i18n [20 dk]
- **Yeni:** `src/lib/constants/takedown-reasons.ts` — ortak liste
- **Kullanım:** `takedown-button.tsx` + `takedown-form.tsx`
- **i18n:** `messages/{en,tr}.json` `takedown.reasons.{defamation,copyright,...}` ekle

### P1-11: contact-form.tsx → i18n [30 dk]
- **Hardcoded:** 7 string (Your name, Email, Category, General, Press, ..., Send message, Message sent)
- **Namespace:** `contact.form.*` (EN+TR)
- **Aynı şekilde:** success/error mesajları

### P1-12: badge.tsx → i18n [20 dk]
- **Hardcoded:** 9 severity/status label
- **Namespace:** `badge.{severity,status}.*` (EN+TR)

### P1-13: language: "en" → user locale [15 dk]
- **Dosya:** `src/actions/incidents.ts:81,111`
- **Fix:** `await getLocale()` kullan (TR/EN dışında → "en")

### P1-14: Rate Limit 4 Action'a [30 dk]
- **Eksik:** `contact`, `takedown` (×2), `search`, `export`, `vote`, `magicLink`
- **Yeni keys:** `contact_submission` (5/h), `takedown_submission` (3/d), `search_query` (30/m), `magic_link` (5/15m)
- **Test:** her action için limit aşımı senaryosu

### P1-15: Husky + Lint-staged Aktifleştir [15 dk]
- **Şu an:** `.husky/_/` (17 internal stub), kullanıcı hook'ları YOK
- **Fix:** `.husky/pre-commit` oluştur (`npx lint-staged`)

### P1-16: Prettier Config Birleştir [10 dk]
- **Şu an:** `.prettierrc.json` + `prettier.config.mjs` çakışıyor
- **Fix:** `.prettierrc.json` sil, `prettier.config.mjs` tek doğru kaynak (Tailwind plugin var)

### P1-17: Health Endpoint Maskeleme [10 dk]
- **Dosya:** `src/app/api/health/route.ts`
- **Fix:** DB latency / Redis state / version çıkarma; sadece `{ status: "ok" }` veya auth gerektir

### P1-18: A11y — Tablo Caption [20 dk]
- 5+ tabloya `<caption>` ekle (admin/moderation/users/audit sayfaları)
- `caption` + `sr-only` class

### P1-19: Cookie Banner Escape [15 dk]
- **Dosya:** `src/components/legal/cookie-banner.tsx`
- **Fix:** `useEffect` + `keydown` listener, ESC tuşu → close

---

## P2 Sprint (gelecek hafta) — İyileştirmeler

- P2-20: Component unit testleri (53 component, 0 test → 20+ test)
- P2-21: `settings/page.tsx` i18n
- P2-22: `about/page.tsx` i18n
- P2-23: `contact/page.tsx` i18n
- P2-24: Boş route group'lar temizle (`(admin)`, `(app)`, `(auth)`, `(public)`)
- P2-25: `select("*")` → spesifik alanlar (admin sayfaları)
- P2-26: Boş `catch {}` → minimal error logging (10+ yerde)
- P2-27: Service-role reduction (user-driven write path'lerde)
- P2-28: 100+ hardcoded EN → i18n (tam)

---

## Multi-Rol Orkestrasyon Döngüsü

Her batch'te sırayla:

```
┌─ DEVELOPER AGENT ─┐ → Kod yaz, değiştir, ekle
│   (coder)        │
└────────┬─────────┘
         ↓
┌─ TESTER AGENT ────┐ → pnpm test, typecheck, lint, validate
│   (qa)           │   → Coverage ölç
└────────┬─────────┘
         ↓
┌─ REVIEWER AGENT ──┐ → Kod review (security, perf, a11y, i18n)
│   (auditor)      │   → OWASP, 360° rapor kriterleri
└────────┬─────────┘
         ↓
┌─ ORCHESTRATOR ─────┐ → PASS/FAIL kararı
│   (koordinatör)   │   → FAIL: düzeltici aksiyon, batch'e geri dön
│                   │   → PASS: sıradaki batch
│                   │   → Tüm batch'ler PASS: build + deploy + final review
└───────────────────┘
```

**Kalite Eşiği (her batch):**
- ✅ `pnpm typecheck` → 0 hata
- ✅ `pnpm lint` → 0 hata (warn OK)
- ✅ `pnpm test` → 100% pass
- ✅ `pnpm build` → success
- ✅ Reviewer onayı (security + i18n + a11y)

**Mükemmellik Kapısı:** Tüm P0 + P1'ler PASS + ortalama test coverage >%70 + 0 `as never` kalan + 0 hardcoded i18n P1 kapsamında.

---

## Risk Notları

- `supabase gen types` remote DB bağlantısı gerektirebilir → local için `db dump` gerekebilir
- CSP `unsafe-eval` kaldırılırsa Next.js dev modu bozulabilir → sadece production'da sıkılaştır
- `signInWithMagicLink` rate limit IP-based olmalı (email değil, yoksa DDoS)
- `setUserRole` "admin" çıkarılırsa CEO rolü için ayrı `promoteToCEO` action'ı düşünülebilir
