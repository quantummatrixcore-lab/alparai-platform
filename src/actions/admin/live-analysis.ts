"use server";

import OpenAI from "openai";
import { logger } from "@/lib/utils/logger";

export async function runLiveSystemAnalysis() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENAI_API_KEY bulunamadı." };
  }

  const openai = new OpenAI({ apiKey });

  try {
    const prompt = `
    Sen ALPAR AI platformunun 'Acımasız Testçisi' (QA Architect) olarak hareket eden bir yapay zeka modelisin.
    Senden şu anki sistem durumunu ve genel yapıyı analiz edip (mock) sistem inceleme raporu oluşturmanı istiyorum.
    (Not: Bu, yöneticiler için canlı sistem durumunu analiz ediyormuş gibi görünen ve güncel tavsiyeler veren bir simülasyondur).
    
    Lütfen şu 4 ana başlıkta bir JSON çıktısı dön:
    - overall_score (0-100 arası bir sayı)
    - executive_summary (Kısa bir özet)
    - security_flaws (Tespit edilen 2-3 güvenlik açığı veya riski)
    - recommendations (Tavsiye edilen 2 çözüm)
    
    Çıktın SADECE geçerli bir JSON olmalıdır. Başka hiçbir açıklama yazma.
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
    logger.error("Live Analysis Error:", undefined, err instanceof Error ? err : undefined);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.",
    };
  }
}
