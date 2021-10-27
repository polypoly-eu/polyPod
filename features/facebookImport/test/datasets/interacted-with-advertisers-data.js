import {
    INTERACTED_WITH_ADVERTISERS_DATA_KEY,
    INTERACTED_WITH_ADVERTISERS_FILE_PATH,
} from "../../src/model/importers/interacted-with-advertisers-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalEventsCount: 5,
};

export function wrapInteractedWithAdvertisersData(data) {
    return { [INTERACTED_WITH_ADVERTISERS_DATA_KEY]: data };
}

export function createInteractedWithAdvertisersDataset() {
    return wrapInteractedWithAdvertisersData([
        {
            timestamp: 1515496616,
            action: "Clicked Ad",
            title: "Data Ad",
        },
        {
            timestamp: 1422904799,
            action: "Clicked Ad",
            title: "{{product.name}}",
        },
        {
            timestamp: 1583446120,
            action: "Clicked Ad",
            title: "Check Video",
        },
        {
            timestamp: 1485849018,
            action: "Clicked Ad",
            title: "Games",
        },
        {
            timestamp: 1546713419,
            action: "Clicked Ad",
            title: "Software Video",
        },
        {
            timestamp: 1614763329,
            action: "Closed Ad",
            title: "More Games",
        },
    ]);
}

export function zipFileWithInteractedWithAdvertisers() {
    return createMockedZip([
        [
            INTERACTED_WITH_ADVERTISERS_FILE_PATH,
            createInteractedWithAdvertisersDataset(),
        ],
    ]);
}
