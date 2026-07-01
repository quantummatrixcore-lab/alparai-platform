/**
 * Incident importer — bulk upsert pipeline.
 *
 * Takes parsed ImportIncidentRow[] from csv-parser.ts,
 * applies PII masking, and upserts into the `incidents` table
 * via the Supabase admin client (RLS bypass).
 *
 * Runs in batches of 50 to respect Supabase's insert limits.
 * Rate limits are irrelevant here — we use the service role client directly.
 */

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { maskPII } from "@/lib/pii/guardian";
import { logger } from "@/lib/utils/logger";
import type { ImportIncidentRow, IncidentSource } from "./csv-parser";

const BATCH_SIZE = 50;

export interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export async function importIncidents(
  rows: ImportIncidentRow[],
  source: IncidentSource,
): Promise<ImportResult> {
  const result: ImportResult = { inserted: 0, updated: 0, skipped: 0, errors: [] };

  if (rows.length === 0) return result;

  const admin = createAdminClient();

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const records = batch.map((row) => {
      const titleScan = maskPII(row.title);
      const descScan = maskPII(row.description);

      const piiCategories = [
        ...new Set([
          ...titleScan.detections.map((d) => d.type),
          ...descScan.detections.map((d) => d.type),
        ]),
      ];

      return {
        title: row.title,
        description: row.description,
        title_masked: titleScan.masked,
        description_masked: descScan.masked,
        contains_pii: titleScan.piiFound || descScan.piiFound,
        pii_categories: piiCategories,
        category: row.category,
        severity: row.severity,
        incident_date: row.incidentDate ?? null,
        location_country: row.locationCountry ?? null,
        source_url: row.sourceUrl ?? null,
        language: row.language,
        status: "pending_review" as const,
        is_anonymous: true,
        incident_source: source,
        import_external_id: row.externalId,
        import_attribution: row.importAttribution,
      };
    });

    const { data, error } = await admin
      .from("incidents")
      .upsert(records, {
        onConflict: "incident_source,import_external_id",
        ignoreDuplicates: false,
      })
      .select("id");

    if (error) {
      logger.error(
        "Batch import failed",
        { batchStart: i, batchSize: batch.length },
        new Error(error.message),
      );
      result.errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
      result.skipped += batch.length;
      continue;
    }

    result.inserted += data?.length ?? 0;
  }

  logger.info("Import pipeline completed", {
    source,
    inserted: result.inserted,
    skipped: result.skipped,
    errors: result.errors.length,
  });

  return result;
}
