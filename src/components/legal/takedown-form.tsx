"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useTransition, useState } from "react";
import { submitTakedownRequest } from "@/actions/takedown";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const REASONS = [
  { value: "defamation", label: "Defamation / libel" },
  { value: "copyright", label: "Copyright violation" },
  { value: "privacy", label: "Personal data exposure" },
  { value: "factual_error", label: "Factual inaccuracy" },
  { value: "legal_court_order", label: "Court order" },
  { value: "other", label: "Other" },
];

export function TakedownForm() {
  const t = useTranslations("legal");
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-xl border border-success-500/30 bg-success-500/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success-500" />
        <h3 className="mt-3 text-lg font-semibold text-fg-primary">
          {t("takedownReceived", { defaultValue: "Request received" })}
        </h3>
        <p className="mt-2 text-sm text-fg-muted">
          {t("takedownReceivedDesc", {
            defaultValue:
              "We review takedown requests within 7 days. You will receive a response at the email you provided.",
          })}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const res = await submitTakedownRequest({
            target_url: String(fd.get("target_url") ?? ""),
            reason: String(fd.get("reason") ?? ""),
            details: String(fd.get("details") ?? ""),
            requester_name: String(fd.get("requester_name") ?? ""),
            requester_email: String(fd.get("requester_email") ?? ""),
            organization: String(fd.get("organization") ?? ""),
            country: String(fd.get("country") ?? ""),
            identity_proof_url: String(fd.get("identity_proof_url") ?? ""),
          });
          if (res.ok) setDone(true);
          else toast.error(res.error ?? "Failed");
        });
      }}
      className="space-y-4"
    >
      <Input
        name="target_url"
        label={t("takedownTarget", { defaultValue: "URL of the content" })}
        placeholder="https://alparai.online/incidents/…"
        required
        type="url"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="requester_name"
          label={t("takedownName", { defaultValue: "Your full name" })}
          required
        />
        <Input
          name="requester_email"
          label={t("takedownEmail", { defaultValue: "Your email" })}
          required
          type="email"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input name="organization" label={t("takedownOrg", { defaultValue: "Organization (optional)" })} />
        <Input name="country" label={t("takedownCountry", { defaultValue: "Country" })} required />
      </div>
      <Select
        name="reason"
        label={t("takedownReason", { defaultValue: "Reason" })}
        required
        placeholder="Select"
        options={REASONS}
      />
      <Textarea
        name="details"
        label={t("takedownDetails", { defaultValue: "Details" })}
        required
        minLength={50}
        maxLength={4000}
        rows={6}
        placeholder="Provide a clear explanation with supporting evidence."
      />
      <Input
        name="identity_proof_url"
        label={t("takedownProof", { defaultValue: "Link to identity proof (URL)" })}
        required
        type="url"
        placeholder="https://…"
        hint={t("takedownProofHint", {
          defaultValue:
            "Public link to a document proving your identity / authority over the claim.",
        })}
      />
      <Button type="submit" variant="danger" isLoading={pending} size="lg" className="w-full">
        {t("takedownSubmit", { defaultValue: "Submit takedown request" })}
      </Button>
    </form>
  );
}
