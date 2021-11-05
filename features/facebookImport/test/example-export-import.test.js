//import pod from "@polypoly-eu/podjs/dist/pod.js";
import * as unusedPod from "@polypoly-eu/podjs/dist/pod.js";
import { DATA_IMPORTERS_COUNT, importData } from "../src/model/importer";
import Storage from "../src/model/storage";
import { ENCODED_ZIP_DATA } from "../src/static/example-data/facebook-gillianconnelly-2021-10-28-encoded";
import SUMMARY_DATA from "../src/static/example-data/facebook-gillianconnelly-summary-2021-10-28.json";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function arrayLengthComputation(property) {
    return (facebookAccount) => facebookAccount[property].length;
}

/**
 * Properties that can be directly computed using the length of the array
 */
const arrayLengthMatchingSpecifications = [
    ["likedPages", "recommendedPages", "followedPages", "unfollowedPages"],
    ["friends", "receivedFriendRequests"],
    ["searches"],
    ["adminRecords", "accountSessionActivities"],
    ["postReactions"], //, "posts"
    [("adInterests", "connectedAdvertisers", "interactedAdvertisers")],
]
    .flat()
    .reduce((specification, propertyName) => {
        const capitalizedName = capitalizeFirstLetter(propertyName);
        specification[`numberOf${capitalizedName}`] =
            arrayLengthComputation(propertyName);
        return specification;
    }, {});

const matchingSpecifications = arrayLengthMatchingSpecifications;

describe("Import ad views from export with missing ads category", () => {
    let facebookAccount = null;
    let expectedSummary = {};

    beforeAll(async () => {
        localStorage.clear();
        localStorage.setItem.mockClear();

        const storage = new Storage(window.pod);
        const { polyOut } = window.pod;
        const url =
            ENCODED_ZIP_DATA + "/" + "facebook-gillianconnelly-2021-10-28.zip";
        await polyOut.importArchive(url);

        for (const dataProperties of Object.values(SUMMARY_DATA)) {
            Object.assign(expectedSummary, dataProperties);
        }

        await storage.refreshFiles();
        const importedFile = storage.files[0];

        facebookAccount = await importData(importedFile);
    });

    it("has run all importers", () => {
        expect(facebookAccount.importingResults.length).toBe(
            DATA_IMPORTERS_COUNT
        );
    });

    //it("has success or missing file status for all importers", () => {
    //debugger;
    //facebookAccount.importingResults.forEach((importingResult) =>
    //    expect(importingResult.status).toBe(IMPORT_SUCCESS)
    //);
    //});

    it("has data matching the summary one", () => {
        // Only check for values in the summary that have a computation.
        const relevantSummaryPairs = Object.entries(expectedSummary).filter(
            ([propertyId]) => matchingSpecifications[propertyId]
        );

        for (const [propertyId, propertyValue] of relevantSummaryPairs) {
            const propertyComputation = matchingSpecifications[propertyId];
            const computedValue = propertyComputation(facebookAccount);
            expect(computedValue).toBe(propertyValue);
        }
    });
});
