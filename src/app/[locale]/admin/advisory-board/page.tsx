import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/server-guards";
import { createServerClient } from "@/lib/supabase/server";
import { WarningCircle, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export default async function AdvisoryBoardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  const supabase = await createServerClient();
  const { data: members, error } = await supabase
    .from("advisory_board")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching advisory board:", error);
  }

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
          Advisory Board
        </h1>
        <p className="text-fg-secondary mt-2">L1 candidate/consent tracking (Rule #21)</p>
      </div>

      <div className="bg-bg-secondary/40 overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl">
        <div className="border-b border-white/5 bg-white/5 p-4">
          <p className="text-fg-muted flex items-center gap-2 text-sm">
            <WarningCircle weight="fill" className="text-amber-400" />
            <strong>Rule #21:</strong> Names remain unpublished until written consent is archived.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="text-fg-muted bg-white/5 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Name / ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Consent Archived</th>
                <th className="px-6 py-4">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members?.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-xs text-white">
                    {member.name || "Anonymous Candidate"}
                    <br />
                    <span className="text-fg-muted">{member.id.substring(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {member.status === "active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                        <CheckCircle weight="fill" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
                        Candidate
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {member.consent_archived ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-rose-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {member.is_published ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-fg-muted">No</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!members || members.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-fg-muted px-6 py-8 text-center italic">
                    No advisory board members found
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
