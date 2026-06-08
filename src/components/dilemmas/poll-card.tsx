"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const handleVote = async (voteType: "yes" | "no" | "unsure") => {
    if (!turnstileToken) {
      alert("Please complete the bot verification first.");
      return;
    }

    setIsVoting(true);
    // TODO: implement actual server action vote(poll.id, voteType, turnstileToken)
    console.log(`Voted ${voteType} with token ${turnstileToken}`);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));
    setIsVoting(false);
  };

  return (
    <Card
      variant="elevated"
      className="border-brand-500/20 hover:border-brand-500/40 flex flex-col transition-colors"
    >
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3 className="mb-3 text-xl font-bold">{poll.title}</h3>
          <p className="text-fg-secondary mb-6 text-sm">{poll.description}</p>
        </div>

        <div className="space-y-4">
          {/* Results bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-success-400">Yes {yesPercent}%</span>
              <span className="text-danger-400">No {noPercent}%</span>
            </div>
            <div className="bg-bg-tertiary flex h-2 w-full overflow-hidden rounded-full">
              <div className="bg-success-500 h-full" style={{ width: `${yesPercent}%` }} />
              <div className="bg-danger-500 h-full" style={{ width: `${noPercent}%` }} />
            </div>
            <div className="text-fg-muted text-right text-xs">{totalVotes} votes</div>
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
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!turnstileToken || isVoting}
              onClick={() => handleVote("yes")}
              className="text-success-400 border-success-400/30 hover:bg-success-400/10 w-full disabled:opacity-50"
            >
              Yes
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!turnstileToken || isVoting}
              onClick={() => handleVote("no")}
              className="text-danger-400 border-danger-400/30 hover:bg-danger-400/10 w-full disabled:opacity-50"
            >
              No
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!turnstileToken || isVoting}
              onClick={() => handleVote("unsure")}
              className="text-fg-muted w-full disabled:opacity-50"
            >
              Unsure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
