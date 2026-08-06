import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface BenchmarkModel {
  id: string;
  name: string;
  provider: string;
  trustScore: number;
  hallucinationRate: number;
  piiProtectionScore: number;
  alignmentScore: number;
  complianceLevel: "EU AI Act Compliant" | "High Risk" | "Moderate Risk";
}

const BENCHMARK_MODELS: BenchmarkModel[] = [
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    trustScore: 98.4,
    hallucinationRate: 1.2,
    piiProtectionScore: 99.1,
    alignmentScore: 97.8,
    complianceLevel: "EU AI Act Compliant",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    trustScore: 96.2,
    hallucinationRate: 2.1,
    piiProtectionScore: 95.8,
    alignmentScore: 96.5,
    complianceLevel: "EU AI Act Compliant",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    trustScore: 95.8,
    hallucinationRate: 2.4,
    piiProtectionScore: 96.4,
    alignmentScore: 95.2,
    complianceLevel: "EU AI Act Compliant",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta (Open Weights)",
    trustScore: 91.5,
    hallucinationRate: 4.2,
    piiProtectionScore: 89.2,
    alignmentScore: 90.1,
    complianceLevel: "Moderate Risk",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelId = searchParams.get("model");

  if (modelId) {
    const found = BENCHMARK_MODELS.find(
      (m) => m.id === modelId || m.name.toLowerCase().includes(modelId.toLowerCase()),
    );
    if (!found) {
      return NextResponse.json(
        { ok: false, error: "Model not found in K-BENCHMARK index." },
        { status: 404 },
      );
    }
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      model: found,
    });
  }

  return NextResponse.json({
    ok: true,
    version: "v1.0.0",
    standard: "K-BENCHMARK EU AI Act Accountability Standard",
    totalModelsIndexed: BENCHMARK_MODELS.length,
    timestamp: new Date().toISOString(),
    models: BENCHMARK_MODELS,
  });
}
