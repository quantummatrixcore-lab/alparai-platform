"use client";

import * as React from "react";
import { useState } from "react";
import { toggleVerifiedRespondent } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VerifiedRespondentToggleProps {
  providerId: string;
  isVerified: boolean;
  contactEmail: string | null;
  providerName: string;
}

export function VerifiedRespondentToggle({
  providerId,
  isVerified,
  contactEmail,
  providerName,
}: VerifiedRespondentToggleProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(contactEmail || "");

  const handleToggle = async () => {
    if (isVerified) {
      if (
        confirm(
          `Are you sure you want to revoke the Verified Respondent status for ${providerName}?`,
        )
      ) {
        setLoading(true);
        try {
          const res = await toggleVerifiedRespondent(providerId, false);
          if (res.ok) {
            toast.success("Verified Respondent status revoked successfully.");
          } else {
            toast.error(res.error || "Failed to revoke status.");
          }
        } catch {
          toast.error("An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      }
    } else {
      setOpen(true);
    }
  };

  const handleConfirmVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setLoading(true);
    try {
      const res = await toggleVerifiedRespondent(providerId, true, email);
      if (res.ok) {
        toast.success("Verified Respondent status granted successfully.");
      } else {
        toast.error(res.error || "Failed to grant status.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {isVerified ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={loading}
            className="gap-1.5 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>Verified</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={loading}
            className="gap-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>Unverified</span>
          </Button>
        )}
      </div>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Verify AI Provider"
        description={`Set Verified Respondent status for ${providerName}`}
      >
        <form onSubmit={handleConfirmVerify} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-fg-primary block text-sm font-medium">
              Respondent Contact Email (Optional)
            </label>
            <Input
              type="email"
              placeholder="e.g. contact@provider.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-bg-tertiary"
            />
            <p className="text-fg-muted text-[11px]">
              This email will receive notifications when new incidents involving this provider are
              reported.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              Confirm Verification
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
