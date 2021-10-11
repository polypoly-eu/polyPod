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

    it("matches two equal company names with sub domains", () => {
        expect(
            onOffFacebookAccountNamesMatching("companyx.co.uk", "companyx.com")
        ).toBe(true);
    });

    it("does not match different names", () => {
        expect(
            onOffFacebookAccountNamesMatching("Company X", "Company Y")
        ).toBe(false);
    });

    it("does not match different names with same domain", () => {
        expect(
            onOffFacebookAccountNamesMatching("companyx.com", "companyy.com")
        ).toBe(false);
    });
});

describe("Test account matching by name", () => {
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

    it("matches on-Facebook account by url without domain in name ", () => {
        expect(
            matchAccountsByName(
                {
                    displayName: "Company",
                    urlId: "companyx",
                },
                { name: "companyx.org" }
            )
        ).toBe(true);
    });

    it("matches on-Facebook account between name with domain and display name", () => {
        expect(
            matchAccountsByName(
                {
                    displayName: "Company X",
                    urlId: "companylocal",
                },
                { name: "companyx.org" }
            )
        ).toBe(true);
    });

    it("does not match companies with different names", () => {
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
