"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { submitExpert, type ExpertState } from "@/actions/experts";

const initialState: ExpertState = { ok: false };

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      isLoading={pending}
      size="lg"
      className="bg-success-500 hover:bg-success-600 w-full text-white"
      leftIcon={<Send className="h-4 w-4" />}
    >
      {children}
    </Button>
  );
}

export function ExpertsForm() {
  const [state, formAction] = useFormState(submitExpert, initialState);
  const t = useTranslations("experts");

  useEffect(() => {
    if (state.ok) {
      toast.success(t("form_success"));
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, t]);

  if (state.ok) {
    return (
      <Card variant="elevated">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="text-success-500 mx-auto h-12 w-12" />
          <h2 className="text-fg-primary mt-4 text-xl font-semibold">{t("form_title")}</h2>
          <p className="text-fg-muted mt-2 text-sm">{t("form_success")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.formError && (
        <div
          className="border-danger-500/30 bg-danger-500/5 text-danger-400 rounded-md border p-3 text-sm"
          role="alert"
        >
          {state.formError}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="name"
          label={t("form_name")}
          required
          minLength={2}
          maxLength={100}
          error={state.fieldErrors?.name?.[0]}
        />
        <Input
          name="titleInstitution"
          label={t("form_title_institution")}
          required
          minLength={2}
          maxLength={200}
          error={state.fieldErrors?.titleInstitution?.[0]}
        />
      </div>
      <Input
        name="linkedinUrl"
        type="url"
        label={t("form_linkedin")}
        required
        error={state.fieldErrors?.linkedinUrl?.[0]}
        placeholder="https://linkedin.com/in/username"
      />
      <Textarea
        name="expertise"
        label={t("form_expertise")}
        required
        minLength={5}
        maxLength={500}
        error={state.fieldErrors?.expertise?.[0]}
        rows={4}
      />
      <div className="pt-2">
        <SubmitBtn>{t("form_submit")}</SubmitBtn>
      </div>
      <p className="text-fg-muted pt-1 text-center text-xs">{t("form_footer")}</p>
    </form>
  );
}
