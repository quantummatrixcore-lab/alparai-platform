import { describe, it, expect } from "vitest";
import en from "../../messages/en.json";
import tr from "../../messages/tr.json";
import de from "../../messages/de.json";
import fr from "../../messages/fr.json";

type Messages = Record<string, unknown>;

function flattenKeys(obj: Messages, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flattenKeys(value as Messages, path);
    }
    return [path];
  });
}

const locales: Record<string, Messages> = { en, tr, de, fr };

describe("i18n translation file parity", () => {
  const enKeys = flattenKeys(en);

  for (const [locale, messages] of Object.entries(locales)) {
    describe(`${locale}.json`, () => {
      const keys = flattenKeys(messages);

      it("has all keys present in en.json", () => {
        const isPublicLocaleOnly = locale === "de" || locale === "fr";
        const missing = enKeys.filter((k) => {
          if (isPublicLocaleOnly && (k.startsWith("admin.") || k.startsWith("autopilot.")))
            return false;
          return !keys.includes(k);
        });
        expect(missing).toEqual([]);
      });

      it("has no extra keys beyond en.json", () => {
        const extra = keys.filter((k) => !enKeys.includes(k));
        expect(extra).toEqual([]);
      });
    });
  }
});
