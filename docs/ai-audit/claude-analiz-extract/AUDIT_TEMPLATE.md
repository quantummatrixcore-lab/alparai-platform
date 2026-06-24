---
audit_id: "ALPAR-AUDIT-2026-06-23-claude-sonnet-4.6-v6"
date: "2026-06-23"
model: "claude-sonnet-4-6" # model generating the audit
model_note: "" # optional: model settings, persona, etc.
site_commit_or_deploy_tag: "" # IMPORTANT: which git commit / deploy was audited? if unknown, specify "unknown"
previous_audit_id: "ALPAR-AUDIT-2026-0X-XX-..." # ID of the previous audit (to build a chain)
overall_score: 0 # /1000, according to the current rubric in MASTER_CHECKLIST.md
verification_method: "live-browse | html-fetch | screenshot-review | manual-paste | unverified"
locales_checked: ["en", "tr"]
viewports_checked: ["desktop", "mobile(<768px)"]
---

# ALPAR AI Audit Report — {date} — {model name}

> Save this file as `reports/{date}_{model}_v{n}.md` after filling it out.
> Register your findings in `MASTER_CHECKLIST.md` (add a new ID or update
> the status of existing IDs). This file itself should NOT be given DIRECTLY
> to Antigravity as a task source — it is strictly for archiving/evidence.

## 0. Verification Method (mandatory, be honest)

How did you access the site in this audit? (live browser / HTML fetch / screenshot pasted by user / inferred only from previous reports / etc.)
Which pages, which language(s), and which viewport(s) were ACTUALLY visited, and which were not? Mark the unvisited ones as "LIVE VERIFICATION REQUIRED" — do not guess.

## 1. Verified Findings in This Round

For each item: page/field, what was observed, with what evidence (screenshot, HTML snippet, URL).

## 2. Status of Previous Items in MASTER_CHECKLIST.md

| ID      | Previous Status | Observation in This Round                         | New Status |
| ------- | --------------- | ------------------------------------------------- | ---------- |
| ALP-001 | 🔴 Open         | (still open / now 🟢 / now ✅ / could not verify) | ...        |

## 3. Newly Identified Issues

| Temporary ID (draft) | Page/Field | Description | Recommended Severity (P0/P1/P2) | Evidence |
| -------------------- | ---------- | ----------- | ------------------------------- | -------- |
|                      |            |             |                                 |          |

_Note: The actual ID is assigned in ascending order when adding to `MASTER_CHECKLIST.md`._

## 4. Unverified Items in This Round

List them clearly — e.g. "could not test mobile viewport", "could not load /tr/contact live". Leaving this section blank means everything was verified — so be honest and thorough.

## 5. Score Changes and Rationale

If there is a change compared to the previous audit's score, tie EVERY point change to a concrete observation. Score changes without a concrete rationale, such as "improved overall", are not accepted.

## 6. Recommended Actions for Antigravity

Each must be concrete and testable enough to be converted into a single code agent task (e.g., "Add a `WHERE status='published'` filter to the Hero stats query and verify that it matches the incident count on the `/incidents` page").
