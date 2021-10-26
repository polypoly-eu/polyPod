import { toUnixTimestamp } from "../../src/model/importers/utils/timestamps";
import { wrapViewsData } from "./ad-views-data";

/**
 * This dataset considers 30 August 2021 as the date of the export.
 *
 * Company A
 *    - two sources: website and app
 *    - off facebook events first, on Facebook ads after
 *    - all events in August 2021 within a week.
 * Company B
 *    - first ad on Facebook, then off Facebook even in a few minutes
 *    - in 29 August 2021
 * Company C
 *    - first an off Facebook event, after a year ad on Facebook
 * Company D
 *    - ad on Facebook in June 2021,
 *    - afterwards off Facebook event in August 2021
 * Company E
 *    - an off and on Facebook event more than 90 days ago
 *
 * Company X - only on Facebook events in August 2021
 * Company Y - only off Facebook events in August 2021
 */
export function createOffFacebookEventsForComparisonData() {
    return {
        off_facebook_activity_v2: [
            // Company A
            {
                name: "companya.com",
                events: [
                    {
                        id: 127359960673129,
                        type: "VIEW_CONTENT",
                        timestamp: toUnixTimestamp(
                            "21 August 2021 16:55:00 GMT+00:00"
                        ),
                    },
                    {
                        id: 127359960673130,
                        type: "VIEW_CONTENT",
                        timestamp: toUnixTimestamp(
                            "23 August 2021 16:55:00 GMT+00:00"
                        ),
                    },
                ],
            },
            {
                name: "Company A",
                events: [
                    {
                        id: 137359960673131,
                        type: "APP_VIEW",
                        timestamp: toUnixTimestamp(
                            "22 August 2021 16:55:00 GMT+00:00"
                        ),
                    },
                ],
            },

            // Company B
            {
                name: "companyb.com",
                events: [
                    {
                        id: 127359960673140,
                        type: "VIEW_CONTENT",
                        timestamp: toUnixTimestamp(
                            "29 August 2021 16:55:00 GMT+00:00"
                        ),
                    },
                ],
            },

            // Company C
            {
                name: "companyc.com",
                events: [
                    {
                        id: 127359960673150,
                        type: "VIEW_CONTENT",
                        timestamp: toUnixTimestamp(
                            "10 June 2021 16:55:00 GMT+00:00"
                        ),
                    },
                ],
            },

            // Company D
            {
                name: "companyd.com",
                events: [
                    {
                        id: 127359960673160,
                        type: "VIEW_CONTENT",
                        timestamp: toUnixTimestamp(
                            "20 August 2021 16:55:00 GMT+00:00"
                        ),
                    },
                ],
            },

            // Company E
            {
                name: "companyE.com",
                events: [
                    {
                        id: 127359960672130,
                        type: "VIEW_CONTENT",
                        timestamp: toUnixTimestamp(
                            "20 August 2020 16:55:00 GMT+00:00"
                        ),
                    },
                ],
            },

            // Company Y
            {
                name: "companyy.com",
                events: [
                    {
                        id: 127359960673180,
                        type: "VIEW_CONTENT",
                        timestamp: toUnixTimestamp(
                            "21 August 2021 16:55:00 GMT+00:00"
                        ),
                    },
                ],
            },
        ],
    };
}

export function createAdViewsForComparisonData() {
    return wrapViewsData([
        {
            name: "Ads",
            description: "Ads you've recently viewed",
            entries: [
                // Company A
                {
                    timestamp: toUnixTimestamp(
                        "26 August 2021 16:55:00 GMT+00:00"
                    ),
                    data: {
                        name: "Ad by Company A",
                        uri: "https://www.facebook.com/companyasite/posts/4533456676765",
                    },
                },
                {
                    timestamp: toUnixTimestamp(
                        "27 August 2021 16:55:00 GMT+00:00"
                    ),
                    data: {
                        name: "Ad by Company A",
                        uri: "https://www.facebook.com/companyasite/posts/987654323456",
                    },
                },

                // Company B
                {
                    timestamp: toUnixTimestamp(
                        "29 August 2021 16:50:00 GMT+00:00"
                    ),
                    data: {
                        name: "Ad by Company B",
                        uri: "https://www.facebook.com/permalink.php?story_fbid=12345678889&id=99888776543223",
                    },
                },

                // Company C
                {
                    timestamp: toUnixTimestamp(
                        "15 August 2021 16:50:00 GMT+00:00"
                    ),
                    data: {
                        name: "Ad by Company C1",
                        uri: "https://www.facebook.com/companyc.org/posts/92827363727223",
                    },
                },

                // Company D
                {
                    timestamp: toUnixTimestamp(
                        "26 August 2021 16:50:00 GMT+00:00"
                    ),
                    data: {
                        name: "Ad by Company D",
                        uri: "https://www.facebook.com/companyd/posts/827272736366363",
                    },
                },

                // Company E
                {
                    timestamp: toUnixTimestamp(
                        "10 August 2020 16:50:00 GMT+00:00"
                    ),
                    data: {
                        name: "Ad by Company E",
                        uri: "https://www.facebook.com/companye/posts/79273645372",
                    },
                },

                // Company X
                {
                    timestamp: toUnixTimestamp(
                        "08 August 2021 16:50:00 GMT+00:00"
                    ),
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx/posts/827272736366363",
                    },
                },
            ],
        },
    ]);
}
