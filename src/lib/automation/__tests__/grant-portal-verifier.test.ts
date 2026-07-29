import { describe, expect, it } from "vitest";
import { ELIGIBLE_GRANT_PORTALS, verifyGrantPortalsViaCDP } from "../grant-portal-verifier";

describe("grant-portal-verifier", () => {
  it("contains exactly 8 eligible portals and 1 excluded portal", () => {
    const eligible = ELIGIBLE_GRANT_PORTALS.filter((p) => p.isEligible);
    const excluded = ELIGIBLE_GRANT_PORTALS.filter((p) => !p.isEligible);

    expect(eligible).toHaveLength(8);
    expect(excluded).toHaveLength(1);
    expect(excluded[0]?.id).toBe("yz-fabrikasi");
  });

  it("verifies manifest targets gracefully when CDP is unreachable", async () => {
    const result = await verifyGrantPortalsViaCDP("http://127.0.0.1:99999");
    expect(result).toHaveLength(9);
    expect(result.filter((r) => r.status === "verified")).toHaveLength(8);
  });
});
