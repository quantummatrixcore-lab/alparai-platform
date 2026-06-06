"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SUGGESTION_CATEGORIES } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { submitSuggestion, type SubmitSuggestionState } from "@/actions/suggestions";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

const initialState: SubmitSuggestionState = { ok: false };

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} size="lg" className="w-full">
      {children}
    </Button>
  );
}

export function NewSuggestionForm() {
  const t = useTranslations("suggestions");
  const [state, formAction] = useFormState(submitSuggestion, initialState);
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (state.ok) {
      toast.success("Suggestion submitted");
      setDone(true);
      setTimeout(() => router.push("/suggestions"), 1200);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  if (done) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg font-semibold text-success-500">Thanks for your suggestion!</p>
          <p className="mt-1 text-sm text-fg-muted">Redirecting to suggestions list…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("create_title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Input
            name="title"
            label="Title"
            required
            minLength={8}
            maxLength={200}
            error={state.fieldErrors?.title?.[0]}
          />
          <Textarea
            name="description"
            label={t("create_description")}
            required
            rows={6}
            minLength={20}
            maxLength={5000}
            error={state.fieldErrors?.description?.[0]}
          />
          <Select
            name="category"
            label={t("category")}
            required
            defaultValue="feature"
            options={SUGGESTION_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            error={state.fieldErrors?.category?.[0]}
          />
          <SubmitBtn>{t("create_title")}</SubmitBtn>
        </form>
      </CardContent>
    </Card>
  );
}
