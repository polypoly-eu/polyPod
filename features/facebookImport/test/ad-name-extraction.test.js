import {
    AD_LOCALE,
    extractNameFromAdDescription,
} from "../src/model/importers/utils/ads-locale";

test("Extract company name using English locale", () => {
    expect(extractNameFromAdDescription("Ad by Company X", AD_LOCALE.en)).toBe(
        "Company X"
    );
});

test("Extract company when it is same as locale text", () => {
    expect(extractNameFromAdDescription("Ad by Ad by", AD_LOCALE.en)).toBe(
        "Ad by"
    );
});

test("Extract company name using German locale", () => {
    expect(
        extractNameFromAdDescription("Werbeanzeige von Company X", AD_LOCALE.de)
    ).toBe("Company X");
});

test("Extract name using wrong locale", () => {
    expect(
        extractNameFromAdDescription("Werbeanzeige von Company X", AD_LOCALE.en)
    ).toBe("Werbeanzeige von Company X");
});
