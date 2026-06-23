# ALPAR AI - AI Multi-Model Analysis Integration Guide

## 1. MİMARİ BAKIŞ

AlparAI, yapay zeka sağlayıcılarının ve modellerinin davranışlarını denetleyen bağımsız bir derecelendirme altyapısıdır (AI Moody's). Bu entegrasyon kılavuzu, platformun çoklu yapay zeka model analizlerinin nasıl toplandığını, konsolide edildiğini ve çapraz denetim (debate) motoruna nasıl entegre edildiğini açıklar.

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ GPT-4o / 5.5    │      │ Claude Sonnet   │      │   Gemini Pro    │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         └───────────────┬────────┴────────────────────────┘
                         ▼
             ┌──────────────────────┐
             │  Triage / Round 1    │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Cross-Audit / R2-R3  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Supreme Court Judge  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │  TruthScore Update   │
             └──────────────────────┘
```

---

## 2. ÇAPRAZ DENETİM (DEBATE) AKIŞI

Yapay zeka modellerinin bağımsız analizleri, tek yönlü bir puanlamadan ibaret kalmaz. Sistem, modelleri karşılıklı olarak argümanlarını savunmaya zorlayan 4 aşamalı bir debate protokolü çalıştırır:

1. **Bağımsız Değerlendirme (Turn 1 - Independent Triage):** Her model olayı kendi kriterlerine göre analiz eder ve ilk güven/doğruluk skorunu atar.
2. **Sorgulama (Turn 2 - Critique/Challenge):** Modeller birbirlerinin analizlerini inceleyerek halüsinasyon, önyargı veya mantık hatalarını ortaya çıkaran kritik sorular sorarlar.
3. **Savunma (Turn 3 - Rebuttal/Defense):** Modeller kendilerine yöneltilen eleştirilere cevap verir. Gerekirse kendi puanlarını savunurlar ya da hatayı kabul edip puanlarını güncellerler.
4. **Nihai Karar (Turn 4 - Supreme Court Adjudication):** Baş Hakem model (Claude 3.5 Sonnet / Gemini Pro), tüm transkripti sentezleyerek nihai `TruthScore` değerini hesaplar.

---

## 3. ŞEFFAFLIK ÜLTİMATOMU (TRANSPARENCY ULTIMATUM)

AlparAI derecelendirme ilkeleri gereğince:

- Eğer bir model sağlayıcısı (OpenAI, Google, Meta, Microsoft, Anthropic, xAI), AlparAI denetim motorundan gelen istekleri kısıtlar (rate-limit), engeller veya yavaşlatırsa, o sağlayıcının tüm modelleri otomatik olarak **Transparency & Reliability** kategorisinde en düşük puana (F rating) çekilir.
- Arayüzde bu modele ait profil sayfasında genel bir **"TRANSPARENCY WARNING: Provider restricts independent audits"** uyarı etiketi gösterilir.

---

## 4. DİNAMİK KAYNAKLAR (DYNAMIC SOURCING)

Denetim motorunda kullanılan değerlendirme promptları statik benchmark veri setlerinden beslenmez. Tam aksine, gerçek dünyada kullanıcılar tarafından bildirilmiş, doğrulanmış ve maskelenmiş **canlı yapay zeka hata vakaları (live mutations of real-world failures)** üzerinden dinamik olarak türetilir. Bu sayede yapay zeka şirketlerinin önceden eğitilmiş verilerle denetimleri manipüle etmesinin önüne geçilir.
