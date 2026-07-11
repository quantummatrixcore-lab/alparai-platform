"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist, type WaitlistState } from "@/actions/waitlist";

const initialState: WaitlistState = { ok: false };

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      isLoading={pending}
      size="lg"
      className="bg-brand-500 hover:bg-brand-400 w-full shrink-0 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] sm:w-auto"
      leftIcon={<Sparkles className="h-4 w-4 text-white" />}
    >
      {children}
    </Button>
  );
}

export function WaitlistForm() {
  const [state, formAction] = useActionState(joinWaitlist, initialState);
  const t = useTranslations("waitlist");

  useEffect(() => {
    if (state.ok) {
      toast.success(t("success"));
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, t]);

  if (state.ok) {
    return (
      <Card variant="elevated" className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
          <h3 className="mt-3 text-xl font-black tracking-tight text-emerald-400">
            {t("success")}
          </h3>
          <p className="text-fg-secondary mx-auto mt-2 max-w-md text-sm">{t("success_desc")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        {state.formError && (
          <div
            className="border-danger-500/30 bg-danger-500/5 text-danger-400 rounded-md border p-3 text-sm font-medium"
            role="alert"
          >
            {state.formError}
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              name="email"
              type="email"
              placeholder={t("email_placeholder")}
              required
              error={state.fieldErrors?.email?.[0]}
              className="text-fg-primary placeholder:text-fg-muted/60 h-12 border-white/10 bg-slate-950/80"
            />
          </div>
          <SubmitBtn>{t("submit")}</SubmitBtn>
        </div>
      </form>
      <p className="text-fg-muted text-[11px] font-medium tracking-wide">{t("privacy")}</p>
    </div>
  );
}
