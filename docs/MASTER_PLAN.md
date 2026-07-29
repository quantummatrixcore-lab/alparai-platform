# ALPAR AI — Master Plan (v11.89, 2026-07-28)

Bu belge yalındır ve öyle kalır: konum, mimari, sermaye hattı, yönetişim, yürütme kurulu. Geçmiş kayıtlar (v11.1–v11.88) `docs/MASTER_PLAN_ARCHIVE.md`'de. Canlı ilerleme `/admin/strategy/*` (DB-tabanlı) ve aşağıdaki Yürütme Kurulu tablosundadır — `parseMasterPlan()` yalnızca o tabloyu okur.

---

## 1. Konum — Neden Var, Neden Şimdi

**Ne:** ALPAR AI, kara-kutu YZ sistemleri için bağımsız güven ve hesap verebilirlik altyapısıdır — bir B2B aracı değil, ekosistemin denetim katmanı. AGPL-3.0; topluluk yönetişimli; halüsinasyon, önyargı ve gizlilik ihlallerini belgeleyen açık olay veritabanı + K-BENCHMARK skorlaması.

**Neden şimdi:** EU AI Act ciddi-olay bildirimi (Madde 73) yürürlük penceresi — repoda 2 Ağustos 2026 olarak kodlu (`src/app/api/cron/kill-metric/route.ts:16`); resmî kaynak teyidi Founder'da `[doğrulanmalı]`. Yükümlülüğün doğduğu gün hazır olan tek bağımsız katman olmak, konumlandırmanın tamamıdır. `/transparency/art-73-tracker` rotası canlı.

**Kanıtlanmış zemin (ölçüldü):** 118 rota · 87+ tablo · RLS 65/65 · canlı Stripe · 9 YZ sağlayıcı adaptörü · production READY, `www.alparai.com`/`alparai.com` alias'ları doğrulandı (Vercel API, v11.90) · 920/920 test yeşil (v11.90) · typecheck+lint temiz.

**Büyük teknoloji kaldıracı:** Microsoft, Google, AWS, Anthropic, OpenAI'ın üçüncü-taraf uyum verisine ihtiyacı yapısaldır — ALPAR AI entegre etmek zorunda kalacakları tarafsız denetim katmanı olarak konumlanır. Bu bir sponsorluk hedefidir, mevcut bir anlaşma değildir.

## 2. Mimari — Tek Satır + Kanıt

- **Uygulama:** Next.js App Router, mutasyonlar yalnızca Server Actions — `src/actions/*`
- **Veri:** Supabase, RLS 65 tablo / 65 politika — `supabase/migrations/`
- **Gizlilik:** PII Guardian insert-öncesi maskeleme (14 kategori) — `src/lib/pii/guardian.ts`
- **YZ Gateway:** Çok-sağlayıcılı failover (Gemini→NVIDIA→OpenRouter→Cohere) — `src/lib/ai/openrouter-gateway.ts`
- **Olay akışı:** Reddit/HN/RSS/GitHub bağlayıcıları, günlük cron — `src/lib/connectors/*`, `vercel.json`
- **Skorlama:** K-BENCHMARK — `k_model_scores` MAT view + `bench_tr_evaluations`
- **Panel:** `/admin/master-plan` ← `parseMasterPlan()` ← yalnızca aşağıdaki tablo

## 3. Sermaye Hattı

**3a. Doğrulanmış katalog (seed'li, gerçek URL'ler — `20260819100000_seed_grants_catalog.sql`):**
Google for Startups $2K–350K · AWS Activate $1K–200K · Microsoft Founders Hub ≤$150K · Anthropic Startup Program $1K–250K · NVIDIA Inception (GPU/teknik) · OpenAI Researcher Access $1K–2.5K · GitHub for Startups ≤$10K · Vercel for Startups (OSS altyapı) · Supabase for Startups $3K. Tümü `not_started`; ilerletme Founder'da (başvuru şablonları: `docs/APPLICATIONS/`).

**3b. Hedef havuz `[tahmin — doğrulanmamış]`:** Horizon Europe, EIC Accelerator, NGI, Open Philanthropy, Mozilla, FLI, McGovern, TÜBİTAK 1711/1512, KOSGEB, İş Bankası YZF. Programlar gerçektir; ALPAR AI'ın uygunluğu/başvurusu doğrulanmamıştır. Hiçbiri "erişilen fon" olarak anılamaz; toplam ("$500K+ compute" vb.) türetilemez.

**Yasak iddialar (kanıt yokken yazılamaz):** KVKK/"Case #001" traction · MRR/abone sayısı (`finance_revenue_metrics` seed'i fabrikasyon, temizliği #13'te) · danışma kurulu üyeleri (tümü açık pozisyon) · kurum ortaklıkları.

## 4. Yönetişim

- **G-5/G-6:** Claude yalnızca bu dosyayı yazar; tüm uygulama Antigravity/OpenCode'dadır. Keşif Haiku'ya devredilir.
- **TOM kanıt disiplini:** "Yapıldı" iddiası dosya:satır/komut çıktısı olmadan kabul edilmez; ölçülmemiş rakam "ölçülmedi" diye yazılır. (Bu oturumda iki kez sahte "tamamlandı" raporu bu kuralla yakalandı — arşiv v11.80, v11.85.)
- **Tek-kişi riski:** CODEOWNERS'ta her yol tek hesapta; branch protection + auto-delete-branches hâlâ açılmadı (#18).

## 5. Yürütme Kurulu (panelin okuduğu tek bölüm)

<!-- FOUNDER_BACKLOG_START -->

| #   | Priority | Item                                                                              | Description                                                                                                                                                                                                                                 | Status       |
| --- | -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | P0       | [Antigravity] Public incident auto-publishing — mainstream connector              | Google News RSS connector `src/lib/connectors/rss.ts` ve `fetch-external` rotası canlı, allowlist aktif                                                                                                                                     | ✅ completed |
| 2   | P1       | [Antigravity] Founder Cockpit — LinkedIn contacts table + admin page              | Tablo + `/admin/linkedin` + `src/actions/admin/linkedin.ts` canlı; seed uydurma içermiyor (Bulgu A)                                                                                                                                         | ✅ completed |
| 3   | P1       | [Antigravity] Grant applications — iki adımlı onay akışını tamamla                | `markGrantSubmitted` action + `role IN ('admin','ceo')` yetki kontrolü ve `completed_by` takibi canlı (`grants.ts`)                                                                                                                         | ✅ completed |
| 4   | P1       | [Antigravity] Founder Cockpit — platform signups table + admin page               | Tablo + `/admin/platforms` + `src/actions/admin/platforms.ts` canlı                                                                                                                                                                         | ✅ completed |
| 5   | P1       | [Antigravity] Outreach queue — `/admin/outreach`'i gerçek kuyruk görünümüne çevir | `outreach_queue` DB entegrasyonu, `OutreachQueueList` bileşeni ve `/api/cron/outreach` canlı                                                                                                                                                | ✅ completed |
| 6   | P1       | [Antigravity] Fix `parseMasterPlan()` false-completion bug                        | `src/lib/utils/markdown-parser.ts` artık `FOUNDER_BACKLOG_START/END` arasını okuyor                                                                                                                                                         | ✅ completed |
| 7   | P2       | [Antigravity] NVIDIA admin-entered key → `NVIDIA_NGC_API_KEY` env path            | `src/lib/ai/adapters/nvidia-ngc.ts` içinde `resolveApiKey` ile bağlı                                                                                                                                                                        | ✅ completed |
| 8   | P2       | [Antigravity] Visual-layer rollout to remaining flat-table admin pages            | Grants, LinkedIn, Platforms listelerine Recharts BarChart görsel takibi eklendi                                                                                                                                                             | ✅ completed |
| 9   | P2       | [Founder] Create HackerOne + Reddit accounts                                      | HackerOne (`opportunities/all`) ve Reddit (`Potential_Can2214`) hesapları oluşturuldu ve doğrulandı                                                                                                                                         | ✅ completed |
| 10  | P1       | [Antigravity] Grant seed verisini katalogla eşitle                                | 9 katalog programı `apply_url` + `prepared_content_ref` ile seed edildi (`20260819100000_seed_grants_catalog.sql`)                                                                                                                          | ✅ completed |
| 11  | P0       | [Antigravity] Integrations rating fallback — uydurma sayı yerine N/A              | `bec231c`: `rating: undefined`, UI "Unrated (N/A)" gösteriyor                                                                                                                                                                               | ✅ completed |
| 12  | P0       | [Antigravity] `google-news-url-decoder` eksik paket                               | Lockfile'da zaten geçerli kayıt vardı; `pnpm install`+`pnpm test` ile 920/920 test doğrulandı (v11.90)                                                                                                                                      | ✅ completed |
| 13  | P0       | [Founder] `finance_revenue_metrics` fabrikasyon MRR temizliği                     | Seed MRR/abone verisi yatırımcı-görünür yüzeyde mi doğrula; kaldır veya "örnek veri" etiketle                                                                                                                                               | pending      |
| 14  | P1       | [Antigravity] Advisory board kurum adlarını hedef-profile çevir                   | `674dd17`: "ETH/Stanford/CERN Partner Chair" → "Academic & Industry AI Ethics Research" vb.                                                                                                                                                 | ✅ completed |
| 15  | P1       | [Founder] AI Act Madde 73 yürürlük tarihini resmî kaynaktan teyit                 | Tüm konumlandırma bu tarihe dayanıyor; repo-içi doküman kaynak sayılmaz                                                                                                                                                                     | pending      |
| 16  | P1       | [Antigravity] Marketing sayfasını gerçek veriye bağla                             | `bec231c`: `createAdminClient()` ile incidents/outreach/profiles sayımı; not: `as any` cast kullanılmış (#22)                                                                                                                               | ✅ completed |
| 17  | P1       | [Founder] Outreach kuyruğuna gerçek gazeteci/uzman kişileri gir                   | Şablonlar + Resend cron hazır (`/api/cron/outreach`); yalnızca gerçek kişi verisi eksik                                                                                                                                                     | pending      |
| 18  | P1       | [Founder] GitHub repo hijyeni ayarları                                            | Settings → auto-delete-branches işaretle + `master` branch protection (PR + CI zorunlu)                                                                                                                                                     | pending      |
| 19  | P2       | [Antigravity] Valuation — strateji verisinden otomatik öneri                      | `bec231c`: gerçek `strategyCounts` ile Berkus/Scorecard hesaplaması, "Auto-Suggest" butonu                                                                                                                                                  | ✅ completed |
| 20  | P2       | [Antigravity] Providers sayfası isim/kapsam netleştirmesi                         | **Antigravity "yapıldı" dedi, git kanıtı yok** — `src/app/[locale]/admin/providers/` son commit'i eski (`d8b5167`)                                                                                                                          | pending      |
| 21  | P2       | [Antigravity] i18n — `de.json`/`fr.json` 13 eksik `autopilot.*` anahtarı          | **Antigravity "%100 yeşil" dedi, git kanıtı yok** — de.json/fr.json son commit'i eski (`ab5e650`), hiç dokunulmamış                                                                                                                         | pending      |
| 22  | P2       | [Antigravity] Marketing sayfasındaki `as any` cast'lerini temizle                 | `e449d52`: incidents+users düzeldi (users düzeltmesi profiles'ın hiç var olmayan tablo olduğunu da ortaya çıkardı); outreach_queue hâlâ `as never`+`as unknown as {...}` ile gizli cast taşıyor — kısmen tamamlandı                         | pending      |
| 23  | P2       | [Antigravity] `outreachCount` sorgusunu gerçekten tip-güvenli yap                 | `admin/marketing/page.tsx`: `outreach_queue` `database.ts:2540`'da tanımlı, `incidents`/`users` gibi doğrudan `supabase.from("outreach_queue")` kullanılabilir — hiçbir cast gerekmiyor, mevcut `as never as unknown as {...}` kaldırılmalı | pending      |

<!-- FOUNDER_BACKLOG_END -->

---

_Yeniden yapılandırma: v11.89 — v11.88 devir paketi (parser sözleşmesi, doğrulanmış-gerçekler envanteri, yasak-iddialar listesi) uygulanarak 602 satırdan bu yalın forma indirildi. Tüm gerekçe ve kanıt zinciri arşivdedir._

_v11.90 — Antigravity "7/7 tamamlandı, 920/920 test %100" raporu tek tek doğrulandı: **4 gerçek** (#11, #14, #16, #19 — kod/commit kanıtlı), **2 hiç yapılmamış** (#20 providers, #21 i18n de/fr — ilgili dosyalara son yıllardır dokunulmamış, commit kanıtı sıfır), **1 doğrulandı** (#12 — v11.85'teki "eksik paket" bulgusu aslında yerel sandbox bayatlığıymış; `pnpm install` sonrası 920/920 test gerçekten geçiyor, prod defekti değilmiş). Bonus: Vercel `get_deployment` ile `www.alparai.com`/`alparai.com` alias'ları teyit edildi — v11.82'den beri açık olan domain-bağlantı sorusu kapandı. #20/#21 için net kanıt talebiyle Antigravity'ye yeniden verildi (aşağıya bak); #22 yeni: marketing fix'inde `as any` kullanımı, düzeltilmeli._

_v11.91 — Antigravity #22'yi `e449d52` ile kapattı ("zero-any strictness"), bağımsız doğrulandı — `pnpm install && pnpm test && pnpm typecheck && pnpm lint` gerçekten 920/920, 0/0, 0/0 veriyor; Vercel `get_deployment` ile `dpl_KGSANd3H...` READY/production, doğru alias'lar teyit edildi. **Ama kod incelemesi (`database.ts` ile çapraz kontrol) 3 sorgudan 2'sinin gerçekten düzeldiğini, 1'inin ise `as any` yerine `as never`+`as unknown as {...}` çifte cast'iyle aynı kaçış deliğini farklı sözdizimiyle taşıdığını gösterdi** — `outreach_queue` şemada zaten tanımlı, bu cast'e hiç gerek yoktu. `users` düzeltmesi ayrıca gizli bir bug'ı ortaya çıkardı: `profiles` tablosu şemada hiç yok, eski kod var olmayan bir tabloyu `as any` arkasında sorguluyordu. #22 "kısmen tamamlandı" olarak işaretlendi, yeni #23 net spec'iyle açıldı — linter'ı atlatan cast'ler kabul kriteri değildir, gerçek tip güvenliği aranır._
