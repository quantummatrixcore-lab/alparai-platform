"use server";

import OpenAI from "openai";

export async function runLiveStrategyAnalysis(context: {
  strengths: number;
  weaknesses: number;
  opportunities: number;
  threats: number;
  highRisks: number;
  activeRisks: number;
  doneMilestones: number;
  totalMilestones: number;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENAI_API_KEY bulunamadı." };
  }

  const openai = new OpenAI({ apiKey });

  try {
    const prompt = `
    Sen ALPAR AI platformunun 'Strateji Danışmanı' (Strategy AI) olarak hareket eden bir yapay zeka modelisin.
    Mevcut strateji metrikleri şunlardır:
    - SWOT: Güçlü Yönler: ${context.strengths}, Zayıf Yönler: ${context.weaknesses}, Fırsatlar: ${context.opportunities}, Tehditler: ${context.threats}
    - Riskler: Yüksek Risk: ${context.highRisks}, Aktif Risk: ${context.activeRisks}
    - Kilometre Taşları: Tamamlanan: ${context.doneMilestones} / Toplam: ${context.totalMilestones}

    Lütfen bu metrikleri analiz ederek bir durum raporu (mock) oluştur.
    
    Lütfen şu 4 ana başlıkta bir JSON çıktısı dön:
    - health_score (0-100 arası bir sayı)
    - executive_summary (Kısa bir özet)
    - strategic_gaps (Tespit edilen 2-3 stratejik boşluk veya zayıflık)
    - recommendations (Tavsiye edilen 2 stratejik hamle)
    
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
    console.error("Live Strategy Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu.",
    };
  }
}
