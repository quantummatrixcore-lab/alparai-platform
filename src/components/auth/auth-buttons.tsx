"use client";

import * as React from "react";
import { signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function GoogleSignInButton({
  next = "/profile",
  className,
}: {
  next?: string;
  className?: string;
}) {
  const t = useTranslations("auth");
  const [pending, start] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      isLoading={pending}
      className={className}
      onClick={() => {
        start(async () => {
          const res = await signInWithGoogle(next);
          if (res.url) window.location.href = res.url;
          else if (res.error) toast.error(res.error);
        });
      }}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {t("signin_with_google")}
    </Button>
  );
}

export function EmailMagicLinkForm({ className }: { className?: string }) {
  const t = useTranslations("auth");
  const [pending, start] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email");
        if (!email) return;
        start(async () => {
          const { signInWithMagicLink } = await import("@/actions/auth");
          const res = await signInWithMagicLink(String(email));
          if (res.ok) {
            setSent(true);
            toast.success(t("magic_link_sent"));
          } else {
            toast.error(res.error ?? "Failed");
          }
        });
      }}
    >
      {sent ? (
        <p className="text-success-500 text-sm" role="status">
          {t("magic_link_sent")}
        </p>
      ) : (
        <>
          <label htmlFor="magic-email" className="mb-1.5 block text-sm font-medium">
            {t("or_continue_email")}
          </label>
          <div className="flex gap-2">
            <input
              id="magic-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="border-border-subtle bg-bg-secondary focus:ring-brand-500 flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
            <Button type="submit" isLoading={pending} leftIcon={<Mail className="h-4 w-4" />}>
              Send
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
