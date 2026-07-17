"use client";

import { useTransition } from "react";
import { triggerExternalFetch } from "@/actions/ecosystem";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";

export function ManualFetchButton() {
  const [isPending, startTransition] = useTransition();

  const handleFetch = () => {
    startTransition(async () => {
      const result = await triggerExternalFetch();
      const toast = document.getElementById("fetch-toast");
      if (!toast) return;
      const msg = toast.querySelector("span");
      const icon = toast.querySelector(".fetch-icon");
      if (msg) msg.textContent = result.message;
      if (icon) {
        icon.innerHTML = result.success
          ? '<svg class="w-4 h-4 text-emerald-400" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/></svg>'
          : '<svg class="w-4 h-4 text-red-400" viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm37.66 130.34a8 8 0 0 1-11.32 11.32L128 139.31l-26.34 26.35a8 8 0 0 1-11.32-11.32L116.69 128l-26.35-26.34a8 8 0 0 1 11.32-11.32L128 116.69l26.34-26.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>';
      }
      toast.classList.remove("opacity-0", "-translate-y-4");
      toast.classList.add("opacity-100", "translate-y-0");
      setTimeout(() => {
        toast.classList.add("opacity-0", "-translate-y-4");
        toast.classList.remove("opacity-100", "translate-y-0");
      }, 5000);
    });
  };

  return (
    <>
      <button
        onClick={handleFetch}
        disabled={isPending}
        className="bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 border-brand-500/30 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition disabled:opacity-40"
      >
        <ArrowsClockwise
          weight="duotone"
          className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
        />
        {isPending ? "Fetching..." : "Fetch Now"}
      </button>
      <div
        id="fetch-toast"
        className="fixed right-6 bottom-6 z-50 flex -translate-y-4 items-center gap-3 rounded-xl border border-white/10 bg-gray-900/95 px-5 py-3 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-300"
      >
        <span className="fetch-icon"></span>
        <span className="text-sm font-medium text-white"></span>
      </div>
    </>
  );
}
