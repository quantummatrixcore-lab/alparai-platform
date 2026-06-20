# ALPAR AI — Canlı Site UI/UX Değerlendirmesi

> **AI Model:** deepseek v4 flash
> **Tarih:** 2026-06-20 08:50 UTC+3
> **Yöntem:** Playwright canlı tarama (headless) + DOM snapshot + screenshot analizi
> **Hedef:** www.alparai.com

---

## Sayfa Haritası (Taranan Sayfalar)

| Sayfa        | URL             | Durum |
| ------------ | --------------- | ----- |
| Ana Sayfa    | /en             | ✅    |
| Olaylar      | /en/incidents   | ✅    |
| Leaderboard  | /en/leaderboard | ✅    |
| Modeller     | /en/models      | ✅    |
| Blog         | /en/blog        | ✅    |
| Rapor Gönder | /en/submit      | ✅    |
| Giriş        | /en/auth/signin | ✅    |
| Footer       | Tüm sayfalarda  | ✅    |

---

## 1. GENEL DURUM: 72/100 🟡

| Boyut                        | Puan   |
| ---------------------------- | ------ |
| Görsel Hiyerarşi & Tipografi | 75/100 |
| Renk & Tutarlılık            | 80/100 |
| Bileşen Tasarımı             | 70/100 |
| Etkileşim & Animasyon        | 85/100 |
| Responsive                   | 60/100 |
| Erişilebilirlik              | 65/100 |
| İçerik Kalitesi              | 80/100 |

---

## 2. SAYFA BAZLI ANALİZ

### 2.1 Ana Sayfa (Homepage) — 78/100

**Güçlü Yönler:**

- Hero bölümü etkileyici: "AI Lied to You. Nobody Was Tracking It. We Were." güçlü mesaj
- 2-column split layout (manifesto + live data) iyi çalışıyor
- Live stat card'lar (64 failures, 23 providers, 47 countries) dikkat çekici
- Leaderboard mini panel bar chart ile görsel
- Founder story bölümü duygusal bağ kuruyor
- News ticker canlı bilgi akışı sağlıyor
- Ecosystem Pulse bölümü içerik zenginliği sunuyor
- "How it works" 4 adımlık süreç net
- Trust bar (AGPL, EU/GDPR, PII Guardian, Art. 14) güven veriyor
- Footer kapsamlı (Product, Legal, About)

**Sorunlar:**

- 🔴 Nav bar overlap: Subpage'lerde nav bar, hero section ile çakışıyor (düzeltme yapılmış ama tam oturmamış)
- 🟡 "See Rankings" butonunda "rankings" diyor ama link `/incidents`'a gidiyor — yanıltıcı
- 🟡 Bug Bounty badge ile "See Rankings" butonu arasında copy çakışması
- 🟡 "Last report: Just now" — gerçek zamanlı mı, statik mi belli değil
- 🟡 Leaderboard panelinde sadece 5 provider gösteriliyor, kalanları görünmüyor
- 🟡 "See Full Leaderboard →" link'i var ama zaten "View All" link'i de var — gereksiz tekrar

### 2.2 Olaylar Sayfası (Incidents) — 75/100

**Güçlü Yönler:**

- "All Incidents" başlığı net
- 50 published reports bilgisi açık
- Filtre sistemi kapsamlı: category (10 tane) + severity (5 seviye) + search
- Incident kartları bilgilendirici: severity badge, status badge, provider, category
- Timeline (Reported → Reviewed → Published) süreci görsel
- Vote count (0) ve comment count (0) görünüyor
- "Publish anonymously" bilgisi mevcut
- Sidebar'da Live Poll ve Latest News bölümleri var

**Sorunlar:**

- 🔴 Sidebar ile ana içerik alanının genişlik oranı dengesiz — sidebar çok geniş, kartlar sıkışık
- 🟡 Filtre butonları çok küçük ve sıkışık — mobilde zor kullanılır
- 🟡 Tüm olaylarda vote=0, comment=0 — sosyal kanıt yok
- 🟡 "Publish anonymously" her kartta tekrar ediyor — gereksiz tekrar
- 🟡 Severity renk kodları tutarsız: Critical kırmızı, High turuncu, Medium sarı ama badge'ler aynı boyutta
- 🟡 Tarih formatı tutarsız: "Mar 18, 2018" vs "Aug 1, 2012" — sıralama belirsiz

### 2.3 Leaderboard — 70/100

**Güçlü Yönler:**

- Tablo yapısı temiz: Rank, Provider, Incidents, Responses, Response Rate
- Provider logoları premium ve tanınabilir
- `<table>` + `<caption>` erişilebilirlik için iyi
- 23 provider takip ediliyor
- Share butonları (X, LinkedIn, Copy Link)
- Top 3 için gold/silver/bronze renklendirme
- Response rate badge'leri renk kodlu (danger/warning/success)

**Sorunlar:**

- 🔴 Sıralama mantığı hatalı: Anthropic (#1, 10 incident) > Google (#2, 14 incident) — Google daha çok olaya sahipken neden #2?
- 🔴 Toplam response=0, avg response rate=0% — platform ölü görünüyor
- 🟡 16 provider'da 0 incident, 0 response — tablonun %70'i boş
- 🟡 Sort by response rate çalışıyor mu? 0% = 0% için sıralama belirsiz
- 🟡 Mobilde tablo yatay kaydırma gerektirecek

### 2.4 Modeller (Models) — 55/100

**Güçlü Yönler:**

- "AI Models Directory" başlığı net
- Search + sort (Name, Highest Rating, Most Reviews, Most Feature Requests) + Filter
- Model kartı: provider logo, model adı, version, release date, rating, reviews, feature requests

**Sorunlar:**

- 🔴 SADECE 1 MODEL! (Grok 3) — Sayfa neredeyse boş, devasa boşluk
- 🔴 Sayfa yüksekliğinin %80'i boş alan — çok zayıf görünüm
- 🟡 "Filter" butonu ne filtreliyor belli değil
- 🟡 Rating "-(0)" şeklinde — negatif mi, boş mu belli değil

### 2.5 Blog — 80/100

**Güçlü Yönler:**

- "INSIGHTS & RESEARCH" eyebrow badge tematik
- 3 blog kartı yan yana (grid): tarih, okuma süresi, başlık, özet, tag'ler
- Tag'ler kategori bazlı: REGULATION, CLAUDE, BAN, AI-GOVERNANCE, ACCOUNTABILITY vb.
- İçerik kaliteli: Claude ban, AI accountability, Top 10 incidents

**Sorunlar:**

- 🟡 Blog kartlarında görsel/thumbnail yok — sadece metin
- 🟡 Tag'ler çok küçük ve soluk — okunabilirlik düşük
- 🟡 Blog yazısı sayısına limite ulaşılmış (3 tane) — daha fazla içerik gerek

### 2.6 Rapor Gönder (Submit) — 82/100

**Güçlü Yönler:**

- "No login required" mesajı açık
- "100% Anonymous — No email, no name, no tracking" güven veriyor
- Form alanları net: "Briefly describe the incident" (0/200), description (0/5000)
- Required field indicator (\*)
- Character counter mevcut

**Sorunlar:**

- 🟡 Form sayfası çok uzun — scroll gerekiyor, sticky submit butonu yok
- 🟡 "PII is masked automatically" mesajı var ama nasıl çalıştığı açıklanmamış
- 🟡 Consent checkbox görünmüyor (scroll gerekiyor olabilir)

### 2.7 Giriş (Sign In) — 85/100

**Güçlü Yönler:**

- Temiz, minimal tasarım
- "Welcome back" mesajı sıcak
- "Continue with Google" — OAuth, büyük buton
- "OR CONTINUE WITH EMAIL" — Magic Link seçeneği
- "We use Google for secure authentication. We never see your password." güven mesajı
- Terms of Service + Privacy Policy checkbox
- Email input + Send butonu

**Sorunlar:**

- 🟡 Logo (envelope ikonu) çok basit — ALPAR AI logosu yerine generic mail ikonu
- 🟡 "Send" butonu purple — Google butonu da aynı renk mi? Farklılık az

---

## 3. GLOBAL SORUNLAR

### 3.1 Navigasyon

- ✅ Aktif sayfa göstergesi var (purple highlight)
- ✅ Ana sayfa, Olaylar, Modeller, Leaderboard, Blog — 5 ana link
- ✅ Dil değiştirme (TR)
- ✅ Suggestions + Report Incident + Sign in — sağ taraf
- 🔴 Nav bar subpage'lerde hero ile çakışıyor (overlap fix yapılmış ama hala sorunlu)
- 🟡 Mobil hamburger menü看不到 — responsive test yapılamadı

### 3.2 Tipografi

- ✅ Başlıklar bold ve büyük
- ✅ "AI Models Directory" gradient text etkisi
- 🟡 Bazı başlıklar çok büyük (hero h1), bazıları çok küçük (footer)
- 🟡 Metin okunabilirliği yeterli ama kontrast artırılabilir

### 3.3 Renk Paleti

- ✅ Dark theme (koyu arka plan)
- ✅ Purple accent (primary action)
- ✅ Renk kodlu severity badges (Critical=red, High=orange, Medium=yellow, Low=green)
- ✅ Gradient text efektleri
- 🟡 Purple çok baskın — daha fazla renk çeşidi gerek
- 🟡 Bazı kartlar arka plan ile yeterince ayrışmıyor

### 3.4 Bileşen Kalitesi

- ✅ Card bileşenleri tutarlı
- ✅ Badge bileşenleri renk kodlu
- ✅ Button bileşenleri net
- 🟡 Kart border radius tutarlı ama shadow eksik
- 🟡 Hover efektleri sınırlı

### 3.5 Footer

- ✅ Kapsamlı: Product, Legal, About bölümleri
- ✅ Social links: GitHub, Twitter, Email
- ✅ Copyright + intermediary disclaimer
- ✅ Whistleblower program link'i mevcut

---

## 4. ACİL DÜZELTMELER

| #   | Sorun                                    | Sayfa        | Etki                        |
| --- | ---------------------------------------- | ------------ | --------------------------- |
| 1   | Models sayfası sadece 1 model gösteriyor | /models      | 🔴 Çok kötü görünüm         |
| 2   | Leaderboard sıralama mantığı hatalı      | /leaderboard | 🔴 Yanıltıcı veri           |
| 3   | Nav bar overlap (subpage'lerde)          | Tümü         | 🔴 Kullanıcı deneyimi bozuk |
| 4   | Vote=0, Response=0 her yerde             | Tümü         | 🔴 Sosyal kanıt yok         |
| 5   | Blog kartlarında görsel yok              | /blog        | 🟡 Görsel ilgi düşük        |

## 5. ÖNERİLER

### Kısa Vade (1 Hafta)

1. **Models sayfasına veri ekle** — en az 10-15 model (GPT-4, Gemini, Claude, Llama vb.)
2. **Leaderboard sıralamasını düzelt** — incident_count'a göre azalan
3. **Blog kartlarına thumbnail ekle** — her yazıya görsel
4. **Nav overlap'ı kesin çöz** — sticky header height hesaplaması

### Orta Vade (2-4 Hafta)

5. **Incident kartlarına hover efekti ekle** — border glow, shadow
6. **Sidebar'ı daralt** — %25'ten %20'ye
7. **Mobile responsive test** — hamburger menü, kart düzeni
8. **Vote system'ini teşvik et** — oylama sonrası feedback
9. **Empty state design** — 0 incident olan provider'lar için "No incidents yet" mesajı

### Uzun Vade (1-2 Ay)

10. **Data visualization** — leaderboard bar chart race, trend lines
11. **Incident timeline animation** — reported → reviewed → published geçişi
12. **Dark/light mode toggle** — kullanıcı tercihi
13. **Skeleton loading** — sayfa yüklenirken shimmer efekti

---

_Rapor OMEGA PRIME tarafından Playwright canlı tarama ile hazırlanmıştır._
_AI Model: deepseek v4 flash_
_Screenshot'lar: D:\Alparai\docs\ui-audit\ dizininde_
