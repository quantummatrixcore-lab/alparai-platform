import { vi } from "vitest";
import type { SessionUser } from "@/types";

export function createMockSupabaseClient() {
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockMaybeSingle = vi
    .fn()
    .mockResolvedValue({ data: null, error: null });

  const innerEq = vi.fn().mockReturnValue({
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
  });

  const outerEq = vi.fn().mockReturnValue({
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    eq: innerEq,
  });

  const mockSelect = vi.fn().mockReturnValue({
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    eq: outerEq,
  });

  const mockInsertSelectSingle = vi
    .fn()
    .mockResolvedValue({ data: null, error: null });
  const mockInsertSelect = vi.fn().mockReturnValue({
    single: mockInsertSelectSingle,
  });
  const mockInsert = vi.fn().mockReturnValue({
    select: mockInsertSelect,
    then: vi.fn().mockResolvedValue({ data: null, error: null }),
  });

  const mockUpdateEq = vi
    .fn()
    .mockResolvedValue({ data: null, error: null });
  const mockUpdate = vi.fn().mockReturnValue({
    eq: mockUpdateEq,
  });

  const mockDeleteInnerEq = vi
    .fn()
    .mockResolvedValue({ data: null, error: null });
  const mockDeleteEq = vi.fn().mockReturnValue({
    eq: mockDeleteInnerEq,
  });
  const mockDelete = vi.fn().mockReturnValue({
    eq: mockDeleteEq,
  });

  const mockUpsert = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi
        .fn()
        .mockResolvedValue({ data: null, error: null }),
    }),
  });

  return {
    from: vi.fn().mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      upsert: mockUpsert,
    }),
    auth: {
      getUser: vi
        .fn()
        .mockResolvedValue({ data: { user: null }, error: null }),
      signInWithOAuth: vi
        .fn()
        .mockResolvedValue({
          data: { url: "https://auth.example.com" },
          error: null,
        }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    _mocks: {
      mockSingle,
      mockMaybeSingle,
      mockSelect,
      mockInsert,
      mockInsertSelect,
      mockInsertSelectSingle,
      mockUpdate,
      mockUpdateEq,
      mockDelete,
      mockDeleteEq,
      mockDeleteInnerEq,
      mockUpsert,
      innerEq,
      outerEq,
    },
  };
}

export function createTestUser(
  overrides: Partial<SessionUser> = {}
): SessionUser {
  return {
    id: "test-user-id",
    email: "test@example.com",
    fullName: "Test User",
    avatarUrl: null,
    role: "user",
    isVerified: true,
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function createTestModerator(
  overrides: Partial<SessionUser> = {}
): SessionUser {
  return createTestUser({
    role: "moderator",
    fullName: "Test Moderator",
    ...overrides,
  });
}

export function createTestAdmin(
  overrides: Partial<SessionUser> = {}
): SessionUser {
  return createTestUser({
    role: "admin",
    fullName: "Test Admin",
    ...overrides,
  });
}
