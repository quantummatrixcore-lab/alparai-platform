import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { ApiManagementHub } from "@/components/admin/api-management/api-hub";
import { Zap } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return { title: `API Management Hub | ALPAR AI Admin` };
}

export default async function ApiManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin();

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-white drop-shadow-md">
          <Zap className="text-brand-400 h-8 w-8" />
          API Management Hub
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Live API provider status, model health monitoring, quota tracking, and usage analytics
        </p>
      </div>

      <ApiManagementHub />
    </div>
  );
}
