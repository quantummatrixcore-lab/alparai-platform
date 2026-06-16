// @vitest-environment jsdom
import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { CookieBanner } from "@/components/legal/cookie-banner";

// Mock next-intl and routing Link
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("CookieBanner Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("shows banner when no consent is set", () => {
    render(<CookieBanner />);
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("cookieTitle")).toBeDefined();
  });

  test("does not show banner when consent is set", () => {
    localStorage.setItem("alpar_cookie_consent", JSON.stringify({ level: "all", at: Date.now() }));
    render(<CookieBanner />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("saves 'all' consent when accept button clicked", () => {
    render(<CookieBanner />);
    const acceptBtn = screen.getByText("cookieAccept");
    fireEvent.click(acceptBtn);

    const consent = JSON.parse(localStorage.getItem("alpar_cookie_consent") || "{}");
    expect(consent.level).toBe("all");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("saves 'essential' consent when decline button clicked", () => {
    render(<CookieBanner />);
    const essentialBtn = screen.getByText("cookieEssential");
    fireEvent.click(essentialBtn);

    const consent = JSON.parse(localStorage.getItem("alpar_cookie_consent") || "{}");
    expect(consent.level).toBe("essential");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("saves 'essential' consent when escape key pressed", () => {
    render(<CookieBanner />);
    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    const consent = JSON.parse(localStorage.getItem("alpar_cookie_consent") || "{}");
    expect(consent.level).toBe("essential");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
