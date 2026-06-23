---
audit_id: "ALPAR-AUDIT-2026-06-23-claude-sonnet-4.6-v6"
date: "2026-06-23"
model: "claude-sonnet-4-6" # denetimi üreten model
model_note: "" # opsiyonel: model ayarı, persona vb.
site_commit_or_deploy_tag: "" # ÖNEMLİ: hangi git commit / deploy denetlendi? boşsa yazın "bilinmiyor"
previous_audit_id: "ALPAR-AUDIT-2026-0X-XX-..." # bir önceki denetimin ID'si (zincir kurmak için)
overall_score: 0 # /1000, MASTER_CHECKLIST.md'deki güncel rubriğe göre
verification_method: "live-browse | html-fetch | screenshot-review | manual-paste | unverified"
locales_checked: ["en", "tr"]
viewports_checked: ["desktop", "mobile(<768px)"]
---

# ALPAR AI Denetim Raporu — {tarih} — {model adı}

> Bu dosyayı doldurduktan sonra `reports/{tarih}_{model}_v{n}.md` olarak kaydedin
> ve bulgularınızı `MASTER_CHECKLIST.md`'ye işleyin (yeni ID ekleyin veya mevcut
> ID'lerin durumunu güncelleyin). Bu dosyanın kendisi Antigravity'ye DOĞRUDAN
> görev kaynağı olarak verilmemelidir — sadece arşiv/kanıttır.

## 0. Doğrulama Yöntemi (zorunlu, dürüst olun)

Bu denetimde siteye nasıl eriştiniz? (canlı tarayıcı / HTML fetch / kullanıcının
yapıştırdığı ekran görüntüsü / yalnızca önceki raporlardan çıkarım / vb.)
Hangi sayfalar, hangi dil(ler), hangi viewport(lar) GERÇEKTEN görüldü, hangileri
görülemedi? Görülemeyenleri "CANLI DOĞRULAMA GEREKİYOR" olarak işaretleyin —
tahmin etmeyin.

## 1. Bu Turda Doğrulanan Bulgular

Her madde için: sayfa/alan, ne gözlemlendi, hangi kanıtla (ekran görüntüsü,
HTML alıntısı, URL).

## 2. MASTER_CHECKLIST.md'deki Önceki Maddelerin Durumu

| ID      | Önceki Durum | Bu Turda Gözlem                                       | Yeni Durum |
| ------- | ------------ | ----------------------------------------------------- | ---------- |
| ALP-001 | 🔴 Açık      | (hâlâ açık / artık 🟢 / artık ✅ / kontrol edilemedi) | ...        |

## 3. Yeni Tespit Edilen Sorunlar

| Geçici ID (taslak) | Sayfa/Alan | Açıklama | Önerilen Önem (P0/P1/P2) | Kanıt |
| ------------------ | ---------- | -------- | ------------------------ | ----- |
|                    |            |          |                          |       |

_Not: kesin ID, `MASTER_CHECKLIST.md`'ye eklenirken artan sırada verilir._

## 4. Bu Turda Doğrulanamayanlar

Açıkça listeleyin — örn. "mobil viewport test edilemedi", "/tr/contact canlı
açılamadı". Bu bölümü boş bırakmak, her şeyin doğrulandığı anlamına gelir —
bu nedenle dürüst ve eksiksiz olun.

## 5. Skor Değişikliği ve Gerekçesi

Önceki denetimin skoruna göre değişim varsa, HER puan değişikliğini somut bir
gözleme bağlayın. "Genel olarak iyileşti" gibi gerekçesiz puan değişikliği kabul
edilmez.

## 6. Antigravity İçin Önerilen Aksiyonlar

Her biri tek bir kod ajanı görevine dönüştürülebilecek kadar somut ve test
edilebilir olmalı (bkz. örnek: "Hero sayaç sorgusuna `WHERE status='published'`
filtresi ekle ve `/incidents` sayısıyla eşleştiğini doğrula").
