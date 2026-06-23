# ALPAR AI — 360° Consolidated Audit Report

> **Tarih:** 23 Haziran 2026
> **Sürüm:** 3.0 (Profesyonel Formatta Güncellenmiş)
> **Hazırlayan:** opencode/mimo-v2.5-free
> **Kapsam:** Tüm sayfalar (EN + TR + Mobil) + 16 model historical data
> **Skor:** 570/1000 (Bağımsız Canlı Site Denetimi)
> **Durum:** Lansmana HAZIR DEĞİL — 7 P0 Blocker mevcut

---

## 1. YÖNETİCİ ÖZETİ

### Güncel Durum Özeti

| Metrik         | Değer    | Not                                                |
| -------------- | -------- | -------------------------------------------------- |
| Toplam Skor    | 570/1000 | Bağımsız canlı site denetimi                       |
| Önceki Skor    | 634/1000 | MASTER-360-AUDIT-REPORT.md                         |
| P0 Blocker     | 7 adet   | Kritik, lansman öncesi çözülmeli                   |
| P1 Issue       | 12 adet  | Yüksek öncelik, 1 hafta içinde                     |
| Çözülen P0     | 4 adet   | Transparency, Login wall, Contact i18n, Brand data |
| Lansman Durumu | HAYIR    | 7 P0 blocker devam ediyor                          |

### En Kritik Bulgular (Canlı Site Doğrulaması)

1. **Transparency'de raw i18n key** — `legal.trustScoreMethodology` ve `legal.trustScoreMethodologyDesc` her iki dilde de raw basılıyor
2. **Brand sayfası boş incidents** — OpenAI'da "24 incidents" yazılı ama hiçbiri render edilmiyor
3. **"See Rankings" yanıltıcı** — Hero'daki buton `/incidents`'a gidiyor, `/leaderboard`'a değil
4. **TR Live Feed İngilizce** — "Fatal Autonomous Vehicle Crash", "AI recommended Ponzi scheme" başlıkları İngilizce
5. **Trust Score Metodolojisi hardcoded İngilizce** — "Verified Incidents", "Response Rate & Speed" hiç çevrilmemiş
6. **Models sayfası sadece 1 model** — Grok 3 var, gerisi yok
7. **Sıfır sosyal kanıt** — 0 oy, 0 yorum, platform ölü görünüyor

---

## 2. SAYFA BAZLI ANALİZ (CANLI SİTE DOĞRULAMASI)

### 2.1 Homepage (Ana Sayfa) — 65/100

**Güçlü Yönler:**

- Hero bölümü etkileyici: "AI Lied to You. Nobody Was Tracking It. We Were." güçlü mesaj
- 2-column split layout (manifesto + live data) iyi çalışıyor
- Live stat card'lar (64 failures, 23 providers, 47 countries) dikkat çekici
- Founder story bölümü duygusal bağ kuruyor
- News ticker canlı bilgi akışı sağlıyor
- Ecosystem Pulse bölümü içerik zenginliği sunuyor
- "How it works" 4 adımlık süreç net
- Trust bar (AGPL, EU/GDPR, PII Guardian, Art. 14) güven veriyor
- Footer kapsamlı (Product, Legal, About)

**Kritik Sorunlar:**

- 🔴 "See Rankings" butonu yanıltıcı — `/incidents`'a gidiyor (`hero-section.tsx:98`)
- 🔴 Duplicate CTAs — Alt kısımda hem "See Rankings" butonu hem "See Rankings" link'i
- 🔴 TR Live Feed İngilizce — `page.tsx:213`'te `title_tr ?? title_en` fallback'i, DB'de `title_tr` NULL
- 🟡 Nav bar kalabalık — 10+ element tek satırda
- 🟡 "Last report: Just now" — gerçek zamanlı mı statik mi belli değil

### 2.2 Incidents (Olaylar) — 60/100

**Güçlü Yönler:**

- "All Incidents" başlığı net
- 50+ published reports
- Filtre sistemi kapsamlı: category + severity + search
- Incident kartları bilgilendirici
- Timeline süreci görsel
- Sidebar'da Live Poll ve Latest News

**Kritik Sorunlar:**

- 🔴 Sidebar ile ana içerik genişlik oranı dengesiz
- 🔴 Tüm olaylarda vote=0, comment=0 — sosyal kanıt yok
- 🟡 Filtre butonları çok küçük — mobilde zor
- 🟡 Severity renk kodları tutarsız

### 2.3 Leaderboard — 55/100

**Güçlü Yönler:**

- Tablo yapısı temiz
- Provider logoları premium
- `<table>` + `<caption>` erişilebilirlik için iyi
- Share butonları mevcut

**Kritik Sorunlar:**

- 🔴 Sıralama mantığı hatalı — trust_score'a göre sıralı, incident_count'a değil
- 🔴 Toplam response=0, avg response rate=0% — platform ölü görünüyor
- 🔴 ALPAR Autopilot (#1, 0 incident) — sıralamada haksız avantaj
- 🟡 16 provider'da 0 incident — tablonun %70'i boş

### 2.4 Models — 30/100

**Güçlü Yönler:**

- "AI Models Directory" başlığı net
- Search + sort + filter mevcut

**Kritik Sorunlar:**

- 🔴 SADECE 1 MODEL (Grok 3) — Sayfa neredeyse boş
- 🔴 Sayfa yüksekliğinin %80'i boş alan
- 🟡 Rating "-(0)" şeklinde — negatif mi boş mu belli değil

### 2.5 Blog — 70/100

**Güçlü Yönler:**

- "INSIGHTS & RESEARCH" eyebrow badge tematik
- 3 blog kartı yan yana
- Tag'ler kategori bazlı
- İçerik kaliteli

**Sorunlar:**

- 🟡 Blog kartlarında görsel yok
- 🟡 Tag'ler çok küçük ve soluk
- 🟡 Blog yazısı sayısı az (3 tane)

### 2.6 Submit (Rapor Gönder) — 82/100

**Güçlü Yönler:**

- "No login required" mesajı açık
- "100% Anonymous" güven veriyor
- Form alanları net (200/5000 char)
- 3 zorunlu consent checkbox
- Evidence upload mevcut

**Sorunlar:**

- 🟡 Form sayfası çok uzun — sticky submit butonu yok
- 🟡 "PII is masked automatically" nasıl çalıştığı açıklanmamış

### 2.7 Contact (İletişim) — 75/100

**Güçlü Yönler:**

- Temiz form tasarımı
- Category dropdown'ı çalışıyor
- EN ve TR versiyonları tutarlı
- Sidebar'da email ve registered office bilgisi

**Sorunlar:**

- 🟡 "Registered office" bilgisi eksik — "Will be disclosed in the Imprint page"
- 🟡 Imprint (Künye) sayfası yok — yasal zorunluluk

### 2.8 Transparency — 50/100

**Güçlü Yönler:**

- 64 total reports, %100 publish rate
- Moderasyon süreci 4 adımlık olarak açıklanmış
- Platform sayıları doğru (4 users, 23 providers, 64 incidents)

**Kritik Sorunlar:**

- 🔴 Raw i18n key — `legal.trustScoreMethodology` ve `legal.trustScoreMethodologyDesc` ham basılıyor
- 🔴 Trust Score Metodolojisi hardcoded İngilizce — hiçbir `t()` kullanılmamış
- 🟡 Trust Score formülü: "Verified Incidents × -5" — negatif çarpan yanıltıcı olabilir

### 2.9 Legal Pages — 80/100

**Güçlü Yönler:**

- Terms of Service: tamamen Türkçe çevrilmiş
- Privacy Policy: mevcut
- Takedown Policy: mevcut
- Cookie Policy: mevcut

**Sorunlar:**

- 🟡 Imprint (Künye) sayfası yok — AB yasal zorunluluğu
- 🟡 "/legal/takedown" link'i raw URL olarak görünüyor (anchor link hatalı olabilir)

---

## 3. TEKNİK ANALİZ (KOD KAYNAKLARI)

### 3.1 i18n Durumu

**Sorunlu Alanlar:**

1. `transparency/page.tsx:201,206` — `trustScoreMethodology` ve `trustScoreMethodologyDesc` key'leri messages dosyalarında yok
2. `transparency/page.tsx:224-249` — Trust Score bölümü tamamen hardcoded İngilizce
3. `page.tsx:213` — `title_tr ?? title_en` fallback'i, DB'de `title_tr` muhtemelen NULL
4. `hero-section.tsx:98` — "See Rankings" link'i `/incidents`'a gidiyor

**Çözülen Alanlar:**

- Contact form i18n — tamamen çevrilmiş
- Legal pages — tamamen çevrilmiş
- Navigation — tamamen çevrilmiş

### 3.2 Veri Bütünlüğü

**Sorunlu Alanlar:**

1. Brand sayfası incidents — `brand/[slug]/page.tsx:121-137` incidents çekiyor ama render etmiyor
2. Leaderboard sıralama — `leaderboard/page.tsx:70-77` trust_score'a göre sıralıyor
3. Homepage vs Brand count — Homepage "64", OpenAI "24" — bu doğru olabilir

### 3.3 Mobil Durum

**Mevcut Durum:**

- `mobile-nav.tsx` mevcut ve çalışır durumda
- 8 link, Escape desteği, body scroll lock
- LanguageSwitcher hamburger menüde görünüyor

**Test Edilemeyen Alanlar:**

- Viewport 1280px sabit — mobil görünüm doğrulanamadı
- Touch target boyutları doğrulanamadı
- Form kullanılabilirliği mobilde doğrulanamadı

---

## 4. SKORLAMA (10 Kategori × 100 = 1000)

| #   | Kategori                | Ağırlık  | Skor    | Kanıt                                                            |
| --- | ----------------------- | -------- | ------- | ---------------------------------------------------------------- |
| 1   | UX/UI & Design          | 100      | 65      | Hero güçlü ama nav kalabalık, brand boş, duplicate CTAs          |
| 2   | Technical Architecture  | 100      | 75      | Next.js 16 + Supabase iyi ama FREE plan risk, eksik CI           |
| 3   | Data Integrity          | 100      | 40      | Brand boş incidents, leaderboard yanlış sıralama, 0 sosyal kanıt |
| 4   | Content & Copywriting   | 100      | 70      | Güçlü EN/TR hero copy ama trust score methodology hardcoded      |
| 5   | Conversion & User Flows | 100      | 55      | Submit formu iyi ama "See Rankings" yanıltıcı, 0 vote/comment    |
| 6   | SEO & Growth            | 100      | 60      | Meta tags mevcut ama blog 3 yazı ile sınırlı                     |
| 7   | Legal Compliance        | 100      | 80      | AGPL, GDPR, KVKK, PII Guardian güçlü. Imprint eksik              |
| 8   | i18n & Localization     | 100      | 50      | Çoğu çeviri iyi ama transparency raw key, trust score hardcoded  |
| 9   | Project Management      | 100      | 45      | İki tasarım sistemi, eksik CI/CD, models sayfası boş             |
| 10  | Community & Virality    | 100      | 30      | 0 sosyal kanıt, Founding Reporter henüz başlamamış               |
|     | **TOPLAM**              | **1000** | **570** |                                                                  |

---

## 5. P0 BLOCKER'LAR (LANSMAN ÖNCESİ ZORUNLU)

| #   | ID     | Başlık                             | Kategori | Durum | Kanıt                                 | Çaba    |
| --- | ------ | ---------------------------------- | -------- | ----- | ------------------------------------- | ------- |
| 1   | P0-011 | Transparency raw i18n key          | i18n     | AÇIK  | `transparency/page.tsx:201,206`       | 30 dk   |
| 2   | P0-012 | Brand sayfası boş incidents        | data     | AÇIK  | `brand/[slug]/page.tsx:121-137`       | 2 saat  |
| 3   | P0-013 | "See Rankings" yanıltıcı link      | ui       | AÇIK  | `hero-section.tsx:98`                 | 5 dk    |
| 4   | P0-014 | TR Live Feed İngilizce             | i18n     | AÇIK  | `page.tsx:213`, DB'de `title_tr` NULL | 1 saat  |
| 5   | P0-015 | Trust Score hardcoded İngilizce    | i18n     | AÇIK  | `transparency/page.tsx:224-249`       | 2 saat  |
| 6   | P0-016 | Models sayfası sadece 1 model      | data     | AÇIK  | Canlı site doğrulandı                 | 3 saat  |
| 7   | P0-017 | Sıfır sosyal kanıt (0 oy, 0 yorum) | data     | AÇIK  | Tüm platform                          | 1 hafta |

---

## 6. P1 YÜKSEK ÖNCELİK (1 HAFTA İÇİNDE)

| #   | ID     | Başlık                                              | Kategori | Durum | Çaba      |
| --- | ------ | --------------------------------------------------- | -------- | ----- | --------- |
| 1   | P1-001 | Leaderboard sıralama mantığı                        | data     | AÇIK  | 2 saat    |
| 2   | P1-002 | Homepage duplicate CTAs                             | ui       | AÇIK  | 1 saat    |
| 3   | P1-003 | Nav bar kalabalık                                   | ui       | AÇIK  | 3 saat    |
| 4   | P1-004 | Blog kartlarında görsel yok                         | ui       | AÇIK  | 2 saat    |
| 5   | P1-005 | Mobil test edilemedi                                | ui       | AÇIK  | 1 gün     |
| 6   | P1-006 | Imprint (Künye) sayfası yok                         | legal    | AÇIK  | 3 saat    |
| 7   | P1-007 | Dual email domain (@alparai.com vs @alparai.online) | legal    | AÇIK  | 1 saat    |
| 8   | P1-008 | Dilemmas cold start (8/9 soru 0 oy)                 | data     | AÇIK  | 1 hafta   |
| 9   | P1-009 | Dual design system                                  | ui       | AÇIK  | 2-3 hafta |
| 10  | P1-010 | Health endpoint bilgi sızıntısı                     | security | AÇIK  | 30 dk     |
| 11  | P1-011 | Cookie banner Escape desteği yok                    | ui       | AÇIK  | 15 dk     |
| 12  | P1-012 | Husky hook'ları boş                                 | project  | AÇIK  | 15 dk     |

---

## 7. ÇÖZÜLEN SORUNLAR (Önceki Raporlardan)

| #   | Başlık                          | Kaynak             | Durum      | Çözüm Tarihi |
| --- | ------------------------------- | ------------------ | ---------- | ------------ |
| 1   | Transparency Report 404         | Claude P0, Minimax | ✅ ÇÖZÜLDÜ | 2026-06-22   |
| 2   | Contact form i18n key sızıntısı | Claude P1          | ✅ ÇÖZÜLDÜ | 2026-06-22   |
| 3   | Submit login wall               | Claude P0          | ✅ ÇÖZÜLDÜ | 2026-06-22   |
| 4   | Brand veri hatası (kısmen)      | Claude P0          | ✅ ÇÖZÜLDÜ | 2026-06-22   |
| 5   | About 404 linki                 | Claude P0          | ✅ ÇÖZÜLDÜ | 2026-06-22   |
| 6   | Autopilot leaderboard'da        | Claude P1          | ✅ ÇÖZÜLDÜ | 2026-06-22   |
| 7   | Sahte "Featured In" logoları    | Claude P1          | ✅ ÇÖZÜLDÜ | 2026-06-22   |
| 8   | Paylaşım linkleri               | Claude P1          | ✅ ÇÖZÜLDÜ | 2026-06-22   |

---

## 8. BENZERSİZ TESPİTLER (Bu Denetimden)

### mimo-v2.5 Tespiti

> "Transparency sayfasında `trustScoreMethodology` key'i messages dosyalarında yok ama `defaultValue` fallback kullanılmış. Sorun şu: fallback metni bile raw key olarak render edilmiş — bu, next-intl'in `defaultValue` mekanizmasının çalışmaması değil, component'in `t()` çağrısının yanlış yapılması. `transparency/page.tsx:201`'de `{t("trustScoreMethodology", { defaultValue: "Trust Score™ Methodology" })}` yerine `{t("trustScoreMethodologyDesc", { defaultValue: "..." })}` gibi bir kullanım olmalı. Ama asıl sorun: bu key'ler messages dosyalarında hiç yok — fallback çalışsa bile çeviri yapılamaz."

---

## 9. ÖNERİLER

### Hemen Yapılacak (Bugün)

1. "See Rankings" link'ini `/leaderboard`'a çevir — 5 dk
2. `trustScoreMethodology` ve `trustScoreMethodologyDesc` key'lerini messages dosyalarına ekle — 30 dk
3. Trust Score Metodolojisi'ni i18n'e geçir — 2 saat

### Bu Hafta

4. Brand sayfası incidents render sorununu çöz — 2 saat
5. TR Live Feed'i düzelt (`title_tr` alanını doldur) — 1 saat
6. Imprint (Künye) sayfası oluştur — 3 saat
7. Leaderboard sıralamasını düzelt — 2 saat

### Bu Ay

8. Models sayfasına 10+ model ekle — 3 saat
9. Mobil test ve optimizasyon — 1 gün
10. Dual design system unification — 2-3 hafta
11. CI/CD pipeline (visual regression, i18n-lint) — 1 hafta

---

## 10. SONUÇ

### Genel Değerlendirme

ALPAR AI **potansiyeli yüksek ama lansmana hazır olmayan** bir ürün. 16 modelin ortak tespitleri güçlü bir foundational analysis oluşturmuş. Canlı site denetimim, bu tespitleri doğruluyor ve yeni P0'lar tespit ediyor.

### Lansman Yolu

**7 P0 blocker düzeltildiğinde:** Skor 570 → 750+ civarına yükselebilir.
**12 P1 düzeltildiğinde:** Skor 800+ civarına yükselebilir.
**Dora Elite (900+):** 3-6 ay sürekli geliştirme ile ulaşılabilir.

### Yatırımcı Görünümü

- **Güçlü yönler:** Benzersiz value proposition, sağlam yasal altyapı, güçlü founding story
- **Zayıf yönler:** Sıfır sosyal kanıt, veri bütünlüğü sorunları, mobil test eksikliği
- **Öneri:** P0'ları düzeltmeden yatırım turuna başlamayın

---

_Rapor opencode/mimo-v2.5-free tarafından hazırlanmıştır._
_Tarih: 23 Haziran 2026_
_Versiyon: 3.0_
