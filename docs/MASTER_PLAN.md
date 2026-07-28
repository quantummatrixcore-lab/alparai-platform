# ALPAR AI — Master Plan

Bu belge artık kısa tutuluyor: yalnızca "şu an neredeyiz" ve "sıradaki işler" burada. Geçmişteki tüm detaylı kayıtlar (v11.44'ten öncekiler dahil, hiçbir şey silinmedi) `docs/MASTER_PLAN_ARCHIVE.md` dosyasına taşındı. Belge her güncellemede şişip pahalılaşmasın diye bu değişiklik yapıldı — Founder'ın talebi üzerine.

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
