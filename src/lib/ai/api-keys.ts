import { createAdminClient } from "@/lib/supabase/admin";

interface DbApiKeyResult {
  api_key: string;
}

export async function resolveApiKey(provider: string, envVar: string): Promise<string | null> {
  // 1. Try the primary env var
  if (process.env[envVar]) {
    return process.env[envVar]!;
  }

  // 2. Special fallbacks
  if (provider === "google") {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;
  }
  if (provider === "nvidia") {
    if (process.env.NVIDIA_API_KEY) return process.env.NVIDIA_API_KEY;
    if (process.env.NGC_API_KEY) return process.env.NGC_API_KEY;
  }
  if (provider === "openrouter" && process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }
  if (provider === "huggingface" && process.env.HF_API_KEY) {
    return process.env.HF_API_KEY;
  }
  if ((provider === "vertex" || provider === "google_vertex") && process.env.VERTEX_API_KEY) {
    return process.env.VERTEX_API_KEY;
  }

  // 3. Try to read from the public.api_keys table using admin client (bypasses RLS)
  try {
    const admin = createAdminClient();
    const dbProvider = provider === "vertex" ? "google_vertex" : provider;
    const { data } = await (
      admin as unknown as {
        from: (name: string) => {
          select: (cols: string) => {
            eq: (
              col: string,
              val: string,
            ) => {
              single: () => Promise<{ data: DbApiKeyResult | null; error: unknown }>;
            };
          };
        };
      }
    )
      .from("api_keys")
      .select("api_key")
      .eq("provider", dbProvider)
      .single();

    if (data && data.api_key) {
      return data.api_key;
    }
  } catch (_err) {
    // Database table might not exist yet, or other query error, ignore and fallback to env
  }

  return null;
}
