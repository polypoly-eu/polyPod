export function wrapViewsData(data) {
    return { recently_viewed: data };
}

export function createEnglishAdViewsData() {
    return wrapViewsData([
        {
            name: "Facebook Watch Videos and Shows",
            description:
                "Videos and shows you've recently visited or viewed from Facebook Watch and time you've spent watching shows",
            children: [],
        },
        {
            name: "Posts that have been shown to you in your News Feed",
            description:
                "Posts that have been shown to you in your News Feed in the last 90 days.",
            entries: [],
        },
        {
            name: "Ads",
            description: "Ads you've recently viewed",
            entries: [
                {
                    timestamp: 1630875618,
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1631975618,
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1671975618,
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/2233445566678",
                    },
                },
                {
                    timestamp: 1693455618,
                    data: {
                        name: "Ad by Company Y",
                        uri: "https://www.facebook.com/permalink.php?story_fbid=12345678889&id=99888776543223",
                    },
                },
            ],
        },
    ]);
}

export function createGermanAdViewsData() {
    return wrapViewsData([
        {
            name: "Videos und Shows auf Facebook Watch",
            description:
                "Videos und Shows, die du dir k\u00c3\u00bcrzlich auf Facebook Watch angesehen hast, und die Zeit, die du mit dem Ansehen verbracht hast.",
            children: [],
        },
        {
            name: "Beitr\u00c3\u00a4ge, die dir im News Feed angezeigt wurden",
            description:
                "Beitr\u00c3\u00a4ge, die dir in den letzten 90 Tagen in deinem News Feed angezeigt wurden.",
            entries: [],
        },
        {
            name: "Werbeanzeigen",
            description:
                "Werbeanzeigen, die du dir k\u00c3\u00bcrzlich angesehen hast",
            entries: [
                {
                    timestamp: 1630875618,
                    data: {
                        name: "Werbeanzeige von Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
            ],
        },
    ]);
}

export function createIncompleteEnglishAdViewsData() {
    return wrapViewsData([
        {
            name: "Ads",
            description: "Ads you've recently viewed",
            entries: [
                {
                    //timestamp: 1630875618,
                    data: {
                        name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1631975618,
                    data: {
                        //name: "Ad by Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1671975618,
                    data: {
                        name: "Ad by Company X",
                        //uri: "https://www.facebook.com/companyx.com/posts/2233445566678",
                    },
                },
                {
                    timestamp: 1671975618,
                    data: {},
                },
                {
                    timestamp: 1693455618,
                },
            ],
        },
    ]);
}

export function createEnglishDatasetWithMissingAdsCategory() {
    return wrapViewsData([
        {
            name: "Facebook Watch Videos and Shows",
            description:
                "Videos and shows you've recently visited or viewed from Facebook Watch and time you've spent watching shows",
            children: [],
        },
        {
            name: "Posts that have been shown to you in your News Feed",
            description:
                "Posts that have been shown to you in your News Feed in the last 90 days.",
            entries: [],
        },
        {
            name: "Marketplace Items",
            description: "Items you've viewed in Marketplace",
            entries: [],
        },
    ]);
}
