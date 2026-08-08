"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  title: string;
  description: React.ReactNode;
  date: string;
  icon?: React.ReactNode;
  media?: React.ReactNode;
}

export function ScrollytellingTimeline({
  events,
  className,
}: {
  events: TimelineEvent[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const eventElements = containerRef.current.querySelectorAll("[data-event-id]");
      const viewportHeight = window.innerHeight;

      let newActiveIndex = activeIndex;

      eventElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        // Trigger point is at 40% from the top of the viewport
        if (rect.top <= viewportHeight * 0.4 && rect.bottom >= viewportHeight * 0.4) {
          newActiveIndex = index;
        }
      });

      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  return (
    <div ref={containerRef} className={cn("relative mx-auto max-w-5xl", className)}>
      {/* Central Line */}
      <div className="bg-border-subtle absolute top-0 bottom-0 left-4 w-px md:left-1/2 md:-ml-px" />

      <div className="space-y-24 py-20">
        {events.map((event, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <div
              key={event.id}
              data-event-id={event.id}
              className={cn(
                "relative flex flex-col items-center md:flex-row",
                index % 2 === 0 ? "md:flex-row-reverse" : "",
              )}
            >
              {/* Content Box */}
              <div
                className={cn(
                  "w-full pl-12 md:w-1/2 md:px-12 md:pl-0",
                  index % 2 === 0 ? "md:text-left" : "md:text-right",
                )}
              >
                <div
                  className={cn(
                    "transition-all duration-700",
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-40",
                    isPast && !isActive && "opacity-20",
                  )}
                >
                  <span className="text-brand-400 mb-2 block text-xs font-bold tracking-widest uppercase">
                    {event.date}
                  </span>
                  <h3 className="text-fg-primary mb-4 text-2xl font-bold">{event.title}</h3>
                  <div className="text-fg-muted space-y-4 text-sm leading-relaxed">
                    {event.description}
                  </div>
                </div>
              </div>

              {/* Center Dot */}
              <div className="border-border-subtle bg-bg-surface absolute left-4 z-10 -ml-3 flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-500 md:left-1/2 md:-ml-[13px]">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-500",
                    isActive
                      ? "bg-brand-500 shadow-[0_0_10px_rgba(var(--brand-500),0.8)]"
                      : "bg-fg-muted/20",
                  )}
                />
              </div>

              {/* Media Space (Empty or occupied depending on design) */}
              <div
                className={cn(
                  "mt-8 w-full pl-12 md:mt-0 md:w-1/2 md:px-12 md:pl-0",
                  isActive ? "opacity-100" : "opacity-30",
                )}
              >
                {event.media && <div className="transition-all duration-700">{event.media}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
