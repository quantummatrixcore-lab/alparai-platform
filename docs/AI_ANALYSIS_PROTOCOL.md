# 🏛️ ALPAR AI — Çoklu Model Analiz Protokolü

## Sürüm: 1.0 | Haziran 2026

### 1. ANALİZ AKIŞI

[1] Her AI modelden aynı prompt ile analiz al
[2] Yanıtları standart formatta kaydet
[3] Çakışan veya tutarsız bulguları işaretle
[4] Konsolide rapor oluştur
[5] Google Antigravity'e gönder

### 2. PROMPT STANDARTI

```
ROL: Sen bir platform kalite müfettişisin.
GÖREV: Aşağıdaki platform durum raporunu analiz et.
FORMAT:
  - Güçlü Yönler (en az 3)
  - Zayıf Yönler (en az 3)
  - Kritik Sorunlar (en az 2)
  - Öneriler (öncelik sıralı)
  - Puanlama (100 üzerinden, gerekçeli)
KISIT: Teknik jargon kullanma, eyleme dönük öneriler ver.
```

### 3. MODEL SPESİFİKASYONLARI

| Model             | Güçlü Alan       | Zayıf Alan  | Kullanım Amacı             |
| ----------------- | ---------------- | ----------- | -------------------------- |
| Gemini 2.5 Pro    | Kod, analiz      | Yaratıcılık | Teknik analiz, kod üretimi |
| Claude 3.5 Sonnet | Yazı, mantık     | Hız         | İçerik analizi, strateji   |
| GPT-4o            | Genel, çok yönlü | Maliyet     | Genel değerlendirme        |
| DeepSeek          | Maliyet, kod     | İngilizce   | Hızlı tarama, kod          |
| Perplexity        | Araştırma        | Derinlik    | Kaynak tarama              |

### 4. KONSOLİDASYON KURALLARI

- 3+ model aynı bulguyu işaretliyorsa → KRİTİK
- 2 model işaretliyorsa → ÖNEMLİ
- 1 model işaretliyorsa → DEĞERLENDİR
- Hiçbir model işaretlemiyorsa → GÖZ ARDI ET (yok say)

### 5. ANTIGRAVITY ENTEGRASYONU

- Konsolide raporu Antigravity prompt'una dönüştür
- Her aksiyon için: Dosya, Satır, Değişiklik açıkla
- Test senaryolarını ekle
- Geri bildirim döngüsü oluştur

---

# Çoklu Model Analiz Kontrol Listesi

## Her Analiz Öncesi

- [ ] Tüm modellerin API key'leri aktif mi?
- [ ] Rate limit kontrolü yapıldı mı?
- [ ] Prompt versiyonu güncel mi?
- [ ] Çıktı formatı standart mı?

## Analiz Sırasında

- [ ] Her modelden yanıt alındı mı?
- [ ] Yanıtlar zaman damgalı mı?
- [ ] Tutarsızlıklar not edildi mi?

## Analiz Sonrası

- [ ] Konsolide rapor oluşturuldu mu?
- [ ] Çakışan bulgular çözüldü mu?
- [ ] Antigravity prompt'u hazırlandı mı?
- [ ] Test planı eklendi mi?

## Antigravity Sonrası

- [ ] Değişiklikler test edildi mi?
- [ ] Regresyon testi yapıldı mı?
- [ ] Canlıya alma onayı alındı mı?
