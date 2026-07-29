import WebSocket from "ws";

export interface LinkedInOutreachContact {
  readonly id: string;
  readonly fullName: string;
  readonly title: string;
  readonly profileUrl: string;
  readonly status: "to_add" | "contacted" | "skipped";
}

export interface LinkedInBotResult {
  readonly processedCount: number;
  readonly successCount: number;
  readonly skippedCount: number;
  readonly logs: readonly string[];
}

export async function runLinkedInOutreachBot(
  contacts: readonly LinkedInOutreachContact[],
  cdpUrl = "http://127.0.0.1:9222",
): Promise<LinkedInBotResult> {
  const logs: string[] = [];
  logs.push(
    `[LinkedInBot] Starting automated outreach worker for ${contacts.length} target profiles.`,
  );

  try {
    const res = await fetch(`${cdpUrl}/json/list`);
    if (!res.ok) {
      logs.push(
        `[LinkedInBot Warning] CDP port ${cdpUrl} unavailable (HTTP ${res.status}). Bot running in dry-run simulation mode.`,
      );
      return {
        processedCount: contacts.length,
        successCount: 0,
        skippedCount: contacts.length,
        logs,
      };
    }

    const tabs = (await res.json()) as Array<{ type: string; webSocketDebuggerUrl: string }>;
    const activeTab = tabs.find((t) => t.type === "page" && t.webSocketDebuggerUrl);

    if (!activeTab) {
      logs.push("[LinkedInBot Warning] No active Chrome page tab found. Bot exiting gracefully.");
      return {
        processedCount: contacts.length,
        successCount: 0,
        skippedCount: contacts.length,
        logs,
      };
    }

    const ws = new WebSocket(activeTab.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      ws.on("open", resolve);
      ws.on("error", reject);
    });

    let successCount = 0;
    let skippedCount = 0;

    for (const contact of contacts) {
      if (contact.status !== "to_add" || !contact.profileUrl) {
        skippedCount++;
        logs.push(`[LinkedInBot] Skipped ${contact.fullName} (Status: ${contact.status}).`);
        continue;
      }

      logs.push(`[LinkedInBot CDP] Navigating to ${contact.fullName} (${contact.profileUrl})...`);
      ws.send(
        JSON.stringify({
          id: Date.now(),
          method: "Page.navigate",
          params: { url: contact.profileUrl },
        }),
      );
      await new Promise((r) => setTimeout(r, 1500));
      successCount++;
    }

    ws.close();

    return {
      processedCount: contacts.length,
      successCount,
      skippedCount,
      logs,
    };
  } catch (error) {
    logs.push(
      `[LinkedInBot Error] CDP connection failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      processedCount: contacts.length,
      successCount: 0,
      skippedCount: contacts.length,
      logs,
    };
  }
}
