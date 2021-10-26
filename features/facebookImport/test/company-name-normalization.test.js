import {
    normalizeForComparison,
    normalizeWithoutDomain,
} from "../src/model/analyses/utils/on-off-events-matching";

describe("Normalize for comparison", () => {
    it("removes spaces", () => {
        expect(normalizeForComparison(" com   pany X ")).toBe("companyx");
    });

    it("makes name lowercase", () => {
        expect(normalizeForComparison("ComPany X")).toBe("companyx");
    });

    it("does not modify correct name", () => {
        expect(normalizeForComparison("companyx")).toBe("companyx");
    });

    it("does not modify correct name with domain", () => {
        expect(normalizeForComparison("companyx.com")).toBe("companyx.com");
    });

    it("handles null", () => {
        expect(normalizeForComparison(null)).toBe(null);
    });
});

describe("Normalize Without Domain", () => {
    it("removes spaces", () => {
        expect(normalizeWithoutDomain("com pany x ")).toBe("companyx");
    });

    it("makes name lowercase", () => {
        expect(normalizeWithoutDomain("ComPany X")).toBe("companyx");
    });

    it("does not modify correct name", () => {
        expect(normalizeWithoutDomain("companyx")).toBe("companyx");
    });

    it("removes domain from URL", () => {
        expect(normalizeWithoutDomain("companyx.com")).toBe("companyx");
    });

    it("removes domain from URL with uppercase letters", () => {
        expect(normalizeWithoutDomain("CompanyX.com")).toBe("companyx");
    });

    // Right now we remove everyting after a dot.
    // TODO: Later on we could check for an explicit list of domains.
    it("removes domain from string", () => {
        expect(normalizeWithoutDomain("Company Inc. And Something Else")).toBe(
            "companyinc"
        );
    });

    it("handles null", () => {
        expect(normalizeWithoutDomain(null)).toBe(null);
    });
});
