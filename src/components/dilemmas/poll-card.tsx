"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitVote } from "@/actions/dilemmas";
import { toast } from "sonner";

export type Poll = {
  id: string;
  title: string;
  description: string;
  yes_count: number;
  no_count: number;
  unsure_count: number;
};

export function PollCard({ poll }: { poll: Poll }) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const totalVotes = poll.yes_count + poll.no_count + poll.unsure_count;
  const yesPercent = totalVotes > 0 ? Math.round((poll.yes_count / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((poll.no_count / totalVotes) * 100) : 0;
  const unsurePercent = totalVotes > 0 ? 100 - yesPercent - noPercent : 0;

  const handleVote = async (voteType: "yes" | "no" | "unsure") => {
    if (!turnstileToken) {
      toast.error("Lütfen önce bot doğrulamasını (Turnstile) tamamlayın.");
      return;
    }

    setIsVoting(true);
    const result = await submitVote(poll.id, voteType, turnstileToken);
    setIsVoting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      if (result.awardedBadge) {
        toast.success(`YENİ ROZET KAZANDINIZ! ${result.badgeIcon} ${result.awardedBadge}`, {
          description: "Profilinize eklendi. Topluluğun sesine katıldığınız için teşekkürler!",
          duration: 8000,
        });
      } else {
        toast.success("Oyunuz başarıyla kaydedildi!", {
          description: "Topluluğun sesine katıldığınız için teşekkürler.",
        });
      }
    }
  };

  return (
    <Card
      variant="elevated"
      className="border-brand-500/30 hover:border-brand-500/60 bg-bg-primary/50 flex flex-col shadow-2xl backdrop-blur-md transition-all duration-300"
    >
      <CardContent className="flex flex-1 flex-col p-8">
        <div className="flex-1 text-center">
          <div className="bg-brand-500/10 text-brand-400 border-brand-500/20 mb-4 inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
            Kritik Soru
          </div>
          <h3 className="text-fg-primary mb-4 text-2xl font-extrabold">{poll.title}</h3>
          <p className="text-fg-secondary mb-8 text-sm leading-relaxed">{poll.description}</p>
        </div>

        <div className="space-y-6">
          {/* Professional Graph Bar */}
          <div className="space-y-2">
            <div className="flex justify-between px-1 text-xs font-medium">
              <span className="text-success-400 font-bold tracking-wider uppercase">Evet</span>
              <span className="text-fg-muted font-bold tracking-wider uppercase">Kararsız</span>
              <span className="text-danger-400 font-bold tracking-wider uppercase">Hayır</span>
            </div>

            <div className="bg-bg-tertiary/40 relative flex h-8 w-full overflow-hidden rounded-md border border-white/5">
              <div
                className="bg-success-500/90 group relative flex h-full items-center justify-start px-2 transition-all duration-1000 ease-out"
                style={{ width: `${yesPercent}%` }}
              >
                {yesPercent > 5 && (
                  <span className="text-xs font-bold text-white/90 drop-shadow-md">
                    %{yesPercent}
                  </span>
                )}
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
              <div
                className="bg-fg-muted/40 group relative flex h-full items-center justify-center transition-all duration-1000 ease-out"
                style={{ width: `${unsurePercent}%` }}
              >
                {unsurePercent > 5 && (
                  <span className="text-xs font-bold text-white/80 drop-shadow-md">
                    %{unsurePercent}
                  </span>
                )}
              </div>
              <div
                className="bg-danger-500/90 group relative flex h-full items-center justify-end px-2 transition-all duration-1000 ease-out"
                style={{ width: `${noPercent}%` }}
              >
                {noPercent > 5 && (
                  <span className="text-xs font-bold text-white/90 drop-shadow-md">
                    %{noPercent}
                  </span>
                )}
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
            </div>
            <div className="text-fg-muted pt-1 text-center text-xs font-medium">
              Toplam {totalVotes.toLocaleString()} oy kullanıldı
            </div>
          </div>

          {/* Turnstile Widget */}
          <div className="flex justify-center pt-2">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={(token) => setTurnstileToken(token)}
              options={{
                theme: "dark",
                size: "compact",
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Button
              variant="outline"
              disabled={!turnstileToken || isVoting}
              onClick={() => handleVote("yes")}
              className="text-success-400 border-success-400/40 hover:bg-success-400/20 w-full font-bold transition-all disabled:opacity-40"
            >
              Evet
            </Button>
            <Button
              variant="outline"
              disabled={!turnstileToken || isVoting}
              onClick={() => handleVote("unsure")}
              className="text-fg-muted border-fg-muted/40 hover:bg-fg-muted/20 w-full font-bold transition-all disabled:opacity-40"
            >
              Kararsızım
            </Button>
            <Button
              variant="outline"
              disabled={!turnstileToken || isVoting}
              onClick={() => handleVote("no")}
              className="text-danger-400 border-danger-400/40 hover:bg-danger-400/20 w-full font-bold transition-all disabled:opacity-40"
            >
              Hayır
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
