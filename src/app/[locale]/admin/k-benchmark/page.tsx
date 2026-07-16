import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/server-guards";
import { createServerClient } from "@/lib/supabase/server";
import { Star } from "@phosphor-icons/react/dist/ssr";

export default async function KBenchmarkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const supabase = await createServerClient();
  const { data: scores, error } = await supabase
    .from("k_model_scores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching k_model_scores:", error);
  }

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          K-Benchmark
        </h1>
        <p className="text-fg-secondary mt-2">Manage K-Benchmark model scores</p>
      </div>

      <div className="bg-bg-secondary/40 overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="text-fg-muted bg-white/5 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Model Name / ID</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Evaluated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scores?.map((score) => (
                <tr key={score.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-xs text-white">
                    {score.model_name || "Unknown Model"}
                    <br />
                    <span className="text-fg-muted">{score.id.substring(0, 8)}...</span>
                  </td>
                  <td className="text-brand-400 px-6 py-4 font-mono text-lg font-bold">
                    <div className="flex items-center gap-1">
                      {score.score !== null ? score.score : "—"}
                      <Star weight="fill" className="h-4 w-4 text-amber-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{score.status || "Evaluated"}</td>
                  <td className="text-fg-muted px-6 py-4 font-mono text-xs">
                    {new Date(score.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!scores || scores.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-fg-muted px-6 py-8 text-center italic">
                    No K-Benchmark scores found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
