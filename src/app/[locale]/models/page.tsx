import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Star, MessageSquare, Lightbulb, ChevronRight } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface ModelPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    search?: string;
    sort?: string;
  }>;
}

export default async function ModelsPage({ params, searchParams }: ModelPageProps) {
  const { locale } = await params;
  const { search, sort } = await searchParams;
  const t = await getTranslations({ locale, namespace: "models" });
  const db = await createServerClient();

  // Fetch all models, reviews, and feature requests
  const [modelsRes, reviewsRes, featuresRes] = await Promise.all([
    db
      .from("ai_models")
      .select(
        "id, name, version, status, released_at, provider_id, ai_providers(id, name, slug, logo_url)",
      )
      .order("name"),
    db.from("model_reviews").select("model_id, score_overall").eq("status", "published"),
    db.from("model_feature_requests").select("model_id, id"),
  ]);

  const models = modelsRes.data || [];
  const reviews = reviewsRes.data || [];
  const features = featuresRes.data || [];

  // Calculate aggregates
  const reviewStats = reviews.reduce(
    (acc: Record<string, { total: number; count: number }>, curr) => {
      const modelId = curr.model_id;
      let stat = acc[modelId];
      if (!stat) {
        stat = { total: 0, count: 0 };
        acc[modelId] = stat;
      }
      stat.total += curr.score_overall;
      stat.count += 1;
      return acc;
    },
    {},
  );

  const featureStats = features.reduce((acc: Record<string, number>, curr) => {
    acc[curr.model_id] = (acc[curr.model_id] || 0) + 1;
    return acc;
  }, {});

  // Apply search filtering
  let filteredModels = [...models];
  if (search) {
    const searchLower = search.toLowerCase();
    filteredModels = filteredModels.filter((model) => {
      const provider = model.ai_providers as { name: string } | null;
      return (
        model.name.toLowerCase().includes(searchLower) ||
        (provider?.name && provider.name.toLowerCase().includes(searchLower))
      );
    });
  }

  // Apply sorting
  filteredModels.sort((a, b) => {
    const statsA = reviewStats[a.id] || { total: 0, count: 0 };
    const statsB = reviewStats[b.id] || { total: 0, count: 0 };
    const avgA = statsA.count > 0 ? statsA.total / statsA.count : 0;
    const avgB = statsB.count > 0 ? statsB.total / statsB.count : 0;
    const featA = featureStats[a.id] || 0;
    const featB = featureStats[b.id] || 0;

    switch (sort) {
      case "rating":
        return avgB - avgA;
      case "reviews":
        return statsB.count - statsA.count;
      case "features":
        return featB - featA;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const statusVariants: Record<string, "success" | "muted" | "warning"> = {
    active: "success",
    deprecated: "muted",
    beta: "warning",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4 text-center">
        <h1 className="text-fg-primary from-brand-400 bg-gradient-to-r to-rose-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          {t("page_title")}
        </h1>
        <p className="text-fg-muted mx-auto max-w-2xl text-lg">{t("page_subtitle")}</p>
      </div>

      {/* Filter and Sort Form */}
      <form
        method="GET"
        className="border-border-subtle bg-bg-secondary/20 mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border p-4 backdrop-blur-md sm:flex-row"
      >
        <input
          type="text"
          name="search"
          defaultValue={search || ""}
          placeholder={t("search_placeholder")}
          className="border-border-subtle bg-bg-secondary/40 text-fg-primary focus:border-brand-500 placeholder-fg-muted flex-1 rounded-xl border px-4 py-2 text-sm transition focus:outline-none"
        />
        <select
          name="sort"
          defaultValue={sort || "name"}
          className="border-border-subtle bg-bg-secondary/40 text-fg-primary focus:border-brand-500 cursor-pointer rounded-xl border px-4 py-2 text-sm transition focus:outline-none"
        >
          <option value="name">{t("sort_name")}</option>
          <option value="rating">{t("sort_rating")}</option>
          <option value="reviews">{t("sort_reviews")}</option>
          <option value="features">{t("sort_features")}</option>
        </select>
        <button
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 rounded-xl px-6 py-2 text-sm font-semibold text-white transition"
        >
          {t("filter")}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredModels.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-brand-500/10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
              <Lightbulb className="text-brand-400 h-8 w-8" />
            </div>
            <h3 className="text-fg-primary mb-2 text-xl font-bold">
              {search ? t("no_results_title") : t("empty_title")}
            </h3>
            <p className="text-fg-muted max-w-sm text-sm">
              {search ? t("no_results_subtitle") : t("empty_subtitle")}
            </p>
          </div>
        ) : (
          filteredModels.map((model) => {
            const provider = model.ai_providers as {
              id: string;
              name: string;
              slug: string;
              logo_url: string | null;
            } | null;
            const stats = reviewStats[model.id] || { total: 0, count: 0 };
            const avgScore = stats.count > 0 ? stats.total / stats.count : 0;
            const featuresCount = featureStats[model.id] || 0;

            return (
              <Link
                key={model.id}
                href={`/${locale}/models/${model.provider_id}/${model.id}`}
                className="group border-border-subtle bg-bg-secondary/40 hover:bg-bg-secondary/60 hover:border-brand-500/30 flex flex-col justify-between rounded-2xl border p-6 shadow-lg transition duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {provider?.logo_url ? (
                        <img
                          src={provider.logo_url}
                          alt={provider.name}
                          className="bg-bg-tertiary h-8 w-8 rounded-lg object-contain p-1"
                        />
                      ) : (
                        <div className="bg-bg-tertiary text-fg-muted flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                          {provider?.name?.[0] || "AI"}
                        </div>
                      )}
                      <span className="text-fg-secondary text-sm font-semibold">
                        {provider?.name || "Unknown Provider"}
                      </span>
                    </div>
                    <Badge variant={statusVariants[model.status] || "default"} size="sm">
                      {t(model.status)}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-fg-primary group-hover:text-brand-400 flex items-center justify-between text-xl font-bold transition-colors">
                      {model.name}
                      <ChevronRight className="text-fg-muted group-hover:text-brand-400 h-5 w-5 transition-all group-hover:translate-x-1" />
                    </h3>
                    <p className="text-fg-muted text-xs">
                      {model.version && t("version", { version: model.version })}
                      {model.released_at && ` • ${t("released", { date: model.released_at })}`}
                    </p>
                  </div>
                </div>

                <div className="border-border-subtle text-fg-secondary mt-6 flex items-center justify-between border-t pt-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Star
                      className={`h-4 w-4 ${avgScore > 0 ? "fill-brand-400 text-brand-400" : "text-border-strong"}`}
                    />
                    <span className="text-fg-primary font-bold">
                      {avgScore > 0 ? avgScore.toFixed(1) : "-"}
                    </span>
                    <span className="text-fg-muted">({stats.count})</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="text-fg-muted h-3.5 w-3.5" />
                      <span>{stats.count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lightbulb className="text-fg-muted h-3.5 w-3.5" />
                      <span>{featuresCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
