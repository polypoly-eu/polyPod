export default {
    ppid: "Signal",
    name: "Signal",
    featured: true,
    productOwner: ["Owner1", "Owner2", "Owner3"],
    activeUsers: {
        values: [
            {
                user_count: 410000,
                start_date: "2017-01-01",
                end_date: "2017-01-31",
                research_sources: [
                    {
                        dataset: "Reddit",
                        url:
                            "https://www.reddit.com/r/signal/comments/aa8hiz/how_many_users_does_signal_have/",
                        archive_url:
                            "https://web.archive.org/web/https://www.reddit.com/r/signal/comments/aa8hiz/how_many_users_does_signal_have/",
                        notes: "Start date from Wikipedia",
                    },
                ],
            },
            {
                user_count: 500000,
                start_date: "2019-12-01",
                end_date: "2019-12-31",
                research_sources: [
                    {
                        dataset: "BusinessofApps",
                        url:
                            "https://www.businessofapps.com/data/signal-statistics/",
                        archive_url:
                            "https://web.archive.org/web/20210408072301/https://www.businessofapps.com/data/signal-statistics/",
                        notes:
                            "They note Similarweb and TechCrunch as their sources",
                    },
                ],
            },
            {
                user_count: 3500000,
                start_date: "2020-07-01",
                end_date: "2020-07-31",
                research_sources: [
                    {
                        dataset: "BusinessofApps",
                        url:
                            "https://www.businessofapps.com/data/signal-statistics/",
                        archive_url:
                            "https://web.archive.org/web/20210408072301/https://www.businessofapps.com/data/signal-statistics/",
                        notes:
                            "They note Similarweb and TechCrunch as their sources",
                    },
                ],
            },
            {
                user_count: 20000000,
                start_date: "2020-12-01",
                end_date: "2020-12-31",
                research_sources: [
                    {
                        dataset: "BusinessofApps",
                        url:
                            "https://www.businessofapps.com/data/signal-statistics/",
                        archive_url:
                            "https://web.archive.org/web/20210408072301/https://www.businessofapps.com/data/signal-statistics/",
                        notes:
                            "They note Similarweb and TechCrunch as their sources",
                    },
                ],
            },
            {
                user_count: 40000000,
                start_date: "2021-01-01",
                end_date: "2021-01-31",
                research_sources: [
                    {
                        dataset: "BusinessofApps",
                        url:
                            "https://www.businessofapps.com/data/signal-statistics/",
                        archive_url:
                            "https://web.archive.org/web/20210408072301/https://www.businessofapps.com/data/signal-statistics/",
                        notes:
                            "They note Similarweb and TechCrunch as their sources",
                    },
                ],
            },
        ],
    },
    annualRevenues: [
        {
            stream: "Donation",
            amount: 50000000,
            currency: "USD",
            start_date: "2018-02-01",
            end_date: "2018-12-31",
            research_sources: [
                {
                    dataset: "Company Website",
                    url: "https://signalfoundation.org/",
                    archive_url:
                        "https://web.archive.org/web/20210428025938/https://signal.org/de/",
                    notes:
                        "Brian Acton, founder of WhatsApp and current Signal Foundation Board Member",
                },
            ],
        },
    ],
    dataRecipients: [
        "Giphy, Inc. (US)",
        "Signal Messenger LLC (US)",
        "Signal Technology Foundation (US)",
        "Spotify AB (SE)",
        "YouTube, LLC (US)",
        "dpv:ThirdParty (ZZ)",
    ],
    dataSharingPurposes: [
        {
            "dpv:Purpose": "dpv:CustomerCare",
            count: 8,
        },
        {
            "dpv:Purpose": "dpv:RegistrationAuthentication",
            count: 8,
        },
        {
            "dpv:Purpose": "dpv:ServiceOptimization",
            count: 8,
        },
        {
            "dpv:Purpose": "dpv:ServiceProvision",
            count: 48,
        },
        {
            "dpv:Purpose": "unspecified",
            count: 8,
        },
    ],
    dataTypesShared: [
        {
            "dpv:Category": "dpv:Communication",
            count: 12,
        },
        {
            "dpv:Category": "dpv:Contact",
            count: 16,
        },
        {
            "dpv:Category": "dpv:Identifying",
            count: 8,
        },
        {
            "dpv:Category": "dpv:Picture",
            count: 8,
        },
        {
            "dpv:Category": "dpv:ServiceConsumptionBehavior",
            count: 8,
        },
        {
            "dpv:Category": "dpv:SocialMediaCommunication",
            count: 8,
        },
        {
            "dpv:Category": "dpv:SocialNetwork",
            count: 4,
        },
        {
            "dpv:Category": "dpv:TelephoneNumber",
            count: 8,
        },
        {
            "dpv:Category": "dpv:Username",
            count: 8,
        },
    ],
    description: {
        value: null,
        source: null,
    },
    recipientInfo: {
        "Signal Messenger LLC (US)": {
            categories: {
                "dpv:Identifying": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:RegistrationAuthentication",
                    ],
                },
                "dpv:TelephoneNumber": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:RegistrationAuthentication",
                    ],
                },
                "dpv:Username": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:Picture": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:SocialMediaCommunication": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:Contact": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:ServiceOptimization",
                        "dpv:CustomerCare",
                    ],
                },
                "dpv:SocialNetwork": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:Communication": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:ServiceOptimization",
                        "dpv:CustomerCare",
                    ],
                },
            },
        },
        "Signal Technology Foundation (US)": {
            categories: {
                "dpv:Identifying": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:RegistrationAuthentication",
                    ],
                },
                "dpv:TelephoneNumber": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:RegistrationAuthentication",
                    ],
                },
                "dpv:Username": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:Picture": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:SocialMediaCommunication": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:Contact": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:ServiceOptimization",
                        "dpv:CustomerCare",
                    ],
                },
                "dpv:SocialNetwork": {
                    purposes: ["dpv:ServiceProvision"],
                },
                "dpv:Communication": {
                    purposes: [
                        "dpv:ServiceProvision",
                        "dpv:ServiceOptimization",
                        "dpv:CustomerCare",
                    ],
                },
            },
        },
        "Giphy, Inc. (US)": {
            categories: {
                "dpv:ServiceConsumptionBehavior": {
                    purposes: ["dpv:ServiceProvision"],
                },
            },
        },
        "YouTube, LLC (US)": {
            categories: {
                "dpv:ServiceConsumptionBehavior": {
                    purposes: ["dpv:ServiceProvision"],
                },
            },
        },
        "Spotify AB (SE)": {
            categories: {
                "dpv:ServiceConsumptionBehavior": {
                    purposes: ["dpv:ServiceProvision"],
                },
            },
        },
        "dpv:ThirdParty (ZZ)": {
            categories: {
                "dpv:ServiceConsumptionBehavior": {
                    purposes: ["dpv:ServiceProvision"],
                },
            },
        },
    },
    activities: [
        {
            activity_type: "Downloads",
            amount: 10000000,
            start_date: "2014-06-29",
            end_date: "2019-12-28",
            research_sources: [
                {
                    dataset: "BusinessofApps",
                    url:
                        "https://www.businessofapps.com/data/signal-statistics/",
                    archive_url:
                        "https://web.archive.org/web/20210408072301/https://www.businessofapps.com/data/signal-statistics/",
                    notes: "They note Similarweb and WSJ as their sources",
                },
            ],
        },
        {
            activity_type: "Downloads",
            amount: 22000000,
            start_date: "2019-12-28",
            end_date: "2020-07-28",
            research_sources: [
                {
                    dataset: "BusinessofApps",
                    url:
                        "https://www.businessofapps.com/data/signal-statistics/",
                    archive_url:
                        "https://web.archive.org/web/20210408072301/https://www.businessofapps.com/data/signal-statistics/",
                    notes: "They note Similarweb and WSJ as their sources",
                },
            ],
        },
        {
            activity_type: "Downloads",
            amount: 73000000,
            start_date: "2020-07-29",
            end_date: "2020-12-31",
            research_sources: [
                {
                    dataset: "BusinessofApps",
                    url:
                        "https://www.businessofapps.com/data/signal-statistics/",
                    archive_url:
                        "https://web.archive.org/web/20210408072301/https://www.businessofapps.com/data/signal-statistics/",
                    notes: "They note Similarweb and WSJ as their sources",
                },
            ],
        },
        {
            activity_type: "Ratings",
            amount: 1554197,
            start_date: "2014-06-28",
            end_date: "2021-05-07",
            research_sources: [
                {
                    dataset: "Google Play Store",
                    url:
                        "https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms",
                    archive_url:
                        "https://web.archive.org/web/20210506091350/https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms",
                    notes: null,
                },
            ],
        },
        {
            activity_type: "Android Installs",
            amount: 50000000,
            start_date: "2018-01-10",
            end_date: "2021-05-11",
            research_sources: [
                {
                    dataset: "Google PlayStore",
                    url:
                        "https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms",
                    archive_url:
                        "https://web.archive.org/web/20210510071639/https://play.google.com/store/apps/details?id=org.thoughtcrime.securesms",
                    notes: null,
                },
            ],
        },
    ],
    jurisdictionsShared: {
        children: ["Five-Eyes", "EU-GDPR", "Sonstige"],
    },
};
