"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { submitContact, type ContactState } from "@/actions/contact";

const initialState: ContactState = { ok: false };

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      isLoading={pending}
      size="lg"
      className="w-full"
      leftIcon={<Send className="h-4 w-4" />}
    >
      {children}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const t = useTranslations("contact.form");
  useEffect(() => {
    if (state.ok) toast.success(t("sent_toast"));
    else if (state.error) toast.error(state.error);
  }, [state, t]);

  if (state.ok) {
    return (
      <Card variant="elevated">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="text-success-500 mx-auto h-12 w-12" />
          <h2 className="text-fg-primary mt-4 text-xl font-semibold">{t("sent_title")}</h2>
          <p className="text-fg-muted mt-2 text-sm">{t("sent_desc")}</p>
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
          label={t("name")}
          required
          minLength={2}
          maxLength={100}
          error={state.fieldErrors?.name?.[0]}
        />
        <Input
          name="email"
          type="email"
          label={t("email")}
          required
          error={state.fieldErrors?.email?.[0]}
        />
      </div>
      <Select
        name="category"
        label={t("category")}
        required
        defaultValue="general"
        options={[
          { value: "general", label: t("category_general") },
          { value: "press", label: t("category_press") },
          { value: "partnership", label: t("category_partnership") },
          { value: "investor", label: t("category_investor") },
          { value: "security", label: t("category_security") },
          { value: "legal", label: t("category_legal") },
        ]}
        error={state.fieldErrors?.category?.[0]}
      />
      <Input
        name="subject"
        label={t("subject")}
        required
        minLength={5}
        maxLength={200}
        error={state.fieldErrors?.subject?.[0]}
      />
      <Textarea
        name="message"
        label={t("message")}
        required
        rows={6}
        minLength={20}
        maxLength={5000}
        error={state.fieldErrors?.message?.[0]}
      />
      <SubmitBtn>{t("submit")}</SubmitBtn>
    </form>
  );
}
