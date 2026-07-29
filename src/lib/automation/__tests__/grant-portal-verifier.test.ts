import { describe, expect, it } from "vitest";
import { GRANT_PORTAL_CATALOG, verifyGrantPortalsViaCDP } from "../grant-portal-verifier";

describe("grant-portal-verifier", () => {
  it("contains exactly 8 eligible portals and 1 excluded portal in catalog", () => {
    const eligible = GRANT_PORTAL_CATALOG.filter((p) => p.isEligible);
    const excluded = GRANT_PORTAL_CATALOG.filter((p) => !p.isEligible);

    expect(eligible).toHaveLength(8);
    expect(excluded).toHaveLength(1);
    expect(excluded[0]?.id).toBe("yz-fabrikasi");
  });

  it("returns unreachable status for eligible portals when CDP port is unavailable", async () => {
    const result = await verifyGrantPortalsViaCDP("http://127.0.0.1:99999");
    expect(result).toHaveLength(9);

    const unreachable = result.filter((r) => r.status === "unreachable");
    const excluded = result.filter((r) => r.status === "excluded");

    expect(unreachable).toHaveLength(8);
    expect(excluded).toHaveLength(1);
  });
});
