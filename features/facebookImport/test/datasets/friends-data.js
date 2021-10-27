import {
    FRIENDS_DATA_KEY,
    FRIENDS_FILE_PATH,
} from "../../src/model/importers/friends-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 5,
};

export function wrapFriendsData(data) {
    return { [FRIENDS_DATA_KEY]: data };
}

export function createFriendsDataset() {
    return wrapFriendsData([
        {
            name: "John Doe",
            timestamp: 1620186694,
        },
        {
            name: "Jane Doe",
            timestamp: 1598525926,
        },
        {
            name: "Test Name",
            timestamp: 1582622642,
        },
        {
            name: "Alice Döe",
            timestamp: 1627210660,
        },
        {
            name: "Donald Duck",
            timestamp: 1575962604,
        },
    ]);
}

export function zipFileWithFriends() {
    return createMockedZip([[FRIENDS_FILE_PATH, createFriendsDataset()]]);
}

export function zipFileWithFriendsAndExpectedValues() {
    return {
        zipFile: zipFileWithFriends(),
        expectedValues: DATASET_EXPECTED_VALUES,
    };
}
