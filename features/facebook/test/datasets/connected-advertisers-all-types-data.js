import {
    CONNECTED_ADVERTISERS_ALL_TYPES_DATA_KEY,
    CONNECTED_ADVERTISERS_ALL_TYPES_FILE_PATH,
} from "../../src/model/importers/connected-advertisers-all-types-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    numberOfConnectedAdvertisers: 10,
};

function createConnectedAdvertiserEntry(dataRow) {
    return {
        advertiser_name: dataRow[0],
        has_data_file_custom_audience: dataRow[1],
        has_remarketing_custom_audience: dataRow[2],
        has_in_person_store_visit: dataRow[3],
    };
}

export function wrapConnectedAdvertisersAllTypesData(data) {
    return {
        [CONNECTED_ADVERTISERS_ALL_TYPES_DATA_KEY]: data.map((dataRow) =>
            createConnectedAdvertiserEntry(dataRow)
        ),
    };
}

export const CONNECTED_ADVERTISERS_DATA_SPECIFICATION = [
    ["Jones Inc", true, false, false],
    ["Company One LLC", true, false, false],
    ["Moen Inc", true, false, false],
    ["Roob Group", false, true, false],
    ["MacGyver LLC", false, true, false],
    ["Krajcik Inc", false, true, false],
    ["Parker Inc", true, true, false],
    ["Website", true, true, false],
    ["Jane and John", false, false, true],
    ["Company Two Shop", true, true, true],
];

export function createConnectedAdvertisersAllTypesDataset() {
    return wrapConnectedAdvertisersAllTypesData(
        CONNECTED_ADVERTISERS_DATA_SPECIFICATION
    );
}

export function zipFileWithConnectedAdvertisersAllTypes() {
    return createMockedZip([
        [
            CONNECTED_ADVERTISERS_ALL_TYPES_FILE_PATH,
            createConnectedAdvertisersAllTypesDataset(),
        ],
    ]);
}
