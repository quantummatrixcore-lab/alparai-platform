import * as React from "react";
import { Container, Section } from "@/components/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useTranslations } from "next-intl";
import { IncidentList } from "@/components/incidents/incident-list";
import type { IncidentListItem } from "@/types";

export function LiveFeed({ incidents }: { incidents: IncidentListItem[] }) {
  const t = useTranslations("hero");
  return (
    <Section className="border-t border-border-subtle bg-bg-secondary/50">
      <Container>
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger-500" />
              </span>
              <Activity className="h-4 w-4 text-danger-400" />
              {t("live_feed")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentList incidents={incidents.slice(0, 5)} />
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
