import {
    UNFOLLOWED_PAGES_DATA_KEY,
    UNFOLLOWED_PAGES_FILE_PATH,
} from "../../src/model/importers/pages-unfollowed-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 2,
};

export function wrapUnfollowedPagesData(data) {
    return { [UNFOLLOWED_PAGES_DATA_KEY]: data };
}

export function createUnfollowedPagesDataset() {
    return wrapUnfollowedPagesData([
        {
            timestamp: 1620186694,
            data: [
                {
                    name: "Uninteresting Page",
                },
            ],
            title: "Uninteresting Page",
        },
        {
            timestamp: 1598525926,
            data: [
                {
                    name: "Company Ten",
                },
            ],
            title: "Company Ten",
        },
    ]);
}

export function zipFileWithUnfollowedPages() {
    return createMockedZip([
        [UNFOLLOWED_PAGES_FILE_PATH, createUnfollowedPagesDataset()],
    ]);
}

export function zipFileWithUnfollowedPagesAndExpectedValues() {
    return {
        zipFile: zipFileWithUnfollowedPages(),
        expectedValues: DATASET_EXPECTED_VALUES,
    };
}
