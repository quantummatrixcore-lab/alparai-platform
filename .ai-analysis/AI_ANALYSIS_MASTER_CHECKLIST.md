# ALPAR AI - AI Multi-Model Analysis Master Checklist

## 📋 ANALİZ ÖNCESİ HAZIRLIK

### 1.1 Kod Bazlı Hazırlık

- [x] Son commit'in kararlı (stable) olduğunu doğrula
- [x] Test suite'leri çalıştır (`npm test` veya `npx vitest run`)
- [x] Üretim derlemesi (build) başarılı mı? (`npm run build`)
- [x] Çevre değişkenleri (environment variables) kontrol edildi mi?
- [x] `.env.example` ve `.env.local` senkronize mi?

### 1.2 Dokümantasyon Hazırlığı

- [x] README.md güncel mi?
- [x] API dokümantasyonu mevcut mu? (`docs/API.md`)
- [x] Architecture diagram güncel mi? (`docs/ARCHITECTURE.md`)
- [x] Bağımlılık listesi güncel mi? (`package.json`)

---

## 🤖 MULTI-MODEL ANALİZ SÜRECİ

### Model 1: GPT-5.5 / GPT-4o Analysis

**Odak Alanları:**

- [ ] Kod Kalitesi ve En İyi Uygulamalar (Best Practices)
- [ ] Güvenlik Açıkları (Security Vulnerabilities)
- [ ] Performans Optimizasyonu (Bundle/Query size)
- [ ] Ölçeklenebilirlik Kalıpları (Scalability Patterns)

### Model 2: Claude 3.5 Sonnet / 4.6 Analysis

**Odak Alanları:**

- [ ] Mimari Tasarım Kalıpları (Architecture Patterns)
- [ ] Kod Sürdürülebilirliği (Maintainability)
- [ ] Hata Yönetimi ve Dayanıklılık (Error Handling & Resilience)
- [ ] Test Kapsamı (Test Coverage)

### Model 3: Qwen 3.7 Analysis

**Odak Alanları:**

- [ ] Sistem Mimarisi ve Entegrasyon Noktaları
- [ ] Veritabanı ve Zaman Serisi Optimizasyonları
- [ ] API Tasarımı ve Veri Akışı

### Model 4: Gemini Pro Analysis

**Odak Alanları:**

- [ ] UI/UX En İyi Uygulamaları
- [ ] Erişilebilirlik Standartları (WCAG 2.1 AA)
- [ ] SEO Optimizasyonu ve Arama Motoru Görünürlüğü
- [ ] Mobil Uyumluluk ve Duyarlı Tasarım (Responsiveness)

### Model 5: DeepSeek V3/V4 Analysis

**Odak Alanları:**

- [ ] Algoritmik Verimlilik ve CPU/Bellek Optimizasyonu
- [ ] Veri Maskeleme ve PII Guardian Testleri
- [ ] Çapraz Sorgu Hata Tespiti (Hallucination & Bias)

---

## 🔍 ANALİZ KATEGORİLERİ (360° Denetim Noktaları)

### A. SECURITY AUDIT (Güvenlik Denetimi)

- [ ] SQL Injection ve ORM zafiyet kontrolü
- [ ] XSS (Cross-Site Scripting) koruması (HTML input sanitization)
- [ ] CSRF koruması ve Güvenli Çerez (Cookie) politikaları
- [ ] Kimlik Doğrulama ve Yetkilendirme (Authentication & Authorization)
- [ ] API Key ve hassas bilgilerin gizliliği (PII Guardian entegrasyonu)
- [ ] CORS yapılandırması ve güvenli header politikaları
- [ ] Hız Sınırlama (Rate Limiting) uygulaması (Upstash/Redis entegrasyonu)

### B. PERFORMANCE AUDIT (Performans Denetimi)

- [ ] Sayfa yüklenme süresi (< 2s) ve First Contentful Paint (FCP)
- [ ] Time to First Byte (TTFB < 500ms)
- [ ] Paket boyutu optimizasyonu (Bundle Size Optimization)
- [ ] Görsel optimizasyonu (AVIF/WebP biçimleri ve Next.js Image kullanımı)
- [ ] Önbellekleme stratejileri (Redis/Edge caching)
- [ ] Veritabanı sorgu optimizasyonu (Index'ler ve TimescaleDB entegrasyonu)
- [ ] Bellek sızıntıları (Memory Leaks) ve işlemci yükü analizi

### C. CODE QUALITY AUDIT (Kod Kalitesi Denetimi)

- [ ] Kod tekrarı oranı (Code Duplication < 5%)
- [ ] Fonksiyon karmaşıklığı (Cyclomatic Complexity < 10)
- [ ] Dosya satır sınırları (Her dosya için < 500 satır)
- [ ] İsimlendirme standartları ve dosya organizasyonu
- [ ] Tip güvenliği (TypeScript strict mode, zero `any`)
- [ ] Loglama ve hata yakalama standartları

### D. ARCHITECTURE AUDIT (Mimari Denetimi)

- [ ] Sorumlulukların Ayrılması (Separation of Concerns)
- [ ] Tek Sorumluluk İlkesi (Single Responsibility Principle)
- [ ] Bağımlılıkların Yönetimi (Dependency Injection / Abstraction)
- [ ] Modülerlik ve Yeniden Kullanılabilirlik (Reusable Components)
- [ ] API Versiyonlama Stratejisi (REST/JSON v1)

### E. TESTING AUDIT (Test Denetimi)

- [ ] Birim (Unit) test kapsama oranı (> 80%)
- [ ] Entegrasyon testleri ve API uç noktası doğrulamaları
- [ ] Uçtan Uca (E2E) testler (Playwright)
- [ ] Performans ve yük testleri
- [ ] Güvenlik sızma test senaryoları

### F. USER EXPERIENCE (UX/UI) AUDIT

- [ ] Erişilebilirlik (WCAG 2.1 AA uyumluluğu, aria-label'lar)
- [ ] Mobil uyumluluk ve dokunmatik hedef boyutları (> 44px)
- [ ] Yüklenme durumları (Skeleton / Loading states)
- [ ] Net Hata Mesajları ve Geri Bildirimler (Toasts)
- [ ] Form alanlarında anlık doğrulama (Instant validation)
- [ ] Form Otomatik Kaydetme (Autosave) ve taslak yönetimi

### G. SEO & MARKETING AUDIT

- [ ] Meta başlıkları ve açıklamaları (i18n uyumlu)
- [ ] Yapılandırılmış Veri şemaları (Schema.org / JSON-LD)
- [ ] `sitemap.xml` ve `robots.txt` entegrasyonu
- [ ] Open Graph ve Twitter Card etiketleri
- [ ] Kanonik URL (Canonical URL) yapılandırması

---

## 🎯 GOOGLE ANTIGRAVITY WORKFLOW VE AUTO-FIX KURALLARI

### 2.1 Antigravity Otomatik Düzeltme Seviyeleri

- [ ] **CRITICAL (P0):** Otomatik düzelt, testleri çalıştır ve PR oluştur.
  - Güvenlik zafiyetleri (SQLi, CSRF, API Key sızıntısı)
  - Derleme (build) hataları ve kırık iç bağlantılar
  - Veri kaybı veya bütünlük riski
- [ ] **HIGH (P1):** Yorum/İnceleme sonrası otomatik düzelt ve PR oluştur.
  - Performans darboğazları ve yavaş veritabanı sorguları
  - Test kapsamı boşlukları ve eksik birim testleri
  - Kritik UX ve form hataları
- [ ] **MEDIUM (P2):** Backlog'a issue olarak ekle.
  - Yeniden yapılandırma (Refactoring) fırsatları
  - Dokümantasyon eksiklikleri ve tip tanımları
- [ ] **LOW (P3):** Günlük (log) dosyasına kaydet ve izle.
  - Kod stili uyumsuzlukları
  - Yorum satırı güncellemeleri

### 2.2 Antigravity Kabul Kriterleri (DoD)

- [x] Tüm TypeScript tipleri hatasız derlenmeli (`npm run typecheck`)
- [x] Lint kuralları sıfır uyarı ile geçmeli (`npm run lint`)
- [x] Tüm birim ve entegrasyon testleri yeşil olmalı (`npx vitest run`)
- [x] Üretim derlemesi başarıyla tamamlanmalı (`npm run build`)
