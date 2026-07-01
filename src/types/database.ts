export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      model_reviews: {
        Row: {
          id: string;
          model_id: string;
          user_id: string | null;
          is_anonymous: boolean;
          score_overall: number;
          score_accuracy: number | null;
          score_safety: number | null;
          score_creativity: number | null;
          score_speed: number | null;
          score_value: number | null;
          title: string | null;
          body: string | null;
          status: string;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          model_id: string;
          user_id?: string | null;
          is_anonymous?: boolean;
          score_overall: number;
          score_accuracy?: number | null;
          score_safety?: number | null;
          score_creativity?: number | null;
          score_speed?: number | null;
          score_value?: number | null;
          title?: string | null;
          body?: string | null;
          status?: string;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          model_id?: string;
          user_id?: string | null;
          is_anonymous?: boolean;
          score_overall?: number;
          score_accuracy?: number | null;
          score_safety?: number | null;
          score_creativity?: number | null;
          score_speed?: number | null;
          score_value?: number | null;
          title?: string | null;
          body?: string | null;
          status?: string;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "model_reviews_model_id_fkey";
            columns: ["model_id"];
            isOneToOne: false;
            referencedRelation: "ai_models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "model_reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      model_review_votes: {
        Row: {
          user_id: string;
          review_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          review_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          review_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "model_review_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "model_review_votes_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "model_reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      model_feature_requests: {
        Row: {
          id: string;
          model_id: string;
          user_id: string | null;
          is_anonymous: boolean;
          title: string;
          description: string | null;
          category: string;
          status: string;
          votes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          model_id: string;
          user_id?: string | null;
          is_anonymous?: boolean;
          title: string;
          description?: string | null;
          category?: string;
          status?: string;
          votes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          model_id?: string;
          user_id?: string | null;
          is_anonymous?: boolean;
          title?: string;
          description?: string | null;
          category?: string;
          status?: string;
          votes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "model_feature_requests_model_id_fkey";
            columns: ["model_id"];
            isOneToOne: false;
            referencedRelation: "ai_models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "model_feature_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      model_feature_votes: {
        Row: {
          user_id: string;
          request_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          request_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          request_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "model_feature_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "model_feature_votes_request_id_fkey";
            columns: ["request_id"];
            isOneToOne: false;
            referencedRelation: "model_feature_requests";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_models: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          provider_id: string;
          released_at: string | null;
          status: string;
          version: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          provider_id: string;
          released_at?: string | null;
          status?: string;
          version?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          provider_id?: string;
          released_at?: string | null;
          status?: string;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_models_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "ai_providers";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_poll_votes: {
        Row: {
          choice: string;
          created_at: string;
          ip_hash: string;
          poll_id: string;
          user_id: string | null;
        };
        Insert: {
          choice: string;
          created_at?: string;
          ip_hash: string;
          poll_id: string;
          user_id?: string | null;
        };
        Update: {
          choice?: string;
          created_at?: string;
          ip_hash?: string;
          poll_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_poll_votes_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "ai_polls";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          locale: string | null;
          confirmed: boolean;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          locale?: string | null;
          confirmed?: boolean;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          locale?: string | null;
          confirmed?: boolean;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_tr: string;
          content_en: string;
          content_tr: string;
          status: "draft" | "published";
          generated_by: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_en: string;
          title_tr: string;
          content_en: string;
          content_tr: string;
          status?: "draft" | "published";
          generated_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_en?: string;
          title_tr?: string;
          content_en?: string;
          content_tr?: string;
          status?: "draft" | "published";
          generated_by?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      whistleblower_submissions: {
        Row: {
          id: string;
          encrypted_content: string;
          category: string;
          provider_hint: string | null;
          submitted_at: string;
          status: "pending" | "reviewing" | "verified" | "closed";
        };
        Insert: {
          id?: string;
          encrypted_content: string;
          category: string;
          provider_hint?: string | null;
          submitted_at?: string;
          status?: "pending" | "reviewing" | "verified" | "closed";
        };
        Update: {
          id?: string;
          encrypted_content?: string;
          category?: string;
          provider_hint?: string | null;
          submitted_at?: string;
          status?: "pending" | "reviewing" | "verified" | "closed";
        };
        Relationships: [];
      };
      ai_polls: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          id: string;
          is_active: boolean;
          no_count: number;
          title: string;
          unsure_count: number;
          yes_count: number;
        };
        Insert: {
          category?: string;
          created_at?: string;
          description: string;
          id?: string;
          is_active?: boolean;
          no_count?: number;
          title: string;
          unsure_count?: number;
          yes_count?: number;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          is_active?: boolean;
          no_count?: number;
          title?: string;
          unsure_count?: number;
          yes_count?: number;
        };
        Relationships: [];
      };
      ecosystem_news: {
        Row: {
          id: string;
          title_en: string;
          title_tr: string | null;
          summary_en: string | null;
          summary_tr: string | null;
          url: string | null;
          source: string | null;
          category: string;
          severity: string;
          is_featured: boolean;
          is_active: boolean;
          published_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_tr?: string | null;
          summary_en?: string | null;
          summary_tr?: string | null;
          url?: string | null;
          source?: string | null;
          category?: string;
          severity?: string;
          is_featured?: boolean;
          is_active?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_tr?: string | null;
          summary_en?: string | null;
          summary_tr?: string | null;
          url?: string | null;
          source?: string | null;
          category?: string;
          severity?: string;
          is_featured?: boolean;
          is_active?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_provider_responses: {
        Row: {
          ai_provider_id: string;
          created_at: string;
          id: string;
          incident_id: string;
          is_official: boolean;
          is_published: boolean;
          published_at: string | null;
          responder_email: string;
          responder_name: string;
          responder_role: string | null;
          response_text: string;
        };
        Insert: {
          ai_provider_id: string;
          created_at?: string;
          id?: string;
          incident_id: string;
          is_official?: boolean;
          is_published?: boolean;
          published_at?: string | null;
          responder_email: string;
          responder_name: string;
          responder_role?: string | null;
          response_text: string;
        };
        Update: {
          ai_provider_id?: string;
          created_at?: string;
          id?: string;
          incident_id?: string;
          is_official?: boolean;
          is_published?: boolean;
          published_at?: string | null;
          responder_email?: string;
          responder_name?: string;
          responder_role?: string | null;
          response_text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_provider_responses_ai_provider_id_fkey";
            columns: ["ai_provider_id"];
            isOneToOne: false;
            referencedRelation: "ai_providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_provider_responses_incident_id_fkey";
            columns: ["incident_id"];
            isOneToOne: false;
            referencedRelation: "incidents";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_providers: {
        Row: {
          contact_email: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_verified: boolean;
          logo_url: string | null;
          name: string;
          slug: string;
          website_url: string | null;
          trust_score: number;
        };
        Insert: {
          contact_email?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_verified?: boolean;
          logo_url?: string | null;
          name: string;
          slug: string;
          website_url?: string | null;
          trust_score?: number;
        };
        Update: {
          contact_email?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_verified?: boolean;
          logo_url?: string | null;
          name?: string;
          slug?: string;
          website_url?: string | null;
          trust_score?: number;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          action: string;
          actor_id: string | null;
          after_data: Json | null;
          before_data: Json | null;
          created_at: string;
          entity_id: string;
          entity_type: string;
          id: string;
          ip_hash: string | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          after_data?: Json | null;
          before_data?: Json | null;
          created_at?: string;
          entity_id: string;
          entity_type: string;
          id?: string;
          ip_hash?: string | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          after_data?: Json | null;
          before_data?: Json | null;
          created_at?: string;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          ip_hash?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      autopilot_runs: {
        Row: {
          action: string;
          attempts: number;
          created_at: string;
          duration_ms: number | null;
          id: string;
          idempotency_key: string;
          ip_hash: string | null;
          last_error: string | null;
          metadata: Json;
          result_id: string | null;
          status: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          action: string;
          attempts?: number;
          created_at?: string;
          duration_ms?: number | null;
          id?: string;
          idempotency_key: string;
          ip_hash?: string | null;
          last_error?: string | null;
          metadata?: Json;
          result_id?: string | null;
          status: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          attempts?: number;
          created_at?: string;
          duration_ms?: number | null;
          id?: string;
          idempotency_key?: string;
          ip_hash?: string | null;
          last_error?: string | null;
          metadata?: Json;
          result_id?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "autopilot_runs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      consent_log: {
        Row: {
          consent_text_snapshot: string;
          consent_type: string;
          created_at: string;
          granted: boolean;
          id: string;
          ip_hash: string | null;
          related_entity_id: string | null;
          related_entity_type: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          consent_text_snapshot: string;
          consent_type: string;
          created_at?: string;
          granted: boolean;
          id?: string;
          ip_hash?: string | null;
          related_entity_id?: string | null;
          related_entity_type?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          consent_text_snapshot?: string;
          consent_type?: string;
          created_at?: string;
          granted?: boolean;
          id?: string;
          ip_hash?: string | null;
          related_entity_id?: string | null;
          related_entity_type?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "consent_log_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      evidence: {
        Row: {
          contains_pii: boolean;
          file_name: string;
          file_path: string;
          file_size_bytes: number | null;
          height_px: number | null;
          id: string;
          incident_id: string;
          kind: Database["public"]["Enums"]["evidence_kind"];
          mime_type: string | null;
          pii_categories: string[] | null;
          sha256_hash: string | null;
          uploaded_at: string;
          width_px: number | null;
        };
        Insert: {
          contains_pii?: boolean;
          file_name: string;
          file_path: string;
          file_size_bytes?: number | null;
          height_px?: number | null;
          id?: string;
          incident_id: string;
          kind?: Database["public"]["Enums"]["evidence_kind"];
          mime_type?: string | null;
          pii_categories?: string[] | null;
          sha256_hash?: string | null;
          uploaded_at?: string;
          width_px?: number | null;
        };
        Update: {
          contains_pii?: boolean;
          file_name?: string;
          file_path?: string;
          file_size_bytes?: number | null;
          height_px?: number | null;
          id?: string;
          incident_id?: string;
          kind?: Database["public"]["Enums"]["evidence_kind"];
          mime_type?: string | null;
          pii_categories?: string[] | null;
          sha256_hash?: string | null;
          uploaded_at?: string;
          width_px?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "evidence_incident_id_fkey";
            columns: ["incident_id"];
            isOneToOne: false;
            referencedRelation: "incidents";
            referencedColumns: ["id"];
          },
        ];
      };
      incident_votes: {
        Row: {
          created_at: string;
          id: string;
          incident_id: string;
          ip_hash: string | null;
          updated_at: string;
          user_id: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          incident_id: string;
          ip_hash?: string | null;
          updated_at?: string;
          user_id: string;
          value: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          incident_id?: string;
          ip_hash?: string | null;
          updated_at?: string;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "incident_votes_incident_id_fkey";
            columns: ["incident_id"];
            isOneToOne: false;
            referencedRelation: "incidents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "incident_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      incidents: {
        Row: {
          ai_model_id: string | null;
          ai_provider_id: string | null;
          category: Database["public"]["Enums"]["incident_category"];
          comments_count: number;
          contains_pii: boolean;
          created_at: string;
          description: string;
          description_masked: string | null;
          id: string;
          incident_date: string | null;
          ip_hash: string | null;
          is_anonymous: boolean;
          language: string;
          location_country: string | null;
          moderated_at: string | null;
          moderation_note: string | null;
          moderator_id: string | null;
          moderator_notes: string | null;
          pii_categories: string[];
          published_at: string | null;
          reviewed_at: string | null;
          search_vector: unknown;
          severity: Database["public"]["Enums"]["incident_severity"];
          shares_count: number;
          source_url: string | null;
          status: Database["public"]["Enums"]["incident_status"];
          title: string;
          title_masked: string | null;
          provider_custom_name: string | null;
          model_custom_name: string | null;
          updated_at: string;
          upvotes_count: number;
          user_agent: string | null;
          user_id: string | null;
          views_count: number;
          ai_moderation_score: number | null;
          ai_moderation_reason: string | null;
          title_tr: string | null;
          description_tr: string | null;
          cross_audit_truth_score: number | null;
          cross_audit_confidence: number | null;
          cross_audit_reasoning: string | null;
          cross_audit_model: string | null;
          cross_audit_triage_models: string[] | null;
          cross_audit_completed_at: string | null;
          incident_source: string;
          import_external_id: string | null;
          import_attribution: string | null;
          is_expert: boolean;
          expert_fix: string | null;
        };
        Insert: {
          ai_model_id?: string | null;
          ai_provider_id?: string | null;
          category?: Database["public"]["Enums"]["incident_category"];
          comments_count?: number;
          contains_pii?: boolean;
          created_at?: string;
          description: string;
          description_masked?: string | null;
          id?: string;
          incident_date?: string | null;
          ip_hash?: string | null;
          is_anonymous?: boolean;
          language?: string;
          location_country?: string | null;
          moderated_at?: string | null;
          moderation_note?: string | null;
          moderator_id?: string | null;
          moderator_notes?: string | null;
          pii_categories?: string[];
          published_at?: string | null;
          reviewed_at?: string | null;
          search_vector?: unknown;
          severity?: Database["public"]["Enums"]["incident_severity"];
          shares_count?: number;
          source_url?: string | null;
          status?: Database["public"]["Enums"]["incident_status"];
          title: string;
          title_masked?: string | null;
          provider_custom_name?: string | null;
          model_custom_name?: string | null;
          updated_at?: string;
          upvotes_count?: number;
          user_agent?: string | null;
          user_id?: string | null;
          views_count?: number;
          ai_moderation_score?: number | null;
          ai_moderation_reason?: string | null;
          title_tr?: string | null;
          description_tr?: string | null;
          cross_audit_truth_score?: number | null;
          cross_audit_confidence?: number | null;
          cross_audit_reasoning?: string | null;
          cross_audit_model?: string | null;
          cross_audit_triage_models?: string[] | null;
          cross_audit_completed_at?: string | null;
          incident_source?: string;
          import_external_id?: string | null;
          import_attribution?: string | null;
          is_expert?: boolean;
          expert_fix?: string | null;
        };
        Update: {
          ai_model_id?: string | null;
          ai_provider_id?: string | null;
          category?: Database["public"]["Enums"]["incident_category"];
          comments_count?: number;
          contains_pii?: boolean;
          created_at?: string;
          description?: string;
          description_masked?: string | null;
          id?: string;
          incident_date?: string | null;
          ip_hash?: string | null;
          is_anonymous?: boolean;
          language?: string;
          location_country?: string | null;
          moderated_at?: string | null;
          moderation_note?: string | null;
          moderator_id?: string | null;
          moderator_notes?: string | null;
          pii_categories?: string[];
          published_at?: string | null;
          reviewed_at?: string | null;
          search_vector?: unknown;
          severity?: Database["public"]["Enums"]["incident_severity"];
          shares_count?: number;
          source_url?: string | null;
          status?: Database["public"]["Enums"]["incident_status"];
          title?: string;
          title_masked?: string | null;
          provider_custom_name?: string | null;
          model_custom_name?: string | null;
          updated_at?: string;
          upvotes_count?: number;
          user_agent?: string | null;
          user_id?: string | null;
          views_count?: number;
          ai_moderation_score?: number | null;
          ai_moderation_reason?: string | null;
          title_tr?: string | null;
          description_tr?: string | null;
          cross_audit_truth_score?: number | null;
          cross_audit_confidence?: number | null;
          cross_audit_reasoning?: string | null;
          cross_audit_model?: string | null;
          cross_audit_triage_models?: string[] | null;
          cross_audit_completed_at?: string | null;
          incident_source?: string;
          import_external_id?: string | null;
          import_attribution?: string | null;
          is_expert?: boolean;
          expert_fix?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "incidents_ai_model_id_fkey";
            columns: ["ai_model_id"];
            isOneToOne: false;
            referencedRelation: "ai_models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "incidents_ai_provider_id_fkey";
            columns: ["ai_provider_id"];
            isOneToOne: false;
            referencedRelation: "ai_providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "incidents_moderator_id_fkey";
            columns: ["moderator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "incidents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      suggestion_votes: {
        Row: {
          created_at: string;
          suggestion_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          suggestion_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          suggestion_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey";
            columns: ["suggestion_id"];
            isOneToOne: false;
            referencedRelation: "suggestions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "suggestion_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      suggestions: {
        Row: {
          category: string;
          comments_count: number;
          created_at: string;
          description: string;
          id: string;
          is_anonymous: boolean;
          status: Database["public"]["Enums"]["suggestion_status"];
          title: string;
          updated_at: string;
          upvotes_count: number;
          user_id: string | null;
        };
        Insert: {
          category?: string;
          comments_count?: number;
          created_at?: string;
          description: string;
          id?: string;
          is_anonymous?: boolean;
          status?: Database["public"]["Enums"]["suggestion_status"];
          title: string;
          updated_at?: string;
          upvotes_count?: number;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          comments_count?: number;
          created_at?: string;
          description?: string;
          id?: string;
          is_anonymous?: boolean;
          status?: Database["public"]["Enums"]["suggestion_status"];
          title?: string;
          updated_at?: string;
          upvotes_count?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "suggestions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      takedown_requests: {
        Row: {
          assigned_moderator_id: string | null;
          country: string | null;
          created_at: string;
          details: string | null;
          evidence_url: string | null;
          id: string;
          identity_proof_url: string | null;
          incident_id: string | null;
          ip_address: unknown;
          legal_basis: string | null;
          organization: string | null;
          reason: string;
          requester_email: string;
          requester_name: string;
          requester_organization: string | null;
          resolution_notes: string | null;
          resolved_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          sla_due_at: string;
          status: Database["public"]["Enums"]["takedown_status"];
          target_url: string | null;
          user_id: string | null;
        };
        Insert: {
          assigned_moderator_id?: string | null;
          country?: string | null;
          created_at?: string;
          details?: string | null;
          evidence_url?: string | null;
          id?: string;
          identity_proof_url?: string | null;
          incident_id?: string | null;
          ip_address?: unknown;
          legal_basis?: string | null;
          organization?: string | null;
          reason: string;
          requester_email: string;
          requester_name: string;
          requester_organization?: string | null;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          sla_due_at?: string;
          status?: Database["public"]["Enums"]["takedown_status"];
          target_url?: string | null;
          user_id?: string | null;
        };
        Update: {
          assigned_moderator_id?: string | null;
          country?: string | null;
          created_at?: string;
          details?: string | null;
          evidence_url?: string | null;
          id?: string;
          identity_proof_url?: string | null;
          incident_id?: string | null;
          ip_address?: unknown;
          legal_basis?: string | null;
          organization?: string | null;
          reason?: string;
          requester_email?: string;
          requester_name?: string;
          requester_organization?: string | null;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          sla_due_at?: string;
          status?: Database["public"]["Enums"]["takedown_status"];
          target_url?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "takedown_requests_assigned_moderator_id_fkey";
            columns: ["assigned_moderator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "takedown_requests_incident_id_fkey";
            columns: ["incident_id"];
            isOneToOne: false;
            referencedRelation: "incidents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "takedown_requests_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "takedown_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      user_badges: {
        Row: {
          awarded_at: string;
          badge_icon: string;
          badge_name: string;
          description: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          awarded_at?: string;
          badge_icon: string;
          badge_name: string;
          description?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          awarded_at?: string;
          badge_icon?: string;
          badge_name?: string;
          description?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          badges: string[];
          bio: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          is_verified: boolean;
          locale: string;
          reputation_score: number;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          badges?: string[];
          bio?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          is_verified?: boolean;
          locale?: string;
          reputation_score?: number;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          badges?: string[];
          bio?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          is_verified?: boolean;
          locale?: string;
          reputation_score?: number;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      strategy_swot_items: {
        Row: {
          id: string;
          category: "strength" | "weakness" | "opportunity" | "threat";
          title: string;
          description: string | null;
          weight: "low" | "medium" | "high";
          owner_user_id: string | null;
          action_plan: string | null;
          target_date: string | null;
          status: "active" | "done" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: "strength" | "weakness" | "opportunity" | "threat";
          title: string;
          description?: string | null;
          weight?: "low" | "medium" | "high";
          owner_user_id?: string | null;
          action_plan?: string | null;
          target_date?: string | null;
          status?: "active" | "done" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: "strength" | "weakness" | "opportunity" | "threat";
          title?: string;
          description?: string | null;
          weight?: "low" | "medium" | "high";
          owner_user_id?: string | null;
          action_plan?: string | null;
          target_date?: string | null;
          status?: "active" | "done" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_swot_items_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      strategy_risks: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
          probability: number;
          impact: number;
          owner_user_id: string | null;
          mitigation_plan: string | null;
          target_date: string | null;
          status: "active" | "mitigated" | "triggered" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          description?: string | null;
          probability: number;
          impact: number;
          owner_user_id?: string | null;
          mitigation_plan?: string | null;
          target_date?: string | null;
          status?: "active" | "mitigated" | "triggered" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          description?: string | null;
          probability?: number;
          impact?: number;
          owner_user_id?: string | null;
          mitigation_plan?: string | null;
          target_date?: string | null;
          status?: "active" | "mitigated" | "triggered" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_risks_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      strategy_valuations: {
        Row: {
          id: string;
          method: "berkus" | "scorecard" | "vc" | "average";
          inputs: Json;
          result_pre_money: number;
          notes: string | null;
          snapshot_date: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          method: "berkus" | "scorecard" | "vc" | "average";
          inputs?: Json;
          result_pre_money: number;
          notes?: string | null;
          snapshot_date?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          method?: "berkus" | "scorecard" | "vc" | "average";
          inputs?: Json;
          result_pre_money?: number;
          notes?: string | null;
          snapshot_date?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_valuations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      strategy_milestones: {
        Row: {
          id: string;
          quarter: string;
          title: string;
          okr_text: string | null;
          progress: number;
          status: "planned" | "in_progress" | "done" | "missed";
          linked_metric: string | null;
          owner_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quarter: string;
          title: string;
          okr_text?: string | null;
          progress?: number;
          status?: "planned" | "in_progress" | "done" | "missed";
          linked_metric?: string | null;
          owner_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quarter?: string;
          title?: string;
          okr_text?: string | null;
          progress?: number;
          status?: "planned" | "in_progress" | "done" | "missed";
          linked_metric?: string | null;
          owner_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "strategy_milestones_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      strategy_metrics_snapshots: {
        Row: {
          id: string;
          snapshot_date: string;
          total_users: number;
          total_incidents: number;
          active_providers: number;
          media_mentions_count: number;
          mrr_cents: number;
          runway_months: number | null;
          health_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          snapshot_date?: string;
          total_users?: number;
          total_incidents?: number;
          active_providers?: number;
          media_mentions_count?: number;
          mrr_cents?: number;
          runway_months?: number | null;
          health_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          snapshot_date?: string;
          total_users?: number;
          total_incidents?: number;
          active_providers?: number;
          media_mentions_count?: number;
          mrr_cents?: number;
          runway_months?: number | null;
          health_score?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      bug_bounties: {
        Row: {
          id: string;
          incident_id: string;
          reporter_id: string;
          provider_id: string | null;
          status: string;
          severity_score: number;
          estimated_reward_cents: number | null;
          actual_reward_cents: number | null;
          badge_awarded: boolean;
          notes: string | null;
          validated_by: string | null;
          validated_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          incident_id: string;
          reporter_id: string;
          provider_id?: string | null;
          status?: string;
          severity_score?: number;
          estimated_reward_cents?: number | null;
          actual_reward_cents?: number | null;
          badge_awarded?: boolean;
          notes?: string | null;
          validated_by?: string | null;
          validated_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          incident_id?: string;
          reporter_id?: string;
          provider_id?: string | null;
          status?: string;
          severity_score?: number;
          estimated_reward_cents?: number | null;
          actual_reward_cents?: number | null;
          badge_awarded?: boolean;
          notes?: string | null;
          validated_by?: string | null;
          validated_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bug_bounties_incident_id_fkey";
            columns: ["incident_id"];
            isOneToOne: false;
            referencedRelation: "incidents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bug_bounties_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bug_bounties_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "ai_providers";
            referencedColumns: ["id"];
          },
        ];
      };
      bounty_badges: {
        Row: {
          code: string;
          name_en: string;
          name_tr: string;
          description_en: string;
          description_tr: string;
          icon: string;
          threshold_count: number;
        };
        Insert: {
          code: string;
          name_en: string;
          name_tr: string;
          description_en: string;
          description_tr: string;
          icon: string;
          threshold_count?: number;
        };
        Update: {
          code?: string;
          name_en?: string;
          name_tr?: string;
          description_en?: string;
          description_tr?: string;
          icon?: string;
          threshold_count?: number;
        };
        Relationships: [];
      };
      user_bounty_badges: {
        Row: {
          user_id: string;
          badge_code: string;
          awarded_at: string;
          bounty_id: string | null;
        };
        Insert: {
          user_id: string;
          badge_code: string;
          awarded_at?: string;
          bounty_id?: string | null;
        };
        Update: {
          user_id?: string;
          badge_code?: string;
          awarded_at?: string;
          bounty_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_bounty_badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_bounty_badges_badge_code_fkey";
            columns: ["badge_code"];
            isOneToOne: false;
            referencedRelation: "bounty_badges";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "user_bounty_badges_bounty_id_fkey";
            columns: ["bounty_id"];
            isOneToOne: false;
            referencedRelation: "bug_bounties";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      provider_leaderboard: {
        Row: {
          id: string | null;
          slug: string | null;
          name: string | null;
          logo_url: string | null;
          is_verified: boolean | null;
          website_url: string | null;
          trust_score: number | null;
          incident_count: number | null;
          response_count: number | null;
        };
        Insert: {
          id?: string | null;
          slug?: string | null;
          name?: string | null;
          logo_url?: string | null;
          is_verified?: boolean | null;
          website_url?: string | null;
          trust_score?: number | null;
          incident_count?: number | null;
          response_count?: number | null;
        };
        Update: {
          id?: string | null;
          slug?: string | null;
          name?: string | null;
          logo_url?: string | null;
          is_verified?: boolean | null;
          website_url?: string | null;
          trust_score?: number | null;
          incident_count?: number | null;
          response_count?: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: { Args: { uid: string }; Returns: boolean };
      is_moderator: { Args: { uid: string }; Returns: boolean };
      normalize_takedown_status: {
        Args: { s: string };
        Returns: Database["public"]["Enums"]["takedown_status"];
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { "": string }; Returns: string[] };
    };
    Enums: {
      evidence_kind: "screenshot" | "video" | "document" | "url" | "transcript" | "other";
      incident_category:
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
      incident_severity: "low" | "medium" | "high" | "critical";
      incident_status: "pending_review" | "published" | "rejected" | "archived" | "takedown";
      suggestion_status:
        | "open"
        | "under_review"
        | "planned"
        | "in_progress"
        | "completed"
        | "declined";
      takedown_status: "received" | "under_review" | "approved" | "rejected" | "escalated";
      user_role: "user" | "moderator" | "admin" | "ceo" | "advisor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      evidence_kind: ["screenshot", "video", "document", "url", "transcript", "other"],
      incident_category: [
        "hallucination",
        "bias",
        "privacy",
        "security",
        "misinformation",
        "harassment",
        "manipulation",
        "inaccessibility",
        "copyright",
        "other",
      ],
      incident_severity: ["low", "medium", "high", "critical"],
      incident_status: ["pending_review", "published", "rejected", "archived", "takedown"],
      suggestion_status: [
        "open",
        "under_review",
        "planned",
        "in_progress",
        "completed",
        "declined",
      ],
      takedown_status: ["received", "under_review", "approved", "rejected", "escalated"],
      user_role: ["user", "moderator", "admin", "ceo", "advisor"],
    },
  },
} as const;
