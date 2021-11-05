//import pod from "@polypoly-eu/podjs/dist/pod.js";
import * as unusedPod from "@polypoly-eu/podjs/dist/pod.js";
import { DATA_IMPORTERS_COUNT, importData } from "../src/model/importer";
import Storage from "../src/model/storage";
//import { ENCODED_ZIP_DATA } from "../src/static/example-data/facebook-gillianconnelly-2021-10-28-encoded";
//import SUMMARY_DATA from "../src/static/example-data/facebook-gillianconnelly-summary-2021-10-28.json";

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
        const response = await fetch(
            "https://downloads.polypoly.coop/pod/facebook-fake-minniedavis-2021-11-5.zip"
        );

        const originalBuffer = await response.buffer();
        const blobNode = new Blob([new Uint8Array(originalBuffer)]);
        const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = async function () {
                const dataUrl = this.result;
                resolve(
                    dataUrl + "/" + "facebook-fake-minniedavis-2021-11-5.zip"
                );
            };
            reader.readAsDataURL(blobNode);
        });

        const storage = new Storage(window.pod);
        const { polyOut } = window.pod;

        await polyOut.importArchive(dataUrl);

        const summaryDataResponse = await fetch(
            "https://downloads.polypoly.coop/pod/facebook-fake-minniedavis-summary-2021-11-5.json"
        );
        const summaryData = await summaryDataResponse.json();
        for (const dataProperties of Object.values(summaryData)) {
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
        debugger;
        for (const [propertyId, propertyValue] of relevantSummaryPairs) {
            const propertyComputation = matchingSpecifications[propertyId];
            const computedValue = propertyComputation(facebookAccount);
            expect(computedValue).toBe(propertyValue);
        }
    });
});
