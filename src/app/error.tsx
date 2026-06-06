"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Container size="narrow" className="py-24 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-warning-500" />
      <h1 className="mt-4 text-2xl font-semibold text-fg-primary">Something went wrong</h1>
      <p className="mt-2 text-sm text-fg-muted">
        An unexpected error occurred. Our team has been notified.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-fg-muted">Error ID: {error.digest}</p>
      )}
      <div className="mt-8">
        <Button onClick={reset} leftIcon={<RefreshCw className="h-4 w-4" />}>
          Try again
        </Button>
      </div>
    </Container>
  );
}
