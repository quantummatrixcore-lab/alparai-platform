import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="flex items-start gap-3">
        <div className="relative flex h-5 items-center">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined
            }
            className={cn(
              "peer h-5 w-5 shrink-0 cursor-pointer rounded border bg-bg-tertiary",
              "checked:bg-brand-500 checked:border-brand-500",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-bg-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "appearance-none transition-colors",
              "checked:bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpath d=%22M20 6L9 17l-5-5%22/%3e%3c/svg%3e')] checked:bg-center checked:bg-no-repeat checked:bg-[length:14px_14px]",
              error ? "border-danger-500" : "border-border-strong",
              className
            )}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex-1 space-y-0.5 leading-snug">
            {label && (
              <label
                htmlFor={inputId}
                className="block cursor-pointer text-sm font-medium text-fg-primary"
              >
                {label}
                {props.required && <span className="ml-0.5 text-danger-500">*</span>}
              </label>
            )}
            {description && (
              <p id={`${inputId}-desc`} className="text-xs text-fg-muted">
                {description}
              </p>
            )}
            {error && (
              <p id={`${inputId}-error`} className="text-xs text-danger-500" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
