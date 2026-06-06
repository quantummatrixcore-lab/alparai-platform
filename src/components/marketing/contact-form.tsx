"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
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
    <Button type="submit" isLoading={pending} size="lg" className="w-full" leftIcon={<Send className="h-4 w-4" />}>
      {children}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContact, initialState);
  useEffect(() => {
    if (state.ok) toast.success("Message sent");
    else if (state.error) toast.error(state.error);
  }, [state]);

  if (state.ok) {
    return (
      <Card variant="elevated">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success-500" />
          <h2 className="mt-4 text-xl font-semibold text-fg-primary">Message sent</h2>
          <p className="mt-2 text-sm text-fg-muted">
            We typically respond within 1–2 business days.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.formError && (
        <div className="rounded-md border border-danger-500/30 bg-danger-500/5 p-3 text-sm text-danger-400" role="alert">
          {state.formError}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input name="name" label="Your name" required minLength={2} maxLength={100} error={state.fieldErrors?.name?.[0]} />
        <Input name="email" type="email" label="Email" required error={state.fieldErrors?.email?.[0]} />
      </div>
      <Select
        name="category"
        label="Category"
        required
        defaultValue="general"
        options={[
          { value: "general", label: "General" },
          { value: "press", label: "Press" },
          { value: "partnership", label: "Partnership" },
          { value: "security", label: "Security disclosure" },
          { value: "legal", label: "Legal" },
        ]}
        error={state.fieldErrors?.category?.[0]}
      />
      <Input name="subject" label="Subject" required minLength={5} maxLength={200} error={state.fieldErrors?.subject?.[0]} />
      <Textarea name="message" label="Message" required rows={6} minLength={20} maxLength={5000} error={state.fieldErrors?.message?.[0]} />
      <SubmitBtn>Send message</SubmitBtn>
    </form>
  );
}
