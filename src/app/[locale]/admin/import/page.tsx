import React from "react";
import { setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { createServerClient } from "@/lib/supabase/server";
import { ImportQueueClient, type ImportedIncident } from "@/components/admin/import-queue-client";
import { Container } from "@/components/ui/layout";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return {
    title: "AI Incident Import Queue | ALPAR AI Admin",
  };
}

export default async function AdminImportPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // CEO / Admin role check
  await requireAdmin();

  const supabase = await createServerClient();

  // Fetch all pending imported incidents
  const { data: pendingIncidents, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("status", "pending_review")
    .in("incident_source", ["aiaaic_import", "aiid_import"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load imported incidents:", error.message);
  }

  return (
    <Container className="py-8">
      <ImportQueueClient
        initialIncidents={(pendingIncidents as unknown as ImportedIncident[]) || []}
        locale={locale}
      />
    </Container>
  );
}
