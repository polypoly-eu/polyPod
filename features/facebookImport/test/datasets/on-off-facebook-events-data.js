import { toUnixTimestamp } from "../../src/model/importers/utils/timestamps";

export function createMappedOnOffEventsData() {
    const aTimestamp = toUnixTimestamp("30 August 2021 16:55:00 GMT+00:00");
    return [
        {
            name: "Ernser LLC",
            onFacebookTimestamps: [aTimestamp, aTimestamp],
            offFacebookTimestamps: [aTimestamp, aTimestamp],
        },
        {
            name: "Ova-Cronin",
            onFacebookTimestamps: [
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
            ],
            offFacebookTimestamps: [],
        },
        {
            name: "Josephine-Davis",
            onFacebookTimestamps: [aTimestamp],
            offFacebookTimestamps: [aTimestamp],
        },
        {
            name: "Bailey Murphy and Stokes",
            onFacebookTimestamps: [aTimestamp],
            offFacebookTimestamps: [
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
            ],
        },
        {
            name: "Schaden LLC",
            onFacebookTimestamps: [
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
            ],
            offFacebookTimestamps: [
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
                aTimestamp,
            ],
        },
    ];
}
