# TASARIM & UI/UX PROFESYONEL ÖNERİLERİ

> **AI Model:** deepseek v4 flash
> **Tarih:** 2026-06-16
> **Bağlam:** ALPAR AI — AI accountability platform, www.alparai.com

---

## Mevcut Durum: UI ~60/100

Altyapı sağlam (88/100, DORA Elite) ama görsel katman zayıf:

- Minimalist ama _austere_ — karakter yok, sıcaklık yok
- Hero section metin ağırlıklı, görsel hiyerarşi zayıf
- Premium ikon/illustration seti yok
- Renk paleti düz, gradient/glow/depth efekti yok
- Provider logoları SVG wordmark — vector logo değil
- Incident kartları düz metin kutusu

---

## HEMEN (Bu Hafta)

### 1. Güvenlik: `.env.local` Takeaway + Token Rotasyonu

- `.env.local` git'te track ediliyor, tokenlar açıkta
- Vercel token (`vcp_502...`) ve Supabase token (`sbp_1b9...`) rotasyonu gerek
- `git rm --cached .env.local` + `.gitignore` güncelle

### 2. Hero Section Görselleştirme

- AI failure live counter (63 → güncel)
- 22 provider grafiği (bar chart race)
- Timeline animasyonu (önemli AI olayları)
- Ekip fotoğrafı veya brand illustrasyonu

### 3. Provider Logolarını Yükselt

- Şu an: SVG wordmark (metin bazlı)
- Hedef: Vector logo (renkli, tanınabilir, tutarlı boyut)
- Fallback: Placeholder + provider adı

### 4. Login Gereksinimini Gevşet

- Dilemmas oylama anonim yapılabilir
- Incident görüntüleme herkese açık (zaten öyle)
- Submit için sonra kayıt (anonim rapor → email verification)

---

## KISA VADE (1-2 Hafta)

### 5. Premium İkon Seti

- Lucide veya Phosphor ikon seti ekle
- Heroicons outline + solid (shadcn/ui uyumu)
- Gradient ikonlar (premium his)

### 6. Renk Sistemine Depth Kat

- Kartlara subtle shadow (hover'da yükselme)
- Hero'ya ambient glow (gradient background)
- Gradient border'lar (incident severity'ye göre)
- Dark mode geçiş animasyonu

### 7. Incident Kartlarını Görselleştir

- Severity badge (renk kodlu, ikonlu)
- Timeline indicator (oluş → tespit → çözüm)
- Provider avatar + isim
- Vote count (up/down animasyonu)
- Category tag (pill-shaped, renk kodlu)

### 8. Animasyon Katmanı

- Framer Motion zaten var → kullanılmayan potansiyel
- Page transitions (soft fade + slide)
- Scroll-triggered reveal (Intersection Observer)
- Counter animation (vote sayıları, provider count)
- Loading skeleton (shimmer efekti)

---

## 1 AY

### 9. Brand Illustration Seti

- AI accountability temalı özel illustrasyonlar
- 404 sayfası için eğlenceli illustrasyon
- Empty state illustrasyonları ("Henüz rapor yok")
- Hero background pattern (subtle, marka renginde)

### 10. Live Feed (Homepage)

- Son incident'ların canlı akışı
- Sosyal kanıt anında görünür
- Auto-scroll carousel
- "Just reported" badge yeni olaylarda

### 11. Leaderboard → Data Visualization

- Bar chart race (zaman içinde provider sıralaması)
- Trend lines (son 30 gün)
- Heatmap (hangi kategoride kim önde)
- Export grafik (PNG/SVG)

### 12. Public API v1 + API Docs UI

- Swagger/OpenAPI UI
- Interactive playground (try endpoint)
- Rate limit göstergesi
- Code snippet (curl, Python, JS)

---

## TEKNİK NOTLAR

### Mevcut Stack (UI için geçerli olanlar)

| Teknoloji     | Durum                  |
| ------------- | ---------------------- |
| Tailwind v4   | Mevcut                 |
| Framer Motion | Mevcut, az kullanılmış |
| shadcn/ui     | Mevcut                 |
| Lucide React  | Tavsiye                |
| next/font     | Mevcut (Inter)         |
| next/image    | Mevcut                 |

### Atomic Tasarım Sistemi Yaklaşımı

```
Atoms:    Badge, Button, Icon, Input, Tag
Molecules: Card, Table, FormGroup, NavItem
Organisms: Hero, IncidentCard, Leaderboard, Footer
Templates: PageLayout, AuthLayout, DashboardLayout
Pages:    Home, Incidents, Leaderboard, Models, About
```

---

## HARİCİ ANALİZLE KARŞILAŞTIRMA

| İddia                       | Doğruluk  | Yorum                                       |
| --------------------------- | --------- | ------------------------------------------- |
| "Sıfır rapor"               | ❌ Yanlış | 50 incident canlı, 22 provider, 2.680 oy    |
| "Login wall %60-80 düşürür" | ⚠️ Kısmen | View açık, submit login ister — intentional |
| "i18n raw key görünüyor"    | ❌ Yanlış | 763=763 satır, tam çeviri                   |
| "Founder story yok"         | ❌ Yanlış | Var ama görsel vurgu yetersiz               |
| "Tech 65/100"               | ❌ Eksik  | 88/100 — live verify yapılmamış             |

---

**AI Model:** deepseek v4 flash
**Son Güncelleme:** 2026-06-16
