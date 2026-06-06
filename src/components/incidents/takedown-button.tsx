"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { useTranslations } from "next-intl";
import { submitTakedown } from "@/actions/takedown";
import { toast } from "sonner";

const REASONS = [
  { value: "defamation", label: "Defamation / libel" },
  { value: "copyright", label: "Copyright violation" },
  { value: "privacy", label: "Personal data exposure" },
  { value: "factual_error", label: "Factual inaccuracy" },
  { value: "legal_court_order", label: "Court order" },
  { value: "other", label: "Other (explain in details)" },
];

export function TakedownButton({ incidentId }: { incidentId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const t = useTranslations("incident");
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<Flag className="h-3.5 w-3.5" />}
        onClick={() => setOpen(true)}
        className="w-full"
      >
        {t("report_inappropriate")}
      </Button>
      <Modal open={open} onOpenChange={setOpen} title={t("takedown")} description={t("takedownDesc", { defaultValue: "Submit a takedown or correction request. We review all submissions within 7 days." })}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            start(async () => {
              const res = await submitTakedown({
                incidentId,
                reason: String(formData.get("reason") ?? ""),
                details: String(formData.get("details") ?? ""),
                contactEmail: String(formData.get("contact_email") ?? ""),
              });
              if (res.ok) {
                toast.success(res.message ?? "Submitted");
                setOpen(false);
              } else {
                toast.error(res.error ?? "Failed");
              }
            });
          }}
          className="space-y-4"
        >
          <Select
            name="reason"
            label="Reason"
            required
            placeholder="Select a reason"
            options={REASONS}
          />
          <Textarea
            name="details"
            label="Details"
            required
            minLength={20}
            maxLength={2000}
            rows={4}
            placeholder="Explain the issue and provide supporting facts."
          />
          <Textarea
            name="contact_email"
            label="Contact email"
            required
            placeholder="you@example.com"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={pending}>
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
