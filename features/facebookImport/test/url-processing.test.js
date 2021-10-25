"use strict";

import { extractAccountDataFromUrl } from "../src/model/importers/utils/url-processing";

test("Extract account data from post url", () => {
    const url = "https://www.facebook.com/company/posts/425626372635363";
    const extractedData = {
        url: "https://www.facebook.com/company",
        urlId: "company",
    };
    expect(extractAccountDataFromUrl(url)).toStrictEqual(extractedData);
});

test("Extract account data permanent link url", () => {
    const url =
        "https://www.facebook.com/permalink.php?story_fbid=53426173t35&id=473333432442443";
    const extractedData = {
        url: "https://www.facebook.com/473333432442443",
        rawId: "473333432442443",
    };
    expect(extractAccountDataFromUrl(url)).toStrictEqual(extractedData);
});

test("Extract account data from photo url", () => {
    const url =
        "https://www.facebook.com/companyx/photos/a.11111222333444/999888777655/?type=3";
    const extractedData = {
        url: "https://www.facebook.com/companyx",
        urlId: "companyx",
    };
    expect(extractAccountDataFromUrl(url)).toStrictEqual(extractedData);
});

test("Extract account data from video url", () => {
    const url = "https://www.facebook.com/companyx/videos/11111222333444/";
    const extractedData = {
        url: "https://www.facebook.com/companyx",
        urlId: "companyx",
    };
    expect(extractAccountDataFromUrl(url)).toStrictEqual(extractedData);
});

test("Group urls are not supported", () => {
    const url =
        "https://www.facebook.com/groups/999888777655/permalink/11111222333444/";
    expect(extractAccountDataFromUrl(url)).toBe(null);
});

test("Urls for unknown data types not supported", () => {
    const url = "https://www.facebook.com/companyx/something/11111222333444/";
    expect(extractAccountDataFromUrl(url)).toBe(null);
});
