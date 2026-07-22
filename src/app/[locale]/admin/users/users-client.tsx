"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { RoleSelect } from "@/components/admin/role-select";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface UsersClientProps {
  users: Array<Record<string, unknown>>;
  userRole: "user" | "moderator" | "admin" | "ceo";
  locale: string;
}

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admins" },
  { value: "moderator", label: "Moderators" },
  { value: "user", label: "Users" },
];

export function UsersClient({ users, userRole, locale }: UsersClientProps) {
  const t = useTranslations("admin");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = useMemo(
    () => (roleFilter === "all" ? users : users.filter((u) => u["role"] === roleFilter)),
    [users, roleFilter],
  );

  if (users.length === 0) {
    return (
      <div className="border-border-subtle bg-bg-secondary/30 rounded-2xl border px-6 py-16 text-center backdrop-blur-sm">
        <p className="text-fg-muted text-sm">{t("no_users")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SegmentedControl options={roleOptions} value={roleFilter} onChange={setRoleFilter} />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">{t("users")}</caption>
              <thead>
                <tr className="border-border-subtle text-fg-muted border-b text-left text-xs font-semibold tracking-wider uppercase">
                  <th className="p-4">{t("name")}</th>
                  <th className="p-4">{t("email")}</th>
                  <th className="p-4">{t("role")}</th>
                  <th className="p-4">{t("status")}</th>
                  <th className="p-4 text-right">{t("joined")}</th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {filtered.map((u) => (
                  <tr key={u["id"] as string} className="hover:bg-bg-tertiary/30">
                    <td className="text-fg-primary p-4">
                      {(u["full_name"] as string | null) ?? "—"}
                    </td>
                    <td className="text-fg-muted p-4 text-xs">{(u["email"] as string) ?? "—"}</td>
                    <td className="p-4">
                      <RoleSelect
                        userId={u["id"] as string}
                        currentRole={(u["role"] as string) ?? "user"}
                        currentUserRole={userRole}
                      />
                    </td>
                    <td className="p-4">
                      {u["is_verified"] ? (
                        <Badge variant="success" dot>
                          {t("verified")}
                        </Badge>
                      ) : (
                        <Badge variant="muted">{t("active")}</Badge>
                      )}
                    </td>
                    <td className="text-fg-muted p-4 text-right">
                      {formatDate(new Date(u["created_at"] as string), locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
