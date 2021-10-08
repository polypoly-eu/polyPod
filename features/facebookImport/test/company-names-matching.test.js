import { onOffFacebookAccountNamesMatching } from "../src/model/analyses/utils/on-off-events-matching";

describe("Test matching names", () => {
    it("matches two equal company names", () => {
        expect(
            onOffFacebookAccountNamesMatching("Company X", "Company X")
        ).toBe(true);
    });

    it("matches two equal company names using lowercase", () => {
        expect(
            onOffFacebookAccountNamesMatching("Company X", "company x")
        ).toBe(true);
    });

    it("matches two equal company names ignoring spaces", () => {
        expect(
            onOffFacebookAccountNamesMatching("Com pany X", "C omp any X")
        ).toBe(true);
    });

    it("matches two equal company names with related account domain", () => {
        expect(
            onOffFacebookAccountNamesMatching("companyx.org", "Company X")
        ).toBe(true);
    });

    it("matches two equal company names with off-facebook company domain", () => {
        expect(
            onOffFacebookAccountNamesMatching("Company X", "companyX.org")
        ).toBe(true);
    });

    it("matches two equal company names with different domains", () => {
        expect(
            onOffFacebookAccountNamesMatching("companyx.com", "companyx.org")
        ).toBe(true);
    });

    it("does not match differeent nameY", () => {
        expect(
            onOffFacebookAccountNamesMatching("Company X", "Company Y")
        ).toBe(false);
    });
});
