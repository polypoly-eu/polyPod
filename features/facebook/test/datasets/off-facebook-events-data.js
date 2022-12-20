import { OFF_FACEBOOK_EVENTS_FILE_PATH } from "../../src/model/importers/off-facebook-events-importer";
import { createMockedZip } from "../utils/data-creation";

export const DATASET_EXPECTED_VALUES = {
    totalCompaniesCount: 2,
    totalEventsCount: 5,
};

export function createOffFacebookEventsSimpleData() {
    return {
        off_facebook_activity_v2: [
            {
                name: "companyx.com",
                events: [
                    {
                        id: 127359960673129,
                        type: "VIEW_CONTENT",
                        timestamp: 1613919120,
                    },
                    {
                        id: 127359960673139,
                        type: "PURCHASE",
                        timestamp: 1623919120,
                    },
                    {
                        id: 127359960673140,
                        type: "PAGE_VIEW",
                        timestamp: 1633919120,
                    },
                ],
            },
            {
                name: "Company Y",
                events: [
                    {
                        id: 137359960673129,
                        type: "APP_VIEW",
                        timestamp: 1613919120,
                    },
                    {
                        id: 137359960673139,
                        type: "APP_VIEW",
                        timestamp: 1623919120,
                    },
                ],
            },
        ],
    };
}

export function zipFileWithOffFacebookEvents() {
    return createMockedZip([
        [OFF_FACEBOOK_EVENTS_FILE_PATH, createOffFacebookEventsSimpleData()],
    ]);
}
