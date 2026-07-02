import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-bg-tertiary animate-pulse rounded-md", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
