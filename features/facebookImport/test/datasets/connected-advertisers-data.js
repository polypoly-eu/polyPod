import {
    CONNECTED_ADVERTISERS_DATA_KEY,
    CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH,
} from "../../src/model/importers/connected-advertisers-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    numberOfConnectedAdvertisers: 10,
};

export function wrapConnectedAdvertisersData(data) {
    return { [CONNECTED_ADVERTISERS_DATA_KEY]: data };
}

export function createConnectedAdvertisersDataset() {
    return wrapConnectedAdvertisersData([
        "Jones Inc",
        "Company One LLC",
        "Moen Inc",
        "Roob Group",
        "MacGyver LLC",
        "Krajcik Inc",
        "Parker Inc",
        "Website",
        "Jane and John",
        "Company Two Shop",
    ]);
}

export function zipFileWithConnectedAdvertisers() {
    return createMockedZip([
        [
            CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH,
            createConnectedAdvertisersDataset(),
        ],
    ]);
}
