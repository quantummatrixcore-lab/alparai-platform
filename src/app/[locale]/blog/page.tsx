import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { getAllPosts } from "@/content/blog-posts";
import { BookOpen, Clock } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";

const CARD_GRADIENTS = [
  "from-brand-600/80 via-purple-600/60 to-rose-600/80",
  "from-blue-600/80 via-cyan-500/60 to-teal-600/80",
  "from-amber-600/80 via-orange-500/60 to-rose-600/80",
  "from-emerald-600/80 via-teal-500/60 to-cyan-600/80",
  "from-violet-600/80 via-purple-500/60 to-pink-600/80",
  "from-indigo-600/80 via-blue-500/60 to-cyan-600/80",
];

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
          const title = locale === "tr" ? post.title_tr : post.title;
          const description = locale === "tr" ? post.description_tr : post.description;
          const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group focus-visible:ring-brand-500 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <Card className="group-hover:border-brand-500/40 h-full overflow-hidden transition-all group-hover:-translate-y-1">
                <div
                  className={`relative h-40 w-full bg-gradient-to-br ${gradient} flex items-end overflow-hidden p-4`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_70%)]" />
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-black/30 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white/90 uppercase backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
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
