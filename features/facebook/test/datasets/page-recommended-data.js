import {
    RECOMMENDED_PAGES_FILE_PATH,
    RECOMMENDED_PAGES_DATA_KEY,
} from "../../src/model/importers/pages-recommended-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 6,
};

export function wrapRecommendedPagesData(data) {
    return { [RECOMMENDED_PAGES_DATA_KEY]: data };
}

export function createRecommendedPagesDataset() {
    return wrapRecommendedPagesData([
        {
            name: "Company Two",
            timestamp: 1620186694,
            url: "https://www.facebook.com/companytwo/",
        },
        {
            name: "John Doe's Page",
            timestamp: 1598525926,
            url: "https://www.facebook.com/johndoespage/",
        },
        {
            name: "Some other Page",
            timestamp: 1582622642,
            url: "https://www.facebook.com/someotherpage/",
        },
        {
            name: "Another Company",
            timestamp: 1627210660,
            url: "https://www.facebook.com/anothercompany/",
        },
        {
            name: "Company Three",
            timestamp: 1627240660,
            url: "https://www.facebook.com/companythree/",
        },
        {
            name: "Company Four",
            timestamp: 1627240660,
            url: "https://www.facebook.com/companyfour/",
        },
    ]);
}

export function zipFileWithRecommendedPages() {
    return createMockedZip([
        [RECOMMENDED_PAGES_FILE_PATH, createRecommendedPagesDataset()],
    ]);
}

export function zipFileWithRecommendedPagesAndExpectedValues() {
    return {
        zipFile: zipFileWithRecommendedPages(),
        expectedValues: DATASET_EXPECTED_VALUES,
    };
}
