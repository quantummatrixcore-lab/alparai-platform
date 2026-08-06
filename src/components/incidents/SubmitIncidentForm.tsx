"use client";

import { IncidentForm } from "./incident-form";
import type { AIProvider, AIModel } from "@/types";

export interface SubmitIncidentFormProps {
  providers: AIProvider[];
  models: AIModel[];
  isLoggedIn?: boolean;
  totalIncidents?: number;
}

export function SubmitIncidentForm(props: SubmitIncidentFormProps) {
  return <IncidentForm {...props} />;
}

export default SubmitIncidentForm;
