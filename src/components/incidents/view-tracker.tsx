"use client";

import { useEffect } from "react";
import { incrementIncidentViews } from "@/actions/incidents";

export function ViewTracker({ incidentId }: { incidentId: string }) {
  useEffect(() => {
    let active = true;
    const track = async () => {
      try {
        if (active) {
          await incrementIncidentViews(incidentId);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to increment views:", err);
        }
      }
    };
    track();
    return () => {
      active = false;
    };
  }, [incidentId]);

  return null;
}
