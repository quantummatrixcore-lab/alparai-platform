# ALPAR AI Handover Document

This document is part of the bus-factor risk mitigation strategy (B2). It lists critical system credentials, integration parameters, and rotatable credentials.

---

## 🔑 Key Integrations & Credentials

### NVIDIA NGC (AI Provider)

- **Environment Variable:** `NVIDIA_NGC_API_KEY`
- **Purpose:** Used by the AI Gateway to call models hosted on the NVIDIA NGC catalog.
- **Base URL:** `https://integrate.api.nvidia.com/v1` (OpenAI-compatible)
- **Rotation Link:** [NVIDIA NGC API Keys](https://org.ngc.nvidia.com/account/api-keys)

---

## 🔄 API Key Rotation Links & References

| Provider        | Env Variable                | Rotation Dashboard Link                                                            |
| --------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| Supabase        | `SUPABASE_SERVICE_ROLE_KEY` | [Supabase API Settings](https://supabase.com/dashboard/project/_/settings/api)     |
| Vercel          | `VERCEL_TOKEN`              | [Vercel Account Tokens](https://vercel.com/account/tokens)                         |
| Resend          | `RESEND_API_KEY`            | [Resend API Keys](https://resend.com/api-keys)                                     |
| OpenRouter      | `OPENROUTER_API_KEY`        | [OpenRouter Keys](https://openrouter.ai/keys)                                      |
| NVIDIA NGC      | `NVIDIA_NGC_API_KEY`        | [NVIDIA NGC Keys](https://org.ngc.nvidia.com/account/api-keys)                     |
| Vertex AI / GCP | GCP JSON Credentials        | [GCP Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) |
| Upstash         | `UPSTASH_REDIS_REST_TOKEN`  | [Upstash Console](https://console.upstash.com/)                                    |
