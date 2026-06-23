# ALPAR AI - Google Antigravity Setup & Auto-Fix Guide

## 1. GENEL BAKIŞ

Google Antigravity, AlparAI platformunun otonom yazılım ve düzeltme (auto-fix) motorudur. Çoklu yapay zeka analiz raporlarından gelen bulguları okuyarak, kod zafiyetlerini, i18n eksikliklerini ve performans darboğazlarını otomatik olarak düzeltmek üzere yapılandırılmıştır.

---

## 2. KULLANIM VE TETİKLEME

Antigravity, projede iki ana yöntemle tetiklenebilir:

### A. Yerel Tetikleme (Local Execution)

Geliştirme ortamında otonom düzeltme döngüsünü başlatmak için:

```bash
# 1. Bağımlılıkları ve çevre değişkenlerini doğrula
npm run typecheck

# 2. Antigravity otonom analiz ve düzeltme scriptini çalıştır
npm run dev
```

### B. CI/CD Otomasyonu (GitHub Actions)

Her pazartesi saat 09:00'da veya manuel tetiklendiğinde çalışan otomatik düzeltme iş akışı `.github/workflows/antigravity-auto-fix.yml` dosyasında tanımlıdır. Bu akış:

1. Son değişiklikleri kontrol eder ve testleri çalıştırır.
2. Çoklu model analiz raporlarını konsolide eder.
3. Kritik (P0) ve Yüksek (P1) sorunlar için kodu otomatik olarak yamalar, testleri çalıştırır ve başarılıysa PR (Pull Request) oluşturur.

---

## 3. GÜVENLİK VE SINIRLANDIRMALAR (GUARDRAILS)

Antigravity otonom olarak kod yazarken aşağıdaki kurallarla sınırlandırılmıştır:

- **PII Guardian:** Hiçbir yama veya loglama işlemi, veritabanına ya da üçüncü taraf servislere maskelenmemiş kullanıcı PII'si (TC Kimlik, E-posta, Telefon vb.) sızdıramaz.
- **RLS Güvenliği:** Supabase veri katmanındaki satır seviyesi güvenlik (RLS) politikalarını ve veritabanı şemasını bypass eden hiçbir SQL işlemi gerçekleştirilemez.
- **Rollback Garantisi:** Eğer yazılan kod sonrasında `npm run typecheck`, `npm run lint` veya `npx vitest run` testlerinden herhangi biri başarısız olursa, Antigravity tüm değişiklikleri anında geri alır (Rollback).
