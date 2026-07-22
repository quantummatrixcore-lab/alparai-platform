// @vitest-environment jsdom
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/actions/auth", () => ({
  signInWithGoogle: vi.fn(),
  signInWithMagicLink: vi.fn(),
}));

const mockToast = vi.fn();
vi.mock("sonner", () => ({ toast: { error: (...args: unknown[]) => mockToast(...args) } }));

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignInForm", () => {
  test("renders Google sign-in button", async () => {
    const { SignInForm } = await import("@/components/auth/sign-in-form");
    render(<SignInForm locale="en" />);
    expect(screen.getByRole("button", { name: "signin_with_google" })).toBeDefined();
  });

  test("renders email magic link form", async () => {
    const { SignInForm } = await import("@/components/auth/sign-in-form");
    render(<SignInForm locale="en" />);
    expect(screen.getByLabelText("email_label")).toBeDefined();
  });

  test("google button is disabled when consent not checked", async () => {
    const { SignInForm } = await import("@/components/auth/sign-in-form");
    render(<SignInForm locale="en" />);
    const btn = screen.getByRole("button", { name: "signin_with_google" });
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  test("checkbox enables google sign-in button", async () => {
    const { SignInForm } = await import("@/components/auth/sign-in-form");
    render(<SignInForm locale="en" />);
    const checkbox = screen.getByRole("checkbox");
    checkbox.click();
    const btn = screen.getByRole("button", { name: "signin_with_google" });
    expect(btn.hasAttribute("disabled")).toBe(false);
  });

  test("renders terms and privacy links", async () => {
    const { SignInForm } = await import("@/components/auth/sign-in-form");
    render(<SignInForm locale="en" />);
    expect(screen.getByText("terms_service")).toBeDefined();
    expect(screen.getByText("terms_privacy")).toBeDefined();
  });
});
