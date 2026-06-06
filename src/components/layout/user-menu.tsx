"use client";

import * as React from "react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { User as UserIcon, LogOut, Settings, ShieldCheck, BarChart3 } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { getMe } from "@/actions/auth";

interface SessionUserShape {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: "user" | "moderator" | "admin" | "ceo";
}

export function UserMenu({ initialUser }: { initialUser: SessionUserShape | null }) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUserShape | null>(initialUser);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialUser) return;
    getMe()
      .then((r) => setUser(r.user))
      .catch(() => setUser(null));
  }, [initialUser]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/auth/signin"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong px-4 text-sm font-medium text-fg-primary hover:border-brand-500 hover:text-brand-400 transition-colors"
      >
        {t("signIn")}
      </Link>
    );
  }

  const isMod = user.role === "moderator" || user.role === "admin" || user.role === "ceo";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bg-tertiary border border-border-strong text-fg-primary hover:border-brand-500 overflow-hidden"
        aria-label={tCommon("account")}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-semibold">
            {getInitials(user.fullName ?? user.email)}
          </span>
        )}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-64 rounded-lg border border-border-subtle bg-bg-elevated shadow-2xl overflow-hidden z-50"
        >
          <div className="p-3 border-b border-border-subtle">
            <p className="text-sm font-semibold text-fg-primary truncate">
              {user.fullName ?? user.email}
            </p>
            <p className="text-xs text-fg-muted truncate">{user.email}</p>
            {isMod && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-300">
                <ShieldCheck className="h-3 w-3" />
                {user.role}
              </span>
            )}
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
              onClick={() => setOpen(false)}
            >
              <UserIcon className="h-4 w-4" /> {t("profile")}
            </Link>
            <Link
              href="/my-incidents"
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
              onClick={() => setOpen(false)}
            >
              <BarChart3 className="h-4 w-4" /> {t("myIncidents")}
            </Link>
            <Link
              href="/settings"
              role="menuitem"
              className="flex items-center gap-2 px-3 py-2 text-sm text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" /> {t("settings")}
            </Link>
            {isMod && (
              <Link
                href="/admin"
                role="menuitem"
                className="flex items-center gap-2 px-3 py-2 text-sm text-brand-300 hover:bg-bg-tertiary"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck className="h-4 w-4" /> {t("adminPanel")}
              </Link>
            )}
          </div>
          <div className="border-t border-border-subtle py-1">
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-400 hover:bg-danger-500/10"
              >
                <LogOut className="h-4 w-4" /> {t("signOut")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
