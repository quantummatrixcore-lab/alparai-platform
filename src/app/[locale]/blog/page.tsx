import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getAllPosts } from "@/content/blog-posts";
import {
  BookOpen,
  Clock,
  Shield,
  FileText,
  Database,
  AlertTriangle,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";

const CARD_GRADIENTS = [
  "from-brand-900/50 via-purple-900/30 to-rose-900/50 border-brand-500/10",
  "from-blue-900/50 via-cyan-900/30 to-teal-900/50 border-blue-500/10",
  "from-amber-900/50 via-orange-900/30 to-rose-900/50 border-amber-500/10",
  "from-emerald-900/50 via-teal-900/30 to-cyan-900/50 border-emerald-500/10",
  "from-violet-900/50 via-purple-900/30 to-pink-900/50 border-violet-500/10",
  "from-indigo-900/50 via-blue-900/30 to-cyan-900/50 border-indigo-500/10",
];

const TAG_TRANSLATIONS: Record<string, string> = {
  opinion: "Görüş",
  "ai-ethics": "AI Etiği",
  governance: "Yönetişim",
  guide: "Rehber",
  incidents: "Olaylar",
  tutorial: "Kılavuz",
  security: "Güvenlik",
  privacy: "Gizlilik",
  "pii-guardian": "KVT Koruyucu",
  regulation: "Düzenleme",
  claude: "Claude",
  ban: "Yasak",
  "ai-governance": "AI Yönetişimi",
  accountability: "Hesap Verebilirlik",
  transparency: "Şeffaflık",
  research: "Araştırma",
  "annual-report": "Yıllık Rapor",
  report: "Rapor",
  autopilot: "Otopilot",
};

function getPostIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("accountability-matters")) {
    return (
      <Shield className="text-brand-400 h-10 w-10 transition duration-300 group-hover:scale-110" />
    );
  }
  if (s.includes("report-ai-incident")) {
    return (
      <FileText className="h-10 w-10 text-blue-400 transition duration-300 group-hover:scale-110" />
    );
  }
  if (s.includes("public-record")) {
    return (
      <Database className="h-10 w-10 text-emerald-400 transition duration-300 group-hover:scale-110" />
    );
  }
  if (s.includes("top-10-ai-incidents")) {
    return (
      <AlertTriangle className="h-10 w-10 text-rose-400 transition duration-300 group-hover:scale-110" />
    );
  }
  if (s.includes("pii-guardian")) {
    return (
      <ShieldAlert className="text-warning-400 h-10 w-10 transition duration-300 group-hover:scale-110" />
    );
  }
  if (s.includes("claude-banned")) {
    return (
      <Cpu className="h-10 w-10 text-purple-400 transition duration-300 group-hover:scale-110" />
    );
  }

  return (
    <BookOpen className="text-brand-400 h-10 w-10 transition duration-300 group-hover:scale-110" />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title"), description: t("description") };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const supabase = await createServerClient();
  const { data: dbPostsRaw } = await supabase
    .from("blog_posts")
    .select("slug, title_en, title_tr, content_en, content_tr, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const dbPosts = (dbPostsRaw ?? []).map((p) => ({
    slug: p.slug,
    title: p.title_en,
    title_tr: p.title_tr,
    description: p.content_en.slice(0, 160) + "...",
    description_tr: p.content_tr.slice(0, 160) + "...",
    author: "ALPAR AI Autopilot",
    author_tr: "ALPAR AI Otopilot",
    date: p.published_at ?? p.created_at,
    readingTime: Math.max(
      1,
      Math.ceil((locale === "tr" ? p.content_tr : p.content_en).split(/\s+/).length / 200),
    ),
    tags: ["Report", "Autopilot"],
  }));

  const posts = [...dbPosts, ...getAllPosts()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Container className="py-12">
      <header className="mb-10 max-w-3xl">
        <div className="border-brand-500/30 bg-brand-500/10 text-brand-400 mb-4 inline-flex items-center gap-2 rounded-sm border px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase">
          <BookOpen className="h-4 w-4" />
          {t("eyebrow")}
        </div>
        <h1 className="text-fg-primary mb-3 text-4xl font-black tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted text-lg">{t("description")}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => {
          const title = locale === "tr" ? post.title_tr || post.title : post.title || post.title_tr;
          const description =
            locale === "tr"
              ? post.description_tr || post.description
              : post.description || post.description_tr;
          const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group focus-visible:ring-brand-500 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <Card className="group-hover:border-brand-500/40 h-full overflow-hidden transition-all duration-350 group-hover:-translate-y-1">
                <div
                  className={`relative h-44 w-full bg-gradient-to-br ${gradient} flex flex-col justify-between overflow-hidden border-b p-4`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_70%)]" />

                  {/* Glowing Icon in the middle */}
                  <div className="relative z-10 flex flex-1 items-center justify-center">
                    <div className="bg-bg-primary/60 group-hover:bg-bg-primary/80 group-hover:border-brand-500/20 rounded-2xl border border-white/5 p-3 shadow-2xl backdrop-blur-md transition duration-300 group-hover:scale-105">
                      {getPostIcon(post.slug)}
                    </div>
                  </div>

                  <div className="relative z-10 mt-2 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => {
                      const displayTag =
                        locale === "tr" ? TAG_TRANSLATIONS[tag.toLowerCase()] || tag : tag;
                      return (
                        <span
                          key={tag}
                          className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white/90 uppercase backdrop-blur-sm"
                        >
                          {displayTag}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <CardContent className="space-y-3 p-6">
                  <div className="text-fg-muted flex items-center gap-3 text-xs">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} {t("min")}
                    </span>
                  </div>
                  <h2 className="text-fg-primary group-hover:text-brand-400 text-xl font-bold transition-colors">
                    {title}
                  </h2>
                  <p className="text-fg-muted line-clamp-3 text-sm">{description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
