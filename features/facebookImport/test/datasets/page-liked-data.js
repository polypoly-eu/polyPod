import {
    LIKED_PAGES_DATA_KEY,
    LIKED_PAGES_FILE_PATH,
} from "../../src/model/importers/pages-liked-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalLikedPagesCount: 4,
};

export function wrapFriendsData(data) {
    return { [LIKED_PAGES_DATA_KEY]: data };
}

export function createLikedPagesDataset() {
    return wrapFriendsData([
        {
            name: "Company One",
            timestamp: 1620186694,
        },
        {
            name: "Jane Doe's Page",
            timestamp: 1598525926,
        },
        {
            name: "Alice&Donald Page",
            timestamp: 1582622642,
        },
        {
            name: "Another Company",
            timestamp: 1627210660,
        },
    ]);
}

export function zipFileWithLikedPages() {
    return createMockedZip([
        [LIKED_PAGES_FILE_PATH, createLikedPagesDataset()],
    ]);
}
