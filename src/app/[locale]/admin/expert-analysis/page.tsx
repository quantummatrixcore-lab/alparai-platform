import { requireAdmin } from "@/lib/auth/session";
import { ExpertAnalysisBoard } from "@/components/admin/expert-analysis-board";

export default async function ExpertAnalysisAdminPage() {
  await requireAdmin();
  return <ExpertAnalysisBoard />;
}
