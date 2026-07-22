// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";
import { GoogleSignInButton, EmailMagicLinkForm } from "@/components/auth/auth-buttons";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/actions/auth", () => ({
  signInWithGoogle: vi.fn(),
  signInWithMagicLink: vi.fn(),
}));

const mockToast = vi.fn();
vi.mock("sonner", () => ({ toast: { error: (...args: unknown[]) => mockToast(...args) } }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GoogleSignInButton", () => {
  test("renders with translation key as text", () => {
    render(<GoogleSignInButton />);
    expect(screen.getByRole("button", { name: "signin_with_google" })).toBeDefined();
  });

  test("is disabled when disabled prop is true", () => {
    render(<GoogleSignInButton disabled />);
    const btn = screen.getByRole("button");
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  test("is enabled by default", () => {
    render(<GoogleSignInButton />);
    const btn = screen.getByRole("button");
    expect(btn.hasAttribute("disabled")).toBe(false);
  });
});

describe("EmailMagicLinkForm", () => {
  test("renders email input and send button", () => {
    render(<EmailMagicLinkForm />);
    expect(screen.getByLabelText("email_label")).toBeDefined();
    expect(screen.getByRole("button", { name: "send" })).toBeDefined();
  });

  test("shows validation error for invalid email", async () => {
    render(<EmailMagicLinkForm />);
    const input = screen.getByLabelText("email_label") as HTMLInputElement;
    input.value = "invalid-email";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    screen.getByRole("button", { name: "send" }).click();
    expect(await screen.findByRole("alert")).toBeDefined();
    expect(screen.getByText("invalid_email")).toBeDefined();
  });

  test("renders sent state after successful magic link send", async () => {
    const { signInWithMagicLink } = await import("@/actions/auth");
    vi.mocked(signInWithMagicLink).mockResolvedValueOnce({ ok: true });
    render(<EmailMagicLinkForm />);
    const input = screen.getByLabelText("email_label") as HTMLInputElement;
    input.value = "test@example.com";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    screen.getByRole("button", { name: "send" }).click();
    expect(await screen.findByText("magic_link_heading")).toBeDefined();
  });

  test("shows error toast when signInWithMagicLink fails", async () => {
    const { signInWithMagicLink } = await import("@/actions/auth");
    vi.mocked(signInWithMagicLink).mockResolvedValueOnce({ ok: false, error: "Server error" });
    render(<EmailMagicLinkForm />);
    const input = screen.getByLabelText("email_label") as HTMLInputElement;
    input.value = "test@example.com";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    screen.getByRole("button", { name: "send" }).click();
    expect(await screen.findByText("Server error")).toBeDefined();
  });
});
