import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Banner Skeleton */}
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-7 w-64 rounded-full bg-slate-800/60" />
        <Skeleton className="mx-auto h-12 w-80 rounded-xl bg-slate-800/80 sm:w-[480px]" />
        <Skeleton className="mx-auto h-5 w-72 rounded-lg bg-slate-800/60 sm:w-96" />
      </div>

      {/* Stat Cards Skeleton Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded bg-slate-800" />
              <Skeleton className="h-9 w-9 rounded-xl bg-slate-800" />
            </div>
            <Skeleton className="mt-3 h-8 w-16 rounded-lg bg-slate-800" />
            <Skeleton className="mt-2 h-3.5 w-32 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* Glass Filter Bar Skeleton */}
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl sm:flex-row">
        <Skeleton className="h-10 flex-1 rounded-xl bg-slate-800" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl bg-slate-800" />
          <Skeleton className="h-10 w-24 rounded-xl bg-brand-500/20" />
        </div>
      </div>

      {/* Enterprise Table Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="border-b border-white/10 bg-slate-950/60 p-4">
          <Skeleton className="h-5 w-full rounded bg-slate-800/40" />
        </div>
        <div className="divide-y divide-white/5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 md:grid md:grid-cols-[2fr_1.2fr_1.2fr_1.2fr_0.8fr_0.8fr_40px] md:items-center md:gap-4 md:px-6 md:py-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded bg-slate-800" />
                <Skeleton className="h-3 w-28 rounded bg-slate-800/60" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-lg bg-slate-800" />
                <Skeleton className="h-4 w-24 rounded bg-slate-800" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full bg-slate-800" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded bg-slate-800" />
                <Skeleton className="h-5 w-8 rounded bg-slate-800" />
              </div>
              <Skeleton className="h-4 w-8 rounded bg-slate-800" />
              <Skeleton className="h-4 w-8 rounded bg-slate-800" />
              <Skeleton className="h-8 w-8 rounded-xl bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

