/**
 * Supabase generated types placeholder.
 * In production, replace with: supabase gen types typescript --local
 * This is a manual subset for the core tables.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "moderator" | "admin" | "ceo";
export type IncidentStatus =
  | "pending_review"
  | "published"
  | "rejected"
  | "archived"
  | "takedown";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentCategory =
  | "hallucination"
  | "bias"
  | "privacy"
  | "security"
  | "misinformation"
  | "harassment"
  | "manipulation"
  | "inaccessibility"
  | "copyright"
  | "other";
export type SuggestionStatus =
  | "open"
  | "under_review"
  | "planned"
  | "in_progress"
  | "completed"
  | "declined";
export type TakedownStatus =
  | "received"
  | "under_review"
  | "approved"
  | "rejected"
  | "escalated";
export type EvidenceKind =
  | "screenshot"
  | "video"
  | "document"
  | "url"
  | "transcript"
  | "other";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          is_verified: boolean;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          is_verified?: boolean;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      ai_providers: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          website_url: string | null;
          contact_email: string | null;
          logo_url: string | null;
          is_verified: boolean;
          created_at: string;
        };
      };
      ai_models: {
        Row: {
          id: string;
          provider_id: string;
          name: string;
          version: string | null;
          released_at: string | null;
          status: string;
          created_at: string;
        };
      };
      incidents: {
        Row: {
          id: string;
          user_id: string | null;
          is_anonymous: boolean;
          title: string;
          description: string;
          title_masked: string | null;
          description_masked: string | null;
          ai_provider_id: string | null;
          ai_model_id: string | null;
          category: IncidentCategory;
          severity: IncidentSeverity;
          incident_date: string | null;
          location_country: string | null;
          language: string;
          status: IncidentStatus;
          moderator_id: string | null;
          moderator_notes: string | null;
          moderation_note: string | null;
          moderated_at: string | null;
          reviewed_at: string | null;
          published_at: string | null;
          views_count: number;
          upvotes_count: number;
          shares_count: number;
          comments_count: number;
          source_url: string | null;
          ip_hash: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["incidents"]["Row"],
          | "id"
          | "created_at"
          | "updated_at"
          | "views_count"
          | "upvotes_count"
          | "shares_count"
          | "comments_count"
          | "status"
          | "moderator_id"
          | "moderator_notes"
          | "moderation_note"
          | "moderated_at"
          | "reviewed_at"
          | "published_at"
          | "title_masked"
          | "description_masked"
        > & {
          title_masked?: string | null;
          description_masked?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["incidents"]["Insert"]>;
      };
      evidence: {
        Row: {
          id: string;
          incident_id: string;
          kind: EvidenceKind;
          file_path: string;
          file_name: string;
          file_size_bytes: number | null;
          mime_type: string | null;
          sha256_hash: string | null;
          width_px: number | null;
          height_px: number | null;
          contains_pii: boolean;
          pii_categories: string[] | null;
          uploaded_at: string;
        };
      };
      ai_provider_responses: {
        Row: {
          id: string;
          incident_id: string;
          ai_provider_id: string;
          response_text: string;
          responder_name: string;
          responder_role: string | null;
          responder_email: string;
          is_official: boolean;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
        };
      };
      suggestions: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string;
          category: string;
          status: SuggestionStatus;
          upvotes_count: number;
          comments_count: number;
          is_anonymous: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      suggestion_votes: {
        Row: {
          user_id: string;
          suggestion_id: string;
          created_at: string;
        };
      };
      consent_log: {
        Row: {
          id: string;
          user_id: string | null;
          consent_type: string;
          consent_text_snapshot: string;
          granted: boolean;
          ip_hash: string | null;
          user_agent: string | null;
          related_entity_type: string | null;
          related_entity_id: string | null;
          created_at: string;
        };
      };
      takedown_requests: {
        Row: {
          id: string;
          incident_id: string | null;
          requester_name: string;
          requester_email: string;
          requester_organization: string | null;
          reason: string;
          legal_basis: string | null;
          evidence_url: string | null;
          status: TakedownStatus;
          assigned_moderator_id: string | null;
          resolution_notes: string | null;
          resolved_at: string | null;
          sla_due_at: string;
          created_at: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          before_data: Json | null;
          after_data: Json | null;
          ip_hash: string | null;
          created_at: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_moderator: { Args: { uid: string }; Returns: boolean };
      is_admin: { Args: { uid: string }; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      incident_status: IncidentStatus;
      incident_severity: IncidentSeverity;
      incident_category: IncidentCategory;
      suggestion_status: SuggestionStatus;
      takedown_status: TakedownStatus;
      evidence_kind: EvidenceKind;
    };
  };
}
