import {
    FOLLOWED_PAGES_DATA_KEY,
    FOLLOWED_PAGES_FILE_PATH,
} from "../../src/model/importers/pages-followed-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 3,
};

export function wrapFollowedPagesData(data) {
    return { [FOLLOWED_PAGES_DATA_KEY]: data };
}

export function createFollowedPagesDataset() {
    return wrapFollowedPagesData([
        {
            timestamp: 1620186694,
            data: [
                {
                    name: "Company Ten",
                },
            ],
            title: "Company Ten",
        },
        {
            timestamp: 1598525926,
            data: [
                {
                    name: "Mary Doe's Page",
                },
            ],
            title: "Mary Doe's Page",
        },
        {
            timestamp: 1582622642,
            data: [
                {
                    name: "Jane&Joe Page",
                },
            ],
            title: "Jane&Joe Page",
        },
    ]);
}

export function zipFileWithFollowedPages() {
    return createMockedZip([
        [FOLLOWED_PAGES_FILE_PATH, createFollowedPagesDataset()],
    ]);
}

export function zipFileWithFollowedPagesAndExpectedValues() {
    return {
        zipFile: zipFileWithFollowedPages(),
        expectedValues: DATASET_EXPECTED_VALUES,
    };
}
