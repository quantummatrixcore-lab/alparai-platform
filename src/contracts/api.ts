import { z } from "zod";

// 1. GET /api/v1/incidents
export const incidentsResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      category: z.string(),
      eu_act_risk_category: z.string().nullable(),
      eu_act_serious_incident_class: z.string().nullable(),
      eu_act_high_risk_system_category: z.string().nullable(),
      eu_act_reporting_deadline_days: z.number().nullable(),
      is_anonymous: z.boolean(),
      incident_date: z.string(),
      views: z.number(),
      upvotes: z.number(),
      provider: z
        .object({
          name: z.string(),
          slug: z.string(),
        })
        .nullable(),
      model: z.string().nullable(),
      truth_score: z.number().nullable(),
      confidence: z.number().nullable(),
      verification_level: z.enum(["expert", "community"]),
      expert_fix: z.string().nullable(),
      created_at: z.string(),
    }),
  ),
  meta: z.object({
    count: z.number(),
    limit: z.number(),
    tier: z.enum(["free", "developer", "enterprise"]),
    generated_at: z.string(),
  }),
});

// 2. GET /api/v1/incidents/[id]
export const incidentDetailResponseSchema = z.object({
  data: z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    category: z.string(),
    is_anonymous: z.boolean(),
    incident_date: z.string(),
    views: z.number(),
    upvotes: z.number(),
    model: z.string().nullable(),
    truth_score: z.number().nullable(),
    confidence: z.number().nullable(),
    verification_level: z.enum(["expert", "community"]),
    expert_fix: z.string().nullable(),
    created_at: z.string(),
  }),
});

// 3. GET /api/v1/leaderboard
export const leaderboardResponseSchema = z.object({
  data: z.array(
    z.object({
      rank: z.number(),
      id: z.string().uuid(),
      slug: z.string(),
      name: z.string(),
      logo_url: z.string().nullable(),
      is_verified: z.boolean(),
      website_url: z.string().nullable(),
      trust_score: z.number(),
      incident_count: z.number(),
      response_count: z.number(),
      response_rate: z.number().nullable(),
    }),
  ),
  meta: z.object({
    count: z.number(),
    generated_at: z.string(),
  }),
});

// 4. GET /api/v1/ratings/[modelSlug]
export const ratingsResponseSchema = z.object({
  model_id: z.string().uuid(),
  model_name: z.string(),
  status: z.enum(["active", "retired"]),
  composite_score: z.number(),
  ratings: z.array(
    z.object({
      category_id: z.string().uuid().optional(),
      category_name: z.string().optional(),
      score: z.number(),
      wilson_interval: z.object({
        lower: z.number().nullable(),
        upper: z.number().nullable(),
      }),
      sample_size: z.number(),
      last_audited_at: z.string(),
    }),
  ),
});

// 5. POST /api/v1/extract
export const extractResponseSchema = z.object({
  url: z.string().url(),
  providerId: z.string(),
  providerName: z.string(),
  title: z.string(),
  description: z.string(),
  extractedAt: z.string(),
});

// 6. GET /api/v1/oecd/feed
export const oecdFeedResponseSchema = z.object({
  feed_format: z.string(),
  generated_at: z.string(),
  count: z.number(),
  incidents: z.array(
    z.object({
      incident_id: z.string().uuid(),
      title: z.string(),
      description: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      category: z.string(),
      location_country: z.string(),
      incident_date: z.string(),
      created_at: z.string(),
      oecd_classification: z.object({
        people_planet: z.string(),
        business_model: z.string(),
        ai_system: z.string(),
        data_input: z.string(),
        action_output: z.string(),
      }),
    }),
  ),
});

// 7. GET /api/v1/providers
export const providersResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      website_url: z.string().nullable(),
      logo_url: z.string().nullable(),
      is_verified: z.boolean(),
      trust_score: z.number(),
    }),
  ),
  meta: z.object({
    count: z.number(),
    generated_at: z.string(),
  }),
});

// 8. GET /api/v1/stats
export const statsResponseSchema = z.object({
  data: z.object({
    total_incidents: z.number(),
    total_providers: z.number(),
    average_trust_score: z.number(),
    by_category: z.record(z.string(), z.number()),
  }),
  meta: z.object({
    generated_at: z.string(),
  }),
});

// 9. POST /api/v1/risk/audit
export const riskAuditResponseSchema = z.object({
  eu_act_risk_category: z.enum(["minimal", "limited", "high", "unacceptable"]),
  eu_act_serious_incident_class: z.string().nullable(),
  risk_score: z.number().min(0).max(1),
  reasoning: z.string(),
});

// 10. GET /api/v1/dsar/export
export const dsarExportResponseSchema = z.object({
  export_meta: z.object({
    platform: z.string(),
    legal_basis: z.string(),
    generated_at: z.string(),
    request_id: z.string(),
    sla_due_date: z.string(),
  }),
  user_identity: z.object({
    id: z.string().uuid(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    last_sign_in_at: z.string().nullable().optional(),
  }),
  profile: z.any().nullable(),
  incidents: z.array(z.any()),
  comments: z.array(z.any()),
  votes: z.array(z.any()),
  expert_applications: z.array(z.any()),
}); // 11. GET /api/v1/dsar/download
export const dsarDownloadResponseSchema = z.union([
  z.object({
    user_id: z.string().uuid(),
    email: z.string().nullable().optional(),
    generated_at: z.string(),
    profile: z.any().nullable(),
    incidents: z.array(z.any()),
    comments: z.array(z.any()),
    votes: z.array(z.any()),
  }),
  z.string(), // CSV format is plain string
]);

// 12. GET /api/v1/auditor/k-benchmark
export const auditorBenchmarkResponseSchema = z.object({
  data: z.array(
    z.object({
      category_id: z.string(),
      model_id: z.string(),
      score: z.number(),
      status: z.string(),
      sample_size: z.number(),
      created_at: z.string().nullable().optional(),
    }),
  ),
});

// 13. GET /api/v1/auditor/methodology
export const auditorMethodologyResponseSchema = z.object({
  data: z.array(
    z.object({
      version: z.string(),
      description: z.string(),
      created_at: z.string(),
    }),
  ),
});

// 14. GET /api/v1/auditor/audit-logs
export const auditorAuditLogsResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string().uuid(),
      actor_id: z.string().uuid().nullable().optional(),
      action: z.string(),
      entity_type: z.string(),
      entity_id: z.string().uuid().nullable().optional(),
      created_at: z.string(),
    }),
  ),
});

// 15. GET /api/v1/dsar/portable
export const dsarPortableResponseSchema = z.any(); // Returns ZIP binary stream
