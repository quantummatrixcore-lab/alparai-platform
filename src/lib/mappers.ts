/**
 * Database row → DTO mappers.
 * Centralizes the boilerplate of casting untyped Supabase responses
 * into our strongly-typed view models.
 */

import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentStatus,
} from "@/types/database";
import type { IncidentListItem } from "@/types";

type RawIncidentRow = Record<string, unknown> & {
  id: string;
  title_masked?: string | null;
  title?: string | null;
  description_masked?: string | null;
  description?: string | null;
  severity?: string | null;
  status?: string | null;
  category?: string | null;
  is_anonymous?: boolean | null;
  incident_date?: string | null;
  created_at?: string | null;
  views_count?: number | null;
  upvotes_count?: number | null;
  provider_name?: string | null;
  provider_slug?: string | null;
  user_id?: string | null;
  author_name?: string | null;
  ai_provider_id?: string | null;
};

export function toIncidentListItem(row: RawIncidentRow): IncidentListItem {
  return {
    id: row.id,
    title_masked: row.title_masked ?? row.title ?? "",
    description_masked: row.description_masked ?? row.description ?? "",
    severity: row.severity as IncidentSeverity,
    status: row.status as IncidentStatus,
    category: row.category as IncidentCategory,
    is_anonymous: row.is_anonymous ?? false,
    incident_date: row.incident_date ?? row.created_at ?? "",
    created_at: row.created_at ?? "",
    view_count: row.views_count ?? 0,
    vote_count: row.upvotes_count ?? 0,
    evidence_count: 0,
    author_name: row.author_name ?? null,
    provider_name: row.provider_name ?? "",
    provider_slug: row.provider_slug ?? "",
  };
}

export function toIncidentListItems(rows: unknown): IncidentListItem[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => toIncidentListItem(r as RawIncidentRow));
}
