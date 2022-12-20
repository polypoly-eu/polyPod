import {
    AD_INTERESTS_DATA_KEY,
    AD_INTERESTS_FILE_PATH,
} from "../../src/model/importers/ad-interests-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    numberOfInterests: 8,
};

export function wrapAdInterestsData(data) {
    return { [AD_INTERESTS_DATA_KEY]: data };
}

export function createAdInterestsDataset() {
    return wrapAdInterestsData([
        "Data",
        "Email",
        "Europe",
        "Facebook",
        "Games",
        "Image",
        "Software",
        "Website",
    ]);
}

export function zipFileWithAdInterests() {
    return createMockedZip([
        [AD_INTERESTS_FILE_PATH, createAdInterestsDataset()],
    ]);
}
