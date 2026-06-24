/**
 * Database row → DTO mappers.
 * Centralizes the boilerplate of casting untyped Supabase responses
 * into our strongly-typed view models.
 */

import type { IncidentCategory, IncidentSeverity, IncidentStatus } from "@/types";
import type { IncidentListItem } from "@/types";

type RawIncidentRow = Record<string, unknown> & {
  id: string;
  title_masked?: string | null;
  title?: string | null;
  title_tr?: string | null;
  description_masked?: string | null;
  description?: string | null;
  description_tr?: string | null;
  severity?: string | null;
  status?: string | null;
  category?: string | null;
  is_anonymous?: boolean | null;
  incident_date?: string | null;
  created_at?: string | null;
  views_count?: number | null;
  upvotes_count?: number | null;
  comments_count?: number | null;
  shares_count?: number | null;
  provider_name?: string | null;
  provider_slug?: string | null;
  user_id?: string | null;
  author_name?: string | null;
  ai_provider_id?: string | null;
  cross_audit_truth_score?: number | null;
  cross_audit_confidence?: number | null;
  affected_users_count?: number | null;
};

export function toIncidentListItem(row: RawIncidentRow): IncidentListItem {
  return {
    id: row.id,
    title_masked: row.title_masked ?? row.title ?? "",
    description_masked: row.description_masked ?? row.description ?? "",
    title_tr: row.title_tr ?? null,
    description_tr: row.description_tr ?? null,
    severity: row.severity as IncidentSeverity,
    status: row.status as IncidentStatus,
    category: row.category as IncidentCategory,
    is_anonymous: row.is_anonymous ?? false,
    incident_date: row.incident_date ?? row.created_at ?? "",
    created_at: row.created_at ?? "",
    view_count: row.views_count ?? 0,
    vote_count: row.upvotes_count ?? 0,
    evidence_count: row.comments_count ?? 0,
    shares_count: row.shares_count ?? 0,
    author_name: row.author_name ?? null,
    provider_name: row.provider_name ?? "",
    provider_slug: row.provider_slug ?? "",
    cross_audit_truth_score: row.cross_audit_truth_score ?? null,
    cross_audit_confidence: row.cross_audit_confidence ?? null,
    affected_count: row.affected_users_count ?? 0,
  };
}

export function toIncidentListItems(rows: unknown): IncidentListItem[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => toIncidentListItem(r as RawIncidentRow));
}
