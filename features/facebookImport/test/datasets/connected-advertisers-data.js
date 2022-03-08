import {
    CONNECTED_ADVERTISERS_DATA_KEY,
    CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH,
} from "../../src/model/importers/connected-advertisers-importer";
import { createMockedZip } from "../utils/data-creation";
import { CONNECTED_ADVERTISERS_DATA_SPECIFICATION } from "./connected-advertisers-all-types-data";

export const DATASET_EXPECTED_VALUES = {
    numberOfConnectedAdvertisers: 10,
};

export function wrapConnectedAdvertisersData(data) {
    return {
        [CONNECTED_ADVERTISERS_DATA_KEY]: data.map((dataRow) => dataRow[0]),
    };
}

export function createConnectedAdvertisersDataset() {
    return wrapConnectedAdvertisersData(
        CONNECTED_ADVERTISERS_DATA_SPECIFICATION
    );
}

export function zipFileWithConnectedAdvertisers() {
    return createMockedZip([
        [
            CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH,
            createConnectedAdvertisersDataset(),
        ],
    ]);
}
