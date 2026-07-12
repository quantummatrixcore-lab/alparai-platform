"use server";

import OpenAI from "openai";

export async function runLiveCrossAuditTest(text: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENAI_API_KEY bulunamadı." };
  }

  const openai = new OpenAI({ apiKey });

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const rawText = response.choices[0]?.message.content?.trim() || "{}";

    const parsed = JSON.parse(rawText);
    return { success: true, data: parsed };
  } catch (err: unknown) {
    console.error("Live Cross-Audit Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.",
    };
  }
}
