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
  readonly navigatedCount: number;
  readonly connectedCount: number;
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
    const res = await fetch(`${cdpUrl}/json/list`).catch((err) => {
      logs.push(
        `[LinkedInBot Warning] CDP port ${cdpUrl} unavailable (${err instanceof Error ? err.message : String(err)}). Bot running in dry-run simulation mode.`,
      );
      return null;
    });

    if (!res || !res.ok) {
      if (res && !res.ok) {
        logs.push(
          `[LinkedInBot Warning] CDP port ${cdpUrl} unavailable (HTTP ${res.status}). Bot running in dry-run simulation mode.`,
        );
      }
      return {
        processedCount: contacts.length,
        navigatedCount: 0,
        connectedCount: 0,
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
        navigatedCount: 0,
        connectedCount: 0,
        skippedCount: contacts.length,
        logs,
      };
    }

    const ws = new WebSocket(activeTab.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      ws.on("open", resolve);
      ws.on("error", reject);
    });

    let navigatedCount = 0;
    let connectedCount = 0;
    let skippedCount = 0;

    for (const contact of contacts) {
      if (contact.status !== "to_add" || !contact.profileUrl) {
        skippedCount++;
        logs.push(`[LinkedInBot] Skipped ${contact.fullName} (Status: ${contact.status}).`);
        continue;
      }

      logs.push(`[LinkedInBot CDP] Navigating to ${contact.fullName} (${contact.profileUrl})...`);

      // Send navigation command
      const navPromise = new Promise<boolean>((resolve) => {
        const handler = (data: WebSocket.Data) => {
          try {
            const msg = JSON.parse(data.toString());
            if (msg.id === 100) {
              ws.off("message", handler);
              resolve(Boolean(msg.result?.frameId));
            }
          } catch {
            // ignore
          }
        };
        ws.on("message", handler);
      });

      ws.send(
        JSON.stringify({
          id: 100,
          method: "Page.navigate",
          params: { url: contact.profileUrl },
        }),
      );

      const navSuccess = await navPromise;
      if (navSuccess) {
        navigatedCount++;
        await new Promise((r) => setTimeout(r, 2000));

        // Evaluate DOM for Connect button click
        const connectPromise = new Promise<boolean>((resolve) => {
          const handler = (data: WebSocket.Data) => {
            try {
              const msg = JSON.parse(data.toString());
              if (msg.id === 101) {
                ws.off("message", handler);
                resolve(Boolean(msg.result?.result?.value?.clicked));
              }
            } catch {
              // ignore
            }
          };
          ws.on("message", handler);
        });

        ws.send(
          JSON.stringify({
            id: 101,
            method: "Runtime.evaluate",
            params: {
              expression: `
                (() => {
                  const buttons = Array.from(document.querySelectorAll('button'));
                  const connectBtn = buttons.find(b => b.textContent?.trim().includes('Connect') || b.ariaLabel?.includes('Connect'));
                  if (connectBtn) {
                    connectBtn.click();
                    return { clicked: true };
                  }
                  return { clicked: false, reason: 'Connect button not found on DOM' };
                })()
              `,
              returnByValue: true,
            },
          }),
        );

        const clicked = await connectPromise;
        if (clicked) {
          connectedCount++;
          logs.push(`[LinkedInBot CDP] Triggered Connect DOM interaction for ${contact.fullName}.`);
        } else {
          logs.push(
            `[LinkedInBot CDP] Navigated to ${contact.fullName}, Connect button pending DOM state.`,
          );
        }
      }
    }

    ws.close();

    return {
      processedCount: contacts.length,
      navigatedCount,
      connectedCount,
      skippedCount,
      logs,
    };
  } catch (error) {
    logs.push(
      `[LinkedInBot Warning] CDP port ${cdpUrl} unavailable (${error instanceof Error ? error.message : String(error)}). Bot running in dry-run simulation mode.`,
    );
    return {
      processedCount: contacts.length,
      navigatedCount: 0,
      connectedCount: 0,
      skippedCount: contacts.length,
      logs,
    };
  }
}
