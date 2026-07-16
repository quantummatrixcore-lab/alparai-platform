# ALPAR AI — Ajan Sahiplik Kuralları (OWNERSHIP)

## Altın Kural

> **Hiçbir ajan kendi domaini dışındaki bir dosyaya YAZAMAZ.**
> Okuma serbesttir. Yazma için bu dosyaya bak.

---

## Dosya/Klasör Sahipliği

| Klasör / Dosya         | Sorumlu Ajan    | Yasak Ajanlar       |
| ---------------------- | --------------- | ------------------- |
| `src/app/`             | **OpenCode**    | Claude, Antigravity |
| `src/components/`      | **OpenCode**    | Claude, Antigravity |
| `src/actions/`         | **OpenCode**    | Claude, Antigravity |
| `src/lib/`             | **OpenCode**    | Claude, Antigravity |
| `src/lib/bridge/`      | **Antigravity** | Claude, OpenCode    |
| `supabase/migrations/` | **Antigravity** | Claude, OpenCode    |
| `supabase/seed.sql`    | **Antigravity** | Claude, OpenCode    |
| `messages/en.json`     | **Antigravity** | Claude, OpenCode    |
| `messages/tr.json`     | **Antigravity** | Claude, OpenCode    |
| `docs/`                | **Claude**      | OpenCode            |
| `docs/adr/`            | **Claude**      | OpenCode            |
| `MASTER_PLAN.md`       | **Claude**      | OpenCode            |
| `CONTRIBUTING.md`      | **Claude**      | OpenCode            |
| `ops/`                 | **Antigravity** | Claude, OpenCode    |
| `.bridge/`             | **Antigravity** | Claude, OpenCode    |
| `.opencode/`           | **Antigravity** | Claude, OpenCode    |
| `package.json`         | **Antigravity** | Claude, OpenCode    |
| `pnpm-lock.yaml`       | **Antigravity** | Claude, OpenCode    |
| `next.config.ts`       | **Antigravity** | Claude, OpenCode    |
| `tailwind.config.*`    | **Antigravity** | Claude, OpenCode    |

---

## Görev Atama Protokolü

```
1. Antigravity → .bridge/tasks/<id>.json yazar (görev tanımı)
2. Hedef ajan → .bridge/locks/<dosya-adı>.lock yazar (kilit)
3. Ajan çalışır
4. Ajan → .bridge/results/<id>.json yazar (sonuç)
5. Antigravity → sonucu alır, gerekirse merge eder
6. Antigravity → git add + commit atar
7. .bridge/locks/<dosya-adı>.lock silinir
```

---

## Paralel Çalışma Kuralı

Aynı anda en fazla:

- **1 OpenCode** instance (src/ üzerinde)
- **1 Claude** instance (docs/ üzerinde)
- **1 Antigravity** instance (supabase/, messages/, ops/ üzerinde)

Farklı domainlerde çakışma olmaz, bu yüzden üçü aynı anda çalışabilir.

---

## İhlal Durumu

Eğer bir ajan kendi domaini dışına çıkarsa:

1. `git restore <dosya>` ile geri al
2. Ajanın görev dosyasını `.bridge/tasks/` altında güncelle
3. Doğru ajana yeniden ata
