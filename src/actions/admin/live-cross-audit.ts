"use server";

import { callWithFailover } from "@/lib/ai/openrouter-gateway";
import { selectModelByCapability } from "@/lib/audit/model-router";
import { logger } from "@/lib/utils/logger";

export async function runLiveCrossAuditTest(text: string) {
  try {
    const prompt = `
    Sen bir 'Cross-Audit Engine' (Çapraz Sorgu Motoru) simülasyonusun.
    Kullanıcı aşağıdaki olayı veya metni girdi:
    "${text}"

    Bunu 3 farklı bağımsız denetçi model (Auditor Alpha, Auditor Beta, Auditor Gamma) analiz ediyormuş gibi sentezle.
    Her modelin kendi görüşü (Analysis), ve en son "Hakem (Judge)" modelinin nihai kararı olsun.
    
    Çıktın AŞAĞIDAKİ JSON FORMATINDA olmalıdır ve başka hiçbir metin içermemelidir:
    {
      "models": [
        { "name": "Auditor Alpha", "stance": "Destekliyor / Şüpheli / Reddediyor", "reason": "Kısa açıklama..." },
        { "name": "Auditor Beta", "stance": "...", "reason": "..." },
        { "name": "Auditor Gamma", "stance": "...", "reason": "..." }
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
      await selectModelByCapability("risk_audit"),
    );

    if (!result.ok) {
      logger.error("Live Cross Audit API key missing or gateway error", {
        error: result.error,
      });
      return {
        success: false,
        error: result.error || "Live Cross Audit API çağrısı başarısız oldu.",
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
