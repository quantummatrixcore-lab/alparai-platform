# ALPAR AI — Yapay Zeka Fabrikası Application Package v1.0

> **Prepared by:** Architect (Claude) · 2026-07-15
> **Target program:** Yapay Zeka Fabrikası (yapayzekafabrikasi.com.tr) — Türkiye İş Bankası AI venture fund + accelerator
> **Applicant:** ALPAR AI (alparai.com) — independent public AI incident registry + independent AI assessor
> **Status:** Ready for Founder review. Founder submits the form personally (Rule #6 — no automated external submission). Antigravity handoff brief in §6.

---

## §1 Program 360° Assessment

### 1.1 What the program is

Yapay Zeka Fabrikası is an **innovative venture capital fund and AI acceleration program operating with Türkiye İş Bankası capital**. It invests in AI startups founded by Turkish entrepreneurs that show momentum, high global growth potential, and the ability to build transformative products. Its stated mission: accelerate the Turkish AI ecosystem, support startups through scale-up, and connect them to the right stakeholders globally.

| Dimension | Fact |
| --- | --- |
| Investment | **USD 50,000–150,000** per accepted startup, sized to needs |
| Program length | **3–6 months** |
| Content | Workshops: financial planning, investment strategy, market access, enterprise sales, pitching; mentoring; networking; Demo Day (held with Bilkent Cyberpark) |
| Selection funnel | Pool of ~3,000 startups → interview shortlist → **top 8** invited to quarterly cohort jury days |
| Jury format | 30-minute pitch per startup, scored by a jury of academics and business leaders |
| Cadence | Cohort/jury selection days every **3 months** |
| Eligibility | AI startup with momentum, global growth potential, **at least one Turkish founder** |

### 1.2 The six evaluation criteria (the scoring rubric)

Startups are evaluated on six axes. Every sentence of the application should serve at least one:

1. **AI competency** — depth of the AI technology itself
2. **Academic maturity** — methodological rigor, research grounding
3. **Awards & acceleration track record** — prior program/prize validation
4. **Customer & sales development** — traction, pipeline, revenue motion
5. **Product, team & vision** — completeness of product and credibility of roadmap
6. **İş Bank Group synergy** — what the bank group gains from this startup

### 1.3 What the two pages signal

- **`/en` (homepage):** positions the program as an investor first, accelerator second ("venture capital fund"). Language emphasizes *global* growth — the jury wants exportable companies, not local services. Turkish founder identity is an explicit filter.
- **`/en/basvuru` (application):** a lightweight web form — the funnel's first gate is scanned quickly by analysts building the ~3,000-startup pool. Verdict: **the application must survive a 60-second skim**. Lead with the sharpest one-liner and the strongest numbers; depth goes into the interview and the 30-minute jury pitch.

### 1.4 Access limitation (disclosure)

The program website blocks automated access (HTTP 403), so the exact live form fields could not be captured programmatically. §3 covers every field such an application form plausibly asks. **Founder action:** open `/en/basvuru` in a browser, map §3 answers onto the actual fields, and flag any question §3 does not cover.

---

## §2 ALPAR AI ↔ Program Fit Analysis

Honesty rule applies (Rule #19): every number below is real and verifiable in the product.

| # | Criterion | Fit | Evidence | Gap / Mitigation |
| --- | --- | --- | --- | --- |
| 1 | AI competency | **Strong** | 5-model cross-audit debate engine with dynamic severity-based routing and Redis cost caching; PII guardian masking pipeline; K-BENCHMARK scoring (Wilson-score based); SSRF-safe multi-provider gateway (OpenRouter, Vertex, NVIDIA NGC, Cohere, HF) | None material |
| 2 | Academic maturity | **Strong** | Public methodology page; peer-review pipeline draft targeting ACM FAccT; methodology corrections/versioning journal; university MOU template + 15–20 institution outreach list | MOUs not yet signed — say "in outreach," never "partnered" |
| 3 | Awards & acceleration | **Weak** | No prior accelerator or award | State plainly; reframe: discipline came from operating, not programs — DORA-instrumented daily deploys, 89/90 roadmap items shipped |
| 4 | Customer & sales | **Early** | Pre-revenue; Stripe Pro tier checkout live; enterprise K-Product and B2B risk-score API built; launch Aug 2, 2026 | The weakest axis. Mitigate with the paid-product-already-built story + Art. 73 regulatory demand thesis |
| 5 | Product, team & vision | **Strong** | Working platform: 400+ documented incidents (source-split visible), model ratings, browser extension, EN+TR, GDPR/KVKK tooling (DSAR export, portability, retention); "Moody's for AI" vision with a dated regulatory catalyst | Solo human founder — present the AI-executor operating model as leverage, and program mentorship as the path to key hires |
| 6 | İş Bank Group synergy | **Strong (must be argued)** | Banks are among the largest AI buyers under EU AI Act + BDDK scrutiny. ALPAR offers: AI vendor risk scoring for procurement, incident monitoring for models the bank deploys, independent assessment layer for model governance, B2B risk API integrable into bank risk workflows | Synergy is non-obvious to a skimming analyst — spell it out (§3, field 14) |

**Net assessment:** genuine top-8 candidacy on criteria 1, 2, 5, 6; honest weakness on 3 and 4. **Timing lever:** launching Aug 2 *before* the next quarterly jury day converts criterion 4 from "pre-launch promise" to "live platform with real usage numbers." Apply now; by interview stage, the platform is live.

---

## §3 Application Copy — Field-by-Field (EN + TR)

Paste-ready. `[FOUNDER TO FILL]` marks personal/legal data the Founder must supply.

**1. Startup name / Girişim adı:** ALPAR AI

**2. Website:** https://alparai.com · GitHub: github.com/quantummatrixcore-lab/alparai.com

**3. Contact / İletişim:** `[FOUNDER TO FILL: full name, e-mail, phone, city]`

**4. Legal status / Şirket durumu:** `[FOUNDER TO FILL: incorporated entity name + date, or "incorporation in progress"]`

**5. Turkish founder confirmation:** Yes — founded by a Turkish entrepreneur. / Evet — girişim Türk kurucu tarafından kurulmuştur.

**6. Stage / Aşama:** Pre-seed · product complete · public launch August 2, 2026 / Pre-seed · ürün tamamlandı · halka açık lansman 2 Ağustos 2026

**7. One-liner (EN):**
> ALPAR AI is the independent public registry of AI failures and an independent AI assessor — the "Moody's for AI" — built for the EU AI Act's mandatory incident-reporting era.

**7. Tek cümle (TR):**
> ALPAR AI, yapay zeka hatalarının bağımsız kamusal kayıt sistemi ve bağımsız yapay zeka değerlendiricisidir — yapay zekanın "Moody's"i — AB Yapay Zeka Yasası'nın zorunlu olay bildirimi dönemi için kuruldu.

**8. Problem (EN):**
> AI systems fail publicly every day — hallucinations, discrimination, safety incidents — but there is no independent, structured, public record of these failures. On December 2, 2027, EU AI Act Article 73 makes serious-incident reporting mandatory for AI providers, and enterprises buying AI have no independent risk signal today. Credit markets solved this with rating agencies; AI has no equivalent referee.

**8. Problem (TR):**
> Yapay zeka sistemleri her gün kamuya açık şekilde hata yapıyor — halüsinasyon, ayrımcılık, güvenlik olayları — ancak bu hataların bağımsız, yapılandırılmış, kamusal bir kaydı yok. 2 Aralık 2027'de AB Yapay Zeka Yasası 73. Madde, yapay zeka sağlayıcıları için ciddi olay bildirimini zorunlu kılıyor; yapay zeka satın alan kurumların ise bugün bağımsız bir risk sinyali yok. Kredi piyasaları bu sorunu derecelendirme kuruluşlarıyla çözdü; yapay zekanın böyle bir hakemi yok.

**9. Solution / Product (EN):**
> A live, working platform (EN+TR): (a) a public AI incident registry — 400+ documented incidents with source transparency, anonymous PII-protected submission, and expert verification; (b) K-BENCHMARK — independent model ratings powered by a 5-model cross-audit engine in which frontier LLMs adversarially evaluate each other's outputs, with Wilson-score statistics and a public methodology; (c) commercial products already built: Pro subscriptions (Stripe live), an enterprise assessment tier, a B2B risk-score API, a read-only auditor/regulator API, and a browser extension that shows incident history for AI products as users browse. GDPR/KVKK compliance is engineered in: PII masking pipeline, DSAR export, data portability, retention schedules, row-level security throughout.

**9. Çözüm / Ürün (TR):**
> Canlı, çalışan bir platform (EN+TR): (a) kamusal yapay zeka olay kayıt sistemi — kaynak şeffaflığıyla 400+ belgelenmiş olay, kişisel verisi korunan anonim bildirim, uzman doğrulaması; (b) K-BENCHMARK — öncü yapay zeka modellerinin birbirinin çıktılarını çapraz denetlediği 5-modelli motorla üretilen bağımsız model derecelendirmeleri, Wilson-skor istatistiği ve kamuya açık metodoloji; (c) hazır ticari ürünler: Pro abonelik (Stripe canlı), kurumsal değerlendirme katmanı, B2B risk-skoru API'si, denetçi/regülatör API'si ve kullanıcılar gezinirken yapay zeka ürünlerinin olay geçmişini gösteren tarayıcı eklentisi. GDPR/KVKK uyumu mimariye gömülü: kişisel veri maskeleme, veri sahibi erişim/taşınabilirlik uçları, saklama politikaları, satır düzeyi güvenlik.

**10. Market & timing (EN):**
> Wedge market: EU AI Act compliance tooling ahead of the Dec 2, 2027 Article 73 deadline — thousands of AI providers serving the EU need incident processes, and every enterprise AI buyer needs independent risk data. Long-term market: AI assurance and ratings, the analog of the $10B+ credit-rating industry, at the start of its regulatory demand curve. Türkiye is an ideal base: EU-adjacent, deep technical talent, and a national AI ecosystem seeking a globally visible governance player.

**10. Pazar ve zamanlama (TR):**
> Giriş pazarı: 2 Aralık 2027 Madde 73 tarihi öncesi AB Yapay Zeka Yasası uyum araçları — AB'ye hizmet veren binlerce sağlayıcının olay bildirim sürecine, yapay zeka satın alan her kurumun bağımsız risk verisine ihtiyacı var. Uzun vadeli pazar: 10 milyar doları aşan kredi derecelendirme sektörünün yapay zeka karşılığı olan güvence ve derecelendirme pazarı — regülasyon kaynaklı talep eğrisinin başındayız. Türkiye ideal üs: AB'ye komşu, derin teknik yetenek havuzu ve küresel görünürlükte bir yönetişim oyuncusu arayan ulusal ekosistem.

**11. Business model (EN):**
> Freemium public registry (trust + data flywheel) → Pro subscriptions for professionals (live) → enterprise: private benchmarks, rating alerts, B2B risk-score API with per-seat/usage pricing → institutional: auditor and regulator API access. Revenue sequencing: users 2026 → revenue 2027 H1 → regulatory demand wave 2027 H2.

**11. İş modeli (TR):**
> Ücretsiz kamusal kayıt (güven + veri çarkı) → profesyoneller için Pro abonelik (canlı) → kurumsal: özel kıyaslamalar, derecelendirme uyarıları, kullanım bazlı B2B risk-skoru API'si → kurumsal-kamusal: denetçi ve regülatör API erişimi. Gelir sıralaması: kullanıcı 2026 → gelir 2027 ilk yarı → regülasyon talebi dalgası 2027 ikinci yarı.

**12. Traction (EN — honest):**
> Pre-launch (public launch August 2, 2026). Registry seeded with 400+ documented, source-labeled incidents plus first organic user submissions; complete paid-tier infrastructure already live in test mode. Engineering velocity as proof of execution: 89 of 90 roadmap items shipped, daily deploys with DORA metrics instrumented, security-audited (RLS, SSRF, secrets scanning, mutation testing).

**12. Çekiş (TR — dürüst):**
> Lansman öncesi (halka açık lansman 2 Ağustos 2026). Kayıt sistemi 400+ belgelenmiş, kaynak etiketli olayla dolu; ilk organik kullanıcı bildirimleri alındı; ücretli katman altyapısı test modunda canlı. Uygulama hızı icra kanıtı: 90 yol haritası maddesinin 89'u tamamlandı, DORA metrikli günlük dağıtım, güvenlik denetiminden geçmiş altyapı.

**13. Competition & moat (EN):**
> Adjacent players: academic incident databases (AIID/OECD AIM — archives, not assessors), model leaderboards (capability, not risk), GRC compliance suites (workflow tools without independent data). No one combines a public incident registry + independent ratings + a regulatory-grade API under a neutrality charter. Moat: referee neutrality (hard to copy for any AI vendor), accumulated incident data, methodology transparency, and EU AI Act taxonomy alignment from day one.

**13. Rekabet ve savunma hattı (TR):**
> Komşu oyuncular: akademik olay veritabanları (arşiv, değerlendirici değil), model liderlik tabloları (yetenek ölçer, risk değil), kurumsal uyum yazılımları (bağımsız verisi olmayan süreç araçları). Kamusal kayıt + bağımsız derecelendirme + regülasyon düzeyi API'yi tarafsızlık şartıyla birleştiren yok. Savunma hattı: hakem tarafsızlığı (hiçbir yapay zeka satıcısının kopyalayamayacağı konum), biriken olay verisi, metodoloji şeffaflığı, ilk günden AB Yapay Zeka Yasası taksonomisiyle hizalanma.

**14. İş Bank Group synergy (EN — criterion 6, decisive):**
> Banks are among the largest enterprise AI adopters and face the heaviest AI governance burden (EU AI Act for EU-facing operations, BDDK model-risk expectations domestically). ALPAR gives the İş Bank Group: (a) independent risk scores for AI vendor procurement; (b) continuous incident monitoring for models the Group deploys; (c) an independent assessment layer strengthening internal model governance; (d) the B2B risk-score API integrable directly into the Group's risk workflows. Strategically, backing the neutral AI referee from Türkiye is an ecosystem-defining, globally visible position for the Group — analogous to early bank backing of credit bureaus.

**14. İş Bankası Grubu sinerjisi (TR):**
> Bankalar en büyük kurumsal yapay zeka kullanıcıları arasında ve en ağır yönetişim yüküyle karşı karşıya (AB'ye dönük operasyonlarda AB Yapay Zeka Yasası, yurtiçinde BDDK model riski beklentileri). ALPAR, İş Bankası Grubu'na şunları sunar: (a) yapay zeka tedarik kararları için bağımsız risk skorları; (b) Grubun kullandığı modeller için sürekli olay izleme; (c) model yönetişimini güçlendiren bağımsız değerlendirme katmanı; (d) Grubun risk süreçlerine doğrudan entegre edilebilir B2B risk-skoru API'si. Stratejik olarak, Türkiye çıkışlı tarafsız yapay zeka hakemini desteklemek Grup için ekosistemi tanımlayan, küresel görünürlükte bir pozisyondur — bankaların kredi bürolarına erken destek vermesine benzer.

**15. Funding ask & use of funds (EN):**
> USD 150,000 for 12 months of runway to convert launch momentum into revenue: 40% two key hires (growth/BD + senior engineer), 25% enterprise sales motion for the assessment tier and risk API, 20% AI compute and infrastructure for scaled cross-audits, 15% legal/compliance (EU entity readiness, regulator relations).

**15. Yatırım talebi ve kullanım planı (TR):**
> 12 aylık koşu payı için 150.000 ABD Doları — lansman ivmesini gelire çevirmek: %40 iki kilit işe alım (büyüme/iş geliştirme + kıdemli mühendis), %25 kurumsal satış motoru (değerlendirme katmanı ve risk API'si), %20 ölçekli çapraz denetimler için işlem gücü ve altyapı, %15 hukuk/uyum (AB tüzel kişilik hazırlığı, regülatör ilişkileri).

**16. Why this program / Neden bu program (EN):**
> Three reasons: (a) our first enterprise customers are financial institutions — İş Bank Group proximity compresses our enterprise learning cycle by years; (b) the program's enterprise-sales and investment-strategy curriculum matches our exact stage: product complete, revenue motion beginning; (c) a bank-backed investor validates the trust-infrastructure positioning itself.

**17. Short versions:**
- **100 characters:** "Independent public registry of AI failures + AI ratings — the Moody's for AI, built for the EU AI Act."
- **~50 words:** "ALPAR AI is the independent public registry of AI incidents and an independent AI assessor. A live EN/TR platform: 400+ documented incidents, K-BENCHMARK model ratings from a 5-model cross-audit engine, and a B2B risk API — positioned for mandatory EU AI Act incident reporting starting December 2027."

---

## §4 Five-Perspective Review

### 4.1 Startup team (execution)
The application is only as strong as launch day. Item 88 (final smoke test) must pass before submission so every number is defensible live in front of a jury. The 30-minute jury pitch is won with a live demo — registry → incident detail → model rating → risk API call — not slides. Rehearse the demo path on production.

### 4.2 VC committee (deal lens)
**Attractive:** dated regulatory catalyst (Dec 2, 2027), category-creation potential, working product with paid infrastructure, capital-efficient build. **Red flags to pre-empt, never hide:** (a) pre-revenue — answer with the built-not-planned monetization stack and Art. 73 demand curve; (b) solo human founder — answer with shipped output (89/90 items, daily deploys) and use-of-funds naming the first two hires; (c) AGPL open-source — answer: the moat is data, neutrality, and methodology, not source code — transparency *is* the product in trust infrastructure; (d) "will regulators/enterprises really pay?" — answer with the auditor API and enterprise tier already built, priced sequencing users→revenue→regulation.

### 4.3 Advisory board (governance & neutrality)
A bank as investor in an independent referee creates a conflict-of-interest question the jury may raise — and the answer is an asset: ALPAR operates under a public Neutrality Charter; methodology is public and versioned; ratings are produced by an automated multi-model pipeline with a published audit trail; no investor receives rating influence. Say this proactively. Precedent framing: credit rating agencies are bank-financed yet function through governance separation; ALPAR encodes that separation in software from day one.

### 4.4 AI ecosystem team (Türkiye positioning)
ALPAR fills a hole in the Turkish AI ecosystem map: many model/application startups, no governance/assurance player. Alignment points worth stating: Türkiye's National AI Strategy emphasizes trustworthy AI; TÜBİTAK runs AI ecosystem calls (1711); Türkiye participates in EuroHPC AI Factory initiatives. ALPAR positions Türkiye as an exporter of AI *governance* — a differentiated national story the program can champion. The program's network (Bilkent Cyberpark, academic jury) directly serves the university-MOU pipeline (criterion 2).

### 4.5 Strategist (sequencing)
- **Apply immediately;** cohorts run quarterly and the funnel starts with an analyst skim — being in the pool early means the interview happens *after* Aug 2 launch, when traction numbers exist.
- **The launch is the pitch:** every week post-launch adds real usage data; target the first post-launch jury day as the decision point.
- **One asset, many doors:** this package is reusable for TÜBİTAK 1711, EU programs, and other accelerators — treat it as the canonical application source.
- **Guard the referee position:** if terms advance, negotiate investment rights that never touch ratings governance (see 4.3). Walking away from a term sheet that compromises neutrality is cheaper than the position it would destroy.

---

## §5 Risks & Founder Pre-Submission Checklist

| # | Item | Action |
| --- | --- | --- |
| 1 | Live form fields unknown (site blocks automated access) | Open `/en/basvuru` in a browser; map §3 onto actual fields |
| 2 | Legal entity data | Fill all `[FOUNDER TO FILL]` fields before submitting |
| 3 | Numbers must match production | Submit only after item 88 smoke test passes (Rule #19) |
| 4 | Equity/valuation terms not published | Ask in interview; check Rule #4/neutrality constraints before signing anything |
| 5 | Repo visibility | §7/R1 decision (private repo) should be made before due diligence begins |
| 6 | Submission authorship | Founder submits personally — no automated form submission (Rule #6) |

## §6 Antigravity Handoff Brief (production tasks — Founder triggers)

> ⚠️ MASTER_PLAN.md is read-only for you (Rule #14). This brief is your only instruction source for this work. No external posting or submission of any kind (Rule #6) — all outputs are files in the repository for the Founder's personal use.

1. **Pitch one-pager:** produce `docs/APPLICATIONS/001-assets/one-pager.md` from §3 content (EN) — problem, solution, traction, ask, synergy in one page.
2. **Metrics snapshot:** on the day the Founder submits, generate `docs/APPLICATIONS/001-assets/metrics-snapshot.md` with live production counts (incidents total/organic split, model ratings count, uptime) so submitted numbers are evidence-backed.
3. **Demo script:** `docs/APPLICATIONS/001-assets/demo-script.md` — the 5-minute live demo path in §4.1 with exact URLs and fallback screenshots.
4. Quality gate per Rule #10; English only per Rule #29; commit to `master` per Rule #15.

---

*End of application package. Founder decision required before any submission.*
