# ALPAR AI — Multi-Agent AI Audit System

This directory is designed to make 360° audits performed on ALPAR AI by different AI models (Claude, GPT, Gemini, etc.) **standardized, comparable, and trackable**. The goal: to break the loop of the same bug being "rediscovered" 4 times across 4 separate audit rounds but never getting closed.

## Why Do We Need This System?

Free-text audit reports (PDF, chat outputs, dashboard screenshots, etc.) are written in different words by each AI model. When a code agent (Antigravity) reads these reports, it cannot reliably answer the question: "is this the same issue as last month?". The result: the same root cause is patched in different ways, none of them are permanently verified, and the issue keeps getting reopened.

**Solution:** Each issue gets a fixed ID once (`ALP-001`, `ALP-002`, etc.) and the state of this ID lives in a single file (`MASTER_CHECKLIST.md`). Raw audit reports are for archive purposes; **the file Antigravity must read is `MASTER_CHECKLIST.md`.**

## Folder Structure

```
ai-audits/
├── README.md                  ← this file
├── AUDIT_TEMPLATE.md          ← template that every new AI audit must fill out
├── MASTER_CHECKLIST.md        ← SINGLE source of truth: live, fixed-ID issue list
├── reports/
│   └── 2026-06-23_claude-sonnet-4.6_v6.md   ← full output of each audit (archive)
└── scripts/
    └── smoke-test-p0.sh       ← sample script that automatically verifies P0 items
```

## Workflow

1. **When you have a new audit done by an AI model:** format its output according to `AUDIT_TEMPLATE.md` (or tell the AI to use this template directly) and save it as `reports/{date}_{model}_v{n}.md`.
2. **Update `MASTER_CHECKLIST.md` in the same session:**
   - If a new issue is found → new line, new ID (in ascending order).
   - If a known issue is still open → update the "Last Verified" date, do not change the status.
   - If a known issue is no longer visible → set status to 🟢 _Fixed — not verified_ (see rule below).
3. **When assigning tasks to Antigravity,** refer to the open (🔴/🟡) lines in `MASTER_CHECKLIST.md` instead of raw reports.
4. **When Antigravity reports that it made a fix**, do not immediately change the status to ✅.

## Critical Rule: "Fixed" is a Two-Stage Process

| Status                  | Who sets it?                                                     | Meaning                                                   |
| ----------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| 🔴 / 🟡 Open            | Any audit                                                        | Issue still exists or has not been verified yet           |
| 🟢 Fixed — not verified | When the code agent (Antigravity) reports a fix                  | "Claimed to be done" — but not yet INDEPENDENTLY verified |
| ✅ Fixed — verified     | ONLY when the NEXT independent AI audit verifies it on live site | Confirmed resolved                                        |

Without this distinction, the code agent's "completed" claim is easily confused with the issue actually being resolved in production — which is exactly the cause of the recurring-bug loop identified in section 2.7 of this report.

## Sample Instruction to Antigravity

> "Resolve all items with 🔴 status in the MASTER_CHECKLIST.md file in order of priority (P0 → P1 → P2). For each item: (1) fix the root cause, (2) change the status to 🟢, (3) add/update the relevant check in `scripts/smoke-test-p0.sh`. Do not mark any item as ✅ on your own."
