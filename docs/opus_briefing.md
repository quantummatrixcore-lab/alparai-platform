# ALPAR AI — OPUS STRATEJİ SENTEZİ (15-AI KONSENSÜSÜ)

**Bağlam:** Bu belge, 15 farklı sınır zekası modelinin (GPT-4o, DeepSeek V4, Nemotron 3 Ultra, Claude 3.5 Sonnet, vb.) ALPAR AI (`alparai.com`) üzerine yaptığı analizlerin saf bir sentezidir.
**Görev:** `docs/MASTER_PLAN.md` dosyasını bu vizyon ve P0 teknik düzeltmelerine göre yeniden yapılandırmak. (Başka koda DOKUNMA).

## 1. VİZYON VE KİMLİK DEĞİŞİMİ ("The Moody's of AI")

- **Yanlış Konumlandırma:** Platform şu an sıradan bir "Topluluk Şikayet Sitesi" gibi görünüyor.
- **Hedef Konumlandırma:** Dünyanın ilk Bağımsız AI Risk Derecelendirme Kurumu ("Moody's of AI").
- **Değer Önerisi:** Hiçbir AI şirketinden fon almayan, EU AI Act standartlarıyla uyumlu, PII-maskelenmiş 1.000+ vaka barındıran tarafsız bir doğrulama (verification) motoru.

## 2. ACİL VİTRİN VE UI ZAFİYETLERİ (P0/P1)

Yatırımcı veya kurumsal müşteri gelmeden önce çözülmesi gereken varoluşsal hatalar:

1. **Leaderboard Çöküşü (P0):** Ana sayfada "56 Provider" yazarken, `/leaderboard` sayfasında 0 provider, %0 yanıt görünüyor (RLS hatası yutuluyor).
2. **UI Sızıntıları (P0):** Incident kartlarında ham şablon metinleri (`incident.source_rss`, `SLA N/A`) UI'a sızıyor.
3. **RSS / Olay Karışıklığı (P0):** Sıradan teknoloji haberleri (RSS) "Gerçek Yapay Zeka Kazası" (Incident) olarak sayılıyor. Sayılar şişirilmiş durumda. Haberler ile Doğrulanmış Vakalar ayrılmalı.
4. **Sahte Grafik (P1):** Trust Score Sparkline (mini grafik) gerçek zaman serisi değil, slug hash'inden üretilen sahte (fake) bir çizgidir. Bu güven kurumuna yakışmaz.
5. **Sayaç Tutarsızlığı:** Ana sayfa, API belgeleri ve Leaderboard'daki toplam incident ve provider sayıları birbirini tutmuyor.
6. **Models Sayfası Boşluğu:** Katalogda sadece "Grok 3" var. Sayfa boş hissettiriyor. En az 25 major model eklenmeli.

## 3. B2B MONETİZASYON VE GELİR AKIŞLARI (Phase 4)

Veriyi ücretsiz sunmaktan vazgeçip satmaya başlamalıyız:

- **Model Risk Intelligence API:** Sektörel bazda AI risk raporları (InsurTech ve Hukuk firmalarına).
- **Article 73 Compliance-in-a-Box:** EU AI Act gereği her şirketin şikayet alma zorunluluğu var. ALPAR'ın altyapısı kurumlara (RegTech) white-label satılacak.
- **Litigation Evidence Pack:** Hukuk davaları için doğrulanmış, zaman damgalı, PII maskeli delil paketleri (Dava başı ücret).
- **Trust Score Widget:** AI şirketlerinin kendi sitelerine ekleyebileceği embeddable "Güven Skoru" rozetleri (SaaS aboneliği).

## 4. MOONSHOT HEDEFLER (Piyasa Tekeli Kurma)

- **AI Transparency Index (ATX):** Finans dünyasındaki Dow Jones veya S&P 500 gibi, küresel medyanın her gün referans alacağı "AI Güvenilirlik Endeksi".
- **AI Insurance Score:** Sigorta şirketleri için LLM poliçe primlerini hesaplama altyapısı.
- **AI Court:** AI odaklı uyuşmazlıklarda "Uluslararası Tahkim Merkezi".

## 5. BÜYÜME (GTM) VE İLK 1.000 KULLANICI

- 6 adet P0 hatası düzeltildikten sonra Hacker News ve Reddit (r/MachineLearning) üzerinde eş zamanlı lansman.
- **"The Grok Files" OMEGA-1 Serisi:** Mevcut ifşa verileri kullanılarak viral büyüme tetiklenecek.
- İlk 50 AI şirketine (OpenAI, Anthropic vb.) otomatik Outreach yapılıp (SIGMA-1) "Güven Rozeti" almaları için baskı/davet kurulacak.

---

**OPUS'A TALİMAT:** MASTER_PLAN.md'yi bu belgedeki 5 eksene göre güncelle. GTM, B2B Gelir Modeli ve P0 Hataların Fix Planını "Phase 4 - Implementation Backlog" olarak plana yedir. Detaylı açıklama yapma, sadece markdown dosyasını düzenle ve bitir.
