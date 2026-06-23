# ALPAR AI — Çoklu Yapay Zeka Denetim Sistemi

Bu klasör, farklı AI modellerinin (Claude, GPT, Gemini, vb.) ALPAR AI üzerinde yaptığı
360° denetimleri **standart, kıyaslanabilir ve takip edilebilir** hâle getirmek için
tasarlandı. Hedef: aynı bug'ın 4 ayrı denetim turunda 4 kez yeniden "keşfedilip"
hiçbir zaman kapanmaması döngüsünü kırmak.

## Neden Bu Sisteme İhtiyaç Var?

Serbest metin denetim raporları (PDF, sohbet çıktısı, dashboard görseli vb.) her AI
modelinde farklı kelimelerle yazılır. Bir kod ajanı (Antigravity) bu raporları okuduğunda,
"bu, geçen ayki ile aynı sorun mu?" sorusunu güvenilir şekilde cevaplayamaz. Sonuç:
aynı kök neden farklı şekillerde yamalanır, hiçbiri kalıcı olarak doğrulanmaz, ve
sorun tekrar tekrar açılır.

**Çözüm:** her sorun bir kez sabit bir ID alır (`ALP-001`, `ALP-002`, …) ve bu ID'nin
durumu tek bir dosyada (`MASTER_CHECKLIST.md`) yaşar. Ham denetim raporları arşiv
amaçlıdır; **Antigravity'nin okuması gereken dosya `MASTER_CHECKLIST.md`'dir.**

## Klasör Yapısı

```
ai-audits/
├── README.md                  ← bu dosya
├── AUDIT_TEMPLATE.md          ← her yeni AI denetiminin doldurması gereken şablon
├── MASTER_CHECKLIST.md        ← TEK doğruluk kaynağı: canlı, sabit-ID'li sorun listesi
├── reports/
│   └── 2026-06-23_claude-sonnet-4.6_v6.md   ← her denetimin tam çıktısı (arşiv)
└── scripts/
    └── smoke-test-p0.sh       ← P0 maddelerini otomatik kontrol eden örnek script
```

## İş Akışı

1. **Yeni bir AI modeline denetim yaptırdığınızda:** çıktısını `AUDIT_TEMPLATE.md`
   formatına uydurun (veya AI'a doğrudan bu şablonu kullanmasını söyleyin) ve
   `reports/{tarih}_{model}_v{n}.md` olarak kaydedin.
2. **Aynı oturumda `MASTER_CHECKLIST.md`'yi güncelleyin:**
   - Yeni bir sorun bulunduysa → yeni satır, yeni ID (artan sırada).
   - Bilinen bir sorun hâlâ açıksa → "Son Doğrulama" tarihini güncelleyin, durumu değiştirmeyin.
   - Bilinen bir sorun artık görünmüyorsa → durumu 🟢 _Düzeltildi-doğrulanmadı_ yapın (aşağıdaki kurala bakın).
3. **Antigravity'ye görev verirken** ham raporları değil, `MASTER_CHECKLIST.md`'deki
   açık (🔴/🟡) satırları referans gösterin.
4. **Antigravity bir düzeltme yaptığını bildirdiğinde**, durumu hemen ✅ yapmayın.

## Kritik Kural: "Düzeltildi" İki Aşamalıdır

| Durum                        | Kim verir?                                                      | Anlamı                                                |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| 🔴 / 🟡 Açık                 | Herhangi bir denetim                                            | Sorun hâlâ var veya henüz kontrol edilmedi            |
| 🟢 Düzeltildi — doğrulanmadı | Kod ajanı (Antigravity) bir fix yaptığını bildirdiğinde         | "Yapıldı dendi" — ama henüz BAĞIMSIZ olarak görülmedi |
| ✅ Düzeltildi — doğrulandı   | Yalnızca bir SONRAKİ bağımsız AI denetimi, canlı sitede görerek | Gerçekten kapandı                                     |

Bu ayrım olmadan, bir kod ajanının "tamamlandı" demesi ile sorunun gerçekten
production'da çözülmüş olması karıştırılır — ki bu raporun 2.7. Bölümünde tespit
edilen tekrarlayan-bug döngüsünün tam olarak nedeni budur.

## Antigravity'ye Verilecek Örnek Talimat

> "MASTER_CHECKLIST.md dosyasındaki 🔴 durumundaki tüm maddeleri öncelik sırasıyla
> (P0 → P1 → P2) çöz. Her madde için: (1) kök nedeni düzelt, (2) durumu 🟢 yap,
> (3) `scripts/smoke-test-p0.sh` içindeki ilgili kontrolü ekle/güncelle. Hiçbir
> maddeyi kendi başına ✅ olarak işaretleme."
