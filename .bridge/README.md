# OpenCode ↔ Claude Code Bridge

IPC katmanı. OpenCode (orchestrator) ile Claude Code (executor) arasında dosya tabanlı iletişim.

## Kullanım

### OpenCode'dan Claude Code'a iş gönderme:

```typescript
const bridge = new ClaudeBridge({ mode: "cli" });
const result = await bridge.delegate({
  type: "code",
  priority: "high",
  title: "Refactor X",
  instructions: "...",
  context: { files: ["src/file.ts"] },
  expectedOutput: "Modified file",
});
```

### Manuel (terminal):

```powershell
# Claude Code'a iş gönder
pwsh .\scripts\bridge\dispatch-claude.ps1 -TaskFile .\.bridge\tasks\task-xxx.json

# Watcher'ı başlat (arka planda çalışır)
pwsh .\scripts\bridge\watch-bridge.ps1
```

### tmux entegrasyonu:

```bash
# Mevcut Claude Code panesine iş gönder
tmux send-keys -t alpar-agents:0.0 "claude -p \"cat .bridge/active.md\" 2>&1 | Out-File .bridge/results/task-xxx.json" Enter
```

## Dizin Yapısı

```
.bridge/
├── active.md         ← OpenCode current prompt → Claude Code reads
├── tasks/            ← OpenCode writes task JSONs
├── results/          ← Claude Code writes result JSONs
└── README.md
```
