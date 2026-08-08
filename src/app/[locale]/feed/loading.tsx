export default function Loading() {
  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center space-y-4 p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-800 border-t-zinc-400" />
      <div className="h-4 w-32 animate-pulse rounded-md bg-zinc-800/50" />
    </div>
  );
}
