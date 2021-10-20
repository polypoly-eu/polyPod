import { toUnixTimestamp } from "../../src/model/importers/utils/timestamps";

export function createMappedOnOffEventsData() {
    const aTimestamp = toUnixTimestamp("30 August 2021 16:55:00 GMT+00:00");
    return [
        {
            name: "Ernser LLC",
            onFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 16:56:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 16:57:00 GMT+00:00"),
            ],
            offFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 16:58:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 16:59:00 GMT+00:00"),
            ],
        },
        {
            name: "Ova-Cronin",
            onFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 17:00:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:01:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:02:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:03:00 GMT+00:00"),
            ],
            offFacebookTimestamps: [],
        },
        {
            name: "Josephine-Davis",
            onFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 17:05:00 GMT+00:00"),
            ],
            offFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 17:08:00 GMT+00:00"),
            ],
        },
        {
            name: "Bailey Murphy and Stokes",
            onFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 17:10:00 GMT+00:00"),
            ],
            offFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 17:12:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:13:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:15:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:16:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:37:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:38:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:39:00 GMT+00:00"),
            ],
        },
        {
            name: "Schaden LLC",
            onFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 17:41:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:42:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:43:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:44:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:45:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:46:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:47:00 GMT+00:00"),
            ],
            offFacebookTimestamps: [
                toUnixTimestamp("30 August 2021 17:51:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:52:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:53:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:54:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:55:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:56:00 GMT+00:00"),
                toUnixTimestamp("30 August 2021 17:57:00 GMT+00:00"),
            ],
        },
    ];
}
