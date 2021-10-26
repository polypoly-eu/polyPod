import {
    SEARCHES_INTERESTS_DATA_KEY,
    SEARCHES_INTERESTS_FILE_PATH,
} from "../../src/model/importers/searches-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    numberOfSearches: 9,
};

export function wrapSearchesData(data) {
    return { [SEARCHES_INTERESTS_DATA_KEY]: data };
}

function createSearchEntry(timestamp, searchText) {
    return {
        timestamp: timestamp,
        attachments: [
            {
                data: [
                    {
                        text: `\\"${searchText}\\"`,
                    },
                ],
            },
        ],
        data: [
            {
                text: searchText,
            },
        ],
        title: "You searched Facebook",
    };
}

export function createSearchesDataset() {
    return wrapSearchesData([
        createSearchEntry(1575920346, "John Doe"),
        createSearchEntry(1580056390, "search term"),
        createSearchEntry(1581014255, "food"),
        createSearchEntry(1581849383, "videos"),
        createSearchEntry(1584477848, "Games"),
        createSearchEntry(1612826683, "email"),
        createSearchEntry(1618394482, "John Doe"),
        createSearchEntry(1618484653, "company one"),
        createSearchEntry(1619170533, "Games"),
    ]);
}

export function zipFileWithSearches() {
    return createMockedZip([
        [SEARCHES_INTERESTS_FILE_PATH, createSearchesDataset()],
    ]);
}
