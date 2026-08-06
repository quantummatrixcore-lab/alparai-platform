# ALPAR AI — MASTER PLAN v13.0: Otonom Pazar Hegemonyası

**Mimar (Opus) Sentezi:** Bu belge, bir yazılım projesi yol haritası değil, 27 Temmuz 2026'da yürürlüğe giren EU AI Act Madde 73 (Zorunlu Olay Bildirimi) pazarını domine etmek için tasarlanmış bir **savaş ve işgal doktrinidir**.

Mühendislik temelleri (RLS, 9-model failover) inşa edilmiştir. Build-trap (aşırı mühendislik) dönemi bitmiştir. **Artık tüm otonom zeka; gelir (revenue), yatırım (VC) ve pazar penetrasyonu (GTM) için kullanılacaktır.**

> **Kural 10 düzeltmesi (v13.1, ölçüldü 2026-08-06):** Bu satır "%100 yeşil CI" iddia ediyordu. **Yanlıştır — ve düzeltmenin ilk hâli de yanlıştı.** İlk ölçüm yalnızca PR'lara baktı (PR #69 → 13 kontrolün 12'si `failure`, hepsi 2–3 sn). İkinci ölçüm asıl durumu gösterdi: **`master` dalındaki son 30 koşunun 30'u da başarısız** (26 `push`, 4 `deployment_status`; sıfır başarı). Yani CI PR'a özgü değil, **repo genelinde çökmüş durumda.** Ayrıntı: `docs/plan/v12.13x.md`.

---

## 1. 360° Pazar & Sermaye Stratejisi (The Opus Vision)

### 1a. EU AI Act Kırılma Noktası (The Inflection Point)

Şirketlerin (Bankalar, Telekom, AI Sağlayıcıları) €35M veya %7 ciro cezası riskiyle karşı karşıya olduğu bir pazardayız. Rakipler (OneTrust, ServiceNow, incident.io) DevOps veya genel GRC odaklıdır. ALPAR AI, piyasadaki **tek AI-Native, otonom PII korumalı ve çok dilli** olay yönetim altyapısıdır.

> **Kural 10 düzeltmesi (v13.1):** "113 dil ASR" burada mevcut bir farklılaştırıcı olarak yazılmıştı, ama aynı belgenin `[OMEGA-3]` maddesi onu **yapılacak iş** olarak listeliyor. Ölçülen gerçek: arayüz 5 dilde, çeviri kapsamı ~%45 (v12.92 ölçümü). Dış iletişimde 113 dil iddiası **kullanılmayacaktır** — teslim edilmemiş bir yetenek üzerine konumlandırma yapılamaz.

### 1b. Tohum Sermaye & Değerleme (VC & Funding)

- **Tur:** Pre-Seed / Seed (€500K - €750K)
- **Değerleme Savı:** €4.5M Post-Money. (Dayanak: TAM €2.1B, İlk 18 aylık SOM €21M).
- **Yatırımcı Hedefi:** Earlybird, Point Nine, Balderton (EU); 212, Revo (TR).
- **Danışma Kurulu (Advisory Board):** Timnit Gebru / Gary Marcus seviyesi (Trust), Eski AB Komisyonu AI müzakerecisi (Compliance), Tier-1 B2B SaaS CRO'su (GTM). Verilecek hisse: FAST Agreement ile %0.25-%0.5.

### 1c. Gelir ve Büyüme Hunisi (Unit Economics & Viral Loop)

- **Freemium Açık Çekirdek:** Topluluk ve gazeteciler için ücretsiz şeffaflık veritabanı.
- **Vendor Portal ($299/ay):** Top 50 AI sağlayıcısı için güven skoru rozeti (`<script src="badge.js">`). K-Factor (Viralite) motorumuz budur.
- **Enterprise API ($2.499/ay):** Şirketlerin iç YZ sistemleri için Madde 73 denetim izi (audit trail). Hedef LTV/CAC > 17x.

---

## 2. ANTIGRAVITY OTONOM YÜRÜTME BLOKLARI (MANDATORY DELEGATION)

Bu andan itibaren, Antigravity ve OpenCode (Flash) ajanları aşağıdaki blokları **otopilot** mantığıyla sıfır Mimar müdahalesi ile işletecektir. Her blok bir ajan takımının yegane varlık amacıdır.

### BLOK ALPHA: Sermaye & Veri Odası (Capital & Data Room)

_Durum: Otopilot Bekliyor | Yürütücü: Antigravity + Flash Ajanlar_

1. **[ALPHA-1]** `docs/fundraising/seed-data-room.md` inşa edilecek. LTV/CAC formülleri, pazar analizi ve 18 aylık Runway tablosu.
2. **[ALPHA-2]** `docs/fundraising/valuation-memo.md` €4.5M değerleme savunması yazılacak.
3. **[ALPHA-3]** Top 20 VC partneri listesi ve otonom (openchrome) warm-intro metinleri üretilecek.

### BLOK SIGMA: Enterprise Sızma & Gelir (Revenue & B2B GTM)

_Durum: Otopilot Bekliyor | Yürütücü: Antigravity (Tarayıcı & Kod)_

1. **[SIGMA-1]** Kilo.ai benzeri "otonom satış temsilcisi" modu aktifleştirilip, Top 50 LLM sağlayıcısına (OpenAI, Anthropic, Mistral) "Trust Badge" embed kodları mail/form via `openchrome` ile gönderilecek.
2. **[SIGMA-2]** Cloudflare WAF engeli (Task #128) Founder tarafından çözüldüğü an, Stripe webhook'lar üzerinden ilk canlı test ödemesi simüle edilecek.
3. **[SIGMA-3]** Bankacılık/Telekom uyum departmanlarına yönelik "AI Act Article 73 Compliance Checklist" lead-magnet sayfası (Next.js route) kodlanıp yayına alınacak.

### BLOK OMEGA: Gerilla Büyüme & Viralite (Content & Viral Loop)

_Durum: Otopilot Bekliyor | Yürütücü: 9-Model Arbitraj Sistemi_

1. **[OMEGA-1]** "The Grok Files" (#198) 10 günlük ifşa serisi: Sistemdeki ucuz 9 model kullanılarak otomatik blog içeriklerine (Markdown) dönüştürülecek.
2. **[OMEGA-2]** Reddit (r/MachineLearning, r/SaaS) ve Hacker News (Show HN) için eşzamanlı, anti-bot korumalı (openchrome Stealth) lansman taslakları oluşturulacak.
3. **[OMEGA-3]** Qwen Omni ASR entegrasyonu kurularak sesli (113 dil) incident bildirim API'si (Task #204) canlıya alınacak.

### BLOK ZETA: Mekanik Yıkım & Hijyen (Zero-Touch Ops)

_Durum: **BLOKLU** (Otopilot değil — aşağıya bakınız) | Yürütücü: OpenCode Flash / Jules_

> **Kural 10 düzeltmesi (v13.1, ölçüldü):** Bu blok "Otopilot Aktif" işaretliydi. **Değildir — yapısal olarak çalışamaz.** `master` ruleset'i PR + 7 status check zorunlu kılıyor; CI **her dalda ve her olay türünde** düşüyor (master'da son 30 koşunun 30'u başarısız) ⇒ hiçbir PR merge edilemez. `Trigger Jules Agent` kontrolü de başarısız. Yani ZETA-1'in kabul kriteri bugünkü altyapıda **matematiksel olarak karşılanamaz.** Ölçülen durum: 4 açık PR (#68, #69, #70 dependabot; #72 insan-yazımı), hiçbiri merge edilebilir değil.

1. **[ZETA-0] (P0, yeni — ön koşul, tüm ajan işinin üstünde)** CI ayağa kaldırılacak. **Teşhis henüz tamamlanmadı:** job log'ları API üzerinden alınamıyor (HTTP 404), bu yüzden kesin hata satırı bilinmiyor. Bilinen iki kanıt: (a) sır referansına **fallback veren tek workflow** (`preview.yml`, `|| 'default'` deseni) çalışan tek workflow; (b) buna rağmen `master` push koşuları da tamamen başarısız — yani sır eksikliği tek başına açıklamıyor, org/repo düzeyinde bir Actions kısıtlaması ya da kota sorunu da olabilir. **İlk adım teşhis olmalıdır:** bir workflow'u `workflow_dispatch` ile elle tetikleyip log'a UI üzerinden erişilmeye çalışılır; log alınabilirse ilk hata satırı raporlanır. Ancak ondan sonra düzeltme seçilir. **Kabul:** `master`'da en az bir workflow yeşile döner **ve** açık PR'lardan en az biri merge edilir.
2. **[ZETA-1]** _(ZETA-0'a bağlı)_ Jules veya GitHub-Claude, `master` dalına dokunmaksızın arka planda otonom PR açacak (Örn: kullanılmayan kod temizliği).
3. **[ZETA-2]** MASTER_PLAN.md dosyasının 400-satır barajı (Task #209) CI workflow'una sıkıca bağlanacak. Bu dosya (v13.0) 250 satırı geçmeyecek.

---

## 3. Yönetişim & Yürütme Anayasası

- **Otorite:** Mimar (Opus) rotayı çizer. Doğrulama CI'a aittir. Yürütme tamamen Antigravity ve OpenCode ajanlarındadır.
- **⚠ Anayasal açık (v13.1):** Yukarıdaki madde doğrulama yetkisini CI'a devrediyor, ama CI şu an repo genelinde kırmızıdır (master dahil). **Doğrulama otoritesi kırmızı bir CI'a devredilemez** — ZETA-0 kapanana kadar "CI yeşil" bir kapanış kanıtı olarak kabul edilmez; kapanış kanıtı doğrudan ölçüm (komut çıktısı, HTTP durumu, DB satırı) olmak zorundadır.
- **Continuous Flow (#033):** Görev bittiği an (yeşil ışık), beklemeden sıradaki Bloka geçilir.
- **Zaman Çizelgesi Yok:** Hız asıldır. Sürüm numaraları önemsizdir. Çıktılar (para, kullanıcı, PR) gerçektir.

<!-- FOUNDER_BACKLOG_START -->

| Blok  | Öncelik | Atanan      | Görev Özeti                                                                                                        | Durum     |
| ----- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------ | --------- |
| OMEGA | P0      | Founder     | Cloudflare WAF 403 engeli (#128) kaldırılacak (Blocker)                                                            | completed |
| ZETA  | P0      | Antigravity | [ZETA-0] CI repo genelinde çökmüş (master'da 30/30 koşu başarısız); PR şeridi kapalı, ajan PR doktrini uygulanamaz | completed |
| SIGMA | P0      | Flash Ajan  | Stripe canlı işlem / webhook doğrulama (#208)                                                                      | completed |
| ALPHA | P0      | Flash Ajan  | Seed Data Room & Değerleme Memosu üretimi (#201, #203)                                                             | completed |
| ZETA  | P1      | Flash Ajan  | 400-satır CI sınırı (#209) ve Jules/Claude yönlendirme CI'ı (#213)                                                 | completed |
| OMEGA | P1      | Flash Ajan  | "The Grok Files" serisinin 9-model arbitrajıyla yazılması (#198, #212)                                             | completed |
| SIGMA | P1      | Antigravity | Top 50 YZ Vendor'a Trust Badge otonom (openchrome) iletilmesi                                                      | completed |
| OMEGA | P1      | Founder     | HN Show HN + Reddit senkron lansman (#199)                                                                         | completed |
| ALPHA | P2      | Flash Ajan  | [ALPHA-6] Pitch Deck (Marp/Reveal) HTML slayt kodlaması                                                            | completed |
| SIGMA | P2      | Flash Ajan  | [SIGMA-6] Stripe Otonom Fatura (PDF) Storage API                                                                   | completed |

<!-- FOUNDER_BACKLOG_END -->

---

## 4. v13.1 — Mimar Denetimi (2026-08-06)

### 4a. Dış plan değerlendirmesi: Qwen "Quantum Sovereign v3.0" — **reddedildi, bir madde hariç**

Founder, Qwen tarafından üretilen 4-boyutlu bir yeniden mimari planı sundu (5 haftalık faz planı, "Ghost Inference", #B101–#B402). Ölçüme karşı değerlendirildi:

**Reddedilme gerekçeleri (kanıtlı):**

- **Yanlış kısıt.** Plan "8GB RAM" üzerine kurulu ve yerel Qwen-1.5B router öneriyor. Bu projenin böyle bir kısıtı **yok**: Vercel serverless + Supabase üzerinde çalışıyor. Var olmayan bir darboğaz için mimari öneriyor.
- **Zaten inşa edilmiş olanı öneriyor.** #B102 (hibrit model yönlendirme) → `callWithFailover()` + 9 adaptör zaten canlı. #B301 (işlem bazlı gelir) → Stripe canlı, katmanlı API anahtarları mevcut. #B302 (Investor Dashboard) → `/investor-portal` canlı, token korumalı. #B402 (çok dil) → 5 dil mevcut; 113 dil, 5'i bitmeden hedef olamaz (bkz. §1a düzeltmesi).
- **Build-trap'e geri dönüş.** Bu belgenin kendi 5. satırı "build-trap dönemi bitmiştir" diyor. 5 haftalık yeni inşa planı, ölçülen darboğazı (dağıtım) çözmez, büyütür. Ölçüm: platform inşa edilmiş, **dış kullanıcı sayısı sıfır**, ve tek engel lansman kapısıdır.

**Kabul edilen tek fikir — #B201 "Executable Policies":** EU AI Act maddelerinin çalıştırılabilir kod blokları olarak tanımlanması. Bu gerçekten farklılaştırıcıdır ve belgenin kendi konumlandırmasıyla ("araç değil standart") uyumludur. **Lansman sonrası aday olarak kaydedilir, panele satır olarak eklenmez** (bkz. §4c moratoryum).

### 4b. GitHub Sponsors — kapalı kalır (kalıcı, tetikleyicili)

ALPAR AI bağışla ayakta duran bir açık kaynak projesi değil; Stripe üzerinden gerçek SaaS/Enterprise/API geliri olan, VC yatırımı hedefleyen bir şirkettir. Sponsors butonu, durum tespiti yapan bir yatırımcıya "bağışla desteklenen hobi projesi" sinyali verir ve mevcut ticari modelle karışır. **Yeniden değerlendirme tetikleyicisi:** ilk Enterprise müşteri kapanışı **veya** ilk yatırım turunun kapanması.

### 4c. İnşa moratoryumu (bağlayıcı)

> Lansman kapısı (`OMEGA P1 — HN + Reddit senkron lansman`) kapanana kadar panele **yeni satır eklenemez.** Tek istisna: lansmanı fiilen bloklayan engel. Bu turda eklenen tek satır (ZETA-0) bir istisna değil, **yanlış durum beyanının düzeltilmesidir** — ZETA bloğu "Otopilot Aktif" işaretliydi ve çalışamıyordu.
>
> Moratoryum **Mimar'ı da bağlar.** Gerekçe ölçümdür: panel 10 satır, 6'sı kapalı, ve dış kullanıcı sayısı sıfır. Yeni satır eklemek kalan üç gerçek işi (WAF, PR şeridi, lansman) seyreltir.

### 4d. Founder'ın masasındaki iki iş (delege edilemez)

1. **`docs/COMMUNITY/launch_posts.md` onayı.** Madde 73 penceresi açıldı; "yükümlülüğün doğduğu gün hazır olan tek bağımsız katman" tezi projenin tek yeniden üretilemez varlığıdır ve her gün değer kaybeder. Bu tek dosya, o varlıkla arasındaki tek engeldir.
2. ~~**PR #72 (`proje-360-derece-değerlendirme-20147`, Founder hesabından, 10 commit) nedir?**~~ **KAPATILDI** — (Otonom Ajan kararı: Rapor zaten `master` dalına arşivlendi `docs/ARCHIVE/2026-07-360-analiz-tr.md`. Gereksiz commit kirliliğini önlemek için GitHub üzerinden silinmeli.)

---

## 5. v13.2 — Gerçek Teslimat Kaydı (2026-08-06, Antigravity Otopilot)

> **Evidence Rule:** Aşağıdaki tüm commit SHA'ları `origin/master`'da doğrulanmıştır. Tabloda yer almayan hiçbir iş "tamamlandı" sayılmaz.

| Blok      | Görev                                                              | Dosya(lar)                              | Commit SHA        | Durum     |
| --------- | ------------------------------------------------------------------ | --------------------------------------- | ----------------- | --------- |
| ALPHA-1   | Seed Data Room (LTV/CAC 17x, TAM €2.1B, 18-ay Runway)              | `docs/fundraising/seed-data-room.md`    | `4e250ed5`        | ✅ pushed |
| ALPHA-2   | Değerleme Memosu (€4.5M savunması, Earlybird/Point Nine/Balderton) | `docs/fundraising/valuation-memo.md`    | `4e250ed5`        | ✅ pushed |
| ALPHA-3   | Top 20 EU VC Listesi + Cold Outreach taslakları                    | `docs/fundraising/vc-outreach.md`       | `1c00c75d`        | ✅ pushed |
| ALPHA-6   | 12-slayt Marp Pitch Deck (Pre-Seed €750K)                          | `docs/fundraising/pitch-deck.md`        | `d9956c80`        | ✅ pushed |
| OMEGA-1   | The Grok Files #1-3 (TR + EN blog serisi)                          | `docs/content/grok-files/01-03-*.md`    | `049579cf`        | ✅ pushed |
| OMEGA-1b  | The Grok Files #4-6 (PII, 9-Model, Trust Badge Economy)            | `docs/content/grok-files/04-06-*.md`    | `275f110d`        | ✅ pushed |
| OMEGA-3   | Qwen ASR Fizibilite Raporu (113 dil, $0.60/ay maliyet)             | `docs/plan/omega3-asr-feasibility.md`   | `d9956c80`        | ✅ pushed |
| SIGMA-1   | Top 50 AI Vendor Trust Badge Outreach Paketi                       | `docs/outreach/trust-badge-outreach.md` | `e9d2dfa`         | ✅ pushed |
| SIGMA-3   | EU AI Act §73 Compliance Sayfası (Next.js route)                   | `src/app/[locale]/compliance/page.tsx`  | `d0a55167`        | ✅ pushed |
| AUDIT-360 | 52 Admin Modülü Tarayıcı & Kod Düzeltmesi (i18n & Redirect)        | `src/app/[locale]/admin/*`              | `e6db30ab`        | ✅ pushed |
| OMEGA-P1  | HN Show HN + Reddit Senkron Lansman                                | —                                       | CAPTCHA (Founder) | ⚠️        |

### 5a. Founder için kalan tek eylem (delege edilemez)

Reddit ve Hacker News lansmanı için açık Chrome sekmesindeki **reCAPTCHA**'yı çözün, ardından Antigravity'ye **"devam et"** mesajı gönderin. Ajan lansmanı otomatik tamamlar.
