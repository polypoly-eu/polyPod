import { RECENTLY_VIEWED_DATA_KEY } from "../../src/model/importers/recently-viewed-ads-importer";

export function wrapViewsData(data) {
    return { [RECENTLY_VIEWED_DATA_KEY]: data };
}

export const RECENTLY_VIEWED_LOCALE = {
    de: {
        video: {
            categoryName: "Gesehene Videos",
            categoryDescription:
                "Diese Videos hast du dir in den letzten 90 Tagen angesehen.",
        },
        post: {
            categoryName: "Beiträge, die dir im News Feed angezeigt wurden",
            categoryDescription:
                "Beiträge, die dir in den letzten 90 Tagen in deinem News Feed angezeigt wurden.",
        },
        ad: {
            categoryName: "Werbeanzeigen",
            categoryDescription:
                "Werbeanzeigen, die du dir kürzlich angesehen hast",
            namePrefix: "Werbeanzeige von ",
        },
    },
    en: {
        video: {
            categoryName: "Videos you have watched",
            categoryDescription: "Videos you have watched in the last 90 days.",
        },
        post: {
            categoryName: "Posts that have been shown to you in your News Feed",
            categoryDescription:
                "Posts that have been shown to you in your News Feed in the last 90 days.",
        },
        ad: {
            categoryName: "Ads",
            categoryDescription: "Ads you've recently viewed",
            namePrefix: "Ad by ",
        },
    },
    da_DK: {
        video: {
            categoryName: "Videoer, du har set",
            categoryDescription: "Videoer, du har set i de seneste 90 dage.",
        },
        post: {
            categoryName: "Opslag, som er blevet vist til dig i dine nyheder",
            categoryDescription:
                "Opslag, der er blevet vist til dig i dine nyheder inden for de eneste 90 dage.",
        },
        ad: {
            categoryName: "Annoncer",
            categoryDescription: "Annoncer, du har set for nylig",
            namePrefix: "Annonce af ",
        },
    },
};

export const AD_VIEWS_EXPECTED_DATA = {
    numberOfAds: 3,
    numberOfAdViews: 4,
    numberOfRelatedAccounts: 2,
};

export function createAdViewsData(languageCode) {
    const languageData = RECENTLY_VIEWED_LOCALE[languageCode];
    return wrapViewsData([
        {
            name: languageData.video.categoryName,
            description: languageData.video.categoryDescription,
            children: [],
        },
        {
            name: languageData.post.categoryName,
            description: languageData.post.categoryDescription,
            entries: [],
        },
        {
            name: languageData.ad.categoryName,
            description: languageData.ad.categoryDescription,
            entries: [
                {
                    timestamp: 1630875618,
                    data: {
                        name: languageData.ad.namePrefix + "Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1631975618,
                    data: {
                        name: languageData.ad.namePrefix + "Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/1112223344556677",
                    },
                },
                {
                    timestamp: 1671975618,
                    data: {
                        name: languageData.ad.namePrefix + "Company X",
                        uri: "https://www.facebook.com/companyx.com/posts/2233445566678",
                    },
                },
                {
                    timestamp: 1693455618,
                    data: {
                        name: languageData.ad.namePrefix + "Company Y",
                        uri: "https://www.facebook.com/permalink.php?story_fbid=12345678889&id=99888776543223",
                    },
                },
            ],
        },
    ]);
}

export function createEnglishAdViewsData() {
    return createAdViewsData("en");
}

export function createGermanAdViewsData() {
    return createAdViewsData("de");
}

export function createDanishAdViewsData() {
    return createAdViewsData("da_DK");
}

export function createIncompleteEnglishAdViewsData() {
    const languageData = RECENTLY_VIEWED_LOCALE["en"];
    return wrapViewsData([
        {
            name: languageData.ad.categoryName,
            description: languageData.ad.categoryDescription,
            entries: [
                {
                    //timestamp: 1630875618,
                    data: {
                        name: languageData.ad.namePrefix + "Company X",
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
                        name: languageData.ad.namePrefix + "Company X",
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

export function creatAdViewsWithCompanyWithUnicodeCharactersData() {
    const languageData = RECENTLY_VIEWED_LOCALE["en"];
    return wrapViewsData([
        {
            name: languageData.ad.categoryName,
            description: languageData.ad.categoryDescription,
            entries: [
                {
                    timestamp: 1631975618,
                    data: {
                        name: "Ad by å🦊ü",
                        uri: "https://www.facebook.com/ü🦊å/posts/1112223344556677",
                    },
                },
            ],
        },
    ]);
}

export function createEnglishDatasetWithMissingAdsCategory() {
    const languageData = RECENTLY_VIEWED_LOCALE["en"];
    return wrapViewsData([
        {
            name: languageData.video.categoryName,
            description: languageData.video.categoryDescription,
            children: [],
        },
        {
            name: languageData.post.categoryName,
            description: languageData.post.categoryDescription,
            entries: [],
        },
    ]);
}

export function createEnglishDatasetWithEmptyAdsCategory() {
    const languageData = RECENTLY_VIEWED_LOCALE["en"];
    return wrapViewsData([
        {
            name: languageData.video.categoryName,
            description: languageData.video.categoryDescription,
            children: [],
        },
        {
            name: languageData.post.categoryName,
            description: languageData.post.categoryDescription,
            entries: [],
        },
        {
            name: languageData.ad.categoryName,
            description: languageData.ad.categoryDescription,
            entries: [],
        },
    ]);
}
