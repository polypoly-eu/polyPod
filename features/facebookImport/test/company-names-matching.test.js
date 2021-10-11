import {
    matchAccountsByName,
    onOffFacebookAccountNamesMatching,
} from "../src/model/analyses/utils/on-off-events-matching";

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

describe("Test accont matching by name", () => {
    it("matches two equal company names", () => {
        expect(
            matchAccountsByName(
                { displayName: "Company X" },
                { name: "Company X" }
            )
        ).toBe(true);
    });

    it("matches on-Facebook account by url id", () => {
        expect(
            matchAccountsByName(
                {
                    displayName: "Company NoX",
                    urlId: "companyx",
                },
                { name: "companyx" }
            )
        ).toBe(true);
    });

    it("matches on-Facebook account by url without domain ", () => {
        expect(
            matchAccountsByName(
                {
                    displayName: "Company",
                    urlId: "companyx.com",
                },
                { name: "companyx.org" }
            )
        ).toBe(true);
    });

    it("does not match companies with diffrent names", () => {
        expect(
            matchAccountsByName(
                {
                    displayName: "Company X",
                    urlId: "companyx",
                },
                { name: "Company Y" }
            )
        ).toBe(false);
    });
});
