import { RECENTLY_VIEWED_DATA_KEY } from "../../src/model/importers/recently-viewed-ads-importer";

export function wrapViewsData(data) {
    return { [RECENTLY_VIEWED_DATA_KEY]: data };
}

export const RECENTLY_VIEWED_LOCALE = {
    de: {
        watched: {
            categoryName: "Videos und Shows auf Facebook Watch",
            categoryDescription:
                "Videos und Shows, die du dir kürzlich auf Facebook Watch angesehen hast, und die Zeit, die du mit dem Ansehen verbracht hast.",
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
        watched: {
            categoryName: "Facebook Watch Videos and Shows",
            categoryDescription:
                "Videos and shows you've recently visited or viewed from Facebook Watch and time you've spent watching shows",
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
        watched: {
            categoryName: "Videoer og serier på Facebook Watch",
            categoryDescription:
                "Videoer og serier, du for nylig har besøgt eller set fra Facebook Watch, og den tid du har brugt på at se serier",
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

export function createAdViewsData(languageCode) {
    const languageData = RECENTLY_VIEWED_LOCALE[languageCode];
    return wrapViewsData([
        {
            name: languageData.watched.categoryName,
            description: languageData.watched.categoryDescription,
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
            name: languageData.watched.categoryName,
            description: languageData.watched.categoryDescription,
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
            name: languageData.watched.categoryName,
            description: languageData.watched.categoryDescription,
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
