import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { runLiveStrategyAnalysis } from "@/actions/admin/live-strategy";
import { logger } from "@/lib/utils/logger";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "ceo")) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim (Unauthorized)" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const result = await runLiveStrategyAnalysis(body.context);
    return NextResponse.json(result);
  } catch (err) {
    logger.error(
      "[API LiveStrategy] Execution failed",
      undefined,
      err instanceof Error ? err : undefined,
    );
    return NextResponse.json(
      { success: false, message: "Sunucu hatası: Canlı strateji başlatılamadı." },
      { status: 500 },
    );
  }
}
