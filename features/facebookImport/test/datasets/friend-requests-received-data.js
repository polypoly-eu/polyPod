import {
    RECEIVED_FRIEND_REQUESTS_DATA_KEY,
    RECEIVED_FRIEND_REQUESTS_FILE_PATH,
} from "../../src/model/importers/friend-requests-received-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 6,
};

export function wrapReceivedFriendRequestsData(data) {
    return { [RECEIVED_FRIEND_REQUESTS_DATA_KEY]: data };
}

export function createReceivedFriendRequestsDataset() {
    return wrapReceivedFriendRequestsData([
        {
            name: "Someone Doe",
            timestamp: 1620186694,
        },
        {
            name: "Johnny Doe",
            timestamp: 1598525926,
        },
        {
            name: "Another Name",
            timestamp: 1582622642,
        },
        {
            name: "Alice JOen",
            timestamp: 1627210660,
        },
        {
            name: "Donald Joe",
            timestamp: 1575962604,
        },
        {
            name: "Alfred Joe",
            timestamp: 1575362604,
        },
    ]);
}

export function zipFileWithReceivedFriendRequests() {
    return createMockedZip([
        [
            RECEIVED_FRIEND_REQUESTS_FILE_PATH,
            createReceivedFriendRequestsDataset(),
        ],
    ]);
}

export function zipFileWithReceivedFriendRequestsAndExpectedValues() {
    return {
        zipFile: zipFileWithReceivedFriendRequests(),
        expectedValues: DATASET_EXPECTED_VALUES,
    };
}
