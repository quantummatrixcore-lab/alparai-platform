import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { getCurrentUser } from "@/lib/auth/session";
import { getInnovations, getExternalQueue, getConnectorStatuses } from "@/actions/innovations";
import { InnovationsClient } from "@/components/admin/innovations-client";
import type { ExternalIncidentQueueItem, StrategyInnovation } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("innovations") || "Innovations" };
}

export default async function AdminInnovationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/auth/signin?next=/${locale}/admin/innovations`);

  // Only CEO and Admin can access Innovations Hub
  if (user.role !== "admin" && user.role !== "ceo") {
    redirect(`/${locale}/admin`);
  }

  const [innovationsData, queueData, connectorsData] = await Promise.all([
    getInnovations(),
    getExternalQueue(),
    getConnectorStatuses(),
  ]);

  // Filter queue items to only show pending ones
  const pendingQueue = (queueData || []).filter(
    (item) => item.status === "pending",
  ) as ExternalIncidentQueueItem[];
  const initialInnovations = (innovationsData || []) as StrategyInnovation[];

  return (
    <div className="min-h-screen bg-black p-6"><div className="bg-zinc-900/40 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl shadow-2xl p-8">
      <div className="min-h-screen rounded-3xl bg-zinc-900/40 p-6 py-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl md:p-8">
      <Container>
        <InnovationsClient
          initialInnovations={initialInnovations}
          initialQueue={pendingQueue}
          initialConnectors={connectorsData}
          locale={locale}
        />
      </Container>
    </div>
      </div></div>
  );
}
