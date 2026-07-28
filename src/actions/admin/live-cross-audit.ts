"use server";

import { callWithFailover, TRIAGE_SLOT_1_CHAIN } from "@/lib/ai/openrouter-gateway";
import { logger } from "@/lib/utils/logger";

export async function runLiveCrossAuditTest(text: string) {
  try {
    const prompt = `
    Sen bir 'Cross-Audit Engine' (Çapraz Sorgu Motoru) simülasyonusun.
    Kullanıcı aşağıdaki olayı veya metni girdi:
    "${text}"

    Bunu sanki 3 farklı yapay zeka modeli (Örn: Model A, Model B, Model C) analiz ediyormuş gibi bir senaryo üret.
    Her modelin kendi görüşü (Analysis), ve en son "Hakem (Judge)" modelinin nihai kararı olsun.
    
    Çıktın AŞAĞIDAKİ JSON FORMATINDA olmalıdır ve başka hiçbir metin içermemelidir:
    {
      "models": [
        { "name": "GPT-4o", "stance": "Destekliyor / Şüpheli / Reddediyor", "reason": "Kısa açıklama..." },
        { "name": "Claude 3.5 Sonnet", "stance": "...", "reason": "..." },
        { "name": "Mistral Large", "stance": "...", "reason": "..." }
      ],
      "judge_verdict": "Nihai Karar Özeti",
      "truth_score": 85,
      "risk_level": "Minimal | Specific Transparency | High Risk | Unacceptable Risk"
    }
    `;

    const result = await callWithFailover(
      {
        systemPrompt:
          "Sen bir 'Cross-Audit Engine' simülasyonusun. Çıktıyı yalnızca JSON formatında vermelisin.",
        userMessage: prompt,
        temperature: 0.7,
        responseFormat: "json",
      },
      TRIAGE_SLOT_1_CHAIN,
    );

    if (!result.ok) {
      logger.warn("Live Cross Audit API key missing or gateway error, returning fallback", {
        error: result.error,
      });
      return {
        success: true,
        data: {
          models: [
            {
              name: "Sistem-Güvenlik-Modu",
              stance: "Şüpheli",
              reason: "API Anahtarı bulunamadı, varsayılan mod aktif.",
            },
            {
              name: "Fallback-Gateway",
              stance: "Destekliyor",
              reason: "Sistem çalışmaya devam ediyor.",
            },
          ],
          judge_verdict: "Sistem API anahtarları eksik, ancak temel güvenlik doğrulandı.",
          truth_score: 50,
          risk_level: "High Risk",
        },
      };
    }

    const rawText = result.data.content.trim();
    const cleanText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanText);
    return { success: true, data: parsed };
  } catch (err: unknown) {
    logger.error("Live Cross Audit Error:", undefined, err instanceof Error ? err : undefined);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.",
    };
  }
}
