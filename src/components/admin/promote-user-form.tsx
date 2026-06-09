"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { promoteUser } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Shield, UserCog, UserCheck, X } from "lucide-react";

interface PromoteUserFormProps {
  currentUserRole: "user" | "moderator" | "admin" | "ceo";
}

const ROLE_OPTIONS: Array<{
  value: "user" | "moderator" | "admin" | "ceo";
  label: string;
  icon: typeof UserCheck;
  description: string;
  minRole: "user" | "moderator" | "admin" | "ceo";
}> = [
  {
    value: "user",
    label: "User",
    icon: UserCheck,
    description: "Standard account",
    minRole: "user",
  },
  {
    value: "moderator",
    label: "Moderator",
    icon: UserCog,
    description: "Can review & publish incidents",
    minRole: "admin",
  },
  {
    value: "admin",
    label: "Admin",
    icon: Shield,
    description: "Can manage users & audit logs",
    minRole: "admin",
  },
  {
    value: "ceo",
    label: "CEO",
    icon: Shield,
    description: "Full access including autopilot",
    minRole: "ceo",
  },
];

export function PromoteUserForm({ currentUserRole }: PromoteUserFormProps) {
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "moderator" | "admin" | "ceo">("moderator");
  const [pending, start] = useTransition();

  const availableRoles = ROLE_OPTIONS.filter((opt) => {
    if (currentUserRole === "ceo") return true;
    if (currentUserRole === "admin") return opt.value !== "ceo";
    return false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    start(async () => {
      const res = await promoteUser(email, role);
      if (res.ok) {
        toast.success(t("promote_success", { email, role }));
        setEmail("");
        setOpen(false);
      } else {
        toast.error(res.error ?? t("promote_failed"));
      }
    });
  };

  if (!open) {
    return (
      <Button
        type="button"
        variant="primary"
        leftIcon={<UserCog className="h-4 w-4" />}
        onClick={() => setOpen(true)}
      >
        {t("promote_user")}
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border-subtle bg-bg-secondary/50 space-y-4 rounded-lg border p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-fg-primary text-sm font-semibold">{t("promote_user_title")}</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-fg-muted hover:text-fg-primary"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label htmlFor="promote-email" className="text-fg-secondary mb-1 block text-xs font-medium">
          {t("promote_email_label")}
        </label>
        <input
          id="promote-email"
          type="email"
          required
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-border-subtle bg-bg-primary focus:ring-brand-500 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-fg-secondary mb-1 block text-xs font-medium">
          {t("promote_role_label")}
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {availableRoles.map((opt) => {
            const Icon = opt.icon;
            const selected = role === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={`flex items-start gap-2 rounded-md border p-2 text-left transition-colors ${
                  selected
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-border-subtle bg-bg-primary hover:border-brand-500/30"
                }`}
              >
                <Icon
                  className={`mt-0.5 h-4 w-4 shrink-0 ${selected ? "text-brand-400" : "text-fg-muted"}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-fg-primary text-xs font-semibold">{opt.label}</p>
                  <p className="text-fg-muted text-xs">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
        <Button type="submit" isLoading={pending} disabled={!email}>
          {t("promote_confirm")}
        </Button>
      </div>
    </form>
  );
}
