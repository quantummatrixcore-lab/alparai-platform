# ALPAR AI — Server Actions API Reference

All mutations go through Next.js Server Actions. No REST endpoints are exposed to external consumers.

## Authentication

Authentication uses Supabase Auth (Google OAuth + Magic Link). Session cookies are managed automatically by the `@supabase/ssr` middleware.

## Rate Limiting

All endpoints are rate-limited via Upstash Redis (sliding window).

| Endpoint              | Limit | Window |
| --------------------- | ----- | ------ |
| Incident submission   | 5     | 1 hour |
| Suggestion submission | 10    | 1 day  |
| Auth sign-in          | 10    | 15 min |
| API general           | 100   | 1 min  |

## Error Codes

| Code                | Description                         |
| ------------------- | ----------------------------------- |
| `UNAUTHORIZED`      | Authentication required             |
| `FORBIDDEN`         | Insufficient permissions            |
| `VALIDATION_ERROR`  | Input validation failed             |
| `RATE_LIMITED`      | Rate limit exceeded                 |
| `NOT_FOUND`         | Resource not found                  |
| `INTERNAL_ERROR`    | Unexpected server error             |
| `PII_DETECTED`      | Personal data detected and redacted |
| `FILE_TOO_LARGE`    | Upload exceeds 10MB limit           |
| `INVALID_FILE_TYPE` | Unsupported file format             |
| `DUPLICATE_VOTE`    | User already voted                  |

---

## Incidents

### `submitIncident(prevState, formData)`

**Auth:** Required (user)
**Rate Limit:** `incident_submission` (5/hour)
**PII:** Title and description are masked via PII Guardian

**FormData fields:**

| Field               | Type     | Required | Description                                                                                                         |
| ------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `title`             | string   | Yes      | 8-200 chars                                                                                                         |
| `description`       | string   | Yes      | 20-10000 chars                                                                                                      |
| `category`          | enum     | Yes      | hallucination, bias, privacy, security, misinformation, harassment, manipulation, inaccessibility, copyright, other |
| `severity`          | enum     | Yes      | low, medium, high, critical                                                                                         |
| `provider_id`       | uuid     | No       | AI provider ID                                                                                                      |
| `model_id`          | uuid     | No       | AI model ID                                                                                                         |
| `incident_date`     | date     | No       | YYYY-MM-DD                                                                                                          |
| `is_anonymous`      | checkbox | No       | Default: off                                                                                                        |
| `consent_truth`     | checkbox | Yes      | Truthfulness confirmation                                                                                           |
| `consent_anonymous` | checkbox | Yes      | Anonymous publication consent                                                                                       |
| `consent_age`       | checkbox | Yes      | Age 18+ confirmation                                                                                                |
| `consent_terms`     | checkbox | Yes      | ToS acceptance                                                                                                      |

**Returns:** `{ ok: boolean; error?: string; formError?: string; fieldErrors?: Record<string, string[]>; incidentId?: string }`

### `voteOnIncident({ incidentId, value })`

**Auth:** Required
**Parameters:** `incidentId: string`, `value: 1 | -1 | 0`
**Behavior:** Upserts vote. `value: 0` or same value removes vote.
**Returns:** `{ ok: boolean; error?: string }`

---

## Authentication

### `signInWithGoogle(next?)`

**Auth:** None
**Rate Limit:** `auth_signin` (10/15min)
**Parameters:** `next: string` (redirect URL after auth, default: `/profile`)
**Returns:** `{ ok: boolean; error?: string; url?: string }`

### `signInWithMagicLink(email)`

**Auth:** None
**Parameters:** `email: string`
**Returns:** `{ ok: boolean; error?: string }`

### `signOut()`

**Auth:** Required
**Side effects:** Clears session, redirects to `/`

### `getMe()`

**Auth:** Optional
**Returns:** `{ ok: boolean; user: { id, email, fullName, avatarUrl, role } | null }`

---

## Administration

### `moderateIncident({ incidentId, decision, moderationNote? })`

**Auth:** Moderator/Admin
**Parameters:**

- `incidentId: string`
- `decision: "approve" | "reject"`
- `moderationNote?: string` (max 2000 chars)

**Returns:** `{ ok: boolean; error?: string }`

### `reviewTakedown({ id, decision })`

**Auth:** Moderator/Admin
**Parameters:** `id: string`, `decision: "approve" | "reject"`
**Returns:** `{ ok: boolean; error?: string }`

### `setUserRole({ userId, role })`

**Auth:** Moderator/Admin
**Parameters:** `userId: string`, `role: "user" | "moderator" | "admin"`
**Returns:** `{ ok: boolean; error?: string }`

---

## Contact

### `submitContact(prevState, formData)`

**Auth:** None
**FormData fields:** `name`, `email`, `subject`, `message`, `category`
**Side effects:** Sends email via Resend (if API key configured)
**Returns:** `{ ok: boolean; error?: string; formError?: string; fieldErrors?: Record<string, string[]> }`

---

## Suggestions

### `submitSuggestion(prevState, formData)`

**Auth:** Required
**FormData fields:** `title` (8-200 chars), `description` (20-5000 chars), `category`
**Returns:** `{ ok: boolean; error?: string; fieldErrors?: Record<string, string[]> }`

### `upvoteSuggestion(suggestionId)`

**Auth:** Required
**Behavior:** Toggles vote (upvote if not voted, remove if already voted)
**Returns:** `{ ok: boolean; error?: string }`

---

## Takedown Requests

### `submitTakedownRequest(input)`

**Auth:** None
**Parameters:**

- `target_url: string` (URL)
- `reason: string` (2-100 chars)
- `details: string` (20-4000 chars)
- `requester_name: string` (2-100 chars)
- `requester_email: string` (email)
- `identity_proof_url: string` (URL)
- `organization?: string`
- `country?: string`

**Returns:** `{ ok: boolean; error?: string; message?: string }`

### `submitTakedown(input)`

**Auth:** Optional
**Parameters:** `incidentId`, `reason`, `details`, `contactEmail`
**Returns:** `{ ok: boolean; error?: string; message?: string }`

---

## Search

### `searchIncidents(query, limit?)`

**Auth:** None
**Parameters:** `query: string` (min 2 chars), `limit: number` (default: 20)
**Returns:** `{ ok: boolean; results: SearchResult[]; error?: string }`

---

## Data Export

### `exportIncidentsCSV()`

**Auth:** Admin only
**Returns:** `{ ok: boolean; csv?: string; error?: string }`

### `exportAuditLogCSV()`

**Auth:** Admin only
**Returns:** `{ ok: boolean; csv?: string; error?: string }`
