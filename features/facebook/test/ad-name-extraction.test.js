"use strict";

import {
    AD_LOCALE,
    extractNameFromAdDescription,
} from "../src/model/importers/utils/ads-locale";

test("Extract company name using English locale", () => {
    expect(extractNameFromAdDescription("Ad by Company X", AD_LOCALE.en)).toBe(
        "Company X"
    );
});

test("Extract company name having punctuation using English locale", () => {
    expect(
        extractNameFromAdDescription(
            "Ad by Company, Part1, Part2 and Part3. Int",
            AD_LOCALE.en
        )
    ).toBe("Company, Part1, Part2 and Part3. Int");
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

test("Extract company name using Danish locale", () => {
    expect(
        extractNameFromAdDescription("Annonce af Company X", AD_LOCALE.da_DK)
    ).toBe("Company X");
});

test("Extract name using wrong locale", () => {
    expect(
        extractNameFromAdDescription("Werbeanzeige von Company X", AD_LOCALE.en)
    ).toBe("Werbeanzeige von Company X");
});
