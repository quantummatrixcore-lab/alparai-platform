"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SEC = 60;

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              width?: number | string;
              text?: string;
              shape?: string;
            },
          ) => void;
          prompt: (
            notification?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void,
          ) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({
  next = "/profile",
  className,
  disabled = false,
}: {
  next?: string;
  className?: string;
  disabled?: boolean;
}) {
  const t = useTranslations("auth");
  const [pending, start] = useTransition();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleFallbackSignIn = React.useCallback(() => {
    start(async () => {
      const { signInWithGoogle } = await import("@/actions/auth");
      const res = await signInWithGoogle(next);
      if (res.ok && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || t("server_error"));
      }
    });
  }, [next, t]);

  React.useEffect(() => {
    if (disabled) return;

    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "341717447635-75ramo1e88p34b9dkmhfp5ocecqv0ff1.apps.googleusercontent.com";

    const loadAndRenderGIS = async () => {
      if (typeof window === "undefined") return;
      if (!window.google?.accounts?.id) {
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Google GIS"));
            document.head.appendChild(script);
          });
        } catch {
          return;
        }
      }

      if (window.google?.accounts?.id && containerRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              start(async () => {
                const { signInWithGoogleIdToken } = await import("@/actions/auth");
                const res = await signInWithGoogleIdToken(response.credential!);
                if (res.ok) {
                  window.location.href = next;
                } else {
                  toast.error(res.error || t("server_error"));
                }
              });
            }
          },
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          width: 320,
          text: "signin_with",
          shape: "rectangular",
        });
      }
    };

    loadAndRenderGIS();
  }, [disabled, next, t]);

  return (
    <div
      className={cn(
        "relative flex min-h-[48px] w-full flex-col items-center justify-center",
        className,
      )}
    >
      <div ref={containerRef} className="flex min-h-[44px] w-full justify-center" />
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )}
      {disabled && (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          disabled={true}
          onClick={handleFallbackSignIn}
          className="w-full cursor-not-allowed opacity-50"
        >
          {t("signin_with_google")}
        </Button>
      )}
    </div>
  );
}

type MagicLinkState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "sent"; email: string; sentAt: number }
  | { status: "error"; message: string };

export function EmailMagicLinkForm({
  className,
  disabled = false,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const t = useTranslations("auth");
  const [, start] = useTransition();
  const [state, setState] = useState<MagicLinkState>({ status: "idle" });
  const [emailValue, setEmailValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleSend = (email: string, isResend = false) => {
    if (!EMAIL_REGEX.test(email)) {
      setValidationError(t("invalid_email"));
      return;
    }
    setValidationError(null);
    setState({ status: "sending" });

    start(async () => {
      const { signInWithMagicLink } = await import("@/actions/auth");
      const res = await signInWithMagicLink(email);
      if (res.ok) {
        setState({ status: "sent", email, sentAt: Date.now() });
        setCooldown(RESEND_COOLDOWN_SEC);
        if (isResend) {
          toast.success(t("magic_link_sent_toast", { email }));
        }
      } else {
        const message = res.error ?? t("server_error");
        setState({ status: "error", message });
        toast.error(message);
      }
    });
  };

  const handleResend = () => {
    if (cooldown > 0 || !state || state.status !== "sent") return;
    handleSend(state.email, true);
  };

  const handleTryAnother = () => {
    setState({ status: "idle" });
    setEmailValue("");
    setValidationError(null);
  };

  if (state?.status === "sent") {
    const parts = t.rich("magic_link_subtitle", {
      email: () => (
        <span className="text-fg-primary font-semibold break-all" dir="ltr">
          {state.email}
        </span>
      ),
    });
    return (
      <div
        className={`border-success-500/30 bg-success-500/5 space-y-4 rounded-lg border p-5 ${className ?? ""}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="bg-success-500/15 shrink-0 rounded-full p-1.5">
            <CheckCircle2 className="text-success-500 h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-fg-primary text-sm font-semibold">{t("magic_link_heading")}</h3>
            <p className="text-fg-secondary text-xs leading-relaxed">{parts}</p>
          </div>
        </div>

        <div className="text-fg-muted flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <span>
            {t("magic_link_check_spam")}{" "}
            <button
              type="button"
              onClick={handleTryAnother}
              className="text-brand-400 font-medium underline-offset-2 hover:underline"
            >
              {t("magic_link_try_another")}
            </button>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="h-7 px-2 text-xs"
          >
            {cooldown > 0 ? `${t("magic_link_resend")} (${cooldown}s)` : t("magic_link_resend")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        handleSend(emailValue.trim(), false);
      }}
      noValidate
    >
      <label htmlFor="magic-email" className="text-fg-secondary mb-1.5 block text-xs font-medium">
        {t("email_label")}
      </label>
      <div className="space-y-3">
        <div className="relative">
          <input
            id="magic-email"
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={emailValue}
            onChange={(e) => {
              setEmailValue(e.target.value);
              if (validationError) setValidationError(null);
            }}
            disabled={disabled || state?.status === "sending"}
            aria-invalid={validationError ? true : undefined}
            aria-describedby={validationError ? "magic-email-error" : undefined}
            className="focus:border-brand-500/80 focus:ring-brand-500/20 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder-white/30 transition-all hover:bg-white/[0.04] focus:bg-white/[0.05] focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <Button
          type="submit"
          className="from-brand-600 hover:from-brand-500 active:from-brand-700 h-11 w-full rounded-xl bg-gradient-to-r to-indigo-600 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] active:to-indigo-700 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          isLoading={state?.status === "sending"}
          disabled={disabled || !emailValue.trim()}
          leftIcon={
            state?.status !== "sending" ? (
              <Mail className="h-4 w-4" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )
          }
        >
          {state?.status === "sending" ? t("magic_link_sending") : t("send")}
        </Button>
      </div>
      {validationError && (
        <p id="magic-email-error" className="text-danger-400 mt-1.5 text-xs" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
