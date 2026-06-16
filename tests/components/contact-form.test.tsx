// @vitest-environment jsdom
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import { useFormState } from "react-dom";
import { ContactForm } from "@/components/marketing/contact-form";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock react-dom useFormState and useFormStatus
vi.mock("react-dom", () => ({
  useFormState: vi.fn((fn, initial) => [initial, fn]),
  useFormStatus: vi.fn(() => ({ pending: false })),
}));

// Mock submitContact action
vi.mock("@/actions/contact", () => ({
  submitContact: vi.fn(),
}));

describe("ContactForm Component", () => {
  test("renders form inputs correctly", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("name", { exact: false })).toBeDefined();
    expect(screen.getByLabelText("email", { exact: false })).toBeDefined();
    expect(screen.getByLabelText("category", { exact: false })).toBeDefined();
    expect(screen.getByLabelText("subject", { exact: false })).toBeDefined();
    expect(screen.getByLabelText("message", { exact: false })).toBeDefined();
    expect(screen.getByRole("button", { name: "submit" })).toBeDefined();
  });

  test("renders success state card when state.ok is true", () => {
    vi.mocked(useFormState).mockImplementationOnce(() => [{ ok: true }, vi.fn()]);

    render(<ContactForm />);
    expect(screen.getByText("sent_title")).toBeDefined();
    expect(screen.getByText("sent_desc")).toBeDefined();
    expect(screen.queryByLabelText("name")).toBeNull();
  });

  test("renders formError alert when state.formError is present", () => {
    vi.mocked(useFormState).mockImplementationOnce(() => [
      { ok: false, formError: "Invalid submission" },
      vi.fn(),
    ]);

    render(<ContactForm />);
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("Invalid submission")).toBeDefined();
  });

  test("renders fieldErrors under respective inputs", () => {
    vi.mocked(useFormState).mockImplementationOnce(() => [
      {
        ok: false,
        fieldErrors: {
          name: ["Name is too short"],
          email: ["Email is invalid"],
        },
      },
      vi.fn(),
    ]);

    render(<ContactForm />);
    expect(screen.getByText("Name is too short")).toBeDefined();
    expect(screen.getByText("Email is invalid")).toBeDefined();
  });
});
