import { redirect } from "next/navigation";

export default async function AdminCockpitRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin`);
}

export const metadata = {
  title: "ALPAR AI",
  description: "The trust infrastructure for AI accountability.",
};
