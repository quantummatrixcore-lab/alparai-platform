import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Container size="narrow" className="py-24 text-center">
      <p className="text-7xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-fg-primary">Page not found</h1>
      <p className="mt-2 text-sm text-fg-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/">
          <Button leftIcon={<Home className="h-4 w-4" />}>Home</Button>
        </Link>
        <Link href="/incidents">
          <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Browse incidents
          </Button>
        </Link>
      </div>
    </Container>
  );
}
