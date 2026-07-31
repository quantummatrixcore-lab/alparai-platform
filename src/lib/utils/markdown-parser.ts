import fs from "fs";
import path from "path";
import { logger } from "@/lib/utils/logger";

export interface PlanItem {
  id: string;
  priority: string;
  title: string;
  status: "completed" | "pending" | "paused";
  commitHash?: string;
  description?: string;
  owner?: string;
}

export type MasterPlanParseError = "read" | "markers";

export interface MasterPlanParseResult {
  items: PlanItem[];
  error: MasterPlanParseError | null;
}

const BACKLOG_START = "<!-- FOUNDER_BACKLOG_START -->";
const BACKLOG_END = "<!-- FOUNDER_BACKLOG_END -->";

function cleanMarkdown(value: string): string {
  return value
    .replace(/<[^>]*>?/gm, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseMasterPlan(): MasterPlanParseResult {
  try {
    const filePath = path.join(process.cwd(), "docs", "MASTER_PLAN.md");
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    const startIdx = lines.findIndex((l) => l.includes(BACKLOG_START));
    const endIdx = lines.findIndex((l) => l.includes(BACKLOG_END));

    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
      logger.error("parseMasterPlan: FOUNDER_BACKLOG markers not found — returning empty list");
      return { items: [], error: "markers" };
    }

    const backlogLines = lines.slice(startIdx + 1, endIdx);
    const items: PlanItem[] = [];

    for (const line of backlogLines) {
      if (!line.trim().startsWith("|") || line.includes("---") || line.includes("Item ID")) {
        continue;
      }

      const parts = line.split("|").map((p) => p.trim());
      if (parts.length < 6) continue;

      const id = parts[1];
      const priority = parts[2] || "";
      const rawTitle = parts[3] || "";
      const rawDescription = parts[4] || "";
      const statusRaw = parts[5] || "";

      if (!id || !/^\d+$/.test(id)) continue;

      const cleanTitle = cleanMarkdown(rawTitle);

      let owner: string | undefined;
      const ownerMatch = rawTitle.match(/^\[(\w+)\]/);
      if (ownerMatch) {
        owner = ownerMatch[1];
      }

      let status: "completed" | "pending" | "paused" = "pending";
      if (statusRaw.includes("✅") || statusRaw.includes("✓")) {
        status = "completed";
      } else if (statusRaw.includes("⏸")) {
        status = "paused";
      }

      const description = cleanMarkdown(rawDescription);

      items.push({
        id,
        priority,
        title: cleanTitle || "",
        status,
        owner,
        description: description || undefined,
      });
    }

    return { items, error: null };
  } catch (error) {
    logger.error(
      "Error reading MASTER_PLAN.md",
      undefined,
      error instanceof Error ? error : undefined,
    );
    return { items: [], error: "read" };
  }
}
