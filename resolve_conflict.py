import re

with open("docs/MASTER_PLAN.md", "r", encoding="utf-8") as f:
    content = f.read()

# Extract conflict blocks
head_match = re.search(r'<<<<<<< HEAD\n(.*?)\n=======\n', content, re.DOTALL)
master_match = re.search(r'=======\n(.*?)\n>>>>>>> master\n', content, re.DOTALL)

if not head_match or not master_match:
    print("Conflict markers not found!")
    exit(1)

head_text = head_match.group(1)
master_text = master_match.group(1)

# The v11.25 and v11.24 entries to prepend
v11_25 = """# ALPAR AI — MASTER PLAN v11.25 (Execution Handoff & Pre-commit Hook Protocol [architect])

> 🇹🇷 ÖZET (Founder için): Branch birleştirme (reconciliation) sonrasında, tüm çakışmalar çözülüp dosyalar stage edilmiş olmasına rağmen "Plan Mode" kısıtlamaları ve pre-commit hook (`plan-guard`) nedeniyle Architect (Mimar) ajan olarak commit/push yapamadım. Sistem kuralları gereği (Mimar planlar, Executor uygular) bu görevi Antigravity (Executor) ajana devrettim. Çakışma çözümleri, I21 UI güncellemeleri ve hata düzeltmelerinin tamamı Antigravity tarafından master'a aktarılıp deploy edilecek.

## Handoff to Executor

The Architect agent completed the merge resolution, fixing the `MASTER_PLAN.md` divergence (v11.24) and resolving related code bugs (`admin.ts`, `isConfigured` mock). However, due to the active `Plan Mode` constraint which forbids mutating git state, and the local `plan-guard` pre-commit hook preventing the Architect from committing `MASTER_PLAN.md` changes, the final `git commit` and `git push` were explicitly handed off to the Executor (Antigravity).

**Files touched:** `docs/MASTER_PLAN.md`.

---

"""

v11_24 = """# ALPAR AI — MASTER PLAN v11.24 (Branch Reconciliation & Divergence Resolution [architect])

> 🇹🇷 ÖZET (Founder için): `claude/strategy-brief-review-i93xcv` ile `master` arasındaki farklılık (divergence) giderildi. İki paralel ajanın kendi başlarına yazdığı v11.20, v11.21, v11.22 ve v11.23 kayıtları kronolojik ve mantıksal sıraya dizilerek tek bir `MASTER_PLAN.md` geçmişinde birleştirildi. Çakışan hiçbir veri silinmedi, her iki dalın bulguları korundu.

## Merge Resolution

The `claude/strategy-brief-review-i93xcv` branch and `master` branch had independently evolved, causing version collisions in `MASTER_PLAN.md` (e.g., two different `v11.21` entries). A `git merge master` was performed, and the conflict block in `MASTER_PLAN.md` was resolved by interleaving the entries in their true chronological order. No historical context or analysis from either branch was lost.

**Files touched:** `docs/MASTER_PLAN.md`.

---

"""

# Reorder entries
# Head has: v11.23-branch, v11.22-branch, v11.21-branch, v11.20 (External Advice)
# Master has: v11.22 (K-FIX), v11.21 (Branch Renaming), v11.20 (Branch Deletion)

# Let's split by "# ALPAR AI"
def get_sections(text):
    parts = text.split("# ALPAR AI — ")
    sections = []
    for p in parts:
        if p.strip():
            sections.append("# ALPAR AI — " + p.strip() + "\n\n---\n\n")
    return sections

head_sections = get_sections(head_text)
master_sections = get_sections(master_text)

# Clean up trailing "---" in sections
head_sections = [s.replace("\n\n---\n\n\n\n---\n\n", "\n\n---\n\n") for s in head_sections]

# Mapping them
# head_sections[0] = v11.23-branch
# head_sections[1] = v11.22-branch
# head_sections[2] = v11.21-branch
# head_sections[3] = v11.20 (External Advice)

# master_sections[0] = v11.22 (K-FIX)
# master_sections[1] = v11.21 (Branch Renaming)
# master_sections[2] = v11.20 (Branch Deletion)

# Ordered:
# v11.25 (new)
# v11.24 (new)
# v11.23-branch (head 0)
# v11.22 (master 0)
# v11.22-branch (head 1)
# v11.21 (master 1)
# v11.21-branch (head 2)
# v11.20 (master 2)
# v11.20 (head 3)

ordered_sections = [
    v11_25,
    v11_24,
    head_sections[0],
    master_sections[0],
    head_sections[1],
    master_sections[1],
    head_sections[2],
    master_sections[2],
    head_sections[3]
]

resolved_text = "".join(ordered_sections)
# Remove the very last "---" if needed, but it's fine since it connects to v11.19

# Replace the whole conflict block
new_content = re.sub(r'<<<<<<< HEAD\n.*?\n>>>>>>> master\n', resolved_text, content, flags=re.DOTALL)

with open("docs/MASTER_PLAN.md", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Conflict resolved and written successfully.")
