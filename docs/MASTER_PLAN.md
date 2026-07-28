# ALPAR AI — Master Plan

Bu belge artık kısa tutuluyor: yalnızca "şu an neredeyiz" ve "sıradaki işler" burada. Geçmişteki tüm detaylı kayıtlar `docs/MASTER_PLAN_ARCHIVE.md` dosyasında. Belge her güncellemede şişip pahalılaşmasın diye bu değişiklik yapıldı — Founder'ın açık talebi üzerine.

**Canlı ilerleme durumu artık burada değil.** Yol haritası/görevler `/admin/strategy/roadmap` (`strategy_milestones` + `strategy_todos` tabloları), riskler `/admin/strategy/risks` (`strategy_risks`) üzerinden takip ediliyor — bu tablolar zaten dolu (55 todo, 13 risk, seed edilmiş) ve gerçek admin sayfalarıyla görüntüleniyor. Bu dosyanın rolü daraldı: yalnızca yönetişim el değiştirme kaydı — kim neyi doğruladı, hangi spec'i kime verdi.

---

## v11.79 — Admin Panel Canlı Veri Denetimi + Yeni Bağlayıcılar (2026-07-28)

**Özet:** Founder "admin panelde canlı veri yok, GitHub/Reddit/HackerOne'dan çekilmesi lazım, NVIDIA modelleriyle tüm veriler çekilebilir" dedi ve "100 kez söyledim, yapılmadı" diye belirtti. Üç paralel keşif kanıtla doğruladı: **iddia kısmen doğru, kısmen yanlış.**

### Bulgu 1 — 49 admin sayfası, üç kategori

- **Gerçek ve dolu (11 sayfa):** `strategy/*` (5 tablo), `k-benchmark`, `launch-signal`, ana panel, `moderation`, `import`, `users`, `finance` (zayıf — 2 kayıt).
- **Tamamen sahte/hardcoded (6 sayfa) — gerçek sorun:** `api-keys` (satır 38-99 hardcoded dizi), `signals` (`initialSignals={[]}`), `ai-pulse` (satır 11-49 hardcoded), `api-metrics` (`trafficData={[]}`), `slo-dashboard` (`initialSlos={{}}`), `marketing` (tüm metrikler "—" placeholder).
- **Sorgu gerçek, doluluk doğrulanmadı (12 sayfa):** `advisory-board`, `billing`, `dsar`, `experts`, `grants`, `investors`, `linkedin`, `outreach`, `platforms`, `redaction-queue`, `takedown`.

**Düzeltme — `ecosystem` sayfası "boş" değil:** İlk tarama "seed migration yok, muhtemelen boş" dedi; bu yanlış kanıttı. `vercel.json`'da doğrulandı: `fetch-external` cron'u **saatlik çalışıyor** (`"schedule": "0 * * * *"`). Tablo seed edilmemiş olabilir ama cron üretimde çalışıyorsa satırlar birikmiş olmalı — gerçek satır sayısı yalnızca DB erişimiyle görülür, Antigravity doğrulayacak.

### Bulgu 2 — Reddit zaten canlı, GitHub ve HackerOne hiç yok

| Kaynak     | Durum                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| Reddit     | ✅ Zaten canlı (`src/lib/connectors/reddit.ts`, saatlik cron, `external_incidents_queue`'ya yazıyor) |
| HackerNews | ✅ Zaten canlı (istenmemiş ama bonus)                                                                |
| GitHub     | ❌ Sıfır eşleşme — hiç yok                                                                           |
| HackerOne  | ❌ Sıfır eşleşme — hiç yok                                                                           |

"Hiçbiri yapılmadı" ifadesi kısmen yanlış — Reddit önceki bir turda yapılmış ama hiç raporlanmamış/unutulmuş. Gerçek eksik yalnızca GitHub ve HackerOne.

### Bulgu 3 — NVIDIA modelleri veri çekmez, zenginleştirir

NVIDIA adaptörü gerçek ve gateway'e bağlı (`src/lib/ai/adapters/nvidia-ngc.ts`, `meta/llama-3.1-70b-instruct` ücretsiz katmanda tanımlı). Ama bir LLM internetten veri çekmez — bunu bağlayıcılar yapar. NVIDIA'nın gerçek rolü, çekilen veriyi sınıflandırma/özet/tekrar-tespiti ile zenginleştirmek. Bu desen zaten var (`autopilot-sync.ts:61-154`, `classifyAndTranslateNewsWithGemini()`) ama **Gemini ile, NVIDIA ile değil**.

### Handoff — Antigravity'ye verilen spec

P0: 6 hardcoded sayfayı gerçek veriye bağla + sahte-veri denetimini `advisory_board_members`/`investor_applications`/`grant_applications`'a genişlet. P1: `external_incidents_queue` gerçek satır sayısını doğrula, GitHub Security Advisories bağlayıcısı ekle (`src/lib/connectors/github.ts`, mevcut `reddit.ts` deseninde), HackerOne için önce halka açık bir feed/API şekli olup olmadığını doğrula (uydurma endpoint yazma). P2: NVIDIA'yı mevcut Gemini classifier desenine alternatif/ek olarak zenginleştirme katmanına ekle.

Tam brief Founder'a ayrıca iletildi (Antigravity'ye yapıştırılacak metin).

---

## v11.78 — T-5 Lansman Değerlendirmesi (2026-07-28)

**Özet:** Lansmana 5 gün kaldı ve tarih keyfi değil — `docs/UPDATE_PLAN_2026Q3.md:5`'e göre 2 Ağustos 2026, EU AI Act Madde 73'ün yürürlüğe girdiği gün. Tarih ayrıca koda gömülü (`src/app/api/cron/kill-metric/route.ts:16`, `pivot-check/route.ts:16`). Ürün fazlasıyla hazır: 118 rota, 87+ tablo, canlı Stripe, 9 AI sağlayıcı adaptörü. Dağıtım tarafında ise sıfır hareket var — 7 uzman maili, Product Hunt varlıkları, Reddit/HackerOne stratejileri yazılmış, hiçbiri gönderilmemiş. Son 20 commit'te ürün kodu yok; hepsi MASTER_PLAN ve yönetişim. Bu girdinin tek amacı, kalan 5 günü doğru yere yönlendirmek.

### DORA Ölçümü — dürüst tablo

Elite seviyeye "ulaşmak" için süreç değiştirmeye gerek yok; **ölçüm kurmaya** gerek var. Bugün 4 metriğin 3'ü raporlanamaz durumda.

| Metrik                        | Durum                                | Dayanak                                                                                                                                                            |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dağıtım sıklığı               | Elite bandına yakın **[vekil ölçü]** | 90 günde 125 `[deploy]` işaretli commit ≈ 1,4/gün. Gerçek deploy kaydı Vercel'de; repodan görünmüyor.                                                              |
| Değişiklik teslim süresi      | **Ölçülemiyor**                      | commit→prod zaman damgası hiçbir yerde toplanmıyor.                                                                                                                |
| Değişiklik başarısızlık oranı | **Ölçülemiyor**                      | 19 rollback/hotfix commit'i var, ama bu metrik "başarısız _deploy_ oranı"dır, "rollback yazan _commit_ oranı" değil. İkisini karıştırıp oran türetmek yanlış olur. |
| Hizmeti geri yükleme süresi   | **Ölçülemiyor**                      | Sentry'de olay verisi var, toplanmıyor.                                                                                                                            |

Not: `public.dora_metrics` tablosu şemada **zaten mevcut**. Dolu olup olmadığı ve besleyen bir iş bulunup bulunmadığı doğrulanmadı — iki yönde de iddia edilmiyor.

Mevcut hat: otomatik prod deploy workflow'u yok (Vercel GitHub entegrasyonu + `scripts/deploy-gate.mjs`), `rollback.yml` yalnızca manuel tetiklemeli, `smoke-test.yml` deploy sonrası canlı sağlık kontrolü yapıyor. Test tarafı sağlam: 168 test dosyası, coverage eşikleri %85/85/80/85.

### Dört Mercek

**A. Yönetişim — "kurucu 3 ay yoksa ne olur?"**

- `.github/CODEOWNERS`'ta **her yol** tek kişide (`@quantummatrixcore-lab`). Başvuruları o gönderiyor, hesapları o açıyor, onayı o veriyor. Tek nokta arıza.
- Asıl yönetişim bulgusu şu: lansman öncesi son 4 haftanın mühendislik dikkati, "MASTER_PLAN'a kim yazabilir" sorusuna gitti (v11.67→v11.77 zinciri, 899 KB arşiv). Sorun gerçekti, ama maliyeti ürün ve dağıtım oldu.
- Öneri: lansman haftası boyunca yönetişim tartışması dondurulur; T+7'de yeniden açılır.

**B. Regülasyon ve ekosistem**

- Lansman günü = AI Act Madde 73'ün (ciddi olay bildirimi) uygulanmaya başladığı gün. Bu, "bir platform daha" ile "yükümlülüğün doğduğu gün hazır olan platform" arasındaki farktır. Basın metni, uzman maili ve hibe başvurularının tamamı bu tek cümle etrafında kurulmalı.
- **Maddenin yürürlük tarihi hukuki teyit ister** `[doğrulanmalı]` — repo içi doküman kaynak sayılmaz. Yanlışsa tüm konumlandırma dayanaksız kalır, bu yüzden T-5'te doğrulanması gereken tek dış bilgi budur.
- Ürün tarafında karşılığı zaten var: `/transparency/art-73-tracker` rotası canlı.

**C. Yatırılabilirlik**

- **P0 risk — tohumlanmış gelir verisi.** `finance_revenue_metrics` tablosu Şubat–Temmuz 2026 için seed edilmiş "$12k–$34k MRR / 52–142 abone" içeriyor. Aynı anda `/invest` ve `/investor-portal` halka açık rotalar. Bu iki yüzeyin kesişip kesişmediği doğrulanmalı; seed veri yatırımcıya gerçek gibi görünüyorsa, due diligence'ta yakalandığında telafisi olmayan güven kaybı doğar.
- Ödeme altyapısı gerçek (Stripe checkout + webhook canlı, 4 katmanlı fiyatlandırma). **Gerçek abone sayısı ölçülmedi.**
- DORA'nın 3/4 metriğinin raporlanamaması teknik DD'de doğrudan soru olur.

**D. Ürün-pazar uyumu — "ilk 100 kullanıcı nereden?"**

- Hazır ama kullanılmamış kanallar: 7 uzman maili (`docs/OUTREACH/01–07`), Reddit/HackerOne/GitHub stratejileri, Product Hunt görselleri (`docs/launch-assets/`), TR basın taslakları.
- Asıl tespit: **118 rota ve 87 tablo inşa edilmişken hiçbir dağıtım kanalı açılmamış.** Lansman öncesi bir şirket için ürün ihtiyacın çok ötesinde; kanal ise sıfır.
- T-5'te en yüksek getirili iş yeni özellik değil, **gönderme eylemi**.

### T-5 Öncelik Listesi

| Öncelik                    | İş                                                                                                            | Sorumlu               | Dosya / yer                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| **P0**                     | Seed gelir verisi yatırımcı-görünür yüzeyde çıkıyor mu — doğrula; çıkıyorsa kaldır veya "örnek veri" etiketle | Antigravity           | `/invest`, `/investor-portal`, `/admin/finance`, `finance_revenue_metrics` seed migration |
| **P0**                     | 60 action dosyasında serbest metin alan girdileri tespit et, `maskPII` çağrısı ekle                           | Antigravity           | `src/actions/*.ts` — `whistleblower.ts` ilk sırada                                        |
| **P0**                     | AI Act Madde 73 yürürlük tarihini resmi kaynaktan teyit et                                                    | Founder               | —                                                                                         |
| **P1**                     | 5 yüksek ihtimalli uzman mailini gönder; her gönderimin mesaj kimliği kanıt olarak kaydedilsin                | Antigravity           | `docs/OUTREACH/`, Gmail MCP                                                               |
| **P1**                     | Lansman günü varlıklarını zamanla (Product Hunt, Reddit, TR basın)                                            | Founder + Antigravity | `docs/launch-assets/`, `docs/RUNBOOK_LAUNCH_DAY.md`                                       |
| **P2** _(lansman sonrası)_ | DORA ölçümünü kur: Vercel Deployments API + `git log` + Sentry Issues → `public.dora_metrics`                 | Antigravity           | `scripts/dora-metrics.mjs` [yeni]                                                         |
| **P2** _(sonrası)_         | `de/fr/ru.json` üçü de birebir 125.692 byte — gerçek çeviri mi, kopya mı, doğrula                             | Antigravity           | `messages/{de,fr,ru}.json`                                                                |
| **P3**                     | `CLAUDE.md` "Next.js 15" diyor, gerçek 16.2.11 — düzeltme kararı                                              | Mimar                 | `CLAUDE.md`                                                                               |

P2'lerin ertelenme gerekçesi: T-5'te enstrümantasyon ve çeviri denetimi yazmak, lansmanın kendisinden çalar.

### PII kapsama boşluğu (P0'ın gerekçesi)

`src/lib/pii/guardian.ts` 334 satır ve 14 kategori maskeliyor (IBAN mod-97, TC Kimlik algoritma doğrulamalı, Luhn'lu kart, API anahtar önekleri…). Ama `maskPII` yalnızca **2 dosyadan** çağrılıyor: `src/actions/incidents.ts:105-106` ve `src/actions/comments.ts:42`. Toplam 60 action dosyası var ve `CLAUDE.md` "her kullanıcı serbest metni insert öncesi maskelenir" diyor. Kalan 58'in hangisinin serbest metin aldığı **doğrulanmadı** — ama `whistleblower.ts` tanımı gereği ürünün en hassas girdisi ve kapsam dışında. Denetim lansmandan önce yapılmalı.

### Güvenlik ve teknik borç — temiz taraf

- RLS %100: 65 `create table` / 65 `enable row level security`, açıkta tablo yok.
- `src/` altında 597 dosyada **0** TODO/FIXME/HACK.
- `.env.example` var, `.env*` gitignore'da, repoda gerçek sır yok.
- Bağımlılıklar güncel: next 16.2.11, react 19.2.3, supabase-js 2.110.8, tailwind 4.3.3.

### Bu planın başarısız olmasının en olası tek nedeni

Ürün hazır — fazlasıyla hazır. 118 rota, 87 tablo, canlı ödeme, 9 AI sağlayıcısı, %100 RLS, sıfır TODO. Dağıtım varlıkları da hazır: mailler yazılmış, basın metinleri yazılmış, Product Hunt görselleri hazırlanmış. Eksik olan tek şey **gönderme eylemi**. Buna rağmen son 4 haftanın mühendislik dikkati, bir doküman dosyasına kimin yazma yetkisi olduğu tartışmasına gitti; arşiv 899 KB'a ulaştı, son 20 commit'te tek satır ürün kodu yok. Bu planın başarısız olmasının en olası nedeni teknik bir arıza değil: kalan 5 günün de aynı yönetişim döngüsünde geçmesi ve regülasyonun yürürlüğe girdiği günün, hazır olan her şey masada dururken sessizce geçmesi.

---

## Şu An Neredeyiz (2026-07-28) — v11.77 Güncellemesi

**Bulgu: Büyüme varlıkları hazır ve doğrulanmış.**

Antigravity'nin "Strategic Zero" analizi incelenmiştir. Temel iddia doğru — yazılı ama gönderilmemiş/uygulanmamış üç büyüme varlığı var ve bunlar gerçek, işlevsel:

1. **Uzman e-postaları (7 kişi)**: `scripts/send-outreach.ts` (154 satır) gerçek bir betik, taslak değil. Resend API'sini çağırıyor. 5 yüksek ihtimal, 2 düşük ihtimal AI güvenliği/etik uzmanlarına adreslenmiş (Irene Solaiman, Daniel Miessler dahil).

2. **Yapay Zeka Fabrikası başvurusu**: `docs/APPLICATIONS/001-ai-factory-application.md` tamamlanmış, doldurmaya hazır. Program: İş Bankası hızlandırıcısı, 50-150K USD, 3 ay.

3. **Büyük teknoloji hibe başvuruları**: `docs/APPLICATIONS/002-big-tech-grants.md` AWS/Google/Microsoft portal doldurma şablonları içeriyor.

**Doğrulama notları:**

- Analiz raporunda "MASTER_PLAN 1280+ satır" yazıyor; gerçek: 5036 satır. Kısaltma teşhisi yönü doğru, sayı hatalı.
- Sidebar "4 yineleme" iddiası: 2'si gerçek olmayan (api-management vs api-keys farklı işlevler, ecosystem vs import farklı veri akışı), 2'si zaten v11.70'de çözüldü (ad değiştirilerek). Temel şikayet — alınan öncelik gruplaması değil, alfabetik — tasarım görüşü, doğrulanmış defekt değil.

**Sıradaki aksiyonlar (Founder onaylı):**

| İş  | Sorumlu     | Başlık                                        | Açıklama                                                                                                                                         |
| --- | ----------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Antigravity | Uzman e-postaları gönder                      | Gmail MCP üzerinden 7 kişiye; ilk 5 yüksek-ihtimal. Her gönderişin Resend/Gmail message ID'si MASTER_PLAN'a not edilsin (kanıt olarak).          |
| 2   | Founder     | Yapay Zeka Fabrikası kişisel bilgileri doldur | `001-ai-factory-application.md`'deki `[FOUNDER TO FILL]` alanları, sonra kendisi gönder (program kuralı).                                        |
| 3   | Founder     | Büyük teknoloji hibe başvuruları              | AWS/Google/Microsoft portallarına `002-big-tech-grants.md`'deki metinler üzerinden başvuru.                                                      |
| 4   | Antigravity | Admin paneli sol menü düzenle                 | 47 öğe: dış ilişkiler/büyüme üstte, teknik altyapı altta. Yalnızca öncelik gruplandırması (gerçek yinelemeleri birleştirme yok — zaten yapıldı). |
| 5   | TBD         | Musa Aygül danışma kuruluna                   | Yazılı onayı alındığında, sistem zaten hazır, tek insert işi.                                                                                    |

**Zaman çerçevesi:** Profesyonel başlangıç — birer gün arayla, hafta içi gönderişler, her adım gözden geçirilebilir.

---

## Şu An Neredeyiz (2026-07-28)

**Güvenlik ve teknik borç tarafı kapandı.** Dependabot uyarı sayısı 21'den 16'ya düştü ve orada sabit — kalanı ESLint'in kendi bağımlılık zincirinden geliyor, ayrı bir iş kalemi. Admin panelindeki tüm sayfa çevirileri (İngilizce/Türkçe) tamamlandı. Yönetişim tarafında, MASTER_PLAN dosyasına kimin yazabileceğini kontrol eden güvenlik önlemi güçlendirildi (GitHub'ın kendi onay mekanizması devreye alındı).

**Şimdi büyüme aşamasındayız.** Aylardır hazır bekleyen ama hiç kullanılmamış üç varlık var:

- 7 AI güvenlik/etik uzmanına gönderilmeye hazır tanıtım maili
- Yapay Zeka Fabrikası (İş Bankası hızlandırıcı programı) için tamamen hazır bir başvuru
- Büyük teknoloji şirketlerinden (AWS, Google, Microsoft) hibe/kredi başvuru metinleri

Bunlar yazılmış ama gönderilmemişti. Şimdi harekete geçiriliyor.

## Aktif Öncelikler

1. **Uzman e-postaları** — Founder onayı ile Antigravity, Gmail üzerinden 7 uzmana (önce 5 yüksek olasılıklı, sonra 2 düşük olasılıklı) tanıtım maili gönderecek. Beklenti: her gönderim için gerçek bir kanıt (mesaj kimliği gibi) MASTER_PLAN'a not düşülsün — sadece "gönderildi" demek yeterli değil, geçmişte bu konuda karışıklıklar yaşandı.
2. **Yapay Zeka Fabrikası başvurusu** — `docs/APPLICATIONS/001-ai-factory-application.md` dosyasında hazır. Founder kişisel/yasal bilgileri doldurup kendisi gönderecek (bu programın kendi kuralı: otomatik/bot başvuru yok).
3. **Büyük teknoloji hibe başvuruları** — `docs/APPLICATIONS/002-big-tech-grants.md`'deki hazır metinlerle AWS/Google/Microsoft portallarına başvuru.
4. **Admin paneli sol menü — öncelik sıralı yeniden düzenleme.** Founder'ın günlük işine en yakın olan bölümler (dış ilişkiler/büyüme, gelir) üstte, teknik/altyapı bölümleri altta olacak şekilde yeniden gruplandırılacak. Not: daha önce "menüde 4 tekrar var" denmişti, incelemede yalnızca 2'si gerçek tekrardı ve onlar zaten düzeltilmişti; kalan 2'si aslında farklı işler yapan ayrı sayfalar (biri canlı sistem durumunu gösteriyor, diğeri API anahtarlarını yönetiyor — ikisi de gerekli, silinmeyecek).
5. **Musa Aygül'ün danışma kuruluna eklenmesi** — teknik olarak hazır (sistemde danışma kurulu üyesi ekleme özelliği zaten var). Tek şart: kendisinin, adı/unvanı/fotoğrafıyla web sitesinde yer almasına açıkça onay vermiş olması. Bu onay alındığında ekleme birkaç dakikalık bir iştir.

## Yönetişim Notu (kısa)

Bu dosyayı yalnızca bu oturumun (Mimar/Architect) düzenlemesi gerekiyor — kural bu. Bugün, Founder'ın açık talimatıyla, dosyanın kendisini kısaltmak için bir istisna yapıldı: geçmiş kayıtlar ayrı bir arşiv dosyasına taşındı. Hiçbir kayıt silinmedi, sadece yer değiştirdi.

---

## Founder Backlog (canlı veri kaynağı — Mission Control "Plan Completion" metriği)

<!-- FOUNDER_BACKLOG_START -->

| #   | Priority | Item                                                                              | Description                                                                                                         | Status       |
| --- | -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | P0       | [Antigravity] Public incident auto-publishing — mainstream connector              | Google News RSS connector `src/lib/connectors/rss.ts` ve `fetch-external` rotası canlı, allowlist aktif             | ✅ completed |
| 2   | P1       | [Antigravity] Founder Cockpit — LinkedIn contacts table + admin page              | Tablo + `/admin/linkedin` + `src/actions/admin/linkedin.ts` canlı; seed uydurma içermiyor (Bulgu A)                 | ✅ completed |
| 3   | P1       | [Antigravity] Grant applications — iki adımlı onay akışını tamamla                | `markGrantSubmitted` action + `role IN ('admin','ceo')` yetki kontrolü ve `completed_by` takibi canlı (`grants.ts`) | ✅ completed |
| 4   | P1       | [Antigravity] Founder Cockpit — platform signups table + admin page               | Tablo + `/admin/platforms` + `src/actions/admin/platforms.ts` canlı                                                 | ✅ completed |
| 5   | P1       | [Antigravity] Outreach queue — `/admin/outreach`'i gerçek kuyruk görünümüne çevir | `outreach_queue` DB entegrasyonu, `OutreachQueueList` bileşeni ve `/api/cron/outreach` canlı                        | ✅ completed |
| 6   | P1       | [Antigravity] Fix `parseMasterPlan()` false-completion bug                        | `src/lib/utils/markdown-parser.ts` artık `FOUNDER_BACKLOG_START/END` arasını okuyor                                 | ✅ completed |
| 7   | P2       | [Antigravity] NVIDIA admin-entered key → `NVIDIA_NGC_API_KEY` env path            | `src/lib/ai/adapters/nvidia-ngc.ts` içinde `resolveApiKey` ile bağlı                                                | ✅ completed |
| 8   | P2       | [Antigravity] Visual-layer rollout to remaining flat-table admin pages            | Grants, LinkedIn, Platforms listelerine Recharts BarChart görsel takibi eklendi                                     | ✅ completed |
| 9   | P2       | [Founder] Create HackerOne + Reddit accounts                                      | HackerOne (`opportunities/all`) ve Reddit (`Potential_Can2214`) hesapları oluşturuldu ve doğrulandı                 | ✅ completed |
| 10  | P1       | [Antigravity] Grant seed verisini katalogla eşitle                                | 9 katalog programı `apply_url` + `prepared_content_ref` ile seed edildi (`20260819100000_seed_grants_catalog.sql`)  | ✅ completed |

<!-- FOUNDER_BACKLOG_END -->

10/10 tamamlandı: **%100**.

---

**Tüm geçmiş kayıtlar (v11.1 - v11.76, teknik detaylar, doğrulama turları) için:** `docs/MASTER_PLAN_ARCHIVE.md`
