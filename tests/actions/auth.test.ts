import { describe, it, expect, vi, beforeEach } from "vitest";
import "../helpers/setup";
import {
  createMockSupabaseClient,
  createTestUser,
} from "../helpers/supabase-mock";

const mockSupabase = createMockSupabaseClient();
const mockUser = createTestUser();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
  createServerClient: vi.fn().mockResolvedValue(mockSupabase),
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/utils/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ ok: true }),
  RATE_LIMIT_KEYS: {
    incident_submission: "ratelimit:incident_submission",
    suggestion_submission: "ratelimit:suggestion_submission",
    auth_signin: "ratelimit:auth_signin",
    api_general: "ratelimit:api_general",
  },
}));

vi.mock("@/lib/constants", () => ({
  APP_URL: "https://test.alparai.online",
  APP_NAME: "ALPAR AI",
}));

import {
  signInWithGoogle,
  signInWithMagicLink,
  getMe,
} from "@/actions/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/utils/rate-limit";

describe("signInWithGoogle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ ok: true });
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: { url: "https://accounts.google.com/o/oauth2/auth" },
      error: null,
    });
  });

  it("returns url on success", async () => {
    const result = await signInWithGoogle();
    expect(result.ok).toBe(true);
    expect(result.url).toContain("google");
  });

  it("uses custom next parameter", async () => {
    const result = await signInWithGoogle("/dashboard");
    expect(result.ok).toBe(true);
    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "google",
        options: expect.objectContaining({
          redirectTo: expect.stringContaining(
            encodeURIComponent("/dashboard")
          ),
        }),
      })
    );
  });

  it("returns error when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      ok: false,
      retryAfter: 60,
    });
    const result = await signInWithGoogle();
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Too many");
  });

  it("returns error when OAuth fails", async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: { url: null },
      error: { message: "OAuth provider error", status: 500 },
    });
    const result = await signInWithGoogle();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("OAuth provider error");
  });
});

describe("signInWithMagicLink", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.signInWithOtp.mockResolvedValue({ error: null });
  });

  it("returns success on valid email", async () => {
    const result = await signInWithMagicLink("user@example.com");
    expect(result.ok).toBe(true);
    expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: "user@example.com" })
    );
  });

  it("returns error when OTP fails", async () => {
    mockSupabase.auth.signInWithOtp.mockResolvedValueOnce({
      error: { message: "Rate limit exceeded" },
    });
    const result = await signInWithMagicLink("user@example.com");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Rate limit exceeded");
  });
});

describe("getMe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null user when not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);
    const result = await getMe();
    expect(result.ok).toBe(true);
    expect(result.user).toBeNull();
  });

  it("returns user data when authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(mockUser);
    const result = await getMe();
    expect(result.ok).toBe(true);
    expect(result.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      fullName: mockUser.fullName,
      avatarUrl: mockUser.avatarUrl,
      role: mockUser.role,
    });
  });
});
