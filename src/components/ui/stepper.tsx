import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepperProps {
  steps: Array<{ label: string; description?: string }>;
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const status = index < currentStep ? "complete" : index === currentStep ? "current" : "upcoming";
          return (
            <li key={index} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                  status === "complete" && "bg-brand-500 text-white",
                  status === "current" && "border-2 border-brand-500 text-brand-400",
                  status === "upcoming" && "border border-border-subtle text-fg-muted"
                )}
                aria-current={status === "current" ? "step" : undefined}
              >
                {status === "complete" ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="hidden sm:block">
                <p className={cn(
                  "text-xs font-medium",
                  status === "current" ? "text-brand-400" : "text-fg-muted"
                )}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 sm:w-12 transition-colors duration-300",
                    index < currentStep ? "bg-brand-500" : "bg-border-subtle"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
