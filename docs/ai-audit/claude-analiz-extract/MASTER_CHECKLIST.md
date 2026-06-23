# ALPAR AI — Ana Sorun Takip Listesi (Master Issue Checklist)

**Son güncelleme:** 2026-06-23 · **Kaynak:** Denetim panosu (Haziran 2026) + bağımsız CPO/CTO raporu

> **Antigravity / kod ajanı için:** Görev almadan önce bu dosyayı oku. Ham denetim
> raporlarını (`reports/` klasörü) okumana gerek yok — buradaki açık (🔴/🟡)
> maddeler tam görev tanımıdır. Bir maddeyi düzelttiğinde durumunu 🟢 yap,
> **asla kendi başına ✅ yapma** (bkz. README.md'deki "Düzeltildi İki Aşamalıdır" kuralı).

**Durum kodları:** 🔴 Açık (P0 — lansmanı engelliyor) · 🟡 Açık (P1 — güven/dönüşüm
riski) · 🔵 Açık (P2 — büyüme/cilalama) · 🟢 Düzeltildi — doğrulanmadı · ✅ Düzeltildi — doğrulandı

---

## P0 — Lansmanı Engelleyen

| ID      | Sayfa/Alan            | Sorun                                                                                                       | Durum         | İlk Bildirilme        | Son Doğrulama | Kaynak            |
| ------- | --------------------- | ----------------------------------------------------------------------------------------------------------- | ------------- | --------------------- | ------------- | ----------------- |
| ALP-001 | Leaderboard, About    | Eski tasarım sistemi: eski nav (Suggestions/Takedown), eski footer (hello@alparai.online, anomalyco GitHub) | ✅ Düzeltildi | Denetim v3 (yaklaşık) | 2026-06-23    | Dashboard Haz2026 |
| ALP-002 | Homepage / Hero       | "0 Verified AI failures" sayacı — published incident sayısını saymıyor, 40+ varken 0 gösteriyor             | ✅ Düzeltildi | Denetim v4 (yaklaşık) | 2026-06-23    | Dashboard Haz2026 |
| ALP-003 | /transparency (EN+TR) | 404 hatası — **4. analizdir aynı sorun**, kök neden analizi gerekiyor (bkz. Audit Report Böl. 2.7)          | ✅ Düzeltildi | Denetim v1            | 2026-06-23    | Dashboard Haz2026 |
| ALP-004 | About → /en/en/submit | Çift-locale ("/en/en/") kırık link, kullanıcıyı 404'e düşürüyor                                             | ✅ Düzeltildi | Denetim v4 (yaklaşık) | 2026-06-23    | Dashboard Haz2026 |

## P1 — Güven / Dönüşüm Riski

| ID      | Sayfa/Alan                   | Sorun                                                                                                           | Durum                               | İlk Bildirilme        | Son Doğrulama              | Kaynak                  |
| ------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------- | -------------------------- | ----------------------- |
| ALP-005 | Leaderboard                  | "ALPAR Autopilot" skoru hesaplanıyor ve ilk sırada çıkıyor, adil değil                                          | ✅ Düzeltildi                       | Denetim v5 (yaklaşık) | 2026-06-23                 | Dashboard Haz2026       |
| ALP-006 | Incidents vs Dilemmas        | "Polls" anket soruları hâlâ İngilizce (veritabanı i18n hatası)                                                  | 🟡 Açık                             | Denetim v2            | 2026-06-23                 | Dashboard Haz2026       |
| ALP-007 | Homepage CTA                 | "Become a Founding Reporter" butonu `/en/suggestions`'a gidiyor; olması gereken ayrı bir kayıt/reporter sayfası | ✅ Düzeltildi                       | Denetim v4 (yaklaşık) | 2026-06-23                 | Dashboard Haz2026       |
| ALP-008 | Footer                       | (Blog, Dilemmas) "Suggestions" `/en/dilemmas`'a gidiyor                                                         | ✅ Düzeltildi                       | Denetim v4 (yaklaşık) | 2026-06-23                 | Dashboard Haz2026       |
| ALP-009 | İstatistikler                | "Upvote" ve "View" sayıları veritabanında hep 0 kalıyor (event tracking çalışmıyor olabilir)                    | 🟡 Açık                             | Denetim v5 (yaklaşık) | 2026-06-23                 | Dashboard Haz2026       |
| ALP-010 | Homepage "Featured/Cited In" | MIT Tech Review / Stanford / Ars Technica logoları — gerçek haber linkleri doğrulanmamış                        | ✅ Düzeltildi                       | Denetim v2            | 2026-06-23                 | Dashboard Haz2026       |
| ALP-011 | About Sayfası                | İçerik çok az (4 madde): founder fotoğrafı, CTO profili, kuruluş tarihi, manifesto, ekip yok                    | ✅ Düzeltildi                       | Denetim v3 (yaklaşık) | 2026-06-23                 | Dashboard Haz2026       |
| ALP-012 | /tr/\* çeviri                | Contact formunda raw i18n key (`contact.form.name*`) sızıntısı                                                  | ✅ Düzeltildi                       | Denetim v3 (yaklaşık) | 2026-06-23                 | Dashboard Haz2026       |
| ALP-013 | Mobil — Leaderboard/About    | Eski tasarım sisteminin mobil/responsive davranışı bilinmiyor                                                   | 🟡 Açık — CANLI DOĞRULAMA GEREKİYOR | Bu tur                | Doğrulanamadı (2026-06-23) | Bağımsız rapor Böl. 2.3 |

## P2 — Büyüme / Cilalama

| ID      | Sayfa/Alan                | Görev                                                                                | Durum   | Kaynak            |
| ------- | ------------------------- | ------------------------------------------------------------------------------------ | ------- | ----------------- |
| ALP-014 | Incidents                 | Her kayıt için X/LinkedIn paylaşım butonu + otomatik OG kartı                        | 🔵 Açık | Dashboard Haz2026 |
| ALP-015 | Dilemmas                  | 5 yeni soru: otonom silahlar, otonom araçlar, biyometrik gözetim, AGI yönetişimi vb. | 🔵 Açık | Dashboard Haz2026 |
| ALP-016 | /en/developers (yeni)     | Developer API katmanı, $99/ay tier                                                   | 🔵 Açık | Dashboard Haz2026 |
| ALP-017 | invest.alparai.com (yeni) | Tek sayfalık yatırımcı portalı                                                       | 🔵 Açık | Dashboard Haz2026 |
| ALP-018 | Incidents (genel)         | Kayıt sayısını 100'den 400'e çıkar, tüm AIID kategorilerini doldur                   | 🔵 Açık | Dashboard Haz2026 |

## ✅ Çözülmüş ve Doğrulanmış

| ID       | Açıklama                                                                        | Doğrulayan Tur                            |
| -------- | ------------------------------------------------------------------------------- | ----------------------------------------- |
| ALP-000a | /incidents sayfası tamamen boştu → 40+ gerçek, yayınlanmış vaka eklendi         | Dashboard Haz2026 (önceki → güncel kıyas) |
| ALP-000b | Homepage/Incidents/Blog/Dilemmas nav+footer tutarsızlığı → 4 sayfada düzeltildi | Dashboard Haz2026                         |
| ALP-000c | Dilemmas sayfası yoktu → açıldı, canlı oylama çalışıyor (bayrak soru 2.680 oy)  | Dashboard Haz2026                         |

---

## Antigravity için Öncelik Sırası

1. ALP-001 → ALP-004 (P0'lar, toplam tahmini efor: 1 iş günü altı)
2. ALP-005, ALP-010 (en ucuz itibar-riski düzeltmeleri — kaldırma/link ekleme, kod değişikliği minimal)
3. ALP-006, ALP-007, ALP-008 (yönlendirme/etiket düzeltmeleri)
4. ALP-009, ALP-011 (orta efor, P1)
5. ALP-012, ALP-013 — **önce canlı doğrulama yap, sonra düzelt** (henüz teyit edilmemiş)
6. P2 listesi — büyüme sprintine

## Bu Dosyayı Güncelleme Kuralı

Her yeni AI denetimi sonunda: (1) yeni bulunan sorunları artan ID ile ekle,
(2) mevcut açık maddelerin "Son Doğrulama" tarihini güncelle, (3) bir madde
artık görünmüyorsa durumunu 🟢 yap (✅ değil — bkz. README.md).
