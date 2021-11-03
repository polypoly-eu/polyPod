import ReceivedFriendRequestsImporter, {
    RECEIVED_FRIEND_REQUESTS_FILE_PATH,
    RECEIVED_FRIEND_REQUESTS_STORAGE_KEY,
} from "../../src/model/importers/friend-requests-received-importer";
import FriendsImporter, {
    FRIENDS_FILE_PATH,
    FRIENDS_STORAGE_KEY,
} from "../../src/model/importers/friends-importer";
import { zipFileWithReceivedFriendRequestsAndExpectedValues } from "../datasets/friend-requests-received-data";
import { zipFileWithFriendsAndExpectedValues } from "../datasets/friends-data";
import { defineEventImportersTestsForDatasets } from "./test-definition/importer-tests-definition";

const datasets = [
    [
        FriendsImporter.name,
        FriendsImporter,
        FRIENDS_FILE_PATH,
        FRIENDS_STORAGE_KEY,
        zipFileWithFriendsAndExpectedValues(),
    ],
    [
        ReceivedFriendRequestsImporter.name,
        ReceivedFriendRequestsImporter,
        RECEIVED_FRIEND_REQUESTS_FILE_PATH,
        RECEIVED_FRIEND_REQUESTS_STORAGE_KEY,
        zipFileWithReceivedFriendRequestsAndExpectedValues(),
    ],
];

defineEventImportersTestsForDatasets(datasets);
