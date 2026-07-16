import fs from "fs";
import path from "path";

export interface PlanItem {
  id: string;
  priority: string;
  title: string;
  status: "completed" | "pending";
  commitHash?: string;
  description?: string;
}

export function parseMasterPlan(): PlanItem[] {
  try {
    const filePath = path.join(process.cwd(), "docs", "MASTER_PLAN.md");
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const items: PlanItem[] = [];

    // Simple parsing logic for markdown tables in MASTER_PLAN.md
    for (const line of lines) {
      if (line.trim().startsWith("|") && !line.includes("---") && !line.includes("Item ID")) {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length >= 5) {
          const id = parts[1];
          const priority = parts[2];
          const rawTitle = parts[3];
          const statusRaw = parts[4];

          if (!id || id === "") continue;

          // remove HTML and markdown links from title
          const cleanTitle = rawTitle
            ? rawTitle.replace(/<[^>]*>?/gm, "").replace(/\[(.*?)\]\(.*?\)/g, "$1")
            : "";

          // Check if it has a checkmark or white square
          let status: "completed" | "pending" = "pending";
          if (
            statusRaw &&
            (statusRaw.includes("✅") || statusRaw.includes("x") || statusRaw.includes("✓"))
          ) {
            status = "completed";
          }

          items.push({
            id,
            priority,
            title: cleanTitle || "",
            status,
          });
        }
      }
    }
    return items;
  } catch (error) {
    console.error("Error reading MASTER_PLAN.md:", error);
    return [];
  }
}
