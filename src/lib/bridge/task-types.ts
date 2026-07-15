export type TaskPriority = "low" | "medium" | "high" | "critical";

export type TaskStatus = "queued" | "processing" | "done" | "failed";

export interface ClaudeTask {
  id: string;
  type: "code" | "review" | "debug" | "refactor" | "research" | "plan";
  priority: TaskPriority;
  title: string;
  instructions: string;
  context: {
    files: string[];
    relevantSnippets?: string;
    constraints?: string[];
  };
  expectedOutput: string;
  createdAt: string;
  source: "opencode" | "claude-code";
}

export interface ClaudeTaskResult {
  taskId: string;
  status: TaskStatus;
  output: string;
  filesChanged?: string[];
  error?: string;
  completedAt: string;
  tokenEstimate?: number;
}

export interface BridgeState {
  activeTask: string | null;
  lastSync: string;
  opencodeVersion: string;
  claudeVersion: string;
}

export function generateTaskId(type: ClaudeTask["type"]): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 6);
  return `${type}-${ts}-${rand}`;
}
