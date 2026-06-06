export interface CursorPage<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function encodeCursor(id: string, createdAt: string): string {
  return Buffer.from(JSON.stringify({ id, createdAt })).toString("base64url");
}

export function decodeCursor(cursor: string): { id: string; createdAt: string } | null {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf-8");
    const parsed: unknown = JSON.parse(decoded);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in parsed &&
      "createdAt" in parsed &&
      typeof (parsed as Record<string, unknown>).id === "string" &&
      typeof (parsed as Record<string, unknown>).createdAt === "string"
    ) {
      return parsed as { id: string; createdAt: string };
    }
    return null;
  } catch {
    return null;
  }
}
