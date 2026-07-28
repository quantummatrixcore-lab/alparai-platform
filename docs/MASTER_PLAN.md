# ALPAR AI — Master Plan

Bu belge artık kısa tutuluyor: yalnızca "şu an neredeyiz" ve "sıradaki işler" burada. Geçmişteki tüm detaylı kayıtlar `docs/MASTER_PLAN_ARCHIVE.md` dosyasında. Belge her güncellemede şişip pahalılaşmasın diye bu değişiklik yapıldı — Founder'ın açık talebi üzerine.

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
