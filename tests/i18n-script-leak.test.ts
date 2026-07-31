import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("i18n script leak prevention", () => {
  const nonCyrillicLocales = ["en", "tr", "fr", "de"];

  it("should not contain Cyrillic characters in non-Russian locale files", () => {
    const cyrillicRegex = /[\u0400-\u04FF]/;
    const leakedKeys: string[] = [];

    for (const locale of nonCyrillicLocales) {
      const filePath = path.join(process.cwd(), "messages", `${locale}.json`);
      if (!fs.existsSync(filePath)) continue;

      const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const scanObject = (obj: Record<string, unknown>, prefix = "") => {
        for (const [key, value] of Object.entries(obj)) {
          const currentKey = prefix ? `${prefix}.${key}` : key;
          if (typeof value === "string") {
            if (cyrillicRegex.test(value)) {
              leakedKeys.push(`[${locale}] ${currentKey}: "${value}"`);
            }
          } else if (typeof value === "object" && value !== null) {
            scanObject(value as Record<string, unknown>, currentKey);
          }
        }
      };

      scanObject(content);
    }

    expect(leakedKeys).toEqual([]);
  });
});
