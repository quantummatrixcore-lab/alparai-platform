"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Star, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface Advocate {
  id: string;
  name: string;
  avatar_url: string | null;
  reputation_score: number;
  badges: string[];
}

export function AdvocateOfTheWeek({ advocate }: { advocate: Advocate | null }) {
  const t = useTranslations("marketing.advocate_of_week");

  // If no real advocate is passed (e.g. no users have points yet), we can show a placeholder or hide
  if (!advocate) return null;

  return (
    <div className="group relative w-full">
      <div className="from-success-500 to-brand-500 absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
      <Card variant="glass" className="relative overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute -top-6 -right-6 rotate-12 p-4 opacity-10">
          <Award className="h-40 w-40" />
        </div>
        <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="bg-success-500/10 text-success-400 border-success-500/20 inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-bold tracking-widest uppercase">
              <Star className="fill-success-400 h-4 w-4" />
              {t("title")}
            </span>
          </div>

          <div className="relative mb-4 flex items-center justify-center">
            {/* Rotating neon gradient border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="from-brand-500 via-accent-400 to-success-400 absolute h-28 w-28 rounded-full bg-gradient-to-tr opacity-80 blur-[2px]"
            />
            <div className="border-bg-secondary bg-bg-tertiary relative z-10 h-24 w-24 overflow-hidden rounded-full border-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              {advocate.avatar_url ? (
                <Image
                  src={advocate.avatar_url}
                  alt={advocate.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-fg-muted flex h-full w-full items-center justify-center text-3xl font-black uppercase">
                  {advocate.name.slice(0, 2)}
                </div>
              )}
            </div>
            <div className="bg-brand-500 border-bg-elevated absolute right-0 bottom-0 z-20 rounded-full border-2 p-1.5 text-white shadow-lg">
              <Shield className="h-4 w-4" />
            </div>
          </div>

          <h3 className="text-fg-primary mb-1 text-2xl font-black">{advocate.name}</h3>
          <p className="text-success-400 mb-4 flex items-center gap-1 font-bold">
            <Zap className="h-4 w-4" />
            {advocate.reputation_score} {t("rep")}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {advocate.badges.slice(0, 3).map((badge, i) => (
              <span
                key={i}
                className="bg-bg-tertiary text-fg-secondary border-border-subtle inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium"
              >
                {badge}
              </span>
            ))}
            {advocate.badges.length === 0 && (
              <span className="bg-bg-tertiary text-fg-secondary border-border-subtle inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium">
                {t("pioneer")}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
