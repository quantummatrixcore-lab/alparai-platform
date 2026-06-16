// @vitest-environment jsdom
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import { useFormState } from "react-dom";
import { ProviderResponseForm } from "@/components/incidents/provider-response-form";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, options?: { defaultValue?: string }) => {
    if (key.startsWith("errors.")) {
      return options?.defaultValue || key;
    }
    return key;
  },
}));

// Mock react-dom useFormState and useFormStatus
vi.mock("react-dom", () => ({
  useFormState: vi.fn((fn, initial) => [initial, fn]),
  useFormStatus: vi.fn(() => ({ pending: false })),
}));

// Mock submitProviderResponse action
vi.mock("@/actions/provider-response", () => ({
  submitProviderResponse: vi.fn(),
}));

describe("ProviderResponseForm Component", () => {
  const defaultProps = {
    incidentId: "incident-123",
    token: "token-abc",
    providerName: "Acme AI Corp",
  };

  test("renders form inputs and static provider name info", () => {
    render(<ProviderResponseForm {...defaultProps} />);
    expect(screen.getByText("Acme AI Corp")).toBeDefined();
    expect(screen.getByLabelText("name_label", { exact: false })).toBeDefined();
    expect(screen.getByLabelText("role_label", { exact: false })).toBeDefined();
    expect(screen.getByLabelText("response_label", { exact: false })).toBeDefined();
    expect(screen.getByRole("button", { name: /submit/i })).toBeDefined();

    // Verify hidden fields
    const incidentIdInput = screen.getByDisplayValue("incident-123") as HTMLInputElement;
    const tokenInput = screen.getByDisplayValue("token-abc") as HTMLInputElement;
    expect(incidentIdInput.type).toBe("hidden");
    expect(tokenInput.type).toBe("hidden");
  });

  test("renders success card when state.ok is true", () => {
    vi.mocked(useFormState).mockImplementationOnce(() => [{ ok: true }, vi.fn()]);

    render(<ProviderResponseForm {...defaultProps} />);
    expect(screen.getByText("success_title")).toBeDefined();
    expect(screen.getByText("success_desc")).toBeDefined();
    expect(screen.queryByLabelText("name_label")).toBeNull();
  });

  test("renders error block when state.error is present", () => {
    vi.mocked(useFormState).mockImplementationOnce(() => [
      { ok: false, error: "invalid_token" },
      vi.fn(),
    ]);

    render(<ProviderResponseForm {...defaultProps} />);
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("invalid_token")).toBeDefined();
  });

  test("renders field errors", () => {
    vi.mocked(useFormState).mockImplementationOnce(() => [
      {
        ok: false,
        fieldErrors: {
          responderName: ["Name required"],
          responseText: ["Response too short"],
        },
      },
      vi.fn(),
    ]);

    render(<ProviderResponseForm {...defaultProps} />);
    expect(screen.getByText("Name required")).toBeDefined();
    expect(screen.getByText("Response too short")).toBeDefined();
  });
});
