import { readFile, writeFile, access } from "fs/promises";
import { join } from "path";
import { execSync } from "child_process";
import type { ClaudeTask, ClaudeTaskResult } from "./task-types";
import { generateTaskId } from "./task-types";
import { logger } from "@/lib/utils/logger";

const BRIDGE_DIR = join(process.cwd(), ".bridge");
const TASKS_DIR = join(BRIDGE_DIR, "tasks");
const RESULTS_DIR = join(BRIDGE_DIR, "results");
const ACTIVE_FILE = join(BRIDGE_DIR, "active.md");
const CLAUDE_PANE = "alpar-agents:0.0";

export interface BridgeConfig {
  mode: "cli" | "tmux" | "file-only";
  fallbackToSimulation: boolean;
}

export class ClaudeBridge {
  private config: BridgeConfig;

  constructor(config?: Partial<BridgeConfig>) {
    this.config = {
      mode: "cli",
      fallbackToSimulation: true,
      ...config,
    };
  }

  async delegate(task: Omit<ClaudeTask, "id" | "createdAt" | "source">): Promise<ClaudeTaskResult> {
    const fullTask: ClaudeTask = {
      ...task,
      id: generateTaskId(task.type),
      createdAt: new Date().toISOString(),
      source: "opencode",
    };

    await this.writeTask(fullTask);
    logger.info(`[ClaudeBridge] Task ${fullTask.id} written to queue`);

    try {
      switch (this.config.mode) {
        case "cli":
          return await this.executeViaCLI(fullTask);
        case "tmux":
          return await this.executeViaTmux(fullTask);
        case "file-only":
          return { taskId: fullTask.id, status: "queued", output: "", completedAt: "" };
      }
    } catch (err) {
      if (this.config.fallbackToSimulation) {
        logger.warn(`[ClaudeBridge] Execution failed, using simulation`, { error: String(err) });
        return this.simulateResult(fullTask);
      }
      return {
        taskId: fullTask.id,
        status: "failed",
        output: "",
        error: String(err),
        completedAt: new Date().toISOString(),
      };
    }
  }

  async delegateSync(
    task: Omit<ClaudeTask, "id" | "createdAt" | "source">,
  ): Promise<ClaudeTaskResult> {
    return this.delegate(task);
  }

  async pollForResult(taskId: string, timeoutMs = 120000): Promise<ClaudeTaskResult | null> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const result = await this.readResult(taskId);
      if (result) return result;
      await new Promise((r) => setTimeout(r, 2000));
    }
    return null;
  }

  status(): string {
    return `Bridge mode: ${this.config.mode} | Claude Code available via tmux pane ${CLAUDE_PANE}`;
  }

  private async executeViaCLI(task: ClaudeTask): Promise<ClaudeTaskResult> {
    const prompt = this.buildPrompt(task);

    const cmd = `claude -p "${prompt.replace(/"/g, '\\"')}" --output-format json --print`;
    logger.info(`[ClaudeBridge] Executing via CLI: ${task.id}`);

    try {
      const output = execSync(cmd, {
        cwd: process.cwd(),
        timeout: 300000,
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
      });

      const result: ClaudeTaskResult = {
        taskId: task.id,
        status: "done",
        output: output.trim(),
        completedAt: new Date().toISOString(),
      };

      await this.writeResult(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const result: ClaudeTaskResult = {
        taskId: task.id,
        status: "failed",
        output: "",
        error: msg,
        completedAt: new Date().toISOString(),
      };
      await this.writeResult(result);
      return result;
    }
  }

  private async executeViaTmux(task: ClaudeTask): Promise<ClaudeTaskResult> {
    const prompt = this.buildPrompt(task);
    const taskFile = join(TASKS_DIR, `${task.id}.json`);
    await writeFile(taskFile, JSON.stringify(task, null, 2), "utf-8");
    await writeFile(ACTIVE_FILE, prompt, "utf-8");

    const cmd = `tmux send-keys -t ${CLAUDE_PANE} "claude -p \\"cat ${ACTIVE_FILE}\\" 2>&1 | Out-File ${join(RESULTS_DIR, `${task.id}.json`)}" Enter`;
    execSync(cmd, { timeout: 5000 });

    return {
      taskId: task.id,
      status: "processing",
      output: "Sent to Claude Code tmux pane. Awaiting completion...",
      completedAt: "",
    };
  }

  private buildPrompt(task: ClaudeTask): string {
    return `[CLAUDE BRIDGE TASK: ${task.id}]
Type: ${task.type}
Priority: ${task.priority}

## Instructions
${task.instructions}

## Context Files
${task.context.files.map((f) => `- ${f}`).join("\n")}

${task.context.relevantSnippets ? `## Relevant Code\n${task.context.relevantSnippets}\n` : ""}
${task.context.constraints ? `## Constraints\n${task.context.constraints.map((c) => `- ${c}`).join("\n")}\n` : ""}

## Expected Output
${task.expectedOutput}

Write the result to .bridge/results/${task.id}.json
`;
  }

  private async writeTask(task: ClaudeTask): Promise<void> {
    const filePath = join(TASKS_DIR, `${task.id}.json`);
    await writeFile(filePath, JSON.stringify(task, null, 2), "utf-8");
  }

  private async readResult(taskId: string): Promise<ClaudeTaskResult | null> {
    const filePath = join(RESULTS_DIR, `${taskId}.json`);
    try {
      await access(filePath);
      const content = await readFile(filePath, "utf-8");
      return JSON.parse(content) as ClaudeTaskResult;
    } catch {
      return null;
    }
  }

  private async writeResult(result: ClaudeTaskResult): Promise<void> {
    const filePath = join(RESULTS_DIR, `${result.taskId}.json`);
    await writeFile(filePath, JSON.stringify(result, null, 2), "utf-8");
  }

  private async simulateResult(task: ClaudeTask): Promise<ClaudeTaskResult> {
    await new Promise((r) => setTimeout(r, 1000));
    const result: ClaudeTaskResult = {
      taskId: task.id,
      status: "done",
      output: `[SIMULATED] Claude Code would process: ${task.title}\n\nInstructions: ${task.instructions.substring(0, 200)}...`,
      completedAt: new Date().toISOString(),
      tokenEstimate: 0,
    };
    await this.writeResult(result);
    return result;
  }
}

export const defaultBridge = new ClaudeBridge({ mode: "cli", fallbackToSimulation: true });
